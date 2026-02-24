import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import type { InventoryItem } from './types';
import { useUserTier } from './core/security/useUserTier';

// Imports des composants
import Hub from './core/ui/Hub';
import Logo from './core/ui/Logo';
import HomeMenu from './modules/home/components/HomeMenu';
import Dashboard from './modules/home/views/Dashboard';
import Library from './modules/home/components/Library';
import { Scanner } from './core/camera/Scanner';
import Search from './modules/home/components/Search';
import SettingsPage from './modules/home/views/SettingsPage';

type ViewState = 'hub' | 'home' | 'inventory' | 'scanner' | 'search' | 'settings' | 'category_detail';

const App = () => {
  const [view, setView] = useState<ViewState>('hub');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isDbLoaded, setIsDbLoaded] = useState(false);
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

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setView('category_detail');
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
    <main className="w-screen min-h-[100dvh] bg-[#121212] text-white font-sans pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] overflow-hidden relative">
      
      {/* ========================================== */}
      {/* HEADER INALTÉRABLE STRICT - DESIGN REFERENCE */}
      {/* ========================================== */}
      {view !== 'hub' && (
        <header className="fixed top-0 left-0 w-full h-[14vh] min-h-[90px] bg-[#121212] z-[100] flex flex-col justify-between px-[5vw] py-2 border-b-2 border-[#D3D3D3]">
          
          {/* ÉTAPE 1 : LOGO AU CENTRE HAUT */}
          <div className="flex justify-center items-start w-full pt-1">
            <Logo />
          </div>

          {/* LIGNE DU BAS : PREMIUM À GAUCHE / PARAMÈTRES À DROITE */}
          <div className="flex justify-between items-end w-full pb-1">
            
            {/* ÉTAPE 2 : BADGE PREMIUM (Maximum Gauche) */}
            <div className="bg-[#333333] px-4 py-1.5 rounded-xl border border-white/5 shadow-inner flex items-center justify-center">
              <span className="text-[#FF6600] text-[11px] font-black uppercase tracking-widest">
                {currentTier}
              </span>
            </div>

            {/* ÉTAPE 3 : ROUE DENTÉE (Maximum Droite) */}
            <button onClick={() => setView('settings')} className="opacity-90 hover:opacity-100 transition-opacity active:scale-90 p-1">
              <img src="/gear.svg" className="w-7 h-7 invert drop-shadow-lg" alt="Settings" />
            </button>
            
          </div>
        </header>
      )}

      {/* ZONE DE CONTENU (Ajustée pour le nouveau Header de 14vh) */}
      <div className={view !== 'hub' ? 'pt-[14vh] h-full' : 'h-full'}>
        {view === 'hub' && <Hub onSelectModule={(m: string) => m === 'home' && setView('home')} />}
        {view === 'home' && <HomeMenu onNavigate={setView} tier={currentTier} />}

        {view === 'inventory' && (
          <Dashboard 
            inventory={inventory} 
            onStartScan={() => setView('scanner')} 
            onDelete={deleteTool}
            onSelectCategory={handleCategorySelect} onBack={() => setView('home')}
          />
        )}

        {view === 'category_detail' && (
          <Library 
            onBack={() => setView('inventory')} 
            selectedCategoryId={selectedCategory} 
            onStartScan={() => setView('scanner')}
          />
        )}

        {view === 'scanner' && <Scanner onBack={() => setView('home')} onAnalysisComplete={handleAnalysisResults} />}
        {view === 'search' && <Search onBack={() => setView('home')} inventory={inventory} />}

        {view === 'settings' && (
          <div className="absolute inset-0 z-50 bg-[#121212]">
            <button onClick={() => setView('home')} className="absolute top-6 left-6 z-50 text-[#FF6600] border border-[#FF6600] bg-[#1E1E1E] px-4 py-2 rounded-md text-xs font-black uppercase tracking-widest active:scale-95">
              ← Retour
            </button>
            <SettingsPage />
          </div>
        )}
      </div>
    </main>
  );
};

export default App;