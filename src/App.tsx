import { useState, useRef, useEffect } from 'react';
import { 
  ScanLine, 
  X, 
  Cpu, 
  Zap, 
  TriangleAlert, 
  Hammer, 
  Wrench, 
  ListFilter, 
  CheckCircle2, 
  Eye, 
  ShieldCheck 
} from 'lucide-react';

// --- 1. ARCHITECTURE DES DONNÉES (LE SAVOIR MÉTIER) ---

// Les 8 Catégories "Sacrées" (Issues du Prompt Engineering)
const CATEGORIES = {
  POWER:    { id: 'power',    label: '⚡ Électroportatif', color: '#e67e22', icon: Zap },
  HAND:     { id: 'hand',     label: '🔨 Outillage à main', color: '#3498db', icon: Hammer },
  KEY:      { id: 'key',      label: '🔧 Serrage & Clés',   color: '#9b59b6', icon: Wrench },
  HARDWARE: { id: 'hardware', label: '🔩 Quincaillerie',    color: '#95a5a6', icon: ListFilter },
  ELEC:     { id: 'elec',     label: '💡 Électricité',      color: '#f1c40f', icon: Zap },
  PAINT:    { id: 'paint',    label: '🖌️ Peinture',         color: '#e74c3c', icon: Eye },
  MEASURE:  { id: 'measure',  label: '📏 Mesure',           color: '#2ecc71', icon: ListFilter },
  GARDEN:   { id: 'garden',   label: '🌱 Jardin',           color: '#27ae60', icon: ListFilter }
};

// --- 2. MOTEUR DE RÈGLES (LE CERVEAU) ---
// C'est ici que l'on code ton expertise technique
const RULES_ENGINE = {
  
  // Règle FACOM : La couleur définit l'empreinte
  analyzeFacom: (color: string) => {
    const map: any = {
      'rouge': { type: 'Phillips (PH)', code: 'PH' },
      'jaune': { type: 'Plat (Fente)', code: 'FL' },
      'bleu':  { type: 'Pozidriv (PZ)', code: 'PZ' },
      'vert':  { type: 'Torx (TX)', code: 'TX' }
    };
    const detected = map[color] || { type: 'Standard', code: 'STD' };
    return {
      name: `Tournevis ProTwist ${detected.type}`,
      brand: 'Facom',
      cat: CATEGORIES.HAND,
      safety: null // Pas de danger sur un tournevis
    };
  },

  // Règle BOSCH & MILWAUKEE : Analyse technique fine
  analyzePowerTool: (brand: string, variant: string) => {
    // BOSCH PROFESSIONAL
    if (brand === 'bosch') {
      if (variant === 'flexiclick') {
        return {
          name: 'Bosch GSR 12V-15 FC (FlexiClick)',
          brand: 'Bosch Professional',
          cat: CATEGORIES.POWER,
          safety: { 
            level: 'medium', 
            msg: "⚠️ Système Modulaire : Vérifier verrouillage tête (Twist-Lock)" 
          }
        };
      }
      if (variant === 'gsb') {
        return {
          name: 'Bosch GSB 10.8-2-LI (Percussion)',
          brand: 'Bosch Professional',
          cat: CATEGORIES.POWER,
          safety: { level: 'high', msg: "✅ Percussion active : OK pour Brique/Parpaing" }
        };
      }
    }
    
    // MILWAUKEE
    if (brand === 'milwaukee') {
      return {
        name: 'Milwaukee M18 FUEL',
        brand: 'Milwaukee',
        cat: CATEGORIES.POWER,
        safety: { level: 'high', msg: "⚡ Moteur Brushless - Port des EPI obligatoire" }
      };
    }

    return null;
  }
};

export default function App() {
  const [view, setView] = useState<'home' | 'camera'>('home');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Inventaire de base (Mémoire persistante simulée)
  const [inventory, setInventory] = useState([
    { id: 1, name: "Pince Coupante", brand: "Knipex", cat: CATEGORIES.HAND },
    { id: 2, name: "Multimètre", brand: "Fluke", cat: CATEGORIES.ELEC },
  ]);

  // Démarrage de la caméra
  const startCamera = async () => {
    setView('camera');
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) { console.log("Mode simulation PC (Pas de caméra)"); }
  };

  // --- COEUR DU SYSTÈME : SIMULATION DE L'IA ---
  // Cette fonction remplace le backend Google Gemini pour les tests
  const triggerArtificialIntelligence = (scenario: string) => {
    setScanning(true);
    setResult(null);

    // On simule le temps de réflexion de l'IA (1.5s)
    setTimeout(() => {
      let analysis = null;

      switch (scenario) {
        case 'facom':
          analysis = RULES_ENGINE.analyzeFacom('rouge');
          break;
        case 'flexiclick':
          analysis = RULES_ENGINE.analyzePowerTool('bosch', 'flexiclick');
          break;
        case 'milwaukee':
          analysis = RULES_ENGINE.analyzePowerTool('milwaukee', 'standard');
          break;
        default:
          break;
      }

      if (analysis) {
        // Ajout d'un ID unique et de la confiance IA
        setResult({ ...analysis, confidence: '98%', id: Date.now() });
        // Auto-ajout à l'inventaire (Optionnel)
        // setInventory(prev => [analysis, ...prev]); 
      }
      setScanning(false);
    }, 1500);
  };

  return (
    <div style={{ backgroundColor: '#0f0f0f', minHeight: '100vh', color: '#ecf0f1', fontFamily: '"Inter", sans-serif', paddingBottom: '90px' }}>
      
      {/* --- HEADER --- */}
      <header style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(20,20,20,0.9)', borderBottom: '1px solid #333', backdropFilter: 'blur(10px)', position:'sticky', top:0, zIndex:50 }}>
        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
           <div style={{width:'36px', height:'36px', background:'linear-gradient(135deg, #e67e22, #d35400)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(230, 126, 34, 0.3)'}}>
             <ScanLine size={20} color="white" />
           </div>
           <div>
             <h1 style={{margin:0, fontSize:'16px', fontWeight:'800', letterSpacing:'0.5px'}}>LOCATE HOME</h1>
             <span style={{fontSize:'10px', color:'#7f8c8d', fontWeight:'500'}}>ARCHITECT V3</span>
           </div>
        </div>
        {view === 'home' && (
           <div style={{width:'10px', height:'10px', background:'#2ecc71', borderRadius:'50%', boxShadow:'0 0 10px #2ecc71'}}></div>
        )}
      </header>

      {/* --- VUE CAMÉRA (L'INTELLIGENCE VISUELLE) --- */}
      {view === 'camera' && (
        <div style={{ position: 'fixed', top: '77px', left: 0, right: 0, bottom: 0, backgroundColor: '#000', zIndex: 100 }}>
          
          {/* FLUX VIDEO */}
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
          
          {/* UI SUPERPOSÉE (HUD) */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
            
            {/* Barre d'outils haute */}
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ background:'rgba(0,0,0,0.6)', padding:'6px 12px', borderRadius:'20px', fontSize:'12px', display:'flex', alignItems:'center', gap:'8px', border:'1px solid rgba(255,255,255,0.1)' }}>
                 <Cpu size={14} color="#e67e22" className={scanning ? "animate-pulse" : ""} /> 
                 {scanning ? "ANALYSE EN COURS..." : "IA PRÊTE"}
               </span>
               <button onClick={() => setView('home')} style={{background:'rgba(0,0,0,0.6)', border:'none', color:'white', borderRadius:'50%', width:'32px', height:'32px', display:'flex', alignItems:'center', justifyContent:'center'}}><X size