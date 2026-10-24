import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, MessageSquare, Sparkles, User, ShieldCheck } from 'lucide-react';
import { ChatMessage } from '../types';
import { apiFetch } from '../utils';

export default function AuraAdminAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await apiFetch('/api/aura-admin/history');
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.history)) {
            setChatHistory(data.history);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'historique Aura Admin:", err);
      }
    };
    fetchChatHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await apiFetch('/api/aura-admin/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: userMsg.message
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add text-to-speech for the response
        if (data && data.message && 'speechSynthesis' in window) {
          let speechText = data.message;
          speechText = speechText.replace(/[\*\_\[\]]/g, ""); // Strip markdown for better speech
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

        // The server response updates the chatHistory state, make sure we merge it with the last recorded server agent response
        setChatHistory((prev) => {
          // Filter out user message index if needed, but since it is already pushed to frontend, we just append newest message
          const withoutLastUser = prev.slice(0, -1);
          return [...withoutLastUser, userMsg, data];
        });
      } else {
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          sender: 'agent',
          message: "Désolé, je rencontre une difficulté technique pour accéder à mes modèles neuronaux. Vérifiez votre connexion ou votre clé API.",
          timestamp: new Date().toISOString(),
        };
        setChatHistory((prev) => [...prev, errorMsg]);
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'agent',
        message: "Erreur de communication avec le Superviseur Aura.",
        timestamp: new Date().toISOString(),
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        id="aura-admin-toggle"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30 z-50 text-white cursor-pointer"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
        {!isOpen && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#050505] animate-pulse"
          />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="aura-admin-window"
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 w-[90vw] sm:w-[400px] h-[550px] bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#1f1f1f] bg-[#0d0d0d] flex items-center justify-between relative group cursor-help">
              <div className="flex items-center gap-3 group/admin cursor-help relative">
                <div className="w-10 h-10 bg-cyan-950/40 rounded-xl flex items-center justify-center border border-cyan-800/30">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                </div>
                {/* Tooltip Content */}
                <div className="absolute left-0 top-[120%] w-[320px] bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-2xl text-[11px] text-slate-300 z-50 leading-relaxed font-sans normal-case opacity-0 group-hover/admin:opacity-100 transition-opacity pointer-events-none">
                  <span className="font-extrabold text-cyan-400 block mb-1 font-mono uppercase tracking-wider">🤖 AGENT SUPERVISEUR CENTRAL</span>
                  Le Superviseur Aura garantit l'intégrité de l'écosystème. Il orchestre les microservices, surveille la trésorerie Stripe et corrige automatiquement les bugs d'indexation.
                  <div className="mt-3 pt-2 border-t border-zinc-800 flex gap-2">
                    <button className="text-[9px] bg-zinc-800 p-1.5 rounded text-zinc-300">Nettoyage Cache (Auto)</button>
                    <button className="text-[9px] bg-zinc-800 p-1.5 rounded text-zinc-300">Logs (Export JSON)</button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1">
                    Superviseur Aura <span className="text-cyan-400 font-bold animate-pulse text-xs">(ℹ️)</span>
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span>ADMINISTRATEUR CENTRAL CONNECTÉ</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800"
            >
              {chatHistory.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3 px-6">
                  <div className="w-12 h-12 bg-cyan-950/20 rounded-full flex items-center justify-center mb-2">
                    <Sparkles className="w-6 h-6 text-cyan-500/50" />
                  </div>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    Bonjour Commandant. Comment puis-je vous assister dans l'optimisation de votre empire Aura AI aujourd'hui ?
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {["État de la flotte", "Stratégie SEO", "Rapport de Trésorerie"].map((hint) => (
                      <button
                        key={hint}
                        onClick={() => setMessage(hint)}
                        className="text-[10px] px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full text-zinc-400 transition"
                      >
                        {hint}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {chatHistory.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                      msg.sender === 'user' 
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-400' 
                        : 'bg-cyan-950/40 border-cyan-800/30 text-cyan-400'
                    }`}>
                      {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-cyan-600 text-white rounded-tr-none' 
                        : 'bg-[#151515] border border-[#1f1f1f] text-zinc-300 rounded-tl-none'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-800/30 text-cyan-400 flex items-center justify-center">
                      <Bot className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="bg-[#151515] border border-[#1f1f1f] p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                      <span className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce"></span>
                      <span className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-[#0d0d0d] border-t border-[#1f1f1f]">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Posez votre question au Superviseur..."
                  className="w-full bg-[#050505] border border-[#1f1f1f] text-white rounded-xl py-3 pl-4 pr-12 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition placeholder:text-zinc-700"
                />
                <button
                  type="submit"
                  disabled={isLoading || !message.trim()}
                  className="absolute right-2 top-1.5 p-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:bg-zinc-800 text-white rounded-lg transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[9px] text-zinc-600 text-center mt-3 font-mono">
                PROTOCOLE DE SÉCURITÉ AURA AI ACTIF ● CRYPTAGE AES-256
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
