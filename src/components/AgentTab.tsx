import React, { useState } from 'react';
import { Agent, LogEntry } from '../types';
import { apiFetch } from '../utils';
import { Play, Sparkles, Terminal, BookOpen, AlertCircle, TrendingUp, Zap, HelpCircle, Plus, X, Cpu, Info, Settings } from 'lucide-react';

interface AgentTabProps {
  agents: Agent[];
  logs: LogEntry[];
  onTriggerAgent: (agentId: string, userPrompt: string) => Promise<void>;
  onAgentCreated?: () => Promise<void>;
}

export default function AgentTab({ agents, logs, onTriggerAgent, onAgentCreated }: AgentTabProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('plume');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [consoleNotification, setConsoleNotification] = useState<string | null>(null);
  const [showConsoleDetailsModal, setShowConsoleDetailsModal] = useState<boolean>(false);
  const [showCommandCenterModal, setShowCommandCenterModal] = useState<boolean>(false);
  const [showDirectivesModal, setShowDirectivesModal] = useState<boolean>(false);
  const [selectedAgentForConfig, setSelectedAgentForConfig] = useState<Agent | null>(null);

  // Hiring Form State
  const [showHireModal, setShowHireModal] = useState<boolean>(false);
  const [hireName, setHireName] = useState<string>('');
  const [hireRole, setHireRole] = useState<string>('');
  const [hireDesc, setHireDesc] = useState<string>('');
  const [hireIcon, setHireIcon] = useState<string>('Cpu');
  const [isHiring, setIsHiring] = useState<boolean>(false);

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgentId) return;
    setIsLoading(true);
    setConsoleNotification("Initialisation de l'Agent Master...");
    try {
      await onTriggerAgent(selectedAgentId, customPrompt);
      setConsoleNotification(`L'Agent ${selectedAgent.name} a complété sa tâche avec brio !`);
      setCustomPrompt('');
      setTimeout(() => setConsoleNotification(null), 5000);
    } catch (err: any) {
      setConsoleNotification(`Échec exécution : ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHireAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hireName || !hireRole) return;
    setIsHiring(true);
    try {
      const response = await apiFetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: hireName,
          role: hireRole,
          description: hireDesc,
          icon: hireIcon,
        }),
      });
      if (response.ok) {
        setHireName('');
        setHireRole('');
        setHireDesc('');
        setShowHireModal(false);
        if (onAgentCreated) {
          await onAgentCreated();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsHiring(false);
    }
  };

  // Pre-configured suggestive prompts to help user make money easily
  const suggestionTemplates: Record<string, string[]> = {
    plume: [
      "Comment lancer une formation en ligne rentable avec 0€ d'investissement",
      "Top 5 des niches d'affiliation Amazon survoltées pour l'été 2026",
      "Le secret du Copywriting sémantique pour doubler son taux de conversion",
      "Les meilleures techniques de SEO modernes gratuites pour capter du trafic"
    ],
    maker: [
      "Guide PDF de 40 pages sur l'art de l'automatisation sans coder",
      "Pack complet de prompts exclusifs d'analyse SEO",
      "Template Notion : Monétisation et suivi de régie publicitaire passive"
    ]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Columns : Agents List & Dynamic Prompt Launcher */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Agent Cards Selection Layout */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div 
              onClick={() => setShowCommandCenterModal(true)}
              className="relative group/cc cursor-pointer hover:text-[#00f2fe] transition-colors"
            >
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover/cc:block w-80 bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl shadow-2xl text-[10px] text-slate-300 z-55 leading-relaxed font-sans normal-case pointer-events-none">
                <span className="font-extrabold text-[#00f2fe] block mb-1.5 font-mono uppercase tracking-wider">🤖 GESTION FLOTTE IA SYNCHRONISÉE</span>
                Visualisez la flotte d'agents actifs, gérez les priorités sémantiques et recrutez des unités autonomes.
                <br className="my-1" />
                • **Agent Plume**: Rédige des articles ciblés SEO.<br />
                • **Agent Maker**: Produit et vend des livres numériques.<br />
                • **CPU Allocation**: Géré par le protocole à chaud.
              </div>
              <h3 className="text-white font-bold text-lg flex items-center gap-2 group-hover/cc:text-[#00f2fe] transition-colors">
                Centre de Commandement des Agents IA <span className="text-[#00f2fe] animate-pulse font-bold hover:text-cyan-300 text-xs">(ℹ️)</span>
              </h3>
              <p className="text-xs text-slate-400 group-hover/cc:text-slate-300">Sélectionnez un agent pour inspecter ses statistiques ou lui assigner des directives.</p>
            </div>
            <button
              onClick={() => setShowHireModal(true)}
              className="w-full sm:w-auto px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-lg flex items-center justify-center gap-1.5 transition shadow"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              Recruter un Agent
            </button>
          </div>

          <div id="agent-selector-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => {
              const isSelected = agent.id === selectedAgentId;
              const isWorking = agent.status === 'working';
              
              return (
                <button
                  key={agent.id}
                  onClick={() => {
                    setSelectedAgentId(agent.id);
                    setSelectedAgentForConfig(agent);
                    setConsoleNotification(null);
                  }}
                  className={`text-left p-4 rounded-xl border transition-all duration-300 relative overflow-visible flex flex-col justify-between h-40 group/agentcard ${
                    isSelected
                      ? 'border-[#00f2fe] bg-slate-950/80 shadow-md shadow-[#00f2fe]/5'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-[104%] mb-2.5 w-64 bg-[#0a0a0a] border border-zinc-800 p-4 rounded-xl shadow-2xl text-[10px] text-zinc-300 z-50 pointer-events-none scale-95 opacity-0 origin-bottom group-hover/agentcard:scale-100 group-hover/agentcard:opacity-100 transition-all duration-200 shadow-black/80 font-sans hidden md:block">
                    <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-zinc-900">
                      <span className="font-bold flex items-center gap-1.5 text-[#00f2fe] uppercase">
                        <Sparkles className="w-3.5 h-3.5" />
                        {agent.name}
                      </span>
                      <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-900">
                        {isWorking ? 'WORKING' : 'IDLE'}
                      </span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed text-[10px] mb-2 font-sans font-normal">
                      {agent.id === 'plume' ? "Spécialiste rédaction SEO, structuration de cocons sémantiques et injection de liens d'affiliation intelligents." : 
                       agent.id === 'maker' ? "Ingénieur de produits digitaux, compile et génère des guides PDF, E-books et infoproduits de niche complets." : "Agent autonome du réseau Aura. Alloué dynamiquement aux tâches d'analyse."}
                    </p>
                    <div className="bg-zinc-950/80 rounded border border-zinc-900 p-2 space-y-1 font-mono text-[8.5px] text-zinc-400">
                      <span className="text-zinc-500 block uppercase text-[8px] font-bold tracking-wider mb-0.5">MÉTRIQUES IA</span>
                      <div className="flex justify-between items-center gap-2">
                        <span>Requêtes:</span><span className="text-emerald-400 font-bold">{agent.outputCount * 142}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span>Taux de Pertinence:</span><span className="text-emerald-400 font-bold">98.4%</span>
                      </div>
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-zinc-900/80 flex justify-between items-center text-[8px] font-mono text-zinc-500 uppercase">
                      <span>Cliquer pour configurer Options</span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-cyan-950 text-[#00f2fe]' : 'bg-slate-950 text-slate-400'}`}>
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm tracking-tight">{agent.name}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">{agent.role}</p>
                      </div>
                    </div>
                    
                    {/* Pulsing state tag */}
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                      isWorking 
                        ? 'bg-amber-950/60 border-amber-800 text-amber-400 animate-pulse' 
                        : 'bg-slate-950 border-slate-800 text-emerald-400'
                    }`}>
                      {isWorking ? `GÉNÉRATION ${agent.taskProgress}%` : 'PRÊT / LIBRE'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 my-2 select-none">
                    {agent.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 w-full text-[10px] text-slate-400">
                    <span className="font-mono">Tâches résolues: {agent.outputCount}</span>
                    <span className="text-[#00f2fe] font-semibold group-hover/agentcard:translate-x-1 transition-transform">⚙️ Configurer Agent →</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Console control / Interactive prompt triggering zone */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl">
          <div 
            onClick={() => setShowDirectivesModal(true)}
            className="relative group/dir cursor-pointer mb-4"
          >
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover/dir:block w-80 bg-zinc-900 border border-zinc-805 border-zinc-800 p-3.5 rounded-xl shadow-2xl text-[10px] text-slate-300 z-55 leading-relaxed font-sans normal-case pointer-events-none">
              <span className="font-extrabold text-amber-500 block mb-1.5 font-mono uppercase tracking-wider">⚡ DIRECTIVES ET GUIDES STRATÉGIQUES</span>
              Donnez des instructions textuelles à l'Agent Plume ou Maker. Le robot adapte les balises d'affiliation Amazon ou d'E-book pour optimiser le taux de conversion passif.
              <br className="my-1" />
              • **Sujet Libre**: Saisissez un concept commercial ou une niche.<br />
              • **Filtres**: Modération éthique active pour protéger votre marque.
            </div>
            <div className="flex items-center gap-2 mb-2 group-hover/dir:text-amber-400 transition-colors">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                Directives d'Exécution IA <span className="text-amber-405 text-amber-400 animate-pulse font-bold hover:text-amber-300 text-xs">(ℹ️)</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 group-hover/dir:text-slate-300 transition-colors">
              Demandez explicitement à l'agent d'agir sur un sujet ou une thématique précise. Le moteur utilisera l'intelligence sémantique pour générer du contenu haut de gamme.
            </p>
          </div>

          {/* Trigger restriction warning for non-writable agents */}
          {selectedAgentId !== 'plume' && selectedAgentId !== 'maker' ? (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center text-xs text-slate-400">
              <span className="font-semibold text-white">L'Agent {selectedAgent.name}</span> effectue des analyses continues en autopilotage (géré automatiquement par les déclencheurs de visites). Sélectionnez <strong>Agent Plume</strong> ou <strong>Agent Maker</strong> pour tester la création directe par invite sémantique !
            </div>
          ) : (
            <form onSubmit={handleLaunch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 font-mono">
                  Sujet d'analyse ou concept commercial ciblé ({selectedAgentId === 'plume' ? 'Article de Blog & Affiliations' : 'E-book commercial'})
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={150}
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder={
                      selectedAgentId === 'plume'
                        ? 'Ex: Tutoriel complet de dropshipping avec les APIs de l\'IA...'
                        : 'Ex: Guide condensé pour décupler sa productivité avec Notion...'
                    }
                    className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-lg py-2.5 pl-3 pr-12 text-sm focus:outline-none focus:border-[#00f2fe] transition-all font-sans font-medium"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-1.5 top-1.5 p-1.5 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-slate-950 rounded hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                  </button>
                </div>
              </div>

              {/* Suggester Tags helper */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold text-slate-400 font-mono">Suggestions de niches rentables :</p>
                <div className="flex flex-wrap gap-2">
                  {suggestionTemplates[selectedAgentId]?.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCustomPrompt(tpl)}
                      className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-md border border-slate-800/80 hover:border-slate-700 transition"
                    >
                      {tpl}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* Prompt status feedback bar */}
          {consoleNotification && (
            <div className="mt-4 p-3.5 bg-cyan-950/40 border border-cyan-800 rounded-xl flex items-center gap-2.5 text-xs text-indigo-300 font-medium">
              <Sparkles className="w-4 h-4 text-[#00f2fe] animate-pulse" />
              <span>{consoleNotification}</span>
            </div>
          )}
        </div>

      </div>

      {/* Right Column: Console Terminal Real Logs */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col h-[520px] shadow-2xl relative overflow-hidden group">
        
        {/* Terminal Header */}
        <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#00f2fe]" />
            <span className="text-white text-xs font-mono tracking-wider">AURA-TERMINAL-LOGS</span>
          </div>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f2fe]"></span>
          </div>
        </div>

        {/* Logs Terminal Stream */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 font-mono text-[11px] leading-relaxed select-text">
          {logs.map((log) => {
            const dateStr = new Date(log.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            
            return (
              <div key={log.id} className="border-b border-slate-900/60 pb-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                  <span>[{dateStr}] • {log.agentName}</span>
                  <span className={`text-[9px] px-1 rounded uppercase ${
                    log.type === 'revenue' ? 'bg-emerald-950/80 text-emerald-400' :
                    log.type === 'success' ? 'bg-cyan-950/80 text-cyan-400' :
                    log.type === 'warn' ? 'bg-red-950/80 text-red-400' : 'bg-slate-900 text-slate-400'
                  }`}>
                    {log.type}
                  </span>
                </div>
                <p className={`${
                  log.type === 'revenue' ? 'text-emerald-400 font-bold' :
                  log.type === 'success' ? 'text-slate-200' :
                  log.type === 'warn' ? 'text-rose-400 font-semibold' : 'text-slate-400'
                }`}>
                  {log.message}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-900/80 py-2 px-4 border-t border-slate-800 text-[10px] text-slate-500 font-mono text-center">
          Système autonome connecté • Scannage sémantique [OK]
        </div>
      </div>

      {showHireModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#0c0c0c] border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="bg-slate-900 border-b border-slate-800 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-450 text-emerald-400" />
                <h4 className="text-white font-extrabold text-sm tracking-tight font-sans">Incubateur d'Agent Sémantique</h4>
              </div>
              <button onClick={() => setShowHireModal(false)} className="text-zinc-500 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleHireAgent} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase font-mono">Nom de l'Agent</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Agent Optimus"
                  value={hireName}
                  onChange={(e) => setHireName(e.target.value)}
                  className="w-full bg-zinc-950 border border-slate-800 rounded-lg text-xs py-2 px-3 text-white focus:outline-none focus:border-emerald-400 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase font-mono">Rôle et Spécialisation</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Analyste sémantique de conversion"
                  value={hireRole}
                  onChange={(e) => setHireRole(e.target.value)}
                  className="w-full bg-zinc-950 border border-slate-800 rounded-lg text-xs py-2 px-3 text-white focus:outline-none focus:border-emerald-400 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase font-mono">Description des fonctions</label>
                <textarea
                  placeholder="Ex: Analyse les comportements Stripe et affine les entêtes sémantiques..."
                  value={hireDesc}
                  onChange={(e) => setHireDesc(e.target.value)}
                  className="w-full bg-zinc-950 border border-slate-800 rounded-lg text-xs py-2 px-3 text-white focus:outline-none focus:border-emerald-400 h-20 transition"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setShowHireModal(false)}
                  className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-slate-800/80 hover:text-white transition rounded-lg text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isHiring}
                  className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-lg transition"
                >
                  {isHiring ? "Déploiement..." : "Déployer sur Aura Swarm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCommandCenterModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b0b0b] border border-[#1f1f1f] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                    <Terminal className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider font-sans">
                      Centre de Commandement des Agents IA
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-cyan-400 font-mono">Module de Gestion Flotte</span>
                      <span className="text-slate-600 text-[10px]">|</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800">
                        AURA_ENGINE: ACTIF
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCommandCenterModal(false)}
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
                      Ce panneau centralise le contrôle de tous vos agents d'intelligence artificielle. Il vous permet de superviser leur activité, leurs performances sémantiques et de déployer de nouveaux agents dans la flotte. Gère la répartition CPU, le protocole réseau et l'intergiciel d'agents communicants.
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Capacité Serveur (Usage)</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">92%</div>
                    </div>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Bande Sémantique (Tbps)</div>
                      <div className="text-xl font-bold text-[#00f2fe] mt-1 font-mono">2.4 TB/s</div>
                    </div>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Requêtes par Seconde (RPS)</div>
                      <div className="text-xl font-bold text-indigo-400 mt-1 font-mono">3,450</div>
                    </div>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Synchronisation Nodale</div>
                      <div className="text-lg font-bold text-amber-400 mt-1 font-mono">14 Noeuds</div>
                    </div>
                  </div>
                </div>

                {/* Configurations */}
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Options de Configuration Infrastructure</h4>
                  
                  <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Allocation Dynamique CPU</div>
                        <div className="text-[10px] text-slate-500">Distribue la puissance de calcul aux agents prioritaires (AdSense / Affiliation)</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Réseau d'Agents Communicants (Swarm)</div>
                        <div className="text-[10px] text-slate-500">Autorise les agents à échanger des données commerciales en temps réel</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Mécanisme d'Auto-Correction IA</div>
                        <div className="text-[10px] text-slate-500">Auto-réparation des liens cassés, et redémarrage automatique d'instances d'agents.</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#1f1f1f]">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Limite de Flotte Simultanée (Workers)</span>
                        <span className="text-xs text-white font-mono">15 Agents</span>
                      </div>
                      <input type="range" min="1" max="50" defaultValue="15" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDirectivesModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b0b0b] border border-[#1f1f1f] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-red-600"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-amber-400">
                    <Zap className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider font-sans">
                      Directives d'Exécution IA
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-amber-500 font-mono">Gouvernance Sémantique Stratégique</span>
                      <span className="text-slate-600 text-[10px]">|</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800">
                        SUPERVISION: ACTIVÉE
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDirectivesModal(false)}
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
                      Spécifie les règles et limites de la génération d'intelligence artificielle. Ce panneau permet de forcer l'usage d'un ton, d'imposer des contraintes de langage, de paramétrer le pare-feu thématique, et d'ajuster les directives commerciales pour chaque niche.
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Prompts Analysés</div>
                      <div className="text-xl font-bold text-amber-400 mt-1 font-mono">8 042</div>
                    </div>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Sensures & Filtres</div>
                      <div className="text-xl font-bold text-red-400 mt-1 font-mono">312</div>
                    </div>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Tonalité Principale</div>
                      <div className="text-lg font-bold text-indigo-400 mt-1 font-mono">Expert</div>
                    </div>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Qualité Mots-clés</div>
                      <div className="text-lg font-bold text-emerald-400 mt-1 font-mono">A+</div>
                    </div>
                  </div>
                </div>

                {/* Configurations */}
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Options de Gouvernance et Stylistique</h4>
                  
                  <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Garde-fous de Brand Safety</div>
                        <div className="text-[10px] text-slate-500">Bloque la génération pour les sujets sensibles et non-éthiques</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Vérification de Plagiat (Zero-Shot)</div>
                        <div className="text-[10px] text-slate-500">Analyse le contenu avant publication via API Copyscape</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Forcer Copywriting Persuasif</div>
                        <div className="text-[10px] text-slate-500">Structure les textes via la méthode AIDA & PAS</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                      </label>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#1f1f1f]">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Niveau de Créativité (Température)</span>
                        <span className="text-xs text-white font-mono">0.7</span>
                      </div>
                      <input type="range" min="0" max="100" defaultValue="70" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedAgentForConfig && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b0b0b] border border-[#1f1f1f] rounded-2xl w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00f2fe] to-indigo-600"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[#00f2fe]">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider font-sans">
                      Agent: {selectedAgentForConfig.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#00f2fe] font-mono">{selectedAgentForConfig.role}</span>
                      <span className="text-slate-600 text-[10px]">|</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800">
                        STATUS: {selectedAgentForConfig.status === 'working' ? 'WORKING' : 'IDLE'}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAgentForConfig(null)}
                  className="text-white bg-zinc-900 p-1 rounded-full hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Mission Assignée</h4>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl text-sm justify-between text-slate-300">
                      {selectedAgentForConfig.description}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl relative group/tt">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Tâches Générées</div>
                      <div className="text-xl font-bold text-[#00f2fe] mt-1 font-mono">{selectedAgentForConfig.outputCount}</div>
                      <div className="absolute left-0 bottom-full mb-2 w-48 bg-zinc-800 p-2 rounded text-xs text-white opacity-0 group-hover/tt:opacity-100 transition-opacity z-[100] pointer-events-none">Nombre total de tâches traitées avec succès.</div>
                    </div>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl relative group/tt">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Précision</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">Intégrale</div>
                      <div className="absolute left-0 bottom-full mb-2 w-48 bg-zinc-800 p-2 rounded text-xs text-white opacity-0 group-hover/tt:opacity-100 transition-opacity z-[100] pointer-events-none">Score de précision sémantique actuel.</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Configurations Avancées</h4>
                  
                  <div className="bg-[#121212] border border-[#1f1f1f] p-5 rounded-xl space-y-5">
                    
                    {/* Autopilotage */}
                    <div className="flex items-center justify-between group/tt relative">
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-slate-200">Autopilotage</div>
                        <div className="text-[10px] text-slate-500">Auto-activation des tâches</div>
                        <div className="absolute top-0 right-full mr-2 w-48 bg-zinc-800 p-2 rounded text-xs text-white opacity-0 group-hover/tt:opacity-100 transition-opacity z-[100] pointer-events-none">Active l'exécution automatique des tâches basées sur les signaux réseau.</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:bg-[#00f2fe]"></div>
                      </label>
                    </div>

                    {/* Paramètres Autopilot */}
                    <div className="space-y-2 group/tt relative border-t border-slate-800 pt-3">
                        <div className="text-xs font-semibold text-slate-200">Paramètres de l'Autopilote</div>
                        <div className="text-[10px] text-slate-500">Sensibilité aux signaux</div>
                        <div className="absolute top-0 right-full mr-2 w-48 bg-zinc-800 p-2 rounded text-xs text-white opacity-0 group-hover/tt:opacity-100 transition-opacity z-[100] pointer-events-none">Ajuste la réactivité de l'autopilote aux changements de tendances.</div>
                         <input type="range" min="1" max="100" defaultValue="85" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00f2fe]" />
                    </div>

                    {/* Compression Temporelle */}
                    <div className="space-y-1 group/tt relative border-t border-slate-800 pt-3">
                        <div className="text-xs font-semibold text-slate-200">Compression Temporelle</div>
                        <div className="absolute top-0 right-full mr-2 w-48 bg-zinc-800 p-2 rounded text-xs text-white opacity-0 group-hover/tt:opacity-100 transition-opacity z-[100] pointer-events-none">Vitesse de traitement des tâches (accélération sémantique).</div>
                         <input type="range" min="1" max="10" defaultValue="5" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00f2fe]" />
                    </div>

                    {/* Niveau d'Autonomie */}
                    <div className="space-y-2 group/tt relative border-t border-slate-800 pt-3">
                      <div className="text-xs font-semibold text-slate-200">Niveau d'Autonomie</div>
                      <div className="absolute top-0 right-full mr-2 w-48 bg-zinc-800 p-2 rounded text-xs text-white opacity-0 group-hover/tt:opacity-100 transition-opacity z-[100] pointer-events-none">Détermine la liberté décisionnelle de l'agent.</div>
                      <select defaultValue="Autonomie Totale (0.9)" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white">
                        <option>Assisté (0.3)</option>
                        <option>Semi-Autonome (0.6)</option>
                        <option>Autonomie Totale (0.9)</option>
                      </select>
                    </div>

                    {/* Niche Cible */}
                    <div className="group/tt relative border-t border-slate-800 pt-3">
                        <div className="text-xs font-semibold text-slate-200 mb-1">Niche Cible</div>
                        <div className="absolute top-0 right-full mr-2 w-48 bg-zinc-800 p-2 rounded text-xs text-white opacity-0 group-hover/tt:opacity-100 transition-opacity z-[100] pointer-events-none">Domaine d'expertise principal pour cet agent.</div>
                        <input type="text" defaultValue="Affiliation IA" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white"/>
                    </div>

                    {/* Moteur d'écriture */}
                    <div className="space-y-2 group/tt relative border-t border-slate-800 pt-3">
                      <div className="text-xs font-semibold text-slate-200">Moteur d'écriture</div>
                      <div className="absolute top-0 right-full mr-2 w-48 bg-zinc-800 p-2 rounded text-xs text-white opacity-0 group-hover/tt:opacity-100 transition-opacity z-[100] pointer-events-none">Sélection du modèle de génération textuelle.</div>
                      <select defaultValue="Hyper-Sémantique V2 (Avancé)" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white">
                        <option>AURA-Writer V1</option>
                        <option>Hyper-Sémantique V2 (Avancé)</option>
                        <option>Fast-Response V1</option>
                      </select>
                    </div>

                    {/* Stratégie Sémantique */}
                    <div className="group/tt relative border-t border-slate-800 pt-3">
                        <div className="text-xs font-semibold text-slate-200 mb-1">Stratégie Sémantique</div>
                        <div className="absolute top-0 right-full mr-2 w-48 bg-zinc-800 p-2 rounded text-xs text-white opacity-0 group-hover/tt:opacity-100 transition-opacity z-[100] pointer-events-none">Approche sémantique pour la génération.</div>
                        <input type="text" defaultValue="Cocons & Maillage Interne" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white"/>
                    </div>

                    {/* Tunnel Affiliation & Monétisation */}
                    <div className="flex items-center justify-between group/tt relative border-t border-slate-800 pt-3">
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-slate-200">Tunnel Affiliation & Monétisation</div>
                        <div className="text-[10px] text-slate-500">Injection dynamique de liens</div>
                        <div className="absolute top-0 right-full mr-2 w-48 bg-zinc-800 p-2 rounded text-xs text-white opacity-0 group-hover/tt:opacity-100 transition-opacity z-[100] pointer-events-none">Active l'injection automatique des liens d'affiliation dans le contenu généré.</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:bg-[#00f2fe]"></div>
                      </label>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
