import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, CheckCircle2, X, Sparkles, Command, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceCommandButtonProps {
  isPaused: boolean;
  togglePause: () => Promise<void> | void;
  setActiveTab: (tab: string) => void;
  activeTab: string;
  playSynthBeep: (type: 'success' | 'warn' | 'revenue' | 'click') => void;
  openPayout?: () => void;
  handleLogout?: () => void;
}

interface CommandItem {
  phrase: string;
  action: string;
  category: 'System' | 'Navigation' | 'Action';
  examples: string[];
}

export default function VoiceCommandButton({
  isPaused,
  togglePause,
  setActiveTab,
  activeTab,
  playSynthBeep,
  openPayout,
  handleLogout,
}: VoiceCommandButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastRecognizedCommand, setLastRecognizedCommand] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  const recognitionRef = useRef<any>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Text-To-Speech (Aura speaks back her responses out loud in French)
  const speakText = (text: string) => {
    if (isMuted) return;
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech to avoid overlay
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';

      const voices = window.speechSynthesis.getVoices();
      // Look for a high quality French voice first
      const preferredVoice = voices.find(
        (v) => v.lang.startsWith('fr') || v.lang.includes('FR')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      utterance.pitch = 1.15; // friendly interactive chatbot pitch
      utterance.rate = 1.05;  // smart, productive speed

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis mistake:', err);
    }
  };

  // Pre-load voices for speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      };
    }
  }, []);

  // Define supported commands for explanation and shortcuts
  const supportedCommands: CommandItem[] = [
    {
      phrase: 'Mettre en pause ou Arrêter',
      action: 'Met l\'automatisation en mode pause',
      category: 'System',
      examples: ['"Aura, pause"', '"Pause le système"', '"Stop"', '"Arrêter"'],
    },
    {
      phrase: 'Reprendre ou Démarrer',
      action: 'Relance le moteur d\'automatisation d\'Aura',
      category: 'System',
      examples: ['"Aura, reprendre"', '"Start"', '"Démarrer le système"', '"Play"'],
    },
    {
      phrase: 'Matrice de revenus',
      action: 'Affiche l\'onglet de monétisation passive',
      category: 'Navigation',
      examples: ['"Afficher les revenus"', '"Show revenue breakdown"', '"Monétisation"'],
    },
    {
      phrase: 'Commandement Flotte',
      action: 'Affiche l\'onglet de la flotte d\'agents IA',
      category: 'Navigation',
      examples: ['"Show agents"', '"Flotte d\'agents"', '"Cerveaux IA"'],
    },
    {
      phrase: 'Hub SEO Web',
      action: 'Ouvre l\'indexation de référencement Google',
      category: 'Navigation',
      examples: ['"Show content hub"', '"SEO"', '"Index d\'articles"'],
    },
    {
      phrase: 'Boutique Stripe',
      action: 'Affiche la simulation de vente checkout direct',
      category: 'Navigation',
      examples: ['"Boutique"', '"Stripe store"', '"Ventes"'],
    },
    {
      phrase: 'Microservices IA',
      action: 'Visualise l\'état des micro-API payantes',
      category: 'Navigation',
      examples: ['"Microservices"', '"Micro-api"', '"Hébergement"'],
    },
    {
      phrase: 'Centrale Elite Command',
      action: 'Affiche les 20 optimisations d\'architecture',
      category: 'Navigation',
      examples: ['"Tuning"', '"Centrale elite"', '"Elite commands"'],
    },
    {
      phrase: 'Auto-Finances',
      action: 'Vérifie la trésorerie et la conformité de taxe',
      category: 'Navigation',
      examples: ['"Finances"', '"Trésorerie"', '"Conformité fiscale"'],
    },
    {
      phrase: 'Les 4 Piliers Client',
      action: 'Affiche l\'entonnoir de prospection digitale',
      category: 'Navigation',
      examples: ['"Piliers"', '"Four pillars"', '"Acquisition client"'],
    },
  ];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage(
        "L'API Web Speech n'est pas supportée sur ce navigateur. Utilisez Chrome ou Safari."
      );
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false; // We want single-shot commands
    rec.interimResults = true; // Show preview as we talk
    rec.lang = 'fr-FR'; // Default lang is French, but matches English loan words

    rec.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setErrorMessage(null);
    };

    rec.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      setTranscript(final || interim);
    };

    rec.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        const customError = "Microphone bloqué par le navigateur. Veuillez autoriser l'accès au microphone, ou ouvrez l'application dans un onglet séparé (via l'URL ci-dessus) pour contourner les restrictions d'iframe.";
        setErrorMessage(customError);
        triggerToast(customError);
        setShowExplanation(true);
        speakText("Le microphone est bloqué. Veuillez autoriser l'accès au micro ou ouvrir l'application dans un nouvel onglet.");
      } else if (event.error !== 'no-speech') {
        setErrorMessage(`Erreur audio : ${event.error}`);
      }
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Handle final transcript matching and triggers
  useEffect(() => {
    if (!transcript || isListening) return;

    const tLower = transcript.toLowerCase().trim();

    // Trigger command validation
    processVoiceCommand(tLower);
  }, [transcript, isListening]);

  const processVoiceCommand = (commandText: string) => {
    if (!commandText) return;

    let recognized = false;
    let actionTriggered = '';

    // 1. Pause Commands
    if (
      commandText.includes('pause') ||
      commandText.includes('arrête') ||
      commandText.includes('arrete') ||
      commandText.includes('stop') ||
      commandText.includes('suspend')
    ) {
      if (!isPaused) {
        togglePause();
        playSynthBeep('warn');
        actionTriggered = 'Pause du système';
        recognized = true;
      } else {
        actionTriggered = 'Le système est déjà en pause';
        recognized = true;
      }
    }
    // 2. Play / Resume Commands
    else if (
      commandText.includes('reprend') ||
      commandText.includes('start') ||
      commandText.includes('lecture') ||
      commandText.includes('active') ||
      commandText.includes('play') ||
      commandText.includes('recommen') ||
      commandText.includes('démar') ||
      commandText.includes('demar')
    ) {
      if (isPaused) {
        togglePause();
        playSynthBeep('success');
        actionTriggered = 'Reprise de l\'automatisation';
        recognized = true;
      } else {
        actionTriggered = 'Le système tourne déjà à plein régime';
        recognized = true;
      }
    }
    // 3. Tab Navigation Commands
    else if (
      commandText.includes('revenue') ||
      commandText.includes('revenu') ||
      commandText.includes('monétisation') ||
      commandText.includes('monetisation') ||
      commandText.includes('monétaire')
    ) {
      setActiveTab('revenue');
      playSynthBeep('success');
      actionTriggered = 'Affichage de la Matrice de Revenus';
      recognized = true;
    } else if (
      commandText.includes('agent') ||
      commandText.includes('agents') ||
      commandText.includes('flotte') ||
      commandText.includes('cerveau') ||
      commandText.includes('cerveaux')
    ) {
      setActiveTab('agents');
      playSynthBeep('success');
      actionTriggered = 'Affichage de la Flotte d\'Agents';
      recognized = true;
    } else if (
      commandText.includes('seo') ||
      commandText.includes('content') ||
      commandText.includes('article') ||
      commandText.includes('blog') ||
      commandText.includes('web') ||
      commandText.includes('hub')
    ) {
      setActiveTab('content');
      playSynthBeep('success');
      actionTriggered = 'Affichage du Hub SEO Web';
      recognized = true;
    } else if (
      commandText.includes('store') ||
      commandText.includes('boutique') ||
      commandText.includes('stripe') ||
      commandText.includes('vente') ||
      commandText.includes('ventes')
    ) {
      setActiveTab('store');
      playSynthBeep('success');
      actionTriggered = 'Affichage de la Boutique Stripe';
      recognized = true;
    } else if (
      commandText.includes('microservice') ||
      commandText.includes('microservices') ||
      commandText.includes('api') ||
      commandText.includes('micro-api')
    ) {
      setActiveTab('microservices');
      playSynthBeep('success');
      actionTriggered = 'Affichage des Microservices IA';
      recognized = true;
    } else if (
      commandText.includes('config') ||
      commandText.includes('configuration') ||
      commandText.includes('autopilot') ||
      commandText.includes('pilote')
    ) {
      setActiveTab('config');
      playSynthBeep('success');
      actionTriggered = 'Affichage d\'Autopilot Config';
      recognized = true;
    } else if (
      commandText.includes('tuning') ||
      commandText.includes('centrale') ||
      commandText.includes('elite') ||
      commandText.includes('ajuste') ||
      commandText.includes('stabili')
    ) {
      setActiveTab('tuning');
      playSynthBeep('success');
      actionTriggered = 'Affichage de la Centrale Elite Command';
      recognized = true;
    } else if (
      commandText.includes('finance') ||
      commandText.includes('finances') ||
      commandText.includes('trésorerie') ||
      commandText.includes('tresorerie') ||
      commandText.includes('payout')
    ) {
      setActiveTab('autofinance');
      playSynthBeep('success');
      actionTriggered = 'Affichage de la Trésorerie Auto-Finances';
      recognized = true;
    } else if (
      commandText.includes('pilier') ||
      commandText.includes('piliers') ||
      commandText.includes('four pillars') ||
      commandText.includes('acquisition')
    ) {
      setActiveTab('fourpillars');
      playSynthBeep('success');
      actionTriggered = 'Affichage des 4 Piliers Client';
      recognized = true;
    }
    // 4. Custom actions
    else if (
      openPayout &&
      (commandText.includes('retrait') ||
        commandText.includes('likide') ||
        commandText.includes('liqueur') ||
        commandText.includes('liquide') ||
        commandText.includes('cash out'))
    ) {
      openPayout();
      playSynthBeep('success');
      actionTriggered = 'Bouton de confirmation de retrait cliqué !';
      recognized = true;
    } else if (
      handleLogout &&
      (commandText.includes('logout') ||
        commandText.includes('déconnecter') ||
        commandText.includes('deconnexion') ||
        commandText.includes('déconnexion'))
    ) {
      handleLogout();
      playSynthBeep('warn');
      actionTriggered = 'Session JWT déconnectée';
      recognized = true;
    }

    if (recognized) {
      setLastRecognizedCommand(actionTriggered);
      setCommandHistory((prev) => [
        `"${commandText}" -> ${actionTriggered}`,
        ...prev.slice(0, 4),
      ]);
      triggerToast(`Commande reconnue : ${actionTriggered}`);

      // Speak active vocal confirmation back in French
      let phraseToSpeak = '';
      if (actionTriggered.includes('Pause du système')) {
        phraseToSpeak = "J'ai mis l'automatisation d'Aura en pause.";
      } else if (actionTriggered.includes('déjà en pause')) {
        phraseToSpeak = "L'automatisation est déjà suspendue.";
      } else if (actionTriggered.includes('Reprise de')) {
        phraseToSpeak = "Le pilotage automatique redémarre à l'instant.";
      } else if (actionTriggered.includes('déjà à plein régime')) {
        phraseToSpeak = "Le système automatique tourne déjà à plein régime.";
      } else if (actionTriggered.includes('Revenus')) {
        phraseToSpeak = "Voici la matrice de vos revenus passifs.";
      } else if (actionTriggered.includes('Agents')) {
        phraseToSpeak = "Voici le portail de commande de vos agents d'intelligence artificielle.";
      } else if (actionTriggered.includes('SEO')) {
        phraseToSpeak = "J'affiche à l'écran l'index de contenu des articles à haut rendement.";
      } else if (actionTriggered.includes('Stripe')) {
        phraseToSpeak = "Ouverture de votre boutique de simulation de ventes Stripe.";
      } else if (actionTriggered.includes('Microservices')) {
        phraseToSpeak = "Voici la console d'hébergement des micro-applications payantes.";
      } else if (actionTriggered.includes('Autopilot')) {
        phraseToSpeak = "Accès à la console de pilotage automatique d'Aura.";
      } else if (actionTriggered.includes('Centrale Elite')) {
        phraseToSpeak = "Ouverture de la centrale de commande Elite.";
      } else if (actionTriggered.includes('Trésorerie')) {
        phraseToSpeak = "Affichage de votre tableau de trésorerie financière et conformité fiscale.";
      } else if (actionTriggered.includes('Piliers')) {
        phraseToSpeak = "Voici l'état des quatre piliers d'acquisition automatique.";
      } else if (actionTriggered.includes('retrait')) {
        phraseToSpeak = "Entendu, demande de virement de trésorerie initialisée avec succès.";
      } else if (actionTriggered.includes('déconnectée')) {
        phraseToSpeak = "Fermeture sécurisée de la session en cours.";
      } else {
        phraseToSpeak = `Commande exécutée : ${actionTriggered}`;
      }
      speakText(phraseToSpeak);
    } else {
      playSynthBeep('warn');
      triggerToast(`Commande non reconnue : "${commandText}"`);
      speakText(`Désolé, je n'ai pas compris l'instruction : ${commandText}`);
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 4500);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      triggerToast('Erreur : Reconnaissance vocale indisponible.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      playSynthBeep('click');
    } else {
      try {
        recognitionRef.current.start();
        playSynthBeep('click');
      } catch (e) {
        console.warn('Recognition start exception fallback:', e);
        recognitionRef.current.abort();
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (_) {}
        }, 120);
      }
    }
  };

  return (
    <div className="relative flex items-center">
      {/* Dynamic Toast Feedback Overlay */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[100] max-w-sm bg-neutral-950/95 border border-zinc-800 text-slate-100 p-4 rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.8)] backdrop-blur-xl flex items-start gap-3"
          >
            <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 mt-0.5">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase font-semibold block mb-0.5">
                Aura Commande Vocale
              </span>
              <p className="text-xs text-slate-200 mt-1">{toastMessage}</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-zinc-500 hover:text-white p-1 hover:bg-zinc-900 rounded-md transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-1.5 bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg p-1.5">
        {/* Help button explanation of command voice patterns */}
        <button
          onClick={() => {
            playSynthBeep('click');
            setShowExplanation(!showExplanation);
          }}
          title="Guide des commandes vocales d'Aura"
          className={`p-1.5 rounded transition ${
            showExplanation ? 'bg-zinc-800 text-cyan-400' : 'text-zinc-500 hover:text-slate-300'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>

        {/* Aura Speaker Voice feedback Mute/Unmute toggle */}
        <button
          onClick={() => {
            const nextMuted = !isMuted;
            setIsMuted(nextMuted);
            playSynthBeep('click');
            if (!nextMuted) {
              setTimeout(() => speakText("Retour de la voix d'Aura active."), 150);
            }
          }}
          title={isMuted ? "Activer la voix d'Aura (Sourd)" : "Couper la voix d'Aura (Parle)"}
          className={`p-1.5 rounded transition ${
            isMuted ? 'text-rose-500/80 hover:text-rose-400' : 'text-emerald-500 hover:text-emerald-400'
          }`}
        >
          {isMuted ? (
            <div className="relative">
              <Volume2 className="w-3.5 h-3.5 opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="block w-4 h-[1px] bg-rose-500 rotate-45 transform origin-center"></span>
              </div>
            </div>
          ) : (
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
          )}
        </button>

        {/* Master Active Microphone click listener */}
        <button
          onClick={toggleListening}
          title={isListening ? "Écoute active... Cliquez pour stopper" : "Activer la commande vocale d'Aura"}
          className={`px-3 py-1.5 rounded-md border flex items-center gap-2 transition-all relative ${
            isListening
              ? 'bg-red-950/40 border-red-700 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
              : 'bg-zinc-950 border-zinc-800 text-cyan-400 hover:bg-zinc-900 hover:border-zinc-700'
          }`}
        >
          {isListening ? (
            <>
              {/* Pulsing visual red microphone */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <Mic className="w-3.5 h-3.5 fill-current animate-pulse text-red-500" />
              <span className="text-[9px] font-black uppercase tracking-widest font-mono">
                Écoute...
              </span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[9px] font-bold uppercase tracking-widest font-mono text-zinc-300 hidden md:inline">
                Aura Voix
              </span>
            </>
          )}
        </button>
      </div>

      {/* Embedded Floating Instructions Popover */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-11 z-50 w-80 bg-neutral-950 border border-zinc-800 p-4 rounded-xl shadow-2xl backdrop-blur-xl animate-fade-in font-sans leading-relaxed"
          >
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-3">
              <span className="text-xs font-bold font-mono tracking-wide text-white uppercase flex items-center gap-1.5">
                <Command className="w-3.5 h-3.5 text-cyan-400" /> Piloter Aura par la Voix
              </span>
              <button
                onClick={() => setShowExplanation(false)}
                className="text-zinc-500 hover:text-white p-1 hover:bg-zinc-900 rounded transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {errorMessage ? (
              <p className="text-[11px] text-amber-500 font-mono italic mb-2">{errorMessage}</p>
            ) : (
              <p className="text-[10px] text-slate-400 mb-3">
                Cliquez sur le microphone et énoncez vos instructions à haute voix. Le système bascule automatiquement vers les vues ou change d'état.
              </p>
            )}

            {/* Listening Live Transcript */}
            {isListening && (
              <div className="mb-3 p-2 bg-zinc-950 border border-red-950 rounded-lg animate-pulse">
                <span className="text-[9px] text-red-500 font-mono font-semibold uppercase block mb-1">
                  Transcription en direct :
                </span>
                <p className="text-[11px] text-slate-100 italic">
                  {transcript || '"Parlez maintenant..."'}
                </p>
              </div>
            )}

            {/* Supported Commands quick manual clicking triggers */}
            <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-thin pr-1">
              <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block font-semibold">
                Formules supportées (Français & Anglais) :
              </span>
              {supportedCommands.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    playSynthBeep('click');
                    // Extract first example to run command as shortcut click
                    const sample = item.examples[0].replace(/"/g, '');
                    setTranscript(sample);
                    processVoiceCommand(sample);
                  }}
                  className="p-1.5 bg-[#0a0a0a] hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-lg cursor-pointer transition text-left"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-slate-200 font-semibold">{item.phrase}</span>
                    <span className="text-[8px] text-cyan-400 font-mono bg-cyan-950/40 px-1 py-0.2 rounded border border-cyan-900">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[9px] text-zinc-500 font-sans leading-tight">
                    {item.action}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.examples.slice(0, 2).map((ex, idx) => (
                      <span
                        key={idx}
                        className="text-[8px] font-mono text-zinc-500 bg-zinc-950 px-1 rounded"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Previous Session Voice Logs */}
            {commandHistory.length > 0 && (
              <div className="mt-3 pt-2.5 border-t border-zinc-900">
                <span className="text-[9px] text-zinc-500 font-mono uppercase block font-semibold mb-1">
                  Historique récent de session :
                </span>
                <div className="space-y-1 font-mono text-[9px] text-slate-400">
                  {commandHistory.map((hist, ind) => (
                    <div key={ind} className="flex items-start gap-1 p-1 bg-zinc-950/60 rounded border border-zinc-900/40">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="truncate">{hist}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
