import React from 'react';
import { Trophy, TrendingUp, ArrowUpRight, Medal } from 'lucide-react';
import { motion } from 'motion/react';
import { Opportunity } from '../types';

interface RankingProps {
  opportunities: Opportunity[];
}

export function Ranking({ opportunities }: RankingProps) {
  const sorted = [...opportunities].sort((a, b) => {
    const getVal = (gain: string) => parseFloat(gain.replace(/[^0-9.]/g, '')) || 0;
    return getVal(b.estimatedGain) - getVal(a.estimatedGain);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white tracking-tight">TOP OPORTUNIDADES</h2>
        <Trophy className="text-yellow-400" size={24} />
      </div>

      {sorted.map((op, i) => (
        <motion.div
          key={op.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 font-black text-lg text-gray-400 shrink-0">
            {i + 1}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-bold truncate">{op.title}</h4>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-sm font-black">{op.estimatedGain}</span>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">• {op.category}</span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            {i === 0 && <Medal className="text-yellow-400 mb-1" size={16} />}
            <div className="flex items-center gap-1 text-green-400 text-xs font-bold">
              <TrendingUp size={12} />
              <span>+{(100 - i * 10)}%</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
