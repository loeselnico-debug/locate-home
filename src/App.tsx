import React, { useState, useRef } from 'react';
import { analyzeInventory } from './services/geminiService';

export default function App() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      try {
        const response = await analyzeInventory(base64);
        setResult(response);
      } catch (error) {
        setResult("Erreur de connexion avec l'IA.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ color: '#fb923c' }}>Locate Home - Mode Phoenix</h1>
      <input 
  type="file" 
  accept="image/*" 
  capture="environment" 
  onChange={handleFileChange} 
  ref={fileInputRef} 
  style={{ display: 'none' }} 
/>
      <div style={{ margin: '20px 0' }}>
        <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
        <button 
          onClick={() => fileInputRef.current?.click()}
          style={{ padding: '12px 24px', cursor: 'pointer', backgroundColor: '#3b82f6', border: 'none', color: 'white', borderRadius: '8px', fontWeight: 'bold' }}
        >
          {loading ? "Recherche en cours..." : "Scanner un objet"}
        </button>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #334155', borderRadius: '12px', backgroundColor: '#1e293b' }}>
        <h3 style={{ marginTop: 0 }}>Résultat :</h3>
        <p style={{ whiteSpace: 'pre-wrap', color: '#cbd5e1' }}>{result || "Prêt pour le scan."}</p>
      </div>
    </div>
  );
}