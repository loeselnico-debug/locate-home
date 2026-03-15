import React, { useState } from 'react';
import { ArrowLeft, ScanQrCode, Mic, ClipboardCheck, Factory, Wrench, Settings, Shield, ShieldAlert, HardHat, User } from 'lucide-react';
import LiveAssistant from '../components/LiveAssistant';
import { useUserTier } from '../../../core/security/useUserTier';
import PriseDePoste from './PriseDePoste';
import TourDeControle from './TourDeControle';
import FinDePoste from './FinDePoste';
import TechProfile from './TechProfile';
import PreparationChantier from './PreparationChantier';

interface GarageDashboardProps {
  onBack?: () => void;
}

type ViewState = 'home' | 'maintenance_menu' | 'maintenance_live' | 'prepa_chantier' | 'mecanique_menu' | 'mecanique_live' | 'prise_poste' | 'fin_poste' | 'tour_controle_maint' | 'tour_controle_mec' | 'tech_profile_maint' | 'tech_profile_mec' | 'admin_settings';

const GarageDashboard: React.FC<GarageDashboardProps> = ({ onBack }) => {
  const [activeMode, setActiveMode] = useState<ViewState>('home');
  const { currentTier } = useUserTier();

  // =======================================================================
  // ROUTAGE DES VUES GLOBALES & ADMINISTRATIVES
  // =======================================================================
  if (activeMode === 'admin_settings') {
    return (
      <div className="w-full h-full bg-[#121212] flex flex-col p-6 justify-center items-center text-center font-sans">
         <Settings size={64} className="text-gray-500 mb-6 animate-[spin_10s_linear_infinite]" />
         <h2 className="text-white font-black uppercase tracking-widest text-xl mb-3">Zone Administrative</h2>
         <p className="text-gray-400 text-xs mb-8 leading-relaxed max-w-sm">
           Gestion des abonnements PRO, facturation, CGU, CGV et Politique de confidentialité. (En cours de développement).
         </p>
         <button onClick={() => setActiveMode('home')} className="px-8 py-4 bg-white/10 text-white rounded-xl font-black uppercase text-xs tracking-widest active:scale-95 transition-transform border border-white/20">
           Retour au Hub
         </button>
      </div>
    );
  }

  // =======================================================================
  // ROUTAGE UNIVERS MAINTENANCE (M5)
  // =======================================================================
  if (activeMode === 'tech_profile_maint') return <TechProfile onBack={() => setActiveMode('maintenance_menu')} />;
  if (activeMode === 'tour_controle_maint') return <TourDeControle onBack={() => setActiveMode('maintenance_menu')} />;
  if (activeMode === 'prepa_chantier') return <PreparationChantier onBack={() => setActiveMode('maintenance_menu')} />;
  if (activeMode === 'maintenance_live') return <LiveAssistant mode="maintenance" onExit={() => setActiveMode('maintenance_menu')} />;

  // =======================================================================
  // ROUTAGE UNIVERS MÉCANIQUE AUTO / PL
  // =======================================================================
  if (activeMode === 'tech_profile_mec') return <TechProfile onBack={() => setActiveMode('mecanique_menu')} />;
  if (activeMode === 'tour_controle_mec') return <TourDeControle onBack={() => setActiveMode('mecanique_menu')} />;
  if (activeMode === 'prise_poste') return <PriseDePoste onBack={() => setActiveMode('mecanique_menu')} />;
  if (activeMode === 'fin_poste') return <FinDePoste onBack={() => setActiveMode('mecanique_menu')} />;
  if (activeMode === 'mecanique_live') return <LiveAssistant mode="mecanique" onExit={() => setActiveMode('mecanique_menu')} />;

  // =======================================================================
  // VUE 1 : SOUS-MENU MAINTENANCE INDUSTRIELLE (Thème Cyan)
  // =======================================================================
  if (activeMode === 'maintenance_menu') {
    return (
      <div className="w-full h-full bg-[#121212] flex flex-col font-sans px-[4vw] pt-[2vh] pb-[1.5vh] gap-[2vh]">
        
        {/* HEADER MAINTENANCE */}
        <div className="h-[10vh] min-h-[64px] bg-[#121212] border border-[#00E5FF]/30 rounded-2xl flex items-center px-[4vw] shrink-0 shadow-lg mb-2">
          <button onClick={() => setActiveMode('home')} className="mr-4 active:scale-90 transition-transform">
            <ArrowLeft className="text-[#00E5FF]" size={24} />
          </button>
          <div className="flex flex-col min-w-0">
            <h2 className="text-[clamp(1.1rem,4vw,1.4rem)] font-black uppercase tracking-widest text-white leading-none whitespace-nowrap truncate">
              Maintenance Indus.
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF] mt-1">
              Terminal Opérateur M5
            </span>
          </div>
        </div>

        {/* HEADER OUTILS RAPIDES (MAINTENANCE) */}
        <header className="flex items-center justify-between mb-2 px-2 shrink-0">
          <div className="flex gap-3">
            <button onClick={() => setActiveMode('tech_profile_maint')} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors active:scale-90 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
              <User size={16} /> <span className="text-[9px] font-bold uppercase tracking-widest">Fiche Tech</span>
            </button>
            <button onClick={() => setActiveMode('tour_controle_maint')} className="flex items-center gap-2 text-[#00E5FF] hover:text-white transition-colors active:scale-90 bg-[#00E5FF]/10 px-3 py-2 rounded-lg border border-[#00E5FF]/30">
              <ShieldAlert size={16} /> <span className="text-[9px] font-bold uppercase tracking-widest">Supervision</span>
            </button>
          </div>
        </header>

        {/* BOUTON PRÉPARATION CHANTIER */}
        <button 
          onClick={() => setActiveMode('prepa_chantier')}
          className="flex-1 relative overflow-hidden bg-black border border-[#00E5FF]/50 hover:border-[#00E5FF] rounded-2xl flex flex-col justify-center items-center active:scale-[0.98] transition-all group"
        >
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,229,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.05)_1px,transparent_1px)] bg-[size:4vw_4vw]"></div>
          <HardHat className="text-[#00E5FF] mb-4 relative z-10 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]" size={56} />
          <h3 className="text-[clamp(1.5rem,5vw,2rem)] font-black uppercase tracking-widest text-white leading-none relative z-10 text-center">
            Prépa. Chantier
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2 relative z-10">
            Plan de Prévention IA & Inventaire
          </span>
        </button>

        {/* BOUTON ASSISTANT IA LIVE */}
        <button 
          onClick={() => setActiveMode('maintenance_live')}
          className="flex-1 relative overflow-hidden bg-black border border-[#D3D3D3]/50 hover:border-[#D3D3D3] rounded-2xl flex flex-col justify-center items-center active:scale-[0.98] transition-all group hover:shadow-[0_0_30px_rgba(211,211,211,0.15)]"
        >
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(211,211,211,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(211,211,211,0.05)_1px,transparent_1px)] bg-[size:4vw_4vw]"></div>
          <Mic className="text-[#D3D3D3] mb-4 relative z-10 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(211,211,211,0.3)]" size={56} />
          <h3 className="text-[clamp(1.5rem,5vw,2rem)] font-black uppercase tracking-widest text-white leading-none relative z-10 text-center">
            Assistant IA
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2 relative z-10">
            Diagnostic & Guidage Vidéo
          </span>
        </button>

      </div>
    );
  }

  // =======================================================================
  // VUE 2 : SOUS-MENU MÉCANIQUE AUTO / PL (Thème Rouge)
  // =======================================================================
  if (activeMode === 'mecanique_menu') {
    return (
      <div className="w-full h-full bg-[#121212] flex flex-col font-sans px-[4vw] pt-[2vh] pb-[1.5vh] gap-[2vh]">
        
        {/* HEADER MÉCANIQUE */}
        <div className="h-[10vh] min-h-[64px] bg-[#121212] border border-[#DC2626]/30 rounded-2xl flex items-center px-[4vw] shrink-0 shadow-lg mb-2">
          <button onClick={() => setActiveMode('home')} className="mr-4 active:scale-90 transition-transform">
            <ArrowLeft className="text-[#DC2626]" size={24} />
          </button>
          <div className="flex flex-col min-w-0">
            <h2 className="text-[clamp(1.1rem,4vw,1.4rem)] font-black uppercase tracking-widest text-white leading-none whitespace-nowrap truncate">
              Mécanique Auto & P.L.
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#DC2626] mt-1">
              Terminal Opérateur
            </span>
          </div>
        </div>

        {/* HEADER OUTILS RAPIDES (MÉCANIQUE) */}
        <header className="flex items-center justify-between mb-2 px-2 shrink-0">
          <div className="flex gap-3">
            <button onClick={() => setActiveMode('tech_profile_mec')} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors active:scale-90 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
              <User size={16} /> <span className="text-[9px] font-bold uppercase tracking-widest">Fiche Tech</span>
            </button>
            <button onClick={() => setActiveMode('tour_controle_mec')} className="flex items-center gap-2 text-[#DC2626] hover:text-white transition-colors active:scale-90 bg-[#DC2626]/10 px-3 py-2 rounded-lg border border-[#DC2626]/30">
              <ShieldAlert size={16} /> <span className="text-[9px] font-bold uppercase tracking-widest">Supervision</span>
            </button>
          </div>
        </header>

        {/* BOUTON PRISE DE POSTE */}
        <button onClick={() => setActiveMode('prise_poste')} className="flex-1 relative overflow-hidden bg-black border border-[#DC2626]/50 hover:border-[#DC2626] rounded-2xl flex flex-col justify-center items-center active:scale-[0.98] transition-all group">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(220,38,38,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.05)_1px,transparent_1px)] bg-[size:4vw_4vw]"></div>
          <ScanQrCode className="text-[#DC2626] mb-4 relative z-10 group-hover:scale-110 transition-transform" size={56} />
          <h3 className="text-[clamp(1.5rem,5vw,2rem)] font-black uppercase tracking-widest text-white leading-none relative z-10 text-center">Prise de Poste</h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2 relative z-10">Contrôle Outillage FOD</span>
        </button>

        {/* BOUTON ASSISTANT IA */}
        <button onClick={() => setActiveMode('mecanique_live')} className="flex-1 relative overflow-hidden bg-black border border-[#D3D3D3]/50 hover:border-[#D3D3D3] rounded-2xl flex flex-col justify-center items-center active:scale-[0.98] transition-all group hover:shadow-[0_0_30px_rgba(211,211,211,0.15)]">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(211,211,211,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(211,211,211,0.05)_1px,transparent_1px)] bg-[size:4vw_4vw]"></div>
          <Mic className="text-[#D3D3D3] mb-4 relative z-10 group-hover:scale-110 transition-transform" size={56} />
          <h3 className="text-[clamp(1.5rem,5vw,2rem)] font-black uppercase tracking-widest text-white leading-none relative z-10 text-center">Assistant IA</h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2 relative z-10">Diagnostic OBD2 & Guidage</span>
        </button>

        {/* BOUTON FIN DE POSTE */}
        <button onClick={() => setActiveMode('fin_poste')} className="flex-1 relative overflow-hidden bg-black border border-[#DC2626]/50 hover:border-[#DC2626] rounded-2xl flex flex-col justify-center items-center active:scale-[0.98] transition-all group">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(220,38,38,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.05)_1px,transparent_1px)] bg-[size:4vw_4vw]"></div>
          <ClipboardCheck className="text-[#DC2626] mb-4 relative z-10 group-hover:scale-110 transition-transform" size={56} />
          <h3 className="text-[clamp(1.5rem,5vw,2rem)] font-black uppercase tracking-widest text-white leading-none relative z-10 text-center">Fin de Poste</h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2 relative z-10">Rapport Anti-Perte (FOD)</span>
        </button>

      </div>
    );
  }

  // =======================================================================
  // VUE 0 : MENU PRINCIPAL (AIGUILLEUR RACINE)
  // =======================================================================
  return (
    <div className="w-full h-full bg-[#121212] flex flex-col font-sans px-[4vw] pt-[2vh] pb-[1.5vh] gap-[2vh]">
      
      {/* HEADER RACINE */}
      <div className="h-[10vh] min-h-[64px] bg-[#121212] border border-[#D3D3D3] rounded-2xl flex items-center justify-between px-[4vw] shrink-0 shadow-lg">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="active:scale-90 transition-transform">
              <ArrowLeft className="text-[#D3D3D3]" size={24} />
            </button>
          )}
          <button onClick={() => setActiveMode('admin_settings')} className="active:scale-90 transition-transform group">
            <Settings className="text-[#D3D3D3] group-hover:rotate-90 transition-transform duration-500" size={22} />
          </button>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D3D3D3]/30 bg-black">
          <Shield className={currentTier === 'FREE' ? 'text-gray-400' : 'text-[#FF6600]'} size={14} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${currentTier === 'FREE' ? 'text-gray-400' : 'text-[#FF6600]'}`}>
            {currentTier}
          </span>
        </div>
      </div>

      {/* BLOC 1 : MAINTENANCE INDUSTRIELLE */}
      <button
        onClick={() => setActiveMode('maintenance_menu')}
        className="flex-1 relative overflow-hidden bg-black border border-[#00E5FF]/50 hover:border-[#00E5FF] rounded-2xl flex flex-col justify-center items-center active:scale-[0.98] transition-all group"
      >
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,229,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.05)_1px,transparent_1px)] bg-[size:4vw_4vw]"></div>
        
        <Factory size={64} className="text-[#D3D3D3] mb-6 relative z-10 group-hover:scale-110 transition-transform" />
        <h2 className="text-white font-black text-[clamp(1.5rem,5vw,2rem)] uppercase tracking-tighter mb-2 text-center leading-tight relative z-10">
          Maintenance<br/>Industrielle
        </h2>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest text-center mb-8 relative z-10">
          Usines • Stations • Automatisme
        </p>
        <div className="flex items-center gap-2 text-[#00E5FF] font-black text-[10px] uppercase tracking-[0.2em] bg-[#00E5FF]/10 px-6 py-3 rounded-full border border-[#00E5FF]/30 relative z-10 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
          Système OSA/CBM
        </div>
      </button>

      {/* BLOC 2 : MÉCANIQUE AUTO & P.L. */}
      <button
        onClick={() => setActiveMode('mecanique_menu')}
        className="flex-1 relative overflow-hidden bg-black border border-[#DC2626]/50 hover:border-[#DC2626] rounded-2xl flex flex-col justify-center items-center active:scale-[0.98] transition-all group"
      >
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(220,38,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.05)_1px,transparent_1px)] bg-[size:4vw_4vw]"></div>
        
        <Wrench size={64} className="text-[#D3D3D3] mb-6 relative z-10 group-hover:scale-110 transition-transform" />
        <h2 className="text-white font-black text-[clamp(1.5rem,5vw,2rem)] uppercase tracking-tighter mb-2 text-center leading-tight relative z-10">
          Mécanique<br/>Auto & P.L.
        </h2>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest text-center mb-8 relative z-10">
          Véhicules Légers • Poids Lourds
        </p>
        <div className="flex items-center gap-2 text-[#DC2626] font-black text-[10px] uppercase tracking-[0.2em] bg-[#DC2626]/10 px-6 py-3 rounded-full border border-[#DC2626]/30 relative z-10 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
          Diagnostic OBD2
        </div>
      </button>

    </div>
  );
};

export default GarageDashboard;