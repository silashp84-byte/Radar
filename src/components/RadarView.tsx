import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radar as RadarIcon, Zap, Target, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

export function RadarView() {
  const [scanning, setScanning] = useState(true);
  const [pings, setPings] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (!scanning) return;
    
    const interval = setInterval(() => {
      setPings(prev => [
        ...prev.slice(-5),
        { id: Date.now(), x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 }
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, [scanning]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] relative">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">RADAR ATIVO</h2>
        <p className="text-green-400 text-sm font-mono animate-pulse">ESCANEANDO OPORTUNIDADES EM TEMPO REAL...</p>
      </div>

      <div className="relative w-72 h-72 rounded-full border-2 border-green-500/20 flex items-center justify-center overflow-hidden bg-green-500/5 shadow-[0_0_50px_rgba(34,197,94,0.1)]">
        {/* Radar Circles */}
        <div className="absolute inset-4 rounded-full border border-green-500/10" />
        <div className="absolute inset-12 rounded-full border border-green-500/10" />
        <div className="absolute inset-24 rounded-full border border-green-500/10" />
        
        {/* Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-[1px] bg-green-500/10" />
          <div className="h-full w-[1px] bg-green-500/10 absolute" />
        </div>

        {/* Scanning Sweep */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 origin-center"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(34,197,94,0.3) 360deg)',
          }}
        />

        {/* Pings */}
        <AnimatePresence>
          {pings.map(ping => (
            <motion.div
              key={ping.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              className="absolute w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]"
              style={{ left: `${ping.x}%`, top: `${ping.y}%` }}
            >
              <div className="absolute inset-0 animate-ping bg-green-400 rounded-full" />
            </motion.div>
          ))}
        </AnimatePresence>

        <RadarIcon size={40} className="text-green-500 relative z-10 animate-pulse" />
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-xs">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center">
          <Target className="text-blue-400 mb-1" size={20} />
          <span className="text-[10px] text-gray-500 uppercase font-bold">Sinais</span>
          <span className="text-xl font-black text-white">12</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center">
          <Zap className="text-yellow-400 mb-1" size={20} />
          <span className="text-[10px] text-gray-500 uppercase font-bold">Hot</span>
          <span className="text-xl font-black text-white">3</span>
        </div>
      </div>
    </div>
  );
}
