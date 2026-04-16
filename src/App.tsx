/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Sparkles, TrendingUp, Zap, ChevronRight, X } from 'lucide-react';
import { BottomNav } from './components/BottomNav';
import { OpportunityCard } from './components/OpportunityCard';
import { RadarView } from './components/RadarView';
import { AIChat } from './components/AIChat';
import { LocalOpportunities } from './components/LocalOpportunities';
import { Ranking } from './components/Ranking';
import { Opportunity } from './types';
import { generateOpportunities } from './services/gemini';
import { cn } from './lib/utils';

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',
    title: 'Arbitragem de Cripto: SOL/USDT',
    description: 'Diferença de 2.5% detectada entre Binance e OKX. Movimentação rápida necessária.',
    profitLevel: 'alto',
    difficulty: 'médio',
    executionPlan: ['Comprar SOL na Binance', 'Transferir para OKX', 'Vender por USDT'],
    estimatedGain: 'R$ 450 - R$ 1.200',
    category: 'crypto',
    timestamp: Date.now(),
  },
  {
    id: '2',
    title: 'Revenda de Ingressos: Festival Local',
    description: 'Alta demanda detectada em redes sociais para o festival de amanhã. Preços subindo.',
    profitLevel: 'médio',
    difficulty: 'fácil',
    executionPlan: ['Comprar ingressos remanescentes', 'Anunciar em grupos de nicho', 'Venda direta'],
    estimatedGain: 'R$ 200 - R$ 500',
    category: 'local',
    timestamp: Date.now(),
  },
  {
    id: '3',
    title: 'Dropshipping: Mini Projetor 4K',
    description: 'Produto viralizando no TikTok. Baixa concorrência em anúncios locais.',
    profitLevel: 'alto',
    difficulty: 'difícil',
    executionPlan: ['Criar landing page', 'Configurar anúncios Meta', 'Processar pedidos via AliExpress'],
    estimatedGain: 'R$ 2.000 - R$ 5.000',
    category: 'trends',
    timestamp: Date.now(),
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [selectedOp, setSelectedOp] = useState<Opportunity | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshOpportunities = async () => {
    setIsRefreshing(true);
    const newOps = await generateOpportunities("Tendências atuais de mercado, cripto e serviços locais no Brasil");
    if (newOps.length > 0) {
      setOpportunities(newOps);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    // Initial refresh
    // refreshOpportunities();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6 pb-24">
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tighter">RADAR</h1>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Oportunidades do Dia</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={refreshOpportunities}
                  className={cn("p-3 rounded-2xl bg-white/5 border border-white/10 text-white transition-all", isRefreshing && "animate-spin")}
                >
                  <Sparkles size={20} className="text-green-400" />
                </button>
                <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white relative">
                  <Bell size={20} />
                  <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-black" />
                </button>
              </div>
            </header>

            <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-[2.5rem] p-6 text-white relative overflow-hidden shadow-[0_20px_50px_rgba(16,185,129,0.3)]">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={16} fill="currentColor" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Destaque do Momento</span>
                </div>
                <h2 className="text-2xl font-black mb-4 leading-tight">Ganhe até R$ 1.500 com Revenda de Eletrônicos</h2>
                <button className="bg-white text-black px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-105 transition-transform">
                  COMEÇAR AGORA <ChevronRight size={16} />
                </button>
              </div>
              <TrendingUp size={120} className="absolute -bottom-4 -right-4 opacity-20 rotate-12" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Detectadas Recentemente</h3>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{opportunities.length} Ativas</span>
              </div>
              {opportunities.map((op: Opportunity) => (
                <OpportunityCard 
                  key={op.id} 
                  opportunity={op} 
                  onClick={() => setSelectedOp(op)}
                />
              ))}
            </div>
          </div>
        );
      case 'radar':
        return <RadarView />;
      case 'local':
        return <LocalOpportunities opportunities={opportunities} />;
      case 'chat':
        return <AIChat />;
      case 'ranking':
        return <Ranking opportunities={opportunities} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-green-400 selection:text-black">
      <div className="max-w-md mx-auto px-6 pt-8 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Opportunity Detail Modal */}
      <AnimatePresence>
        {selectedOp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] p-6 flex items-end sm:items-center justify-center"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-[3rem] p-8 max-h-[90vh] overflow-y-auto relative"
            >
              <button 
                onClick={() => setSelectedOp(null)}
                className="absolute top-6 right-6 p-2 bg-white/5 rounded-full text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>

              <div className="mb-8">
                <span className="text-[10px] font-black text-green-400 uppercase tracking-[0.3em] mb-2 block">Oportunidade Confirmada</span>
                <h2 className="text-3xl font-black text-white leading-tight mb-4">{selectedOp.title}</h2>
                <div className="flex gap-3">
                  <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Lucro</span>
                    <span className="text-sm font-black text-green-400 uppercase">{selectedOp.profitLevel}</span>
                  </div>
                  <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Dificuldade</span>
                    <span className="text-sm font-black text-yellow-400 uppercase">{selectedOp.difficulty}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3">Descrição</h4>
                  <p className="text-gray-300 leading-relaxed">{selectedOp.description}</p>
                </div>

                <div>
                  <h4 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">Plano de Execução</h4>
                  <div className="space-y-3">
                    {selectedOp.executionPlan.map((step, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="w-6 h-6 rounded-full bg-green-400 text-black flex items-center justify-center text-[10px] font-black shrink-0 mt-1">
                          {i + 1}
                        </div>
                        <p className="text-white text-sm font-medium">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Retorno Estimado</span>
                    <span className="text-2xl font-black text-green-400">{selectedOp.estimatedGain}</span>
                  </div>
                  <button className="bg-green-400 text-black px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-transform shadow-[0_10px_30px_rgba(74,222,128,0.3)]">
                    EXECUTAR
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
