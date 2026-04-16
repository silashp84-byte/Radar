import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Zap, Clock, ChevronRight } from 'lucide-react';
import { Opportunity } from '../types';
import { cn } from '../lib/utils';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onClick?: () => void;
  key?: React.Key;
}

export function OpportunityCard({ opportunity, onClick }: OpportunityCardProps) {
  const profitColors = {
    baixo: 'text-blue-400 bg-blue-400/10',
    médio: 'text-yellow-400 bg-yellow-400/10',
    alto: 'text-green-400 bg-green-400/10',
  };

  const difficultyColors = {
    fácil: 'text-green-400',
    médio: 'text-yellow-400',
    difícil: 'text-red-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-4 cursor-pointer hover:bg-white/10 transition-colors relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
        <TrendingUp size={48} className="text-green-400" />
      </div>

      <div className="flex justify-between items-start mb-3">
        <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", profitColors[opportunity.profitLevel])}>
          Lucro {opportunity.profitLevel}
        </span>
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <Clock size={12} />
          <span>Agora</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 leading-tight">{opportunity.title}</h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{opportunity.description}</p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Ganho Estimado</span>
          <span className="text-lg font-black text-green-400">{opportunity.estimatedGain}</span>
        </div>
        
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
          <span className="text-xs font-medium text-gray-300">Ver Plano</span>
          <ChevronRight size={16} className="text-green-400" />
        </div>
      </div>
    </motion.div>
  );
}
