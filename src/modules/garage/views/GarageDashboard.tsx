import React, { useState } from 'react';
import { ArrowLeft, ScanQrCode, Mic, ClipboardCheck, Power, Factory, Wrench, Settings, Mail, Shield } from 'lucide-react';
import LiveAssistant from '../components/LiveAssistant';
import { useUserTier } from '../../../core/security/useUserTier';

interface GarageDashboardProps {
  onBack?: () => void;
}

type ViewState = 'home' | 'maintenance_live' | 'mecanique_menu' | 'mecanique_live' | 'prise_poste' | 'fin_poste';

const GarageDashboard: React.FC<GarageDashboardProps> = ({ onBack }) => {
  const [activeMode, setActiveMode] = useState<ViewState>('home');
  const { currentTier } = useUserTier(); // Récupération du grade pour le Header

  // --- ROUTAGE VERS LE LIVE ASSISTANT ---
  if (activeMode === 'maintenance_live') {
    return <LiveAssistant mode="maintenance" onExit={() => setActiveMode('home')} />;
  }
  if (activeMode === 'mecanique_live') {
    return <LiveAssistant mode="mecanique" onExit={() => setActiveMode('mecanique_menu')} />;
  }

  // =======================================================================
  // VUE 1 : SOUS-MENU MÉCANIQUE
  // =======================================================================
  if (activeMode === 'mecanique_menu') {
    return (
      <div className="h-full bg-[#121212] text-white flex flex-col overflow-hidden font-sans">
        {/* SOUS-HEADER STRICT - 10vh */}
        <section className="h-[10vh] border-b border-white/5 flex items-center justify-between px-[4vw] shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveMode('home')} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors active:scale-90 shrink-0">
              <ArrowLeft className="text-white" size={24} />
            </button>
            <div className="flex flex-col">
              <h2 className="text-[clamp(1.2rem,4vw,1.5rem)] font-black uppercase tracking-widest text-white leading-none">
                Mécanique Auto & P.L.
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#DC2626] mt-1">
                Terminal Opérateur
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 shrink-0">
            <Power className="text-green-500" size={14} />
            <span className="text-[10px] font-black uppercase text-white">Connecté</span>
          </div>
        </section>

        {/* CONTENEUR DES 3 BOUTONS (77.5vh restants) */}
        <main className="flex-1 px-[4vw] pb-[4.5vh] flex flex-col gap-[2vh]">
          {/* BOUTON 1: PRISE DE POSTE */}
          <button 
            onClick={() => setActiveMode('prise_poste')}
            className="h-[23vh] w-full rounded-2xl border border-[#DC2626]/30 group transition-all duration-300 hover:border-[#DC2626] hover:shadow-[0_0_30px_rgba(220,38,38,0.2)] active:scale-[0.98] relative overflow-hidden bg-black/40 shrink-0 flex flex-col items-center justify-center gap-4 text-center px-6"
          >
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(220,38,38,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.06)_1px,transparent_1px)] bg-[size:3vw_3vw]"></div>
            <ScanQrCode className="text-[#DC2626] group-hover:scale-110 transition-transform relative z-10" size={48} />
            <div className="flex flex-col gap-1.5 relative z-10">
              <h3 className="text-[clamp(1.5rem,5vw,2rem)] font-black uppercase tracking-widest text-white leading-none">Prise de Poste</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#DC2626]">SCAN QR SERVANTE</span>
            </div>
          </button>

          {/* BOUTON 2: ASSISTANT IA */}
          <button 
            onClick={() => setActiveMode('mecanique_live')}
            className="h-[23vh] w-full rounded-2xl border border-white/10 group transition-all duration-300 hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-[0.98] relative overflow-hidden bg-black/40 shrink-0 flex flex-col items-center justify-center gap-4 text-center px-6"
          >
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:3vw_3vw]"></div>
            <Mic className="text-[#DC2626] group-hover:scale-110 transition-transform relative z-10" size={48} />
            <div className="flex flex-col gap-1.5 relative z-10">
              <h3 className="text-[clamp(1.5rem,5vw,2rem)] font-black uppercase tracking-widest text-white leading-none">Assistant IA</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#DC2626]">DIAGNOSTIC VIDÉO & AUDIO</span>
            </div>
          </button>

          {/* BOUTON 3: FIN DE POSTE */}
          <button 
            onClick={() => setActiveMode('fin_poste')}
            className="h-[23vh] w-full rounded-2xl border border-[#DC2626]/30 group transition-all duration-300 hover:border-[#DC2626] hover:shadow-[0_0_30px_rgba(220,38,38,0.2)] active:scale-[0.98] relative overflow-hidden bg-black/40 shrink-0 flex flex-col items-center justify-center gap-4 text-center px-6"
          >
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(220,38,38,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.06)_1px,transparent_1px)] bg-[size:3vw_3vw]"></div>
            <ClipboardCheck className="text-[#DC2626] group-hover:scale-110 transition-transform relative z-10" size={48} />
            <div className="flex flex-col gap-1.5 relative z-10">
              <h3 className="text-[clamp(1.5rem,5vw,2rem)] font-black uppercase tracking-widest text-white leading-none">Fin de Poste</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#DC2626]">RAPPORT ANTI-PERTE (FOD)</span>
            </div>
          </button>
        </main>
      </div>
    );
  }

  // =======================================================================
  // VUE 0 : MENU PRINCIPAL (AIGUILLEUR) - RESTRUCTURED
  // =======================================================================
  return (
    <div className="w-full h-full bg-[#121212] flex flex-col font-sans px-[4vw] pt-[2vh] pb-[1.5vh] gap-[2vh]">
      
      {/* ÉTAPE 1 : HEADER (10vh) */}
      <div className="h-[10vh] bg-[#121212] border border-[#D3D3D3] rounded-2xl flex items-center justify-between px-[4vw] shrink-0">
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

      {/* ÉTAPE 2 : MAINTENANCE INDUSTRIELLE (35vh) */}
      <button
        onClick={() => setActiveMode('maintenance_live')}
        className="h-[35vh] relative overflow-hidden bg-black border border-[#00E5FF] rounded-2xl flex flex-col justify-center items-center active:scale-[0.98] transition-all shrink-0"
      >
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,229,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.08)_1px,transparent_1px)] bg-[size:4vw_4vw]"></div>
        
        <Factory size={64} className="text-[#D3D3D3] mb-6 relative z-10" />
        <h2 className="text-white font-black text-[clamp(1.5rem,5vw,2rem)] uppercase tracking-tighter mb-2 text-center leading-tight relative z-10">
          Maintenance<br/>Industrielle
        </h2>
        <p className="text-[#DC2626] text-[10px] uppercase tracking-widest text-center mb-8 relative z-10">
          Usines • Stations • Automatisme
        </p>
        <div className="flex items-center gap-2 text-[#DC2626] font-black text-[10px] uppercase tracking-[0.2em] bg-red-950/30 px-5 py-2.5 rounded-full border border-[#DC2626]/20 relative z-10">
          Système OSA/CBM
        </div>
      </button>

      {/* ÉTAPE 3 : MÉCANIQUE AUTO & P.L. (35vh) */}
      <button
        onClick={() => setActiveMode('mecanique_menu')}
        className="h-[35vh] relative overflow-hidden bg-black border border-[#DC2626] rounded-2xl flex flex-col justify-center items-center active:scale-[0.98] transition-all shrink-0"
      >
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(220,38,38,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.08)_1px,transparent_1px)] bg-[size:4vw_4vw]"></div>
        
        <Wrench size={64} className="text-[#D3D3D3] mb-6 relative z-10" />
        <h2 className="text-white font-black text-[clamp(1.5rem,5vw,2rem)] uppercase tracking-tighter mb-2 text-center leading-tight relative z-10">
          Mécanique<br/>Auto & P.L.
        </h2>
        <p className="text-[#DC2626] text-[10px] uppercase tracking-widest text-center mb-8 relative z-10">
          Véhicules Légers • Poids Lourds
        </p>
        <div className="flex items-center gap-2 text-[#DC2626] font-black text-[10px] uppercase tracking-[0.2em] bg-red-950/30 px-5 py-2.5 rounded-full border border-[#DC2626]/20 relative z-10">
          Diagnostic OBD2
        </div>
      </button>

    </div>
  );
};

export default GarageDashboard;