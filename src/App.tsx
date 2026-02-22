import { useState, useEffect } from 'react';
import type { InventoryItem } from './types';
import Hub from './core/ui/Hub';
import HomeMenu from './modules/home/components/HomeMenu';
import Dashboard from './modules/home/views/Dashboard';
import { Scanner } from './core/camera/Scanner';
import Search from './modules/home/components/Search';
import { TIERS_CONFIG } from './core/security/tiers';
import SettingsPage from './modules/home/views/SettingsPage';
import { useUserTier } from './core/security/useUserTier';

// On ajoute 'hub' comme point d'entrée principal de la plateforme
type ViewState = 'hub' | 'home' | 'inventory' | 'scanner' | 'search' | 'settings';

const App = () => {
  // Le démarrage se fait désormais sur le Hub (Locate Core)
  const [view, setView] = useState<ViewState>('hub');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Configuration du Tier
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
    <main className="w-screen min-h-[100dvh] bg-[#050505] text-[#B0BEC5] font-sans pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] overflow-hidden">
      
      {/* ÉCRAN 0 : LE HUB (LOCATE CORE) */}
      {view === 'hub' && (
        <Hub 
          onSelectModule={(module) => {
            // Seul le module 'home' est techniquement redirigé pour l'instant
            if (module === 'home') setView('home');
          }} 
        />
      )}

      {/* ÉCRAN 1 : MENU PRINCIPAL (LOCATE HOME) */}
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

      {/* ÉCRAN 4 : RECHERCHE (RETROUVER) */}
{view === 'search' && (
  <Search 
    onBack={() => setView('home')} 
    inventory={inventory} // <--- Ajout de cette ligne cruciale
  />
)}

      {/* ÉCRAN 5 : PARAMÈTRES */}
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