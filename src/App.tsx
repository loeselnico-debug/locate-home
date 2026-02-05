import { useState, useRef, useEffect } from 'react';
import { 
  ScanLine, X, TriangleAlert, Hammer, Wrench, Cpu,
  Lock, Unlock, ShieldCheck
} from 'lucide-react';

// --- 1. CONFIGURATION (Mode Camouflage Anti-Bug) ---
// On coupe les strings en deux pour que VS Code ne détecte pas de "couleur"

const CATEGORIES = {
  POWER:    { id: "power",    label: "⚡ Électroportatif", color: "rgb(" + "230, 126, 34)", icon: Cpu },
  HAND:     { id: "hand",     label: "🔨 Outillage à main", color: "rgb(" + "52, 152, 219)", icon: Hammer },
  KEY:      { id: "key",      label: "🔧 Serrage & Clés",   color: "rgb(" + "155, 89, 182)", icon: Wrench },
  ELEC:     { id: "elec",     label: "💡 Électricité",      color: "rgb(" + "241, 196, 15)", icon: Cpu },
};

const generateSKU = (index: number) => {
  const num = (index + 1).toString().padStart(3, "0");
  return `LS-LH-KIT-BETA-${num}`;
};

const RULES_ENGINE = {
  analyzeFacom: (color: string) => ({ 
    name: `Tournevis Facom (${color.charAt(0).toUpperCase() + color.slice(1)})`, 
    brand: "Facom", 
    cat: CATEGORIES.HAND, 
    safety: null 
  }),
  analyzePowerTool: (brand: string, variant: string) => {
    if (brand === "bosch" && variant === "flexiclick") {
      return {
        name: "Bosch GSR 12V-15 FC", brand: "Bosch Pro", cat: CATEGORIES.POWER,
        safety: { level: "medium", msg: "⚠️ Vérifier verrouillage tête (Twist-Lock)" }
      };
    }
    if (brand === "milwaukee") {
      return {
        name: "Milwaukee M18 FUEL", brand: "Milwaukee", cat: CATEGORIES.POWER,
        safety: { level: "high", msg: "⚡ DANGER: Moteur Brushless - Gants requis" }
      };
    }
    return null;
  }
};

// --- APP ---

export default function App() {
  const [view, setView] = useState<"home" | "camera">("home");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [safetyAcknowledged, setSafetyAcknowledged] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inventory, setInventory] = useState<any[]>([
    { id: 1, sku: "LS-LH-KIT-BETA-001", name: "Pince Coupante", brand: "Knipex", cat: CATEGORIES.HAND },
  ]);

  // --- CAMERA ---
  useEffect(() => {
    let currentStream: MediaStream | null = null;
    let mounted = true;

    const startCamera = async () => {
      if (view !== "camera") return;

      try {
        const constraints = {
          audio: false,
          video: { facingMode: "environment" }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (!mounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(e => console.log("Autoplay blocked:", e));
          };
        }
        setError(null);
      } catch (err: any) {
        console.error("Erreur Caméra:", err);
        setError(`Erreur: ${err.name}. Vérifiez permissions.`);
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (currentStream) currentStream.getTracks().forEach(t => t.stop());
    };
  }, [view]);

  // --- SIMULATION ---
  const triggerAI = (scenario: string) => {
    setScanning(true);
    setResult(null);
    setSafetyAcknowledged(false);

    setTimeout(() => {
      let analysis = null;
      if(scenario === "flexi") analysis = RULES_ENGINE.analyzePowerTool("bosch", "flexiclick");
      if(scenario === "milwaukee") analysis = RULES_ENGINE.analyzePowerTool("milwaukee", "standard");
      if(scenario === "facom") analysis = RULES_ENGINE.analyzeFacom("rouge");

      if (analysis) {
        setResult({ ...analysis, confidence: "98%" });
        setSafetyAcknowledged(!analysis.safety);
      }
      setScanning(false);
    }, 1000);
  };

  const addToInventory = () => {
    if (!result) return;
    const newItem = { id: Date.now(), sku: generateSKU(inventory.length + 1), ...result };
    setInventory(prev => [newItem, ...prev]);
    setView("home");
    setResult(null);
  };

  return (
    <div style={{ backgroundColor: "rgb(" + "15, 15, 15)", minHeight: "100vh", color: "#ecf0f1", fontFamily: "sans-serif", paddingBottom: "90px" }}>
      
      {/* HEADER V5.3 CAMOUFLAGE */}
      <header style={{ padding: "20px", background: "rgba(" + "20,20,20,0.9)", borderBottom: "1px solid rgb(" + "51,51,51)", position:"sticky", top:0, zIndex:50, backdropFilter:"blur(10px)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{fontWeight:"800", fontSize:"16px"}}>LOCATE HOME <span style={{fontSize:"10px", color:"rgb(" + "46, 204, 113)"}}>V5.3 FIX</span></div>
        {view === "camera" && <button onClick={() => setView("home")}><X color="white" /></button>}
      </header>

      {/* VUE CAMERA */}
      {view === "camera" && (
        <div style={{ position: "fixed", top: "60px", left: 0, right: 0, bottom: 0, backgroundColor: "#000", zIndex: 100 }}>
          
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} 
          />
          
          {error && (
             <div style={{position:"absolute", top:"50%", left:"50%", transform:"translate(-50%, -50%)", textAlign:"center", width:"80%", background:"rgba(" + "0,0,0,0.8)", padding:"20px", borderRadius:"10px"}}>
                <TriangleAlert size={40} color={"rgb(" + "231, 76, 60)"} style={{marginBottom:"10px"}} />
                <p style={{color:"white"}}>{error}</p>
             </div>
          )}
          
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent:"flex-end", paddingBottom:"100px" }}>
            
            {result && (
              <div style={{ margin: "20px", padding: "20px", background: "rgba(" + "30,30,30,0.85)", backdropFilter: "blur(20px)", borderRadius: "16px", border: "1px solid rgba(" + "255,255,255,0.1)" }}>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                  <div>
                    <span style={{fontSize:"10px", border:`1px solid ${result.cat.color}`, color:result.cat.color, padding:"2px 6px", borderRadius:"4px"}}>{result.cat.label}</span>
                    <h2 style={{fontSize:"20px", fontWeight:"bold", margin:"5px 0"}}>{result.name}</h2>
                  </div>
                  {result.safety && (safetyAcknowledged ? <Unlock color={"rgb(" + "46, 204, 113)"} /> : <Lock color={"rgb(" + "231, 76, 60)"} />)}
                </div>

                {result.safety && !safetyAcknowledged && (
                  <div style={{marginTop:"15px", background:"rgba(" + "231, 76, 60, 0.2)", padding:"15px", borderRadius:"10px", border:"1px solid rgb(" + "231, 76, 60)"}}>
                    <div style={{display:"flex", gap:"10px", alignItems:"center", color:"rgb(" + "231, 76, 60)", fontWeight:"bold", fontSize:"13px", marginBottom:"10px"}}>
                      <TriangleAlert size={16}/> SÉCURITÉ REQUISE
                    </div>
                    <button onClick={() => setSafetyAcknowledged(true)} style={{width:"100%", padding:"12px", background:"rgb(" + "231, 76, 60)", border:"none", borderRadius:"8px", color:"white", fontWeight:"bold"}}>
                      <ShieldCheck size={16} style={{display:"inline", marginRight:"5px"}}/> VALIDER EPI
                    </button>
                  </div>
                )}

                <button 
                  disabled={!safetyAcknowledged}
                  onClick={addToInventory}
                  style={{
                    width:"100%", padding:"15px", marginTop:"15px", borderRadius:"12px", border:"none",
                    background: safetyAcknowledged ? "rgb(" + "46, 204, 113)" : "rgb(" + "85, 85, 85)",
                    color: safetyAcknowledged ? "black" : "#999",
                    fontWeight:"bold", transition:"all 0.3s"
                  }}
                >
                  {safetyAcknowledged ? "✅ AJOUTER (KEEP)" : "🔒 SÉCURITÉ ACTIVE"}
                </button>
              </div>
            )}

            {!result && !scanning && !error && (
              <div style={{display:"flex", gap:"10px", justifyContent:"center", padding:"20px"}}>
                 <button onClick={() => triggerAI("flexi")} style={btnTest}>⚠️ Test Flexi</button>
                 <button onClick={() => triggerAI("milwaukee")} style={btnTest}>⚡ Test M18</button>
                 <button onClick={() => triggerAI("facom")} style={btnTest}>🔴 Test Facom</button>
              </div>
            )}
            
          </div>
        </div>
      )}

      {/* VUE HOME */}
      {view === "home" && (
        <div style={{ padding: "20px" }}>
          <div onClick={() => setView("camera")} style={{background:"rgb(" + "34, 34, 34)", padding:"30px", borderRadius:"20px", textAlign:"center", marginBottom:"30px", border:"1px solid rgb(" + "68, 68, 68)"}}>
             <ScanLine size={32} color={"rgb(" + "230, 126, 34)"} style={{marginBottom:"10px"}}/>
             <div style={{fontWeight:"bold"}}>Scanner</div>
          </div>

          <h3>KEEP ({inventory.length})</h3>
          {inventory.map((item: any) => (
             <div key={item.id} style={{background:"rgb(" + "26, 26, 26)", padding:"15px", marginBottom:"10px", borderRadius:"12px", borderLeft:`4px solid ${item.cat.color}`}}>
               <div style={{display:"flex", justifyContent:"space-between", marginBottom:"5px"}}>
                 <span style={{fontSize:"10px", color:"#666", fontFamily:"monospace"}}>{item.sku}</span>
                 <span style={{fontSize:"10px", color:"#888"}}>{item.brand}</span>
               </div>
               <div style={{fontWeight:"bold", fontSize:"16px"}}>{item.name}</div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Couleurs coupées aussi pour le bouton
const btnTest = { background:"rgb(" + "51, 51, 51)", color:"white", border:"1px solid rgb(" + "85, 85, 85)", padding:"10px 15px", borderRadius:"20px", fontSize:"12px" };