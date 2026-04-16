import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { Opportunity } from '../types';
import { OpportunityCard } from './OpportunityCard';

interface LocalOpportunitiesProps {
  opportunities: Opportunity[];
}

export function LocalOpportunities({ opportunities }: LocalOpportunitiesProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const localOps = opportunities.filter(op => op.category === 'local');

  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Permissão negada. Por favor, ative a localização nas configurações do navegador.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Informações de localização indisponíveis.");
            break;
          case err.TIMEOUT:
            setError("Tempo limite esgotado ao tentar obter localização.");
            break;
          default:
            setError("Ocorreu um erro desconhecido ao obter localização.");
            break;
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <MapPin size={80} className="text-blue-400" />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">Oportunidades Locais</h2>
          <p className="text-blue-400 text-sm mb-6 font-medium">
            {error ? (
              <div className="flex flex-col gap-2">
                <span className="text-red-400">{error}</span>
                <span className="text-[10px] text-gray-500 uppercase font-bold">Dica: Tente abrir o app em uma nova aba se o problema persistir.</span>
              </div>
            ) : location ? (
              `Detectamos ${localOps.length} oportunidades próximas a você.`
            ) : (
              "Ative sua localização para ver oportunidades na sua região."
            )}
          </p>

          <button
            onClick={requestLocation}
            disabled={isLocating}
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-400 transition-colors disabled:opacity-50"
          >
            {isLocating ? <RefreshCcw size={18} className="animate-spin" /> : <Navigation size={18} />}
            {location ? "Atualizar Localização" : "Ativar GPS"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {localOps.length > 0 ? (
          localOps.map((op: Opportunity) => (
            <OpportunityCard key={op.id} opportunity={op} />
          ))
        ) : (
          <div className="text-center py-12">
            <MapPin size={48} className="text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Nenhuma oportunidade local detectada no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
