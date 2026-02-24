import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import type { InventoryItem } from './types';
import { useUserTier } from './core/security/useUserTier';

// Imports des composants
import Hub from './core/ui/Hub';
import Logo from './core/ui/Logo';
import HomeMenu from './modules/home/components/HomeMenu';
import Dashboard from './modules/home/views/Dashboard';
import Library from './modules/home/components/Library'; // Assure-toi de l'import
import { Scanner } from './core/camera/Scanner';
import Search from './modules/home/components/Search';
import SettingsPage from './modules/home/views/SettingsPage';

type ViewState = 'hub' | 'home' | 'inventory' | 'scanner' | 'search' | 'settings' | 'category_detail';

const App = () => {
  const [view, setView] = useState<ViewState>('hub');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  
  // Étape cruciale : On mémorise la catégorie sélectionnée
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { currentTier } = useUserTier();

  useEffect(() => {
    get('locate_systems_db').then((savedItems: InventoryItem[] | undefined) => {
      if (savedItems) setInventory(savedItems);
      setIsDbLoaded(true);
    }).catch(() => setIsDbLoaded(true));
  }, []);

  useEffect(() => {
    if (isDbLoaded) {
      set('locate_systems_db', inventory);
    }
  }, [inventory, isDbLoaded]);

  // Fonction de sélection de catégorie (Règle l'erreur 'onSelectCategory')
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setView('category_detail'); // On bascule vers la vue détail
  };

  const deleteTool = (id: string) => {
    if (window.confirm("Supprimer cet outil ?")) {
      setInventory(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleAnalysisResults = (newItems: any[]) => {
    const itemsToAdd = newItems.map(item => ({
      ...item,
      id: crypto.randomUUID(),
      date: new Date().toLocaleString(),
    }));
    setInventory(prev => [...itemsToAdd, ...prev]);
    setView('category_detail');
  };

  return (
    <main className="w-screen min-h-[100dvh] bg-[#050505] text-[#B0BEC5] font-sans pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] overflow-hidden relative">
      
      {/* HEADER INALTÉRABLE */}
      {view !== 'hub' && (
        <header className="fixed top-0 left-0 w-full h-[12vh] bg-[#121212] z-[100] border-b border-[#D3D3D3]/10 flex flex-col justify-center px-[5vw]">
          <div className="flex justify-center items-center">
            <Logo />
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="bg-[#FF6600]/10 border border-[#FF6600]/40 px-3 py-0.5 rounded-sm">
              <span className="text-[#FF6600] text-[10px] font-black tracking-[0.2em]">
                {currentTier.toUpperCase()}
              </span>
            </div>
            <button onClick={() => setView('settings')} className="opacity-80">
              <img src="/gear.svg" className="w-5 h-5 invert" alt="Settings" />
            </button>
          </div>
        </header>
      )}

      {/* ZONE DE CONTENU ADAPTATIVE */}
      <div className={view !== 'hub' ? 'pt-[12vh] h-full' : 'h-full'}>
        {view === 'hub' && <Hub onSelectModule={(m: string) => m === 'home' && setView('home')} />}
        
        {view === 'home' && <HomeMenu onNavigate={setView} tier={currentTier} />}

        {/* DASHBOARD : Le sélecteur d'univers */}
        {view === 'inventory' && (
          <Dashboard 
            inventory={inventory} 
            onStartScan={() => setView('scanner')} 
            onDelete={deleteTool}
            onSelectCategory={handleCategorySelect} // LIAISON ÉTABLIE
          />
        )}

        {/* DÉTAIL CATÉGORIE (01 A1 à A8) */}
        {view === 'category_detail' && (
          <Library 
            onBack={() => setView('inventory')} 
            selectedCategoryId={selectedCategory} 
          />
        )}

        {view === 'scanner' && (
          <Scanner onBack={() => setView('home')} onAnalysisComplete={handleAnalysisResults} />
        )}

        {view === 'search' && (
          <Search onBack={() => setView('home')} inventory={inventory} />
        )}

        {view === 'settings' && (
          <div className="absolute inset-0 z-50 bg-[#050505]">
            <button onClick={() => setView('home')} className="absolute top-6 left-6 z-50 text-white bg-gray-900 px-4 py-2 rounded-full text-xs font-bold border border-gray-700">
              ← RETOUR
            </button>
            <SettingsPage />
          </div>
        )}
      </div>
    </main>
  );
};

export default App;