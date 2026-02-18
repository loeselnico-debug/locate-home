import { useState, useEffect } from 'react';
import type { InventoryItem } from './types';
import Dashboard from './components/Dashboard'; // Ton composant principal
import Scanner from './components/Scanner';
import { TIERS_CONFIG } from './constants/tiers'; // Vérifie que le chemin correspond à ton dossier

const App = () => {
  const [view, setView] = useState<'dashboard' | 'scanner'>('dashboard');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

const addTestTool = () => {
    const testItem: InventoryItem = {
      id: crypto.randomUUID(),
      name: "Perceuse à percussion Bosch",
      details: "Modèle GSB 18V-55, Mandrin métal",
      etat: "Opérationnel", // Propriété obligatoire selon ton schéma
      categorie: "electro",
      score_confiance: 95,
      alerte_securite: false,
      originalImage: "https://via.placeholder.com/150", // Image de test
      date: new Date().toLocaleString(),
      localisation: "Fourgon - Étagère A1"
    };
    setInventory(prev => [testItem, ...prev]);
  };

// 1. Définition du Tier et de la Limite (Résout l'erreur 'limit')
const currentTier = 'FREE'; 
const limit = TIERS_CONFIG[currentTier].itemLimit;

  // 1. CHARGEMENT DE LA MÉMOIRE AU DÉMARRAGE
  useEffect(() => {
    const saved = localStorage.getItem('locatehome_inventory');
    if (saved) setInventory(JSON.parse(saved));
  }, []);

  // 2. SAUVEGARDE AUTOMATIQUE
  useEffect(() => {
    localStorage.setItem('locatehome_inventory', JSON.stringify(inventory));
  }, [inventory]);

  // 3. LOGIQUE D'AJOUT AVEC VERROU FREEMIUM
  const handleAnalysisResults = (newItems: any[]) => {
    const currentCount = inventory.length;

    if (currentCount >= limit) {
  // Correction : PRO -> PREMIUM
  alert(`⚠️ Limite Freemium atteinte (${limit} outils). Passez à la version PREMIUM pour étendre votre capacité.`);
  setView('dashboard');
  return;
}

    // On ne prend que ce qui rentre dans la limite restante
    const spaceLeft = limit - currentCount;
    const itemsToAdd = newItems.slice(0, spaceLeft).map(item => ({
      ...item,
      id: crypto.randomUUID(), // Identifiant unique
      date: new Date().toLocaleString(),
      // L'image originale pourrait être passée ici si on la stocke
    }));

    setInventory(prev => [...itemsToAdd, ...prev]); // Les plus récents en haut
    setView('dashboard');

    if (newItems.length > spaceLeft) {
      alert(`Certains outils n'ont pas été ajoutés (Limite de ${limit} outils).`);
    }
  };

  const deleteTool = (id: string) => {
    if (window.confirm("Supprimer cet outil de l'inventaire ?")) {
      setInventory(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <main className="min-h-screen bg-[#121212] text-[#B0BEC5] p-4 font-sans">
      {view === 'dashboard' ? (
        <Dashboard 
          inventory={inventory} 
          onStartScan={() => setView('scanner')} 
          onDelete={deleteTool}
          limit={limit}
        />
      ) : (
        <Scanner 
          onBack={() => setView('dashboard')} 
          onAnalysisComplete={handleAnalysisResults} 
        />
      )}
    </main>
  );
return (
  <main className="min-h-screen bg-[#121212] text-[#B0BEC5] font-sans">
    {view === 'dashboard' ? (
      <div className="flex flex-col min-h-screen">
        <Dashboard 
          inventory={inventory} 
          onStartScan={() => setView('scanner')} 
          onDelete={deleteTool}
          limit={limit}
        />
        
        {/* --- LE BOUTON DE BRANCHEMENT --- */}
        <button 
          onClick={addTestTool}
          className="mt-auto mb-8 mx-auto text-[10px] text-gray-500 uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity"
        >
          [ DEBUG : Générer un outil de test ]
        </button>
      </div>
    ) : (
      <Scanner 
        onBack={() => setView('dashboard')} 
        onAnalysisComplete={handleAnalysisResults} 
      />
    )}
  </main>
);
};

export default App;