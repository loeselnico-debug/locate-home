import { useState, useRef } from 'react'
import { ScanLine, X, Cpu, Zap, PenTool, ShieldAlert, Glasses, HandMetal } from 'lucide-react';

// --- 1. LE CERVEAU (RÈGLES MÉTIER + SÉCURITÉ) ---
const RULES_ENGINE = {
  screwdrivers: {
    colors: {
      'rouge': { type: 'Phillips', code: 'PH' },
      'jaune': { type: 'Plat (Fente)', code: 'FL' },
      'bleu':  { type: 'Pozidriv', code: 'PZ' },
      'vert':  { type: 'Torx', code: 'TX' },
      'gris':  { type: 'Hexagonal', code: 'HEX' }
    }
  },
  powerTools: {
    chucks: {
      'hexagonal': 'Visseuse à Chocs (Impact Driver)',
      'rond': 'Perceuse-Visseuse (Drill)'
    },
    connectors: {
      'slide_curved': 'Bosch 18V',
      'slide_flat_red': 'Milwaukee M18',
      'slide_star': 'Makita LXT'
    }
  },
  safety: {
    'powertool': { required: true, msg: "Projection & Coupure", gear: ["Lunettes", "Gants"] },
    'screwdriver': { required: false, msg: "Risque faible", gear: [] }
  }
};

export default function App() {
  const [showCamera, setShowCamera] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [safetyAlert, setSafetyAlert] = useState<any | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [stocks] = useState([
    { id: 1, nom: "Visseuse Chocs", marque: "Milwaukee", etat: "M18", loc: "Établi" },
    { id: 2, nom: "Tournevis Torx", marque: "Facom", etat: "Vert", loc: "Caisse 1" },
    { id: 3, nom: "Perceuse", marque: "Makita", etat: "LXT", loc: "Chantier" },
  ]);

  const simulerReconnaissance = (type: 'screwdriver' | 'powertool') => {
    setLoadingAnalysis(true);
    setAiResult(null);
    setSafetyAlert(null);

    setTimeout(() => {
      let resultat = "";
      
      if (type === 'screwdriver') {
        const detectedColor = 'vert'; 
        // @ts-ignore
        const analysis = RULES_ENGINE.screwdrivers.colors[detectedColor];
        resultat = `Détection: Manche ${detectedColor.toUpperCase()} => FACOM ${analysis.type}`;
      } 
      else if (type === 'powertool') {
        const detectedChuck = 'hexagonal';
        const detectedConnector = 'slide_flat_red';
        // @ts-ignore
        const toolType = RULES_ENGINE.powerTools.chucks[detectedChuck];
        // @ts-ignore
        const brand = RULES_ENGINE.powerTools.connectors[detectedConnector];
        resultat = `Analyse Forme: ${toolType} | Système: ${brand}`;
      }

      // @ts-ignore
      const securityCheck = RULES_ENGINE.safety[type];
      setAiResult(resultat);
      if (securityCheck.required) {
        setSafetyAlert(securityCheck);
      }
      setLoadingAnalysis(false);
    }, 1500); 
  };

  const demarrerCamera = async () => {
    setShowCamera(true);
    setAiResult(null);
    setSafetyAlert(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { console.log("Mode Simulation Force"); }
  };

  const fermerCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  return (
    <div style={{ backgroundColor: '#111', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', padding: '20px' }}>
      
      {/* HEADER AVEC LOGO INTÉGRÉ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
           {/* LOGO DE L'APP */}
           <img src="/logo.png" alt="Locate Home" style={{height: '45px', width: 'auto', objectFit: 'contain'}} />
           
           {/* Badge R&D Discret */}
           <span style={{fontSize:'10px', border:'1px solid #7f8c8d', padding:'2px 4px', borderRadius:'4px', color:'#7f8c8d', letterSpacing:'1px'}}>BETA 1.2</span>
        </div>
        <button onClick={demarrerCamera} style={{background: '#e67e22', border: 'none', color: 'white', padding: '10px', borderRadius: '50%'}}>
          <ScanLine size={24} />
        </button>
      </div>

      {/* MODAL CAMÉRA */}
      {showCamera && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'black', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', backgroundColor: '#000', zIndex: 10 }}>
            <span style={{color: '#e67e22', fontWeight: 'bold', display:'flex', alignItems:'center', gap:'10px'}}>
              <Cpu size={18}/> ANALYSE SÉCURITÉ
            </span>
            <X onClick={fermerCamera} style={{cursor: 'pointer'}} />
          </div>
          
          <div style={{ position: 'relative', flex: 1, overflow: 'hidden', backgroundColor: '#222' }}>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
            
            <div style={{
              position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', 
              width:'200px', height:'200px', 
              border: safetyAlert ? '2px solid #e74c3c' : '2px solid rgba(230, 126, 34, 0.5)', 
              borderRadius:'20px', transition: 'border 0.3s ease', boxShadow: '0 0 0 1000px rgba(0,0,0,0.5)'
            }}>
               {!aiResult && <div style={{position:'absolute', top:'-20px', left:'0', width:'100%', textAlign:'center', color:'rgba(255,255,255,0.7)', fontSize:'10px'}}>SCAN EN COURS...</div>}
            </div>

            <div style={{ position:'absolute', bottom:'10px', left:'10px', right:'10px', display:'flex', flexDirection:'column', gap:'10px' }}>
              {aiResult && (
  <div className="vitre" style={{ borderLeft:'4px solid #2ecc71' }}>
     <p style={{margin:0, color:'#2ecc71', fontWeight:'bold', fontSize:'12px'}}>IDENTIFIÉ</p>
     <p style={{margin:'2px 0 0 0', fontSize:'11px', color:'white'}}>{aiResult}</p>
  </div>
)}

              {safetyAlert && (
                <div style={{ backgroundColor:'rgba(231, 76, 60, 0.95)', padding:'10px', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'space-between', animation: 'pulse 2s infinite' }}>
                   <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                      <ShieldAlert color="white" size={24} />
                      <div><p style={{margin:0, color:'white', fontWeight:'bold', fontSize:'12px'}}>EPI REQUIS</p><p style={{margin:0, color:'white', fontSize:'10px'}}>{safetyAlert.msg}</p></div>
                   </div>
                   <div style={{display:'flex', gap:'5px'}}>
                      <div style={{background:'white', borderRadius:'50%', padding:'5px', width:'24px', height:'24px', display:'flex', alignItems:'center', justifyContent:'center'}}><Glasses size={14} color="#e74c3c"/></div>
                      <div style={{background:'white', borderRadius:'50%', padding:'5px', width:'24px', height:'24px', display:'flex', alignItems:'center', justifyContent:'center'}}><HandMetal size={14} color="#e74c3c"/></div>
                   </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ padding: '15px', backgroundColor: '#1e272e', borderTop: '1px solid #333' }}>
            <p style={{fontSize:'10px', color:'#7f8c8d', marginBottom:'8px', marginTop:0}}>TEST PROTOCOLE SÉCURITÉ :</p>
            <div style={{display:'flex', gap:'10px'}}>
              <button onClick={() => simulerReconnaissance('powertool')} disabled={loadingAnalysis} style={{ flex:1, height: '40px', backgroundColor: '#333', border: '1px solid #7f8c8d', color: 'white', borderRadius: '8px', fontSize:'11px', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px', cursor:'pointer' }}>
                {loadingAnalysis ? <Zap size={14} className="animate-spin"/> : <Zap size={14} color="#e67e22"/>} Test Machine
              </button>
              <button onClick={() => simulerReconnaissance('screwdriver')} disabled={loadingAnalysis} style={{ flex:1, height: '40px', backgroundColor: '#333', border: '1px solid #7f8c8d', color: 'white', borderRadius: '8px', fontSize:'11px', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px', cursor:'pointer' }}>
                {loadingAnalysis ? <Zap size={14} className="animate-spin"/> : <PenTool size={14} color="#3498db"/>} Test Manuel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LISTE STOCKS */}
      <p style={{color: '#7f8c8d', fontSize: '14px', marginBottom: '15px'}}>Inventaire</p>
      {stocks.map(item => (
        <div key={item.id} style={{ backgroundColor: '#1e272e', borderRadius: '12px', padding: '15px', marginBottom: '10px', border: '1px solid #333', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div><h2 style={{margin: '0', fontSize: '16px'}}>{item.nom}</h2><span style={{fontSize:'12px', color:'#7f8c8d'}}>{item.marque}</span></div>
          <div style={{fontSize:'12px', backgroundColor:'#333', padding:'4px 8px', borderRadius:'4px'}}>{item.loc}</div>
        </div>
      ))}
    </div>
  );
}