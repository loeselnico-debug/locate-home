import { useState } from 'react';
import { Box, ChevronRight, ShieldCheck } from 'lucide-react'; // AlertTriangle et Info ont été retirés

const Dashboard = () => {
  const [showGarageDetails, setShowGarageDetails] = useState(false);

  // 📋 LISTE DES 18 OUTILS RÉELS (Secteur Garage)
  const garageTools = [
    { id: 1, name: "Tournevis Phillips PH2", type: "Rouge", status: "OK", volt: "1000V" },
    { id: 2, name: "Tournevis Plat 5.5", type: "Jaune", status: "OK", volt: "1000V" },
    { id: 3, name: "Tournevis Pozidriv PZ2", type: "Bleu", status: "OK", volt: "1000V" },
    { id: 4, name: "Tournevis Torx T20", type: "Vert", status: "Impact Gaine", volt: "Non-conforme" },
    { id: 5, name: "Tournevis Hex 4mm", type: "Gris clair", status: "OK", volt: "1000V" },
    { id: 6, name: "Vérificateur Absence Tension (VAT)", type: "Mesure", status: "OK", volt: "CAT IV" },
    { id: 7, name: "Pince Coupante Isolée", type: "Coupe", status: "OK", volt: "1000V" },
    { id: 8, name: "Pince à Dénuder", type: "Coupe", status: "OK", volt: "1000V" },
    { id: 9, name: "Clef de Fontainier", type: "Eau", status: "OK", volt: "Manuel" },
    { id: 10, name: "Multimètre Industriel", type: "Mesure", status: "Calibré", volt: "Numérique" },
    { id: 11, name: "Clef à Molette 10'", type: "Serrage", status: "OK", volt: "Gaine standard" },
    { id: 12, name: "Jeu de Clefs Mâles", type: "Serrage", status: "OK", volt: "Chrome" },
    { id: 13, name: "Lampe Frontale ATEX", type: "Eclairage", status: "Charge 90%", volt: "Sécurité" },
    { id: 14, name: "Miroir d'Inspection", type: "Vision", status: "OK", volt: "Télescopique" },
    { id: 15, name: "Télémètre Laser", type: "Mesure", status: "OK", volt: "IP65" },
    { id: 16, name: "Caméra d'Inspection Portative", type: "Assainissement", status: "OK", volt: "Batterie OK" },
    { id: 17, name: "Détecteur de Gaz (H2S)", type: "Sécurité", status: "Calibré", volt: "Indispensable" },
    { id: 18, name: "Marteau de Mécanicien", type: "Frappe", status: "Manche OK", volt: "Standard" },
  ];

  const objectCount = garageTools.length;
  const maxCapacity = 50;
  const percentage = (objectCount / maxCapacity) * 100;

  if (showGarageDetails) {
    return (
      <div className="p-4 space-y-6 bg-slate-900 min-h-screen text-white pb-20">
        <button onClick={() => setShowGarageDetails(false)} className="text-orange-500 font-black flex items-center gap-2 mb-4">
          <ChevronRight className="rotate-180" /> RETOUR DASHBOARD
        </button>
        
        <div className="bg-slate-800 rounded-[2rem] p-6 border border-slate-700 shadow-2xl">
          <h2 className="text-2xl font-black uppercase italic italic mb-1">Inventaire : <span className="text-orange-500">Garage</span></h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-6">État des équipements de maintenance</p>
          
          <div className="space-y-3">
            {garageTools.map(tool => (
              <div key={tool.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-slate-100">{tool.name}</span>
                  <span className="text-[9px] text-slate-500 uppercase tracking-tighter">{tool.type} • {tool.volt}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${tool.status === 'OK' || tool.status === 'Calibré' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                  {tool.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 pb-32 bg-slate-900 min-h-screen">
      {/* LOGO & STATUT */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Locate Home" className="h-10 w-auto object-contain" />
          <h1 className="text-xl font-black text-white tracking-tighter uppercase italic">Locate <span className="text-orange-500">Home</span></h1>
        </div>
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
      </div>

      {/* JAUGE ORANGE */}
      <div className="bg-slate-800 p-6 rounded-[2.5rem] border border-slate-700 shadow-2xl">
        <div className="flex justify-between items-end mb-4">
          <div className="text-left">
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1">Capacité Système</p>
            <h2 className="text-4xl font-black text-white">{objectCount} <span className="text-lg text-slate-500">/ {maxCapacity}</span></h2>
          </div>
          <p className="text-sm font-bold text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full">{Math.round(percentage)}%</p>
        </div>
        <div className="w-full bg-slate-950 h-4 rounded-full p-1 border border-slate-700">
          <div className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-1000 shadow-[0_0_15px_rgba(249,115,22,0.4)]" style={{ width: `${percentage}%` }} />
        </div>
      </div>

      {/* SECTEUR GARAGE */}
      <button onClick={() => setShowGarageDetails(true)} className="w-full text-left bg-white p-6 rounded-[2rem] shadow-xl active:scale-95 transition-all group">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center text-left">
            <div className="bg-slate-900 p-4 rounded-2xl text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <Box size={24} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg uppercase leading-none">Garage</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Secteur Alpha • {objectCount} Objets</p>
            </div>
          </div>
          <ChevronRight className="text-slate-300 group-hover:text-orange-500 transition-colors" />
        </div>
      </button>

      {/* BANDEAU VIGILANCE */}
      <div className="bg-slate-950 p-6 rounded-[2rem] border border-slate-800 shadow-xl text-left">
        <div className="flex gap-2 items-center mb-2">
          <ShieldCheck className="text-emerald-500" size={16} />
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Contrôle de Vigilance</p>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed">
          Toute gaine coupée ou raccourcie entraîne une non-conformité immédiate. <br/>
          <span className="text-white font-bold italic">Rappel : Procédure VAT obligatoire avant intervention.</span>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;