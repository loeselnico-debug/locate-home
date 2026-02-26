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
import ValidationSas from './modules/home/views/ValidationSas';
import type { AIScanResult } from './modules/home/views/ValidationSas';

type ViewState = 'hub' | 'home' | 'inventory' | 'scanner' | 'search' | 'settings' | 'category_detail' | 'validation';

const App = () => {
  const [view, setView] = useState<ViewState>('hub');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [pendingItems, setPendingItems] = useState<AIScanResult[]>([]);
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

  const handleAnalysisResults = (newItems: AIScanResult[]) => {
    setPendingItems(newItems);
    setView('validation');
  };

  const handleValidatePending = (validatedItems: AIScanResult[]) => {
    const itemsToAdd: InventoryItem[] = validatedItems.map(item => ({
  id: crypto.randomUUID(),
  date: new Date().toLocaleString(),
  toolName: item.nom || 'Outil Inconnu',
  brand: item.marque || 'Marque N/A',
  category: item.categorie_id || 'main',
  location: 'Atelier', // Obligatoire selon ton interface
  condition: item.etat || 'Bon état',
  notes: item.description || ''
}));

    setInventory(prev => [...itemsToAdd, ...prev]);
    setPendingItems([]);
    setView('inventory');
  };

  const handleRejectPending = () => {
    setPendingItems([]);
    setView('home');
  };

  return (
    <main className="w-screen min-h-[100dvh] bg-[#121212] text-white font-sans pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] overflow-hidden relative">
      
      {/* ========================================== */}
      {/* HEADER INALTÉRABLE STRICT - V11 HUD CHÂSSIS */}
      {/* ========================================== */}
      {view !== 'hub' && (
        <header className="fixed top-0 left-0 w-full h-[12.5vh] min-h-[70px] bg-[#121212] z-[100] border-b-2 border-[#D3D3D3] flex items-center justify-center">
          
          {/* ÉTAPE 1 : LOGO (CENTRE ABSOLU) */}
          <Logo />

          {/* ÉTAPE 2 : BADGE PREMIUM (FLOTTANT À GAUCHE) */}
          <div className="absolute left-[4vw] bg-[#333333] px-[3vw] sm:px-4 py-[0.5vh] rounded-xl border border-white/5 shadow-inner flex items-center justify-center">
            <span className="text-[#FF6600] text-[clamp(0.6rem,2vw,0.7rem)] font-black uppercase tracking-widest">
              {currentTier}
            </span>
          </div>

          {/* ÉTAPE 3 : ROUE DENTÉE (FLOTTANT À DROITE) */}
          <button onClick={() => setView('settings')} className="absolute right-[4vw] opacity-90 hover:opacity-100 transition-opacity active:scale-90 p-1">
            <img 
              src="/gear.png" 
              className="w-[8vw] h-[8vw] max-w-[35px] max-h-[35px] object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" 
              alt="Settings" 
            />
          </button>
          
        </header>
      )}

      {/* ZONE DE CONTENU */}
      <div className={view !== 'hub' ? 'pt-[12.5vh] h-full flex flex-col' : 'h-full flex flex-col'}>
        {view === 'hub' && <Hub onSelectModule={(m: string) => m === 'home' && setView('home')} />}
        {view === 'home' && <HomeMenu onNavigate={setView} tier={currentTier} />}

        {view === 'inventory' && (
          <Dashboard 
            inventory={inventory} 
            onStartScan={() => setView('scanner')} 
            onDelete={deleteTool}
            onSelectCategory={handleCategorySelect} 
            onBack={() => setView('home')}
          />
        )}

        {view === 'category_detail' && (
          <Library 
            onBack={() => setView('inventory')} 
            selectedCategoryId={selectedCategory} 
            onStartScan={() => setView('scanner')}
            inventory={inventory} 
          />
        )}

        {view === 'scanner' && <Scanner onBack={() => setView('home')} onAnalysisComplete={handleAnalysisResults} />}
        {view === 'search' && <Search onBack={() => setView('home')} inventory={inventory} />}
        
        {view === 'validation' && (
          <ValidationSas 
            pendingItems={pendingItems} 
            onValidateAll={handleValidatePending} 
            onRejectAll={handleRejectPending} 
          />
        )}

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