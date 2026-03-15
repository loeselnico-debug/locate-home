import React, { useState } from 'react';
import { ArrowLeft, Camera, Zap, ShieldCheck, HardHat } from 'lucide-react';
import { useAppSettings } from '../../../core/storage/useAppSettings';
import PassportScanner from '../components/PassportScanner';

interface TechProfileProps {
  onBack: () => void;
}

const TechProfile: React.FC<TechProfileProps> = ({ onBack }) => {
  const { settings, updateSettings } = useAppSettings();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  return (
    <div className="w-full h-full bg-[#121212] flex flex-col font-sans px-[4vw] pt-[2vh] pb-[4vh]">
      
      {/* HEADER */}
      <div className="h-[10vh] flex items-center shrink-0 border-b border-white/5 mb-6">
        <button onClick={onBack} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
          <ArrowLeft className="text-white" size={24} />
        </button>
        <div className="ml-4 flex flex-col">
          <h2 className="text-white font-black uppercase tracking-widest text-[clamp(1.1rem,4vw,1.4rem)] leading-none">
            Fiche Technicien
          </h2>
          <span className="text-[#00E5FF] font-bold uppercase tracking-widest text-[10px] mt-1">
            Habilitations & Sécurité M5
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
        
        {/* BOUTON IA SCANNER */}
        <button 
          onClick={() => setIsScannerOpen(true)}
          className="w-full bg-[#00E5FF]/10 border border-[#00E5FF]/50 text-[#00E5FF] py-6 rounded-2xl flex flex-col items-center justify-center gap-3 active:scale-95 transition-all hover:bg-[#00E5FF] hover:text-black shadow-[0_0_20px_rgba(0,229,255,0.15)] group"
        >
          <div className="flex items-center gap-3">
            <Camera size={28} />
            <span className="font-black uppercase tracking-widest text-sm">Scanner Passeport Sécurité</span>
            <Zap size={20} className="animate-pulse" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 group-hover:opacity-100">
            Extraction OCR Automatique (CACES, BR, B0...)
          </span>
        </button>

        {/* AFFICHAGE DES BADGES */}
        <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-white/10 shadow-inner">
          <h3 className="text-gray-500 text-[10px] uppercase tracking-widest font-black mb-4 flex items-center gap-2">
            <ShieldCheck size={14} className="text-green-500" /> Habilitations Actives
          </h3>
          
          {settings.userProfile?.habilitations && settings.userProfile.habilitations.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {settings.userProfile.habilitations.map((hab, idx) => (
                <span key={idx} className="bg-green-500/20 border border-green-500/50 text-green-400 px-3 py-1.5 rounded-lg text-[11px] font-black tracking-wider uppercase shadow-[0_0_10px_rgba(34,197,94,0.1)] flex items-center gap-1.5">
                  <HardHat size={12} /> {hab}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 border-2 border-dashed border-white/10 rounded-xl">
              <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">Aucune habilitation enregistrée</span>
            </div>
          )}
        </div>

        {/* FORMULAIRE IDENTITÉ */}
        <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-white/10 flex flex-col gap-4">
          <div>
            <label className="block text-[#00E5FF] text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1">Identité Opérateur</label>
            <input 
              type="text" 
              value={settings.userProfile?.fullName || ''} 
              onChange={(e) => updateSettings({ userProfile: { ...(settings.userProfile || { fullName: '', company: '', address: '' }), fullName: e.target.value } })}
              placeholder="Nom et Prénom"
              className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-4 focus:border-[#00E5FF] outline-none transition-colors text-sm font-bold"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[#00E5FF] text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1">Entreprise</label>
              <input 
                type="text" 
                value={settings.userProfile?.company || ''} 
                onChange={(e) => updateSettings({ userProfile: { ...(settings.userProfile || { fullName: '', company: '', address: '' }), company: e.target.value } })}
                placeholder="Employeur"
                className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-4 focus:border-[#00E5FF] outline-none transition-colors text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[#00E5FF] text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1">Matricule</label>
              <input 
                type="text" 
                value={settings.userProfile?.techId || ''} 
                onChange={(e) => updateSettings({ userProfile: { ...(settings.userProfile || { fullName: '', company: '', address: '' }), techId: e.target.value } })}
                placeholder="TECH-001"
                className="w-full bg-[#0A0A0A] border border-[#00E5FF]/30 text-[#00E5FF] rounded-xl p-4 focus:border-[#00E5FF] outline-none transition-colors text-sm font-mono font-black"
              />
            </div>
          </div>
        </div>

      </div>

      <PassportScanner 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onSuccess={(data) => {
          updateSettings({ 
            userProfile: { 
              ...(settings.userProfile || { address: '' }), 
              fullName: data.fullName || settings.userProfile?.fullName || '',
              company: data.company || settings.userProfile?.company || '',
              techId: data.techId || settings.userProfile?.techId || '',
              habilitations: data.habilitations || []
            } 
          });
          setIsScannerOpen(false);
        }} 
      />
    </div>
  );
};

export default TechProfile;