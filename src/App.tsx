import React, { useState, useEffect } from 'react';
import { PlatformState, PlatformConfig } from './types';
import { apiFetch } from './utils';
import MetricCard from './components/MetricCard';
import AgentTab from './components/AgentTab';
import ContentHub from './components/ContentHub';
import ProductStore from './components/ProductStore';
import MicroservicesTab from './components/MicroservicesTab';
import EliteTuningTab from './components/EliteTuningTab';
import AutoFinanceTab from './components/AutoFinanceTab';
import FourPillarsTab from './components/FourPillarsTab';
import AuraAdminAgent from './components/AuraAdminAgent';
import SwissArmyFlowchart from './components/SwissArmyFlowchart';
import VoiceCommandButton from './components/VoiceCommandButton';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner, { PageLoader } from './components/LoadingSpinner';

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  window.speechSynthesis.getVoices();
}

import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Settings,
  Shield,
  PlusCircle,
  HelpCircle,
  Cpu,
  Layers,
  Wifi,
  Sparkles,
  BookOpen,
  ShoppingBag,
  Sliders,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  Zap,
  Lock,
  Compass,
  Wallet,
  LogOut,
  Info,
  Power,
  Play,
  Pause
} from 'lucide-react';

export default function App() {
  const [state, setState] = useState<PlatformState | null>(null);
  const [activeTab, setActiveTab] = useState<string>('revenue'); // revenue, agents, content, store, config
  const [isLiveSyncActive, setIsLiveSyncActive] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!(window as any).aura_auth_token);
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword }),
      });
      if (res.ok) {
        const data = await res.json();
        (window as any).aura_auth_token = data.token;
        setIsAuthenticated(true);
        
        // Trigger voice greeting
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
           fetch('/api/aura-admin/greeting', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${data.token}`
             }
           }).then(r => r.json()).then(greetingData => {
              if (greetingData && greetingData.greeting) {
                let speechText = greetingData.greeting;
                speechText = speechText.replace(/[\*\_\[\]]/g, "");
                const utterance = new SpeechSynthesisUtterance(speechText);
                utterance.lang = 'fr-FR';
                utterance.rate = 1.0;
                utterance.pitch = 1.1;
                const voices = window.speechSynthesis.getVoices();
                const frVoice = voices.find(v => v.lang.startsWith('fr') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('google'))) || voices.find(v => v.lang.startsWith('fr'));
                if (frVoice) {
                   utterance.voice = frVoice;
                }
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(utterance);
              }
           }).catch(err => console.error("Could not fetch greeting", err));
        }
      } else {
        const data = await res.json();
        setLoginError(data.error || "Mot de passe incorrect.");
      }
    } catch (err) {
      setLoginError("Erreur de communication réseau.");
    }
  };

  const handleLogout = () => {
    (window as any).aura_auth_token = undefined;
    setIsAuthenticated(false);
    setState(null);
  };

  const togglePause = async () => {
    playSynthBeep('click');
    try {
      const res = await apiFetch('/api/toggle-pause', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setState(data.state);
        playSynthBeep(data.state.isPaused ? 'warn' : 'success');
      }
    } catch (err) {
      console.error("Toggle pause failed:", err);
    }
  };
  const [checkoutNotification, setCheckoutNotification] = useState<string | null>(null);

  // Settings form state
  const [niche, setNiche] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [adsensePubId, setAdsensePubId] = useState<string>('');
  const [amazonAffiliateTag, setAmazonAffiliateTag] = useState<string>('');
  const [youtubeChannelId, setYoutubeChannelId] = useState<string>('');
  const [youtubeApiKey, setYoutubeApiKey] = useState<string>('');
  const [googleCloudProjectId, setGoogleCloudProjectId] = useState<string>('');
  const [amazonAccessKeyId, setAmazonAccessKeyId] = useState<string>('');
  const [amazonSecretKey, setAmazonSecretKey] = useState<string>('');
  const [autoPilotEnabled, setAutoPilotEnabled] = useState<boolean>(true);
  const [generationTone, setGenerationTone] = useState<string>('');
  const [generationDensity, setGenerationDensity] = useState<string>('Standard (5 articles/jour)');
  const [targetAudience, setTargetAudience] = useState<string>('Tout public');
  const [minCommission, setMinCommission] = useState<number>(15);
  const [autoHealEnabled, setAutoHealEnabled] = useState<boolean>(true);
  const [edgeCacheEnabled, setEdgeCacheEnabled] = useState<boolean>(true);
  const [modelType, setModelType] = useState<string>('gemini-3.5-flash');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['Amazon Associates', 'Stripe Checkout']);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<string | null>(null);

  const validateConfig = async () => {
    setValidationResult("Validation en cours...");
    try {
      const res = await apiFetch('/api/settings/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adsensePubId, amazonAffiliateTag }),
      });
      const data = await res.json();
      if (data.success) {
        setValidationResult(data.message);
      } else {
        setValidationResult("Erreur lors de la validation.");
      }
    } catch (e) {
      setValidationResult("Erreur serveur.");
    }
    setTimeout(() => setValidationResult(null), 5000);
  };

  // Payout Drawer state
  const [showPayoutModal, setShowPayoutModal] = useState<boolean>(false);
  const [payoutStep, setPayoutStep] = useState<'idle' | 'processing' | 'success'>('idle');
  const [payoutAddress, setPayoutAddress] = useState<string>('');
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const [payoutMethod, setPayoutMethod] = useState<'eft' | 'crypto'>('eft');

  // Elite Ultra-Performance Global States
  const [currency, setCurrency] = useState<'EUR' | 'USD' | 'GBP' | 'BTC' | 'CAD'>('CAD');
  const [syncVelocity, setSyncVelocity] = useState<number>(1);
  const [autonomyLevel, setAutonomyLevel] = useState<number>(3);

  const handleUpdateAutonomySimSpeed = async (newLevel: number, newSpeed: number) => {
    setAutonomyLevel(newLevel);
    setSyncVelocity(newSpeed);
    playSynthBeep('click');
    try {
      const res = await apiFetch('/api/settings/update-autonomy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autonomyLevel: newLevel, engineVelocity: newSpeed })
      });
      if (res.ok) {
        const data = await res.json();
        setState(data.state);
        playSynthBeep('success');
      }
    } catch (err) {
      console.error("Failed to update autonomy settings", err);
    }
  };

  const handleUpdateLocalCurrency = async (newCurr: 'CAD' | 'USD' | 'EUR' | 'GBP' | 'BTC') => {
    setCurrency(newCurr);
    playSynthBeep('click');
    try {
      const res = await apiFetch('/api/settings/update-currency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency: newCurr })
      });
      if (res.ok) {
        const data = await res.json();
        setState(data.state);
        playSynthBeep('success');
      }
    } catch (err) {
      console.error("Failed to update currency setting", err);
    }
  };

  // Agent detail modal state
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [showComptableModal, setShowComptableModal] = useState<boolean>(false);
  const [comptableConfig, setComptableConfig] = useState({
    arbitrage: true,
    venture: true,
    hyperDiv: false,
  });

  // Auditory Sonar Synthesizer Engine
  const playSynthBeep = (type: 'success' | 'warn' | 'revenue' | 'click') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'revenue') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.05);
        gain2.gain.setValueAtTime(0.06, ctx.currentTime + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
        osc2.start(ctx.currentTime + 0.05);
        osc2.stop(ctx.currentTime + 0.4);
      } else if (type === 'warn') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      }
    } catch (e) {
      // Browsers often block audio on autoplay
    }
  };

  // Load state on mount
  const fetchState = async () => {
    if (!(window as any).aura_auth_token) {
      setIsAuthenticated(false);
      return;
    }
    try {
      const res = await apiFetch('/api/state');
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setState(data);
        // Pre-fill settings
        setNiche(data.config.niche);
        setLanguage(data.config.language);
        setAdsensePubId(data.config.adsensePubId);
        setAmazonAffiliateTag(data.config.amazonAffiliateTag);
        if (data.config.youtubeChannelId) setYoutubeChannelId(data.config.youtubeChannelId);
        if (data.config.youtubeApiKey) setYoutubeApiKey(data.config.youtubeApiKey);
        if (data.config.googleCloudProjectId) setGoogleCloudProjectId(data.config.googleCloudProjectId);
        if (data.config.amazonAccessKeyId) setAmazonAccessKeyId(data.config.amazonAccessKeyId);
        if (data.config.amazonSecretKey) setAmazonSecretKey(data.config.amazonSecretKey);
        setAutoPilotEnabled(data.config.autoPilotEnabled);
        setGenerationTone(data.config.generationTone);
        if (data.config.generationDensity) setGenerationDensity(data.config.generationDensity);
        if (data.config.targetAudience) setTargetAudience(data.config.targetAudience);
        if (data.config.minCommission !== undefined) setMinCommission(data.config.minCommission);
        if (data.config.autoHealEnabled !== undefined) setAutoHealEnabled(data.config.autoHealEnabled);
        if (data.config.edgeCacheEnabled !== undefined) setEdgeCacheEnabled(data.config.edgeCacheEnabled);
        if (data.config.modelType) setModelType(data.config.modelType);
        if (data.config.selectedChannels) setSelectedChannels(data.config.selectedChannels);
        if (data.currency) setCurrency(data.currency);
        if (data.engineVelocity !== undefined) setSyncVelocity(data.engineVelocity);
        if (data.autonomyLevel !== undefined) setAutonomyLevel(data.autonomyLevel);
        setErrorStatus(null);
        setIsAuthenticated(true);
      } else {
        setErrorStatus("Erreur lors de la récupération des données de la machine sémantique.");
      }
    } catch (err: any) {
      setErrorStatus(`Impossible de joindre le serveur de simulation : ${err.message}`);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchState();
    }
  }, [isAuthenticated]);

  // Run auto production loop (Autopilot with Real-time Sync)
  useEffect(() => {
    let interval: any = null;
    if (isLiveSyncActive && autoPilotEnabled && isAuthenticated && !state?.isPaused) {
      const activeDelayMs = Math.max(300, 6000 / syncVelocity);
      interval = setInterval(async () => {
        try {
          const res = await apiFetch('/api/sync-production-data', { method: 'POST' });
          if (res.ok) {
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const data = await res.json();
              
              // Audio alerting feedback triggers
              if (state) {
                const prevTxLength = state.transactions.length;
                const nextTxLength = data.state.transactions.length;
                const prevIncLength = state.incidents.length;
                const nextIncLength = data.state.incidents.length;
                
                if (nextTxLength > prevTxLength) {
                  playSynthBeep('revenue');
                } else if (nextIncLength > prevIncLength) {
                  playSynthBeep('warn');
                } else {
                  playSynthBeep('click');
                }
              } else {
                playSynthBeep('click');
              }

              setState(data.state);
            } else {
              console.warn("Autopilot tick received non-JSON payload from server. Skipping state update.");
            }
          }
        } catch (err: any) {
          console.error("Autopilot tick broken:", err);
          // If it's a Failed to fetch, it might be the server restarting or auth issues
          if (err.message === 'Failed to fetch') {
            console.warn("Connexion perdue ou serveur en redémarrage. Tentative de reconnexion au prochain tick...");
          }
        }
      }, activeDelayMs);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLiveSyncActive, autoPilotEnabled, syncVelocity, state?.transactions.length, state?.incidents.length]);

  // Handle manual organic stimulation tick
  const triggerTick = async () => {
    setLoadingAction(true);
    playSynthBeep('click');
    try {
      const res = await apiFetch('/api/sync-production-data', { method: 'POST' });
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setState(data.state);
          playSynthBeep('success');
        } else {
          console.warn("Manual tick received non-JSON payload.");
        }
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setTimeout(() => setLoadingAction(false), 500);
    }
  };

  // Call API to run generator agent (plume, maker)
  const handleTriggerAgent = async (agentId: string, userPrompt: string) => {
    const res = await apiFetch('/api/run-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId, userPrompt }),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "L'agent a rencontré un problème d'API.");
    }
    const data = await res.json();
    setState(data.state);
  };

  // Call API to checkout buying simulator
  const handleSimulatePurchase = async (productId: string, name: string, country: string): Promise<{ success: boolean; checkoutUrl?: string; state?: any }> => {
    const res = await apiFetch('/api/checkout-simulator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        productId, 
        clientName: name, 
        clientCountry: country,
        realMode: true // Force real mode attempt if keys are present
      }),
    });
    if (!res.ok) {
      let msg = "L'achat n'a pas pu aboutir.";
      try {
        const errData = await res.json();
        if (errData && errData.error) {
          msg = errData.error;
        }
      } catch (_) {}
      throw new Error(msg);
    }
    const data = await res.json();
    
    // Check if we got a real Stripe Checkout URL
    if (data.checkoutUrl) {
      try {
        window.open(data.checkoutUrl, '_blank');
      } catch (e) {
        console.warn("Blocked window.open, fallback to returning url", e);
      }
      return { success: true, checkoutUrl: data.checkoutUrl, state: data.state };
    }

    setState(data.state);
    
    // Set checkout notification
    const prd = data.state.products.find((p: any) => p.id === productId);
    setCheckoutNotification(`[STRIPE CONFIRMED] Succès ! Achat enregistré pour "${prd?.title}" : +${prd?.price} CA$ depuis ${country}.`);
    setTimeout(() => setCheckoutNotification(null), 6000);
    return { success: true, state: data.state };
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccessMessage(null);
    setSaveErrorMessage(null);
    try {
       const updatedConfig = {
        niche,
        language,
        adsensePubId,
        amazonAffiliateTag,
        youtubeChannelId,
        youtubeApiKey,
        googleCloudProjectId,
        amazonAccessKeyId,
        amazonSecretKey,
        stripeActive: true,
        autoPilotEnabled,
        generationTone,
        generationDensity,
        targetAudience,
        minCommission,
        autoHealEnabled,
        edgeCacheEnabled,
        modelType,
        selectedChannels,
      };
      const res = await apiFetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: updatedConfig }),
      });
      if (res.ok) {
        const data = await res.json();
        setState(data.state);
        playSynthBeep('success');
        setSaveSuccessMessage("Directives autonomes appliquées ! Le robot Aura a ajusté ses paramètres sémantiques.");
        setTimeout(() => setSaveSuccessMessage(null), 5000);
      } else {
        const errData = await res.json();
        setSaveErrorMessage(`Échec : ${errData.error || 'Erreur lors de la sauvegarde.'}`);
        setTimeout(() => setSaveErrorMessage(null), 5000);
      }
    } catch (err: any) {
      setSaveErrorMessage(`Serveur injoignable : ${err.message}`);
      setTimeout(() => setSaveErrorMessage(null), 5000);
    }
  };

  // Simulate Payout workflow
  const triggerPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutAddress) return;
    setPayoutStep('processing');
    setTimeout(() => {
      setPayoutStep('success');
      if (state) {
        // Clear active revenue stats or decrease slightly to simulate real withdrawal!
        const takenFunds = payoutAmount;
        const btcVal = parseFloat((takenFunds / 65000).toFixed(6));
        const txMsg = payoutMethod === 'crypto'
          ? `RETRAIT EXÉCUTÉ (CRYPTO) : Versement converti de ${takenFunds.toFixed(2)} CA$ en ${btcVal} BTC (Taux : 1 BTC = 65 000.00 CA$) transmis vers l'adresse Bitcoin [${payoutAddress}]. Opération validée par l'Agent Trésorier.`
          : `RETRAIT EXÉCUTÉ : Versement approuvé de ${takenFunds.toFixed(2)} CA$ vers le compte canadien [${payoutAddress}]. Traitement EFT (Direct Deposit) validé sans commission par l'Agent Trésorier.`;

        setState(prev => {
          if (!prev) return null;
          return {
            ...prev,
            metrics: {
              ...prev.metrics,
              totalRevenue: Math.max(prev.metrics.totalRevenue - takenFunds, 0)
            },
            logs: [
              {
                id: `payout-${Date.now()}`,
                timestamp: new Date().toISOString(),
                agentId: 'tresorier',
                agentName: 'Agent Trésorier',
                message: txMsg,
                type: 'revenue'
              },
              ...prev.logs
            ]
          };
        });
      }
    }, 2500);
  };

  // Extract total funds modal opening
  const openPayout = () => {
    if (!state) return;
    setPayoutAmount(state.metrics.totalRevenue);
    setPayoutMethod('eft');
    const bankInfo = state.autoFineConfig ? 
      `${state.autoFineConfig.realBankTransit}-${state.autoFineConfig.realBankInst}-${state.autoFineConfig.realBankAccount}` : 
      '12345-001-1234567';
    setPayoutAddress(bankInfo);
    setPayoutStep('idle');
    setShowPayoutModal(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col items-center justify-center p-4 font-sans select-none selection:bg-cyan-500/25 antialiased pt-[max(env(safe-area-inset-top,0px),24px)] pb-[max(env(safe-area-inset-bottom,0px),24px)]">
        <div className="w-full max-w-md bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-cyan-500/5">
          <div className="space-y-3.5 text-center">
            <div className="w-14 h-14 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/15 animate-bounce">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white uppercase font-sans">
                AURA <span className="text-cyan-400 italic font-medium font-mono text-xs">MONITOR</span>
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mt-1">
                Portail d'Administration Sécurisé JWT
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div>
              <label className="block text-[10px] text-zinc-400 font-mono uppercase tracking-wider mb-1.5">
                Clé d'accès administrateur
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Ex. ••••••••••••"
                className="w-full bg-zinc-950 border border-zinc-850 text-white rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition text-center font-mono placeholder:text-zinc-700"
              />
            </div>

            {loginError && (
              <p className="text-rose-400 text-xs font-mono text-center bg-rose-950/20 border border-rose-950/45 rounded-lg py-2">
                ⚠️ {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl shadow-lg shadow-cyan-550/10 active:scale-[0.98] transition font-mono"
            >
              Déverrouiller Aura Core
            </button>
          </form>

          <div className="pt-4 border-t border-[#1f1f1f] text-center space-y-1 text-[9px] text-zinc-500 font-mono uppercase tracking-wider">
            <p className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
              <span>🔐 Accès personnel chiffré actif</span>
            </p>
            <p>CONCIERGE JWT ACTIF ● ACCÈS STRICTEMENT PROTÉGÉ</p>
          </div>
        </div>
      </div>
    );
  }

  if (!state) {
    return <PageLoader />;
  }

  // Active micro sub-agents count working
  const activeAgentsCount = state.agents.filter(a => a.status === 'working').length;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col overflow-x-hidden font-sans select-none antialiased pt-[max(env(safe-area-inset-top,0px),16px)] pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]">
      
      {/* Top Navigation Bar adhering to Elegant Dark */}
      <nav id="navbar-aura" className="h-16 border-b border-[#1f1f1f] flex items-center justify-between px-4 sm:px-8 bg-[#0a0a0a] relative z-45 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <div className="w-4 h-4 border-2 border-white rounded-full animate-pulse"></div>
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white uppercase font-sans">AURA <span className="text-cyan-400 italic font-medium font-mono text-xs">MONITOR V2.4</span></span>
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              <span>SYSTÈME DE MONÉTISATIION IA AUTONOME</span>
            </div>
          </div>
        </div>

        {/* Dynamic header stats switcher tabs */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg p-1">
          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'revenue' ? 'bg-[#151515] text-white border border-[#1f1f1f]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Matrice de Revenus
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'agents' ? 'bg-[#151515] text-white border border-[#1f1f1f]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Commandement Flotte
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'content' ? 'bg-[#151515] text-white border border-[#1f1f1f]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hub SEO Web
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'store' ? 'bg-[#151515] text-white border border-[#1f1f1f]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Boutique Stripe
          </button>
          <button
            onClick={() => setActiveTab('microservices')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'microservices' ? 'bg-[#151515] text-white border border-[#1f1f1f]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Microservices IA
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'config' ? 'bg-[#151515] text-white border border-[#1f1f1f]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Autopilot Config
          </button>
          <button
            onClick={() => {
              setActiveTab('tuning');
              playSynthBeep('success');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'tuning' 
                ? 'bg-cyan-950 text-cyan-450 text-cyan-300 border border-cyan-800' 
                : 'text-cyan-400 bg-cyan-950/20 border border-cyan-900/40 hover:bg-cyan-950/40 hover:text-cyan-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Centrale Elite (20)
          </button>
          <button
            onClick={() => {
              setActiveTab('autofinance');
              playSynthBeep('success');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'autofinance' 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                : 'text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 hover:bg-emerald-950/40 hover:text-emerald-305 hover:text-emerald-300 text-emerald-455 hover:text-emerald-300 text-emerald-450'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            Auto-Finances (A-Z)
          </button>
          <button
            onClick={() => {
              setActiveTab('fourpillars');
              playSynthBeep('success');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'fourpillars' 
                ? 'bg-blue-950 text-blue-300 border border-blue-800' 
                : 'text-blue-400 bg-blue-950/20 border border-blue-900/40 hover:bg-blue-950/40 hover:text-blue-300'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            Les 4 Piliers Client
          </button>
        </div>

        {/* Global session revenue preview */}
        <div className="flex items-center gap-4">
          {/* VOICE COMMAND BUTTON */}
          <VoiceCommandButton
            isPaused={state.isPaused || false}
            togglePause={togglePause}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            playSynthBeep={playSynthBeep}
            openPayout={openPayout}
            handleLogout={handleLogout}
          />

          {/* PAUSE BUTTON */}
          <button
            onClick={togglePause}
            title={state.isPaused ? "Reprendre l'automatisation" : "Mettre en pause le système"}
            className={`p-2 rounded-lg border flex items-center gap-2 transition-all ${
              state.isPaused 
                ? 'bg-amber-950/40 border-amber-800 text-amber-500 animate-pulse'
                : 'bg-zinc-950 border-zinc-900 text-emerald-500 hover:bg-zinc-900'
            }`}
          >
            {state.isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
            <span className="hidden md:inline text-[10px] font-black uppercase tracking-tighter">
              {state.isPaused ? 'Moteur Off' : 'Moteur On'}
            </span>
          </button>

          <div className="text-right">
            <div className="text-[10px] text-gray-500 font-mono tracking-wider uppercase font-semibold">Balance Réelle</div>
            <div className="text-sm font-bold font-mono text-cyan-400 flex items-center justify-end gap-1">
              {state.metrics.totalRevenue.toLocaleString('fr-CA', { minimumFractionDigits: 2 })} CA$
            </div>
          </div>
          <button
            onClick={openPayout}
            className="hidden sm:flex px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-xs font-extrabold text-white rounded-lg shadow-md transition-all duration-300"
          >
            RETRAIT LIKIDE
          </button>
          <button
            onClick={handleLogout}
            title="Se déconnecter (JWT Sign-Out)"
            className="p-2 border border-zinc-900 bg-zinc-950 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-rose-450 hover:text-rose-450 transition text-zinc-400"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Master Pause Banner */}
      {state.isPaused && (
        <div className="bg-amber-950/90 border-b border-amber-800 py-2.5 px-4 flex items-center justify-center gap-3 backdrop-blur-md z-50 relative animate-in slide-in-from-top duration-500">
          <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          <span className="text-amber-500 text-[11px] font-black tracking-widest uppercase font-mono">
            Mode Pause Activé : Toutes les opérations automatiques sont suspendues
          </span>
          <button 
            onClick={togglePause}
            className="ml-4 px-3 py-1 bg-amber-500 text-amber-950 text-[10px] font-bold rounded-md hover:bg-amber-400 transition-colors uppercase tracking-widest"
          >
            Redémarrer
          </button>
        </div>
      )}

      {/* Interactive Mobile Tab Switcher */}
      <div className="lg:hidden flex overflow-x-auto whitespace-nowrap scrollbar-none border-b border-[#1f1f1f] bg-[#0a0a0a] relative z-40 text-center text-[10px] font-mono scroll-smooth">
        <button
          onClick={() => setActiveTab('revenue')}
          className={`px-4 py-3 flex-none ${activeTab === 'revenue' ? 'text-[#00f2fe] border-b-2 border-[#00f2fe] bg-slate-950/20' : 'text-slate-400'}`}
        >
          Revenus
        </button>
        <button
          onClick={() => setActiveTab('agents')}
          className={`px-4 py-3 flex-none ${activeTab === 'agents' ? 'text-[#00f2fe] border-b-2 border-[#00f2fe] bg-slate-950/20' : 'text-slate-400'}`}
        >
          Agents
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-3 flex-none ${activeTab === 'content' ? 'text-[#00f2fe] border-b-2 border-[#00f2fe] bg-slate-950/20' : 'text-slate-400'}`}
        >
          SEO Hub
        </button>
        <button
          onClick={() => setActiveTab('store')}
          className={`px-4 py-3 flex-none ${activeTab === 'store' ? 'text-[#00f2fe] border-b-2 border-[#00f2fe] bg-slate-950/20' : 'text-slate-400'}`}
        >
          Stripe
        </button>
        <button
          onClick={() => setActiveTab('microservices')}
          className={`px-4 py-3 flex-none ${activeTab === 'microservices' ? 'text-[#00f2fe] border-b-2 border-[#00f2fe] bg-slate-950/20' : 'text-slate-400'}`}
        >
          Micro-API
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`px-4 py-3 flex-none ${activeTab === 'config' ? 'text-[#00f2fe] border-b-2 border-[#00f2fe] bg-slate-950/20' : 'text-slate-400'}`}
        >
          Config
        </button>
        <button
          onClick={() => {
            setActiveTab('tuning');
            playSynthBeep('success');
          }}
          className={`px-4 py-3 flex-none ${activeTab === 'tuning' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-950/10 font-extrabold' : 'text-cyan-400 animate-pulse'}`}
        >
          ⚡ Centrale Elite (20)
        </button>
        <button
          onClick={() => {
            setActiveTab('autofinance');
            playSynthBeep('success');
          }}
          className={`px-4 py-3 flex-none ${activeTab === 'autofinance' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-950/10 font-extrabold' : 'text-slate-400'}`}
        >
          💸 Auto-Finances (A-Z)
        </button>
        <button
          onClick={() => {
            setActiveTab('fourpillars');
            playSynthBeep('success');
          }}
          className={`px-4 py-3 flex-none ${activeTab === 'fourpillars' ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-950/10 font-extrabold' : 'text-slate-400 animate-pulse'}`}
        >
          📢 les 4 Piliers Client
        </button>
      </div>

      {/* Stripe payment real-time flash news bar */}
      {checkoutNotification && (
        <div className="bg-emerald-950 border-b border-emerald-800 text-emerald-400 px-8 py-2 text-xs font-mono text-center flex items-center justify-center gap-2 animate-pulse">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>{checkoutNotification}</span>
        </div>
      )}

      {/* Main Framework Content Area */}
      <main className="flex-1 flex flex-col xl:flex-row overflow-y-auto overflow-x-hidden p-4 sm:p-6 gap-6">
        
        {/* Left Sidepanel Widget: System Watchdog */}
        <aside className="w-full xl:w-72 flex flex-col gap-6 shrink-0">
          
          {/* Active Agent monitor status */}
          <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="relative group/tooltip flex items-center gap-1.5 cursor-help">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                  Flotte active ({state.agents.length})
                </div>
                <Info className="w-3.5 h-3.5 text-slate-500 opacity-60" />
                <div className="absolute left-0 top-full mt-2 hidden group-hover/tooltip:block w-48 bg-slate-800 text-slate-200 text-xs p-2.5 rounded-lg shadow-xl border border-slate-700 z-50 pointer-events-none normal-case font-sans">
                  Liste des agents d'intelligence artificielle actuellement déployés sur vos réseaux. Cliquez sur un agent pour voir ses configurations.
                </div>
              </div>
              <span className="text-[10px] text-[#00f2fe] font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                AI Layer 3
              </span>
            </div>

            <div className="space-y-4">
              {state.agents.map((agent) => (
                <div 
                  key={agent.id} 
                  onClick={() => { playSynthBeep('click'); setSelectedAgentId(agent.id); }}
                  className="p-3 bg-[#151515] border border-[#1f1f1f] rounded-lg cursor-pointer hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-semibold text-white font-sans">{agent.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                      agent.status === 'working' ? 'text-amber-400 bg-amber-950/60 animate-pulse' : 'text-emerald-400 bg-slate-950'
                    }`}>
                      {agent.status === 'working' ? 'ACTIF' : 'LIBRE'}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-400 truncate font-sans">{agent.role}</div>
                  
                  {agent.status === 'working' && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                        <span>Optimisations en cours</span>
                        <span>{agent.taskProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full transition-all duration-300" style={{ width: `${agent.taskProgress}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Network Health Watchdog graph block */}
          <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-5">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 font-mono">Santé Réseau Sémantique</div>
            <div className="flex items-end gap-1.5 h-24 pb-2">
              <div className="flex-1 bg-cyan-950/60 h-[40%] rounded-sm"></div>
              <div className="flex-1 bg-cyan-950/60 h-[60%] rounded-sm"></div>
              <div className="flex-1 bg-cyan-950/60 h-[45%] rounded-sm"></div>
              <div className="flex-1 bg-cyan-500 h-[90%] rounded-sm animate-pulse"></div>
              <div className="flex-1 bg-cyan-500 h-[85%] rounded-sm"></div>
              <div className="flex-1 bg-[#00f2fe] h-[95%] rounded-sm shadow-[0_0_8px_rgba(0,242,254,0.4)]"></div>
              <div className="flex-1 bg-cyan-950/60 h-[30%] rounded-sm"></div>
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-gray-500 font-mono">
              <span>Latence : 11ms</span>
              <span>Activité : 99.98%</span>
            </div>
          </div>
        </aside>

        {/* Central Switchboard Workspace Panel representing each app layer */}
        <section className="flex-1 flex flex-col gap-6 min-w-0">
          
          {/* Active Workspace Rendering wrapper */}
          <div className="flex-1 bg-[#0d0d0d] border border-[#1f1f1f] rounded-2xl relative overflow-hidden p-6 sm:p-8">
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="relative h-full flex flex-col space-y-6">
              
              {/* Context module header for professional aesthetics */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1f1f1f] pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,242,254,0.8)]"></span>
                  <div>
                    <h2 className="text-white font-extrabold text-lg tracking-tight font-sans">
                      {activeTab === 'revenue' && 'Matrice de Monétisation Passive'}
                      {activeTab === 'agents' && "Portail d'Exécution de la Flotte IA"}
                      {activeTab === 'content' && 'Index SEO & Articles à Haut Rendement'}
                      {activeTab === 'store' && 'Système de Ventes Directes Stripe'}
                      {activeTab === 'microservices' && "Hébergement de Microservices IA & Abonnements"}
                      {activeTab === 'config' && 'Console de Configuration & Autopilot'}
                      {activeTab === 'tuning' && 'Aura Elite Command — Hub de Stabilisation et Gestion (20 Optimisations)'}
                      {activeTab === 'autofinance' && 'Trésorerie d\'Arbitrage Automatisée & Payouts Securisés'}
                      {activeTab === 'fourpillars' && "Les 4 Piliers Client — Automate d'Acquisition Intégrale"}
                      {/* {activeTab === 'autotrading' && 'Console Auto-Trading'} */}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {activeTab === 'revenue' && 'Synthèse des performances, micro-bénéfices publicitaires et commissions en cours.'}
                      {activeTab === 'agents' && "Contrôlez les cerveaux d'intelligence artificielle et concevez de nouveaux atouts."}
                      {activeTab === 'content' && 'Explorez les pages web indexées sur Google qui attirent les clients à votre place.'}
                      {activeTab === 'store' && "Simulez le cycle d'achat d'un client Stripe et encaissez des commissions pures."}
                      {activeTab === 'microservices' && "Gérez vos micro-API payantes, les facturations à l'usage, la résilience et le Superviseur Aura."}
                      {activeTab === 'config' && "Modifiez la thématique de marché, les tags d'affiliation et le statut du pilotage automatique."}
                      {activeTab === 'tuning' && "Ajustez en direct l'architecture sémantique de l'application. Activez les boucliers, boostez la rentabilité."}
                      {activeTab === 'autofinance' && "Gérez l'encaissement à l'usage, la conformité fiscale Stripe Tax, l'Agent Trésorier et la transmission de pièces d'audit."}
                      {activeTab === 'fourpillars' && "Prospection robotisée globale, cocon SEO de redirection, checkout Stripe et push de victoires."}
                      {/* {activeTab === 'autotrading' && 'Agent Alpha-1 en temps réel pour le trading automatique.'} */}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded font-mono text-[9px] text-[#00f2fe] uppercase tracking-wider font-semibold">
                    Thread standard #{state.config.niche.replace(/\s+/g, '-').slice(0, 15).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Swiss Army Flowchart Interactive Dashboard display, visible on main management views */}
              {(activeTab === 'revenue' || activeTab === 'tuning' || activeTab === 'autofinance') && (
                <div id="central-chart" className="animate-fade-in relative">
                  <SwissArmyFlowchart 
                    state={state} 
                    onUpdateState={setState} 
                    playSynthBeep={playSynthBeep} 
                  />
                </div>
              )}

              {/* Tab views rendering switches */}
              {activeTab === 'revenue' && (
                <div className="space-y-6 animate-fade-in">
                  <MetricCard
                    totalRevenue={state.metrics.totalRevenue}
                    mrr={state.metrics.mrr}
                    totalVisitors={state.metrics.totalVisitors}
                    conversionRate={state.metrics.conversionRate}
                    streams={state.streams}
                    onTick={triggerTick}
                    isLiveSyncActive={isLiveSyncActive}
                    currency={currency}
                    setCurrency={handleUpdateLocalCurrency}
                    engineVelocity={syncVelocity}
                    setSyncVelocity={(s) => handleUpdateAutonomySimSpeed(autonomyLevel, s)}
                    autonomyLevel={autonomyLevel}
                    setAutonomyLevel={(a) => handleUpdateAutonomySimSpeed(a, syncVelocity)}
                    playAudioBeep={playSynthBeep}
                    transactions={state.transactions || []}
                    onUpdateState={setState}
                  />
                </div>
              )}

              {activeTab === 'agents' && (
                <div className="animate-fade-in">
                  <AgentTab
                    agents={state.agents}
                    logs={state.logs}
                    onTriggerAgent={handleTriggerAgent}
                    onAgentCreated={async () => {
                      await fetchState();
                      playSynthBeep('success');
                    }}
                  />
                </div>
              )}

              {activeTab === 'content' && (
                <div className="animate-fade-in">
                  <ContentHub 
                    articles={state.articles} 
                    adsensePubId={state.config?.adsensePubId}
                    amazonAffiliateTag={state.config?.amazonAffiliateTag}
                  />
                </div>
              )}

              {activeTab === 'store' && (
                <div className="animate-fade-in">
                  <ProductStore
                    products={state.products}
                    transactions={state.transactions}
                    onSimulatePurchase={handleSimulatePurchase}
                  />
                </div>
              )}


              {activeTab === 'microservices' && (
                <div className="animate-fade-in h-full flex flex-col justify-between">
                  <MicroservicesTab
                    microServices={state.microServices || []}
                    incidents={state.incidents || []}
                    chatHistory={state.chatHistory || []}
                    niche={state.config.niche}
                    isLoading={loadingAction}
                    onSendMessage={async (message) => {
                      setLoadingAction(true);
                      try {
                        const response = await apiFetch('/api/chat-orchestrator', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ message }),
                        });
                        if (response.ok) {
                          const updated = await response.json();
                          setState(updated.state);
                          const chatHist = updated.state.chatHistory;
                          if (chatHist && chatHist.length > 0) {
                            const lastMsg = chatHist[chatHist.length - 1];
                            if (lastMsg && lastMsg.sender === 'agent' && 'speechSynthesis' in window) {
                              // Filter out [DEPLOY_START] tags from being spoken
                              let speechText = lastMsg.message;
                              speechText = speechText.replace(/\[DEPLOY_START\][\s\S]*?\[DEPLOY_END\]/g, "");
                              // Clean up markdown blocks and asterisks for better speech reading
                              speechText = speechText.replace(/[\*\_\[\]]/g, "");
                              const utterance = new SpeechSynthesisUtterance(speechText);
                              utterance.lang = 'fr-FR';
                              utterance.rate = 1.0;
                              utterance.pitch = 1.1;
                              const voices = window.speechSynthesis.getVoices();
                              // Prefer Google or female French voices, but fallback to any French voice
                              const frVoice = voices.find(v => v.lang.startsWith('fr') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('google'))) || voices.find(v => v.lang.startsWith('fr'));
                              if (frVoice) {
                                 utterance.voice = frVoice;
                              }
                              window.speechSynthesis.cancel();
                              window.speechSynthesis.speak(utterance);
                            }
                          }
                        }
                      } catch (e) {
                        console.error("Chat error", e);
                      } finally {
                        setLoadingAction(false);
                      }
                    }}
                    onCreateOrUpdateService={async (service) => {
                      try {
                        const response = await apiFetch('/api/micro-services', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(service),
                        });
                        if (response.ok) {
                          const updated = await response.json();
                          setState(updated.state);
                        }
                      } catch (e) {
                        console.error("Save microservice error", e);
                      }
                    }}
                    onDeleteService={async (id) => {
                      try {
                        const response = await apiFetch(`/api/micro-services/${id}`, {
                          method: 'DELETE',
                        });
                        if (response.ok) {
                          const updated = await response.json();
                          setState(updated.state);
                        }
                      } catch (e) {
                        console.error("Delete microservice error", e);
                      }
                    }}
                    onResolveIncident={async (id) => {
                      try {
                        const response = await apiFetch('/api/resolve-incident', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id }),
                        });
                        if (response.ok) {
                          const updated = await response.json();
                          setState(updated.state);
                        }
                      } catch (e) {
                        console.error("Resolve incident error", e);
                      }
                    }}
                    onSelfTestError={async (id) => {
                      try {
                        const response = await apiFetch('/api/trigger-diagnostic-incident', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id }),
                        });
                        if (response.ok) {
                          const updated = await response.json();
                          setState(updated.state);
                        }
                      } catch (e) {
                        console.error("Simulate crash test error", e);
                      }
                    }}
                    onGlobalDiagnoseHeal={async () => {
                      try {
                        const response = await apiFetch('/api/system-diagnose-heal', {
                          method: 'POST',
                        });
                        if (response.ok) {
                          const updated = await response.json();
                          setState(updated.state);
                          return updated;
                        }
                      } catch (e) {
                        console.error("Global diagnose and heal error", e);
                      }
                    }}
                  />
                </div>
              )}

              {activeTab === 'config' && (
                <div className="max-w-5xl mx-auto space-y-6 animate-fade-in font-sans text-slate-100">
                  
                  {/* Feedback Messages */}
                  {saveSuccessMessage && (
                    <div className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-center gap-3 animate-slide-in text-xs font-medium">
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>{saveSuccessMessage}</div>
                    </div>
                  )}

                  {saveErrorMessage && (
                    <div className="bg-rose-950/80 border border-rose-500/30 text-rose-400 p-4 rounded-xl flex items-center gap-3 animate-slide-in text-xs font-medium">
                      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      <div>{saveErrorMessage}</div>
                    </div>
                  )}

                  {/* High-Tech Top Header Banner */}
                  <div className="bg-[#0b0b0b] border border-[#1f1f1f] rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-4">
                      <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-cyan-400 relative">
                        <Sliders className="w-6 h-6 animate-pulse" />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="bg-cyan-950 text-cyan-400 border border-cyan-900 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase font-mono">
                            AURA DRIVER v5.2
                          </span>
                          <span className="text-zinc-500 text-[10px] font-mono">PILOTE CENTRAL</span>
                        </div>
                        <h2 className="text-white text-lg font-extrabold font-sans">
                          Centrale de Pilotage Sémantique & Autopilotage Aura
                        </h2>
                        <p className="text-xs text-zinc-400 max-w-xl mt-1 leading-relaxed">
                          Ajustez l'attitude rationnelle des agents de rédaction d'Aura pour capturer le trafic organique et maximiser les micro-commissions.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2.5 self-start md:self-auto">
                      <span className={`text-[10px] uppercase font-mono font-bold px-3 py-1 rounded-full border ${autoPilotEnabled ? 'bg-emerald-950/60 text-emerald-400 border-emerald-900/60' : 'bg-amber-950/60 text-amber-500 border-amber-900/60'}`}>
                        {autoPilotEnabled ? "⬤ Autopilotage Actif" : "▲ Autopilotage Suspendu"}
                      </span>
                    </div>
                  </div>

                  {/* Telemetry Metrics Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#0b0b0b] border border-[#1f1f1f] p-4 rounded-xl font-mono">
                      <span className="text-[9px] uppercase text-slate-500 font-bold block">Compression Temporelle</span>
                      <span className="text-lg font-bold text-cyan-400 mt-1 block">{syncVelocity}x vélocité</span>
                      <span className="text-[9px] text-slate-500 block">Intervalle d'action : ~{Math.max(300, Math.round(6000 / syncVelocity))}ms</span>
                    </div>

                    <div className="bg-[#0b0b0b] border border-[#1f1f1f] p-4 rounded-xl font-mono">
                      <span className="text-[9px] uppercase text-slate-500 font-bold block">Niveau d'Autonomie</span>
                      <span className="text-lg font-bold text-purple-400 mt-1 block">Niveau {autonomyLevel}/3</span>
                      <span className="text-[9px] text-slate-500 block">
                        {autonomyLevel === 3 ? "100% Autonome" : autonomyLevel === 2 ? "Semi-Autonome" : "Manuel strict"}
                      </span>
                    </div>

                    <div className="bg-[#0b0b0b] border border-[#1f1f1f] p-4 rounded-xl font-mono text-ellipsis overflow-hidden">
                      <span className="text-[9px] uppercase text-slate-500 font-bold block">Niche Cible Active</span>
                      <span className="text-sm font-bold text-white mt-1 block truncate" title={niche}>{niche || 'Arbitrage'}</span>
                      <span className="text-[9px] text-slate-500 block">Thème d'écriture IA</span>
                    </div>

                    <div className="bg-[#0b0b0b] border border-[#1f1f1f] p-4 rounded-xl font-mono">
                      <span className="text-[9px] uppercase text-slate-500 font-bold block">Moteur d'Écriture AI</span>
                      <span className="text-lg font-bold text-indigo-400 mt-1 block">{modelType}</span>
                      <span className="text-[9px] text-slate-500 block">Uptime : 99.98%</span>
                    </div>
                  </div>

                  {/* Main Grid for Tuning Controls */}
                  <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Column 1 & 2: Main Configuration Inputs */}
                    <div className="lg:col-span-2 space-y-6 bg-[#0b0b0b] border border-[#1f1f1f] rounded-2xl p-6">
                      
                      {/* Section A: Stratégie Écriture & IA */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-1.5 h-3 bg-cyan-500 rounded"></span>
                          <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#9b51e0]">1. Stratégie Sémantique & IA (Aura Content Scribe)</h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                          <div>
                            <label className="block text-slate-400 mb-1 font-semibold font-mono uppercase tracking-wider text-[10px]">Thématique Ciblée (Niche)</label>
                            <input
                              type="text"
                              required
                              value={niche}
                              onChange={(e) => setNiche(e.target.value)}
                              placeholder="Ex: Fitness, Crypto, Finances Personnelles, Cuisine"
                              className="w-full bg-[#121212] border border-[#1f1f1f] text-white rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-cyan-400"
                            />
                            <span className="text-[9px] text-slate-500 mt-1 block">Régit les thèmes d'inspiration des agents web de rédaction.</span>
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1 font-semibold font-mono uppercase tracking-wider text-[10px]">Langue de Rédaction des articles</label>
                            <select
                              value={language}
                              onChange={(e) => setLanguage(e.target.value)}
                              className="w-full bg-[#121212] border border-[#1f1f1f] text-white rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                            >
                              <option value="Français (FR)">Français (FR)</option>
                              <option value="English (US)">English (US)</option>
                              <option value="Español (ES)">Español (ES)</option>
                            </select>
                            <span className="text-[9px] text-slate-500 mt-1 block">Langue du contenu automatique produit par les agents.</span>
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1 font-semibold font-mono uppercase tracking-wider text-[10px]">Ton de Copwriting</label>
                            <select
                              value={generationTone}
                              onChange={(e) => setGenerationTone(e.target.value)}
                              className="w-full bg-[#121212] border border-[#1f1f1f] text-white rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                            >
                              <option value="Persuasif et Professionnel">Persuasif et Professionnel</option>
                              <option value="Inspirant et Éducatif">Inspirant et Éducatif</option>
                              <option value="Bulle d'Humour et Simple">Bulle d'Humour et Simple</option>
                              <option value="Narratif & Émotionnel">Narratif & Émotionnel</option>
                              <option value="Froid & Brutaliste (Tech-Mono)">Froid & Brutaliste (Tech-Mono)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1 font-semibold font-mono uppercase tracking-wider text-[10px]">Modèle Cognitive d'Écritures LLM</label>
                            <select
                              value={modelType}
                              onChange={(e) => setModelType(e.target.value)}
                              className="w-full bg-[#121212] border border-[#1f1f1f] text-white rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                            >
                              <option value="gemini-3.5-flash">Gemini 3.5 Flash (Recommandé)</option>
                              <option value="gemini-3.2-pro">Gemini 3.2 Pro (Haute Qualité)</option>
                              <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Économique)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1 font-semibold font-mono uppercase tracking-wider text-[10px]">Densité d'auto-publication</label>
                            <select
                              value={generationDensity}
                              onChange={(e) => setGenerationDensity(e.target.value)}
                              className="w-full bg-[#121212] border border-[#1f1f1f] text-white rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                            >
                              <option value="Faible (1 article/jour)">Faible (1 article/jour)</option>
                              <option value="Standard (5 articles/jour)">Standard (5 articles/jour)</option>
                              <option value="Haute (12 articles/jour)">Haute (12 articles/jour)</option>
                              <option value="Agressive - Flux Continu">Agressive - Flux Continu (AI Chaos)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1 font-semibold font-mono uppercase tracking-wider text-[10px]">Segmentation de l'Audience Cible</label>
                            <select
                              value={targetAudience}
                              onChange={(e) => setTargetAudience(e.target.value)}
                              className="w-full bg-[#121212] border border-[#1f1f1f] text-white rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                            >
                              <option value="Tout public">Tout public / Mixte</option>
                              <option value="Professionnels / B2B">Professionnels & Cadres (B2B)</option>
                              <option value="Jeunes / Ados / Techs">Jeunes, Ados & Enthousiastes Tech</option>
                              <option value="Seniors (Silver Economy)">Seniors & Retraités (Silver Economy)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Section B: Tunnels d'Affiliation & Monétisation */}
                      <div className="pt-6 border-t border-[#1f1f1f]">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-1.5 h-3 bg-emerald-500 rounded"></span>
                          <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#9b51e0]">2. Tunnels d'Affiliation & Monétisation</h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                          <div>
                            <label className="block text-slate-400 mb-1 font-semibold font-mono uppercase tracking-wider text-[10px]">Identifiant Google AdSense</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={adsensePubId || ''}
                                onChange={(e) => setAdsensePubId(e.target.value)}
                                className="flex-1 bg-[#121212] border border-[#1f1f1f] text-white rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-cyan-400 font-mono"
                              />
                              <div className={`w-2 h-2 rounded-full ${adsensePubId && adsensePubId.startsWith('ca-pub-') ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                            </div>
                            <span className="text-[9px] text-slate-500 mt-1 block">ID de l'éditeur (ex: ca-pub-...) pour bannières automatiques.</span>
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1 font-semibold font-mono uppercase tracking-wider text-[10px]">Tag Partenaire Amazon Affiliate</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={amazonAffiliateTag || ''}
                                onChange={(e) => setAmazonAffiliateTag(e.target.value)}
                                className="flex-1 bg-[#121212] border border-[#1f1f1f] text-white rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-cyan-400 font-mono"
                              />
                              <div className={`w-2 h-2 rounded-full ${amazonAffiliateTag && amazonAffiliateTag.length >= 5 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                            </div>
                            <span className="text-[9px] text-slate-500 mt-1 block">Pour l'insertion de liens trackés Amazon Associates.</span>
                            <button
                              type="button"
                              onClick={validateConfig}
                              className="mt-2 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold rounded-lg transition"
                            >
                              Apply & Validate
                            </button>
                            {validationResult && <span className="ml-2 text-[10px] text-cyan-400 font-mono">{validationResult}</span>}
                          </div>

                          <div className="sm:col-span-2">
                            <div className="flex justify-between items-center mb-1">
                              <label className="block text-slate-400 font-semibold font-mono uppercase text-[10px]">Seuil de Commission minimale exigé</label>
                              <span className="text-xs text-[#9b51e0] font-mono font-bold">{minCommission}% commission</span>
                            </div>
                            <input
                              type="range"
                              min="5"
                              max="60"
                              value={minCommission}
                              onChange={(e) => setMinCommission(Number(e.target.value))}
                              className="w-full h-1 bg-[#121212] rounded-lg appearance-none cursor-pointer accent-[#9b51e0]"
                            />
                            <span className="text-[9px] text-slate-500 block mt-1">
                              Aura rejettera automatiquement les offres d'affiliation tiers dont le taux de commission net est inférieur à ce seuil.
                            </span>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-slate-400 mb-2 font-semibold font-mono uppercase tracking-wider text-[10px]">Canaux d'Affiliation Autorisés</label>
                            <div className="flex flex-wrap gap-2">
                              {['Amazon Associates', 'ClickBank', 'Stripe Checkout', 'ShareASale', 'Awin'].map(channel => {
                                const selected = selectedChannels.includes(channel);
                                return (
                                  <button
                                    key={channel}
                                    type="button"
                                    onClick={() => {
                                      if (selected) {
                                        setSelectedChannels(selectedChannels.filter(c => c !== channel));
                                      } else {
                                        setSelectedChannels([...selectedChannels, channel]);
                                      }
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono border transition-all ${selected ? 'bg-cyan-950/60 text-cyan-400 border-cyan-800' : 'bg-[#121212] text-zinc-500 border-transparent hover:border-[#1f1f1f]'}`}
                                  >
                                    {selected ? '● ' : '○ '} {channel}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section C: YouTube Automation & APIs de Production */}
                      <div className="pt-6 border-t border-[#1f1f1f]">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-1.5 h-3 bg-red-500 rounded"></span>
                          <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#9b51e0]">3. YouTube Automation & APIs de Production (Liaison Réelle)</h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                          <div>
                            <label className="block text-slate-400 mb-1 font-semibold font-mono uppercase tracking-wider text-[10px]">Identifiant de Chaîne YouTube</label>
                            <input
                              type="text"
                              value={youtubeChannelId}
                              onChange={(e) => setYoutubeChannelId(e.target.value)}
                              placeholder="Ex: UCxxxxxxxxx"
                              className="w-full bg-[#121212] border border-[#1f1f1f] text-white rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-cyan-400 font-mono"
                            />
                            <span className="text-[9px] text-slate-500 mt-1 block">Active le flux d'automatisation vidéo AI direct.</span>
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1 font-semibold font-mono uppercase tracking-wider text-[10px]">Clé API Google Cloud / Console</label>
                            <input
                              type="password"
                              value={youtubeApiKey}
                              onChange={(e) => setYoutubeApiKey(e.target.value)}
                              placeholder="Ex: AIzaSyD..."
                              className="w-full bg-[#121212] border border-[#1f1f1f] text-white rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-cyan-400 font-mono"
                            />
                            <span className="text-[9px] text-slate-500 mt-1 block">Requis pour publier automatiquement les vidéos via l'API YouTube Data v3.</span>
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1 font-semibold font-mono uppercase tracking-wider text-[10px]">Clé Amazon API (Access Key ID)</label>
                            <input
                              type="text"
                              value={amazonAccessKeyId}
                              onChange={(e) => setAmazonAccessKeyId(e.target.value)}
                              placeholder="Ex: AKIAIOSFODNN7EXAMPLE"
                              className="w-full bg-[#121212] border border-[#1f1f1f] text-white rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-cyan-400 font-mono"
                            />
                            <span className="text-[9px] text-slate-500 mt-1 block">Clé d'accès PA API Amazon Associates pour récupérer les produits en temps réel.</span>
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1 font-semibold font-mono uppercase tracking-wider text-[10px]">Clé Secrète Amazon API (Secret Key)</label>
                            <input
                              type="password"
                              value={amazonSecretKey}
                              onChange={(e) => setAmazonSecretKey(e.target.value)}
                              placeholder="••••••••••••••••••••••••••••••••"
                              className="w-full bg-[#121212] border border-[#1f1f1f] text-white rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-cyan-400 font-mono"
                            />
                            <span className="text-[9px] text-slate-500 mt-1 block">Clé secrète d'accès PA API Amazon Associates.</span>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-slate-400 mb-1 font-semibold font-mono uppercase tracking-wider text-[10px]">ID de Projet Google Cloud</label>
                            <input
                              type="text"
                              value={googleCloudProjectId}
                              onChange={(e) => setGoogleCloudProjectId(e.target.value)}
                              placeholder="Ex: aura-cloud-421"
                              className="w-full bg-[#121212] border border-[#1f1f1f] text-white rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-cyan-400 font-mono"
                            />
                            <span className="text-[9px] text-slate-500 mt-1 block">Projet Google Cloud lié pour héberger les quotas API sans blocage.</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Column 3: Autopilot Controls & Speed Slider */}
                    <div className="space-y-6 bg-[#0b0b0b] border border-[#1f1f1f] rounded-2xl p-6">
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-1.5 h-3 bg-purple-500 rounded"></span>
                        <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#9b51e0]">3. Paramètres de l'Autopilote</h4>
                      </div>

                      {/* Toggle Principal Autopilot */}
                      <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="block text-xs font-bold text-white uppercase font-mono text-[10px]">Autopilot Principal</span>
                          <span className="block text-[9px] text-slate-400 mt-1">Automatise le trafic organique et récolte de commissions.</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={autoPilotEnabled}
                            onChange={(e) => setAutoPilotEnabled(e.target.checked)}
                          />
                          <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                        </label>
                      </div>

                      {/* Slider simSpeed */}
                      <div className="space-y-2 bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl">
                        <div className="flex justify-between items-center text-xs font-mono font-semibold">
                          <span className="text-slate-400 uppercase text-[9px]">Veau de Compression Temporelle</span>
                      <span className="text-cyan-400">{syncVelocity}x vélocité</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={syncVelocity}
                      onChange={(e) => setSyncVelocity(Number(e.target.value))}
                          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                        <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                          <span>1x (Calme)</span>
                          <span>5x (Standard)</span>
                          <span>10x (Agressif)</span>
                        </div>
                        <span className="text-[9px] text-slate-400 block pt-1 font-sans">
                          Accélère l'intervalle temporel de notre robot d'arbitrage financier.
                        </span>
                      </div>

                      {/* Autonomy Level Indicator / Preset */}
                      <div className="space-y-2 bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl">
                        <span className="block text-[9px] uppercase font-bold text-slate-400 font-mono">Niveau d'Autonomie Aura</span>
                        <div className="grid grid-cols-3 gap-1.5 pt-1">
                          {[1, 2, 3].map(level => {
                            const active = autonomyLevel === level;
                            return (
                              <button
                                key={level}
                                type="button"
                                onClick={() => setAutonomyLevel(level)}
                                className={`py-2 px-1 rounded-lg text-center border font-sans font-extrabold text-[10px] transition-all cursor-pointer ${active ? 'bg-[#9b51e0]/10 border-[#9b51e0] text-[#9b51e0]' : 'bg-transparent border-[#1f1f1f] text-zinc-500 hover:border-[#2a2a2a]'}`}
                              >
                                Niv. {level}
                                <span className="block text-[7px] font-normal text-zinc-400 font-mono mt-0.5">
                                  {level === 1 ? 'Manuel' : level === 2 ? 'Semi' : 'Autonome'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-[9px] text-slate-400 leading-normal pt-1 font-sans">
                          {autonomyLevel === 3 ? "Aura prend 100% des décisions d'arbitrage sans solliciter d'action humaine." : autonomyLevel === 2 ? "Aura requiert une intervention humaine uniquement en cas de doutes d'incidents complexes." : "Aura recommande uniquement, aucune décision n'est exécutée seule."}
                        </p>
                      </div>

                      {/* Advanced Features Toggles */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="block text-[10px] font-semibold text-slate-300">Auto-Heal des Serveurs</span>
                            <span className="block text-[8px] text-slate-500">Heuristiques contre pannes et goulots d'étranglement</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={autoHealEnabled}
                              onChange={(e) => setAutoHealEnabled(e.target.checked)}
                            />
                            <div className="w-9 h-4.5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-500"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="block text-[10px] font-semibold text-slate-300">Edge Caching de Réponses API</span>
                            <span className="block text-[8px] text-slate-500">Cache global Vercel V8 pour livraison instantanée</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={edgeCacheEnabled}
                              onChange={(e) => setEdgeCacheEnabled(e.target.checked)}
                            />
                            <div className="w-9 h-4.5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-500"></div>
                          </label>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#1f1f1f]">
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 font-bold text-white rounded-lg tracking-wider shadow-lg transition-all text-xs uppercase"
                        >
                          Enregistrer Directives Autonomes
                        </button>
                      </div>

                    </div>

                  </form>

                  {/* Interactive Autopilot Terminal Simulator */}
                  <div className="bg-[#0b0b0b] border border-[#1f1f1f] rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div className="flex items-center gap-2.5">
                        <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <div>
                          <h4 className="text-xs uppercase text-white font-extrabold font-mono tracking-wider">
                            Live Terminal - Log d'Arbitrage et Économétrie d'Aura
                          </h4>
                          <span className="text-[9px] text-[#4af626] font-mono">FRÉQUENCE CONTRÔLEUR PAR TICK D'AUTOPILOTE</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={triggerTick}
                        disabled={loadingAction}
                        className="py-1.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 text-slate-100 rounded-lg text-[10px] font-mono transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loadingAction ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                        ) : (
                          <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                        )}
                        Simuler un tick d'Autopilotage d'Aura
                      </button>
                    </div>

                    {/* Dark retro console terminal list */}
                    <div className="bg-[#030303] border border-[#121212] rounded-xl p-4 font-mono text-[10px] leading-relaxed text-[#4af626]/80 space-y-1.5 shadow-inner select-none max-h-56 overflow-y-auto">
                      <div className="border-b border-zinc-900 pb-1 flex items-center justify-between text-zinc-500">
                        <span>SYS LOG TERMINAL</span>
                        <span className="animate-pulse">● LIVE TELEMETRY LOG</span>
                      </div>
                      
                      {/* Generative smart logs based on active configurations */}
                      <div>[AURA SYSTEM SETUP] Starting cognitive thread context for robot routing...</div>
                      <div className="text-cyan-400">[AUTOPILOTE ROUTINE] 🟢 Système actif de surveillance sur la niche : [{niche || 'Génération de Revenus'}]</div>
                      <div className="text-emerald-400">[IA MOTEUR] 🤖 Rédaction automatique raccordée sur : [{modelType}] | Ton : [{generationTone}] | Densité : [{generationDensity}]</div>
                      <div className="text-yellow-400">[MONÉTISATION] 💰 Arbitrage programmé d'affiliation : [{selectedChannels.join(', ') || 'Aucun d\'affiliation connecté'}] (Com. Minimum exigée : {minCommission}%)</div>
                      <div className="text-indigo-400">[AUDIENCE SEGMENT] 🎯 Prédicteurs heuristiques paramétrés pour cibler l'audience : [{targetAudience}]</div>
                      <div className="text-purple-400">[EDGE SERVICE] ⚡ Vélocité de synchronisation temps-réel réglée à {syncVelocity}x | Niveau d'autonomie centralisé : [{autonomyLevel}/5]</div>
                      {autoHealEnabled ? (
                        <div className="text-[#39ff14]">[SRE HEURISTIQUE] 🛡️ Agent de diagnostic système sismographique activé (Autoremédiation des pannes : ACTIF)</div>
                      ) : (
                        <div className="text-rose-500">[SRE HEURISTIQUE] ⚠️ Auto-Heal est hors service. Vigilance requise en cas d'erreurs d'uptime.</div>
                      )}
                      
                      {/* State simulation active items */}
                      {state && state.logs && state.logs.slice(0, 3).map((log, index) => (
                        <div key={log.id || index} className="text-zinc-400">
                          [{new Date(log.timestamp).toLocaleTimeString()}] [{log.agentName?.toUpperCase() || 'AGENT'}] {log.message}
                        </div>
                      ))}

                      <div className="text-cyan-500 animate-pulse pt-1">
                        &gt; Aura_Engine: en attente du déclenchement du prochain cycle autonome (Vélocité active: {syncVelocity}x, Uptime: 99.99%)... _
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {activeTab === 'tuning' && state && (
                <div className="animate-fade-in">
                  <EliteTuningTab
                    state={state}
                    onAddLog={(message, type) => {
                      setState(prev => {
                        if (!prev) return null;
                        return {
                          ...prev,
                          logs: [
                            {
                              id: `elite-log-${Date.now()}-${Math.random()}`,
                              timestamp: new Date().toISOString(),
                              agentId: 'comptable',
                              agentName: 'Aura Elite Engine',
                              message,
                              type
                            },
                            ...prev.logs
                          ]
                        };
                      });
                    }}
                    onOptimizeMetric={(type, boost) => {
                      setState(prev => {
                        if (!prev) return null;
                        const currentMetrics = prev.metrics;
                        
                        let totalRevenue = currentMetrics.totalRevenue;
                        let mrr = currentMetrics.mrr;
                        let totalVisitors = currentMetrics.totalVisitors;
                        let conversionRate = currentMetrics.conversionRate;

                        if (type === 'revenue') totalRevenue += boost;
                        if (type === 'mrr') mrr += boost;
                        if (type === 'visitors') totalVisitors += boost;
                        if (type === 'cvr') conversionRate = Math.min(conversionRate + boost, 100);

                        return {
                          ...prev,
                          metrics: {
                            ...currentMetrics,
                            totalRevenue,
                            mrr,
                            totalVisitors,
                            conversionRate
                          }
                        };
                      });
                    }}
                    playSynthBeep={playSynthBeep}
                  />
                </div>
              )}

              {activeTab === 'autofinance' && state && (
                <div className="animate-fade-in">
                  <AutoFinanceTab
                    state={state}
                    onUpdateState={(newState) => setState(newState)}
                    playSynthBeep={playSynthBeep}
                  />
                </div>
              )}

              {activeTab === 'fourpillars' && state && (
                <div className="animate-fade-in">
                  <FourPillarsTab
                    state={state}
                    onUpdateState={(newState) => setState(newState)}
                    playSynthBeep={playSynthBeep}
                  />
                </div>
              )}

            </div>
          </div>
        </section>

        {/* Right Asidepanel layout: Tactical Recommendations */}
        <aside className="w-full xl:w-72 flex flex-col gap-6 shrink-0">
          <div 
            onClick={() => { playSynthBeep('click'); setShowComptableModal(true); }}
            className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-5 cursor-pointer hover:border-amber-500/40 hover:scale-[1.01] hover:shadow-2xl hover:z-50 transition-all duration-300 relative group/comptable"
          >
            {/* Detailed Cyber Tooltip */}
            <div className="absolute right-0 sm:left-0 bottom-full mb-2 hidden group-hover/comptable:block w-72 bg-zinc-900 border border-zinc-800 text-slate-200 text-xs p-3.5 rounded-xl shadow-2xl z-[100] pointer-events-none normal-case font-sans leading-relaxed">
              <span className="font-extrabold text-amber-400 block mb-1.5 font-mono uppercase tracking-wider">🔬 AGENT COMPTABLE STRATÉGIQUE</span>
              Analyse en direct l'efficience des flux financiers nets. Audite les sources d'affiliation, optimise la taxation et génère des rapports cryptographiques d'intégrité comptable de marque.
            </div>

            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 group-hover/comptable:text-amber-400 transition-colors">
              <Sparkles className="w-4 h-4 text-[#00f2fe] group-hover/comptable:text-amber-400" />
              Conseils de l'Agent Comptable <Info className="w-3.5 h-3.5 text-slate-500 opacity-60 inline animate-pulse" />
            </h3>
            <div className="space-y-4 font-sans text-xs">
              <div className="border-l-2 border-[#00f2fe] pl-3">
                <div className="text-xs font-bold text-slate-200">Scale de l'Agent Plume</div>
                <div className="text-[10px] text-gray-400 mt-1">Suggérez à l'Agent Plume de cibler "les meilleurs placements financiers 2026" pour doper les commissions.</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('agents');
                    setNiche('Stratégies d\'investissement Elite 2026');
                  }}
                  className="mt-2 text-[9px] px-2.5 py-1 bg-cyan-950 text-[#00f2fe] font-bold rounded border border-cyan-800"
                >
                  CONFIGURER DIRECTEMENT
                </button>
              </div>
              
              <div className="border-l-2 border-slate-700 pl-3">
                <div className="text-xs font-bold text-slate-200">Nouvelle opportunité validée</div>
                <div className="text-[10px] text-gray-400 mt-1">L'Agent Mercato a détecté que le template Notion a un taux de revente de 98% de marge pure.</div>
                <span className="text-[9px] text-[#00f2fe] italic font-mono block mt-1">En cours d'indexation Google...</span>
              </div>
            </div>
          </div>

          {/* Interactive tactical radar representation with hover geo nodes */}
          <div className="flex-1 bg-gradient-to-b from-[#0d0d0d] to-[#050505] border border-[#1f1f1f] rounded-xl p-5 flex flex-col justify-between relative overflow-visible hover:z-50 group/geolo cursor-help">
            
            {/* Card Level Floating Guide */}
            <div className="absolute right-0 bottom-full mb-2 hidden group-hover/geolo:block w-[280px] bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl shadow-2xl text-[10px] text-slate-300 z-[100] leading-relaxed font-sans normal-case">
              <span className="font-extrabold text-cyan-400 block mb-1.5 font-mono uppercase tracking-wider">🗺️ RADAR SÉMANTIQUE DE GÉOLOCALISATION</span>
              Cartographie en direct la provenance de votre audience organique et de vos payeurs Stripe. Survolez chaque balise lumineuse du radar pour inspecter sa performance et sa part de trafic par nœuds.
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center justify-between">
                <span>Géolocalisation du Trafic</span>
                <span className="text-cyan-400 animate-pulse text-xs font-bold">(ℹ️)</span>
              </h3>
              <div className="relative h-44 bg-[#0a0a0a] rounded border border-white/5 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                   <div className="w-24 h-24 border border-cyan-500 rounded-full animate-pulse"></div>
                   <div className="absolute w-40 h-40 border border-cyan-900 rounded-full"></div>
                </div>
                {/* Simulated geographic nodes with hover guides */}
                <div className="absolute top-10 left-12 group/node1 cursor-pointer">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping absolute"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full relative"></div>
                  {/* Node Tooltip */}
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover/node1:block w-44 bg-[#050505] border border-cyan-800/80 p-2.5 rounded-lg shadow-xl text-[9px] font-mono text-cyan-300 z-[120] pointer-events-none">
                    <span className="font-bold text-white block">🇨🇦 NŒUD AMÉRIQUE</span>
                    • Canada et États-Unis<br />
                    • Volume trafic : 48%<br />
                    • CVR : 3.4% (Supérieur)
                  </div>
                </div>
                
                <div className="absolute bottom-16 right-16 group/node2 cursor-pointer">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping absolute"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full relative"></div>
                  {/* Node Tooltip */}
                  <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 hidden group-hover/node2:block w-44 bg-[#050505] border border-emerald-800/80 p-2.5 rounded-lg shadow-xl text-[9px] font-mono text-emerald-300 z-[120] pointer-events-none">
                    <span className="font-bold text-white block">🇪🇺 NŒUD EUROPE</span>
                    • France / BE / SUISSE<br />
                    • Volume trafic : 36%<br />
                    • Performance Uptime: 100%
                  </div>
                </div>
                
                <div className="absolute top-28 left-28 group/node3 cursor-pointer">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping absolute"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full relative"></div>
                  {/* Node Tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/node3:block w-44 bg-[#050505] border border-purple-800/80 p-2.5 rounded-lg shadow-xl text-[9px] font-mono text-purple-300 z-[120] pointer-events-none">
                    <span className="font-bold text-white block">🌏 NŒUD LATAM / ASIE</span>
                    • Marchés émergents<br />
                    • Volume trafic : 16%<br />
                    • Croissance: +22% / mois
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-[11px] text-gray-500 space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span>Canaux de redirection:</span> 
                <span className="text-white">Google Search SE</span>
              </div>
              <div className="flex justify-between">
                <span>Total de transactions:</span> 
                <span className="text-white">{state.transactions.length} ventes</span>
              </div>
              <div className="flex justify-between">
                <span>Moteur de génération:</span> 
                <span className="text-white">Gemini Pro 1.5 Node</span>
              </div>
            </div>
          </div>

          <button
            onClick={openPayout}
            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 rounded-xl text-xs font-bold tracking-widest text-white shadow-lg text-center"
          >
            S'ENCAISSER DIRECTEMENT ({state.metrics.totalRevenue.toFixed(2)} CA$)
          </button>
        </aside>

      </main>

      {/* Payout Withdrawal Dialog Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] border border-[#1f1f1f] w-full max-w-lg rounded-2xl relative overflow-hidden p-6 font-sans">
            <button
              onClick={() => setShowPayoutModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {payoutStep === 'idle' && (
              <form onSubmit={triggerPayout} className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-cyan-950 text-[#00f2fe] rounded-lg">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-extrabold text-lg">Retrait Express de Fonds - Aura Canada</h3>
                    <p className="text-xs text-slate-400">Versement de votre chiffre d'affaires direct sur votre compte EFT ou crypto sécurisé.</p>
                  </div>
                </div>

                {/* Method selector */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Option de Versement</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-[#101010] rounded-lg border border-zinc-900">
                    <button
                      type="button"
                      onClick={() => {
                        setPayoutMethod('eft');
                        const bankInfo = state?.autoFineConfig ? 
                          `${state.autoFineConfig.realBankTransit}-${state.autoFineConfig.realBankInst}-${state.autoFineConfig.realBankAccount}` : 
                          '12345-001-1234567';
                        setPayoutAddress(bankInfo);
                      }}
                      className={`py-2 px-3 rounded-md text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 ${
                        payoutMethod === 'eft' ? 'bg-[#1a1a1a] text-[#00f2fe] border border-zinc-850' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      🏦 CANADA EFT
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPayoutMethod('crypto');
                        setPayoutAddress('bc1qxy2kg3tk9g7nduhstfsu35rcg0astc3rtsp');
                      }}
                      className={`py-2 px-3 rounded-md text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 ${
                        payoutMethod === 'crypto' ? 'bg-[#1a1a1a] text-amber-500 border border-zinc-850' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      ₿ Bitcoin (BTC)
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-850/60 font-mono text-center">
                  <span className="text-[10px] text-slate-500 uppercase block tracking-wider">Solde disponible</span>
                  <span className="text-3xl font-extrabold text-white text-emerald-400">{payoutAmount.toFixed(2)} CA$</span>
                  {payoutMethod === 'crypto' ? (
                    <span className="block text-[10px] text-amber-500 mt-1 font-bold">
                      Conversion estimée : (~{(payoutAmount / 65000).toFixed(6)} BTC)
                    </span>
                  ) : (
                    <span className="block text-[9px] text-[#00f2fe] mt-1">Frais de traitement EFT (Canada) : Offerts</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    {payoutMethod === 'crypto' ? 'Adresse du Portefeuille Bitcoin (BTC)' : 'Compte canadien (Transit-Inst-Compte)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={payoutAddress}
                    onChange={(e) => setPayoutAddress(e.target.value)}
                    placeholder={payoutMethod === 'crypto' ? "Ex: bc1qxy2kg3tk9g7nduhstfsu35rcg0astc3rtsp" : "Ex: 12345-001-1234567..."}
                    className="w-full bg-[#050505] border border-slate-800 text-white rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:opacity-90 transition-all text-center"
                >
                  Déclencher le versement instantané
                </button>
              </form>
            )}

            {payoutStep === 'processing' && (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h4 className="text-white font-semibold">Validation de la liasse comptable sémantique...</h4>
                <p className="text-xs text-slate-400">Génération des factures automatiques, calcul de l'arbitrage TVA et transfert bancaire cryptographique.</p>
              </div>
            )}

            {payoutStep === 'success' && (
              <div className="text-center py-6 space-y-4">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-white font-extrabold text-lg">Retrait initié avec succès !</h4>
                <p className="text-xs text-slate-300">
                  Votre versement instantané sans commission est en cours de traitement. L'Agent Comptable a mis à jour le grand livre.
                </p>
                <button
                  onClick={() => setShowPayoutModal(false)}
                  className="px-6 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Agent Details & Configuration Modal */}
      {selectedAgentId && state && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b0b0b] border border-[#1f1f1f] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
            <div className="p-6">
              {(() => {
                const agent = state.agents.find(a => a.id === selectedAgentId);
                if (!agent) return null;
                return (
                  <>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                          <Cpu className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white uppercase tracking-wider font-sans">
                            {agent.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-cyan-400 font-mono">{agent.role}</span>
                            <span className="text-slate-600 text-[10px]">|</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                              agent.status === 'working' ? 'text-amber-400 bg-amber-950/60' : 'text-emerald-400 bg-slate-950 border border-slate-800'
                            }`}>
                              STATUS: {agent.status === 'working' ? 'EN OPÉRATION' : 'EN ATTENTE'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedAgentId(null)}
                        className="text-zinc-500 hover:text-white transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Description & KPI */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Fonction & Description</h4>
                          <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl text-sm justify-between text-slate-300">
                            {agent.description}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                            <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Tâches Exécutées</div>
                            <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">{agent.outputCount.toLocaleString()}</div>
                          </div>
                          <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                            <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Précision IA</div>
                            <div className="text-xl font-bold text-[#00f2fe] mt-1 font-mono">99.8%</div>
                          </div>
                        </div>
                      </div>

                      {/* Configurations */}
                      <div className="space-y-4">
                        <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Options de Configuration</h4>
                        
                        <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-semibold text-slate-200">Autonomie Maximale</div>
                              <div className="text-[10px] text-slate-500">Autorise la prise de décision financière sans validation</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-semibold text-slate-200">Mode Hyper-Threading</div>
                              <div className="text-[10px] text-slate-500">Alloue des ressources serveurs additionnelles</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked={agent.status === 'working'} />
                              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-[#1f1f1f]">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-400">Fréquence de Rapport (Heures)</span>
                              <span className="text-xs text-white font-mono">2h</span>
                            </div>
                            <input type="range" min="1" max="24" defaultValue="2" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Agent Comptable Details & Configuration Modal */}
      {showComptableModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b0b0b] border border-[#1f1f1f] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-indigo-600"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-amber-400">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider font-sans">
                      Agent Comptable
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-amber-500 font-mono">Expert Financier et Arbitrage Sémantique</span>
                      <span className="text-slate-600 text-[10px]">|</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800">
                        STATUS: EN OPÉRATION
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowComptableModal(false)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Description & KPI */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Fonction & Description</h4>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl text-sm justify-between text-slate-300">
                      Surveille et alloue le capital généré. Analyse les taux de conversion des différents agents (Plume, Mercato) et fournit des conseils tactiques de développement. Gère également le fractionnement des fonds via le coffre-fort fiscal intelligent et le réinvestissement autonome.
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Recommandations Mises en Oeuvre</div>
                      <div className="text-xl font-bold text-amber-400 mt-1 font-mono">412</div>
                    </div>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Ajustements Fiscaux</div>
                      <div className="text-xl font-bold text-indigo-400 mt-1 font-mono">148</div>
                    </div>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Fonds Réinvestis</div>
                      <div className="text-lg font-bold text-emerald-400 mt-1 font-mono">€18,240</div>
                    </div>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Taux de Rétention(ROI)</div>
                      <div className="text-lg font-bold text-[#00f2fe] mt-1 font-mono">+12.4%</div>
                    </div>
                  </div>
                </div>

                {/* Configurations */}
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Paramètres d'Optimisation Fiscale et Tactique</h4>
                  
                  <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Arbitrage Sémantique Automatique</div>
                        <div className="text-[10px] text-slate-500">Autorise l'Agent à pivoter la niche si l'audience baisse pour conserver un ROI positif</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={comptableConfig.arbitrage}
                          onChange={() => setComptableConfig(prev => ({ ...prev, arbitrage: !prev.arbitrage }))}
                        />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Réinvestissement Actif (Venture Mode)</div>
                        <div className="text-[10px] text-slate-500">Réinvestit 15% des profits dans l'achat de mots-clés d'acquisition haute-conversion</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={comptableConfig.venture}
                          onChange={() => setComptableConfig(prev => ({ ...prev, venture: !prev.venture }))}
                        />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Mode Hyper-Diversification</div>
                        <div className="text-[10px] text-slate-500">Exploite des canaux secondaires à faible rendement mais à haut volume</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={comptableConfig.hyperDiv}
                          onChange={() => setComptableConfig(prev => ({ ...prev, hyperDiv: !prev.hyperDiv }))}
                        />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                      </label>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#1f1f1f]">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Degré d'Aversion au Risque (%)</span>
                        <span className="text-xs text-white font-mono">20%</span>
                      </div>
                      <input type="range" min="0" max="100" defaultValue="20" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Status Footer conforming strictly to Design Requirements */}
      <footer id="footer-status" className="h-8 bg-[#0a0a0a] border-t border-[#1f1f1f] px-6 flex items-center justify-between text-[10px] text-gray-600 font-mono shrink-0">
        <div className="flex gap-4">
          <span>AURA_ENGINE: V2.4-PRO</span>
          <span className="hidden sm:inline">REGION: BANQUE_SEPA_GLOBAL</span>
          <span>SECURE: AES-256-GCM-AUTO</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-emerald-500">●</span> TOUS LES FLUX DE REVENUS PASSIFS SYNCHRONISÉS IP
        </div>
      </footer>

      <AuraAdminAgent />
    </div>
  </ErrorBoundary>
);
}
