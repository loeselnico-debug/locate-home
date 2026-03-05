import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import type { InventoryItem } from './types';
import { useUserTier } from './core/security/useUserTier';

import Hub from './core/ui/Hub';
import Logo from './core/ui/Logo';
import HomeMenu from './modules/home/components/HomeMenu';
import Dashboard from './modules/home/views/Dashboard';
import Library from './modules/home/components/Library';
import { Scanner } from './core/camera/Scanner';
import Search from './modules/home/components/Search';
import { SettingsPage } from './modules/home/views/SettingsPage';
import ValidationSas from './modules/home/views/ValidationSas';
import ToolDetail from './modules/home/components/ToolDetail';
import type { AIScanResult } from './modules/home/views/ValidationSas';

type ViewState = 'hub' | 'home' | 'inventory' | 'scanner' | 'search' | 'settings' | 'category_detail' | 'validation' | 'tool_detail';

const App = () => {
  const [view, setView] = useState<ViewState>('hub');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<InventoryItem | null>(null);
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
    if (window.confirm("Supprimer cet outil définitivement ?")) {
      setInventory(prev => prev.filter(item => item.id !== id));
      if (view === 'tool_detail') setView('category_detail');
    }
  };

  // LA FONCTION MANQUANTE EST ICI :
  const handleUpdateTool = (updatedTool: InventoryItem) => {
    setInventory(prev => prev.map(item => item.id === updatedTool.id ? updatedTool : item));
    setSelectedTool(updatedTool);
  };

  const handleAnalysisResults = (newItems: AIScanResult[]) => {
    setPendingItems(newItems);
    setView('validation');
  };

 const handleValidatePending = (validatedItems: AIScanResult[]) => {
    const itemsToAdd: InventoryItem[] = validatedItems.map(item => ({
      id: crypto.randomUUID(),
      date: new Date().toLocaleString(),
      // On utilise uniquement le nouveau vocabulaire strict (typography, brandColor)
      toolName: item.label || item.typography || 'Outil Inconnu',
      brand: item.brandColor || 'Marque N/A',
      category: item.categorie_id || 'main',
      location: 'Atelier',
      condition: item.etat || 'Bon état',
      notes: item.description || '',
      isConsumable: item.isConsumable,
      consumableLevel: item.consumableLevel,
      confidence: item.score_confiance ? item.score_confiance / 100 : undefined,
      imageUrl: item.imageUrl // L'image est sauvegardée ici
    }));

    setInventory(prev => [...itemsToAdd, ...prev]);
    setPendingItems([]);
    setView('inventory');
  };

  const handleRejectPending = () => {
    setPendingItems([]);
    setView('home');
  };

  const getActiveModule = () => {
    if (view.includes('garage')) return 'GARAGE';
    return 'HOME'; 
  };
  const currentModule = getActiveModule();

  return (
    <main className="w-screen min-h-[100dvh] bg-[#121212] text-white font-sans pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] overflow-hidden relative">

      {view !== 'hub' && (
        <header className="fixed top-0 left-0 w-full h-[12.5vh] min-h-[70px] bg-[#121212] z-[100] border-b-2 border-[#D3D3D3]">
          <Logo activeModule={currentModule as any} />
        </header>
      )}

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
            onSelectTool={(tool) => {
              setSelectedTool(tool);
              setView('tool_detail');
            }}
          />
        )}

        {view === 'tool_detail' && selectedTool && (
          <ToolDetail 
            tool={selectedTool} 
            onBack={() => setView('category_detail')} 
            onUpdate={handleUpdateTool} // BRANCHEMENT SAUVEGARDE
            onDelete={() => deleteTool(selectedTool.id)} // BRANCHEMENT SUPPRESSION
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
          <div className="flex-1 overflow-hidden relative">
            <SettingsPage onBack={() => setView('home')} />
          </div>
        )}
      </div>
    </main>
  );
};

export default App;