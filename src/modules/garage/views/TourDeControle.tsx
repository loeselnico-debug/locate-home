import React, { useState } from 'react';
import { ArrowLeft, ShieldAlert, CheckCircle2, AlertOctagon, Activity, Wrench, BellRing } from 'lucide-react';

interface TourDeControleProps {
  onBack: () => void;
}

// Simulation de la base de données (Supabase)
const MOCK_FLEET = [
  { id: 'FACOM-JET-001', user: 'Alexandre (TECH-01)', status: 'CONFORME', time: '07:58', tags: [], details: '' },
  { id: 'OPSIAL-MEC-004', user: 'Marc (TECH-02)', status: 'DEGRADE', time: '08:05', tags: ['Outil sur chantier', 'Rangement chaos'], details: 'Pince étau restée sur la vanne 4.' },
  { id: 'FACOM-ELEC-002', user: 'Sarah (TECH-03)', status: 'EN_ATTENTE', time: '--:--', tags: [], details: '' },
];

const TourDeControle: React.FC<TourDeControleProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'ALERTS'>('ALL');

  const anomaliesCount = MOCK_FLEET.filter(s => s.status === 'DEGRADE').length;
  const displayFleet = activeTab === 'ALERTS' ? MOCK_FLEET.filter(s => s.status === 'DEGRADE') : MOCK_FLEET;

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
            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Tour de Contrôle M5</span>
          </div>
        </div>
        
        {/* NOTIFICATION SMART PUSH (Indicateur) */}
        {anomaliesCount > 0 && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-full animate-pulse">
            <BellRing size={14} className="text-red-500" />
            <span className="text-red-500 font-black text-[10px] tracking-widest">{anomaliesCount} ALERTE(S)</span>
          </div>
        )}
      </div>

      {/* KPI / FILTRES */}
      <div className="p-[4vw] flex gap-3">
        <button 
          onClick={() => setActiveTab('ALL')}
          className={`flex-1 py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
            activeTab === 'ALL' ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5 opacity-50'
          }`}
        >
          <span className="text-white font-black text-lg leading-none">{MOCK_FLEET.length}</span>
          <span className="text-gray-400 font-bold uppercase tracking-widest text-[8px]">Flotte Totale</span>
        </button>
        <button 
          onClick={() => setActiveTab('ALERTS')}
          className={`flex-1 py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
            activeTab === 'ALERTS' ? 'bg-red-500/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-transparent border-red-500/20 opacity-50'
          }`}
        >
          <span className="text-red-500 font-black text-lg leading-none">{anomaliesCount}</span>
          <span className="text-red-500 font-bold uppercase tracking-widest text-[8px]">Anomalies FOD</span>
        </button>
      </div>

      {/* LISTE DES SERVANTES */}
      <div className="flex-1 overflow-y-auto px-[4vw] space-y-3 pb-6 no-scrollbar">
        <h3 className="text-[#D3D3D3] font-bold text-[10px] uppercase tracking-widest mb-4 border-b border-white/10 pb-2">
          État du Parc Outillage
        </h3>

        {displayFleet.map((servante) => (
          <div key={servante.id} className="bg-[#1A1A1A] border border-white/5 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
            
            {/* Ligne de bordure couleur statut */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
              servante.status === 'CONFORME' ? 'bg-green-500' : 
              servante.status === 'DEGRADE' ? 'bg-red-500' : 'bg-gray-600'
            }`} />

            <div className="flex justify-between items-start pl-2">
              <div>
                <h4 className="text-white font-black text-sm uppercase tracking-wider">{servante.id}</h4>
                <p className="text-gray-400 text-[10px] uppercase tracking-widest flex items-center gap-1 mt-1">
                  <Wrench size={10} /> {servante.user}
                </p>
              </div>
              
              {/* Badge Statut */}
              <div className={`px-2 py-1 rounded border flex items-center gap-1.5 ${
                servante.status === 'CONFORME' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                servante.status === 'DEGRADE' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
                'bg-white/5 border-white/10 text-gray-400'
              }`}>
                {servante.status === 'CONFORME' && <CheckCircle2 size={12} />}
                {servante.status === 'DEGRADE' && <AlertOctagon size={12} />}
                {servante.status === 'EN_ATTENTE' && <ShieldAlert size={12} />}
                <span className="font-black text-[9px] tracking-widest">{servante.status}</span>
              </div>
            </div>

            {/* Zone d'Anomalie (Affichée uniquement si dégradé) */}
            {servante.status === 'DEGRADE' && (
              <div className="mt-2 bg-red-950/30 border border-red-500/20 rounded-lg p-3 pl-4 relative">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {servante.tags.map(tag => (
                    <span key={tag} className="bg-red-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-red-200/70 text-xs italic">"{servante.details}"</p>
                
                {/* Bouton d'action pour le chef */}
                <button className="mt-3 w-full bg-black/50 border border-red-500/30 text-red-400 py-2 rounded text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors">
                  Voir le rapport PDF
                </button>
              </div>
            )}
            
            <div className="text-right mt-1">
              <span className="text-gray-600 font-bold text-[9px] uppercase tracking-widest">
                MÀJ : {servante.time}
              </span>
            </div>
          </div>
        ))}

        {displayFleet.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-10 font-bold uppercase tracking-widest">
            Aucune anomalie détectée.
          </div>
        )}
      </div>
    </div>
  );
};

export default TourDeControle;