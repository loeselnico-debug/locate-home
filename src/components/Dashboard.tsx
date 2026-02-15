import React, { useState, useEffect } from 'react';
import { ChevronRight, ShieldCheck, Settings } from 'lucide-react';
import { memoryService } from '../services/memoryService';
import { TIERS_CONFIG } from '../constants/tiers';
import type { UserTier } from '../constants/tiers';
import type { ToolMemory } from '../types';

// Style pour les panneaux et boutons
const panelStyle = "bg-anthracite-light border border-anthracite-border rounded-[1.5rem] shadow-xl backdrop-blur-sm relative overflow-hidden";
const mainActionButtonStyle = "w-full bg-phoenix-orange hover:bg-orange-500 active:scale-[0.98] transition-all duration-200 p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgba(255,102,0,0.3)] flex justify-between items-center group relative overflow-hidden border border-orange-400/20";

interface DashboardProps {
  tier: UserTier;
  onNavigate: (page: 'scanner' | 'library' | 'search') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tier, onNavigate }) => {
  const [tools, setTools] = useState<ToolMemory[]>([]);
  const config = TIERS_CONFIG[tier];

  useEffect(() => {
    setTools(memoryService.getTools());
  }, []);

  const objectCount = tools.length;
  const maxCapacity = config.itemLimit;
  const percentage = Math.min((objectCount / maxCapacity) * 100, 100);

  return (
    <div className="p-8 space-y-8 pb-32 min-h-screen">
      
      {/* HEADER AVEC LOGO PNG */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex flex-col">
          <img src="/logo.png" alt="Locate Home" className="h-14 w-auto object-contain mb-1 filter drop-shadow-lg" />
          <div className="flex items-center gap-1 pl-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.3em]">System Active • V1.2</span>
          </div>
        </div>
        <button className="p-3 bg-anthracite-light rounded-xl border border-anthracite-border hover:border-phoenix-orange/50 transition-colors">
          <Settings className="w-6 h-6 text-slate-400" />
        </button>
      </div>

      {/* JAUGE CAPACITÉ */}
      <div className={`${panelStyle} p-8`}>
        <div className="flex justify-between items-end mb-6">
          <div className="text-left">
            <p className="text-xs font-black text-phoenix-orange uppercase tracking-[0.2em] mb-2">Capacité système</p>
            <h2 className="text-5xl font-black text-white tracking-tight">{objectCount} <span className="text-xl text-slate-500 font-medium">/ {maxCapacity}</span></h2>
          </div>
          <p className="text-lg font-bold text-phoenix-orange">{Math.round(percentage)}%</p>
        </div>
        <div className="w-full bg-black/50 h-5 rounded-full p-[2px] border border-anthracite-border/50 shadow-inner">
          <div className="h-full rounded-full bg-gradient-to-r from-phoenix-orange to-orange-400 shadow-[0_0_15px_#FF6600]" style={{ width: `${percentage}%` }} />
        </div>
      </div>

      {/* ACTIONS AVEC ICONES PNG */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bouton SCANNER */}
        <button onClick={() => onNavigate('scanner')} className={mainActionButtonStyle}>
          <div className="flex gap-5 items-center z-10">
            <div className="bg-black/30 p-2 rounded-2xl border border-white/10 w-20 h-20 flex items-center justify-center overflow-hidden">
              <img src="/icon-scanner.png" alt="Scan" className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-left">
              <h3 className="font-black text-white text-xl uppercase leading-none italic">Scanner</h3>
              <p className="text-xs text-orange-100 font-bold uppercase tracking-widest mt-2">Identification IA</p>
            </div>
          </div>
          <ChevronRight className="text-white/50" />
        </button>
        
        {/* Bouton RANGER */}
        <button onClick={() => onNavigate('library')} className={mainActionButtonStyle}>
          <div className="flex gap-5 items-center z-10">
            <div className="bg-black/30 p-2 rounded-2xl border border-white/10 w-20 h-20 flex items-center justify-center overflow-hidden">
              <img src="/icon-ranger.png" alt="Ranger" className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-left">
              <h3 className="font-black text-white text-xl uppercase leading-none italic">Ranger</h3>
              <p className="text-xs text-orange-100 font-bold uppercase tracking-widest mt-2">Inventaire Pro</p>
            </div>
          </div>
          <ChevronRight className="text-white/50" />
        </button>
      </div>

      {/* BANDEAU SÉCURITÉ */}
      <div className={`${panelStyle} p-6 flex items-start gap-4 bg-anthracite-light/50`}>
        <ShieldCheck className="text-emerald-500 shrink-0" size={24} />
        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-wider mb-1">Vigilance Active</h4>
          <p className="text-slate-400 text-[10px] font-mono leading-tight">Validation IA fixée à 70.0%.</p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;