import React, { useState } from 'react';
import { 
  PenTool, 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle,
  Zap, 
  RefreshCw,
  Wallet,
  Coins,
  Sliders,
  Settings,
  Activity,
  ShieldAlert,
  Info,
  X
} from 'lucide-react';
import { PlatformState } from '../types';
import { apiFetch } from '../utils';

interface SwissArmyFlowchartProps {
  state: PlatformState;
  onUpdateState: (newState: PlatformState) => void;
  playSynthBeep: (type: 'success' | 'warn' | 'revenue' | 'click') => void;
}

export default function SwissArmyFlowchart({ state, onUpdateState, playSynthBeep }: SwissArmyFlowchartProps) {
  const [isCampaignLoading, setIsCampaignLoading] = useState(false);
  const [hoverNode, setHoverNode] = useState<string | null>(null);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [selectedAgentSettingsId, setSelectedAgentSettingsId] = useState<string | null>(null);
  const [isSimulatingAction, setIsSimulatingAction] = useState<string | null>(null);
  const [simulationSuccess, setSimulationSuccess] = useState<string | null>(null);
  const [showMoteurSemanticTooltip, setShowMoteurSemanticTooltip] = useState(false);

  // Extract Swiss Elite parameters with safe server fallbacks
  const swissEliteProtocol = state.swissEliteProtocol || 'cascade';
  const swissVelocityMultiplier = state.swissVelocityMultiplier || 1.5;
  const swissReinvestShare = state.swissReinvestShare || 15;
  const swissAutoPilotInterval = state.swissAutoPilotInterval || 15;
  const swissHedgeBtcEnabled = !!state.swissHedgeBtcEnabled;
  const swissSafetyLockEnabled = !!state.swissSafetyLockEnabled;

  const swissPlumeTargetMarket = state.swissPlumeTargetMarket || 'GLOBAL';
  const swissPlumeArticleFormat = state.swissPlumeArticleFormat || 'long';
  const swissPlumeTone = state.swissPlumeTone || 'expert';
  
  const swissSeoMetadataFormat = state.swissSeoMetadataFormat || 'jsonld';
  const swissSeoIndexSpeed = state.swissSeoIndexSpeed || 'instant';
  
  const swissMakerProductTheme = state.swissMakerProductTheme || 'prompts';
  const swissMakerPricingFactor = state.swissMakerPricingFactor || 'competitive';
  
  const swissMercatoAmazonStrategy = state.swissMercatoAmazonStrategy || 'combined';
  const swissMercatoCheckoutSpeed = state.swissMercatoCheckoutSpeed || 'frictionless';
  
  const swissComptableCompliance = state.swissComptableCompliance || 'canadian_gst';
  const swissComptableLogFormat = state.swissComptableLogFormat || 'sha256';
  
  const swissTresorierHedgeThreshold = state.swissTresorierHedgeThreshold !== undefined ? state.swissTresorierHedgeThreshold : 15;
  const swissTresorierPaymentGateway = state.swissTresorierPaymentGateway || 'stripe';

  const handleLaunchCampaign = async () => {
    if (state.metrics.totalRevenue < 30) {
      playSynthBeep('warn');
      alert("Fonds de roulement insuffisants (Requis: 30.00 CA$ pour mandater l'Agent Echo).");
      return;
    }

    setIsCampaignLoading(true);
    playSynthBeep('click');

    try {
      const res = await apiFetch('/api/simulate-marketing', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        onUpdateState(data.state);
        playSynthBeep('success');
      } else {
        const err = await res.json();
        alert(err.error || "Une erreur est survenue lors de la campagne.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCampaignLoading(false);
    }
  };

  const handleUpdateEliteSetting = async (updatedFields: Partial<PlatformState>) => {
    setIsUpdating(true);
    playSynthBeep('click');

    try {
      const res = await apiFetch('/api/settings/update-swiss-elite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        const data = await res.json();
        onUpdateState(data.state);
        playSynthBeep('success');
      } else {
        alert("Une erreur est survenue lors de la mise à jour sémantique Élite.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const triggerAgentAction = (agentId: string, actionName: string) => {
    setIsSimulatingAction(agentId);
    setSimulationSuccess(null);
    playSynthBeep('click');

    setTimeout(async () => {
      setIsSimulatingAction(null);
      playSynthBeep('success');
      
      let msg = '';
      if (agentId === 'plume') {
        msg = `📰 [Agent Plume] Recherche de tendances sémantiques terminée. Un nouvel article de type [${swissPlumeArticleFormat.toUpperCase()}] ciblant le marché [${swissPlumeTargetMarket}] sous un ton [${swissPlumeTone.toUpperCase()}] a été envoyé en brouillon d'indexation !`;
        try {
          const res = await apiFetch('/api/settings/update-swiss-elite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              swissPlumeTone: swissPlumeTone
            })
          });
          if (res.ok) {
            const data = await res.json();
            onUpdateState(data.state);
          }
        } catch (e) { console.error(e); }
      } 
      else if (agentId === 'seo') {
        msg = `🔍 [SEO-Max] Les balises microdata au format [${swissSeoMetadataFormat.toUpperCase()}] ont été inspectées. Signal Ping envoyé avec succès vers l'API IndexNow à vitesse [${swissSeoIndexSpeed.toUpperCase()}]. Score d'indexation maintenu à 97.4% !`;
        try {
          const res = await apiFetch('/api/settings/update-swiss-elite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              swissSeoIndexSpeed: swissSeoIndexSpeed
            })
          });
          if (res.ok) {
            const data = await res.json();
            onUpdateState(data.state);
          }
        } catch (e) { console.error(e); }
      }
      else if (agentId === 'maker') {
        msg = `📦 [Agent Maker] Compilation terminée. Le pack sémantique [${swissMakerProductTheme.toUpperCase()}] a été structuré avec le profil de tarification [${swissMakerPricingFactor.toUpperCase()}]. Index de prix rattaché.`;
        try {
          const res = await apiFetch('/api/settings/update-swiss-elite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              swissMakerProductTheme: swissMakerProductTheme
            })
          });
          if (res.ok) {
            const data = await res.json();
            onUpdateState(data.state);
          }
        } catch (e) { console.error(e); }
      }
      else if (agentId === 'mercato') {
        msg = `🛒 [Agent Mercato] Rapprochement de conversion. Pixels de conversions révisés pour le placement [${swissMercatoAmazonStrategy.toUpperCase()}] avec la vitesse de redirection [${swissMercatoCheckoutSpeed.toUpperCase()}].`;
        try {
          const res = await apiFetch('/api/settings/update-swiss-elite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              swissMercatoAmazonStrategy: swissMercatoAmazonStrategy
            })
          });
          if (res.ok) {
            const data = await res.json();
            onUpdateState(data.state);
          }
        } catch (e) { console.error(e); }
      }
      else if (agentId === 'comptable') {
        msg = `🔐 [Agent Comptable] Un nouvel audit du grand livre sémantique a été signé sous l'empreinte SHA-256 certifiée selon le régime [${swissComptableCompliance.toUpperCase()}]. Journal chiffré intègre.`;
        try {
          const res = await apiFetch('/api/settings/update-swiss-elite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              swissComptableCompliance: swissComptableCompliance
            })
          });
          if (res.ok) {
            const data = await res.json();
            onUpdateState(data.state);
          }
        } catch (e) { console.error(e); }
      }
      else if (agentId === 'tresorier') {
        msg = `🪙 [Agent Trésorier] Arbitrage sécurisé exécuté ! Un montant de couverture indexé sur le seuil de ${swissTresorierHedgeThreshold}% a été dirigé vers la passerelle de type [${swissTresorierPaymentGateway.toUpperCase()}]. Transaction de hedging validée.`;
        try {
          const res = await apiFetch('/api/settings/update-swiss-elite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              swissTresorierPaymentGateway: swissTresorierPaymentGateway
            })
          });
          if (res.ok) {
            const data = await res.json();
            onUpdateState(data.state);
          }
        } catch (e) { console.error(e); }
      }
      
      setSimulationSuccess(msg);
    }, 1200);
  };

  // Compute status metrics based on state characteristics
  const isPlumeWorking = state.agents.find(a => a.id === 'plume')?.status === 'working';
  const isSeoWorking = state.agents.find(a => a.id === 'seo')?.status === 'working';
  const isMakerWorking = state.agents.find(a => a.id === 'maker')?.status === 'working';
  const isMercatoWorking = state.agents.find(a => a.id === 'mercato')?.status === 'working';
  const isComptableWorking = state.agents.find(a => a.id === 'comptable')?.status === 'working';
  const isTresorierWorking = state.agents.find(a => a.id === 'tresorier')?.status === 'working';

  // Core visual node configurations
  const nodes = [
    {
      id: 'plume',
      name: 'Agent Plume',
      role: 'Rédacteur & Trends',
      desc: 'Détecte les tendances sémantiques en France, Suisse et Canada, et rédige les articles.',
      icon: PenTool,
      active: isPlumeWorking,
      color: 'from-cyan-500 to-blue-500',
      glow: 'shadow-cyan-400/20',
      output: `${state.articles.length} Articles`
    },
    {
      id: 'seo',
      name: 'SEO-Max',
      role: 'Optimisateur Métadonnées',
      desc: 'Injecte des schémas sémantiques structurés JSON-LD pour indexer instantanément.',
      icon: Sparkles,
      active: isSeoWorking,
      color: 'from-purple-500 to-indigo-500',
      glow: 'shadow-purple-400/20',
      output: 'Score: 97%'
    },
    {
      id: 'maker',
      name: 'Agent Maker',
      role: 'Éditeur de Produits',
      desc: 'Assemble à chaud des fiches, templates de prompts et syllabus vendus dans la boutique.',
      icon: ShoppingBag,
      active: isMakerWorking,
      color: 'from-pink-500 to-rose-500',
      glow: 'shadow-pink-400/20',
      output: `${state.products.length} PDF / Prompts`
    },
    {
      id: 'mercato',
      name: 'Agent Mercato',
      role: 'Négociateur d\'Affiliation',
      desc: 'Insère des bannières Amazon et aligne la conversion des checkout.',
      icon: Zap,
      active: isMercatoWorking,
      color: 'from-amber-500 to-orange-500',
      glow: 'shadow-orange-400/20',
      output: '94% Org. Traffic'
    },
    {
      id: 'comptable',
      name: 'Agent Comptable',
      role: 'Facturation & Audit',
      desc: 'Certifie les encaissements, simule la TVA canadienne/française et garde le registre SHA-256.',
      icon: ShieldCheck,
      active: isComptableWorking,
      color: 'from-emerald-500 to-teal-500',
      glow: 'shadow-emerald-400/20',
      output: 'Facturation Auto'
    },
    {
      id: 'tresorier',
      name: 'Agent Trésorier',
      role: 'Arbitrage & Transferts',
      desc: 'Sécurise les bénéfices vers votre banque, gère le hedging Bitcoin et les webhooks.',
      icon: Wallet,
      active: isTresorierWorking,
      color: 'from-blue-600 to-indigo-700',
      glow: 'shadow-blue-500/20',
      output: state.autoFineConfig?.realBTCAddress ? 'BTC Hedge 15%' : 'Sim EFT direct'
    }
  ];

  return (
    <div id="swiss-army-flow-widget" className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6 relative overflow-visible transition-all duration-300">
      
      {/* Background neon grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.25)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(18,24,38,0.25)_1px,_transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none rounded-2xl"></div>

      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-30 border-b border-[#151515] pb-4">
        <div className="relative group/swissmoteur z-40">
          <div 
            onClick={(e) => {
              e.stopPropagation();
              playSynthBeep('click');
              setShowMoteurSemanticTooltip(!showMoteurSemanticTooltip);
            }}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <Coins className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
            <h4 className="text-white font-extrabold text-xs sm:text-sm tracking-wide font-sans hover:text-[#00f2fe] transition-colors flex items-center gap-1.5 uppercase">
              <span>Moteur Sémantique Suisse-Army : Flux d'Autonomie Cascade</span>
              <span className="text-[#00f2fe] font-bold animate-pulse text-[10px] bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-800/40 hover:bg-cyan-950 flex items-center gap-1">
                (ℹ️ INFO)
              </span>
            </h4>
          </div>

          {/* Tooltip Content with click/hover control & Close Button */}
          <div 
            onClick={(ev) => ev.stopPropagation()}
            className={`absolute left-0 top-full mt-2 w-[340px] max-w-[92vw] bg-[#0d0d0d] border border-zinc-800 p-4 rounded-xl shadow-2xl text-[10px] text-zinc-300 z-[120] leading-relaxed font-sans normal-case select-text transition-all duration-200 ${
              showMoteurSemanticTooltip 
                ? 'block ring-2 ring-[#00f2fe]/50 scale-100 opacity-100' 
                : 'hidden group-hover/swissmoteur:lg:block opacity-95 scale-95 origin-top-left'
            }`}
          >
            <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-zinc-800">
              <span className="font-extrabold text-[#00f2fe] font-mono uppercase tracking-wider flex items-center gap-1.5">
                📐 FLUX ET CASCADE D'AUTONOMIE
              </span>
              <button
                onClick={(ev) => {
                  ev.stopPropagation();
                  setShowMoteurSemanticTooltip(false);
                }}
                className="text-zinc-[500] hover:text-white p-1 rounded bg-zinc-950 hover:bg-zinc-900 transition-colors border border-zinc-800/50 cursor-pointer"
                title="Fermer la bulle d'information"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1.5 text-zinc-400">
              <p>Trace le cycle autonome complet d'Aura :</p>
              <p>1. <strong className="text-white">Agent Plume</strong> : recherche de tendances de niche et rédaction passive.</p>
              <p>2. <strong className="text-white">SEO-Max</strong> : génération de métadonnées sémantiques et ping d'indexation.</p>
              <p>3. <strong className="text-white">Agent Maker</strong> : automatisation d'infoproduits (e-books, guides) de niche.</p>
              <p>4. <strong className="text-white">Agent Mercato</strong> : monétisation automatique par affiliations Amazon.</p>
              <p>5. <strong className="text-white">Agent Comptable</strong> : log sécurisé des transactions et conformité fiscale helvétique.</p>
              <p>6. <strong className="text-white">Agent Trésorier</strong> : arbitrage de fonds, BTC Hedging et encaissements Stripe.</p>
            </div>
            
            <div className="mt-2.5 pt-2 border-t border-zinc-900 flex justify-between items-center text-[8px] font-mono text-zinc-500 uppercase">
              <span>Autonomie : active</span>
              <span className="text-cyan-400 animate-pulse">CLIQUEZ POUR FERMER</span>
            </div>
          </div>
          
          <p className="text-[11px] text-zinc-500 font-mono mt-1">
            Cliquez sur un agent pour configurer ses options à chaud, ou déployez les Options Élite globales ci-dessous.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Collapse/Expand Paramètres Elite slider panel button */}
          <button
            onClick={() => {
              playSynthBeep('click');
              setIsSettingsExpanded(!isSettingsExpanded);
            }}
            className={`px-3.5 py-2 border rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              isSettingsExpanded 
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-400' 
                : 'bg-[#121212] border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            <Sliders className={`w-3.5 h-3.5 ${isSettingsExpanded ? 'animate-pulse' : ''}`} />
            <span>Options Élite ({swissEliteProtocol.toUpperCase()})</span>
          </button>

          {/* 1-Click Fast Conversion Boost Campaign Trigger */}
          <button
            onClick={handleLaunchCampaign}
            disabled={isCampaignLoading}
            className="relative px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-900 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 select-none shadow-[0_0_15px_rgba(6,182,212,0.15)] group"
          >
            {isCampaignLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-slate-900 group-hover:text-amber-300 transition-colors" />
            )}
            <span>{isCampaignLoading ? 'Propagation...' : 'Campagne Virale (+30 CA$)'}</span>
          </button>
        </div>
      </div>

      {/* Network of Interconnecting Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 relative z-10 mb-5">
        {nodes.map((node, index) => {
          const NodeIcon = node.icon;
          const isSelected = hoverNode === node.id;
          const isCurrentSelected = selectedAgentSettingsId === node.id;
          
          return (
            <div
              key={node.id}
              onClick={() => {
                setSelectedAgentSettingsId(isCurrentSelected ? null : node.id);
                // Also automatically close general settings if opening a node to keep UI beautiful and clean
                setIsSettingsExpanded(false);
                setSimulationSuccess(null);
                playSynthBeep('click');
              }}
              className={`relative bg-[#0d0d0d] border transition-all duration-350 cursor-pointer min-h-[145px] rounded-xl p-4.5 flex flex-col justify-between ${
                isCurrentSelected
                  ? 'border-cyan-400 ring-2 ring-cyan-500/30 bg-[#070e1b] shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                  : node.active 
                    ? 'border-cyan-500/80 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                    : 'border-[#1a1a1a] hover:border-zinc-800 hover:bg-[#121212]'
              }`}
              onMouseEnter={() => setHoverNode(node.id)}
              onMouseLeave={() => setHoverNode(null)}
            >
              
              {/* Connector Pipeline Arrows */}
              {index < 5 && (
                <div className="hidden xl:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-20 pointer-events-none">
                  <ArrowRight className={`w-4 h-4 ${node.active ? 'text-cyan-400 animate-ping' : 'text-[#1c1c1c]'}`} />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-tr ${node.color} text-white ${node.active ? 'animate-pulse' : ''}`}>
                    <NodeIcon className="w-4 h-4" />
                  </div>
                  
                  {/* Status Indicator Bar */}
                  <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border ${
                    node.active 
                      ? 'bg-cyan-950 text-cyan-400 border-cyan-800 animate-pulse' 
                      : 'bg-zinc-950 text-zinc-600 border-zinc-900'
                  }`}>
                    {node.active ? 'COORDINATION ACTIVE' : 'VEILLE'}
                  </span>
                </div>

                <h5 className="font-bold text-xs text-white tracking-wide">{node.name}</h5>
                <p className="text-[10px] text-zinc-400 font-medium font-sans leading-snug mt-1">{node.role}</p>
              </div>

              {/* Node specific dynamic details */}
              <div className="mt-3.5 pt-2 border-t border-[#121212] flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950/30 border border-cyan-900/60 px-1.5 py-0.5 rounded">
                  {node.output}
                </span>
                
                <span className={`text-[9px] font-mono font-bold ${isCurrentSelected ? 'text-cyan-300' : 'text-zinc-500 hover:text-white'}`}>
                  {isCurrentSelected ? 'Sélectionné •' : 'Options ⚙️'}
                </span>
              </div>

              {/* Tooltip detail overlay */}
              {isSelected && (
                <div className="absolute left-0 bottom-full mb-2 w-[240px] bg-slate-950 border border-zinc-800 p-3 rounded-lg shadow-2xl z-50 animate-in fade-in duration-150">
                  <p className="text-[10.5px] text-slate-300 font-sans leading-relaxed">{node.desc}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Agent Fine Tuning Panel */}
      {selectedAgentSettingsId && (
        <div className="relative z-10 mb-5 bg-[#0b0c10] border border-cyan-800/40 rounded-xl p-5 animate-in slide-in-from-top-4 duration-250">
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedAgentSettingsId(null);
                setSimulationSuccess(null);
                playSynthBeep('click');
              }}
              className="text-zinc-500 hover:text-white transition-colors text-xs font-mono bg-zinc-950 border border-zinc-900 rounded p-1 px-2 cursor-pointer"
            >
              Fermer ✕
            </button>
          </div>

          {selectedAgentSettingsId === 'plume' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded text-white text-xs">
                  <PenTool className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-white text-xs font-bold font-sans uppercase">Configuration de l'Agent Plume</h5>
                  <p className="text-[10px] text-zinc-500 font-mono">Expert rédaction & détection de tendances sémantiques</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Target market */}
                <div className="bg-[#08080c] p-3 rounded-lg border border-zinc-900">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase block mb-2">1. Marché Cible Détecté</label>
                  <div className="space-y-1.5">
                    {[
                      { id: 'GLOBAL', label: '🌐 International', desc: 'SaaS globaux en USD' },
                      { id: 'CH', label: '🇨🇭 Confédération', desc: 'Arbitrage CH-VAT' },
                      { id: 'CA', label: '🇨🇦 Canada', desc: 'Syllabus en CA$' },
                      { id: 'FR', label: '🇫🇷 République', desc: 'SEO pur en France' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleUpdateEliteSetting({ swissPlumeTargetMarket: m.id })}
                        className={`w-full text-left p-1.5 rounded text-[11px] font-sans transition-all flex items-center justify-between cursor-pointer ${
                          swissPlumeTargetMarket === m.id 
                            ? 'bg-cyan-950/50 border border-cyan-500 text-white font-bold' 
                            : 'bg-transparent border border-transparent text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span>{m.label}</span>
                        <span className="text-[9px] text-zinc-500 font-normal">{m.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Format */}
                <div className="bg-[#08080c] p-3 rounded-lg border border-zinc-900">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase block mb-2">2. Longueur de Rédaction</label>
                  <div className="space-y-1.5">
                    {[
                      { id: 'short', label: '⚡ Flash SEO', desc: '400m - Indexation rapide' },
                      { id: 'medium', label: '📄 Standard', desc: '1200m - Tunnel affiliation' },
                      { id: 'long', label: '📚 Long-forme Élite', desc: '3000m - Autorité pure' }
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => handleUpdateEliteSetting({ swissPlumeArticleFormat: f.id })}
                        className={`w-full text-left p-1.5 rounded text-[11px] font-sans transition-all flex items-center justify-between cursor-pointer ${
                          swissPlumeArticleFormat === f.id 
                            ? 'bg-cyan-950/50 border border-cyan-500 text-white font-bold' 
                            : 'bg-transparent border border-transparent text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span>{f.label}</span>
                        <span className="text-[9px] text-zinc-500 font-normal">{f.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Tone */}
                <div className="bg-[#08080c] p-3 rounded-lg border border-zinc-900">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase block mb-2">3. Style Stylistique</label>
                  <div className="space-y-1.5">
                    {[
                      { id: 'expert', label: '🧠 Scientifique & Expert', desc: 'Haute valeur technique' },
                      { id: 'aggressive', label: '🔥 Copywriting Vendeur', desc: 'Orienté conversions' },
                      { id: 'news', label: '📰 Journalisme Neutre', desc: 'Passes automatisées' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleUpdateEliteSetting({ swissPlumeTone: t.id })}
                        className={`w-full text-left p-1.5 rounded text-[11px] font-sans transition-all flex items-center justify-between cursor-pointer ${
                          swissPlumeTone === t.id 
                            ? 'bg-cyan-950/50 border border-cyan-500 text-white font-bold' 
                            : 'bg-transparent border border-transparent text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span>{t.label}</span>
                        <span className="text-[9px] text-zinc-500 font-normal">{t.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between bg-[#111115] p-3.5 rounded-lg border border-zinc-900 mt-2">
                <span className="text-[10px] text-zinc-400 font-sans">
                  Prêt à forcer Plume à générer une analyse sémantique selon l'identité configurée ?
                </span>
                <button
                  onClick={() => triggerAgentAction('plume', 'force_draft')}
                  disabled={isSimulatingAction === 'plume'}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 hover:text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSimulatingAction === 'plume' ? 'Analyse en cours...' : 'Forcer la rédaction immédiate'}
                </button>
              </div>
            </div>
          )}

          {selectedAgentSettingsId === 'seo' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded text-white text-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-white text-xs font-bold font-sans uppercase">Configuration de SEO-Max</h5>
                  <p className="text-[10px] text-zinc-500 font-mono">Optimisateur de balises structurées quantiques</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Metadata Schema format */}
                <div className="bg-[#08080c] p-3 rounded-lg border border-zinc-900">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase block mb-2">1. Schéma de Balisage Structuré</label>
                  <div className="space-y-1.5">
                    {[
                      { id: 'jsonld', label: '🏷️ Schema JSON-LD', desc: 'Injection asynchrone Google Rich Snippets' },
                      { id: 'microdata', label: '🗺️ Microdonnées HTML', desc: 'Directement imbriqué dans le DOM natif' },
                      { id: 'rdfa', label: '🧬 RDFa Structuré', desc: 'Standard W3C sémantique d\'indexation' }
                    ].map((sf) => (
                      <button
                        key={sf.id}
                        onClick={() => handleUpdateEliteSetting({ swissSeoMetadataFormat: sf.id })}
                        className={`w-full text-left p-2 rounded text-[11px] font-sans transition-all flex items-center justify-between cursor-pointer ${
                          swissSeoMetadataFormat === sf.id 
                            ? 'bg-purple-950/50 border border-purple-800 text-white font-bold' 
                            : 'bg-transparent border border-transparent text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span>{sf.label}</span>
                        <span className="text-[9px] text-zinc-500 font-normal">{sf.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Index velocity */}
                <div className="bg-[#08080c] p-3 rounded-lg border border-zinc-900">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase block mb-2">2. Algorithme d'Indexation Périodique</label>
                  <div className="space-y-1.5">
                    {[
                      { id: 'instant', label: '⚡ Instant Google Ping API', desc: 'Active l\'indexation asynchrone instantanée' },
                      { id: 'natural', label: '🦆 Organique Standard', desc: 'Attente du passage naturel du GoogleBot sous 48h' },
                      { id: 'delayed', label: '⌛ Vérification Manuelle', desc: 'Temporise l\'indexation jusqu\'au prochain audit' }
                    ].map((sv) => (
                      <button
                        key={sv.id}
                        onClick={() => handleUpdateEliteSetting({ swissSeoIndexSpeed: sv.id })}
                        className={`w-full text-left p-2 rounded text-[11px] font-sans transition-all flex items-center justify-between cursor-pointer ${
                          swissSeoIndexSpeed === sv.id 
                            ? 'bg-purple-950/50 border border-purple-800 text-white font-bold' 
                            : 'bg-transparent border border-transparent text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span>{sv.label}</span>
                        <span className="text-[9px] text-zinc-500 font-normal">{sv.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between bg-[#111115] p-3.5 rounded-lg border border-zinc-900 mt-2">
                <span className="text-[10px] text-zinc-400 font-sans">
                  Lancer une simulation de ping de console de recherche Google ?
                </span>
                <button
                  onClick={() => triggerAgentAction('seo', 'seo_audit')}
                  disabled={isSimulatingAction === 'seo'}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSimulatingAction === 'seo' ? 'Ping Google...' : 'Diagnostiquer & Ping SEO'}
                </button>
              </div>
            </div>
          )}

          {selectedAgentSettingsId === 'maker' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 bg-gradient-to-tr from-pink-500 to-rose-500 rounded text-white text-xs">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-white text-xs font-bold font-sans uppercase">Configuration de l'Agent Maker</h5>
                  <p className="text-[10px] text-zinc-500 font-mono">Assemblage à chaud de fiches numériques & templates de prompts</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Product theme */}
                <div className="bg-[#08080c] p-3 rounded-lg border border-zinc-900">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase block mb-2">1. Filière thématique exclusive</label>
                  <div className="space-y-1.5">
                    {[
                      { id: 'prompts', label: '💬 Prompts IA Avancés', desc: 'Fiches et chaînes de prompts adaptées' },
                      { id: 'saas', label: '💻 Boilerplates & Snippets', desc: 'Gabarit de code prêt à déployer' },
                      { id: 'ebooks', label: '📘 Syllabus & Formations', desc: 'Fiches de cours vulgarisées' }
                    ].map((pt) => (
                      <button
                        key={pt.id}
                        onClick={() => handleUpdateEliteSetting({ swissMakerProductTheme: pt.id })}
                        className={`w-full text-left p-2 rounded text-[11px] font-sans transition-all flex items-center justify-between cursor-pointer ${
                          swissMakerProductTheme === pt.id 
                            ? 'bg-rose-950/50 border border-rose-800 text-white font-bold' 
                            : 'bg-transparent border border-transparent text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span>{pt.label}</span>
                        <span className="text-[9px] text-zinc-500 font-normal">{pt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Product pricing mode */}
                <div className="bg-[#08080c] p-3 rounded-lg border border-zinc-900">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase block mb-2">2. Algorithme de Tarification</label>
                  <div className="space-y-1.5">
                    {[
                      { id: 'low_ticket', label: '📉 Low Ticket Récurrent', desc: 'Fonds d\'appel à conversion maximale ($4.99 - $9.99)' },
                      { id: 'competitive', label: '⚖️ Équilibre concurrentiel', desc: 'Ratio de marge optimal éprouvé ($19.99 - $29.99)' },
                      { id: 'premium', label: '💎 High-Ticket Élite', desc: 'Maximum de revenus par unité vendue ($99.00 - $149.00)' }
                    ].map((pf) => (
                      <button
                        key={pf.id}
                        onClick={() => handleUpdateEliteSetting({ swissMakerPricingFactor: pf.id })}
                        className={`w-full text-left p-2 rounded text-[11px] font-sans transition-all flex items-center justify-between cursor-pointer ${
                          swissMakerPricingFactor === pf.id 
                            ? 'bg-rose-950/50 border border-rose-800 text-white font-bold' 
                            : 'bg-transparent border border-transparent text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span>{pf.label}</span>
                        <span className="text-[9px] text-zinc-500 font-normal">{pf.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between bg-[#111115] p-3.5 rounded-lg border border-zinc-900 mt-2">
                <span className="text-[10px] text-zinc-400 font-sans">
                  Générer instantanément un micro-produit e-learning dans la boutique virtuelle ?
                </span>
                <button
                  onClick={() => triggerAgentAction('maker', 'create_product')}
                  disabled={isSimulatingAction === 'maker'}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSimulatingAction === 'maker' ? 'Création...' : 'Forcer la création de produit'}
                </button>
              </div>
            </div>
          )}

          {selectedAgentSettingsId === 'mercato' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 bg-gradient-to-tr from-amber-500 to-orange-500 rounded text-white text-xs">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-white text-xs font-bold font-sans uppercase">Configuration de l'Agent Mercato</h5>
                  <p className="text-[10px] text-zinc-500 font-mono">Négaciations d'affiliation Amazon & Stripe checkout</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Placement style */}
                <div className="bg-[#08080c] p-3 rounded-lg border border-zinc-900">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase block mb-2">1. Format de Placement d'Affiliation</label>
                  <div className="space-y-1.5">
                    {[
                      { id: 'banner', label: '🖼️ Bannières Graphiques', desc: 'Bandeaux illustrés visuels intégrés' },
                      { id: 'intext', label: '🔗 Liens Sémantiques', desc: 'Recommandations textuelles intégrées' },
                      { id: 'combined', label: '🌐 Placement Combiné', desc: 'Algorithme d\'insertion combiné' }
                    ].map((as) => (
                      <button
                        key={as.id}
                        onClick={() => handleUpdateEliteSetting({ swissMercatoAmazonStrategy: as.id })}
                        className={`w-full text-left p-2 rounded text-[11px] font-sans transition-all flex items-center justify-between cursor-pointer ${
                          swissMercatoAmazonStrategy === as.id 
                            ? 'bg-orange-950/50 border border-orange-800 text-white font-bold' 
                            : 'bg-transparent border border-transparent text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span>{as.label}</span>
                        <span className="text-[9px] text-zinc-500 font-normal">{as.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Checkout speed */}
                <div className="bg-[#08080c] p-3 rounded-lg border border-zinc-900">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase block mb-2">2. Tunnel d'Achat Client</label>
                  <div className="space-y-1.5">
                    {[
                      { id: 'standard', label: '🛒 Panier Standard', desc: 'Tunnel asynchrone classique' },
                      { id: 'express', label: '⚡ Achat Direct Express', desc: 'Formulaire de checkout direct instantané' },
                      { id: 'frictionless', label: '🌐 Frictionless Link (Stripe)', desc: 'Facturation simplifiée en un coup d\'oeil' }
                    ].map((cs) => (
                      <button
                        key={cs.id}
                        onClick={() => handleUpdateEliteSetting({ swissMercatoCheckoutSpeed: cs.id })}
                        className={`w-full text-left p-2 rounded text-[11px] font-sans transition-all flex items-center justify-between cursor-pointer ${
                          swissMercatoCheckoutSpeed === cs.id 
                            ? 'bg-orange-950/50 border border-orange-800 text-white font-bold' 
                            : 'bg-transparent border border-transparent text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span>{cs.label}</span>
                        <span className="text-[9px] text-zinc-500 font-normal">{cs.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between bg-[#111115] p-3.5 rounded-lg border border-zinc-900 mt-2">
                <span className="text-[10px] text-zinc-400 font-sans">
                  S'assurer de la validité de l'ancrage des pixels de conversion Amazon ?
                </span>
                <button
                  onClick={() => triggerAgentAction('mercato', 'update_link')}
                  disabled={isSimulatingAction === 'mercato'}
                  className="px-4 py-2 bg-gradient-to-r from-amber-505 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 hover:text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSimulatingAction === 'mercato' ? 'Raccordement...' : 'Lier Balises Affiliation'}
                </button>
              </div>
            </div>
          )}

          {selectedAgentSettingsId === 'comptable' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded text-white text-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-white text-xs font-bold font-sans uppercase">Configuration de l'Agent Comptable</h5>
                  <p className="text-[10px] text-zinc-500 font-mono">Facturation & grand livre de taxes</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Tax regime */}
                <div className="bg-[#08080c] p-3 rounded-lg border border-zinc-900">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase block mb-2">1. Juridiction & Régime de calcul légal</label>
                  <div className="space-y-1.5">
                    {[
                      { id: 'canadian_gst', label: '🇨🇦 Canada (TPS-TVQ)', desc: 'Factures avec taxes québécoises' },
                      { id: 'swiss_vat', label: '🇨🇭 Suisse (CH-TVA)', desc: 'TVA helvétique de 8.1% programmée' },
                      { id: 'eu_reverse', label: '🇪🇺 Europe Reverse Charge', desc: 'Reverse charge B2B auto-liquidée' }
                    ].map((cc) => (
                      <button
                        key={cc.id}
                        onClick={() => handleUpdateEliteSetting({ swissComptableCompliance: cc.id })}
                        className={`w-full text-left p-2 rounded text-[11px] font-sans transition-all flex items-center justify-between cursor-pointer ${
                          swissComptableCompliance === cc.id 
                            ? 'bg-emerald-950/50 border border-emerald-850 text-white font-bold' 
                            : 'bg-transparent border border-transparent text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span>{cc.label}</span>
                        <span className="text-[9px] text-zinc-500 font-normal">{cc.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Ledger format */}
                <div className="bg-[#08080c] p-3 rounded-lg border border-zinc-900">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase block mb-2">2. Signature Cryptographique</label>
                  <div className="space-y-1.5">
                    {[
                      { id: 'sha256', label: '🔐 Signature SHA-256', desc: 'Inviolabilité mathématique certifiée' },
                      { id: 'standard', label: '📖 Registre Clair Standard', desc: 'CSV formaté conforme aux audits fiscaux' },
                      { id: 'compact', label: '⚡ Fichiers condensés', desc: 'Performance maximale de calcul d\'EBITDA' }
                    ].map((cl) => (
                      <button
                        key={cl.id}
                        onClick={() => handleUpdateEliteSetting({ swissComptableLogFormat: cl.id })}
                        className={`w-full text-left p-2 rounded text-[11px] font-sans transition-all flex items-center justify-between cursor-pointer ${
                          swissComptableLogFormat === cl.id 
                            ? 'bg-emerald-950/50 border border-emerald-850 text-white font-bold' 
                            : 'bg-transparent border border-transparent text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span>{cl.label}</span>
                        <span className="text-[9px] text-zinc-500 font-normal">{cl.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between bg-[#111115] p-3.5 rounded-lg border border-zinc-900 mt-2">
                <span className="text-[10px] text-zinc-400 font-sans">
                  Signer et certifier l'intégrité comptable du grand livre ?
                </span>
                <button
                  onClick={() => triggerAgentAction('comptable', 'sign_ledger')}
                  disabled={isSimulatingAction === 'comptable'}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSimulatingAction === 'comptable' ? 'Scellement...' : 'Forcer Audit SHA-256'}
                </button>
              </div>
            </div>
          )}

          {selectedAgentSettingsId === 'tresorier' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded text-white text-xs">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-white text-xs font-bold font-sans uppercase">Configuration de l'Agent Trésorier</h5>
                  <p className="text-[10px] text-zinc-500 font-mono">Arbitrage des flux de conversion fiat & crypto-couverture</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Hedging slider */}
                <div className="bg-[#08080c] p-3 rounded-lg border border-zinc-900 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[9px] font-mono text-zinc-500 uppercase">Ratio de Couverture Bitcoin</label>
                      <span className="text-xs text-amber-500 font-mono font-bold">{swissTresorierHedgeThreshold}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={swissTresorierHedgeThreshold}
                      onChange={(e) => handleUpdateEliteSetting({ swissTresorierHedgeThreshold: parseInt(e.target.value) })}
                      className="w-full h-1 bg-[#121215] rounded appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                  <p className="text-[9px] text-zinc-500 font-sans mt-2 leading-relaxed">
                    Pourcentage converti en Bitcoin vers la clé froide sécurisée de réserve lors de chaque encaissement client.
                  </p>
                </div>

                {/* 2. Primary Gateway */}
                <div className="bg-[#08080c] p-3 rounded-lg border border-zinc-900">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase block mb-2">2. Passerelle Principale de Retrait</label>
                  <div className="space-y-1.5">
                    {[
                      { id: 'stripe', label: '💳 Stripe direct', desc: 'Rapprochement immédiat de ventes' },
                      { id: 'eft_sim', label: '🏦 Virement EFT Suisse', desc: 'Canaux interbancaires transfrontaliers' },
                      { id: 'btc_direct', label: '🪙 Transfert Froid Crypto', desc: 'Réseau décentralisé sans intermédiaire' }
                    ].map((pg) => (
                      <button
                        key={pg.id}
                        onClick={() => handleUpdateEliteSetting({ swissTresorierPaymentGateway: pg.id })}
                        className={`w-full text-left p-2 rounded text-[11px] font-sans transition-all flex items-center justify-between cursor-pointer ${
                          swissTresorierPaymentGateway === pg.id 
                            ? 'bg-blue-950/50 border border-blue-850 text-white font-bold' 
                            : 'bg-transparent border border-transparent text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span>{pg.label}</span>
                        <span className="text-[9px] text-zinc-500 font-normal">{pg.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between bg-[#111115] p-3.5 rounded-lg border border-zinc-900 mt-2">
                <span className="text-[10px] text-zinc-400 font-sans">
                  Déclencher un transfert immédiat vers votre passerelle préférée ?
                </span>
                <button
                  onClick={() => triggerAgentAction('tresorier', 'payout')}
                  disabled={isSimulatingAction === 'tresorier'}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-650 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSimulatingAction === 'tresorier' ? 'Versement...' : 'Déclencher Versement'}
                </button>
              </div>
            </div>
          )}

          {/* Action Simulation success notification alert box */}
          {simulationSuccess && (
            <div className="mt-4 bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-lg flex items-start gap-2.5 animate-in fade-in duration-250">
              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <span className="text-xs text-white font-bold font-sans">Rapport d'exécution d'Autopilote d'Agent</span>
                <p className="text-[10.5px] text-emerald-300 font-mono leading-relaxed">{simulationSuccess}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Collapsible Swiss Army Options Panel */}
      {isSettingsExpanded && (
        <div className="relative z-10 mb-5 bg-[#0b0b0b] border border-cyan-950 rounded-xl p-5 animate-in slide-in-from-top-4 duration-250">
          <div className="absolute top-0 right-0 p-3">
            <span className="text-[8px] px-1.5 py-0.5 rounded font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-900/50">
              {isUpdating ? 'SYNCHRONISATION...' : 'MODÈLE D\'ARBITRAGE ACTIF'}
            </span>
          </div>

          <h5 className="text-white text-xs font-bold font-sans uppercase tracking-wider flex items-center gap-1.5 mb-4 text-cyan-400">
            <Settings className="w-3.5 h-3.5 animate-spin" />
            <span>CONSOLE CONFIGURATION : MODULES D'ARBITRAGE ÉLITE</span>
          </h5>

          <p className="text-[11px] text-zinc-400 mb-5 font-sans leading-relaxed">
            Module de contrôle exclusif pour optimiser les marges et l'Uptime des agents de la flotte.
            Chaque modification ajuste les modèles de probabilité de l'algorithme sémantique en temps réel.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Choose Protocol */}
            <div className="space-y-3">
              <label className="text-[10px] text-zinc-500 uppercase font-mono font-bold block">
                1. Protocole Stratégique Élite
              </label>

              <div className="space-y-2">
                {[
                  { id: 'cascade', title: 'Cascade Standard', desc: 'Séquençage articles + digital Packs' },
                  { id: 'aggressive', title: 'Sémantique Agressive', desc: 'Multiplie l\'engagement (+80% taux)' },
                  { id: 'wholesale', title: 'Grossiste API Tokens', desc: 'Ventes instantanées de clés Corp suisses' },
                  { id: 'arbitrage', title: 'Arbitrage Crypto / Fiat', desc: 'Captures de spreads de cotations directes' }
                ].map((proto) => {
                  const isChosen = swissEliteProtocol === proto.id;
                  return (
                    <button
                      key={proto.id}
                      onClick={() => handleUpdateEliteSetting({ swissEliteProtocol: proto.id as any })}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex flex-col justify-between ${
                        isChosen 
                          ? 'bg-cyan-950/40 border-cyan-500/60 text-white' 
                          : 'bg-[#0d0d0d] border-zinc-900 text-zinc-400 hover:border-zinc-800'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>{proto.title}</span>
                        {isChosen && <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <span className="text-[9px] text-zinc-500 font-medium font-sans mt-0.5 leading-snug">
                        {proto.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Parameters Sliders */}
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono font-bold">
                    2. Multiplicateur Sémantique
                  </label>
                  <span className="text-xs text-cyan-400 font-mono font-bold">
                    {swissVelocityMultiplier.toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.5"
                  value={swissVelocityMultiplier}
                  onChange={(e) => handleUpdateEliteSetting({ swissVelocityMultiplier: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <p className="text-[9px] text-zinc-500 font-sans leading-normal mt-1">
                  Suramplifie la volumétrie de trafic organique générée par les articles (+ {Math.round((swissVelocityMultiplier - 1) * 100)}%).
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono font-bold">
                    3. Auto-Réinvestissement Élite
                  </label>
                  <span className="text-xs text-emerald-400 font-mono font-bold">
                    {swissReinvestShare}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={swissReinvestShare}
                  onChange={(e) => handleUpdateEliteSetting({ swissReinvestShare: parseInt(e.target.value) })}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <p className="text-[9px] text-zinc-500 font-sans leading-normal mt-1">
                  Allocation passive prélevée sur chaque vente pour financer les robots de l'Agent Echo. Est écrit dans le registre comptable.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono font-bold">
                    4. Période Cycle d'Arbitrage
                  </label>
                  <span className="text-xs text-purple-400 font-mono font-bold">
                    {swissAutoPilotInterval}s
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={swissAutoPilotInterval}
                  onChange={(e) => handleUpdateEliteSetting({ swissAutoPilotInterval: parseInt(e.target.value) })}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <p className="text-[9px] text-zinc-500 font-sans leading-normal mt-1">
                  Fréquence recommandée pour l'audit sémantique d'Uptime de la centrale d'amélioration.
                </p>
              </div>
            </div>

            {/* Column 3: Safe Toggles */}
            <div className="space-y-4">
              <label className="text-[10px] text-zinc-500 uppercase font-mono font-bold block">
                5. Sécurités & Transferts Actifs
              </label>

              <div className="bg-[#0c0c0c] border border-zinc-900 rounded-lg p-3 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs text-white font-bold leading-none block">Hedging Bitcoin direct</span>
                    <span className="text-[9px] text-zinc-500 block leading-tight">Glace 15% immédiats en cold crypto</span>
                  </div>
                  
                  <button
                    onClick={() => handleUpdateEliteSetting({ swissHedgeBtcEnabled: !swissHedgeBtcEnabled })}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors focus:outline-none flex items-center ${
                      swissHedgeBtcEnabled ? 'bg-amber-500 justify-end' : 'bg-zinc-800 justify-start'
                    }`}
                  >
                    <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-900 pt-3">
                  <div className="space-y-0.5">
                    <span className="text-xs text-white font-bold leading-none block">Protection Antigravity</span>
                    <span className="text-[9px] text-zinc-500 block leading-tight">Empêche les liquidations de soldes</span>
                  </div>
                  
                  <button
                    onClick={() => handleUpdateEliteSetting({ swissSafetyLockEnabled: !swissSafetyLockEnabled })}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors focus:outline-none flex items-center ${
                      swissSafetyLockEnabled ? 'bg-cyan-500 justify-end' : 'bg-zinc-800 justify-start'
                    }`}
                  >
                    <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                  </button>
                </div>
              </div>

              {/* Mini Status report message box */}
              <div className="bg-cyan-950/15 border border-cyan-900/40 p-3 rounded-lg text-[10px] text-cyan-400 font-mono leading-relaxed">
                <div className="flex items-center gap-1 font-bold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SÛRETÉ SÉMANTIQUE SUISSE OK</span>
                </div>
                Aura gère {state.products.length} formats de produits et {state.articles.length} indexations actives. Le ratio est stabilisé.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cash Pipeline Flow Description */}
      <div className="mt-4 bg-[#0c0c0c] border border-[#1a1a1a] rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-zinc-500 relative z-10 transition-colors">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            {swissEliteProtocol === 'wholesale' 
              ? 'LIAISON WHOLESALE ACTIVE : Les devises sont liquidées de manière synchrone auprès de nos correspondants suisses.' 
              : swissEliteProtocol === 'arbitrage'
              ? 'LIAISON D\'ARBITRAGE ACTIVE : Cotations sous surveillance directe. Hedging automatique activé.'
              : 'LIAISON FINANCIÈRE CONTINUE : Les fonds captés en Stripe direct sont automatiquement réconciliés et routés.'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-bold">
          <span className="text-zinc-650 text-zinc-600">Autopilote d'Arbitrage sémantique à</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 font-extrabold px-1.5 py-0.5 bg-cyan-950/40 rounded border border-cyan-900/60 font-mono">
            {swissVelocityMultiplier.toFixed(1)}x Élite puissance
          </span>
        </div>
      </div>
    </div>
  );
}
