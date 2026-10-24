import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Users,
  Search,
  Settings,
  Flame,
  CheckCircle,
  Send,
  Sliders,
  Globe,
  Plus,
  Trash2,
  RefreshCw,
  Clock,
  ArrowRight,
  TrendingUp,
  Link,
  ShieldCheck,
  Megaphone,
  Bell,
  Cpu,
  Bookmark,
  Check
} from 'lucide-react';
import { PlatformState, FourPillarsConfig, ScrapedLead } from '../types';
import { apiFetch } from '../utils';

interface FourPillarsTabProps {
  state: PlatformState;
  onUpdateState: (newState: PlatformState) => void;
  playSynthBeep: (type: 'success' | 'warn' | 'revenue' | 'click') => void;
}

export default function FourPillarsTab({ state, onUpdateState, playSynthBeep }: FourPillarsTabProps) {
  // Use server state or robust initial fallback
  const config = state.fourPillarsConfig || {
    enabled: true,
    leadScraperEnabled: true,
    leadScraperVelocity: 'aggressive',
    targetIndustries: ['Marketing', 'SaaS', 'E-commerce', 'AI Tools', 'Monétisation'],
    targetCountries: ['Canada', 'France', 'Belgique', 'Suisse', 'États-Unis'],
    scrapedLeads: [],
    seoFunnelEnabled: true,
    targetKeywords: ['monétisation automatique', 'stripe checkout seo', 'arbitrage sémantique', 'profits affiliation'],
    upsellServiceName: 'Aura Elite Monetization API Suite',
    backlinkExchangeEnabled: true,
    articleTargetLength: 'deep',
    stripeGatewayEnabled: true,
    customStripePricingUrl: 'https://checkout.stripe.com/p/trial_aura_elite',
    monthlySubscriptionPrice: 249.00,
    autoDiscountCode: 'AURA_PROD_10',
    autoDiscountPercent: 10,
    socialBotEnabled: true,
    telegramChatId: '8347143768',
    telegramToken: '8720627366:AAEReEHj94XdIkVh0L0nlBYrFp34jieqdSg',
    discordWebhook: 'https://discord.com/api/webhooks/1510009297029959941/r48LjXKzPO6Bjlk2L-zUEqfIzk3ziZR24wdZMgk3RVPV7zhw5cJhtfaIgBJAV7R5VfVv',
    botFrequency: 'realtime'
  };

  // State bindings
  const [enabled, setEnabled] = useState<boolean>(config.enabled ?? true);
  const [leadScraperEnabled, setLeadScraperEnabled] = useState<boolean>(config.leadScraperEnabled ?? true);
  const [leadScraperVelocity, setLeadScraperVelocity] = useState<'normal' | 'aggressive'>(config.leadScraperVelocity ?? 'aggressive');
  const [targetIndustries, setTargetIndustries] = useState<string[]>(config.targetIndustries ?? []);
  const [targetCountries, setTargetCountries] = useState<string[]>(config.targetCountries ?? []);
  
  const [seoFunnelEnabled, setSeoFunnelEnabled] = useState<boolean>(config.seoFunnelEnabled ?? true);
  const [targetKeywords, setTargetKeywords] = useState<string[]>(config.targetKeywords ?? []);
  const [upsellServiceName, setUpsellServiceName] = useState<string>(config.upsellServiceName ?? '');
  const [backlinkExchangeEnabled, setBacklinkExchangeEnabled] = useState<boolean>(config.backlinkExchangeEnabled ?? true);
  const [articleTargetLength, setArticleTargetLength] = useState<'short' | 'medium' | 'deep'>(config.articleTargetLength ?? 'deep');

  const [stripeGatewayEnabled, setStripeGatewayEnabled] = useState<boolean>(config.stripeGatewayEnabled ?? true);
  const [customStripePricingUrl, setCustomStripePricingUrl] = useState<string>(config.customStripePricingUrl ?? '');
  const [monthlySubscriptionPrice, setMonthlySubscriptionPrice] = useState<number>(config.monthlySubscriptionPrice ?? 249.00);
  const [autoDiscountCode, setAutoDiscountCode] = useState<string>(config.autoDiscountCode ?? '');
  const [autoDiscountPercent, setAutoDiscountPercent] = useState<number>(config.autoDiscountPercent ?? 10);

  const [socialBotEnabled, setSocialBotEnabled] = useState<boolean>(config.socialBotEnabled ?? true);
  const [telegramChatId, setTelegramChatId] = useState<string>(config.telegramChatId ?? '8347143768');
  const [telegramToken, setTelegramToken] = useState<string>(config.telegramToken ?? '8720627366:AAEReEHj94XdIkVh0L0nlBYrFp34jieqdSg');
  const [discordWebhook, setDiscordWebhook] = useState<string>(config.discordWebhook ?? '');
  const [botFrequency, setBotFrequency] = useState<'realtime' | 'hourly' | 'daily'>(config.botFrequency ?? 'realtime');

  // Input states helpers
  const [newIndustry, setNewIndustry] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  // Status flags
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [simulatingTick, setSimulatingTick] = useState<boolean>(false);

  // Stats derived from platform state
  const scrapedLeadsCount = config.scrapedLeads?.length ?? 0;
  const convertedLeadsCount = config.scrapedLeads?.filter(l => l.status === 'converted').length ?? 0;
  const totalOfferedValue = config.scrapedLeads?.reduce((acc, current) => acc + (current.valueProposed || 0), 0) ?? 0;

  // Handle adding list tags
  const handleAddIndustry = () => {
    if (newIndustry.trim() && !targetIndustries.includes(newIndustry.trim())) {
      setTargetIndustries([...targetIndustries, newIndustry.trim()]);
      setNewIndustry('');
      playSynthBeep('click');
    }
  };

  const handleRemoveIndustry = (index: number) => {
    setTargetIndustries(targetIndustries.filter((_, i) => i !== index));
    playSynthBeep('click');
  };

  const handleAddCountry = () => {
    if (newCountry.trim() && !targetCountries.includes(newCountry.trim())) {
      setTargetCountries([...targetCountries, newCountry.trim()]);
      setNewCountry('');
      playSynthBeep('click');
    }
  };

  const handleRemoveCountry = (index: number) => {
    setTargetCountries(targetCountries.filter((_, i) => i !== index));
    playSynthBeep('click');
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !targetKeywords.includes(newKeyword.trim())) {
      setTargetKeywords([...targetKeywords, newKeyword.trim()]);
      setNewKeyword('');
      playSynthBeep('click');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setTargetKeywords(targetKeywords.filter((_, i) => i !== index));
    playSynthBeep('click');
  };

  // POST save config
  const handleSaveConfig = async (overrideEnabled?: boolean) => {
    setIsLoading(true);
    setSavedSuccess(false);
    try {
      const activeEnabled = overrideEnabled !== undefined ? overrideEnabled : enabled;
      const res = await apiFetch('/api/four-pillars/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled: activeEnabled,
          leadScraperEnabled,
          leadScraperVelocity,
          targetIndustries,
          targetCountries,
          seoFunnelEnabled,
          targetKeywords,
          upsellServiceName,
          backlinkExchangeEnabled,
          articleTargetLength,
          stripeGatewayEnabled,
          customStripePricingUrl,
          monthlySubscriptionPrice,
          autoDiscountCode,
          autoDiscountPercent,
          socialBotEnabled,
          telegramChatId,
          telegramToken,
          discordWebhook,
          botFrequency
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.state) {
          onUpdateState(data.state);
          setSavedSuccess(true);
          playSynthBeep('success');
          setTimeout(() => setSavedSuccess(false), 3000);
        }
      }
    } catch (e) {
      console.error(e);
      playSynthBeep('warn');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle master switch instantly
  const handleMasterToggle = async () => {
    const nextVal = !enabled;
    setEnabled(nextVal);
    playSynthBeep(nextVal ? 'success' : 'warn');
    await handleSaveConfig(nextVal);
  };

  // Post simulate standard interval tick
  const triggerSimulationManual = async () => {
    setSimulatingTick(true);
    try {
      const res = await apiFetch('/api/simulate-tick', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.state) {
          onUpdateState(data.state);
          playSynthBeep('revenue');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSimulatingTick(false);
    }
  };

  // Calculate lead sources breakdown
  const sourceCounts = (config.scrapedLeads || []).reduce((acc: Record<string, number>, curr: any) => {
    acc[curr.source] = (acc[curr.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6" id="four-pillars-tab">
      {/* Dynamic Aura Acquisition Header */}
      <div className="bg-gradient-to-r from-gray-950 via-slate-900 to-gray-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase">Matrice d'Acquisition Souveraine</span>
            </div>
            <h1 className="text-2xl font-sans font-semibold text-slate-100 tracking-tight">
              Les 4 Piliers Client
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1 leading-relaxed">
              Autonomie intégrale de A à Z. Aura orchestre votre prospection outbound, déploie desentonnoirs sémantiques, héberge ses checkouts Stripe et diffuse les victoires pour conquérir sans effort de vrais clients.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Simulation manual stim */}
            <button
              onClick={triggerSimulationManual}
              disabled={simulatingTick || !enabled}
              className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase border flex items-center gap-2 transition-all ${
                enabled 
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 active:scale-95 cursor-pointer' 
                  : 'border-slate-800 bg-slate-900/50 text-slate-500 cursor-not-allowed'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${simulatingTick ? 'animate-spin' : ''}`} />
              {simulatingTick ? 'Exécution du Cycle...' : 'Déclencher Cycle Aura'}
            </button>

            {/* Master on/off toggle key */}
            <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl">
              <span className="text-xs font-mono tracking-wider uppercase text-slate-300">Statut Robot :</span>
              <button
                onClick={handleMasterToggle}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  enabled ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-xs font-bold tracking-wider uppercase ${enabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                {enabled ? 'ACTIF (RÉEL)' : 'OFF'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 Pillars Performance Stats Bar with Interactive Bubble Details & Options */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Card 1: Statut du Tunnel */}
        <div className={`relative group cursor-help bg-gradient-to-br ${enabled ? 'from-emerald-500/10 to-transparent' : 'from-slate-800/10 to-transparent'} bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col justify-between shadow-md space-y-3 transition-all hover:border-emerald-500/40`}>
          
          {/* Tooltip Content */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[104%] mb-2 w-64 bg-slate-900 border border-slate-800/90 p-3 rounded-xl shadow-2xl text-[11px] opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 text-slate-300 leading-relaxed font-sans">
            <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              PILIER 1: STATUT DU TUNNEL
            </div>
            Gère l'état global de l'algorithme d'acquisition d'Aura. Lorsque l'interrupteur est **actif**, Aura lance les extracteurs sémantiques de prospects dans les géo-niches choisies et génère automatiquement du contenu de conversion sur Plume.
            <div className="text-[9px] text-emerald-500 mt-2 border-t border-slate-800 pt-1 font-mono">
              Statut: {enabled ? 'CRAWLER ACTIF' : 'PAUSÉ'} • Mode de Vitesse intelligent
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 font-bold flex items-center gap-1">
                1. Statut du Tunnel <span className="text-slate-600">(ℹ️)</span>
              </span>
              <div className={`text-sm font-mono font-bold mt-1 flex items-center gap-1.5 ${enabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                <span className={`h-2 w-2 rounded-full ${enabled ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`}></span>
                {enabled ? 'RECHERCHE ACTIVE' : 'TUNNEL EN PAUSE'}
              </div>
            </div>
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
              <Cpu className={`w-4 h-4 ${enabled ? 'text-emerald-400' : 'text-slate-500'}`} />
            </div>
          </div>
          
          <div className="text-[10px] space-y-1 text-slate-400 border-t border-slate-900/50 pt-2 font-sans select-none">
            <div className="flex justify-between">
              <span>Sourcing Automatique:</span>
              <span className={`font-mono font-bold ${leadScraperEnabled ? 'text-blue-400' : 'text-slate-500'}`}>
                {leadScraperEnabled ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Niches actives:</span>
              <span className="font-mono text-slate-300 font-semibold">{targetIndustries.length} secteurs</span>
            </div>
          </div>

          <div className="bg-slate-900/85 border border-slate-800 p-1.5 rounded-lg flex items-center justify-between gap-1">
            <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">Vitesse :</span>
            <div className="flex gap-1 justify-end flex-grow">
              <button
                type="button"
                onClick={() => {
                  setLeadScraperVelocity('normal');
                  playSynthBeep('click');
                }}
                className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-all uppercase ${
                  leadScraperVelocity === 'normal'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-500 hover:text-slate-400'
                }`}
              >
                Stable
              </button>
              <button
                type="button"
                onClick={() => {
                  setLeadScraperVelocity('aggressive');
                  playSynthBeep('click');
                }}
                className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-all uppercase ${
                  leadScraperVelocity === 'aggressive'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold animate-pulse'
                    : 'text-slate-500 hover:text-slate-400'
                }`}
              >
                Agressif
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Prospects Identifiés */}
        <div className={`relative group cursor-help bg-gradient-to-br from-blue-500/10 to-transparent bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col justify-between shadow-md space-y-3 transition-all hover:border-blue-550`}>
          
          {/* Tooltip Content */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[104%] mb-2 w-64 bg-slate-900 border border-slate-800/90 p-3 rounded-xl shadow-2xl text-[11px] opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 text-slate-300 leading-relaxed font-sans">
            <div className="font-bold text-blue-400 mb-1 flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
              PILIER 2: SOURCING SÉMANTIQUE DE LEADS
            </div>
            Indique le volume total de prospects B2B extraits en temps réel. Aura valide les profils via l'API, vérifie l'existence légale de l'adresse email et l'injecte dans le cycle automatique de rédaction.
            <div className="text-[9px] text-blue-400 mt-2 border-t border-slate-800 pt-1 font-mono">
              Focalisé : {targetCountries?.join(', ')} • {targetIndustries?.join(', ')}
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 font-bold flex items-center gap-1">
                2. Prospects Identifiés <span className="text-slate-600">(ℹ️)</span>
              </span>
              <div className="text-sm font-mono font-bold mt-1 text-blue-400">
                {scrapedLeadsCount} leads capturés
              </div>
            </div>
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
              <Users className="w-4 h-4 text-blue-400" />
            </div>
          </div>

          <div className="text-[10px] space-y-0.5 text-slate-400 border-t border-slate-900/50 pt-2 font-sans select-none">
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 font-mono text-[9px] text-slate-500">
              <div className="flex justify-between">
                <span>LinkedIn:</span>
                <span className="text-slate-300 font-bold">{sourceCounts['LinkedIn'] || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>G. Maps:</span>
                <span className="text-slate-300 font-bold">{sourceCounts['GoogleMaps'] || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>IndieH:</span>
                <span className="text-slate-300 font-bold">{sourceCounts['IndieHackers'] || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>GitHub:</span>
                <span className="text-slate-300 font-bold">{sourceCounts['GitHub'] || 0}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setLeadScraperEnabled(!leadScraperEnabled);
                playSynthBeep('click');
              }}
              className={`flex-1 py-1 rounded text-[8px] font-mono font-bold tracking-wider text-center border uppercase transition-all whitespace-nowrap cursor-pointer ${
                leadScraperEnabled
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              {leadScraperEnabled ? '⏸ Pause' : '▶ Activer'}
            </button>
            <button
              type="button"
              onClick={async () => {
                playSynthBeep('revenue');
                try {
                  const names = ['Tremblay Solutions', 'Mylène Coderre', 'Jean-Philippe Landry', 'Optima Web Corp', 'Sébastien Gagnon', 'Studio Québec SaaS'];
                  const industries = targetIndustries.length > 0 ? targetIndustries : ['Marketing', 'E-commerce'];
                  const selectedInd = industries[Math.floor(Math.random() * industries.length)];
                  const chosenName = names[Math.floor(Math.random() * names.length)];
                  const newTestLead = {
                    id: `test-lead-manual-${Date.now()}`,
                    name: chosenName,
                    email: `contact@${chosenName.toLowerCase().replace(/ /g, '')}.ca`,
                    company: `${chosenName} & Co.`,
                    source: (['LinkedIn', 'GoogleMaps', 'GitHub', 'IndieHackers'] as const)[Math.floor(Math.random() * 4)],
                    industry: selectedInd,
                    date: new Date().toISOString(),
                    status: 'scraped' as const,
                    pitchSentiment: 'Généré via démo instantanée dans la bulle d\'options.',
                    valueProposed: monthlySubscriptionPrice
                  };

                  const currentLeads = config.scrapedLeads ? [...config.scrapedLeads] : [];
                  currentLeads.unshift(newTestLead);

                  const res = await apiFetch('/api/four-pillars/config', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      ...config,
                      scrapedLeads: currentLeads
                    })
                  });
                  if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.state) {
                      onUpdateState(data.state);
                    }
                  }
                } catch (err) {
                  console.error(err);
                }
              }}
              className="flex-grow py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded text-[8px] font-mono tracking-wider text-center uppercase transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-0.5"
            >
              <Plus className="w-2.5 h-2.5 text-blue-400" />
              + Lead Test
            </button>
          </div>
        </div>

        {/* Card 3: Conversions Stripe & Facturation */}
        <div className={`relative group cursor-help bg-gradient-to-br from-purple-500/10 to-transparent bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col justify-between shadow-md space-y-3 transition-all hover:border-purple-550`}>
          
          {/* Tooltip Content - Enhanced */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[104%] mb-2 w-72 bg-slate-900 border border-slate-800/90 p-4 rounded-xl shadow-2xl text-[11px] opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 text-slate-300 leading-relaxed font-sans cursor-default">
            <div className="font-bold text-purple-400 mb-2 flex items-center gap-1.5 font-mono uppercase">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
              PILIER 3: CONVERSIONS & FACTURATION
            </div>
            <p className="mb-2">Gère le workflow Stripe Checkout et la facturation EFT. Configurez les gateways de paiement, gérez les abonnements récurrents et surveillez le taux de conversion en temps réel.</p>
            <div className="text-[9px] text-purple-400 mt-2 border-t border-slate-800 pt-2 font-mono flex gap-2">
              <span>Gateway: {stripeGatewayEnabled ? 'ACTIVE' : 'OFF'}</span>
              <span>•</span>
              <span>Intégration: {customStripePricingUrl ? 'CONFIGURÉE' : 'REQUISE'}</span>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 font-bold flex items-center gap-1">
                3. Facturation Stripe & EFT <span className="text-slate-600">(ℹ️)</span>
              </span>
              <div className="text-sm font-mono font-bold mt-1 text-purple-400">
                {convertedLeadsCount} clients actifs
              </div>
            </div>
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
              <CheckCircle className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          {/* ... Rest of interactions ... */}
          <div className="text-[10px] space-y-1 text-slate-400 border-t border-slate-900/50 pt-2 font-sans select-none">
            <div className="flex justify-between text-[9px] font-mono">
              <span>Taux de réussite :</span>
              <span className="text-purple-300 font-bold">
                {scrapedLeadsCount > 0 ? ((convertedLeadsCount / scrapedLeadsCount) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, scrapedLeadsCount > 0 ? (convertedLeadsCount / scrapedLeadsCount) * 100 : 0)}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setStripeGatewayEnabled(!stripeGatewayEnabled);
                playSynthBeep('click');
              }}
              className={`flex-1 py-1 rounded text-[8px] font-mono font-bold tracking-wider text-center border uppercase transition-all cursor-pointer ${
                stripeGatewayEnabled
                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              Gateway: {stripeGatewayEnabled ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={async () => {
                playSynthBeep('revenue');
                try {
                  const res = await apiFetch('/api/simulate-tick', { method: 'POST' });
                  if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.state) {
                      onUpdateState(data.state);
                    }
                  }
                } catch (e) {
                  console.error(e);
                }
              }}
              className="flex-grow py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded text-[8px] font-mono tracking-wider text-center uppercase transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-0.5"
            >
              <Flame className="w-2.5 h-2.5 text-purple-400" />
              Simuler Vente
            </button>
          </div>
        </div>

        {/* Card 4: Revenus Additionnels MRR */}
        <div className="relative group cursor-help bg-gradient-to-br from-teal-500/10 to-transparent bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col justify-between shadow-md space-y-3 transition-all hover:border-teal-550">
          
          {/* Tooltip Content */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[104%] mb-2 w-64 bg-slate-900 border border-slate-800/90 p-3 rounded-xl shadow-2xl text-[11px] opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 text-slate-300 leading-relaxed font-sans font-normal">
            <div className="font-bold text-teal-400 mb-1 flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"></span>
              PILIER 4: REVENUS SÉMANTIQUES (MRR)
            </div>
            Calcule le montant mensuel récurrent théorique cumulé. Chaque client validé s'abonne à votre offre sémantique standard au prix défini ci-dessous. Les remises par coupon s'appliquent automatiquement sur les simulations de signature.
            <div className="text-[9px] text-teal-400 mt-2 border-t border-slate-800 pt-1 font-mono">
              Base: {monthlySubscriptionPrice} CA$/mois • Code: {autoDiscountCode || 'AURA_PROD_10'}
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 font-bold flex items-center gap-1">
                4. Revenus MRR <span className="text-slate-600">(ℹ️)</span>
              </span>
              <div className="text-sm font-mono font-bold mt-1 text-teal-400">
                {(convertedLeadsCount * monthlySubscriptionPrice).toFixed(2)} CA$/m
              </div>
            </div>
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
              <TrendingUp className="w-4 h-4 text-teal-400" />
            </div>
          </div>

          <div className="text-[10px] space-y-0.5 text-slate-400 border-t border-slate-900/50 pt-2 font-sans select-none">
            <div className="flex justify-between">
              <span>Prix d'Abonnement standard:</span>
              <span className="font-mono text-teal-300 font-bold">{monthlySubscriptionPrice.toFixed(2)} CA$</span>
            </div>
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>Code Coupon sémantique:</span>
              <span className="font-mono text-slate-400">{autoDiscountCode || 'AURA_PROD_10'} (-{autoDiscountPercent}%)</span>
            </div>
          </div>

          <div className="bg-slate-900/85 border border-slate-800 p-1 rounded-lg flex items-center justify-between gap-1">
            <span className="text-[8px] font-mono uppercase tracking-wider text-slate-500">Ajuster :</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  const nextPrice = Math.max(10, monthlySubscriptionPrice - 10);
                  setMonthlySubscriptionPrice(nextPrice);
                  playSynthBeep('click');
                }}
                className="w-4 h-4 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 flex items-center justify-center font-mono text-[10px] text-slate-300 hover:text-white cursor-pointer active:scale-90"
              >
                -
              </button>
              <span className="text-[9px] font-mono font-bold text-slate-200">{monthlySubscriptionPrice} CA$</span>
              <button
                type="button"
                onClick={() => {
                  const nextPrice = monthlySubscriptionPrice + 10;
                  setMonthlySubscriptionPrice(nextPrice);
                  playSynthBeep('click');
                }}
                className="w-4 h-4 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 flex items-center justify-center font-mono text-[10px] text-slate-300 hover:text-white cursor-pointer active:scale-90"
              >
                +
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Primary configuration columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pilar 1 : Lead scraping Sourcing Engine */}
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-900">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold font-mono text-xs border border-blue-500/20">1</span>
                <div>
                  <h2 className="text-sm font-semibold text-slate-200">Sourcing de Prospects Automatique</h2>
                  <p className="text-[10px] text-slate-500">Extraction, enrichissement et cold-emailing</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLeadScraperEnabled(!leadScraperEnabled)}
                  className={`text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded border transition-all ${
                    leadScraperEnabled 
                      ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' 
                      : 'border-slate-800 bg-slate-900 text-slate-500'
                  }`}
                >
                  {leadScraperEnabled ? 'Actif' : 'Désactivé'}
                </button>
              </div>
            </div>

            {/* Velocity control & inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group cursor-help">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
                  Fréquence de Recherche <span className="text-blue-500 animate-pulse font-bold hover:text-blue-400">(ℹ️)</span>
                </label>
                {/* Tooltip */}
                <div className="absolute left-0 bottom-[104%] mb-1 hidden group-hover:block w-56 bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl text-[10px] text-slate-300 z-40 leading-normal pointer-events-none">
                  <span className="font-bold text-blue-400 block border-b border-slate-800 pb-1 mb-1">⚡️ VITESSE DE SCRAPING</span>
                  • <span className="text-white font-bold">Stable</span> : Requêtes régulières espacées pour maintenir les quotas de délivrabilité mails stables.<br />
                  • <span className="text-white font-bold">Agressive</span> : Extraction ultra-rapide maximisant la vitesse de réponse brute.
                </div>
                <select
                  value={leadScraperVelocity}
                  onChange={(e) => setLeadScraperVelocity(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="normal">Stable (Standard)</option>
                  <option value="aggressive">Agressive (Vitesse Max)</option>
                </select>
              </div>
              
              <div className="relative group cursor-help">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
                  Rédacteur Cold-Email <span className="text-blue-500 animate-pulse font-bold hover:text-blue-400">(ℹ️)</span>
                </label>
                {/* Tooltip */}
                <div className="absolute right-0 bottom-[104%] mb-1 hidden group-hover:block w-56 bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl text-[10px] text-slate-300 z-40 leading-normal pointer-events-none">
                  <span className="font-bold text-blue-400 block border-b border-slate-800 pb-1 mb-1">✍️ PLUME EXPERT ENGINE</span>
                  Générateur de pitch sémantique propulsé par Gemini AI. Il analyse l'activité réelle du prospect pour concevoir une offre personnalisée à taux de conversion maximal de fakes.
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 font-mono flex items-center justify-between">
                  <span>Agent Plume Copilot</span>
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                </div>
              </div>
            </div>

            {/* Target industries tags editor */}
            <div className="relative group cursor-help">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block flex items-center gap-1">
                  Niches Cibles Secteurs <span className="text-blue-500 animate-pulse font-bold hover:text-blue-400">(ℹ️)</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setTargetIndustries(['Marketing', 'SaaS', 'E-commerce', 'AI Tools', 'Monétisation']);
                    playSynthBeep('success');
                  }}
                  className="text-[9px] font-mono text-blue-500 hover:text-blue-400 underline transition-all cursor-pointer"
                >
                  Restaurer les 5 niches
                </button>
              </div>
              {/* Tooltip */}
              <div className="absolute left-0 bottom-[104%] mb-1 hidden group-hover:block w-64 bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl text-[10px] text-slate-300 z-40 leading-normal pointer-events-none">
                <span className="font-bold text-blue-400 block border-b border-slate-800 pb-1 mb-1">🎯 VERTICALES SÉLECTIONNÉES</span>
                Limites thématiques de prospection. Aura restreint le balayage automatisé à ces industries spécifiques pour assurer la pertinence de l'argumentaire.
              </div>
              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-900 border border-slate-800 rounded-lg min-h-[44px]">
                {targetIndustries.map((ind, i) => (
                  <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
                    {ind}
                    <button type="button" onClick={() => handleRemoveIndustry(i)} className="hover:text-red-400 cursor-pointer"><Trash2 className="w-2.5 h-2.5" /></button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="+ Secteur"
                  value={newIndustry}
                  onChange={(e) => setNewIndustry(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddIndustry()}
                  className="bg-transparent text-[10px] font-mono focus:outline-none text-slate-300 min-w-[70px] flex-grow font-semibold"
                />
              </div>
            </div>

            {/* Target Countries fields */}
            <div className="relative group cursor-help">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block flex items-center gap-1">
                  Géographies Cibles <span className="text-blue-500 animate-pulse font-bold hover:text-blue-400">(ℹ️)</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setTargetCountries(['Canada', 'France', 'Belgique', 'Suisse', 'États-Unis']);
                    playSynthBeep('success');
                  }}
                  className="text-[9px] font-mono text-blue-500 hover:text-blue-400 underline transition-all cursor-pointer"
                >
                  Restaurer les pays
                </button>
              </div>
              {/* Tooltip */}
              <div className="absolute left-0 bottom-[104%] mb-1 hidden group-hover:block w-64 bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl text-[10px] text-slate-300 z-40 leading-normal pointer-events-none font-sans font-normal">
                <span className="font-bold text-blue-400 block border-b border-slate-800 pb-1 mb-1">🌍 GÉOGRAPHIES ACTIVES</span>
                Pays de recherche des entreprises. Permet d'adapter automatiquement le ton de rédaction de l'Agent Plume et l'heure locale lors de l'outbound.
              </div>
              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-900 border border-slate-800 rounded-lg min-h-[44px]">
                {targetCountries.map((country, i) => (
                  <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
                    {country}
                    <button type="button" onClick={() => handleRemoveCountry(i)} className="hover:text-red-400 cursor-pointer"><Trash2 className="w-2.5 h-2.5" /></button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="+ Pays de ciblage"
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCountry()}
                  className="bg-transparent text-[10px] font-mono focus:outline-none text-slate-300 min-w-[70px] flex-grow font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="text-[10px] font-sans text-slate-500 mt-4 leading-relaxed">
            💡 <span className="text-slate-400">Pace des 4 Piliers :</span> Le robot crawler recherche activement de nouvelles opportunités d'affaires d'après les géo-niches choisies, prépare des arguments de vente calibrés, et déclenche le premier contact sémantique.
          </div>
        </div>

        {/* Pillar 2 : Entonnoir & SEO Content Synergist */}
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-900">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold font-mono text-xs border border-purple-500/20">2</span>
                <div>
                  <h2 className="text-sm font-semibold text-slate-200">Plume & SEO Conversion Tunnel</h2>
                  <p className="text-[10px] text-slate-500">Upselling de services par contenu sémantique</p>
                </div>
              </div>
              <button
                onClick={() => setSeoFunnelEnabled(!seoFunnelEnabled)}
                className={`text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded border transition-all ${
                  seoFunnelEnabled 
                    ? 'border-purple-500/30 bg-purple-500/10 text-purple-400' 
                    : 'border-slate-800 bg-slate-900 text-slate-500'
                }`}
              >
                {seoFunnelEnabled ? 'Actif' : 'Désactivé'}
              </button>
            </div>

            {/* Custom upsell service definition */}
            <div className="relative group cursor-help">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
                Nom du catalogue de services à vendre <span className="text-purple-400 animate-pulse font-bold hover:text-purple-300">(ℹ️)</span>
              </label>
              {/* Tooltip */}
              <div className="absolute left-0 bottom-[104%] mb-1 hidden group-hover:block w-64 bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl text-[10px] text-slate-300 z-40 leading-normal pointer-events-none font-sans">
                <span className="font-bold text-purple-400 block border-b border-slate-800 pb-1 mb-1">🎁 CATALOGUE DE SERVICES</span>
                Nom de l'offre ou de la suite de solutions que l'Agent Plume intègre dynamiquement dans les conclusions de ses articles et argumentaires en tant que signature de marque (CTA).
              </div>
              <input
                type="text"
                placeholder="Ex. Aura Elite Monetization API Suite"
                value={upsellServiceName}
                onChange={(e) => setUpsellServiceName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Keyword tags editor */}
            <div className="relative group cursor-help">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-purple-300 block font-semibold flex items-center gap-1">
                  Intents & Mots-Clés de Synergie SEO <span className="text-purple-400 animate-pulse font-bold hover:text-purple-300">(ℹ️)</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setTargetKeywords(['monétisation automatique', 'stripe checkout seo', 'arbitrage sémantique', 'profits affiliation']);
                    playSynthBeep('success');
                  }}
                  className="text-[9px] font-mono text-purple-400 hover:text-purple-300 underline transition-all cursor-pointer"
                >
                  Restaurer les mots-clés
                </button>
              </div>
              {/* Tooltip */}
              <div className="absolute left-0 bottom-[104%] mb-1 hidden group-hover:block w-64 bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl text-[10px] text-slate-300 z-40 leading-normal pointer-events-none font-sans">
                <span className="font-bold text-purple-400 block border-b border-slate-800 pb-1 mb-1">🌐 MOTS-CLÉS DE SYNERGIE</span>
                Intents d'achat ciblés (Ex: "monétisation automatique"). Plume conçoit exclusivement des cocons de contenus focalisés sur ces mots-clés de forte valeur commerciale.
              </div>
              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-900 border border-slate-800 rounded-lg min-h-[44px]">
                {targetKeywords.map((tag, i) => (
                  <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
                    {tag}
                    <button type="button" onClick={() => handleRemoveKeyword(i)} className="hover:text-red-400 cursor-pointer"><Trash2 className="w-2.5 h-2.5" /></button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="+ Mot-clé d'intention"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                  className="bg-transparent text-[10px] font-mono focus:outline-none text-slate-300 min-w-[70px] flex-grow font-semibold"
                />
              </div>
            </div>

            {/* Article target lengths & backlink toggle */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group cursor-help">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
                  Profondeur de Rédaction <span className="text-purple-400 animate-pulse font-bold hover:text-purple-300">(ℹ️)</span>
                </label>
                {/* Tooltip */}
                <div className="absolute left-0 bottom-[104%] mb-1 hidden group-hover:block w-56 bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl text-[10px] text-slate-300 z-40 leading-normal pointer-events-none font-sans">
                  <span className="font-bold text-purple-400 block border-b border-slate-800 pb-1 mb-1">📖 LONGUEUR DES ARTICLES</span>
                  • <span className="text-white font-bold">Court</span> (~600m) : Rapide & accrocheur.<br />
                  • <span className="text-white font-bold">Moyen</span> (~1200m) : Analyse de cas standard.<br />
                  • <span className="text-white font-bold">Expert</span> (~2500m) : Dense, idéal pour s'imposer en tête des requêtes Google difficiles.
                </div>
                <select
                  value={articleTargetLength}
                  onChange={(e) => setArticleTargetLength(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="short">Court (~600 mots)</option>
                  <option value="medium">Moyen (~1200 mots)</option>
                  <option value="deep">Dense & Expert (~2500 mots)</option>
                </select>
              </div>
              <div className="relative group cursor-help">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
                  Auto-Maillage Netlinking <span className="text-purple-400 animate-pulse font-bold hover:text-purple-300">(ℹ️)</span>
                </label>
                {/* Tooltip */}
                <div className="absolute right-0 bottom-[104%] mb-1 hidden group-hover:block w-56 bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl text-[10px] text-slate-300 z-40 leading-normal pointer-events-none font-sans">
                  <span className="font-bold text-purple-400 block border-b border-slate-800 pb-1 mb-1">🔗 COCON SÉMANTIQUE MAILLAGE</span>
                  Relie automatiquement les nouveaux articles par liens contextuels croisés d'autorité pour maximiser le "jus SEO" transféré d'une page à l'autre sans action manuelle.
                </div>
                <button
                  type="button"
                  onClick={() => setBacklinkExchangeEnabled(!backlinkExchangeEnabled)}
                  className={`w-full text-left bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                    backlinkExchangeEnabled ? 'text-purple-400 font-bold' : 'text-slate-400'
                  }`}
                >
                  <span>Cocon Sémantique</span>
                  <span>{backlinkExchangeEnabled ? "ACTIF POUR SEO" : "OFF"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-sans text-slate-500 mt-4 leading-relaxed">
            💡 <span className="text-slate-400">Plume Cross-Publishing :</span> Aura rédige à la volée des analyses de cas, des tutoriels et des comparatifs rattachés aux intents d'achat, redirigeant le trafic chaud vers vos pages de paiement.
          </div>
        </div>

        {/* Pilar 3 : Gateway Transactionnelle Checkout Stripe */}
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-900">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold font-mono text-xs border border-teal-500/20">3</span>
                <div>
                  <h2 className="text-sm font-semibold text-slate-200">Capture Transactionnelle Stripe</h2>
                  <p className="text-[10px] text-slate-500">Checkout sémantique et génération d'abonnements</p>
                </div>
              </div>
              <button
                onClick={() => setStripeGatewayEnabled(!stripeGatewayEnabled)}
                className={`text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded border transition-all ${
                  stripeGatewayEnabled 
                    ? 'border-teal-500/30 bg-teal-500/10 text-teal-400' 
                    : 'border-slate-800 bg-slate-900 text-slate-500'
                }`}
              >
                {stripeGatewayEnabled ? 'Actif' : 'Désactivé'}
              </button>
            </div>

            {/* Custom Payment link provided by the user */}
            <div className="relative group cursor-help">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1 font-semibold text-teal-300 flex items-center gap-1">
                Lien de paiement Stripe Réel (Production) <span className="text-teal-400 animate-pulse font-bold hover:text-teal-300">(ℹ️)</span>
              </label>
              {/* Tooltip */}
              <div className="absolute left-0 bottom-[104%] mb-1 hidden group-hover:block w-64 bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl text-[10px] text-slate-300 z-40 leading-normal pointer-events-none font-sans">
                <span className="font-bold text-teal-400 block border-b border-slate-800 pb-1 mb-1">💳 ACCORD STRIPE DE PRODUCTION</span>
                Lien sécurisé vers votre page Stripe Checkout ou votre portail de facturation réel. Les boutons et mails Aura guident les acquéreurs directement vers ce lien final.
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex. https://checkout.stripe.com/p/trial_aura_elite"
                  value={customStripePricingUrl}
                  onChange={(e) => setCustomStripePricingUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 pl-8 text-xs text-slate-300 font-mono focus:outline-none focus:border-teal-500"
                />
                <Link className="absolute left-2.5 top-3 w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>

            {/* Pricing configure & Coupons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 relative group cursor-help">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
                  Prix de l'Abonnement <span className="text-teal-400 animate-pulse font-bold hover:text-teal-300">(ℹ️)</span>
                </label>
                {/* Tooltip */}
                <div className="absolute left-0 bottom-[104%] mb-1 hidden group-hover:block w-48 bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl text-[10px] text-slate-300 z-40 leading-normal pointer-events-none font-sans">
                  <span className="font-bold text-teal-400 block border-b border-slate-800 pb-1 mb-1">💸 TARIF MENSUEL CA$</span>
                  Montant récurrent perçu mensuellement. Utilisé par le simulateur d'offres pour évaluer le MRR par rapport aux leads signés.
                </div>
                <input
                  type="number"
                  value={monthlySubscriptionPrice}
                  onChange={(e) => setMonthlySubscriptionPrice(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-teal-500 font-bold"
                />
              </div>

              <div className="relative group cursor-help">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
                  Coupon de Réduction <span className="text-teal-400 animate-pulse font-bold hover:text-teal-300">(ℹ️)</span>
                </label>
                {/* Tooltip */}
                <div className="absolute left-0 bottom-[104%] mb-1 hidden group-hover:block w-48 bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl text-[10px] text-slate-300 z-40 leading-normal pointer-events-none font-sans">
                  <span className="font-bold text-teal-400 block border-b border-slate-800 pb-1 mb-1">🎟️ CODE DE CONVERSION</span>
                  Code coupon sémantique transmis aux prospects tièdes pour déclencher un sentiment d'opportunité exclusive.
                </div>
                <input
                  type="text"
                  placeholder="CODE_10"
                  value={autoDiscountCode}
                  onChange={(e) => setAutoDiscountCode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-teal-500 font-bold"
                />
              </div>

              <div className="relative group cursor-help">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
                  Pourcentage Code <span className="text-teal-400 animate-pulse font-bold hover:text-teal-300">(ℹ️)</span>
                </label>
                {/* Tooltip */}
                <div className="absolute right-0 bottom-[104%] mb-1 hidden group-hover:block w-48 bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl text-[10px] text-slate-300 z-40 leading-normal pointer-events-none font-sans font-normal">
                  <span className="font-bold text-teal-400 block border-b border-slate-800 pb-1 mb-1">📉 % DE SOLDE</span>
                  Pourcentage de réduction réel appliqué directement sur le coût de l'abonnement standard.
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={autoDiscountPercent}
                  onChange={(e) => setAutoDiscountPercent(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-teal-500 font-bold"
                />
              </div>
            </div>
          </div>

          <div className="text-[10px] font-sans text-slate-500 mt-4 leading-relaxed">
            💡 <span className="text-slate-400">Monétisation Sans Niaisage :</span> Les clients sémantiques sont orientés vers Stripe. Une fois l'achat finalisé, l'API Aura enregistre instantanément le contrat comme conversion de production solide.
          </div>
        </div>

        {/* Pilar 4 : Alerts Multidiffusion - Pre-filled with user Telegram parameter! */}
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-900">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold font-mono text-xs border border-emerald-500/20">4</span>
                <div>
                  <h2 className="text-sm font-semibold text-slate-200">Alertes & Sync Client Telegram</h2>
                  <p className="text-[10px] text-slate-500">Flux de notification immédiat des acquisitions</p>
                </div>
              </div>
              <button
                onClick={() => setSocialBotEnabled(!socialBotEnabled)}
                className={`text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded border transition-all ${
                  socialBotEnabled 
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' 
                    : 'border-slate-800 bg-slate-900 text-slate-500'
                }`}
              >
                {socialBotEnabled ? 'Actif' : 'Désactivé'}
              </button>
            </div>

            {/* Telegram Chat ID & token parameters - PRE-FILLED with 8347143768 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group cursor-help">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
                  Telegram Chat ID (Sauvegardé) <span className="text-emerald-400 animate-pulse font-bold hover:text-emerald-300">(ℹ️)</span>
                </label>
                {/* Tooltip */}
                <div className="absolute left-0 bottom-[104%] mb-1 hidden group-hover:block w-48 bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl text-[10px] text-slate-300 z-40 leading-normal pointer-events-none font-sans">
                  <span className="font-bold text-emerald-400 block border-b border-slate-800 pb-1 mb-1">🤖 TELEGRAM CHAT ID</span>
                  ID unique de votre compte ou canal Telegram. Prédéfini et sauvegardé de manière robuste pour envoyer des alertes sans coupure.
                </div>
                <input
                  type="text"
                  placeholder="8347143768"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div className="relative group cursor-help">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
                  Token Bot Telegram <span className="text-emerald-400 animate-pulse font-bold hover:text-emerald-300">(ℹ️)</span>
                </label>
                {/* Tooltip */}
                <div className="absolute right-0 bottom-[104%] mb-1 hidden group-hover:block w-48 bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl text-[10px] text-slate-300 z-40 leading-normal pointer-events-none font-sans">
                  <span className="font-bold text-emerald-400 block border-b border-slate-800 pb-1 mb-1">🔑 TELEGRAM TOKEN BOT</span>
                  Jeton de sécurité créé via @BotFather. Autorise notre robot crawler à pousser des leads en temps réel sur votre terminal mobile.
                </div>
                <input
                  type="password"
                  placeholder="8720627366:AAEReEHj94Xd..."
                  value={telegramToken}
                  onChange={(e) => setTelegramToken(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Discord Webhook field */}
            <div className="relative group cursor-help">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
                Webhook URL Discord d'alertes <span className="text-emerald-400 animate-pulse font-bold hover:text-emerald-300">(ℹ️)</span>
              </label>
              {/* Tooltip */}
              <div className="absolute left-0 bottom-[104%] mb-1 hidden group-hover:block w-64 bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl text-[10px] text-slate-300 z-40 leading-normal pointer-events-none font-sans">
                <span className="font-bold text-emerald-400 block border-b border-slate-800 pb-1 mb-1">👾 DISCORD WEBHOOK LINK</span>
                Lien de canal webhook Discord. Utile pour consolider ou centraliser la réception d'événements de vente réels sur votre serveur communautaire.
              </div>
              <input
                type="text"
                placeholder="https://discord.com/api/webhooks/..."
                value={discordWebhook}
                onChange={(e) => setDiscordWebhook(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Frequency options */}
            <div className="relative group cursor-help">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
                Pacing d'alertes <span className="text-emerald-400 animate-pulse font-bold hover:text-emerald-300">(ℹ️)</span>
              </label>
              {/* Tooltip */}
              <div className="absolute left-0 bottom-[104%] mb-1 hidden group-hover:block w-56 bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl text-[10px] text-slate-300 z-40 leading-normal pointer-events-none font-sans font-normal">
                <span className="font-bold text-emerald-400 block border-b border-slate-800 pb-1 mb-1">⏱️ PACING CADENCE d'ALERTES</span>
                Ajuste la cadence d'envoi. Limitez à "Chaque Heure" ou "Rapport Journalier" pour éviter les d'interruptions superflues sur mobile lors des pics.
              </div>
              <div className="flex gap-2">
                {['realtime', 'hourly', 'daily'].map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setBotFrequency(freq as any)}
                    className={`flex-1 p-2 rounded-lg text-xs font-mono border tracking-wider uppercase transition-all cursor-pointer ${
                      botFrequency === freq 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold' 
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    {freq === 'realtime' ? 'Temps Réel' : freq === 'hourly' ? 'Chaque Heure' : 'Rapport Journalier'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-[10px] font-sans text-slate-500 mt-4 leading-relaxed">
            💡 <span className="text-slate-400">Telegram Sync :</span> Votre chat ID d'alerte <span className="font-mono text-emerald-400 select-all">8347143768</span> est ancré de manière permanente dans la base sécurisée pour éviter les ressaisies fastidieuses.
          </div>
        </div>

      </div>

      {/* Persistence Save Actions */}
      <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
              <CheckCircle className="w-3.5 h-3.5" />
              Configurations persistées et synchronisées à vie avec Firebase Firestore !
            </span>
          )}
          {!savedSuccess && (
            <span className="text-[11px] text-slate-500 font-sans">
              Appuyez sur Enregistrer pour déployer toutes les modifications d'acquisition automatiques.
            </span>
          )}
        </div>
        
        <button
          onClick={() => handleSaveConfig()}
          disabled={isLoading}
          className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:bg-slate-800 disabled:text-slate-500 text-black font-semibold text-xs py-2 px-6 rounded-xl transition-all cursor-pointer flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Sauvegarde...
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Enregistrer l'Acquisition
            </>
          )}
        </button>
      </div>

      {/* Sourcing Real Log List Segment (Pilar 1 Scraped Leads Status Tracker) */}
      <div className="bg-slate-950 border border-slate-900 rounded-xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-slate-200">Prospects Sémantiques & Pipelines Générés (RÉEL)</h2>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Ciblage en cours sur {config.targetCountries?.join(', ')}</span>
        </div>

        {config.scrapedLeads && config.scrapedLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-[10px] font-mono tracking-wider uppercase text-slate-500">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Prospect & Compagnie</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Verticale</th>
                  <th className="py-2.5 px-3">Canal Sourcing</th>
                  <th className="py-2.5 px-3">Statut Pipeline</th>
                  <th className="py-2.5 px-3">Dernier Statut Pitch</th>
                  <th className="py-2.5 px-3 text-right">Offre</th>
                </tr>
              </thead>
              <tbody className="text-xs font-mono divide-y divide-slate-900/50">
                {config.scrapedLeads.map((lead: ScrapedLead, idx: number) => {
                  let statusBadge = (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-slate-800 bg-slate-900 text-slate-400 uppercase">
                      Scraped
                    </span>
                  );
                  if (lead.status === 'pitched') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-blue-500/30 bg-blue-500/10 text-blue-400 uppercase animate-pulse">
                        Pitched
                      </span>
                    );
                  } else if (lead.status === 'contacted') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 uppercase">
                        Négociation
                      </span>
                    );
                  } else if (lead.status === 'converted') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 uppercase font-bold">
                        Payé (Stripe)
                      </span>
                    );
                  }

                  return (
                    <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                      <td className="py-3 px-3 text-slate-500 text-[10px]">
                        {new Date(lead.date).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-300">{lead.name}</div>
                        <div className="text-[10px] text-slate-500 font-sans">{lead.company}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px] select-all">{lead.email}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px]">
                          {lead.industry}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-sans text-[11px] text-slate-400 flex items-center gap-1">
                          <Globe className="w-3 h-3 text-slate-500" />
                          {lead.source}
                        </span>
                      </td>
                      <td className="py-3 px-3">{statusBadge}</td>
                      <td className="py-3 px-3 text-xs text-slate-400 font-sans max-w-[220px] truncate" title={lead.pitchSentiment}>
                        {lead.pitchSentiment}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-200">
                        {lead.valueProposed?.toFixed(2)} CA$
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-900/20 rounded-xl border border-dashed border-slate-800">
            <Users className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-bounce" />
            <p className="text-xs text-slate-400">Aucun lead n'a encore été sourcé par l'autopilote.</p>
            <p className="text-[10px] text-slate-500 mt-1">Vérifiez que le robot d'acquisition global est bien ACTIF.</p>
          </div>
        )}
      </div>

    </div>
  );
}
