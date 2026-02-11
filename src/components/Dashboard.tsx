import { useState } from 'react';
import { Box, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const [showGarageDetails, setShowGarageDetails] = useState(false);

  // DONNÉES DE L'INVENTAIRE
  const objectCount = 24;
  const maxCapacity = 50;
  const percentage = (objectCount / maxCapacity) * 100;

  // 1. VUE DÉTAILLÉE DU GARAGE
  if (showGarageDetails) {
    return (
      <div className="p-6 space-y-6 bg-slate-900 min-h-screen text-white">
        <button 
          onClick={() => setShowGarageDetails(false)} 
          className="text-orange-500 font-bold p-2 hover:bg-orange-500/10 rounded-lg transition-colors"
        >
          ← RETOUR
        </button>
        <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-xl">
          <h2 className="text-2xl font-black uppercase italic">Secteur : <span className="text-orange-500">Garage</span></h2>
          <p className="text-slate-400 text-sm mt-2 font-bold uppercase tracking-widest">18 Objets enregistrés</p>
          <div className="mt-6 p-4 bg-slate-900/50 rounded-2xl border border-slate-700 text-slate-500 italic text-sm text-center">
            Liste des outils en cours de synchronisation...
          </div>
        </div>
      </div>
    );
  }

  // 2. VUE PRINCIPALE (DASHBOARD ANTHRACITE)
  return (
    <div className="p-6 space-y-8 pb-32 bg-slate-900 min-h-screen">
      {/* LOGO & STATUT */}
<div className="flex items-center justify-between pt-2">
  <div className="flex items-center gap-3">
    {/* Montage du logo réel */}
    <img 
      src="/logo.png" 
      alt="Locate Home" 
      className="h-10 w-auto object-contain brightness-110 drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]" 
    />
    <h1 className="text-xl font-black text-white tracking-tighter uppercase italic">
      Locate <span className="text-orange-500">Home</span>
    </h1>
  </div>
  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
</div>

      {/* JAUGE DE CAPACITÉ ORANGE */}
      <div className="bg-slate-800 p-6 rounded-[2.5rem] border border-slate-700 shadow-2xl">
        <div className="flex justify-between items-end mb-4 text-left">
          <div>
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1">Capacité Système</p>
            <h2 className="text-4xl font-black text-white">{objectCount} <span className="text-lg text-slate-500">/ {maxCapacity}</span></h2>
          </div>
          <p className="text-sm font-bold text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full">{Math.round(percentage)}%</p>
        </div>
        <div className="w-full bg-slate-950 h-4 rounded-full p-1 border border-slate-700">
          <div 
            className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* BOUTON GARAGE */}
      <button 
        onClick={() => setShowGarageDetails(true)}
        className="w-full text-left bg-white p-6 rounded-[2rem] shadow-xl active:scale-95 transition-all group"
      >
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center text-left">
            <div className="bg-slate-900 p-4 rounded-2xl text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <Box size={24} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight leading-none">Garage</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Secteur Alpha • 18 Objets</p>
            </div>
          </div>
          <ChevronRight className="text-slate-300 group-hover:text-orange-500 transition-colors" />
        </div>
      </button>

      {/* BANDEAU VIGILANCE */}
      <div className="bg-slate-950 p-6 rounded-[2rem] border border-slate-800 shadow-xl">
        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Vigilance & Contrôle</p>
        <p className="text-slate-400 text-xs leading-relaxed">
          Prochain scan requis : Contrôle du gainage. <br/>
          <span className="text-white font-bold italic">Rappel : Procédure VAT obligatoire.</span>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;