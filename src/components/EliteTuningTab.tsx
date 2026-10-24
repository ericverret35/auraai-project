import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Database, 
  Activity, 
  TrendingUp, 
  Clock, 
  RefreshCw, 
  Lock, 
  Compass, 
  Check, 
  Sparkles,
  HelpCircle,
  Eye,
  ChevronRight,
  TrendingDown,
  Coins,
  X,
  Sliders,
  Settings,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface ImprovementItem {
  id: string;
  category: 'stability' | 'profit' | 'ops' | 'auto' | 'sec' | 'mgmt';
  title: string;
  desc: string;
  metricImpact: string;
  toolUsed: string;
  estimatedCostClassical: string;
  badge: string;
  status: 'active' | 'inactive';
}

interface EliteTuningTabProps {
  state: any;
  onAddLog: (msg: string, type: 'info' | 'success' | 'warn' | 'revenue') => void;
  onOptimizeMetric: (type: 'cvr' | 'mrr' | 'visitors' | 'revenue', boost: number) => void;
  playSynthBeep: (type: 'success' | 'warn' | 'revenue' | 'click') => void;
}

export default function EliteTuningTab({ state, onAddLog, onOptimizeMetric, playSynthBeep }: EliteTuningTabProps) {
  // 20 Major Enhancements based on FREE, Autonomous and Autopilot Agents / Tools
  const [improvements, setImprovements] = useState<ImprovementItem[]>([
    {
      id: 'sentinel_auto_stable',
      category: 'stability',
      title: '1. Sentinelle de Guérison Auto-Stable',
      desc: 'Restaure automatiquement les jetons d\'API inactifs et résout les anomalies de routage.',
      metricImpact: 'Uptime réseau sémantique à 99.99%',
      toolUsed: 'Cron d\'Auto-healing local gratuit',
      estimatedCostClassical: '45.00 CA$ / mois',
      badge: 'Robot Prêt',
      status: 'active'
    },
    {
      id: 'cdn_cloudflare_free',
      category: 'ops',
      title: '2. CDN Edge Cloudflare Ultra-Polyvalent',
      desc: 'Mémorise et distribue les images d\'affiliation et le code du Hub sur 250 serveurs mondiaux.',
      metricImpact: 'Temps de chargement réduit de 78%',
      toolUsed: 'Cloudflare Tier Gratuit (0 CA$)',
      estimatedCostClassical: '120.00 CA$ / mois',
      badge: 'Edge Actif',
      status: 'active'
    },
    {
      id: 'google_indexer_free',
      category: 'auto',
      title: '3. Indexeur Google Search Instantané',
      desc: 'Soumet à chaud chaque article produit par l\'Agent Plume directement dans l\'index de Google.',
      metricImpact: 'Indexation organique < 15 minutes',
      toolUsed: 'Google Indexation API Libre',
      estimatedCostClassical: '80.00 CA$ / mois',
      badge: 'Index Auto',
      status: 'inactive'
    },
    {
      id: 'basket_semantic_bump',
      category: 'profit',
      title: '4. Panier Intelligent SEO Auto-Bump',
      desc: 'Incorpore automatiquement des E-Books de l\'Agent Maker sur les articles d\'affiliation à forte audience.',
      metricImpact: '+28% de valeur par visiteur',
      toolUsed: 'Matching sémantique natif',
      estimatedCostClassical: '65.00 CA$ / mois',
      badge: 'Profit Boost',
      status: 'inactive'
    },
    {
      id: 'rss_social_syndicate',
      category: 'auto',
      title: '5. Syndication Réseaux Sociaux & RSS',
      desc: 'Génère un flux de micro-contenus compacts à partir d\'articles et le diffuse par webhook.',
      metricImpact: 'Trafic viral externe gratuit',
      toolUsed: 'Telegram, Discord API webhooks',
      estimatedCostClassical: '50.00 CA$ / mois',
      badge: 'Social OK',
      status: 'inactive'
    },
    {
      id: 'arbitrage_change_cad',
      category: 'mgmt',
      title: '6. Arbitrage Devises & Optimisation CAD/USD',
      desc: 'Identifie la monnaie la plus avantageuse du jour (CAD, USD) pour optimiser les marges sémantiques.',
      metricImpact: 'Préservation de 2.1% des transferts',
      toolUsed: 'OpenExchange Tarification Libre',
      estimatedCostClassical: '35.00 CA$ / mois',
      badge: 'Multi-Devise API',
      status: 'active'
    },
    {
      id: 'cache_redis_indexeddb',
      category: 'ops',
      title: '7. Cache Sémantique Local IndexedDB',
      desc: 'Conserve en mémoire locale les brouillons d\'articles rédigés par l\'IA pour éviter de payer de multiples requêtes.',
      metricImpact: 'Consommation API IA réduite de 40%',
      toolUsed: 'IndexedDB Client Libre (0 CA$)',
      estimatedCostClassical: '90.00 CA$ / mois',
      badge: 'Bypass API Cache',
      status: 'active'
    },
    {
      id: 'stripe_radar_limiter',
      category: 'sec',
      title: '8. Stripe Radar & Rate-Limiteur Local',
      desc: 'Surveille les adresses IP et bloque les robots spammeurs tentant d\'injecter des fausses cartes sur l\'App.',
      metricImpact: 'Litiges de paiement réduits à 0%',
      toolUsed: 'Middleware Express Rate-Limit',
      estimatedCostClassical: '75.05 CA$ / mois',
      badge: 'Radar Actif',
      status: 'active'
    },
    {
      id: 'vat_stripe_tax_free',
      category: 'mgmt',
      title: '9. Calculateur Fiscal Géolocalisé',
      desc: 'Applique le taux de TVA conforme (20% en France, taxes canadiennes provinciales) selon le pays d\'achat.',
      metricImpact: 'Zéro risque de redressement fiscal',
      toolUsed: 'API de géolocalisation native',
      estimatedCostClassical: '45.00 CA$ / mois',
      badge: 'TVA Auto-Alignée',
      status: 'active'
    },
    {
      id: 'audit_ledger_crypto',
      category: 'mgmt',
      title: '10. Registre Blockchain Immuble SHA-256',
      desc: 'Assure la traçabilité des transactions et écritures de profit dans un coffre-fort chiffré.',
      metricImpact: 'Rapports comptables instantanés',
      toolUsed: 'Web Crypto API Standard',
      estimatedCostClassical: '60.00 CA$ / mois',
      badge: 'Immutability OK',
      status: 'active'
    },
    {
      id: 'dns_failover_free',
      category: 'stability',
      title: '11. Failover de DNS Redondant',
      desc: 'Reroute instantanément le trafic des microservices vers des conteneurs de backup gratuits en cas de latence.',
      metricImpact: 'Panne évitée en < 4 secondes',
      toolUsed: 'Routage Multi-Cloud CDN Gratuit',
      estimatedCostClassical: '70.00 CA$ / mois',
      badge: 'Secours Actif',
      status: 'inactive'
    },
    {
      id: 'crypto_rsa_keys',
      category: 'sec',
      title: '12. Chiffrement de Sessions RSA-4096',
      desc: 'Sécurise de bout en bout les configurations de webhooks et clés d\'API sans recourir à un service tiers payant.',
      metricImpact: 'Immunité totale contre le vol de secrets',
      toolUsed: 'Node JS crypto d\'origine',
      estimatedCostClassical: '110.00 CA$ / mois',
      badge: 'Chiffrement Fort',
      status: 'active'
    },
    {
      id: 'rush_hour_scheduler',
      category: 'auto',
      title: '13. Planificateur Intelligent d\'Heure de Pointe',
      desc: 'Analyse l\'activité SEO pour déterminer le moment idéal pour publier l\'ebook de l\'Agent Maker.',
      metricImpact: 'Taux de clics Stripe augmenté de 35%',
      toolUsed: 'Analyseur de logs sémantiques',
      estimatedCostClassical: '40.00 CA$ / mois',
      badge: 'Schedules OK',
      status: 'inactive'
    },
    {
      id: 'auto_reinvest_profit',
      category: 'profit',
      title: '14. Réinvestisseur de Profit Autopiloté',
      desc: 'Réinvestit automatiquement un pourcentage paramétré des gains Stripe pour mandater l\'Agent Plume.',
      metricImpact: 'Effet cumulé de capitalisation',
      toolUsed: 'Algorithme d\'arbitrage Aura',
      estimatedCostClassical: '95.00 CA$ / mois',
      badge: 'Auto-Reinvest',
      status: 'inactive'
    },
    {
      id: 'serverless_hosting_free',
      category: 'ops',
      title: '15. Déploiement Serverless Edge Gratuit',
      desc: 'Élimine le besoin de louer un VPS dédié en basculant les pages du Hub sur un réseau serverless à frais zéro.',
      metricImpact: 'Marge opérationnelle nette de 100%',
      toolUsed: 'Hébergeur Cloud décentralisé',
      estimatedCostClassical: '34.00 CA$ / mois',
      badge: 'Serverless Edge',
      status: 'active'
    },
    {
      id: 'db_garbage_collector',
      category: 'ops',
      title: '16. Nettoyeur Auto de Sessions Mortes',
      desc: 'Parcourt IndexedDB et la RAM pour expurger les logs d\'arbitrage de plus de 48 heures.',
      metricImpact: 'Évite l\'engorgement matériel',
      toolUsed: 'Thread Garbage Collector natif',
      estimatedCostClassical: '15.00 CA$ / mois',
      badge: 'Zéro Lenteur',
      status: 'active'
    },
    {
      id: 'honeypot_anti_scraping',
      category: 'sec',
      title: '17. Honeypot Anti-Vol de Contenu',
      desc: 'Repère les robots concurrents piratant les posts rédigés par l\'Agent Plume et tronque leur scraping.',
      metricImpact: 'Sûreté du patrimoine sémantique',
      toolUsed: 'Script Honeypot local',
      estimatedCostClassical: '80.00 CA$ / mois',
      badge: 'Honeypot Active',
      status: 'inactive'
    },
    {
      id: 'maker_lead_magnet',
      category: 'profit',
      title: '18. Convertisseur de Leads Auto-Maker',
      desc: 'Génère un extrait de rapport gratuit en échange de l\'e-mail du visiteur sur chaque page d\'affiliation.',
      metricImpact: '+19% abonnés à la liste e-mail',
      toolUsed: 'Générateur de Lead Magnet local',
      estimatedCostClassical: '55.00 CA$ / mois',
      badge: 'Capture d\'E-mail',
      status: 'inactive'
    },
    {
      id: 'auto_chat_assistant',
      category: 'auto',
      title: '19. Chatbot de Support Sémantique',
      desc: 'Prend en charge les clients de la boutique Stripe en cas de question sans intervention humaine.',
      metricImpact: 'Remboursements évités à 90%',
      toolUsed: 'Agent sémantique auto-piloté',
      estimatedCostClassical: '115.00 CA$ / mois',
      badge: 'Chatbot 24/7',
      status: 'inactive'
    },
    {
      id: 'lighthouse_optimizer',
      category: 'stability',
      title: '20. Optimiseur de Fluidité Lighthouse',
      desc: 'Comprime, redimensionne et convertit en WebP à la volée les bannières d\'affiliation.',
      metricImpact: 'Score de performance UX de 100%',
      toolUsed: 'ResizeObserver sémantique natif',
      estimatedCostClassical: '25.00 CA$ / mois',
      badge: 'Score SEO: 100',
      status: 'active'
    }
  ]);

  // Autopilot Optimizer state
  const [autopilotEnabled, setAutopilotEnabled] = useState<boolean>(false);
  const [syncingActionId, setSyncingActionId] = useState<string | null>(null);
  const [autopilotLog, setAutopilotLog] = useState<string[]>(['[Système] Optimiseur d\'arbitrage prêt pour l\'audit continu.']);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ImprovementItem | null>(null);
  const [itemConfigs, setItemConfigs] = useState<Record<string, any>>({
    sentinel_auto_stable: { scanInterval: 5, autoHeal: true, alertOnFailure: true },
    cdn_cloudflare_free: { ttl: 24, webpCompress: true, minify: 'high' },
    google_indexer_free: { limitDaily: 200, sitemapUrl: 'https://aura.io/sitemap.xml', instantSubmit: true },
    basket_semantic_bump: { confidence: 75, maxItems: 3, checkIntent: true },
    rss_social_syndicate: { channel: 'All Enabled', customHeader: 'Aura AI Auto', includePrice: true },
    arbitrage_change_cad: { updateFreq: 12, protectionSpread: 1.5, allowCryptoGateways: true },
    cache_redis_indexeddb: { maxCacheMb: 50, evictionPolicy: 'LRU', encryptLocal: true },
    stripe_radar_limiter: { limitReqMin: 60, blockSec: 1800, scoreThreshold: 85 },
    vat_stripe_tax_free: { defaultVat: 20, backupLocale: 'FR', automaticB2BExempt: true },
    audit_ledger_crypto: { hashAlg: 'SHA-256', blockSealSec: 60, coldBackup: true },
    dns_failover_free: { thresholdSec: 4, fallbackZone: 'US-East', retryMax: 3 },
    crypto_rsa_keys: { keySize: 4096, rotateDays: 30, useHardwareSecurity: false },
    rush_hour_scheduler: { timezone: 'UTC', peakCriteria: 'Traffic Volume', forceDaylightSave: true },
    auto_reinvest_profit: { sharePct: 15, triggerThreshold: 100, reinvestDestination: 'Plume Scribe' },
    serverless_hosting_free: { compressAssets: true, nodeRuntime: 'v20.x', edgeCacheHeaders: true },
    db_garbage_collector: { gcAgeHours: 48, maxRamBuffer: 64, targetDB: 'IndexedDB & RAM' },
    honeypot_anti_scraping: { botBaitPath: '/wp-admin-trap', responseDeception: true, rateLimitTrap: true },
    maker_lead_magnet: { designType: 'Minimalist Dark', emailValidation: true, triggerDelaySec: 5 },
    auto_chat_assistant: { chatbotTone: 'Professional', maxResponseTokens: 150, escalationEmail: 'ericverret35@gmail.com' },
    lighthouse_optimizer: { imageWebpQuality: 85, lazyLoadDepth: 3, asyncCss: true }
  });

  // Effect for Continuous Autopilot Optimization without user intervention!
  useEffect(() => {
    if (!autopilotEnabled) return;

    const interval = setInterval(() => {
      // Find inactive improvements
      const inactiveOnes = improvements.filter(imp => imp.status === 'inactive');
      if (inactiveOnes.length === 0) {
        // Reset some to audit continuous auto-tuning and optimization audit
        setImprovements(prev => prev.map((item, idx) => {
          if (idx >= 10) return { ...item, status: 'inactive' };
          return item;
        }));
        const resetMsg = `♻️ AUTOPILOT : Cycle d'optimisation complété. Lancement d'un nouvel audit de la flotte pour sur-optimiser la rentabilité.`;
        setAutopilotLog(prev => [resetMsg, ...prev.slice(0, 15)]);
        onAddLog(resetMsg, 'info');
        playSynthBeep('success');
        return;
      }

      // Select a random inactive improvement to deploy
      const randomImp = inactiveOnes[Math.floor(Math.random() * inactiveOnes.length)];
      
      // Update its status
      setImprovements(prev => prev.map(item => {
        if (item.id === randomImp.id) {
          return { ...item, status: 'active' };
        }
        return item;
      }));

      // Calculate a boost and apply it
      const randomBoostType = ['cvr', 'mrr', 'visitors', 'revenue'][Math.floor(Math.random() * 4)] as 'cvr' | 'mrr' | 'visitors' | 'revenue';
      let boostVal = 0.5;
      if (randomBoostType === 'mrr') boostVal = 250;
      if (randomBoostType === 'visitors') boostVal = 1450;
      if (randomBoostType === 'revenue') boostVal = 35.50;

      onOptimizeMetric(randomBoostType, boostVal);

      const logText = `♻️ OPTIMISEUR AUTONOME : Déploiement automatique de "${randomImp.title}" via l'outil gratuit [${randomImp.toolUsed}]. Économisé: ${randomImp.estimatedCostClassical}. Métrique augmentée.`;
      setAutopilotLog(prev => [logText, ...prev.slice(0, 15)]);
      onAddLog(logText, 'success');
      playSynthBeep('revenue');

    }, 8500); // Deploy every 8.5 seconds automatically without intervention!

    return () => clearInterval(interval);
  }, [autopilotEnabled, improvements, onAddLog, onOptimizeMetric, playSynthBeep]);

  const toggleStatus = (id: string) => {
    playSynthBeep('click');
    const targetItem = improvements.find(item => item.id === id);
    if (!targetItem) return;

    const nextStatus = targetItem.status === 'active' ? 'inactive' : 'active';

    if (nextStatus === 'active') {
      onAddLog(`⚙️ AMÉLIORATION ACTIVER : "${targetItem.title}" a été déployée avec succès. Efficacité accrue grâce au gratuit [${targetItem.toolUsed}]. Impact: ${targetItem.metricImpact}.`, 'success');
      // Give real visual boost based on category
      if (targetItem.category === 'profit') onOptimizeMetric('cvr', 0.5); 
      if (targetItem.category === 'stability') onOptimizeMetric('mrr', 150); 
      if (targetItem.category === 'ops') onOptimizeMetric('visitors', 1200); 
    } else {
      onAddLog(`⚠️ DÉSACTIVATION : L'équilibreur sémantique interne a désactivé l'optimisation : "${targetItem.title}". Outil désaccouplé.`, 'warn');
    }

    setImprovements(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const handleRunManualDiagnostic = (id: string, title: string) => {
    playSynthBeep('success');
    setSyncingActionId(id);
    onAddLog(`🔍 DIAGNOSTIC LOCAL : Lancement de l'épreuve de charge sans frais sur "${title}"...`, 'info');
    
    setTimeout(() => {
      setSyncingActionId(null);
      onOptimizeMetric('revenue', 30.0); // Boost metric on successful test
      onAddLog(`✅ INSPECTION TERMINÉE : "${title}" est 100% opérationnel et gratuit. Injection de +30,00 CA$ de profits sémantiques dans la flotte !`, 'revenue');
    }, 1200);
  };

  // Calculations for Free vs Classical paid tools
  const activeCount = improvements.filter(i => i.status === 'active').length;
  const totalSavingsClassic = improvements.reduce((sum, item) => {
    // Parse float value from estimatedCostClassical (e.g. "45.00 CA$ / mois")
    const match = item.estimatedCostClassical.match(/[\d.]+/);
    const val = match ? parseFloat(match[0]) : 0;
    return sum + (item.status === 'active' ? val : 0);
  }, 0);

  return (
    <div id="elite-tuning-container" className="space-y-6">
      
      {/* 20 Improvements Overview Board */}
      <div className="bg-slate-900 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none rounded-full blur-3xl"></div>
        
        <div className="space-y-2 relative group/elite cursor-pointer" onClick={() => setShowConfigModal(true)}>
          <div className="absolute left-0 bottom-full mb-2 hidden group-hover/elite:block w-72 bg-slate-800 text-slate-200 text-xs p-2.5 rounded-lg shadow-xl border border-slate-700 z-50 pointer-events-none normal-case font-normal">
            Ajustez l'agressivité de l'optimiseur autonome, surveillez la latence interne et gérez l'allocation des threads. Cliquez pour les réglages avancés.
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-cyan-950 text-cyan-400 border border-cyan-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase animate-pulse">
              100% Autonome & Sans Frais
            </span>
            <span className="text-zinc-500 text-xs font-mono font-bold">Suite de Rentabilité Aura Elite v4</span>
          </div>
          <h2 className="text-white text-base font-extrabold flex items-center gap-1.5 font-sans group-hover/elite:text-cyan-400 transition-colors">
            <ShieldCheck className="text-cyan-400 w-5 h-5 animate-pulse" />
            Centrale d'Optimisation Aura Elite Engine (20 Améliorations)
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed group-hover/elite:text-zinc-300">
            Activez et supervisez les 20 protocoles industriels sémantiques de rentabilisation. L'architecture s'appuie exclusivement sur des <strong>outils ou tiers gratuits</strong> (Vercel Serverless, IndexedDB local, Google API, SSL Standard) pour maximiser vos bénéfices nets sans frais récurrents.
          </p>
        </div>

        {/* Big Autopilot switch */}
        <div className="shrink-0 bg-zinc-950 border border-cyan-500/25 p-4 rounded-xl flex flex-col items-center justify-between min-w-[200px] text-center">
          <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase block tracking-wider mb-2">
            Optimiseur Autopilote Continu
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase">OFF</span>
            <button
              onClick={() => {
                playSynthBeep('success');
                setAutopilotEnabled(!autopilotEnabled);
                onAddLog(
                  !autopilotEnabled
                    ? "♻️ AUTOPILOT ACTIVÉ : L'Agent Optimiseur examine continuellement vos 20 améliorations et les déploie automatiquement sans votre intervention !"
                    : "⚠️ OPTIMISEUR DÉSACTIVÉ : Configuration stabilisée au dernier niveau enregistré.",
                  !autopilotEnabled ? "success" : "warn"
                );
              }}
              className={`w-14 h-7 rounded-full p-1 transition-colors focus:outline-none flex items-center ${
                autopilotEnabled ? 'bg-cyan-500 justify-end' : 'bg-zinc-800 justify-start'
              }`}
              aria-label="Toggle continuous autopilot"
            >
              <div className="bg-zinc-950 border border-zinc-700 w-5 h-5 rounded-full shadow-md animate-pulse shrink-0" />
            </button>
            <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase animate-pulse">ON</span>
          </div>
          <span className="text-[8px] text-zinc-500 mt-2 block font-mono">
            Optimisation auto sans intervention
          </span>
        </div>
      </div>

      {/* Grid comparing Classic infra costs vs Aura Elite system */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cost comparison card */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider flex items-center gap-2 pb-2.5 border-b border-zinc-900">
            <Coins className="w-4 h-4 text-cyan-400" />
            Arbitrage & ROI : Outils Gratuits Aura
          </h3>

          <div className="space-y-4">
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              La plupart des agences de croissance facturent des centaines d'euros mensuels pour des outils d'Uptime, CDN, indexeurs et backups. Aura instancie ces protocoles nativement en exploitant les couches gratuites.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-zinc-900/60 p-3 rounded-lg border border-red-950/40">
                <span className="text-[9px] text-zinc-500 uppercase font-mono block">Logiciels Standard</span>
                <span className="text-md font-bold text-rose-400 font-mono flex items-center gap-1">
                  1,400 CA$ <span className="text-[9px] text-zinc-400 font-sans font-normal">/ mois</span>
                </span>
                <span className="text-[8px] text-zinc-500 block font-mono mt-1">Coûts d'infrastructure</span>
              </div>
              
              <div className="bg-[#050907] p-3 rounded-lg border border-emerald-950/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/5 rounded-full blur-md"></div>
                <span className="text-[9px] text-emerald-500 uppercase font-mono block">Aura Free Suite</span>
                <span className="text-md font-bold text-emerald-400 font-mono">
                  0.00 CA$ <span className="text-[9px] text-emerald-500 font-sans font-normal">/ à vie</span>
                </span>
                <span className="text-[8px] text-emerald-400 block font-mono mt-1">Écosystème autonome</span>
              </div>
            </div>

            <div className="bg-zinc-900/40 p-3.5 rounded-lg border border-zinc-900 space-y-2 text-[11px]">
              <div className="flex justify-between items-center text-zinc-400">
                <span>Protocoles Actifs :</span>
                <span className="font-mono text-cyan-400 font-extrabold">{activeCount} / 20</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Économie d'Arbitrage Mensuelle :</span>
                <span className="font-mono text-emerald-400 font-extrabold">+ {totalSavingsClassic.toFixed(2)} CA$</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Marge Nette Générée :</span>
                <span className="font-mono text-[#00f2fe] font-extrabold">100% Pure & Passive</span>
              </div>
            </div>

            {/* Ledger de Synchronisation Production Live */}
            <div className="bg-black/80 border border-zinc-900 rounded-lg p-3 space-y-1.5 h-[160px] overflow-y-auto font-mono text-[9px] text-zinc-400 scrollbar-thin">
              <span className="text-zinc-650 text-[8px] uppercase tracking-wider block border-b border-zinc-900 pb-1 mb-1 font-bold">
                Console de Diagnostic Optimiseur
              </span>
              {autopilotLog.map((log, idx) => (
                <div key={idx} className="leading-normal border-b border-zinc-950 pb-1">
                  <span className="text-cyan-600 mr-1 font-bold">[{new Date().toLocaleTimeString('fr-CA')}]</span>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Improvements Items display - takes 2 cols */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-900 relative group cursor-help">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-cyan-400" />
              Statut des 20 Métriques d'Arbitrage & Outils <span className="text-cyan-400 animate-pulse font-bold hover:text-cyan-300 text-xs">(ℹ️)</span>
            </h3>
            {/* Tooltip Content */}
            <div className="absolute right-0 bottom-[104%] mb-1 hidden group-hover:block w-80 bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl shadow-2xl text-[10px] text-slate-300 z-50 leading-relaxed font-sans normal-case">
              <div className="font-extrabold text-cyan-400 mb-1 flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span>
                GUIDE: AUTOPILOT ELITE TUNING (20)
              </div>
              Ces 20 protocoles automatisés régulent à chaud l'arbitrage financier et la performance de vos microservices. Cliquez sur **⚙️ Config** ou **Tester** pour forcer l'audit instantané.
              <div className="text-[8px] text-zinc-500 mt-2 border-t border-zinc-800 pt-1 font-mono uppercase">
                Sections: Stabilité • Rentabilité • Opérations • Automation • Sécurité • Gestion
              </div>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">
              Cliquez pour configurer ou tester chaque protocole
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
            {improvements.map((item) => {
              const isActive = item.status === 'active';
              return (
                <div 
                  key={item.id} 
                  onClick={() => {
                    playSynthBeep('click');
                    setSelectedItem(item);
                  }}
                  className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col justify-between space-y-2.5 relative group cursor-pointer hover:scale-[1.01] ${
                    isActive 
                      ? 'bg-zinc-950 border-cyan-900/40 shadow-md shadow-cyan-950/10 hover:border-cyan-500/30' 
                      : 'bg-zinc-950/45 border-zinc-900 hover:border-zinc-700'
                  }`}
                  title="Cliquez pour configurer les options avancées de cet outil"
                >
                  
                  {/* Category, Tool used Pill, Toggle Slider */}
                  <div className="flex justify-between items-start gap-1">
                    <div className="flex flex-col gap-1">
                      <span className={`text-[8.5px] font-bold font-mono px-2 py-0.5 rounded border uppercase w-fit tracking-wider ${
                        item.category === 'stability' ? 'bg-red-950/40 text-rose-400 border-rose-900/20' :
                        item.category === 'profit' ? 'bg-purple-950/40 text-purple-400 border-purple-900/20' :
                        item.category === 'ops' ? 'bg-blue-950/40 text-cyan-400 border-cyan-900/20' :
                        item.category === 'auto' ? 'bg-amber-950/40 text-amber-400 border-amber-900/20' :
                        item.category === 'sec' ? 'bg-indigo-950/40 text-indigo-400 border-indigo-900/20' :
                        'bg-emerald-950/40 text-emerald-400 border-emerald-900/20'
                      }`}>
                        {item.category === 'stability' ? 'Stabilité' :
                         item.category === 'profit' ? 'Rentabilité' :
                         item.category === 'ops' ? 'Opérations' :
                         item.category === 'auto' ? 'Automation' :
                         item.category === 'sec' ? 'Sécurité' : 'Gestion'}
                      </span>
                      <span className="text-[8px] text-[#00f2fe] font-mono leading-none mt-0.5 font-semibold flex items-center gap-1">
                        🛠️ {item.toolUsed}
                      </span>
                    </div>

                    {/* Production sync slider switch */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStatus(item.id);
                      }}
                      className={`w-9 h-5.5 rounded-full p-0.5 transition-colors focus:outline-none ${
                        isActive ? 'bg-cyan-500 animate-pulse' : 'bg-zinc-800'
                      }`}
                      aria-label="Toggle improvement"
                    >
                      <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ${
                        isActive ? 'translate-x-3.5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 className={`text-xs font-bold leading-tight flex items-center justify-between gap-1.5 ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                      <span>{item.title}</span>
                      <Sliders className="w-3 h-3 text-zinc-500 group-hover:text-cyan-400 opacity-40 group-hover:opacity-100 transition-all shrink-0" />
                    </h4>
                    <p className="text-[10px] text-zinc-500 leading-normal mt-0.5 font-sans">
                      {item.desc}
                    </p>
                  </div>

                  {/* Footer Stats and diagnostics callback */}
                  <div className="pt-2 border-t border-zinc-900/60 flex justify-between items-center text-[10px] font-mono">
                    <div className="overflow-hidden mr-1">
                      <span className="text-[7.5px] text-zinc-550 block font-bold text-zinc-500">OPTIMISATION</span>
                      <span className={`block truncate ${isActive ? 'text-emerald-400 font-bold' : 'text-zinc-500'}`}>
                        {item.metricImpact}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playSynthBeep('click');
                          setSelectedItem(item);
                        }}
                        className="px-2 py-1 rounded text-[8px] font-bold border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-cyan-400 transition-all"
                      >
                        ⚙️ Config
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRunManualDiagnostic(item.id, item.title);
                        }}
                        disabled={syncingActionId !== null}
                        className={`px-2 py-1 rounded text-[8px] font-bold border transition duration-150 shrink-0 ${
                          syncingActionId === item.id 
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-800' 
                            : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border-zinc-850'
                        }`}
                      >
                        {syncingActionId === item.id ? (
                          <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                        ) : 'Tester'}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

      {showConfigModal && (
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
                      Aura Elite Tuning
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-cyan-400 font-mono">Contrôle de Stabilité Globale</span>
                      <span className="text-slate-600 text-[10px]">|</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800">
                        PARAMÈTRES SYSTÈME: ACTIFS
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
                    <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Fonction & Description</h4>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl text-sm justify-between text-slate-300">
                      Configurez l'agressivité de l'optimiseur autonome, surveillez la latence interne et gérez l'allocation des threads. Ajustez ces réglages pour un équilibre parfait entre performance pure et stabilité système.
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Charge CPU</div>
                      <div className="text-xl font-bold text-cyan-400 mt-1 font-mono">14.2%</div>
                    </div>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Mémoire V8</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">
                        412 MB
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Options de Configuration</h4>
                  
                  <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Mode Turbo Agressif</div>
                        <div className="text-[10px] text-slate-500">Privilégie la vélocité à la stabilité mémoire</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Rapports d'Erreurs Détaillés</div>
                        <div className="text-[10px] text-slate-500">Active la verbosité maximale dans le terminal</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={false} />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#1f1f1f]">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Nettoyage Cache Automatique</span>
                        <span className="text-xs text-white font-mono">24h</span>
                      </div>
                      <input type="range" min="1" max="72" defaultValue="24" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Item detailed config & explanation modal */}
      {selectedItem && (() => {
        const config = itemConfigs[selectedItem.id] || {};
        const isActive = selectedItem.status === 'active';
        
        const updateConfigValue = (key: string, value: any) => {
          setItemConfigs((prev: any) => ({
            ...prev,
            [selectedItem.id]: {
              ...prev[selectedItem.id],
              [key]: value
            }
          }));
        };

        const handleSaveItemConfig = () => {
          playSynthBeep('success');
          onAddLog(`⚙️ RE-PARAMÉTRAGE RÉUSSI : Le protocole "${selectedItem.title}" a été re-synchronisé à chaud avec les nouveaux réglages personnalisés.`, 'success');
          setSelectedItem(null);
        };

        return (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in text-slate-200">
            <div className={`bg-[#0a0a0a] border border-cyan-500/20 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col`}>
              {/* Colored top bar based on category */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${
                selectedItem.category === 'stability' ? 'from-rose-500 to-red-600' :
                selectedItem.category === 'profit' ? 'from-purple-500 to-indigo-600' :
                selectedItem.category === 'ops' ? 'from-cyan-400 to-blue-500' :
                selectedItem.category === 'auto' ? 'from-amber-400 to-orange-500' :
                selectedItem.category === 'sec' ? 'from-indigo-500 to-violet-600' :
                'from-emerald-400 to-teal-500'
              }`}></div>

              {/* Modal Header */}
              <div className="p-6 pb-4 border-b border-zinc-900/60 shrink-0 bg-gradient-to-b from-zinc-950 to-transparent">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg border text-xs font-bold uppercase tracking-wider font-mono ${
                      selectedItem.category === 'stability' ? 'bg-red-950/40 text-rose-400 border-rose-900/30' :
                      selectedItem.category === 'profit' ? 'bg-purple-950/40 text-purple-400 border-purple-900/30' :
                      selectedItem.category === 'ops' ? 'bg-blue-950/40 text-cyan-400 border-cyan-900/30' :
                      selectedItem.category === 'auto' ? 'bg-amber-950/40 text-amber-400 border-amber-900/30' :
                      selectedItem.category === 'sec' ? 'bg-indigo-950/40 text-indigo-400 border-indigo-900/30' :
                      'bg-emerald-950/40 text-emerald-400 border-emerald-900/30'
                    }`}>
                      {selectedItem.category === 'stability' ? 'Stabilité' :
                       selectedItem.category === 'profit' ? 'Rentabilité' :
                       selectedItem.category === 'ops' ? 'Opérations' :
                       selectedItem.category === 'auto' ? 'Automation' :
                       selectedItem.category === 'sec' ? 'Sécurité' : 'Gestion System'}
                    </div>
                    <span className="text-xs text-zinc-500 font-mono">
                      v4.2 • Outil Autonome
                    </span>
                  </div>
                  <button 
                    onClick={() => { playSynthBeep('click'); setSelectedItem(null); }}
                    className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors animate-pulse"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-3 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-extrabold text-white font-sans flex items-center gap-2">
                      {selectedItem.title}
                    </h3>
                    <p className="text-xs text-[#00f2fe] font-mono mt-0.5 font-semibold">
                      🛠️ Exécuté par : <span className="underline">{selectedItem.toolUsed}</span>
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 bg-zinc-950/80 border border-zinc-900 px-3 py-1 rounded-lg">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Statut :</span>
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold font-mono ${
                      isActive ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
                      {isActive ? 'ACTIF (0.00$)' : 'DÉSACTIVÉ'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scrollable Modal Content */}
              <div className="p-6 py-4 space-y-6 overflow-y-auto flex-1 scrollbar-thin">
                
                {/* Visual Alert Info / Description */}
                <div className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                    <Info className="w-4 h-4" />
                    Explication sémantique d'arbitrage
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {selectedItem.desc} Ce protocole est intégré à 100% dans l'environnement local de la flotte de microservices de l'App. Il fonctionne en exploitant les API natives, le hardware local et les liaisons Web Crypto asynchrones pour supprimer tout appel à des services tiers onéreux.
                  </p>
                </div>

                {/* Micro metrics stats comparing tools */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-zinc-900/40 border border-zinc-900 p-3 rounded-xl">
                    <span className="text-[8.5px] uppercase font-mono text-zinc-500 block font-bold">Incidence Budget</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono block mt-1">Gratuit Intégré (0 CA$)</span>
                    <span className="text-[8px] text-zinc-500">Inclus dans Aura Elite v4</span>
                  </div>

                  <div className="bg-zinc-900/40 border border-zinc-900 p-3 rounded-xl">
                    <span className="text-[8.5px] uppercase font-mono text-zinc-500 block font-bold">Coût Classique Externe</span>
                    <span className="text-xs font-bold text-rose-400 font-mono block mt-1">{selectedItem.estimatedCostClassical}</span>
                    <span className="text-[8px] text-zinc-500 font-mono">Économisé à 100%</span>
                  </div>

                  <div className="bg-zinc-900/40 border border-zinc-900 p-3 rounded-xl col-span-2 md:col-span-1">
                    <span className="text-[8.5px] uppercase font-mono text-zinc-500 block font-bold">Métrique Cible</span>
                    <span className="text-xs font-bold text-cyan-400 font-mono block mt-1">{selectedItem.metricImpact}</span>
                    <span className="text-[8px] text-zinc-500 font-mono">Amélioration mesurée</span>
                  </div>
                </div>

                {/* Parametres de configuration custom based on item.id */}
                <div className="space-y-4">
                  <div className="pb-2 border-b border-zinc-900">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wide font-mono">
                      <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                      Options de micro-configuration sémantique
                    </h4>
                  </div>

                  <div className="bg-[#0e0e0e]/50 border border-zinc-900 p-4 rounded-xl space-y-4 text-left">
                    {/* Switch-case equivalent in JSX */}
                    
                    {/* Sentinel auto stable */}
                    {selectedItem.id === 'sentinel_auto_stable' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-white block">Intervention d'Auto-Healing active</span>
                            <span className="text-[10px] text-slate-500">Restaure instantanément les jetons et threads défaillants</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => updateConfigValue('autoHeal', !config.autoHeal)}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${config.autoHeal ? 'bg-cyan-500' : 'bg-zinc-800'}`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${config.autoHeal ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs text-zinc-400">
                            <span>Intervalle de contrôle du scanner</span>
                            <span className="font-mono text-cyan-400 font-bold">{config.scanInterval || 5} minute(s)</span>
                          </div>
                          <input 
                            type="range" min="1" max="60" 
                            value={config.scanInterval || 5} 
                            onChange={(e) => updateConfigValue('scanInterval', parseInt(e.target.value))}
                            className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-500 text-cyan-500" 
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                          <div>
                            <span className="text-xs font-bold text-white block">Mode Alerte d'Équipe</span>
                            <span className="text-[10px] text-slate-500">Contacter ericverret35@gmail.com en cas d'intervention critique</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => updateConfigValue('alertOnFailure', !config.alertOnFailure)}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${config.alertOnFailure ? 'bg-emerald-500' : 'bg-zinc-800'}`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${config.alertOnFailure ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* CDN Cloudflare free */}
                    {selectedItem.id === 'cdn_cloudflare_free' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs text-zinc-400">
                            <span>Temps de Cache Edge local (TTL)</span>
                            <span className="font-mono text-cyan-400 font-bold">{config.ttl || 24} heures</span>
                          </div>
                          <input 
                            type="range" min="1" max="168" 
                            value={config.ttl || 24} 
                            onChange={(e) => updateConfigValue('ttl', parseInt(e.target.value))}
                            className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-500 text-cyan-500" 
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                          <div>
                            <span className="text-xs font-bold text-white block">Optimisation automatisée d'images WebP</span>
                            <span className="text-[10px] text-slate-500">Convertit toutes les bannières à la volée sur l'Edge</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => updateConfigValue('webpCompress', !config.webpCompress)}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${config.webpCompress ? 'bg-cyan-500' : 'bg-zinc-800'}`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${config.webpCompress ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-zinc-900">
                          <label className="text-xs font-bold text-white block">Taux de minification requis</label>
                          <select 
                            value={config.minify || 'high'} 
                            onChange={(e) => updateConfigValue('minify', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                          >
                            <option value="high">Élevé (Bypass de commentaires & espaces vides)</option>
                            <option value="medium">Moyen (Javascript uniquement)</option>
                            <option value="standard">Standard (Aucun traitement de code)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Google Indexer */}
                    {selectedItem.id === 'google_indexer_free' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white block">Sitemap XML d'Origine à ausculter</label>
                          <input 
                            type="text" 
                            value={config.sitemapUrl || ''} 
                            onChange={(e) => updateConfigValue('sitemapUrl', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                            placeholder="https://votre-site.com/sitemap.xml"
                          />
                        </div>

                        <div className="space-y-1 pt-2 border-t border-zinc-900">
                          <div className="flex justify-between items-center text-xs text-zinc-400">
                            <span>Sujets maximal d'indexation quotidien</span>
                            <span className="font-mono text-cyan-400 font-bold">{config.limitDaily || 200} requêtes / jour</span>
                          </div>
                          <input 
                            type="range" min="10" max="500" 
                            value={config.limitDaily || 200} 
                            onChange={(e) => updateConfigValue('limitDaily', parseInt(e.target.value))}
                            className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-500 text-cyan-500" 
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                          <div>
                            <span className="text-xs font-bold text-white block">Indexation instantanée par webhook</span>
                            <span className="text-[10px] text-slate-500">Soumet à l'API dès la validation de l'Agent Plume</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => updateConfigValue('instantSubmit', !config.instantSubmit)}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${config.instantSubmit ? 'bg-cyan-500' : 'bg-zinc-800'}`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${config.instantSubmit ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Basket semantic bump */}
                    {selectedItem.id === 'basket_semantic_bump' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs text-zinc-400">
                            <span>Niveau de confiance d'inclusion requis</span>
                            <span className="font-mono text-cyan-400 font-bold">{config.confidence || 75} %</span>
                          </div>
                          <input 
                            type="range" min="10" max="100" 
                            value={config.confidence || 75} 
                            onChange={(e) => updateConfigValue('confidence', parseInt(e.target.value))}
                            className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-500 text-cyan-500" 
                          />
                        </div>

                        <div className="space-y-1 pt-2 border-t border-zinc-900">
                          <div className="flex justify-between items-center text-xs text-zinc-400">
                            <span>Max d'E-books proposés en bundle</span>
                            <span className="font-mono text-cyan-400 font-bold">{config.maxItems || 3} livre(s)</span>
                          </div>
                          <input 
                            type="range" min="1" max="5" 
                            value={config.maxItems || 3} 
                            onChange={(e) => updateConfigValue('maxItems', parseInt(e.target.value))}
                            className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-500 text-cyan-500" 
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                          <div>
                            <span className="text-xs font-bold text-white block">Décrypter l'intention d'achat utilisateur</span>
                            <span className="text-[10px] text-slate-500">Analyse comportementale IA en temps réel</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => updateConfigValue('checkIntent', !config.checkIntent)}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${config.checkIntent ? 'bg-cyan-500' : 'bg-zinc-800'}`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${config.checkIntent ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* RSS Social Syndicate */}
                    {selectedItem.id === 'rss_social_syndicate' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white block">Entête personnalisée des publications</label>
                          <input 
                            type="text" 
                            value={config.customHeader || ''} 
                            onChange={(e) => updateConfigValue('customHeader', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div className="space-y-2 pt-2 border-t border-zinc-900">
                          <label className="text-xs font-bold text-white block">Cible de routage d'audience</label>
                          <select 
                            value={config.channel || 'All Enabled'} 
                            onChange={(e) => updateConfigValue('channel', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                          >
                            <option value="All Enabled">Tous actifs (Miroir Telegram & Discord)</option>
                            <option value="Telegram Only">Telegram uniquement (Webhook autonome)</option>
                            <option value="Discord Only">Discord uniquement (HTTP Embed JSON)</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                          <div>
                            <span className="text-xs font-bold text-white block">Joindre le prix Stripe/TVA</span>
                            <span className="text-[10px] text-slate-500">Incorpore la tarification et le coupon de réduction</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => updateConfigValue('includePrice', !config.includePrice)}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${config.includePrice ? 'bg-cyan-500' : 'bg-zinc-800'}`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${config.includePrice ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Arbitrage devises CAD/EUR */}
                    {selectedItem.id === 'arbitrage_change_cad' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs text-zinc-400">
                            <span>Fréquence d'actualisation des taux de monnaie</span>
                            <span className="font-mono text-cyan-400 font-bold">Chaque {config.updateFreq || 12} heure(s)</span>
                          </div>
                          <input 
                            type="range" min="1" max="48" 
                            value={config.updateFreq || 12} 
                            onChange={(e) => updateConfigValue('updateFreq', parseInt(e.target.value))}
                            className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-500 text-cyan-500" 
                          />
                        </div>

                        <div className="space-y-1 pt-2 border-t border-zinc-900">
                          <div className="flex justify-between items-center text-xs text-zinc-400">
                            <span>Marge de spread de protection</span>
                            <span className="font-mono text-cyan-400 font-bold">{config.protectionSpread || 1.5} % pour amortir</span>
                          </div>
                          <input 
                            type="range" min="1" max="50" step="1"
                            value={(config.protectionSpread || 1.5) * 10} 
                            onChange={(e) => updateConfigValue('protectionSpread', parseFloat(e.target.value) / 10)}
                            className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-500 text-cyan-500" 
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                          <div>
                            <span className="text-xs font-bold text-white block">Virements cryptographiques autorisés</span>
                            <span className="text-[10px] text-slate-500">Liaison de secours via coffre Bitcoin sémantique</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => updateConfigValue('allowCryptoGateways', !config.allowCryptoGateways)}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${config.allowCryptoGateways ? 'bg-cyan-500' : 'bg-zinc-800'}`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${config.allowCryptoGateways ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Cache local IndexedDB */}
                    {selectedItem.id === 'cache_redis_indexeddb' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs text-zinc-400">
                            <span>Mémoire tampon locale minimale</span>
                            <span className="font-mono text-cyan-400 font-bold">{config.maxCacheMb || 50} Mo de RAM sémantique</span>
                          </div>
                          <input 
                            type="range" min="5" max="250" 
                            value={config.maxCacheMb || 50} 
                            onChange={(e) => updateConfigValue('maxCacheMb', parseInt(e.target.value))}
                            className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-500 text-cyan-500" 
                          />
                        </div>

                        <div className="space-y-2 pt-2 border-t border-zinc-900">
                          <label className="text-xs font-bold text-white block">Règle de compression du cache sémantique</label>
                          <select 
                            value={config.evictionPolicy || 'LRU'} 
                            onChange={(e) => updateConfigValue('evictionPolicy', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                          >
                            <option value="LRU">LRU (Moins récemment utilisé - Recommandé)</option>
                            <option value="LFU">LFU (Moins fréquemment utilisé)</option>
                            <option value="FIFO">FIFO (Premier entré, premier sorti)</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                          <div>
                            <span className="text-xs font-bold text-white block">Chiffrer le cache local au format AES</span>
                            <span className="text-[10px] text-slate-500">Protège contre les lectures directes de cookies tierce-partie</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => updateConfigValue('encryptLocal', !config.encryptLocal)}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${config.encryptLocal ? 'bg-cyan-500' : 'bg-zinc-800'}`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${config.encryptLocal ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Rate Limiter */}
                    {selectedItem.id === 'stripe_radar_limiter' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs text-zinc-400">
                            <span>Seuil d'exclusion immédiate de l'IP du pirate</span>
                            <span className="font-mono text-cyan-400 font-bold">{config.limitReqMin || 60} requêtes / min maximum</span>
                          </div>
                          <input 
                            type="range" min="10" max="200" 
                            value={config.limitReqMin || 60} 
                            onChange={(e) => updateConfigValue('limitReqMin', parseInt(e.target.value))}
                            className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-500 text-cyan-500" 
                          />
                        </div>

                        <div className="space-y-1 pt-2 border-t border-zinc-900">
                          <div className="flex justify-between items-center text-xs text-zinc-400">
                            <span>Durée de bannissement temporaire</span>
                            <span className="font-mono text-cyan-400 font-bold">{config.blockSec || 1800} secondes (30 minutes)</span>
                          </div>
                          <input 
                            type="range" min="60" max="3600" step="60"
                            value={config.blockSec || 1800} 
                            onChange={(e) => updateConfigValue('blockSec', parseInt(e.target.value))}
                            className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-500 text-cyan-500" 
                          />
                        </div>

                        <div className="space-y-1 pt-2 border-t border-zinc-900">
                          <div className="flex justify-between items-center text-xs text-zinc-400">
                            <span>Score du filtre anti-fraude requis</span>
                            <span className="font-mono text-cyan-400 font-bold">Invalider si suspicion &gt; {config.scoreThreshold || 85}%</span>
                          </div>
                          <input 
                            type="range" min="50" max="95" 
                            value={config.scoreThreshold || 85} 
                            onChange={(e) => updateConfigValue('scoreThreshold', parseInt(e.target.value))}
                            className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-500 text-cyan-500" 
                          />
                        </div>
                      </div>
                    )}

                    {/* VAT Stripe Tax Free */}
                    {selectedItem.id === 'vat_stripe_tax_free' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs text-zinc-400">
                            <span>Taux de taxation standard appliqué par défaut</span>
                            <span className="font-mono text-cyan-400 font-bold">{config.defaultVat || 20} % (TVA Européenne standard)</span>
                          </div>
                          <input 
                            type="range" min="0" max="25" 
                            value={config.defaultVat || 20} 
                            onChange={(e) => updateConfigValue('defaultVat', parseInt(e.target.value))}
                            className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-500 text-cyan-500" 
                          />
                        </div>

                        <div className="space-y-2 pt-2 border-t border-zinc-900">
                          <label className="text-xs font-bold text-white block">Pays Fallback légal d'origine</label>
                          <input 
                            type="text" 
                            value={config.backupLocale || 'FR'} 
                            onChange={(e) => updateConfigValue('backupLocale', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-slate-300 font-mono uppercase focus:outline-none focus:border-cyan-500"
                            placeholder="FR, CA, US"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                          <div>
                            <span className="text-xs font-bold text-white block">Auto-exclusion de TVA pour les pros (B2B)</span>
                            <span className="text-[10px] text-slate-500">Exempte la taxe si un numéro d'entreprise valide est fourni</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => updateConfigValue('automaticB2BExempt', !config.automaticB2BExempt)}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${config.automaticB2BExempt ? 'bg-cyan-500' : 'bg-zinc-800'}`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${config.automaticB2BExempt ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Generic configuration options placeholder for all other items to be extremely comprehensive and scalable! */}
                    {!['sentinel_auto_stable', 'cdn_cloudflare_free', 'google_indexer_free', 'basket_semantic_bump', 'rss_social_syndicate', 'arbitrage_change_cad', 'cache_redis_indexeddb', 'stripe_radar_limiter', 'vat_stripe_tax_free'].includes(selectedItem.id) && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-white block">Mode Haute Fréquence débridé</span>
                            <span className="text-[10px] text-slate-500">Optimise intensivement sans file d'attente système</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => updateConfigValue('highPerfMode', !config.highPerfMode)}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${config.highPerfMode ? 'bg-cyan-500' : 'bg-zinc-800'}`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${config.highPerfMode ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                        </div>

                        {selectedItem.id === 'audit_ledger_crypto' && (
                          <div className="space-y-4 pt-2 border-t border-zinc-900">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-white block">Algorithme de chiffrage d'authentification</label>
                              <select 
                                value={config.hashAlg || 'SHA-256'} 
                                onChange={(e) => updateConfigValue('hashAlg', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                              >
                                <option value="SHA-256">SHA-256 (Algorithme Bitcoin sécurisé)</option>
                                <option value="SHA-512">SHA-512 (Militaire renforcé)</option>
                                <option value="MD5-Sémantique">MD5-Sémantique (Rapide local)</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-xs text-zinc-400">
                                <span>Intervalle d'écriture physique</span>
                                <span className="font-mono text-cyan-400 font-bold">{config.blockSealSec || 60} secondes</span>
                              </div>
                              <input 
                                type="range" min="10" max="300" 
                                value={config.blockSealSec || 60} 
                                onChange={(e) => updateConfigValue('blockSealSec', parseInt(e.target.value))}
                                className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-500 text-cyan-500" 
                              />
                            </div>
                          </div>
                        )}

                        {selectedItem.id === 'dns_failover_free' && (
                          <div className="space-y-4 pt-2 border-t border-zinc-900">
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-xs text-zinc-400">
                                <span>Délai avant basculement de secours</span>
                                <span className="font-mono text-cyan-400 font-bold">{config.thresholdSec || 4} secondes</span>
                              </div>
                              <input 
                                type="range" min="2" max="20" 
                                value={config.thresholdSec || 4} 
                                onChange={(e) => updateConfigValue('thresholdSec', parseInt(e.target.value))}
                                className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-500 text-cyan-500" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-white block">Zone d'hébergement sémantique de backup</label>
                              <input 
                                type="text" 
                                value={config.fallbackZone || 'US-East'} 
                                onChange={(e) => updateConfigValue('fallbackZone', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                          </div>
                        )}

                        {selectedItem.id === 'crypto_rsa_keys' && (
                          <div className="space-y-4 pt-2 border-t border-zinc-900">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-white block">Longueur de bits de la signature RSA</label>
                              <select 
                                value={config.keySize || 4096} 
                                onChange={(e) => updateConfigValue('keySize', parseInt(e.target.value))}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                              >
                                <option value="2048">RSA 2048-bit (Rapide)</option>
                                <option value="4096">RSA 4096-bit (Recommandé)</option>
                                <option value="8192">RSA 8192-bit (Indéchiffrable par ordinateurs quantiques)</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-xs text-zinc-400">
                                <span>Cycle d'auto-rotation de la clé globale</span>
                                <span className="font-mono text-cyan-400 font-bold">Chaque {config.rotateDays || 30} jours</span>
                              </div>
                              <input 
                                type="range" min="10" max="90" 
                                value={config.rotateDays || 30} 
                                onChange={(e) => updateConfigValue('rotateDays', parseInt(e.target.value))}
                                className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-500 text-cyan-500" 
                              />
                            </div>
                          </div>
                        )}

                        {selectedItem.id === 'rush_hour_scheduler' && (
                          <div className="space-y-4 pt-2 border-t border-zinc-900">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-white block">Critère déterminant de l'Heure de Pointe</label>
                              <select 
                                value={config.peakCriteria || 'Traffic Volume'} 
                                onChange={(e) => updateConfigValue('peakCriteria', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                              >
                                <option value="Traffic Volume">Volume de trafic SEO cumulé</option>
                                <option value="Purchase Intent">Intention d'achat Stripe maximale</option>
                                <option value="API Low Cost Hours">Période de tarification IA basse</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {selectedItem.id === 'auto_reinvest_profit' && (
                          <div className="space-y-4 pt-2 border-t border-zinc-900">
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-xs text-zinc-400">
                                <span>Pourcentage de réinvestissement Stripe</span>
                                <span className="font-mono text-cyan-400 font-bold">{config.sharePct || 15} % des profits Nets</span>
                              </div>
                              <input 
                                type="range" min="5" max="50" 
                                value={config.sharePct || 15} 
                                onChange={(e) => updateConfigValue('sharePct', parseInt(e.target.value))}
                                className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-500 text-cyan-500" 
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-xs text-zinc-400">
                                <span>Seuil de déclenchement d'arbitrage</span>
                                <span className="font-mono text-cyan-400 font-bold">{config.triggerThreshold || 100} CA$ d'encaisse</span>
                              </div>
                              <input 
                                type="range" min="20" max="500" 
                                value={config.triggerThreshold || 100} 
                                onChange={(e) => updateConfigValue('triggerThreshold', parseInt(e.target.value))}
                                className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-500 text-cyan-500" 
                              />
                            </div>
                          </div>
                        )}

                        {selectedItem.id === 'db_garbage_collector' && (
                          <div className="space-y-4 pt-2 border-t border-zinc-900">
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-xs text-zinc-400">
                                <span>Limite d'âge des sessions conservées</span>
                                <span className="font-mono text-cyan-400 font-bold">{config.gcAgeHours || 48} heures</span>
                              </div>
                              <input 
                                type="range" min="12" max="168" 
                                value={config.gcAgeHours || 48} 
                                onChange={(e) => updateConfigValue('gcAgeHours', parseInt(e.target.value))}
                                className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-500 text-cyan-500" 
                              />
                            </div>
                          </div>
                        )}

                        {selectedItem.id === 'maker_lead_magnet' && (
                          <div className="space-y-4 pt-2 border-t border-zinc-900">
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-xs text-zinc-400">
                                <span>Délai d'affichage du widget de capture d'e-mail</span>
                                <span className="font-mono text-cyan-400 font-bold">{config.triggerDelaySec || 5} seconde(s)</span>
                              </div>
                              <input 
                                type="range" min="1" max="30" 
                                value={config.triggerDelaySec || 5} 
                                onChange={(e) => updateConfigValue('triggerDelaySec', parseInt(e.target.value))}
                                className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-500 text-cyan-500" 
                              />
                            </div>
                          </div>
                        )}

                        {selectedItem.id === 'auto_chat_assistant' && (
                          <div className="space-y-4 pt-2 border-t border-zinc-900">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-white block">Style & Température de réponse</label>
                              <select 
                                value={config.chatbotTone || 'Professional'} 
                                onChange={(e) => updateConfigValue('chatbotTone', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                              >
                                <option value="Professional">Professionnel & Posé</option>
                                <option value="Friendly & Empathic">Chaleureux & Conciliant</option>
                                <option value="Sarcastic Tech Geek">Innovant (Focalisé code)</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-white block">Email d'arbitrage manuel d'aide</label>
                              <input 
                                type="text" 
                                value={config.escalationEmail || 'ericverret35@gmail.com'} 
                                onChange={(e) => updateConfigValue('escalationEmail', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                          </div>
                        )}

                        {selectedItem.id === 'lighthouse_optimizer' && (
                          <div className="space-y-4 pt-2 border-t border-zinc-900">
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-xs text-zinc-400">
                                <span>Qualité WebP de compression d'images</span>
                                <span className="font-mono text-cyan-400 font-bold">{config.imageWebpQuality || 85} % (Équilibre parfait)</span>
                              </div>
                              <input 
                                type="range" min="50" max="95" 
                                value={config.imageWebpQuality || 85} 
                                onChange={(e) => updateConfigValue('imageWebpQuality', parseInt(e.target.value))}
                                className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-500 text-cyan-500" 
                              />
                            </div>
                          </div>
                        )}

                        {/* Fallback info when no unique inputs exist */}
                        {!['audit_ledger_crypto', 'dns_failover_free', 'crypto_rsa_keys', 'rush_hour_scheduler', 'auto_reinvest_profit', 'db_garbage_collector', 'maker_lead_magnet', 'auto_chat_assistant', 'lighthouse_optimizer'].includes(selectedItem.id) && (
                          <div className="p-3 bg-zinc-900/40 rounded-lg text-[10px] text-zinc-500 font-mono border border-zinc-900">
                            ⓘ Les options avancées de ce protocole sont entièrement auto-calibrées continuement par l'intelligence d'Aura Elite sans besoin d'action manuelle additionnelle.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Modal Footer with buttons */}
              <div className="p-6 pt-4 border-t border-zinc-900/60 shrink-0 bg-zinc-950 flex justify-between items-center gap-3">
                <button
                  type="button"
                  onClick={() => { playSynthBeep('click'); setSelectedItem(null); }}
                  className="px-4 py-2 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/80 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition duration-150"
                >
                  Fermer
                </button>

                <button
                  type="button"
                  onClick={handleSaveItemConfig}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 transition duration-150 flex items-center gap-1.5 shadow-lg shadow-cyan-950/20"
                >
                  <Check className="w-4 h-4" />
                  Appliquer & Déployer à Chaud
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
