import { useState } from 'react';
import { Box, Lock, ChevronRight, AlertCircle, LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
  const [showGarageDetails, setShowGarageDetails] = useState(false);

  // 📊 DONNÉES DE L'INVENTAIRE (Calculées pour corriger tes erreurs)
  const objectCount = 24;
  const maxCapacity = 50;
  const percentage = (objectCount / maxCapacity) * 100;

  // 🚗 VUE DÉTAILLÉE DU GARAGE
  if (showGarageDetails) {
    return (
      <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
        <button 
          onClick={() => setShowGarageDetails(false)} 
          className="flex items-center gap-2 text-blue-600 font-bold p-2 hover:bg-blue-50 rounded-lg transition-colors"
        >
          ← Retour à l'accueil
        </button>
        
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Inventaire : Garage</h2>
          <p className="text-slate-500 text-sm mb-6 font-medium">18 OBJET(S) RÉPERTORIÉ(S)</p>
          
          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
              <span className="font-medium text-slate-700">Outils scannés récemment...</span>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-bold">95% SCAN OK</span>
            </div>
            {/* Les futurs objets scannés apparaîtront ici */}
          </div>
        </div>
      </div>
    );
  }

  // 🏠 VUE PRINCIPALE
  return (
    <div className="p-6 space-y-8 pb-32">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="text-blue-600" size={28} />
        <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Dashboard</h1>
      </div>

      {/* JAUGE DE CAPACITÉ */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Inventaire Global</p>
            <h2 className="text-4xl font-black text-slate-800">{objectCount} <span className="text-lg text-slate-300 font-medium">/ {maxCapacity}</span></h2>
          </div>
          <p className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{Math.round(percentage)}% utilisé</p>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${percentage > 80 ? 'bg-orange-500' : 'bg-blue-600'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* GRILLE DES SECTEURS */}
      <div className="grid grid-cols-1 gap-4">
        {/* BOUTON GARAGE - MAINTENANT ACTIF */}
        <button 
          onClick={() => setShowGarageDetails(true)}
          className="w-full text-left bg-white p-6 rounded-[2rem] border-2 border-transparent hover:border-blue-100 shadow-sm active:scale-[0.98] transition-all group"
        >
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Box size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Garage</h3>
                <p className="text-xs text-blue-500 font-bold uppercase tracking-widest">Actif • 18 Objets</p>
              </div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-blue-600 transition-colors" />
          </div>
        </button>

        {/* ATELIER - VERROUILLÉ */}
        <div className="bg-slate-50/50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200 opacity-60">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className="bg-slate-200 p-4 rounded-2xl text-slate-400"><Lock size={24} /></div>
              <div>
                <h3 className="font-bold text-slate-400 text-lg">Atelier</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Verrouillé</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BANDEAU VIGILANCE */}
      <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl">
        <div className="flex gap-3 items-center mb-3">
          <AlertCircle className="text-emerald-400" size={20} />
          <h4 className="font-bold text-sm uppercase tracking-wider">Vigilance & Contrôle</h4>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed">
          Prochain scan requis : Contrôle du gainage des outils. <br/>
          <span className="text-white font-bold italic">Rappel : Procédure VAT obligatoire.</span>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;