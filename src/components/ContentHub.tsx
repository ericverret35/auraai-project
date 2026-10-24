import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { BookOpen, Sparkles, Eye, MousePointerClick, TrendingUp, Settings, X, Award, Search, Info, ExternalLink, Zap, ShieldCheck } from 'lucide-react';

interface ContentHubProps {
  articles: Article[];
  adsensePubId?: string;
  amazonAffiliateTag?: string;
}

export default function ContentHub({ articles, adsensePubId, amazonAffiliateTag }: ContentHubProps) {
  const [selectedArticleId, setSelectedArticleId] = useState<string>(articles[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [selectedArticleForConfig, setSelectedArticleForConfig] = useState<Article | null>(null);
  const [adsenseLoaded, setAdsenseLoaded] = useState<boolean>(false);

  // Properly initialize AdSense when ad slot mounts
  const initializeAdsense = () => {
    if (adsensePubId && adsensePubId.trim() !== '' && window) {
      try {
        // Ensure adsbygoogle array exists
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        // Push the ad request
        (window as any).adsbygoogle.push({});
        setAdsenseLoaded(true);
        console.log('✅ AdSense ad slot initialized');
      } catch (e) {
        console.warn('AdSense push failed:', e);
        setAdsenseLoaded(false);
      }
    }
  };

  // Initialize AdSense script on mount
  useEffect(() => {
    if (adsensePubId && adsensePubId.trim() !== '' && window) {
      // Check if AdSense script is already loaded
      const scriptExists = document.querySelector('script[src*="pagead2.googlesyndication.com"]');
      if (!scriptExists) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        script.crossOrigin = 'anonymous';
        script.onload = () => {
          console.log('✅ AdSense script loaded');
          // Initialize any existing ad slots
          setTimeout(initializeAdsense, 100);
        };
        script.onerror = () => console.error('❌ Failed to load AdSense script');
        document.head.appendChild(script);
      } else {
        // Script already loaded, initialize slots
        setTimeout(initializeAdsense, 100);
      }
    }
  }, [adsensePubId]);

  // Re-initialize AdSense when article changes (new ad slot rendered)
  useEffect(() => {
    if (adsensePubId && adsensePubId.trim() !== '') {
      setTimeout(initializeAdsense, 200);
    }
  }, [selectedArticleId, adsensePubId]);

  const categories = ['all', ...Array.from(new Set(articles.map(a => a.category)))];

  const filteredArticles = articles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedArticle = filteredArticles.find(a => a.id === selectedArticleId) || filteredArticles[0] || articles[0];


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Column: List of generated blog posts & stats */}
      <div className="space-y-4">
        <div 
          onClick={() => setShowConfigModal(true)}
          className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 relative group/contentcursor cursor-pointer hover:border-cyan-500/30 transition-all duration-300"
        >
          <div className="absolute left-0 bottom-full mb-2 hidden group-hover/contentcursor:block w-72 bg-zinc-900 border border-zinc-800 text-slate-200 text-xs p-3 rounded-lg shadow-xl z-50 pointer-events-none normal-case font-normal leading-relaxed">
            <span className="font-extrabold text-cyan-400 block mb-1 font-mono uppercase tracking-wider">✍️ GUIDE DE RÉDACTION SÉMANTIQUE (IA)</span>
            Les articles ci-dessous sont générés automatiquement par l'Agent Plume. Ils intègrent deux types de revenus : l'affiliation Amazon et les micro-espaces publicitaires AdSense.
          </div>
          <div>
            <h3 className="text-white font-bold text-sm flex items-center gap-1.5 group-hover/contentcursor:text-cyan-400 transition-colors">
              Contenus Rédigés par l'IA <span className="text-cyan-400 animate-pulse font-bold">(ℹ️)</span>
            </h3>
            <p className="text-[11px] text-slate-400 group-hover/contentcursor:text-slate-300">Chaque article est optimisé SEO et configuré pour l'affiliation et la publicité automatique.</p>
          </div>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
              <Search className="w-3.5 h-3.5 text-slate-500" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un article..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs py-1.5 pl-8 pr-3 text-white focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          <div className="flex flex-wrap gap-1 pt-1.5 border-t border-slate-800/80" onClick={(e) => e.stopPropagation()}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border font-mono transition ${
                  selectedCategory === cat
                    ? 'bg-cyan-950/80 text-[#00f2fe] border-cyan-800'
                    : 'bg-zinc-950 text-zinc-500 border-zinc-900 hover:text-zinc-300'
                }`}
              >
                {cat === 'all' ? 'Tous' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12 text-zinc-600 text-xs italic font-mono bg-slate-950/30 border border-slate-900 rounded-xl">
              Aucun contenu sémantique trouvé.
            </div>
          ) : (
            filteredArticles.map((art) => {
              const isSelected = art.id === selectedArticleId;
              return (
                <button
                  key={art.id}
                  onClick={() => setSelectedArticleId(art.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-visible group/articlecard ${
                    isSelected
                      ? 'border-[#00f2fe] bg-slate-950/80 shadow-md shadow-[#00f2fe]/5'
                      : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700/80 hover:bg-slate-900/70'
                  }`}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-64 bg-[#0a0a0a] border border-zinc-800 p-4 rounded-xl shadow-2xl text-[10px] text-zinc-300 z-50 pointer-events-none scale-95 opacity-0 group-hover/articlecard:scale-100 group-hover/articlecard:opacity-100 transition-all duration-200 hidden lg:block">
                    <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-zinc-900">
                      <span className="font-bold flex items-center gap-1.5 text-[#00f2fe] uppercase text-[11px]">
                        <BookOpen className="w-4 h-4" />
                        {art.title.substring(0,20)}...
                      </span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed text-[10px] mb-2">Article généré le {art.date}. Optimisé pour les mots-clés : {art.keywords.slice(0,3).join(', ')}.</p>
                    <div className="bg-zinc-950/80 rounded border border-zinc-900 p-2 space-y-1 font-mono text-[8.5px] text-zinc-400">
                       <div className="flex justify-between"><span>Vues:</span><span className="text-emerald-400 font-bold">{art.views}</span></div>
                       <div className="flex justify-between"><span>Cliques:</span><span className="text-emerald-400 font-bold">{art.clicks}</span></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mb-1.5 w-full">
                    <span>{art.category} • {art.date}</span>
                    <div className="flex items-center gap-1 bg-cyan-950/80 text-[#00f2fe] px-1.5 py-0.5 rounded font-bold">
                      <Award className="w-3 h-3" />
                      <span>SEO {art.seoScore}</span>
                    </div>
                  </div>

                  <h4 className="text-white font-bold text-sm tracking-tight line-clamp-1 mb-2 group-hover/articlecard:text-[#00f2fe] transition-colors">
                    {art.title}
                  </h4>

                  <div className="flex justify-between items-center border-t border-slate-800/80 pt-2 w-full text-[10px] text-slate-400">
                    <span className="font-mono">{art.earnings.toFixed(2)} CA$</span>
                    <span 
                      onClick={(e) => { e.stopPropagation(); setSelectedArticleForConfig(art); }}
                      className="text-[#00f2fe] font-semibold group-hover/articlecard:translate-x-1 transition-transform"
                    >
                      ⚙️ Configurer →
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>


      {/* Right Column (2 spans wide): Main Article Reader previewing AdSense placement & Amazon affiliation banner */}
      <div className="lg:col-span-2 space-y-6">
        {selectedArticle ? (
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
            
            {/* Header article details */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800/80">
              <div>
                <span className="text-[#00f2fe] text-xs font-mono font-bold uppercase tracking-widest">{selectedArticle.category}</span>
                <h2 className="text-white text-xl sm:text-2xl font-extrabold tracking-tight mt-1">{selectedArticle.title}</h2>
                <p className="text-[11px] text-slate-400 font-mono mt-1">Publié le {selectedArticle.date} • Optimisation sémantique validée</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">Score SEO</span>
                  <span className="text-base font-bold text-emerald-400 font-mono font-extrabold">{selectedArticle.seoScore}/100</span>
                </div>
              </div>
            </div>

            {/* Live Google AdSense Banner Placement above content */}
            <div className="bg-slate-950 border border-dashed border-cyan-800/60 p-4 rounded-xl relative overflow-hidden text-center select-none">
              <div className="absolute top-0 right-0 bg-cyan-950/80 border-b border-l border-cyan-800/60 text-[8px] text-slate-400 px-2 py-0.5 font-mono">
                Régie Google AdSense • Éperon actif
              </div>
              <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wider mb-1">Espace publicitaire Monétisé</p>
              {adsensePubId && adsensePubId.trim() !== '' ? (
                <div className="mt-2 w-full flex justify-center" data-adsense-slot="true">
                   <ins
                     className="adsbygoogle"
                     style={{ display: 'block', width: '100%', height: '90px', minHeight: '90px' }}
                     data-ad-client={adsensePubId}
                     data-ad-format="auto"
                     data-full-width-responsive="true"
                     data-ad-layout="in-article"
                   ></ins>
                   {adsenseLoaded ? (
                     <p className="text-[8px] mt-1 text-emerald-500 font-mono">✅ Annonce AdSense chargée • {adsensePubId}</p>
                   ) : (
                     <p className="text-[8px] mt-1 text-amber-500 font-mono animate-pulse">⏳ Chargement de l'annonce...</p>
                   )}
                </div>
              ) : (
                <>
                  <p className="text-xs font-bold text-slate-300">Vos bannières AdSense apparaîtront ici</p>
                  <div className="w-full max-w-lg mx-auto h-12 bg-slate-900/50 rounded-lg border border-slate-800/80 flex items-center justify-center text-[10px] text-[#00f2fe] font-mono mt-2 animate-pulse">
                    [ CONFIGUREZ VOTRE ID ADSENSE POUR L'AFFICHAGE RÉEL ]
                  </div>
                </>
              )}
            </div>

            {/* Rendered HTML article body */}
            <div 
              className="text-slate-200 text-sm leading-relaxed prose prose-invert max-w-none space-y-4 font-normal"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            />

            {/* Rich context keyword Tags */}
            <div className="space-y-1.5 pt-4">
              <p className="text-xs font-semibold text-slate-400 font-mono">Indexations Sémantiques :</p>
              <div className="flex flex-wrap gap-2">
                {selectedArticle.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[11px] bg-slate-950 text-indigo-300 px-2.5 py-1 rounded border border-slate-850 font-mono"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Amazon Affiliate Recommendation Banner Unit below content */}
            {selectedArticle.affiliateBanner && (
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden mt-6">
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#00f2fe] to-[#4facfe]"></div>
                <div>
                  <span className="text-[9px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800 font-mono uppercase tracking-wider block w-fit mb-1">
                    Recommandation Amazon Affiliate
                  </span>
                  <h4 className="text-white text-xs font-bold">{selectedArticle.affiliateBanner.productName}</h4>
                  {amazonAffiliateTag && amazonAffiliateTag.trim() !== '' ? (
                    <p className="text-[9px] text-emerald-400 font-semibold mt-0.5 font-mono">✅ Lien monétisé actif (Tag: {amazonAffiliateTag})</p>
                  ) : (
                    <p className="text-[9px] text-amber-500 font-semibold mt-0.5 font-mono">⚠️ Configuration Affiliate manquante - Lien générique affiché</p>
                  )}
                </div>
                <a
                  href={`https://www.amazon.ca/s?k=${encodeURIComponent(selectedArticle.affiliateBanner.productName)}&tag=${amazonAffiliateTag && amazonAffiliateTag.trim() !== '' ? amazonAffiliateTag : 'aura-passive-20'}&linkCode=ogi&th=1&psc=1`}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded transition-all duration-300 transform active:scale-95 text-center flex items-center justify-center gap-1.5 shrink-0"
                  data-affiliate="true"
                  data-product={selectedArticle.affiliateBanner.productName}
                >
                  Découvrir l'offre sur Amazon
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

          </div>
        ) : (
          <div className="bg-slate-900/60 p-8 text-center rounded-2xl border border-slate-850 text-slate-400 text-sm">
            Aucun article n'a encore été généré par l'Agent Plume. Allez dans l'onglet des Agents pour rédiger votre premier post !
          </div>
        )}
      </div>

      {selectedArticleForConfig && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b0b0b] border border-[#1f1f1f] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-emerald-600"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider font-sans">
                      Article: {selectedArticleForConfig.title.substring(0,25)}...
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-cyan-500 font-mono">{selectedArticleForConfig.category}</span>
                      <span className="text-slate-600 text-[10px]">|</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800">
                        STATUS: ACTIF
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedArticleForConfig(null)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Performance</h4>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl text-sm justify-between text-slate-300">
                      Cet article est en cours d'optimisation SEO par l'agent Plume.
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Vues</div>
                      <div className="text-xl font-bold text-white mt-1 font-mono">{selectedArticleForConfig.views}</div>
                    </div>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Revenu</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">{selectedArticleForConfig.earnings.toFixed(2)}€</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Options de Configuration</h4>
                  
                  <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Maillage Interne Auto</div>
                        <div className="text-[10px] text-slate-500">Injecte des liens contextuels</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Régie Amazon</div>
                        <div className="text-[10px] text-slate-500">Affiche les produits affiliés</div>
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

    </div>
  );
}
