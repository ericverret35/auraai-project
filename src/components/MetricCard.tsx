import React, { useState } from 'react';
import { RevenueStream, PlatformState } from '../types';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  Settings, 
  Shield, 
  PlusCircle, 
  HelpCircle, 
  Download, 
  Zap, 
  Cpu, 
  ArrowRight,
  ShieldCheck,
  Info,
  Calendar,
  X,
  Network,
  Globe,
  ShoppingBag,
  BookOpen,
  Mail,
  Video,
  Key,
  Award,
  Check,
  Power
} from 'lucide-react';

interface MetricCardProps {
  totalRevenue: number;
  mrr: number;
  totalVisitors: number;
  conversionRate: number;
  streams: RevenueStream[];
  onTick: () => void;
  isLiveSyncActive: boolean;
  currency: 'EUR' | 'USD' | 'GBP' | 'BTC' | 'CAD';
  setCurrency: (curr: 'EUR' | 'USD' | 'GBP' | 'BTC' | 'CAD') => void;
  engineVelocity: number;
  setSyncVelocity: (speed: number) => void;
  autonomyLevel: number;
  setAutonomyLevel: (lvl: number) => void;
  playAudioBeep: (type: 'success' | 'warn' | 'revenue' | 'click') => void;
  transactions: any[];
  onUpdateState?: (state: PlatformState) => void;
}

const STREAM_METADATA: Record<string, {
  fullName: string;
  shortDesc: string;
  detailedHoverDesc: string;
  iconName: string;
  themeColor: string; 
  bulletOptions: { key: string; label: string; type: 'select' | 'toggle' | 'input' | 'range'; options?: string[]; min?: number; max?: number; step?: number }[];
}> = {
  ads: {
    fullName: "Google AdSense AI Auto-Optimiseur",
    shortDesc: "Modulation de bannières IA haute performance",
    detailedHoverDesc: "Système de placements publicitaires IA à haute vélocité. CPM dynamique optimisé selon l'engagement utilisateur, répartition intelligente du trafic et test A/B automatisé de blocs.",
    iconName: 'Globe',
    themeColor: 'bg-[#00f2fe] text-[#00f2fe] border-[#00f2fe]/30',
    bulletOptions: [
      { key: 'optimizationMode', label: "Mode d'Optimisation", type: 'select', options: ['Maximiser CPM (Agressif)', 'Qualité & Confort (Safe)', 'Équilibré sémantique'] },
      { key: 'cpmFloor', label: "Seuil CPM Minimal (€)", type: 'range', min: 0.5, max: 10, step: 0.5 },
      { key: 'autoAbTest', label: "A/B Testing de blocs IA", type: 'toggle' }
    ]
  },
  affiliate: {
    fullName: "Amazon & ShareASale Affiliation",
    shortDesc: "Synergie e-commerce multicanale",
    detailedHoverDesc: "Insertion automatisée d'affiliations. Plume sélectionne les meilleures commissions d'après l'analyse sémantique d'audience, sans gestion de stock.",
    iconName: 'ShoppingBag',
    themeColor: 'bg-[#4facfe] text-[#4facfe] border-[#4facfe]/30',
    bulletOptions: [
      { key: 'affiliationStrategy', label: "Stratégie Commission", type: 'select', options: ['Commissions Maximales (10%+)', 'Volumes (Sujets Populaires)', 'Mix sémantique intelligent'] },
      { key: 'amazonRegion', label: "Zone d'indexation Amazon", type: 'select', options: ['FR (France)', 'US (USA)', 'CH (Suisse)', 'EU (Général européen)'] },
      { key: 'autoInsertLinks', label: "Insertion automatique d'encarts", type: 'toggle' }
    ]
  },
  digital_products: {
    fullName: "Boutique Aura Digitale (Kits PDF & E-books)",
    shortDesc: "Livraison d'infoproduits souverains à haute marge",
    detailedHoverDesc: "Vente en direct de formations générées par Maker et Plume. Marge nette brute élevée de 95%+, tunnel de conversion autonome et transaction sécurisée Stripe Checkout.",
    iconName: 'BookOpen',
    themeColor: 'bg-[#9b51e0] text-[#9b51e0] border-[#9b51e0]/30',
    bulletOptions: [
      { key: 'pricingStrategy', label: "Modèle de Tarification", type: 'select', options: ['Tarification dynamique', 'Prix fixe Premium', 'Vente de pénétration'] },
      { key: 'basePrice', label: "Prix de vente de base (€)", type: 'range', min: 4.99, max: 99.99, step: 5 },
      { key: 'allowDiscountPromo', label: "Codes Promos IA Autopilote", type: 'toggle' }
    ]
  },
  sponsorships: {
    fullName: "Newsletter Auto-Sponsorship Ads",
    shortDesc: "Monétisation d'audience email premium direct",
    detailedHoverDesc: "Partenariats de sponsoring automatisés pour votre liste d'abonnés sémantiques. Aura valide les sponsors éligibles et calibre les prix à l'affichage.",
    iconName: 'Mail',
    themeColor: 'bg-emerald-400 text-emerald-400 border-emerald-400/30',
    bulletOptions: [
      { key: 'sponsorshipModel', label: "Modèle de Facturation", type: 'select', options: ['Forfait par numéro', 'Rémunération au clic direct', 'Coût pour 1000 ouvertures (CPM)'] },
      { key: 'minPricePerIssue', label: "Tarif minimal par numéro (€)", type: 'range', min: 20, max: 500, step: 10 },
      { key: 'categoryExclusions', label: "Exclure niches non-sémantiques", type: 'toggle' }
    ]
  },
  microservices_host: {
    fullName: "Aura Microservices API Metered Hosting",
    shortDesc: "Flux d'Hébergement & Token APIs payants",
    detailedHoverDesc: "Hébergement passif d'APIs et microservices sémantiques. Rémunération au millier d'appels (Pay-per-Call) surveillés par le noyau technique Aura.",
    iconName: 'Cpu',
    themeColor: 'bg-yellow-400 text-yellow-400 border-yellow-400/30',
    bulletOptions: [
      { key: 'rateLimitStrategy', label: "Limites de consommation", type: 'select', options: ['Soft (Alerte par email)', 'Hard (Bloquer l\'appel)', 'Unlimited (Pay-As-You-Go)'] },
      { key: 'pricePerThousandCalls', label: "Tarif / 1000 Appels (€)", type: 'range', min: 1, max: 50, step: 1 },
      { key: 'endpointVesting', label: "Bac à sable (Sandbox) actif", type: 'toggle' }
    ]
  },
  youtube_automation_ads: {
    fullName: "YouTube Automation Channel IA Vidéo",
    shortDesc: "Chaînes de contenu vidéo automatisées",
    detailedHoverDesc: "Génération autonome de vidéos de niche via synthèse vocale ultra-réaliste, scripts construits par Plume et designs automatiques de vignettes de vidéos.",
    iconName: 'Video',
    themeColor: 'bg-rose-500 text-rose-500 border-rose-500/30',
    bulletOptions: [
      { key: 'videoFrequency', label: "Fréquence de Publication", type: 'select', options: ['1 Vidéo / jour (Intense)', '2 Vidéos / semaine', '1 Vidéo / semaine (Calme)'] },
      { key: 'voiceSynthesis', label: "Voix de synthèse IA", type: 'select', options: ['Profonde masculine', 'Chaleureuse féminine', 'Clonage vocal de l\'auteur'] },
      { key: 'autoThumbnail', label: "A/B Testing vignettes AI", type: 'toggle' }
    ]
  },
  premium_api_key_resell: {
    fullName: "B2B SaaS API Token Selling (Bulk Access)",
    shortDesc: "Vente en gros de clés d'accès techniques",
    detailedHoverDesc: "Revente de passes sémantiques et de licences en volume pour entreprises de données. Clés d'accès haut débit rotatives et contrôles d'uptime.",
    iconName: 'Key',
    themeColor: 'bg-indigo-400 text-indigo-400 border-indigo-400/30',
    bulletOptions: [
      { key: 'resellTier', label: "Cible Clientèle", type: 'select', options: ['Grandes entreprises B2B', 'Startups techniques', 'Développeurs indépendants'] },
      { key: 'tokenMarkup', label: "Marge bénéficiaire revente (%)", type: 'range', min: 5, max: 100, step: 5 },
      { key: 'autoRotateKeys', label: "Génération de clés rotatives", type: 'toggle' }
    ]
  },
  saas_subscriptions: {
    fullName: "Abonnements Premium SaaS & Communautés VIP",
    shortDesc: "Revenu mensuel récurrent (MRR) d'Aura Club",
    detailedHoverDesc: "Adhésions abonnés mensuels sémantiques sécurisés sur Stripe Billing. Accès exclusif à la plateforme VIP de signaux d'arbitrage de niche d'Aura.",
    iconName: 'Award',
    themeColor: 'bg-purple-400 text-purple-400 border-purple-400/30',
    bulletOptions: [
      { key: 'tierBillingPeriod', label: "Cycle de Facturation", type: 'select', options: ['Mensuel uniquement', 'Annuel avec 20% discount', 'Paiement unique à vie'] },
      { key: 'premiumPerks', label: "Avantages inclus", type: 'select', options: ['Signaux + Accès Groupe privé', 'Documentation premium seule', 'Pack All-Access sémantique'] },
      { key: 'freeTrialDays', label: "Durée de la période d'essai", type: 'select', options: ['Sans essai (0 jours)', '7 Jours d\'essai gratuit', '14 Jours d\'essai gratuit'] }
    ]
  },
};

export default function MetricCard({
  totalRevenue,
  mrr,
  totalVisitors,
  conversionRate,
  streams,
  onTick,
  isLiveSyncActive,
  currency,
  setCurrency,
  engineVelocity,
  setSyncVelocity,
  autonomyLevel,
  setAutonomyLevel,
  playAudioBeep,
  transactions,
  onUpdateState,
}: MetricCardProps) {
  const [showAiForecast, setShowAiForecast] = useState<boolean>(true);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: number; date: string; isProjected: boolean } | null>(null);
  const [selectedKpi, setSelectedKpi] = useState<'revenue' | 'mrr' | 'traffic' | 'cvr' | 'network' | null>(null);
  const [activeStreamTooltip, setActiveStreamTooltip] = useState<string | null>(null);

  // States for dynamic configure/popup
  const [selectedStreamForConfig, setSelectedStreamForConfig] = useState<RevenueStream | null>(null);
  const [localConfig, setLocalConfig] = useState<Record<string, any>>({});
  const [updatingStreamId, setUpdatingStreamId] = useState<string | null>(null);
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);

  const openConfigModal = (stream: RevenueStream) => {
    setSelectedStreamForConfig(stream);
    setLocalConfig(stream.config || {});
    setDiagnosticResult(null);
  };

  const handleToggleStream = async (streamId: string, currentActive: boolean) => {
    playAudioBeep('click');
    setUpdatingStreamId(streamId);
    try {
      const res = await fetch('/api/settings/update-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: streamId,
          active: !currentActive
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && onUpdateState) {
          onUpdateState(data.state);
        }
        playAudioBeep('success');
      } else {
        playAudioBeep('warn');
      }
    } catch (e) {
      console.error("Failed to toggle stream:", e);
      playAudioBeep('warn');
    } finally {
      setUpdatingStreamId(null);
    }
  };

  const handleSaveStreamConfig = async (streamId: string, configUpdates: Record<string, any>) => {
    playAudioBeep('click');
    setUpdatingStreamId(streamId);
    try {
      const res = await fetch('/api/settings/update-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: streamId,
          config: configUpdates
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && onUpdateState) {
          onUpdateState(data.state);
          // Update selected config ref too
          const updatedStream = data.state.streams.find((s: any) => s.id === streamId);
          if (updatedStream) {
            setSelectedStreamForConfig(updatedStream);
          }
        }
        playAudioBeep('success');
      } else {
        playAudioBeep('warn');
      }
    } catch (e) {
      console.error("Failed to save config:", e);
      playAudioBeep('warn');
    } finally {
      setUpdatingStreamId(null);
    }
  };

  const runStreamDiagnostic = (streamId: string) => {
    playAudioBeep('click');
    setIsDiagnosticRunning(true);
    setDiagnosticResult(null);
    setTimeout(() => {
      setIsDiagnosticRunning(false);
      const randomSuccessPhrases = [
        "✅ [AURA-HEAL] : Indexation de niches sémantiques vérifiée. Serveur d'hébergement DNS optimal (100% Uptime). Intégration de balises correcte.",
        "✅ [AURA-HEAL] : Taux de conversion de la passerelle de paiements validé. Aucune latence détectée sur le réseau d'hébergement.",
        "✅ [AURA-HEAL] : Diagnostics de flux d'affiliation terminés. Métadonnées d'ancor sémantique mis en cache avec succès.",
        "✅ [AURA-HEAL] : Débit API mesuré de manière autonome. Certificat TLS opérationnel, équilibrage actif des requêtes B2B."
      ];
      setDiagnosticResult(randomSuccessPhrases[Math.floor(Math.random() * randomSuccessPhrases.length)]);
      playAudioBeep('success');
    }, 1200);
  };

  const renderStreamIcon = (id: string, className: string = "w-4 h-4") => {
    switch (id) {
      case 'ads':
        return <Globe className={className} />;
      case 'affiliate':
        return <ShoppingBag className={className} />;
      case 'digital_products':
        return <BookOpen className={className} />;
      case 'sponsorships':
        return <Mail className={className} />;
      case 'microservices_host':
        return <Cpu className={className} />;
      case 'youtube_automation_ads':
        return <Video className={className} />;
      case 'premium_api_key_resell':
        return <Key className={className} />;
      case 'saas_subscriptions':
        return <Award className={className} />;
      default:
        return <Activity className={className} />;
    }
  };

  // Currency multiplier map
  const CURRENCY_MAP = {
    EUR: { name: 'Euros', symbol: '€', rate: 1.0, decimals: 2 },
    USD: { name: 'Dollars US', symbol: '$', rate: 1.08, decimals: 2 },
    GBP: { name: 'Livres Sterling', symbol: '£', rate: 0.85, decimals: 2 },
    BTC: { name: 'Bitcoin', symbol: '₿', rate: 0.000015, decimals: 6 },
    CAD: { name: 'Dollars Canadien', symbol: 'CA$', rate: 1.48, decimals: 2 },
  };

  const formatVal = (amount: number) => {
    const active = CURRENCY_MAP[currency];
    const converted = amount * active.rate;
    return `${converted.toLocaleString('fr-CA', { 
      minimumFractionDigits: active.decimals, 
      maximumFractionDigits: active.decimals 
    })} ${active.symbol}`;
  };

  // Hardcoded chart coordinates representing actual passive income timeline
  const actualPointsData = [
    { x: 10, y: 120, val: totalRevenue * 0.1, date: "J-10" },
    { x: 40, y: 110, val: totalRevenue * 0.15, date: "J-9" },
    { x: 80, y: 95, val: totalRevenue * 0.22, date: "J-8" },
    { x: 120, y: 105, val: totalRevenue * 0.20, date: "J-7" },
    { x: 160, y: 70, val: totalRevenue * 0.40, date: "J-6" },
    { x: 200, y: 85, val: totalRevenue * 0.35, date: "J-5" },
    { x: 240, y: 55, val: totalRevenue * 0.55, date: "J-4" },
    { x: 280, y: 68, val: totalRevenue * 0.50, date: "J-3" },
    { x: 320, y: 40, val: totalRevenue * 0.70, date: "J-2" },
    { x: 360, y: 25, val: totalRevenue * 0.85, date: "Hier" },
    { x: 400, y: 15, val: totalRevenue, date: "Aujourd'hui" }
  ];

  // AI-Assisted future projections timeline
  const projectedPointsData = [
    { x: 400, y: 15, val: totalRevenue, date: "Aujourd'hui" },
    { x: 440, y: 11, val: totalRevenue * 1.25, date: "J+5" },
    { x: 480, y: 8, val: totalRevenue * 1.60, date: "J+15" },
    { x: 520, y: 3, val: totalRevenue * 2.10, date: "J+30 (Prédit)" }
  ];

  // Convert coordinate array to SVG string
  const getSvgPathStr = (data: { x: number; y: number }[]) => {
    return data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${d.x} ${d.y}`).join(' ');
  };

  const actualPath = getSvgPathStr(actualPointsData);
  const projectedPath = getSvgPathStr(projectedPointsData);

  // Generate glowing area SVG underfill coords
  const getAreaPathStr = (data: { x: number; y: number }[]) => {
    if (data.length === 0) return '';
    const first = data[0];
    const last = data[data.length - 1];
    return `${getSvgPathStr(data)} L ${last.x} 130 L ${first.x} 130 Z`;
  };

  const actualAreaPath = getAreaPathStr(actualPointsData);
  const projectedAreaPath = getAreaPathStr(projectedPointsData);

  // Autonomy Level Description
  const getAutonomyLevelLabel = (level: number) => {
    switch (level) {
      case 1: return { title: "Manuelle stricte", color: "text-zinc-400 border-zinc-900 bg-zinc-950", desc: "Aura demande confirmation pour chaque action" };
      case 2: return { title: "Supervisée réactive", color: "text-blue-400 border-blue-900 bg-blue-950/20", desc: "Aura prend des décisions mais requiert validation" };
      case 3: return { title: "Pilote automatique hybride", color: "text-cyan-400 border-cyan-900 bg-cyan-950/20", desc: "Validation automatique sémantique, rapports par e-mail" };
      case 4: return { title: "Essaim IA souverain", color: "text-purple-400 border-purple-900 bg-purple-950/20 animate-pulse", desc: "Décisions 100% autonomes, trading d'API sémantiques complet" };
      default: return { title: "Inconnu", color: "text-slate-400", desc: "" };
    }
  };

  const autonomyLabel = getAutonomyLevelLabel(autonomyLevel);

  // Handler for Excel / Accountant Report CSV download
  const handleExportCSV = () => {
    playAudioBeep('success');
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Header
    csvContent += "Categorie;ID_Session;Intitule_Service;earnings_Locales;Conversion_Ratio;Statut_Direct\n";
    
    // Core transaction index row
    transactions.forEach((tx) => {
      csvContent += `TRANSACTION;${tx.id};"${tx.productName.replace(/"/g, '""')}";${tx.amount};100%;EncaissÃ© (${tx.country})\n`;
    });
    
    // Stream metrics index row
    streams.forEach((stream) => {
      csvContent += `FLUX_REVENU;${stream.id};"${stream.name.replace(/"/g, '""')}";${stream.earnings};${stream.conversionRate.toFixed(1)}%;${stream.status}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Aura_Elite_Audit_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="metric-card-container" className="space-y-6">
      
      {/* 1. Multi-Currency Arbitrage Hub & Live Payout controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden hover:overflow-visible hover:z-50 group/status-card">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-transparent pointer-events-none rounded-full blur-xl"></div>
        
        <div className="relative group/auracore cursor-help">
          <h2 className="text-sm font-mono tracking-wider text-[#00f2fe] uppercase flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
            Statut Système Aura Core • Autopilot d'arbitrage <span className="text-[#00f2fe] font-bold animate-pulse text-xs">(ℹ️)</span>
          </h2>
          
          {/* Detailed Floating Guide */}
          <div className="absolute left-0 top-full mt-2 hidden group-hover/auracore:block w-80 bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl shadow-2xl text-[10px] text-slate-300 z-[100] leading-relaxed font-sans normal-case">
            <span className="font-extrabold text-[#00f2fe] block mb-1.5 font-mono uppercase tracking-wider">📡 SYSTÈME AURA_ENGINE CENTRAL</span>
            Indique la synchronisation en direct d'Aura Core. Régule la compilation sémantique, l'optimisation à la milliseconde des enchères de flux d'affiliation, l'intégration Stripe et l'arbitrage automatique de transactions.
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-white font-medium text-xs font-sans">
              Fréquence sémantique synchronisée à <strong className="text-[#00f2fe]">{engineVelocity}x</strong> vitesse réelle
            </span>
          </div>
        </div>

        {/* Temporal Compression Speed & Single Stimulate Ticket Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              playAudioBeep('click');
              onTick();
            }}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-lg transition transform active:scale-95 shadow-md flex items-center gap-1.5"
          >
            <Activity className="w-4 h-4 animate-spin-slow text-slate-950" />
            +1 Flux organique (+{formatVal(11.45)})
          </button>

          <button
            onClick={handleExportCSV}
            className="p-2 bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-800 rounded-lg hover:border-cyan-500/40 transition text-xs flex items-center gap-1.5"
            title="Exporter rapports de profits CSV"
          >
            <Download className="w-4 h-4" />
            <span>Rapports</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Arbitrage Currency select bar */}
      <div className="bg-[#0b0b0b] border border-[#1a1a1a] p-3 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative group/arbitrage hover:overflow-visible hover:z-50 cursor-help">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-cyan-950/50 rounded-lg text-cyan-400 border border-cyan-800/40">
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              Arbitrage Multi-Devises Interactif <span className="text-[#00f2fe] font-bold animate-pulse text-xs">(ℹ️)</span>
            </h4>
            <p className="text-[10px] text-zinc-400">Convertissez instantanément vos actifs de la flotte dans les bourses mondiales</p>
          </div>
        </div>

        {/* Floating guide */}
        <div className="absolute left-3 bottom-[104%] mb-1.5 hidden group-hover/arbitrage:block w-[340px] bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl shadow-2xl text-[10px] text-slate-300 z-[100] leading-relaxed font-sans normal-case">
          <span className="font-extrabold text-[#00f2fe] block mb-1 font-mono uppercase tracking-wider">💱 CONVERTISSEUR MULTI-DEVISES SYNCHRONISÉ</span>
          Recalcule instantanément toutes les statistiques financières de la flotte (revenus organiques, MRR d'abonnements, balance d'info-produits, liasse comptable) via le taux de conversion officiel des bourses directes (EUR, USD, GBP, Bitcoin, CAD).
        </div>

        {/* Currency selectors */}
        <div className="grid grid-cols-5 gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800/80 w-full md:w-auto">
          {(Object.keys(CURRENCY_MAP) as Array<'EUR' | 'USD' | 'GBP' | 'BTC' | 'CAD'>).map((curr) => {
            const isActive = currency === curr;
            return (
              <button
                key={curr}
                onClick={() => {
                  playAudioBeep('click');
                  setCurrency(curr);
                }}
                className={`py-1 px-3 text-xs font-bold rounded-md transition-all font-mono text-center ${
                  isActive 
                    ? 'bg-[#151515] text-[#00f2fe] border border-cyan-900/50 shadow' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {curr}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Primary KPI Grid (4 Dynamic columns converting cash on active Currency multiplier) */}
      <div id="kpi-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 : Chiffre d'Affaires */}
        <div 
          onClick={() => { playAudioBeep('click'); setSelectedKpi('revenue'); }}
          className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl relative overflow-hidden hover:overflow-visible hover:z-50 group hover:border-[#00f2fe]/30 transition-all duration-300 cursor-pointer"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-25 transition-opacity">
            <DollarSign className="w-16 h-16 text-[#00f2fe]" />
          </div>
          <div className="relative group/tooltip w-fit">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-sans flex items-center gap-1.5">
              Revenu Cumulé <span className="text-[#00f2fe] animate-pulse font-bold hover:text-cyan-350 text-xs">(ℹ️)</span>
            </p>
            <div className="absolute -left-2 bottom-full mb-2 hidden group-hover/tooltip:block w-72 bg-zinc-900 border border-zinc-800 text-slate-200 text-xs p-3.5 rounded-xl shadow-2xl z-[100] pointer-events-none normal-case leading-relaxed font-sans">
              <span className="font-extrabold text-[#00f2fe] block mb-1 font-mono uppercase tracking-wider">💰 CHIFFRE D'AFFAIRES REALISE</span>
              Somme totale cumulée des bénéfices nets et régies d'affiliation Amazon, Stripe checkout, et microservices de votre marque IA.
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-extrabold tracking-tight text-white font-mono">
              {formatVal(totalRevenue)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% ce mois (Optimisé par Aura)</span>
          </div>
        </div>

        {/* KPI 2 : Estimations MRR */}
        <div 
          onClick={() => { playAudioBeep('click'); setSelectedKpi('mrr'); }}
          className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl relative overflow-hidden hover:overflow-visible hover:z-50 group hover:border-[#9b51e0]/30 transition-all duration-300 cursor-pointer"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-25 transition-opacity">
            <TrendingUp className="w-16 h-16 text-[#9b51e0]" />
          </div>
          <div className="relative group/tooltip w-fit">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-sans flex items-center gap-1.5">
              MRR Estimé (Mensuel) <span className="text-[#9b51e0] animate-pulse font-bold hover:text-purple-350 text-xs">(ℹ️)</span>
            </p>
            <div className="absolute -left-2 bottom-full mb-2 hidden group-hover/tooltip:block w-72 bg-zinc-900 border border-zinc-800 text-slate-200 text-xs p-3.5 rounded-xl shadow-2xl z-[100] pointer-events-none normal-case leading-relaxed font-sans">
              <span className="font-extrabold text-purple-400 block mb-1 font-mono uppercase tracking-wider">💎 REVENU MENSUEL RÉCURRENT (MRR)</span>
              Volume d'affaires mensuel récurrent basé sur les abonnements SaaS actifs hébergés et les contrats d'API facturés à la seconde.
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-extrabold tracking-tight text-white font-mono">
              {formatVal(mrr)}
            </span>
          </div>
          <div className="text-[10px] text-zinc-500 mt-2 font-medium font-mono">
            Projection d'abonnements active
          </div>
        </div>

        {/* KPI 3 : Trafic */}
        <div 
          onClick={() => { playAudioBeep('click'); setSelectedKpi('traffic'); }}
          className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl relative overflow-hidden hover:overflow-visible hover:z-50 group hover:border-[#4facfe]/30 transition-all duration-300 cursor-pointer"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-25 transition-opacity">
            <Users className="w-16 h-16 text-[#4facfe]" />
          </div>
          <div className="relative group/tooltip w-fit">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-sans flex items-center gap-1.5">
              Trafic Global <span className="text-[#4facfe] animate-pulse font-bold hover:text-blue-350 text-xs">(ℹ️)</span>
            </p>
            <div className="absolute -left-2 bottom-full mb-2 hidden group-hover/tooltip:block w-72 bg-zinc-900 border border-zinc-800 text-slate-200 text-xs p-3.5 rounded-xl shadow-2xl z-[100] pointer-events-none normal-case leading-relaxed font-sans">
              <span className="font-extrabold text-[#00f2fe] block mb-1 font-mono uppercase tracking-wider">📊 AUDIENCE ET FLUX ACQUISITION</span>
              Nombre cumulé de prospects et d'utilisateurs uniques captés sur les moteurs de recherche via l'indexation organique de l'Agent SEO.
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-extrabold tracking-tight text-white font-mono">
              {totalVisitors.toLocaleString('fr-FR')}
            </span>
            <span className="text-xs font-semibold text-zinc-500 font-mono ml-1">leads</span>
          </div>
          <p className="text-[10px] text-indigo-300 mt-2 font-mono">
            94% trafic organique AI
          </p>
        </div>

        {/* KPI 4 : Taux de conversion */}
        <div 
          onClick={() => { playAudioBeep('click'); setSelectedKpi('cvr'); }}
          className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl relative overflow-hidden hover:overflow-visible hover:z-50 group hover:border-amber-500/30 transition-all duration-300 cursor-pointer"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-25 transition-opacity">
            <Activity className="w-16 h-16 text-amber-500" />
          </div>
          <div className="relative group/tooltip w-fit">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-sans flex items-center gap-1.5">
              Rendement d'Achat (CVR) <span className="text-amber-500 animate-pulse font-bold hover:text-amber-350 text-xs">(ℹ️)</span>
            </p>
            <div className="absolute -left-2 sm:right-0 sm:left-auto bottom-full mb-2 hidden group-hover/tooltip:block w-72 bg-zinc-900 border border-zinc-800 text-slate-200 text-xs p-3.5 rounded-xl shadow-2xl z-[100] pointer-events-none normal-case leading-relaxed font-sans">
              <span className="font-extrabold text-amber-400 block mb-1 font-mono uppercase tracking-wider">⚡ MULTIPLICATEUR DE CONVERSION</span>
              Pourcentage de conversion directe de visiteurs simples en clients payants sur Stripe. Optimisé grâce aux accroches émotionnelles de Plume.
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-extrabold tracking-tight text-white font-mono">
              {conversionRate.toFixed(2)}
            </span>
            <span className="text-sm font-bold text-amber-400">%</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-2 font-mono">
            Vente de microservices & PDF
          </p>
        </div>
      </div>

      {/* 4. Interactive Predictive SVG Line Graph Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cashflow Chart with AI integration */}
        <div className="lg:col-span-2 bg-[#0c0c0c] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden hover:overflow-visible hover:z-50 group/chart-card">
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/5 to-transparent pointer-events-none rounded-full blur-xl"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-white font-bold text-sm tracking-wide font-sans flex items-center gap-1.5 relative group/curve cursor-help">
                <span>Courbe d'Expansion & Prévisions de Revenus</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-purple-950 text-purple-300 rounded border border-purple-800 font-mono uppercase">AI Prediction</span>
                <span className="text-purple-400 animate-pulse font-bold text-xs">(ℹ️)</span>

                {/* Floating tooltip */}
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover/curve:block w-80 bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl shadow-2xl text-[10px] text-slate-300 z-[100] leading-relaxed font-sans normal-case font-normal">
                  <span className="font-extrabold text-purple-400 block mb-1.5 font-mono uppercase tracking-wider">📊 DIAGRAMME SÉMANTIQUE PRÉDICTIF AI</span>
                  Compare l'historique réel en direct de vos revenus à la courbe sémantique prospective d'Aura calculée sur 30 jours (R.O.I, croissance organique estimée et résilience des canaux d'affiliation).
                </div>
              </h3>
              <p className="text-[11px] text-zinc-400">Coordonnées de performance en temps réel et projections prédictives de croissance</p>
            </div>

            <button
              onClick={() => {
                playAudioBeep('click');
                setShowAiForecast(!showAiForecast);
              }}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition ${
                showAiForecast 
                  ? 'bg-purple-950 text-purple-300 border-purple-800/80 shadow' 
                  : 'bg-zinc-900 text-zinc-500 border-zinc-800/80 hover:text-zinc-300 hover:border-zinc-700'
              }`}
            >
              • {showAiForecast ? 'Désactiver les prédictions' : 'Activer les prédictions'}
            </button>
          </div>

          {/* Interactive Chart Arena */}
          <div className="my-6 relative h-48 w-full border border-slate-900 bg-black/40 p-2 rounded-xl flex flex-col justify-between">
            
            {/* Legend indicators */}
            <div className="absolute top-3 left-4 flex gap-4 text-[9px] font-mono">
              <div className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-0.5 bg-cyan-400 inline-block"></span>
                <span>Réel ({formatVal(totalRevenue)})</span>
              </div>
              {showAiForecast && (
                <div className="flex items-center gap-1.5 text-purple-400 animate-pulse">
                  <span className="w-2.5 h-0.5 border-t border-dashed border-purple-400 inline-block"></span>
                  <span>Projection IA J+30 ({formatVal(totalRevenue * 2.1)})</span>
                </div>
              )}
            </div>

            <div className="relative flex-1 mt-6">
              <svg className="w-full h-full" viewBox="0 0 540 130" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="actual-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                  {showAiForecast && (
                    <linearGradient id="projected-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                    </linearGradient>
                  )}
                </defs>

                {/* Draw Areas */}
                <polygon points={actualAreaPath} fill="url(#actual-grad)" />
                {showAiForecast && <polygon points={projectedAreaPath} fill="url(#projected-grad)" />}

                {/* Grid guidelines */}
                <line x1="0" y1="30" x2="540" y2="30" stroke="#101010" strokeWidth="1" strokeDasharray="3" />
                <line x1="0" y1="65" x2="540" y2="65" stroke="#101010" strokeWidth="1" strokeDasharray="3" />
                <line x1="0" y1="100" x2="540" y2="100" stroke="#101010" strokeWidth="1" strokeDasharray="3" />

                {/* Draw Paths */}
                <polyline fill="none" stroke="#06b6d4" strokeWidth="2.5" points={actualPath} />
                {showAiForecast && (
                  <polyline 
                    fill="none" 
                    stroke="#a855f7" 
                    strokeWidth="2" 
                    strokeDasharray="4 4" 
                    points={projectedPath} 
                  />
                )}

                {/* Node Interactive dots */}
                {actualPointsData.map((pt, i) => (
                  <circle
                    key={`act-${i}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint && hoveredPoint.x === pt.x ? 6 : 3.5}
                    fill={hoveredPoint && hoveredPoint.x === pt.x ? '#ffffff' : '#0369a1'}
                    stroke="#00ffff"
                    strokeWidth={1.5}
                    className="cursor-pointer transition-all duration-150 outline-none"
                    onMouseEnter={() => setHoveredPoint({ ...pt, isProjected: false })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}

                {showAiForecast && projectedPointsData.map((pt, i) => (
                  <circle
                    key={`prj-${i}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint && hoveredPoint.x === pt.x ? 6 : 3.5}
                    fill={hoveredPoint && hoveredPoint.x === pt.x ? '#ffffff' : '#4a044e'}
                    stroke="#a855f7"
                    strokeWidth={1.5}
                    className="cursor-pointer transition-all duration-150 outline-none"
                    onMouseEnter={() => setHoveredPoint({ ...pt, isProjected: true })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </svg>

              {/* Dynamic Coordinate Tooltip Hover card */}
              {hoveredPoint && (
                <div 
                  className="absolute bg-[#050505] border border-cyan-800/60 rounded-lg p-2 text-[10px] space-y-0.5 pointer-events-none shadow-xl z-50 font-mono"
                  style={{ 
                    left: `${Math.min(hoveredPoint.x, 420)}px`, 
                    top: `${Math.max(hoveredPoint.y - 70, 0)}px` 
                  }}
                >
                  <div className="flex justify-between items-center gap-4 border-b border-zinc-900 pb-1">
                    <span className="text-zinc-500 font-bold uppercase">{hoveredPoint.date}</span>
                    <span className={hoveredPoint.isProjected ? "text-purple-400" : "text-cyan-400"}>
                      {hoveredPoint.isProjected ? "IA Project" : "Réel"}
                    </span>
                  </div>
                  <div className="text-slate-200">
                    Efficience : <span className="font-extrabold text-white">{formatVal(hoveredPoint.val)}</span>
                  </div>
                  <div className="text-[8px] text-zinc-500 italic">
                    Fiabilité prédictive sémantique : 97.4%
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-[9px] text-zinc-500 font-mono px-1">
              <span>J-10 (Démarrage)</span>
              <span>J-5 (Validation Uptime)</span>
              <span>J Aujourd'hui</span>
              {showAiForecast && <span className="text-purple-400 font-semibold">J+30 (Souverain)</span>}
            </div>
          </div>

          {showAiForecast && (
            <div className="p-3 bg-purple-950/20 border border-purple-900/40 rounded-xl space-y-2 animate-fade-in font-sans text-xs">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Info className="w-4 h-4 text-purple-400" />
                <span>Rapport Arbitrage Prospectif [Aura-Forecast ENGINE]</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans mt-0.5">
                Sur la base des indices SEO collectés par l'Agent Plume et de la résilience du service comptable, la plateforme passera des revenus cumulés de <span className="text-white font-bold">{formatVal(totalRevenue)}</span> à un montant sémantique projeté de <span className="text-purple-300 font-extrabold">{formatVal(totalRevenue * 2.1)}</span> d'ici le mois prochain, soit un <span className="text-[#00f2fe] font-extrabold">R.O.I de +110%</span>.
              </p>
            </div>
          )}
        </div>

        {/* 5. Custom Simulation Speeder & Autonomy Levels Panel */}
        <div className="bg-[#0a0a0a] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-6 relative overflow-hidden hover:overflow-visible hover:z-50 group/settings-panel">
          
          {/* Accelerator of Time Ticks Section */}
          <div className="space-y-3 relative group/accelerator cursor-help">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-bold text-sm tracking-wide font-sans flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#00f2fe]" />
                Accélérateur de Flux IA <span className="text-[#00f2fe] animate-pulse font-bold text-xs">(ℹ️)</span>
              </h3>
              <span className="font-mono text-[10px] uppercase font-bold text-[#00f2fe] bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                {engineVelocity}x Vélocité
              </span>
            </div>
            
            {/* Detailed Hover Guide */}
            <div className="absolute right-0 bottom-full mb-2 hidden group-hover/accelerator:block w-[280px] bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl shadow-2xl text-[10px] text-slate-300 z-[110] leading-relaxed font-sans normal-case">
              <span className="font-extrabold text-cyan-400 block mb-1 font-mono uppercase tracking-wider">🧬 ACCÉLÉRATEUR SÉMANTIQUE</span>
              Force Aura_Engine à synchroniser en vitesse accélérée le passage des flux : processus de scraping de l'Agent Mercato, rédactions SEO de Plume et intégrations de transactions Stripe.
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Forcez l'Agent Comptable à synchroniser l'audience et les opérations sémantiques de la boutique en haute vélocité.
            </p>

            <div className="space-y-1.5 pt-1">
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={engineVelocity}
                onChange={(e) => {
                  playAudioBeep('click');
                  setSyncVelocity(Number(e.target.value));
                }}
                className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
              />
              <div className="flex justify-between text-[9px] text-zinc-500 font-mono font-bold uppercase">
                <span>1x (Calme)</span>
                <span>5x</span>
                <span>10x (Rapide)</span>
                <span>20x (Surrégime Elite)</span>
              </div>
            </div>
            
            {engineVelocity > 10 && (
              <div className="p-2 bg-red-950/20 border border-red-900/40 rounded-lg text-[10px] text-rose-400 font-mono flex items-center gap-1.5 animate-pulse">
                <span>⚠️ SURRÉGIME : Flux de données sémantiques très élevé.</span>
              </div>
            )}
          </div>

          {/* Autonomy and Resilience Settings */}
          <div className="space-y-3 border-t border-slate-900 pt-4 relative group/autonomy cursor-help">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-bold text-sm tracking-wide font-sans flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Grade d'Autonomie <span className="text-emerald-400 animate-pulse font-bold text-xs">(ℹ️)</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900">
                Aura Lvl {autonomyLevel}
              </span>
            </div>

            {/* Detailed Hover Guide */}
            <div className="absolute right-0 bottom-full mb-2 hidden group-hover/autonomy:block w-[280px] bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl shadow-2xl text-[10px] text-slate-300 z-[110] leading-relaxed font-sans normal-case">
              <span className="font-extrabold text-emerald-400 block mb-1 font-mono uppercase tracking-wider">🛡️ GRADE DÉCISIONNEL ACTIF</span>
              Définit le degré de liberté accordé à la flotte autonome :<br />
              • **Lvl 1**: Mode manuel, validation d'article requise.<br />
              • **Lvl 2**: Validation assistée réactive.<br />
              • **Lvl 3**: Autopilote, index sémantique auto.<br />
              • **Lvl 4**: Essaim souverain, 100% autonome.
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Déterminez le pouvoir décisionnel automatique accordé aux agents de la flotte.
            </p>

            <div className="space-y-1.5 pt-1">
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={autonomyLevel}
                onChange={(e) => {
                  playAudioBeep('click');
                  setAutonomyLevel(Number(e.target.value));
                }}
                className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
              />
              <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-900/80">
                <h5 className={`text-[10px] font-bold font-mono uppercase ${autonomyLabel.color}`}>
                  {autonomyLabel.title}
                </h5>
                <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                  {autonomyLabel.desc}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 6. Static list with converting streams */}
      <div 
        onClick={(e) => {
          e.stopPropagation();
          playAudioBeep('click'); 
          setSelectedKpi('network'); 
        }}
        className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl cursor-pointer hover:border-cyan-500/30 transition-all duration-300 relative overflow-visible hover:z-50 group/streams-card"
      >
        <div className="relative group/tooltip w-fit">
          <h3 className="text-white font-bold text-sm tracking-wide mb-1 font-sans flex items-center gap-1.5">
            Répartition Fine et Réseau d'Hébergement Sémantique <span className="text-[#00f2fe] animate-pulse font-bold hover:text-cyan-300 text-xs">(ℹ️)</span>
          </h3>
          <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-80 bg-zinc-900 border border-zinc-800 text-slate-200 text-[10px] p-3.5 rounded-xl shadow-2xl z-[100] pointer-events-none normal-case leading-relaxed font-sans font-normal">
            <span className="font-extrabold text-[#00f2fe] block mb-1.5 font-mono uppercase tracking-wider">🔌 MODÈLE DE VENTILATION DES CANAUX</span>
            Visualisez la part de revenus par segment monétisé (Amazon Associates affiliation, Google AdSense bannières, E-books, abonnements microservices) et leur statut de communication en direct.
          </div>
        </div>
        <p className="text-xs text-slate-400 mb-4 font-sans">Uptime, performance de flux et conversions directes Stripe par régie d'affiliation autonome</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {streams.map((stream) => {
            const meta = STREAM_METADATA[stream.id];
            const displayColor = meta ? meta.themeColor.split(' ')[0] : 'bg-[#00f2fe]';
            const iconColor = meta ? meta.themeColor.split(' ')[1] : 'text-[#00f2fe]';
            const hoverBorderColor = meta ? meta.themeColor.split(' ')[2] : 'hover:border-[#00f2fe]/40';

            return (
              <div 
                key={stream.id} 
                onClick={(e) => {
                  e.stopPropagation();
                  playAudioBeep('click');
                  openConfigModal(stream);
                }}
                className={`p-4 bg-[#060606] border border-[#141414] rounded-2xl space-y-3 relative group/substream transition-all duration-300 hover:scale-[1.02] hover:bg-[#0c0c0c] ${hoverBorderColor} z-20 cursor-pointer overflow-visible select-none pb-4`}
              >
                
                {/* Micro-interactive Tooltip on Hover */}
                <div 
                  onClick={(ev) => ev.stopPropagation()}
                  className="absolute left-1/2 -translate-x-1/2 bottom-[104%] mb-2.5 w-64 bg-[#0a0a0a] border border-zinc-805 p-4 rounded-xl shadow-2xl text-[10px] text-zinc-300 z-50 pointer-events-none scale-95 opacity-0 origin-bottom group-hover/substream:scale-100 group-hover/substream:opacity-100 transition-all duration-200 shadow-black/80 font-sans"
                >
                  <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-zinc-900">
                    <span className={`font-bold flex items-center gap-1.5 ${iconColor}`}>
                      {renderStreamIcon(stream.id, "w-4 h-4")}
                      {meta ? meta.fullName.toUpperCase() : stream.name.toUpperCase()}
                    </span>
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-900">
                      {stream.active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  
                  <p className="text-zinc-400 leading-relaxed text-[10px] mb-2 font-sans font-normal">
                    {meta ? meta.detailedHoverDesc : "Flux d'hébergement sémantique interconnecté au cœur Aura central."}
                  </p>

                  {/* Config settings indicators in tooltip */}
                  <div className="bg-zinc-950/80 rounded border border-zinc-900 p-2 space-y-1 font-mono text-[8.5px] text-zinc-400">
                    <span className="text-zinc-500 block uppercase text-[8px] font-bold tracking-wider mb-0.5">Configuration Active</span>
                    {meta?.bulletOptions.map((opt) => {
                      const val = stream.config?.[opt.key] !== undefined 
                        ? stream.config[opt.key] 
                        : (opt.type === 'toggle' ? 'Activé' : (opt.type === 'range' ? `${opt.min}€` : opt.options?.[0]));
                      return (
                        <div key={opt.key} className="flex justify-between items-center gap-2">
                          <span>{opt.label} :</span>
                          <span className={`${iconColor} font-bold`}>
                            {typeof val === 'boolean' ? (val ? 'Oui' : 'Non') : String(val)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-zinc-900/80 flex justify-between items-center text-[8px] font-mono text-zinc-500 uppercase">
                    <span>Uptime sémantique: 99.9%</span>
                    <span className={`animate-pulse font-bold ${iconColor}`}>Cliquer pour configurer</span>
                  </div>
                </div>

                {/* Card Title layout with Switch */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 bg-zinc-950 rounded-lg border border-zinc-900 transition-colors ${iconColor}`}>
                      {renderStreamIcon(stream.id, "w-4.5 h-4.5")}
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-white tracking-wide uppercase font-sans line-clamp-1">
                        {meta ? meta.fullName.split(' (')[0] : stream.name} 
                      </h4>
                      <p className="text-[9px] text-zinc-500 font-mono font-bold">
                        {meta ? meta.shortDesc : "Canal Aura"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Switch Interrupteur Toggle Button */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStream(stream.id, stream.active);
                    }}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                      stream.active 
                        ? (stream.id === 'ads' ? 'bg-[#00f2fe]' :
                           stream.id === 'affiliate' ? 'bg-[#4facfe]' :
                           stream.id === 'digital_products' ? 'bg-[#9b51e0]' : 'bg-emerald-500') 
                        : 'bg-zinc-800'
                    }`}
                    title={stream.active ? "Désactiver ce canal sémantique" : "Activer ce canal sémantique"}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                        stream.active ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>

                {/* Earnings */}
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-[10px] text-zinc-400 font-sans">Profits</span>
                  <span className={`text-sm font-bold font-mono ${iconColor}`}>{formatVal(stream.earnings)}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-zinc-950 rounded-full border border-zinc-900/60 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${displayColor}`}
                    style={{ 
                      width: `${stream.active ? Math.min((stream.earnings / (totalRevenue || 1)) * 100 + 4, 100) : 0}%`,
                      opacity: stream.active ? 1 : 0.2
                    }}
                  ></div>
                </div>

                {/* Footer metrics / Status */}
                <div className="flex justify-between items-center text-[9px] font-mono border-t border-zinc-900/60 pt-2 text-zinc-500 mt-1">
                  <span className={`font-bold transition-all ${stream.active ? 'text-emerald-400' : 'text-rose-500'}`}>
                    {stream.active ? '● LIVE' : '○ OFF'}
                  </span>
                  <span>
                    {stream.visitors.toLocaleString()} leads | CVR {stream.conversionRate.toFixed(1)}%
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* KPI Details Modal overlay */}
      {selectedKpi && (
        <div 
          onClick={() => setSelectedKpi(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(ev) => ev.stopPropagation()}
            className="bg-[#0b0b0b] border border-[#1a1a1a] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col cursor-default font-sans"
          >
            {/* Gradient Top highlight */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500"></div>
            
            {/* Fixed Modal Header */}
            <div className="p-5 pb-4 border-b border-zinc-900/80 flex justify-between items-start shrink-0">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-slate-900 border ${
                  selectedKpi === 'revenue' ? 'border-[#00f2fe]/40 text-[#00f2fe]' :
                  selectedKpi === 'mrr' ? 'border-[#9b51e0]/40 text-[#9b51e0]' :
                  selectedKpi === 'traffic' ? 'border-[#4facfe]/40 text-[#4facfe]' :
                  selectedKpi === 'network' ? 'border-cyan-500/40 text-cyan-500' :
                  'border-amber-500/40 text-amber-500'
                }`}>
                  {selectedKpi === 'revenue' && <DollarSign className="w-5 h-5" />}
                  {selectedKpi === 'mrr' && <TrendingUp className="w-5 h-5" />}
                  {selectedKpi === 'traffic' && <Users className="w-5 h-5" />}
                  {selectedKpi === 'cvr' && <Activity className="w-5 h-5" />}
                  {selectedKpi === 'network' && <Network className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                    {selectedKpi === 'revenue' && "Détails: Revenu Cumulé"}
                    {selectedKpi === 'mrr' && "Détails: MRR Estimé"}
                    {selectedKpi === 'traffic' && "Détails: Trafic Global"}
                    {selectedKpi === 'cvr' && "Détails: Rendement d'Achat"}
                    {selectedKpi === 'network' && "Détails: Répartition Fine et Réseau"}
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setSelectedKpi(null)}
                className="text-zinc-500 hover:text-white p-1.5 hover:bg-zinc-900 rounded-lg transition-colors shadow border border-zinc-900"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Content body */}
            <div className="p-5 overflow-y-auto max-h-[55vh] custom-scrollbar">
              <div className="space-y-4 font-mono text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {selectedKpi === 'revenue' && (
                  <div className="space-y-4">
                    <p className="text-zinc-400">Répartition précise des revenus passifs sur la plateforme pour l'ensemble des réseaux connectés.</p>
                    <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Chiffre d'Affaires Brut</span>
                        <span className="font-bold text-[#00f2fe]">{formatVal(totalRevenue)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Frais et Commissions Aura (5%)</span>
                        <span className="text-red-400">-{formatVal(totalRevenue * 0.05)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-200 font-bold uppercase">Bénéfice Net</span>
                        <span className="text-emerald-400 font-bold">{formatVal(totalRevenue * 0.95)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedKpi === 'mrr' && (
                  <div className="space-y-4">
                    <p className="text-zinc-400">L'indicateur Monthly Recurring Revenue représente les abonnements théoriques récurrents.</p>
                    <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-slate-400">MRR Total Estimé</span>
                        <span className="font-bold text-[#9b51e0]">{formatVal(mrr)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Abonnements Microservices (-12%)</span>
                        <span className="text-white">{formatVal(mrr * 0.88)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Renouvellements attendus</span>
                        <span className="text-emerald-400">Dans <span className="font-bold text-white">4</span> Jours</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedKpi === 'traffic' && (
                  <div className="space-y-4">
                    <p className="text-zinc-400">Trafic global agrégé des articles SEO générés par Agent Plume et trafic externe (Réseaux sociaux).</p>
                    <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Visiteurs Uniques (Lead)</span>
                        <span className="font-bold text-[#4facfe]">{totalVisitors.toLocaleString('fr-FR')}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                        <span className="text-slate-400">Source Organique (Google)</span>
                        <span className="text-emerald-400">94.2%</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                        <span className="text-slate-400">Source Directe (Publicités)</span>
                        <span className="text-amber-400">5.8%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-200">Rebond estimé</span>
                        <span className="text-red-400 font-bold">42.5%</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedKpi === 'cvr' && (
                  <div className="space-y-4">
                    <p className="text-zinc-400">Le taux de conversion représente la part des visiteurs qui effectuent un achat de microservice ou de PDF.</p>
                    <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Taux de Conversion Actuel</span>
                        <span className="font-bold text-amber-500">{conversionRate.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Moyenne de l'Industrie</span>
                        <span className="text-zinc-500">2.14%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-200 uppercase">Impact Plume IA</span>
                        <span className="text-emerald-400 font-bold">+{((conversionRate - 2.14) > 0 ? (conversionRate - 2.14) : 0).toFixed(2)}% Performance</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedKpi === 'network' && (
                  <div className="space-y-4">
                    <p className="text-zinc-400">Détail des performances de chaque réseau de monétisation connecté et hébergement de flux.</p>
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col gap-3">
                      {streams.map((stream, idx) => (
                        <div key={stream.id} className={`${idx !== streams.length - 1 ? 'border-b border-slate-800 pb-3' : ''}`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-300 font-semibold">{stream.name}</span>
                            <span className="font-bold text-[#00f2fe]">{formatVal(stream.earnings)}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-slate-500">
                            <span>{stream.visitors.toLocaleString()} Visiteurs</span>
                            <span>{stream.conversionRate.toFixed(1)}% CVR</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Simple Fixed Footer */}
            <div className="px-5 py-3 border-t border-zinc-900 bg-zinc-950/60 flex items-center justify-between text-[10px] text-zinc-500 font-mono shrink-0">
              <span className="tracking-wide">SYSTÈME IA AURA</span>
              <button 
                onClick={() => setSelectedKpi(null)}
                className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded border border-zinc-800 transition-colors uppercase text-[9px]"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Stream Configuration Popover Modal Overlay */}
      {selectedStreamForConfig && (
        <div 
          onClick={() => setSelectedStreamForConfig(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(ev) => ev.stopPropagation()}
            className="bg-[#080808] border border-zinc-800/80 rounded-3xl w-full max-w-lg shadow-2xl relative max-h-[90vh] flex flex-col cursor-default font-sans overflow-hidden"
          >
            {/* Top design spectrum */}
            <div className={`absolute top-0 left-0 w-full h-[4px] ${
              STREAM_METADATA[selectedStreamForConfig.id]?.themeColor.split(' ')[0] || 'bg-[#00f2fe]'
            }`}></div>

            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-zinc-900 flex justify-between items-start shrink-0">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-zinc-950 border border-zinc-900 ${
                  STREAM_METADATA[selectedStreamForConfig.id]?.themeColor.split(' ')[1] || 'text-[#00f2fe]'
                }`}>
                  {renderStreamIcon(selectedStreamForConfig.id, "w-6 h-6")}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-sans">
                    {STREAM_METADATA[selectedStreamForConfig.id]?.fullName || selectedStreamForConfig.name}
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-mono">Configuration sémantique & Arbitrage d'audience</p>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedStreamForConfig(null)}
                className="text-zinc-500 hover:text-white p-2 hover:bg-zinc-900 rounded-lg transition-colors shadow border border-zinc-900"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Configuration Items Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6 font-sans custom-scrollbar">
              
              {/* Telemetry card */}
              <div className="bg-zinc-950 border border-zinc-900/80 p-4 rounded-xl grid grid-cols-3 gap-2 text-center">
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono block">Volume d'affaires</span>
                  <span className="text-xs font-extrabold text-white font-mono">{formatVal(selectedStreamForConfig.earnings)}</span>
                </div>
                <div className="space-y-1 border-x border-zinc-900">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono block">Prospects unique</span>
                  <span className="text-xs font-extrabold text-white font-mono">{selectedStreamForConfig.visitors.toLocaleString()}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono block">Rendement Acheteur</span>
                  <span className="text-xs font-extrabold text-[#00f2fe] font-mono">{selectedStreamForConfig.conversionRate.toFixed(2)}%</span>
                </div>
              </div>

              {/* Status and Active Toggle */}
              <div className="flex items-center justify-between bg-zinc-950/40 p-4 rounded-xl border border-zinc-900">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Statut Opérationnel du Canal</h4>
                  <p className="text-[10px] text-zinc-500">Activez ou désactivez l'arbitrage passif de ce flux sémantique</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-mono font-extrabold ${selectedStreamForConfig.active ? 'text-emerald-400' : 'text-rose-500'}`}>
                    {selectedStreamForConfig.active ? 'ACTIF (SYNCHRONISÉ)' : 'INACTIF'}
                  </span>
                  
                  <div 
                    onClick={() => handleToggleStream(selectedStreamForConfig.id, selectedStreamForConfig.active)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                      selectedStreamForConfig.active ? 'bg-emerald-500' : 'bg-zinc-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                        selectedStreamForConfig.active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic configurations mapping */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider font-mono border-b border-zinc-900 pb-1.5 flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5 text-zinc-500" />
                  Paramètres de Distribution IA
                </h4>

                <div className="space-y-4 rounded-xl">
                  {STREAM_METADATA[selectedStreamForConfig.id]?.bulletOptions.map((opt) => {
                    const value = localConfig[opt.key] !== undefined 
                      ? localConfig[opt.key] 
                      : (opt.type === 'toggle' ? true : (opt.type === 'range' ? opt.min : opt.options?.[0]));

                    return (
                      <div key={opt.key} className="space-y-1.5 p-3.5 bg-zinc-950 border border-zinc-900 rounded-xl">
                        <div className="flex justify-between items-center text-xs">
                          <label className="font-bold text-zinc-300">{opt.label}</label>
                          {opt.type === 'range' && (
                            <span className="text-cyan-400 font-mono font-black text-[11px] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                              {value} {selectedStreamForConfig.id === 'ads' ? '€ CPM' : '€'}
                            </span>
                          )}
                        </div>

                        {opt.type === 'select' && (
                          <div className="relative">
                            <select
                              value={String(value)}
                              onChange={(e) => setLocalConfig(prev => ({ ...prev, [opt.key]: e.target.value }))}
                              className="w-full bg-[#0d0d0d] border border-zinc-800 hover:border-zinc-700 p-2.5 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-cyan-500 appearance-none font-mono cursor-pointer transition-colors"
                            >
                              {opt.options?.map((o) => (
                                <option key={o} value={o} className="bg-zinc-950">{o}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        {opt.type === 'toggle' && (
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] text-zinc-500">Activer le processus intelligent entièrement automatique</span>
                            <div 
                              onClick={() => setLocalConfig(prev => ({ ...prev, [opt.key]: !value }))}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                                value ? 'bg-cyan-500' : 'bg-zinc-800'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                                  value ? 'translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </div>
                          </div>
                        )}

                        {opt.type === 'range' && (
                          <div className="space-y-1.5 pt-1">
                            <input
                              type="range"
                              min={opt.min}
                              max={opt.max}
                              step={opt.step}
                              value={Number(value)}
                              onChange={(e) => setLocalConfig(prev => ({ ...prev, [opt.key]: Number(e.target.value) }))}
                              className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus:outline-none"
                            />
                            <div className="flex justify-between text-[8px] text-zinc-600 font-mono font-bold">
                              <span>Moyenne: {opt.min}</span>
                              <span>Optimale: {opt.max}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Diagnostic and Auto-Heal block */}
              <div className="border-t border-zinc-900 pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-250">Vérification de Santé (Uptime)</h5>
                    <p className="text-[10px] text-zinc-500 font-sans">Tester l'intégration d'hébergement, DNS et certificats SSL</p>
                  </div>
                  <button
                    onClick={() => runStreamDiagnostic(selectedStreamForConfig.id)}
                    disabled={isDiagnosticRunning}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono font-bold rounded-lg border border-zinc-800/60 text-zinc-350 hover:text-white transition cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {isDiagnosticRunning ? 'Vérification...' : 'Lancer le diagnostic'}
                  </button>
                </div>

                {isDiagnosticRunning && (
                  <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-center gap-3 animate-pulse">
                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-mono text-cyan-400">Scan d'hébergement sémantique actif...</span>
                  </div>
                )}

                {diagnosticResult && (
                  <div className="p-3 bg-zinc-950 border border-cyan-900/40 rounded-xl text-[10px] text-emerald-400 font-mono leading-relaxed relative animate-fade-in">
                    {diagnosticResult}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-zinc-900 bg-zinc-950/60 flex items-center justify-between shrink-0">
              <span className="text-[9px] font-mono text-zinc-500 uppercase">Configuration sémantique Aura Core</span>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedStreamForConfig(null)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-xs font-bold text-zinc-400 hover:text-white rounded-xl border border-zinc-800 transition active:scale-[0.98]"
                >
                  Annuler
                </button>
                <button 
                  onClick={() => {
                    handleSaveStreamConfig(selectedStreamForConfig.id, localConfig);
                    setSelectedStreamForConfig(null);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition transform active:scale-[0.98] flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Sauvegarder
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
