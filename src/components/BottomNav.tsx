import React from 'react';
import { Home, Radar, MapPin, MessageSquare, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'home', icon: Home, label: 'Início' },
  { id: 'radar', icon: Radar, label: 'Radar' },
  { id: 'local', icon: MapPin, label: 'Local' },
  { id: 'chat', icon: MessageSquare, label: 'IA' },
  { id: 'ranking', icon: Trophy, label: 'Ranking' },
];

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 px-6 py-3 pb-8 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-green-400 scale-110" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <div className={cn(
                "p-2 rounded-2xl transition-all",
                isActive && "bg-green-400/10 shadow-[0_0_15px_rgba(74,222,128,0.2)]"
              )}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
