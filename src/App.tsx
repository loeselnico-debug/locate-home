import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval'; // Le nouveau moteur de base de données
import type { InventoryItem } from './types';
import Hub from './core/ui/Hub';
import HomeMenu from './modules/home/components/HomeMenu';
import Dashboard from './modules/home/views/Dashboard';
import { Scanner } from './core/camera/Scanner';
import Search from './modules/home/components/Search';
import { TIERS_CONFIG } from './core/security/tiers';
import SettingsPage from './modules/home/views/SettingsPage';
import { useUserTier } from './core/security/useUserTier';

type ViewState = 'hub' | 'home' | 'inventory' | 'scanner' | 'search' | 'settings';

const App = () => {
  const [view, setView] = useState<ViewState>('hub');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isDbLoaded, setIsDbLoaded] = useState(false); // Verrou de sécurité

  const { currentTier } = useUserTier();
  const limit = TIERS_CONFIG[currentTier].itemLimit;

  // 1. Chargement asynchrone depuis IndexedDB au démarrage
  useEffect(() => {
    get('locate_systems_db').then((savedItems: InventoryItem[] | undefined) => {
      if (savedItems) {
        setInventory(savedItems);
      }
      setIsDbLoaded(true); // On lève le verrou une fois la donnée récupérée
    }).catch((err: any) => {
      console.error("Erreur de lecture de la base de données militaire :", err);
      setIsDbLoaded(true); // On lève le verrou même en cas d'erreur
    });
  }, []);

  // 2. Sauvegarde asynchrone ultra-robuste
  useEffect(() => {
    // RÈGLE ABSOLUE : On ne sauvegarde JAMAIS si la DB n'a pas fini de charger initialement
    if (isDbLoaded) {
      set('locate_systems_db', inventory).catch((err: any) => {
        console.error("Échec de l'écriture dans la soute :", err);
      });
    }
  }, [inventory, isDbLoaded]);

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
    setView('inventory');
  };

  const deleteTool = (id: string) => {
    if (window.confirm("Supprimer cet outil définitivement de la base ?")) {
      setInventory(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <main className="w-screen min-h-[100dvh] bg-[#050505] text-[#B0BEC5] font-sans pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] overflow-hidden">
      
      {view === 'hub' && (
        <Hub onSelectModule={(module) => { if (module === 'home') setView('home'); }} />
      )}

      {view === 'home' && (
        <HomeMenu onNavigate={setView} tier={currentTier as any} />
      )}

      {view === 'inventory' && (
        <div className="flex flex-col h-full p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-6 shrink-0">
            <button onClick={() => setView('home')} className="text-[#FF6600] font-bold flex items-center gap-2">
              ← MENU
            </button>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Base Sécurisée</span>
          </div>
          
          <Dashboard 
            inventory={inventory} 
            onStartScan={() => setView('scanner')} 
            onDelete={deleteTool}
            limit={limit}
          />
        </div>
      )}

      {view === 'scanner' && (
        <Scanner onBack={() => setView('home')} onAnalysisComplete={handleAnalysisResults} />
      )}

      {view === 'search' && (
        <Search onBack={() => setView('home')} inventory={inventory} />
      )}

      {view === 'settings' && (
        <div className="absolute inset-0 z-50 bg-[#050505]">
          <button onClick={() => setView('home')} className="absolute top-6 left-6 z-50 text-white bg-gray-900/80 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest border border-gray-700">
            ← Retour
          </button>
          <SettingsPage />
        </div>
      )}
    </main>
  );
};

export default App;