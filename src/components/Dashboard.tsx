
import { Search, Package, LayoutGrid, Zap, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  const objectCount = 24; // Simulation : données à lier plus tard à ta base
  const limit = 50;
  const percentage = (objectCount / limit) * 100;

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-24 font-sans text-slate-900">
      {/* Header : Recherche Sémantique */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="text-slate-400" size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Où est ma clé à molette ?" 
          className="w-full pl-10 pr-4 py-3 bg-white border-none rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Widget : Jauge Freemium */}
      <div className="bg-white p-5 rounded-2xl shadow-sm mb-6 border border-slate-100">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Package size={16} /> Inventaire Global
          </h3>
          <span className="text-xs font-mono font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded">
            MODE FREEMIUM
          </span>
        </div>
        
        <div className="flex items-end justify-between mb-2">
          <span className="text-3xl font-black text-slate-800">{objectCount} <span className="text-lg text-slate-400 font-medium">/ {limit}</span></span>
          <span className="text-sm font-bold text-slate-500">{Math.round(percentage)}% utilisé</span>
        </div>

        {/* Barre de progression avec seuil de vigilance */}
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${percentage > 80 ? 'bg-orange-500' : 'bg-blue-600'}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        {percentage > 80 && (
          <p className="text-[10px] text-orange-600 mt-2 font-bold animate-pulse">
            ⚠️ Capacité presque atteinte. Pensez au mode Master Class Illimité.
          </p>
        )}
      </div>

      {/* Grille des Zones Actives */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2">
          <LayoutGrid className="text-blue-500" />
          <span className="text-sm font-bold">Garage</span>
          <span className="text-[10px] text-slate-400">18 objets</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 opacity-50">
          <Zap className="text-yellow-500" />
          <span className="text-sm font-bold">Atelier</span>
          <span className="text-[10px] text-slate-400">Verrouillé</span>
        </div>
      </div>

      {/* Rappel Sécurité & Vigilance */}
      <div className="mt-8 p-4 bg-slate-800 rounded-2xl text-white">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="text-green-400" />
          <span className="text-sm font-bold tracking-tight">Vigilance & Contrôle</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Prochain scan requis : Contrôle du gainage des outils électriciens. <br/>
          <span className="text-white font-bold italic">Rappel : Procédure VAT obligatoire.</span>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;