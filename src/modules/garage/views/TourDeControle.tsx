import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldAlert, CheckCircle2, AlertOctagon, Activity, Wrench, BellRing, Loader2 } from 'lucide-react';
import { supabase } from '../../../core/security/supabaseClient';

interface TourDeControleProps {
  onBack: () => void;
}

interface ServanteStatus {
  id: string;
  technician_id: string;
  technician_name: string;
  status: 'CONFORME' | 'DEGRADE' | 'EN_ATTENTE';
  tags: string[];
  details: string;
  updated_at: string;
}

const TourDeControle: React.FC<TourDeControleProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'ALERTS'>('ALL');
  const [fleet, setFleet] = useState<ServanteStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // NOUVEAU : Chargement de la BDD et écoute en temps réel
  useEffect(() => {
    fetchFleet();

    // On s'abonne aux modifications en direct sur Supabase
    const channel = supabase
      .channel('public:servantes_status')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'servantes_status' }, (payload) => {
        console.log("Mise à jour captée en direct :", payload);
        fetchFleet(); // On recharge les données à chaque signal
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchFleet = async () => {
    const { data, error } = await supabase
      .from('servantes_status')
      .select('*')
      .order('id', { ascending: true });

    if (!error && data) {
      setFleet(data as ServanteStatus[]);
    } else {
      console.error("Erreur de récupération :", error);
    }
    setIsLoading(false);
  };

  const anomaliesCount = fleet.filter(s => s.status === 'DEGRADE').length;
  const displayFleet = activeTab === 'ALERTS' ? fleet.filter(s => s.status === 'DEGRADE') : fleet;

  return (
    <div className="w-full h-full bg-[#121212] flex flex-col font-sans">
      
      {/* HEADER TACTIQUE */}
      <div className="h-[12vh] shrink-0 bg-[#1A1A1A] border-b border-white/10 flex items-center justify-between px-[4vw]">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-12 h-12 bg-black/20 rounded-xl flex items-center justify-center border border-white/5 active:scale-90 transition-transform">
            <ArrowLeft className="text-white" size={24} />
          </button>
          <div>
            <h2 className="text-white font-black uppercase tracking-widest text-lg leading-none flex items-center gap-2">
              <Activity size={18} className="text-[#00E5FF]" /> Supervision
            </h2>
            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
              Tour de Contrôle M5 
              {isLoading ? <Loader2 size={10} className="animate-spin text-[#00E5FF]" /> : <span className="text-green-500">● LIVE</span>}
            </span>
          </div>
        </div>
        
        {anomaliesCount > 0 && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-full animate-pulse">
            <BellRing size={14} className="text-red-500" />
            <span className="text-red-500 font-black text-[10px] tracking-widest">{anomaliesCount} ALERTE(S)</span>
          </div>
        )}
      </div>

      {/* KPI / FILTRES */}
      <div className="p-[4vw] flex gap-3">
        <button onClick={() => setActiveTab('ALL')} className={`flex-1 py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${activeTab === 'ALL' ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5 opacity-50'}`}>
          <span className="text-white font-black text-lg leading-none">{fleet.length}</span>
          <span className="text-gray-400 font-bold uppercase tracking-widest text-[8px]">Flotte Totale</span>
        </button>
        <button onClick={() => setActiveTab('ALERTS')} className={`flex-1 py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${activeTab === 'ALERTS' ? 'bg-red-500/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-transparent border-red-500/20 opacity-50'}`}>
          <span className="text-red-500 font-black text-lg leading-none">{anomaliesCount}</span>
          <span className="text-red-500 font-bold uppercase tracking-widest text-[8px]">Anomalies FOD</span>
        </button>
      </div>

      {/* LISTE DES SERVANTES (Données Réelles) */}
      <div className="flex-1 overflow-y-auto px-[4vw] space-y-3 pb-6 no-scrollbar">
        <h3 className="text-[#D3D3D3] font-bold text-[10px] uppercase tracking-widest mb-4 border-b border-white/10 pb-2">
          État du Parc Outillage
        </h3>

        {isLoading && fleet.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-50">
             <Loader2 size={32} className="text-white animate-spin mb-4" />
             <span className="text-white text-xs tracking-widest uppercase">Connexion satellite...</span>
          </div>
        ) : displayFleet.map((servante) => {
          
          // Formatage de l'heure (ex: 08:15)
          const timeString = new Date(servante.updated_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

          return (
            <div key={servante.id} className="bg-[#1A1A1A] border border-white/5 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${servante.status === 'CONFORME' ? 'bg-green-500' : servante.status === 'DEGRADE' ? 'bg-red-500' : 'bg-gray-600'}`} />

              <div className="flex justify-between items-start pl-2">
                <div>
                  <h4 className="text-white font-black text-sm uppercase tracking-wider">{servante.id}</h4>
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest flex items-center gap-1 mt-1">
                    <Wrench size={10} /> {servante.technician_name || 'Non assigné'}
                  </p>
                </div>
                
                <div className={`px-2 py-1 rounded border flex items-center gap-1.5 ${servante.status === 'CONFORME' ? 'bg-green-500/10 border-green-500/30 text-green-500' : servante.status === 'DEGRADE' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                  {servante.status === 'CONFORME' && <CheckCircle2 size={12} />}
                  {servante.status === 'DEGRADE' && <AlertOctagon size={12} />}
                  {servante.status === 'EN_ATTENTE' && <ShieldAlert size={12} />}
                  <span className="font-black text-[9px] tracking-widest">{servante.status}</span>
                </div>
              </div>

              {servante.status === 'DEGRADE' && (
                <div className="mt-2 bg-red-950/30 border border-red-500/20 rounded-lg p-3 pl-4 relative">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {servante.tags && servante.tags.map(tag => (
                      <span key={tag} className="bg-red-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {servante.details && <p className="text-red-200/70 text-xs italic">"{servante.details}"</p>}
                </div>
              )}
              
              <div className="text-right mt-1">
                <span className="text-gray-600 font-bold text-[9px] uppercase tracking-widest">
                  MÀJ : {timeString}
                </span>
              </div>
            </div>
          );
        })}

        {!isLoading && displayFleet.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-10 font-bold uppercase tracking-widest">
            Aucune anomalie détectée.
          </div>
        )}
      </div>
    </div>
  );
};

export default TourDeControle;