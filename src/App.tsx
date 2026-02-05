import { useState, useRef, useEffect } from 'react';
import { 
  ScanLine, X, Cpu, TriangleAlert, Hammer, Wrench, ListFilter, 
  CheckCircle2, Eye, ShieldCheck, Lock, Unlock 
} from 'lucide-react';

// --- 1. CONFIGURATION MÉTIER ---

const CATEGORIES = {
  POWER:    { id: 'power',    label: '⚡ Électroportatif', color: '#e67e22', icon: ZapIcon },
  HAND:     { id: 'hand',     label: '🔨 Outillage à main', color: '#3498db', icon: Hammer },
  KEY:      { id: 'key',      label: '🔧 Serrage & Clés',   color: '#9b59b6', icon: Wrench },
  ELEC:     { id: 'elec',     label: '💡 Électricité',      color: '#f1c40f', icon: ZapIcon }, // Placeholder icon
};

// Fonction utilitaire pour générer le SKU (Format Validé: LS-LH-KIT-BETA-001)
const generateSKU = (index: number) => {
  const num = (index + 1).toString().padStart(3, '0');
  return `LS-LH-KIT-BETA-${num}`;
};

const RULES_ENGINE = {
  analyzeFacom: (color: string) => {
    return { name: `Tournevis Facom (Rouge)`, brand: 'Facom', cat: CATEGORIES.HAND, safety: null };
  },
  analyzePowerTool: (brand: string, variant: string) => {
    if (brand === 'bosch' && variant === 'flexiclick') {
      return {
        name: 'Bosch GSR 12V-15 FC', brand: 'Bosch Pro', cat: CATEGORIES.POWER,
        safety: { level: 'medium', msg: "⚠️ Vérifier verrouillage tête (Twist-Lock)" }
      };
    }
    if (brand === 'milwaukee') {
      return {
        name: 'Milwaukee M18 FUEL', brand: 'Milwaukee', cat: CATEGORIES.POWER,
        safety: { level: 'high', msg: "⚡ DANGER: Moteur Brushless - Gants requis" }
      };
    }
    return null;
  }
};

// --- COMPOSANT APP ---

export default function App() {
  const [view, setView] = useState<'home' | 'camera'>('home');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  
  // NOUVEAU : État du verrou de sécurité
  const [safetyAcknowledged, setSafetyAcknowledged] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Inventaire avec SKU
  const [inventory, setInventory] = useState([
    { id: 1, sku: 'LS-LH-KIT-BETA-001', name: "Pince Coupante", brand: "Knipex", cat: CATEGORIES.HAND },
  ]);

  // --- GESTION CAMÉRA (STABLE V3.1) ---
  useEffect(() => {
    let currentStream: MediaStream | null = null;
    if (view === 'camera') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } })
        .then(stream => {
          currentStream = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.log("Simulation Mode (Pas de cam)"));
    }
    return () => currentStream?.getTracks().forEach(t => t.stop());
  }, [view]);

  // --- IA SIMULATION ---
  const triggerAI = (scenario: string) => {
    setScanning(true);
    setResult(null);
    setSafetyAcknowledged(false); // Reset du verrou à chaque scan

    setTimeout(() => {
      let analysis = null;
      if(scenario === 'flexi') analysis = RULES_ENGINE.analyzePowerTool('bosch', 'flexiclick');
      if(scenario === 'milwaukee') analysis = RULES_ENGINE.analyzePowerTool('milwaukee', 'standard');
      if(scenario === 'facom') analysis = RULES_ENGINE.analyzeFacom('rouge');

      if (analysis) {
        // Si pas de danger, la sécurité est validée d'office
        const autoSafe = !analysis.safety;
        setResult({ ...analysis, confidence: '98%' });
        setSafetyAcknowledged(autoSafe);
      }
      setScanning(false);
    }, 1000);
  };

  // --- ACTION : AJOUTER À L'INVENTAIRE (KEEP) ---
  const addToInventory = () => {
    if (!result) return;
    
    const newItem = {
      id: Date.now(),
      sku: generateSKU(inventory.length + 1), // Génération du SKU
      ...result
    };
    
    setInventory(prev => [newItem, ...prev]);
    setView('home'); // Retour liste
    setResult(null);
  };

  return (
    <div style={{ backgroundColor: '#0f0f0f', minHeight: '100vh', color: '#ecf0f1', fontFamily: 'sans-serif', paddingBottom: '90px' }}>
      
      {/* HEADER */}
      <header style={{ padding: '20px', background: 'rgba(20,20,20,0.9)', borderBottom: '1px solid #333', position:'sticky', top:0, zIndex:50, backdropFilter:'blur(10px)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{fontWeight:'800', fontSize:'16px'}}>LOCATE HOME <span style={{fontSize:'10px', color:'#e67e22'}}>V3.2 SAFETY</span></div>
        {view === 'camera' && <button onClick={() => setView('home')}><X color="white" /></button>}
      </header>

      {/* VUE CAMÉRA */}
      {view === 'camera' && (
        <div style={{ position: 'fixed', top: '60px', left: 0, right: 0, bottom: 0, backgroundColor: '#000', zIndex: 100 }}>
          <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
          
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent:'flex-end', paddingBottom:'100px' }}>
            
            {/* CARTE RÉSULTAT */}
            {result && (
              <div style={{ margin: '20px', padding: '20px', background: 'rgba(30,30,30,0.85)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                
                {/* Info Produit */}
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <div>
                    <span style={{fontSize:'10px', border:`1px solid ${result.cat.color}`, color:result.cat.color, padding:'2px 6px', borderRadius:'4px'}}>{result.cat.label}</span>
                    <h2 style={{fontSize:'20px', fontWeight:'bold', margin:'5px 0'}}>{result.name}</h2>
                  </div>
                  {/* Cadenas Visuel */}
                  {result.safety && (
                    safetyAcknowledged ? <Unlock color="#2ecc71" /> : <Lock color="#e74c3c" />
                  )}
                </div>

                {/* Zone de Danger (Interlock) */}
                {result.safety && !safetyAcknowledged && (
                  <div style={{marginTop:'15px', background:'rgba(231, 76, 60, 0.2)', padding:'15px', borderRadius:'10px', border:'1px solid #e74c3c'}}>
                    <div style={{display:'flex', gap:'10px', alignItems:'center', color:'#e74c3c', fontWeight:'bold', fontSize:'13px', marginBottom:'10px'}}>
                      <TriangleAlert size={16}/> SÉCURITÉ REQUISE
                    </div>
                    <button 
                      onClick={() => setSafetyAcknowledged(true)}
                      style={{width:'100%', padding:'12px', background:'#e74c3c', border:'none', borderRadius:'8px', color:'white', fontWeight:'bold'}}
                    >
                      <ShieldCheck size={16} style={{display:'inline', marginRight:'5px'}}/>
                      JE VALIDE MES EPI
                    </button>
                  </div>
                )}

                {/* Bouton KEEP (Ajout Inventaire) */}
                <button 
                  disabled={!safetyAcknowledged} // LE TEST EST ICI : Bouton désactivé si danger non validé
                  onClick={addToInventory}
                  style={{
                    width:'100%', padding:'15px', marginTop:'15px', borderRadius:'12px', border:'none',
                    background: safetyAcknowledged ? '#2ecc71' : '#555',
                    color: safetyAcknowledged ? 'black' : '#999',
                    fontWeight:'bold', transition:'all 0.3s'
                  }}
                >
                  {safetyAcknowledged ? "✅ AJOUTER À L'INVENTAIRE" : "🔒 VERROUILLÉ PAR SÉCURITÉ"}
                </button>

              </div>
            )}

            {/* Boutons de Test Scénario */}
            {!result && !scanning && (
              <div style={{display:'flex', gap:'10px', justifyContent:'center', padding:'20px'}}>
                 <button onClick={() => triggerAI('flexi')} style={btnTest}>⚠️ Test Flexi</button>
                 <button onClick={() => triggerAI('milwaukee')} style={btnTest}>⚡ Test M18</button>
                 <button onClick={() => triggerAI('facom')} style={btnTest}>🟢 Test Facom</button>
              </div>
            )}
            
          </div>
        </div>
      )}

      {/* VUE HOME (LISTE) */}
      {view === 'home' && (
        <div style={{ padding: '20px' }}>
          <div onClick={() => setView('camera')} style={{background:'#222', padding:'30px', borderRadius:'20px', textAlign:'center', marginBottom:'30px', border:'1px solid #444'}}>
             <ScanLine size={32} color="#e67e22" style={{marginBottom:'10px'}}/>
             <div style={{fontWeight:'bold'}}>Nouvelle Analyse</div>
          </div>

          <h3>INVENTAIRE ({inventory.length})</h3>
          {inventory.map((item: any) => (
             <div key={item.id} style={{background:'#1a1a1a', padding:'15px', marginBottom:'10px', borderRadius:'12px', borderLeft:`4px solid ${item.cat.color}`}}>
               <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
                 <span style={{fontSize:'10px', color:'#666', fontFamily:'monospace'}}>{item.sku}</span>
                 <span style={{fontSize:'10px', color:'#888'}}>{item.brand}</span>
               </div>
               <div style={{fontWeight:'bold', fontSize:'16px'}}>{item.name}</div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Icon helper simple pour éviter les erreurs d'import si Lucide manque
const ZapIcon = (props: any) => <Cpu {...props} />; 

const btnTest = { background:'#333', color:'white', border:'1px solid #555', padding:'10px 15px', borderRadius:'20px', fontSize:'12px' };