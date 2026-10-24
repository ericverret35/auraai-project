import React, { useState } from 'react';
import { DigitalProduct, Transaction } from '../types';
import { ShoppingCart, Compass, FileText, CheckCircle, Smartphone, Award, Globe, DollarSign, Terminal, Info, X } from 'lucide-react';

interface ProductStoreProps {
  products: DigitalProduct[];
  transactions: Transaction[];
  onSimulatePurchase: (productId: string, name: string, country: string) => Promise<{ success: boolean; checkoutUrl?: string; state?: any } | void>;
}

export default function ProductStore({ products, transactions, onSimulatePurchase }: ProductStoreProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [country, setCountry] = useState<string>('France');
  const [purchaseSuccess, setPurchaseSuccess] = useState<boolean>(false);
  const [realCheckoutUrl, setRealCheckoutUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  const selectedPrd = products.find(p => p.id === selectedProductId);

  const countries = ['France', 'Canada', 'Suisse', 'Belgique', 'Luxembourg', 'Maroc', 'Tunisie', 'Sénégal'];

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    setIsLoading(true);
    setErrorMessage(null);
    setRealCheckoutUrl(null);
    try {
      const res = await onSimulatePurchase(selectedProductId, firstName, country);
      if (res && res.checkoutUrl) {
        setRealCheckoutUrl(res.checkoutUrl);
      } else {
        setPurchaseSuccess(true);
        setFirstName('');
        setTimeout(() => {
          setPurchaseSuccess(false);
          setSelectedProductId('');
        }, 5000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "L'achat n'a pas pu être complété.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Frontstore Digital Catalog Layout */}
      <div className="lg:col-span-2 space-y-4">

        <div 
          onClick={() => setShowConfigModal(true)}
          className="p-4 bg-slate-900 border border-slate-800 rounded-xl relative group/store cursor-pointer hover:border-[#9b51e0]/30 transition-all duration-300"
        >
          {/* Tooltip on hover */}
          <div className="absolute left-0 bottom-full mb-2 hidden group-hover/store:block w-76 bg-zinc-900 border border-zinc-800 text-slate-200 text-xs p-3 rounded-lg shadow-xl z-50 pointer-events-none normal-case font-normal leading-relaxed">
            <span className="font-extrabold text-blue-400 block mb-1 font-mono uppercase tracking-wider">🛒 CANAL DE VENTE DIRECT</span>
            Gérez l'inventaire réel, les prix et les tunnels de conversion Stripe.
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-sm flex items-center gap-1.5 group-hover/store:text-blue-400 transition-colors">
                Catalogue E-Commerce & Production
              </h3>
              <p className="text-[11px] text-slate-400 group-hover/store:text-slate-300">Produits déployés par les agents et synchronisés.</p>
            </div>
            {/* Toggle switch */}
            <div onClick={(e) => e.stopPropagation()} className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
          </div>
        </div>
        
        <div id="product-items-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-[#9b51e0]/30 transition-all duration-300 relative group overflow-hidden"
            >
              {/* Visual category tag decoration */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-semibold text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                  {product.category}
                </span>
                <span className="text-xs font-mono text-slate-500">{product.pages} pages / fiches</span>
              </div>

              <div>
                <h4 className="text-white font-bold text-base tracking-tight mb-2 group-hover:text-blue-400 transition-colors">{product.title}</h4>
                <p className="text-slate-300 text-xs leading-relaxed mb-4">{product.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/85 mt-2">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Tarif unitaire</span>
                  <span className="text-xl font-extrabold text-white font-mono">{product.price.toFixed(2)} CA$</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-mono text-right hidden sm:block">
                    Ventes : {product.sales}
                    <span className="block text-emerald-400 font-semibold">{product.earnings.toFixed(2)} CA$</span>
                  </span>
                  <button
                    onClick={() => {
                      setSelectedProductId(product.id);
                      setPurchaseSuccess(false);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs rounded-lg hover:opacity-90 transition-all transform active:scale-95 flex items-center gap-1.5 shadow-lg shadow-blue-900/10"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Interactive checkout modal inside catalog view */}
        {selectedProductId && selectedPrd && (
          <div className="bg-slate-900 border border-[#9b51e0]/40 p-6 rounded-2xl shadow-xl space-y-4 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#9b51e0] to-[#e051b8]"></div>
            
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-blue-400 font-mono font-bold uppercase tracking-widest">Tunnel de vente sécurisé</span>
                <h3 className="text-white font-bold text-lg">Stripe Production Checkout</h3>
                <p className="text-xs text-slate-400">Initialisation de la session de paiement sécurisée via Stripe API.</p>
              </div>
              <button
                onClick={() => {
                  setSelectedProductId('');
                  setErrorMessage(null);
                  setRealCheckoutUrl(null);
                }}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 bg-slate-950 border border-slate-850 rounded"
              >
                Fermer
              </button>
            </div>

            {errorMessage && (
              <div className="p-4 bg-red-950/50 border border-red-800/80 rounded-xl text-left space-y-1">
                <h4 className="text-red-400 font-bold text-xs uppercase font-mono">⚠️ Erreur de transaction</h4>
                <p className="text-xs text-slate-200">{errorMessage}</p>
              </div>
            )}

            {realCheckoutUrl ? (
              <div className="p-5 bg-indigo-950/40 border border-indigo-800/80 rounded-xl text-center space-y-3">
                <Globe className="w-10 h-10 text-indigo-400 mx-auto animate-pulse" />
                <h4 className="text-white font-bold text-sm">Session de Paiement Réel Disponible !</h4>
                <p className="text-xs text-slate-300">
                  Une session Stripe sécurisée officielle ({selectedPrd.price.toFixed(2)} CA$) a été générée. 
                  Pour des raisons de sécurité, Stripe n'autorise pas la saisie de carte bancaire directement sous forme d'iframe incrustée.
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <a
                    href={realCheckoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-[#635bff] text-white hover:bg-[#5b52e5] text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 uppercase font-mono tracking-wider shadow-lg shadow-indigo-950/30"
                  >
                    🚀 Ouvrir le Paiement Réel Stripe
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setRealCheckoutUrl(null);
                      setSelectedProductId('');
                    }}
                    className="text-[10px] text-slate-400 hover:text-slate-200 underline"
                  >
                    Annuler l'achat
                  </button>
                </div>
              </div>
            ) : purchaseSuccess ? (
              <div className="p-5 bg-emerald-950/40 border border-emerald-800/80 rounded-xl text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-white font-bold text-sm">Confirmation d'Achat Réussie !</h4>
                <p className="text-xs text-slate-300">La transaction de {selectedPrd.price} CA$ a été validée et enregistrée dans votre Ledger de production.</p>
              </div>
            ) : (
              <form onSubmit={handleBuy} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1.5 font-mono">Prénom du Client</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ex: David, Sarah, Thomas..."
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-[#9b51e0] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1.5 font-mono">Pays d'origine</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-[#9b51e0]"
                  >
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 bg-gradient-to-r from-[#9b51e0] to-[#e051b8] text-white text-xs font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 uppercase font-mono text-[10px] tracking-wider"
                  >
                    {isLoading ? "Envoi..." : `Acheter (${selectedPrd.price} CA$)`}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Right Column: Transaction History list */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
        <div 
          onClick={() => setShowHistoryModal(true)}
          className="relative group/history cursor-pointer hover:border-[#9b51e0]/30 transition-all duration-300"
        >
          {/* Tooltip on hover */}
          <div className="absolute right-0 bottom-full mb-2 hidden group-hover/history:block w-64 bg-slate-800 text-slate-200 text-xs p-2.5 rounded-lg shadow-xl border border-slate-700 z-50 pointer-events-none normal-case font-normal">
            <span className="font-extrabold text-[#9b51e0] block mb-1 font-mono uppercase tracking-wider">📊 HISTORIQUE STRIPE</span>
            Centralise les revenus, les taux de conversion et l'analyse fiscale.
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-base mb-1 flex items-center gap-1.5 group-hover/history:text-[#9b51e0] transition-colors">
                Historique des Paiements Stripe
              </h3>
              <p className="text-xs text-slate-400 group-hover/history:text-slate-300">Ventes directes d'info-produits.</p>
            </div>
            {/* Toggle switch */}
            <div onClick={(e) => e.stopPropagation()} className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#9b51e0]"></div>
            </div>
          </div>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] my-4 pr-1">
          {transactions.map((tx) => {
            const timeStr = new Date(tx.timestamp).toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
            
            return (
              <div key={tx.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between gap-3 group">
                <div className="overflow-hidden">
                  <h4 className="text-white font-bold text-xs truncate">{tx.productName}</h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-0.5">
                    <span>{timeStr}</span>
                    <span>•</span>
                    <span className="text-[#9b51e0]">{tx.country}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-emerald-400 font-extrabold font-mono font-bold">+{tx.amount.toFixed(2)} CA$</span>
                  <span className="block text-[8px] text-slate-500 font-mono uppercase">Stripe</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1 text-[11px] text-slate-400 uppercase font-mono">
          <div className="flex justify-between items-center text-slate-300 font-bold">
            <span>Frais stripe estimé (1.4% + 0.25 CA$)</span>
            <span className="text-rose-500">Moy. -0.52 CA$</span>
          </div>
          <div className="flex justify-between items-center text-emerald-400 font-extrabold">
            <span>Marge d'Aura Digital</span>
            <span>97.4 %</span>
          </div>
        </div>
      </div>

      {showHistoryModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b0b0b] border border-[#1f1f1f] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#9b51e0] to-pink-600"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[#9b51e0]">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider font-sans">
                      Historique des Transactions
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#9b51e0] font-mono">Checkout Simulator</span>
                      <span className="text-slate-600 text-[10px]">|</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800">
                        ROUTAGE: STRIPE LIVE
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowHistoryModal(false)}
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
                      Surveillez vos rentrées d'argent, personnalisez le type de paiements acceptés et ajustez les relances automatiques de paniers abandonnés.
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Recettes Brutes</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">{transactions.reduce((acc, tx) => acc + tx.amount, 0).toFixed(2)} CA$</div>
                    </div>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Tx Abandon</div>
                      <div className="text-xl font-bold text-amber-500 mt-1 font-mono">1.2%</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Options de Configuration</h4>
                  
                  <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Relances Paniers (IA Agent)</div>
                        <div className="text-[10px] text-slate-500">Autorise l'agent à rappeler les clients</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#9b51e0]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Mode Crypto (Bitcoin)</div>
                        <div className="text-[10px] text-slate-500">Ajoute un wallet Lightning au checkout</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={false} />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#9b51e0]"></div>
                      </label>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#1f1f1f]">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Coupon Automatique (Flash)</span>
                        <span className="text-xs text-white font-mono">-10%</span>
                      </div>
                      <input type="range" min="0" max="50" defaultValue="10" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#9b51e0]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfigModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b0b0b] border border-[#1f1f1f] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#9b51e0] to-fuchsia-600"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[#9b51e0]">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider font-sans">
                      Catalogue E-Commerce
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#9b51e0] font-mono">Store Front</span>
                      <span className="text-slate-600 text-[10px]">|</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800">
                        INVENTAIRE: EN LIGNE
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
                    <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Performance & Inventaire</h4>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl text-sm justify-between text-slate-300">
                      Paramétrez l'exposition des produits. Activez la tarification dynamique selon la rareté et configurez les upsells tactiques pour maximiser le panier moyen.
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Produits Actifs</div>
                      <div className="text-xl font-bold text-cyan-400 mt-1 font-mono">{products.length}</div>
                    </div>
                    <div className="bg-[#121212] border border-[#1f1f1f] p-3 rounded-xl">
                      <div className="text-[10px] uppercase text-slate-500 font-bold font-mono">Taux de Conv.</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">
                        3.8%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 font-mono">Options de Configuration Avancées</h4>
                  
                  <div className="bg-[#121212] border border-[#1f1f1f] p-4 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Tarification Dynamique (IA)</div>
                        <div className="text-[10px] text-slate-500">Ajuste le prix selon la demande en temps réel</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#9b51e0]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Affichage Badges "Bestseller"</div>
                        <div className="text-[10px] text-slate-500">Ajoute un marqueur de preuve sociale</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Upsell Automatisé</div>
                        <div className="text-[10px] text-slate-500">Propose des produits complémentaires</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#9b51e0]"></div>
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
