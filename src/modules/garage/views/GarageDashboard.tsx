import React, { useState } from 'react';
import { ArrowLeft, ScanQrCode, Mic, ClipboardCheck, Factory, Wrench, Settings, Mail, Shield } from 'lucide-react';
import LiveAssistant from '../components/LiveAssistant';
import { useUserTier } from '../../../core/security/useUserTier';

interface GarageDashboardProps {
  onBack?: () => void;
}

type ViewState = 'home' | 'maintenance_live' | 'mecanique_menu' | 'mecanique_live' | 'prise_poste' | 'fin_poste';

const GarageDashboard: React.FC<GarageDashboardProps> = ({ onBack }) => {
  const [activeMode, setActiveMode] = useState<ViewState>('home');
  const { currentTier } = useUserTier();

  if (activeMode === 'maintenance_live') {
    return <LiveAssistant mode="maintenance" onExit={() => setActiveMode('home')} />;
  }
  if (activeMode === 'mecanique_live') {
    return <LiveAssistant mode="mecanique" onExit={() => setActiveMode('mecanique_menu')} />;
  }

  // =======================================================================
  // VUE 1 : SOUS-MENU MÉCANIQUE (Refonte 4 Conteneurs Flex)
  // =======================================================================
  if (activeMode === 'mecanique_menu') {
    return (
      <div className="w-full h-full bg-[#121212] flex flex-col font-sans px-[4vw] pt-[2vh] pb-[1.5vh] gap-[2vh]">
        
        {/* CONTENEUR 1 : HEADER (10vh) */}
        <div className="h-[10vh] min-h-[64px] bg-[#121212] border border-[#D3D3D3] rounded-2xl flex items-center px-[4vw] shrink-0 shadow-lg">
          <button onClick={() => setActiveMode('home')} className="mr-4 active:scale-90 transition-transform">
            <ArrowLeft className="text-[#D3D3D3]" size={24} />
          </button>
          <div className="flex flex-col min-w-0">
            <h2 className="text-[clamp(1.1rem,4vw,1.4rem)] font-black uppercase tracking-widest text-white leading-none whitespace-nowrap truncate">
              Mécanique Auto & P.L.
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">
              Terminal Opérateur
            </span>
          </div>
        </div>

        {/* CONTENEUR 2 : PRISE DE POSTE (Flex-1) */}
        <button 
          onClick={() => setActiveMode('prise_poste')}
          className="flex-1 relative overflow-hidden bg-black border border-[#DC2626]/50 hover:border-[#DC2626] rounded-2xl flex flex-col justify-center items-center active:scale-[0.98] transition-all group"
        >
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(220,38,38,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.05)_1px,transparent_1px)] bg-[size:4vw_4vw]"></div>
          <ScanQrCode className="text-[#DC2626] mb-4 relative z-10 group-hover:scale-110 transition-transform" size={56} />
          <h3 className="text-[clamp(1.5rem,5vw,2rem)] font-black uppercase tracking-widest text-white leading-none relative z-10 text-center">
            Prise de Poste
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2 relative z-10">
            Contrôle Outillage
          </span>
        </button>

        {/* CONTENEUR 3 : ASSISTANT IA (Flex-1, Thème Gris #D3D3D3) */}
        <button 
          onClick={() => setActiveMode('mecanique_live')}
          className="flex-1 relative overflow-hidden bg-black border border-[#D3D3D3]/50 hover:border-[#D3D3D3] rounded-2xl flex flex-col justify-center items-center active:scale-[0.98] transition-all group hover:shadow-[0_0_30px_rgba(211,211,211,0.15)]"
        >
          {/* Quadrillage Gris */}
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(211,211,211,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(211,211,211,0.05)_1px,transparent_1px)] bg-[size:4vw_4vw]"></div>
          
          <Mic className="text-[#D3D3D3] mb-4 relative z-10 group-hover:scale-110 transition-transform" size={56} />
          <h3 className="text-[clamp(1.5rem,5vw,2rem)] font-black uppercase tracking-widest text-white leading-none relative z-10 text-center">
            Assistant IA
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2 relative z-10">
            Diagnostic Vidéo & Audio
          </span>
        </button>

        {/* CONTENEUR 4 : FIN DE POSTE (Flex-1) */}
        <button 
          onClick={() => setActiveMode('fin_poste')}
          className="flex-1 relative overflow-hidden bg-black border border-[#DC2626]/50 hover:border-[#DC2626] rounded-2xl flex flex-col justify-center items-center active:scale-[0.98] transition-all group"
        >
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(220,38,38,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.05)_1px,transparent_1px)] bg-[size:4vw_4vw]"></div>
          <ClipboardCheck className="text-[#DC2626] mb-4 relative z-10 group-hover:scale-110 transition-transform" size={56} />
          <h3 className="text-[clamp(1.5rem,5vw,2rem)] font-black uppercase tracking-widest text-white leading-none relative z-10 text-center">
            Fin de Poste
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2 relative z-10">
            Rapport Anti-Perte (FOD)
          </span>
        </button>

      </div>
    );
  }

  // =======================================================================
  // VUE 0 : MENU PRINCIPAL (AIGUILLEUR)
  // =======================================================================
  return (
    <div className="w-full h-full bg-[#121212] flex flex-col font-sans px-[4vw] pt-[2vh] pb-[1.5vh] gap-[2vh]">
      
      {/* HEADER (10vh) */}
      <div className="h-[10vh] min-h-[64px] bg-[#121212] border border-[#D3D3D3] rounded-2xl flex items-center justify-between px-[4vw] shrink-0 shadow-lg">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="active:scale-90 transition-transform">
              <ArrowLeft className="text-[#D3D3D3]" size={24} />
            </button>
          )}
          <button className="active:scale-90 transition-transform">
            <Settings className="text-[#D3D3D3]" size={22} />
          </button>
          <button className="active:scale-90 transition-transform">
            <Mail className="text-[#D3D3D3]" size={22} />
          </button>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D3D3D3]/30 bg-black">
          <Shield className={currentTier === 'FREE' ? 'text-gray-400' : 'text-[#FF6600]'} size={14} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${currentTier === 'FREE' ? 'text-gray-400' : 'text-[#FF6600]'}`}>
            {currentTier}
          </span>
        </div>
      </div>

      {/* BLOC 1 : MAINTENANCE INDUSTRIELLE (CYAN #00E5FF) */}
      <button
        onClick={() => setActiveMode('maintenance_live')}
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

      {/* BLOC 2 : MÉCANIQUE AUTO & P.L. (ROUGE #DC2626) */}
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