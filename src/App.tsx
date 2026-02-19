import { useState, useEffect } from 'react';
import type { InventoryItem } from './types';
import HomeMenu from './components/HomeMenu';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import { TIERS_CONFIG } from './constants/tiers';
import SettingsPage from './pages/SettingsPage';
import { useUserTier } from './hooks/useUserTier';

// On définit les différentes vues possibles
type ViewState = 'home' | 'inventory' | 'scanner' | 'search' | 'settings';

const App = () => {
  const [view, setView] = useState<ViewState>('home');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Configuration du Tier (modifie 'FREE' par 'PREMIUM' ou 'PRO' selon tes tests)
  const { currentTier } = useUserTier();
  const limit = TIERS_CONFIG[currentTier].itemLimit;

  // 1. Chargement de la mémoire au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('locatehome_inventory');
    if (saved) setInventory(JSON.parse(saved));
  }, []);

  // 2. Sauvegarde automatique
  useEffect(() => {
    localStorage.setItem('locatehome_inventory', JSON.stringify(inventory));
  }, [inventory]);

  // 3. Logique d'ajout d'outils via le Scanner
  const handleAnalysisResults = (newItems: any[]) => {
    const currentCount = inventory.length;

    if (currentCount >= limit) {
      alert(`⚠️ Limite ${currentTier} atteinte (${limit} outils).`);
      setView('home');
      return;
    }

    const spaceLeft = limit - currentCount;
    const itemsToAdd = newItems.slice(0, spaceLeft).map(item => ({
      ...item,
      id: crypto.randomUUID(),
      date: new Date().toLocaleString(),
    }));

    setInventory(prev => [...itemsToAdd, ...prev]);
    setView('inventory'); // On bascule sur l'inventaire pour voir le résultat
  };

  const deleteTool = (id: string) => {
    if (window.confirm("Supprimer cet outil ?")) {
      setInventory(prev => prev.filter(item => item.id !== id));
    }
  };

  // --- RENDU CONDITIONNEL (L'AIGUILLAGE) ---
  return (
    <main className="min-h-screen bg-[#121212] text-[#B0BEC5] font-sans">
      
      {/* ÉCRAN 1 : MENU PRINCIPAL */}
      {view === 'home' && (
        <HomeMenu 
          onNavigate={setView} 
          tier={currentTier as any} 
        />
      )}

      {/* ÉCRAN 2 : INVENTAIRE (RANGER) */}
      {view === 'inventory' && (
        <div className="flex flex-col min-h-screen p-4">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => setView('home')}
              className="text-orange-500 font-bold flex items-center gap-2"
            >
              ← MENU
            </button>
            <span className="text-[10px] text-gray-600 uppercase tracking-widest">Mode Inventaire</span>
          </div>
          
          <Dashboard 
            inventory={inventory} 
            onStartScan={() => setView('scanner')} 
            onDelete={deleteTool}
            limit={limit}
          />
        </div>
      )}

      {/* ÉCRAN 3 : SCANNER */}
      {view === 'scanner' && (
        <Scanner 
          onBack={() => setView('home')} 
          onAnalysisComplete={handleAnalysisResults} 
        />
      )}

      {/* ÉCRAN 4 : RECHERCHE (PROCHAINEMENT) */}
      {view === 'search' && (
        <div className="flex flex-col items-center justify-center h-screen p-10 text-center">
          <img src="/icon-retrouver.png" className="w-32 h-32 opacity-20 mb-4" alt="Search" />
          <h2 className="text-orange-500 font-black mb-4 uppercase">Module Retrouver</h2>
          <p className="text-gray-500 text-sm mb-8">La recherche par IA dans vos rangements sera bientôt disponible.</p>
          <button 
            onClick={() => setView('home')}
            className="px-6 py-2 border border-orange-500 text-orange-500 rounded-full font-bold"
          >
            RETOUR AU MENU
          </button>
        </div>
      )}
      {view === 'settings' && (
        <div className="absolute inset-0 z-50 bg-[#121212]">
          <button 
            onClick={() => setView('home')} 
            className="absolute top-6 left-6 z-50 text-white bg-gray-800/80 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest border border-gray-600"
          >
            ← Retour
          </button>
          <SettingsPage />
        </div>
      )}
    </main>
  );
};

export default App;