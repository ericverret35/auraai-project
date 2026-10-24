import React, { useState, useEffect, useRef } from 'react';
import { MicroService, Incident, ChatMessage } from '../types';
import {
  Cpu,
  Terminal,
  Activity,
  DollarSign,
  TrendingUp,
  Users,
  Send,
  Plus,
  Trash2,
  Edit,
  Sliders,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Layers,
  Database,
  ArrowUpRight,
  ShieldAlert,
  ShieldCheck,
  Play,
  Info,
  X
} from 'lucide-react';

interface MicroservicesTabProps {
  microServices: MicroService[];
  incidents: Incident[];
  chatHistory: ChatMessage[];
  niche: string;
  onSendMessage: (message: string) => Promise<void>;
  onCreateOrUpdateService: (service: Partial<MicroService>) => Promise<void>;
  onDeleteService: (id: string) => Promise<void>;
  onResolveIncident: (id: string) => Promise<void>;
  onSelfTestError: (id: string) => Promise<void>;
  onGlobalDiagnoseHeal: () => Promise<any>;
  isLoading: boolean;
}

export default function MicroservicesTab({
  microServices,
  incidents,
  chatHistory,
  niche,
  onSendMessage,
  onCreateOrUpdateService,
  onDeleteService,
  onResolveIncident,
  onSelfTestError,
  onGlobalDiagnoseHeal,
  isLoading
}: MicroservicesTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'console' | 'services' | 'monitoring'>('services');
  const [chatInput, setChatInput] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showApiCallsModal, setShowApiCallsModal] = useState<boolean>(false);
  const [showSubscribersModal, setShowSubscribersModal] = useState<boolean>(false);
  const [showResilienceModal, setShowResilienceModal] = useState<boolean>(false);
  const [showServicesModal, setShowServicesModal] = useState<boolean>(false);
  const [showIncidentsModal, setShowIncidentsModal] = useState<boolean>(false);
  const [showMonitoringModal, setShowMonitoringModal] = useState<boolean>(false);
  const [selectedServiceForConfig, setSelectedServiceForConfig] = useState<MicroService | null>(null);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [showSecurityModal, setShowSecurityModal] = useState<boolean>(false);

  // Diagnostic wizard feedback state
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [diagnoseStep, setDiagnoseStep] = useState<number>(0);
  const [diagnoseReport, setDiagnoseReport] = useState<{ healedCount: number; message: string } | null>(null);

  const triggerGlobalDiagnosis = async () => {
    setIsDiagnosing(true);
    setDiagnoseStep(1);
    setDiagnoseReport(null);
    
    // Immersive progressive steps reporting state transitions
    await new Promise(r => setTimeout(r, 600));
    setDiagnoseStep(2);
    await new Promise(r => setTimeout(r, 600));
    setDiagnoseStep(3);
    await new Promise(r => setTimeout(r, 600));
    setDiagnoseStep(4);
    
    // Fire the actual API call to heal all active errors of the applet
    const result = await onGlobalDiagnoseHeal();
    
    await new Promise(r => setTimeout(r, 500));
    setDiagnoseStep(5);
    
    if (result) {
      setDiagnoseReport({
        healedCount: result.healedCount || 0,
        message: result.message || "La flotte d'hébergement a été recalibrée."
      });
    }

    // Hold step 5 for reading
    await new Promise(r => setTimeout(r, 1800));
    setIsDiagnosing(false);
  };

  // Form states for service creation/edit
  const [serviceName, setServiceName] = useState<string>('');
  const [serviceDesc, setServiceDesc] = useState<string>('');
  const [serviceEndpoint, setServiceEndpoint] = useState<string>('');
  const [pricingType, setPricingType] = useState<'subscription' | 'pay_as_you_go'>('pay_as_you_go');
  const [pricePerCall, setPricePerCall] = useState<number>(0.02);
  const [monthlyPrice, setMonthlyPrice] = useState<number>(29.00);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const prevChatLength = useRef(chatHistory.length);

  useEffect(() => {
    if (chatHistory.length > prevChatLength.current) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      prevChatLength.current = chatHistory.length;
    }
  }, [chatHistory]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(chatInput);
    setChatInput('');
  };

  const handleOpenCreateModal = (service?: MicroService) => {
    if (service) {
      setIsEditing(service.id);
      setServiceName(service.name);
      setServiceDesc(service.description);
      setServiceEndpoint(service.endpoint);
      setPricingType(service.pricingType);
      setPricePerCall(service.pricePerCall);
      setMonthlyPrice(service.monthlyPrice);
    } else {
      setIsEditing(null);
      setServiceName('');
      setServiceDesc('');
      setServiceEndpoint(`/api/v1/custom-${Math.floor(Math.random() * 1000)}`);
      setPricingType('pay_as_you_go');
      setPricePerCall(0.01);
      setMonthlyPrice(19.90);
    }
    setShowCreateModal(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName || !serviceDesc) return;

    await onCreateOrUpdateService({
      id: isEditing || undefined,
      name: serviceName,
      description: serviceDesc,
      endpoint: serviceEndpoint,
      pricingType,
      pricePerCall: pricingType === 'pay_as_you_go' ? Number(pricePerCall) : 0,
      monthlyPrice: pricingType === 'subscription' ? Number(monthlyPrice) : 0,
    });

    setShowCreateModal(false);
  };

  // Quick Chat Suggestion triggers
  const sendSuggestedPrompt = (prompt: string) => {
    onSendMessage(prompt);
  };

  // Compute calculated metrics
  const totalMicroserviceEarnings = microServices.reduce((acc, s) => acc + s.earnings, 0);
  const totalCalls = microServices.reduce((acc, s) => acc + s.callsCount, 0);
  const totalSubs = microServices.reduce((acc, s) => acc + s.subscribersCount, 0);
  const activeIncidents = incidents.filter(i => i.status === 'active');
  
  const avgUptime = microServices.length > 0 
    ? parseFloat((microServices.reduce((acc, s) => acc + s.uptime, 0) / microServices.length).toFixed(2)) 
    : 100.00;

  return (
    <div id="microservices-platform-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
      
      {/* Top microservice metrics summary card layout - 12 cols */}
      {/* Top microservice metrics summary card layout - 12 cols */}
      <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div 
          onClick={() => setShowSettingsModal(true)}
          className="bg-[#111] border border-zinc-800 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-cyan-500/30 transition-all duration-300 relative group/ms"
        >
          <div className="absolute left-0 bottom-full mb-2 hidden group-hover/ms:block w-72 bg-zinc-900 border border-zinc-800 text-slate-200 text-xs p-3 rounded-lg shadow-xl z-50 pointer-events-none normal-case font-normal leading-relaxed">
            <span className="font-extrabold text-cyan-400 block mb-1 font-mono uppercase tracking-wider">💰 REVENUS ET USAGE HÉBERGÉ MRR</span>
            Calcule le montant cumulé total généré par l'ensemble des microservices IA actifs en production. Taux de profitabilité à 100% grâce à l'usage gratuit des modèles.
          </div>
          <div className="space-y-1 group-hover/ms:text-cyan-400 transition-colors">
            <span className="text-[10px] uppercase font-mono text-zinc-500 flex items-center gap-1.5">
              MRR & Usage hébergé <span className="text-cyan-400 font-bold animate-pulse">(ℹ️)</span>
            </span>
            <span className="text-xl font-bold font-mono text-cyan-400">
              +{totalMicroserviceEarnings.toLocaleString('fr-CA', { minimumFractionDigits: 2 })} CA$
            </span>
            <span className="text-[9px] text-zinc-400 block font-sans">Revenus passifs purs IA</span>
          </div>
          <div className="p-2 bg-cyan-950/40 rounded-lg border border-cyan-800 text-cyan-400 group-hover/ms:bg-cyan-900/60">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => setShowApiCallsModal(true)}
          className="bg-[#111] border border-zinc-800 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-500/30 transition-all duration-300 relative group/api"
        >
          <div className="absolute left-0 bottom-full mb-2 hidden group-hover/api:block w-72 bg-zinc-900 border border-zinc-800 text-slate-200 text-xs p-3 rounded-lg shadow-xl z-50 pointer-events-none normal-case font-normal leading-relaxed">
            <span className="font-extrabold text-[#00f2fe] block mb-1 font-mono uppercase tracking-wider">⚡ TRANSPORTS ET APPELS API BILLABLE</span>
            Mesure en temps réel le décompte d'appels API effectués par vos clients. Le limiteur de flux local (Rate-Limiting) protège automatiquement contre les surcharges.
          </div>
          <div className="space-y-1 group-hover/api:text-blue-400 transition-colors">
            <span className="text-[10px] uppercase font-mono text-zinc-500 flex items-center gap-1.5 block">
              Appels API Billable <span className="text-[#00f2fe] font-bold animate-pulse">(ℹ️)</span>
            </span>
            <span className="text-xl font-bold font-mono text-zinc-100 group-hover/api:text-blue-100 transition-colors">
              {totalCalls.toLocaleString('fr-CA')} calls
            </span>
            <span className="text-[9px] text-emerald-400 block font-mono">Simulés en temps réel</span>
          </div>
          <div className="p-2 bg-blue-950/40 rounded-lg border border-blue-900 text-blue-400 group-hover/api:bg-blue-900/60">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={() => setShowSubscribersModal(true)}
          className="bg-[#111] border border-zinc-800 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-amber-500/30 transition-all duration-300 relative group/subs"
        >
          <div className="absolute left-0 bottom-full mb-2 hidden group-hover/subs:block w-72 bg-zinc-900 border border-zinc-800 text-slate-200 text-xs p-3 rounded-lg shadow-xl z-50 pointer-events-none normal-case font-normal leading-relaxed">
            <span className="font-extrabold text-amber-400 block mb-1 font-mono uppercase tracking-wider">👥 INDEX CLIENTS ET ABONNÉS SAAS</span>
            Nombre d'entreprises B2B ou d'utilisateurs finaux abonnés à un de vos 5 microservices IA. L'Agent Copilot s'occupe de relancer automatiquement les résiliations.
          </div>
          <div className="space-y-1 group-hover/subs:text-amber-400 transition-colors">
            <span className="text-[10px] uppercase font-mono text-zinc-500 flex items-center gap-1.5 block">
              Abonnés SaaS IA <span className="text-amber-400 font-bold animate-pulse">(ℹ️)</span>
            </span>
            <span className="text-xl font-bold font-mono text-zinc-100 group-hover/subs:text-amber-100 transition-colors">
              {totalSubs} clients payants
            </span>
            <span className="text-[9px] text-amber-400 block font-sans">Cycle d'arbitrage auto</span>
          </div>
          <div className="p-2 bg-amber-950/40 rounded-lg border border-amber-900 text-amber-500 group-hover/subs:bg-amber-900/60">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={() => setShowResilienceModal(true)}
          className="bg-[#111] border border-zinc-800 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-emerald-500/30 transition-all duration-300 relative group/resil"
        >
          <div className="absolute right-0 bottom-full mb-2 hidden group-hover/resil:block w-72 bg-zinc-900 border border-zinc-800 text-slate-200 text-xs p-3 rounded-lg shadow-xl z-50 pointer-events-none normal-case font-normal leading-relaxed">
            <span className="font-extrabold text-emerald-400 block mb-1 font-mono uppercase tracking-wider">🛡️ SCORE GLOBAL DE RÉSILIENCE</span>
            Calculateur d'Uptime moyen sur les microservices d'Aura. En cas d'anomalie réseau ou d'indexation rompue, cliquez sur l'Auto-Correcteur pour purger les échecs.
          </div>
          <div className="space-y-1 group-hover/resil:text-emerald-400 transition-colors">
            <span className="text-[10px] uppercase font-mono text-zinc-500 flex items-center gap-1.5 block">
              Score de Résilience <span className="text-emerald-400 font-bold animate-pulse">(ℹ️)</span>
            </span>
            <span className="text-xl font-bold font-mono text-emerald-400 group-hover/resil:text-emerald-300 transition-colors">
               {avgUptime}% Uptime
            </span>
            <span className={`text-[9px] font-mono block ${activeIncidents.length > 0 ? 'text-rose-400 animate-pulse' : 'text-zinc-500'}`}>
              {activeIncidents.length} incident(s) actif(s)
            </span>
          </div>
          <div className="p-2 bg-emerald-950/40 rounded-lg border border-emerald-900 text-emerald-400 group-hover/resil:bg-emerald-900/60">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main Switch board sub-navigator */}
      <div className="lg:col-span-12 flex items-center justify-between border-b border-zinc-800 pb-2">
        <div className="flex gap-2 bg-[#0a0a0a] p-1 rounded-lg border border-zinc-900 text-xs font-mono">
          <button
            onClick={() => setActiveSubTab('services')}
            className={`px-3 py-1.5 rounded transition relative group/tab ${activeSubTab === 'services' ? 'bg-[#1e1e1e] text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tab:block w-48 bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] p-2 rounded-lg shadow-xl z-50 pointer-events-none">
              Gérez, déployez et configurez vos microservices IA.
            </div>
            🔌 Catalogue Micro-Services IA
          </button>
          <button
            onClick={() => setActiveSubTab('console')}
            className={`px-3 py-1.5 rounded transition relative group/tab ${activeSubTab === 'console' ? 'bg-[#1e1e1e] text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tab:block w-48 bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] p-2 rounded-lg shadow-xl z-50 pointer-events-none">
              Surveillez la santé du système et gérez les incidents.
            </div>
            <Terminal className="w-3.5 h-3.5 inline mr-1" /> Log d'Erreurs & Résilience
          </button>
          <button
            onClick={() => setActiveSubTab('monitoring')}
            className={`px-3 py-1.5 rounded transition relative group/tab ${activeSubTab === 'monitoring' ? 'bg-[#1e1e1e] text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tab:block w-48 bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] p-2 rounded-lg shadow-xl z-50 pointer-events-none">
              Visualisez les performances et les revenus.
            </div>
            📊 Moniteur d'Utilisation
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={triggerGlobalDiagnosis}
            disabled={isDiagnosing}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-700 via-indigo-755 to-cyan-600 hover:from-blue-600 hover:to-cyan-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 disabled:opacity-50 transition shadow-md shadow-blue-500/10 border border-blue-900/45"
          >
            <ShieldAlert className={`w-3.5 h-3.5 ${isDiagnosing ? 'animate-spin text-cyan-200' : 'text-cyan-400'}`} />
            {isDiagnosing ? 'Vérification en cours...' : 'Diagnostic & Auto-Correction'}
          </button>

          <button
            onClick={() => handleOpenCreateModal()}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs rounded-lg flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Héberger un microservice
          </button>
        </div>
      </div>

      {/* LEFT SIDE: Active Sub Tab Panel Workspace, taking 8 columns */}
      <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">

        {/* Dynamic Verification & Diagnostics Terminal Scanner */}
        {isDiagnosing && (
          <div className="bg-[#0c0c0c] border border-cyan-500/40 p-4 rounded-xl space-y-3 animate-fade-in font-mono text-xs shadow-xl shadow-cyan-500/5">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-[10px] tracking-wide">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>SUPERVISEUR AURA : VÉRIFICATION SYSTÈMES GLOBALE ACTIVED</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Étape {diagnoseStep}/5</span>
            </div>

            {/* Glowing progress bar */}
            <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 h-full transition-all duration-305"
                style={{ width: `${(diagnoseStep / 5) * 100}%` }}
              ></div>
            </div>

            <div className="space-y-1.5 pt-1 text-[11px] leading-6">
              <div className={`flex items-center gap-2 transition-all ${diagnoseStep >= 1 ? 'text-cyan-400 font-bold' : 'text-zinc-655 text-zinc-500'}`}>
                <span>{diagnoseStep > 1 ? '✅' : '⚡'}</span>
                <span>Connexion sécurisée aux clusters de conteneurs de la flotte...</span>
              </div>
              <div className={`flex items-center gap-2 transition-all ${diagnoseStep >= 2 ? 'text-zinc-200' : 'text-zinc-500'}`}>
                <span>{diagnoseStep > 2 ? '✅' : diagnoseStep === 2 ? '🔄' : '▪️'}</span>
                <span className={diagnoseStep === 2 ? 'text-cyan-300 font-bold' : ''}>Contrôle d'intégrité de la passerelle de paiement Stripe EFT & SaaS...</span>
              </div>
              <div className={`flex items-center gap-3 transition-all ${diagnoseStep >= 3 ? 'text-zinc-200' : 'text-zinc-500'}`}>
                <span>{diagnoseStep > 3 ? '✅' : diagnoseStep === 3 ? '🔎' : '▪️'}</span>
                <span className={diagnoseStep === 3 ? 'text-cyan-300 font-bold animate-pulse' : ''}>Diagnostic sectoriel des anomalies et corruption de pile sémantique...</span>
              </div>
              <div className={`flex items-center gap-2 transition-all ${diagnoseStep >= 4 ? 'text-zinc-200' : 'text-zinc-500'}`}>
                <span>{diagnoseStep > 4 ? '✅' : diagnoseStep === 4 ? '🛠️' : '▪️'}</span>
                <span className={diagnoseStep === 4 ? 'text-cyan-300 font-bold animate-pulse' : ''}>Séquençage correctif automatisé [Auto-Heal Engine 2.11]...</span>
              </div>
              <div className={`flex items-center gap-2 transition-all ${diagnoseStep >= 5 ? 'text-emerald-400 font-extrabold' : 'text-zinc-500'}`}>
                <span>{diagnoseStep === 5 ? '👑' : '▪️'}</span>
                <span>Validation d'Uptime finalisée. Flotte 100% résiliente et saine.</span>
              </div>
            </div>

            {diagnoseReport && (
              <div className="mt-3 p-2.5 bg-emerald-950/20 border border-emerald-800/40 rounded-lg text-xs text-emerald-400 flex items-center justify-between font-sans">
                <span className="font-semibold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> {diagnoseReport.message}
                </span>
                <span className="font-bold text-[10px] uppercase px-2 py-0.5 bg-emerald-900/35 rounded text-emerald-300 border border-emerald-700/30">
                  {diagnoseReport.healedCount} incidents réparés
                </span>
              </div>
            )}
          </div>
        )}
        
        {/* View 1: Catalogue Microservices */}
        {activeSubTab === 'services' && (
          <div className="space-y-4">
            
            {activeIncidents.length > 0 && (
              <div className="bg-rose-950/30 border border-rose-800/60 p-4 rounded-xl flex items-center gap-3 animate-pulse">
                <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
                <div className="flex-1">
                  <h4 className="text-white text-xs font-bold">Alerte de Production : {activeIncidents.length} panne détectée</h4>
                  <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
                    L'IA Superviseur applique des correctifs en boucle résiliente v2 pour rétablir les microservices.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {microServices.map((service) => (
                <div key={service.id} className="bg-[#0f0f0f] border border-zinc-900 hover:border-zinc-850 p-4 rounded-xl flex flex-col justify-between transition relative group">
                  
                  {/* Tooltip on hover */}
                  <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-64 bg-[#0a0a0a] border border-zinc-800 p-4 rounded-xl shadow-2xl text-[10px] text-zinc-300 z-50 pointer-events-none scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 hidden lg:block">
                     <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-zinc-900">
                      <span className="font-bold flex items-center gap-1.5 text-cyan-400 uppercase text-[11px]">
                        <Cpu className="w-4 h-4" />
                        {service.name.substring(0,20)}...
                      </span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed text-[10px] mb-2">{service.description}</p>
                    <div className="bg-zinc-950/80 rounded border border-zinc-900 p-2 space-y-1 font-mono text-[8.5px] text-zinc-400">
                       <div className="flex justify-between"><span>Calls:</span><span className="text-cyan-400 font-bold">{service.callsCount}</span></div>
                       <div className="flex justify-between"><span>Uptime:</span><span className="text-emerald-400 font-bold">{service.uptime}%</span></div>
                    </div>
                  </div>

                  {/* Status Indicator pill */}
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-zinc-500 font-mono tracking-widest">{service.endpoint}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-mono font-bold ${
                      service.status === 'healthy' 
                        ? 'text-emerald-400 bg-emerald-950/30 border border-emerald-800/40' 
                        : service.status === 'error' 
                        ? 'text-rose-400 bg-rose-950/30 border border-rose-800/40 animate-pulse'
                        : 'text-amber-400 bg-amber-950/30 border border-amber-800/40 animate-pulse'
                    }`}>
                      {service.status === 'healthy' && 'opérationnel'}
                      {service.status === 'error' && 'erreur HTTP 500'}
                      {service.status === 'deploying' && 'auto-optimisation'}
                    </span>
                  </div>

                  {/* Body text */}
                  <div>
                    <h4 className="text-white font-extrabold text-sm truncate font-sans group-hover:text-cyan-400 transition">
                      {service.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 h-8 leading-relaxed font-sans">
                      {service.description}
                    </p>
                  </div>

                  {/* Stat line */}
                  <div className="mt-4 pt-3 border-t border-zinc-900/80 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div>
                      <span className="text-[8px] text-zinc-500 uppercase block">Calls reçus</span>
                      <span className="font-bold text-zinc-200">{service.callsCount}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-500 uppercase block">Revenu SaaS</span>
                      <span className="font-bold text-cyan-400">+{service.earnings.toFixed(2)} CA$</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-500 uppercase block">Uptime global</span>
                      <span className={`font-bold ${service.uptime < 99 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {service.uptime}%
                      </span>
                    </div>
                  </div>

                  {/* Pricing Model Info */}
                  <div className="mt-3 bg-[#0a0a0a] p-2 rounded border border-zinc-900 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-zinc-500 uppercase font-semibold">TARIFICATION :</span>
                    <span className="text-zinc-200">
                      {service.pricingType === 'pay_as_you_go' 
                        ? `${service.pricePerCall.toFixed(3)} CA$ / appel` 
                        : `${service.monthlyPrice.toFixed(2)} CA$ / abonnement`
                      }
                    </span>
                  </div>

                  {/* Actions drawer */}
                  <div className="mt-3 flex gap-2 pt-2 justify-end">
                    <button
                      onClick={() => { setSelectedServiceForConfig(service); setShowConfigModal(true); }}
                      className="px-2 py-1 text-[9px] font-mono uppercase bg-cyan-950/20 text-cyan-400 border border-cyan-900/40 hover:bg-cyan-950/40 rounded transition-all"
                    >
                      ⚙️ Configurer
                    </button>
                    <button
                      onClick={() => onSelfTestError(service.id)}
                      disabled={service.status === 'error'}
                      className="px-2 py-1 text-[9px] font-mono uppercase bg-rose-950/20 text-rose-400 border border-rose-900/40 hover:bg-rose-950/40 rounded transition-all disabled:opacity-50"
                      title="Test de Résilience : Diagnostic manuel des erreurs de production"
                    >
                      Diagnostic Bug
                    </button>
                    <button
                      onClick={() => handleOpenCreateModal(service)}
                      className="p-1 px-2 text-[9px] font-mono text-zinc-400 hover:text-white border border-zinc-800 bg-[#111] rounded"
                    >
                      <Edit className="w-3 h-3 inline mr-1" /> Config
                    </button>
                    <button
                      onClick={() => onDeleteService(service.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 border border-zinc-900 bg-[#0a0a0a] hover:bg-zinc-950 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        )}

        {/* View 2: Logs d'Erreurs & Résilience Active */}
        {activeSubTab === 'console' && (
          <div className="bg-[#0f0f0f] border border-zinc-900 p-5 rounded-2xl flex flex-col space-y-4 font-mono select-text text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <div className="flex items-center gap-1.5 text-cyan-400">
                <Terminal className="w-4 h-4 animate-pulse" />
                <span>MONITEUR DE PRODUCTION ULTRA-SÉCURISÉ & AUTO-PATCH</span>
              </div>
              <span className="text-[10px] text-zinc-500">Auto-Guérison Active</span>
            </div>

            {/* Quick Hero panel for global verification and healing */}
            <div className="p-4 bg-[#0a0a0a] border border-cyan-900/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-white font-extrabold text-xs flex items-center gap-1.5 font-sans">
                  <ShieldAlert className="text-cyan-400 w-4 h-4" />
                  Auto-Correction & Contrôle d'Erreurs Global
                </h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans max-w-md">
                  Analysez l'état sémantique de l'ensemble de vos microservices hébergés et appliquez instantanément un correctif d'intégrité de pile sur toutes les pannes détectées.
                </p>
              </div>
              <button
                onClick={triggerGlobalDiagnosis}
                disabled={isDiagnosing}
                className="w-full sm:w-auto shrink-0 px-3.5 py-1.5 bg-gradient-to-r from-blue-700 via-cyan-600 to-teal-650 hover:from-blue-600 hover:to-teal-550 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 transition border border-cyan-900/50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isDiagnosing ? 'animate-spin text-zinc-100' : 'text-cyan-400'}`} />
                {isDiagnosing ? 'Exécution...' : 'Lancer le Diagnostic Global'}
              </button>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
              {incidents.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs italic">
                  Aucun incident détecté. Tout fonctionne parfaitement sous l'intelligence de l'Orchestrator.
                </div>
              ) : (
                incidents.map((incident) => (
                  <div key={incident.id} className={`p-3.5 rounded-xl border ${
                    incident.status === 'active' 
                      ? 'bg-rose-950/10 border-rose-800/40 text-rose-300' 
                      : 'bg-zinc-950 border-zinc-900 text-emerald-400'
                  }`}>
                    <div className="flex justify-between items-start mb-1.5 text-[11px]">
                      <span className="font-extrabold flex items-center gap-1 text-zinc-100">
                        {incident.status === 'active' ? (
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        {incident.serviceName}
                      </span>
                      <span className="text-zinc-500">{new Date(incident.timestamp).toLocaleTimeString('fr-CA')}</span>
                    </div>

                    <p className={`text-xs pl-4 font-mono font-semibold ${incident.status === 'active' ? 'text-rose-400' : 'text-zinc-400'}`}>
                      Err Message: {incident.errorMessage}
                    </p>

                    {incident.resolutionLog && (
                      <div className="mt-2.5 pt-2 border-t border-zinc-900/60 pl-4 text-[10px] text-emerald-400 leading-relaxed font-sans italic">
                        🛠️ {incident.resolutionLog}
                      </div>
                    )}

                    {incident.status === 'active' && (
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => onResolveIncident(incident.id)}
                          className="px-2.5 py-1 text-[10px] font-bold bg-emerald-900/40 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900/60 rounded"
                        >
                          Appliquer un Patch d'urgence manuel [FIX]
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg text-[9px] text-zinc-500">
              ⚡ SÉCURITÉ DE CONTRÔLE : L'Agent de Super-Contrôle orchestre les pods et redistribue la balance de charge (Serverless Architecture IA) toutes les 6 secondes lors de chaque Autopilot simulation-tick.
            </div>
          </div>
        )}

        {/* View 3: Suivi et Monitoring */}
        {activeSubTab === 'monitoring' && (
          <div className="bg-[#0f0f0f] border border-zinc-900 p-5 rounded-2xl space-y-6 text-xs text-zinc-400 font-sans">
            <div
              onClick={() => setShowMonitoringModal(true)}
              className="flex items-center gap-1.5 relative group/monitoring cursor-pointer hover:text-cyan-400 transition-colors"
            >
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover/monitoring:block w-72 bg-slate-800 text-slate-200 text-xs p-2.5 rounded-lg shadow-xl border border-slate-700 z-50 pointer-events-none normal-case font-normal">
                Répartition des gains par endpoint. Cliquez pour ajuster les seuils de rentabilité.
              </div>
              <h3 className="text-white font-extrabold text-sm font-sans flex items-center gap-1.5 group-hover/monitoring:text-cyan-400 transition-colors">
                <Database className="w-4 h-4 text-cyan-400" />
                Répartition Financière par Micro-Service IA <Info className="w-3.5 h-3.5 opacity-60 text-slate-500" />
              </h3>
            </div>

            <div className="space-y-4">
              {microServices.map(subService => {
                const percentage = totalMicroserviceEarnings > 0 
                  ? Math.round((subService.earnings / totalMicroserviceEarnings) * 100) 
                  : 0;
                  
                return (
                  <div key={subService.id} className="space-y-1">
                    <div className="flex justify-between font-mono text-[11px] text-zinc-300">
                      <span>{subService.name} ({subService.callsCount} requêtes)</span>
                      <span className="font-bold text-cyan-450">+{subService.earnings.toFixed(2)} CA$ ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Real-time Network Latency (RTT) and Node health watchdog */}
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900/80 space-y-3">
              <h4 className="text-white font-extrabold text-[10px] uppercase font-mono tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                Matrice de Ping Temps Réel des Clusters d'Hébergement [RTT Probes]
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {microServices.map((service, index) => {
                  // Generate realistic flickering ping delays
                  const ping = Math.floor(11 + (index * 6) + (Math.sin(Date.now() / 1500 + index) * 3));
                  const isHealthy = service.status === 'healthy';
                  
                  return (
                    <div key={service.id} className="p-2.5 bg-black/40 rounded-lg border border-zinc-900 flex justify-between items-center text-[10px] font-mono">
                      <div className="min-w-0 flex-1 pr-2">
                        <span className="text-zinc-300 font-bold block truncate">{service.name}</span>
                        <span className="text-zinc-600 text-[8px] block font-semibold truncate select-all">{service.endpoint}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`${isHealthy ? 'text-emerald-400 font-bold' : 'text-rose-500 font-extrabold'} block`}>
                          {isHealthy ? `${ping}ms` : 'TIMEOUT'}
                        </span>
                        <span className="text-[8px] uppercase font-bold block" style={{ color: isHealthy ? '#34d399' : '#f87171' }}>
                          {isHealthy ? 'SSL ACTIVE' : 'FAIL'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-900 grid grid-cols-2 gap-4">
              <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-900">
                <span className="text-[10px] text-zinc-500 uppercase block font-mono">Modèle économique SaaS</span>
                <p className="text-sm font-bold text-zinc-200 mt-1">Abonnements Récurrents</p>
                <span className="text-[10px] text-zinc-400 mt-2 block leading-relaxed font-sans">
                  Génère des revenus stables fixes mensuels pré-facturés chaque mois par client sémantique.
                </span>
              </div>
              <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-900">
                <span className="text-[10px] text-zinc-500 uppercase block font-mono">Mode Pay-As-You-Go</span>
                <p className="text-sm font-bold text-zinc-200 mt-1">Paiement sémantique à l'usage</p>
                <span className="text-[10px] text-zinc-400 mt-2 block leading-relaxed font-sans">
                  Monétise chaque calcul d'IA (tokens / requêtes HTTP) à la micro-seconde. Idéal pour doper la marge.
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* RIGHT SIDE: Dedicated Multi-Service Supervisor Agent (Aura Orchestrator) Chat panel - 5 cols */}
      <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
        
        {/* Chat box container */}
        <div className="bg-[#0f0f0f] border border-blue-950/50 rounded-2xl flex flex-col h-[520px] shadow-2xl relative overflow-hidden">
          
          {/* Header */}
          <div className="p-4 border-b border-zinc-900 bg-gradient-to-r from-blue-950/20 via-[#0a0a0a] to-[#0a0a0a] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center p-0.5 shadow-lg shadow-cyan-500/10">
                <div className="w-full h-full bg-[#111] rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-extrabold text-xs">AURA SUPERVISEUR</h3>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  Gouvernance Flotte ACTIVE
                </span>
              </div>
            </div>

            <span className="text-[9px] font-mono text-zinc-500">v2.5_CORE</span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 select-text font-sans scrollbar-thin">
            <div className="p-3 bg-zinc-950 border border-zinc-900 text-[11px] text-zinc-400 rounded-lg leading-relaxed">
              👋 Bonjour ! Je suis l'<strong>Agent Superviseur Aura</strong>. J'ai le contrôle de la plateforme d'hébergement. 
              <br/><br/>
              Je peux concevoir de nouveaux microservices financiers, corriger les serveurs, analyser les prix et diagnostiquer les incidents sémantiques automatiquement. Demandez-moi n'importe quoi !
            </div>

            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-tr-none'
                    : 'bg-[#181818] border border-zinc-800 text-zinc-100 rounded-tl-none'
                }`}>
                  {msg.message}
                </div>
                <span className="text-[8px] font-mono text-zinc-500 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-center gap-2 p-2 bg-zinc-950 border border-zinc-900 rounded-lg mr-auto text-xs font-mono text-zinc-400 max-w-[80%]">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Raisonnement de l'Agent Superviseur...</span>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Quick interactive actions list */}
          <div className="p-2 border-t border-zinc-900 bg-[#0a0a0a] flex flex-wrap gap-1.5 max-h-24 overflow-y-auto shrink-0">
            <button
              onClick={() => sendSuggestedPrompt("Suggère et déploie un microservice IA hautement rentable basé sur notre thématique de marché")}
              className="text-[9px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-cyan-400 rounded-md px-2 py-1 font-sans transition"
            >
              🚀 Suggérer/Déployer Micro-Service
            </button>
            <button
              onClick={() => sendSuggestedPrompt("Fais un audit de sécurité et de performances de mes microservices IA")}
              className="text-[9px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-emerald-400 rounded-md px-2 py-1 font-sans transition"
            >
              🔍 Audit de Performance/Sécurité
            </button>
            <button
              onClick={() => sendSuggestedPrompt("Pourquoi le serveur a-t-il rencontré des erreurs recemment et comment les as-tu résolues ?")}
              className="text-[9px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-rose-400 rounded-md px-2 py-1 font-sans transition"
            >
              🛠️ Explication des corrections de Bugs
            </button>
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSendChat} className="p-3 border-t border-zinc-900 bg-[#070707] flex gap-2 shrink-0">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Discuter avec l'IA Superviseur..."
              className="flex-1 bg-[#111] border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-400 text-white placeholder-zinc-500 font-medium"
            />
            <button
              type="submit"
              disabled={isLoading || !chatInput.trim()}
              className="p-2 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 rounded-lg text-white disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Interactive Sécurité & Facturation Card */}
        <button 
          onClick={() => setShowSecurityModal(true)}
          className="bg-[#111] border border-zinc-800 p-4 rounded-xl text-xs space-y-2.5 hover:border-cyan-500/50 transition-all text-left w-full group"
        >
          <h4 className="text-white font-extrabold text-xs tracking-wider uppercase font-mono text-zinc-300 group-hover:text-cyan-400">
            Sécurité & Facturation EFT
          </h4>
          <p className="text-zinc-400 leading-relaxed text-[11px] font-sans">
            Gérez la synchronisation des abonnements réels Stripe et configurez les paramètres de sécurité bancaire AES-256. Cliquez pour accéder au coffre-fort.
          </p>
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[10px]">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Passerelle active</span>
          </div>
        </button>

      </div>

      {/* MODAL: Config service */}
      {selectedServiceForConfig && showConfigModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b0b0b] border border-[#1f1f1f] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 to-indigo-600"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                    <Sliders className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider font-sans">
                      Service: {selectedServiceForConfig.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-cyan-500 font-mono">ID: {selectedServiceForConfig.endpoint}</span>
                      <span className="text-slate-600 text-[10px]">|</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800">
                        STATUS: {selectedServiceForConfig.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowConfigModal(false)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Description</h4>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl text-sm text-slate-300">
                      {selectedServiceForConfig.description}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Appels</div>
                      <div className="text-xl font-bold text-white mt-1 font-mono">{selectedServiceForConfig.callsCount}</div>
                    </div>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Revenu</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">{selectedServiceForConfig.earnings.toFixed(2)}€</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Configuration Avancée</h4>
                  <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Rate-Limiting</div>
                        <div className="text-[10px] text-slate-500">Protection Auto (1000 req/min)</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Auto-Heal</div>
                        <div className="text-[10px] text-slate-500">Redéploiement auto en cas d'incident</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Security */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b0b0b] border border-[#1f1f1f] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider font-sans">
                      Sécurité & Passerelle EFT
                    </h3>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSecurityModal(false)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-6">
                <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">Chiffrement AES-256 Actif</div>
                      <div className="text-[10px] text-slate-500">Protection banque-serveur garantie</div>
                    </div>
                    <div className="w-9 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 space-y-2">
                    <div className="flex justify-between items-center bg-zinc-900 p-2 rounded text-[10px] text-cyan-400 font-mono">
                      <span>KEY: aura_api_v2_f8d9...</span>
                      <Edit className="w-3 h-3 cursor-pointer hover:text-white" />
                    </div>
                    <div className="flex justify-between items-center bg-zinc-900 p-2 rounded text-[10px] text-zinc-400 font-mono">
                      <span>EFT-GATEWAY: OK</span>
                      <RefreshCw className="w-3 h-3 cursor-pointer hover:text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#121212] border border-rose-950/30 p-4 rounded-xl space-y-4">
                  <h4 className="text-[10px] uppercase text-rose-500 font-bold tracking-wider mb-2 font-mono">Journaux Financiers</h4>
                  <div className="space-y-2 text-[10px] font-mono text-zinc-400">
                     <div className="flex justify-between p-2 bg-zinc-950 rounded"><span>Virement EFT sortant:</span><span className="text-emerald-400 font-bold">+2450€</span></div>
                     <div className="flex justify-between p-2 bg-zinc-950 rounded"><span>Paiement Stripe SaaS:</span><span className="text-emerald-400 font-bold">+120€</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showMonitoringModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b0b0b] border border-[#1f1f1f] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 to-emerald-600"></div>
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider font-sans">
                      Performance & Répartition Financière IA
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-cyan-500 font-mono">Vue analytique Temps Réels</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowMonitoringModal(false)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Enhanced Metrics List */}
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Détail des Services</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {microServices.map((service) => (
                    <div 
                      key={service.id} 
                      onClick={() => { setSelectedServiceForConfig(service); setShowConfigModal(true); }}
                      className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl group relative hover:border-cyan-500/30 transition-all cursor-pointer hover:z-[60]"
                    >
                      <div className="flex items-center justify-between mb-3">
                         <div className="text-[12px] font-bold text-white flex items-center gap-2">
                           <Layers className="w-3 h-3 text-cyan-500" />
                           {service.name}
                         </div>
                         <div className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-300 font-mono">
                           {service.callsCount} req.
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-[10px] mb-3">
                          <div className="bg-zinc-950 p-2 rounded text-cyan-400 group/tt relative">
                              <span className="text-zinc-600">Revenu :</span> {service.earnings.toFixed(2)}€
                              <div className="absolute left-0 -top-12 mb-2 w-48 bg-zinc-800 p-2 rounded text-xs text-white opacity-0 group-hover/tt:opacity-100 transition-opacity z-[100] pointer-events-none">Revenu généré par ce service spécifique.</div>
                          </div>
                          <div className="bg-zinc-950 p-2 rounded text-emerald-400 group/tt relative">
                              <span className="text-zinc-600">Uptime :</span> {service.uptime}%
                              <div className="absolute left-0 -top-12 mb-2 w-48 bg-zinc-800 p-2 rounded text-xs text-white opacity-0 group-hover/tt:opacity-100 transition-opacity z-[100] pointer-events-none">Temps de disponibilité opérationnel actuel.</div>
                          </div>
                      </div>

                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-cyan-600 rounded-full" 
                           style={{ width: `${Math.min(100, (service.earnings / (totalMicroserviceEarnings || 1)) * 100)}%` }}
                         />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

               {/* Advanced Config Section */}
              <div className="mt-6 p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4">
                <h4 className="text-[10px] uppercase text-emerald-500 font-bold tracking-wider mb-2 font-mono">Configuration Stratégique IA</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg cursor-help group/tt relative hover:z-[70]">
                      <div className="absolute left-0 -top-12 mb-2 w-48 bg-zinc-800 p-2 rounded text-xs text-white opacity-0 group-hover/tt:opacity-100 transition-opacity z-[100] pointer-events-none">La réallocation automatique des ressources maximise le profit par micro-service.</div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Rebalancement Dynamique</div>
                        <div className="text-[10px] text-slate-500">Auto-ajustement des marges</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg cursor-help group/tt relative hover:z-[70]">
                      <div className="absolute left-0 -top-12 mb-2 w-48 bg-zinc-800 p-2 rounded text-xs text-white opacity-0 group-hover/tt:opacity-100 transition-opacity z-[100] pointer-events-none">Optimise les cycles d'exécution Serverless pour réduire les coûts opérationnels.</div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Optimiseur de Coût IA</div>
                        <div className="text-[10px] text-slate-500">Réduction de latence serverless</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={false} />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-zinc-800 w-full max-w-lg rounded-2xl relative overflow-hidden p-6 font-sans text-xs">
            <h3 className="text-white font-extrabold text-base mb-1.5">
              {isEditing ? 'Configurer le Micro-Service IA' : 'Héberger un Nouveau Micro-Service IA'}
            </h3>
            <p className="text-zinc-400 mb-4 text-[11px] h-4">
              {isEditing ? "Modifiez l'orientation tarifaire ou la balise d'arbitrage financier du service." : "Configurez manuellement un robot pour extraire ou distribuer des données monétisables."}
            </p>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold uppercase tracking-wider text-[9px] font-mono">Nom du Service IA</label>
                <input
                  type="text"
                  required
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="Ex: SaaS SEO Sentiment Extractor, Traducteur de prompt intelligent"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold uppercase tracking-wider text-[9px] font-mono">Description Commerciale</label>
                <textarea
                  required
                  rows={3}
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  placeholder="Expliquez ce que fait cette API et pourquoi les clients sémantiques s'y abonnent..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold uppercase tracking-wider text-[9px] font-mono">Point d'accès HTTP (Endpoint)</label>
                  <input
                    type="text"
                    required
                    value={serviceEndpoint}
                    onChange={(e) => setServiceEndpoint(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold uppercase tracking-wider text-[9px] font-mono">Méthode de Monetisation</label>
                  <select
                    value={pricingType}
                    onChange={(e) => setPricingType(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none"
                  >
                    <option value="pay_as_you_go">Usage (Pay-as-you-go)</option>
                    <option value="subscription">Abonnement Récurrent (SaaS)</option>
                  </select>
                </div>
              </div>

              {pricingType === 'pay_as_you_go' ? (
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold uppercase tracking-wider text-[9px] font-mono">Prix par requête HTTP (€/appel)</label>
                  <input
                    type="number"
                    step={0.001}
                    required
                    value={pricePerCall}
                    onChange={(e) => setPricePerCall(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <span className="text-[9px] text-zinc-500 block mt-1">Chaque tick de simulation calculera de l'usage en fonction de ce tarif unitaire.</span>
                </div>
              ) : (
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold uppercase tracking-wider text-[9px] font-mono">Frais Fixes Mensuels (€/mois)</label>
                  <input
                    type="number"
                    step={0.1}
                    required
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <span className="text-[9px] text-zinc-500 block mt-1">Abonnement fixe récurrent prélevé périodiquement à chaque client.</span>
                </div>
              )}

              <div className="pt-3 border-t border-zinc-900 flex justify-end gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-[#1c1c1c] hover:bg-[#252525] text-zinc-400 hover:text-white rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-bold rounded-lg"
                >
                  {isEditing ? 'Enregistrer modifications' : 'Héberger sur la Plateforme Aura'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b0b0b] border border-[#1f1f1f] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                    <DollarSign className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider font-sans">
                      Stratégie de Monétisation SaaS
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-cyan-500 font-mono">Facturation Globale</span>
                      <span className="text-slate-600 text-[10px]">|</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800">
                        ROUTAGE: STRIPE BILLING
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Fonction & Description</h4>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl text-sm justify-between text-slate-300">
                      Définissez les paramètres de la gestion de vos flux financiers. Activez la refacturation dynamique selon l'utilisation ou ajustez la pénalité de dépassement serveur.
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Bénéfice Actuel</div>
                      <div className="text-xl font-bold text-cyan-400 mt-1 font-mono">+{totalMicroserviceEarnings.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</div>
                    </div>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Taux de Rétention</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">92.4%</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Options de Configuration</h4>
                  
                  <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Facturation au Token Variable</div>
                        <div className="text-[10px] text-slate-500">Adapte le prix si les serveurs sont saturés</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Anti-Fraude Déclenchée</div>
                        <div className="text-[10px] text-slate-500">Bannit les IP abusives automatiquement</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#1f1f1f]">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Pénalité de Rate-Limit</span>
                        <span className="text-xs text-white font-mono">+1.2%</span>
                      </div>
                      <input type="range" min="0" max="50" defaultValue="12" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showApiCallsModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b0b0b] border border-[#1f1f1f] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-blue-400">
                    <Activity className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider font-sans">
                      Contrôle des Appels API
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-blue-500 font-mono">Usage Rate-Limit</span>
                      <span className="text-slate-600 text-[10px]">|</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800">
                        ÉTAT: OPÉRATIONNEL
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowApiCallsModal(false)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Fonction & Description</h4>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl text-sm justify-between text-slate-300">
                      Configurez la limite de requêtes par IP pour éviter les abus (DDoS) et ajustez le cache Edge pour accélérer les réponses des endpoints.
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Requêtes/sec</div>
                      <div className="text-xl font-bold text-blue-400 mt-1 font-mono">4,120</div>
                    </div>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Latence Edge</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">45ms</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Options de Configuration</h4>
                  <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Rate-Limiting Dynamique</div>
                        <div className="text-[10px] text-slate-500">Divise automatiquement les IP abusives</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Edge Cache Actif</div>
                        <div className="text-[10px] text-slate-500">Renvoie les réponses depuis la RAM Vercel</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSubscribersModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b0b0b] border border-[#1f1f1f] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-amber-500">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider font-sans">
                      Base d'Abonnés SaaS IA
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-amber-500 font-mono">Clients B2B/B2C</span>
                      <span className="text-slate-600 text-[10px]">|</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800">
                        ROUTAGE: STRIPE BILLING
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSubscribersModal(false)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Fonction & Description</h4>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl text-sm justify-between text-slate-300">
                      Gérez la fidélisation client, l'up-sells des abonnements et configurez les relances de paiements échoués (dunning) par mail automatique.
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Clients Actifs</div>
                      <div className="text-xl font-bold text-amber-400 mt-1 font-mono">{totalSubs}</div>
                    </div>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Churn Rate</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">3.2%</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Options de Configuration</h4>
                  <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Relance Dunning Intelligente (IA)</div>
                        <div className="text-[10px] text-slate-500">Adapte le mail selon le profil du client</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Offres Up-Sell Automatiques</div>
                        <div className="text-[10px] text-slate-500">Propose un plan supérieur si fort usage</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showResilienceModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b0b0b] border border-[#1f1f1f] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400">
                    <Cpu className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider font-sans">
                      Stabilité & Scalabilité (SRE)
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-emerald-500 font-mono">Auto-Scaling</span>
                      <span className="text-slate-600 text-[10px]">|</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800">
                        CLUSTER: KUBERNETES
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowResilienceModal(false)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Fonction & Description</h4>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl text-sm justify-between text-slate-300">
                      Gérez les paramètres d'équilibrage de charge (Load Balancing) et les mécanismes d'auto-remédiation de l'Agent Superviseur.
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Disponibilité</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">{avgUptime}%</div>
                    </div>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Réplicas Actifs</div>
                      <div className="text-xl font-bold text-cyan-400 mt-1 font-mono">6 Noeuds</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Options de Configuration</h4>
                  <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Scale-Up Horizontal Actif</div>
                        <div className="text-[10px] text-slate-500">Ajoute des pods si le trafic explose </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Coupe-Circuit Global (Circuit Breaker)</div>
                        <div className="text-[10px] text-slate-500">Empêche les crashs en cascade (thundering herd)</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
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
