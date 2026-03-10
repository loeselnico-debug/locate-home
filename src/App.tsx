import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import type { InventoryItem } from './types';
import { useUserTier } from './core/security/useUserTier';

// IMPORTS SUPABASE & AUTH
import AuthShield from './core/ui/AuthShield';
import { supabase } from './core/security/supabaseClient';

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
import GarageDashboard from './modules/garage/views/GarageDashboard';
import KitchenDashboard from './modules/kitchen/views/KitchenDashboard';

type ViewState = 'hub' | 'home' | 'garage' | 'kitchen' | 'inventory' | 'scanner' | 'search' | 'settings' | 'category_detail' | 'validation' | 'tool_detail';

const App = () => {
  // ÉTATS D'AUTHENTIFICATION
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // ROUTAGE INTELLIGENT : Hub pour l'Admin (PRO), Accueil direct pour les utilisateurs standards
  const [view, setView] = useState<ViewState>(() => {
    const savedTier = localStorage.getItem('locate_user_tier');
    return (savedTier === 'FREE' || savedTier === 'PREMIUM') ? 'home' : 'hub';
  });

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<InventoryItem | null>(null);
  const [pendingItems, setPendingItems] = useState<AIScanResult[]>([]);
  const { currentTier } = useUserTier();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      window.history.replaceState({}, document.title, window.location.pathname);
      // On affiche juste un message. Le Webhook a déjà mis à jour la BDD en coulisse !
      alert("✅ Paiement validé ! Bienvenue dans l'univers LOCATE PREMIUM. Veuillez rafraîchir la page si vos droits ne sont pas encore actifs.");
    }
    // --------------------------------------------------

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setIsAuthChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // CHARGEMENT DE LA BASE DE DONNEES LOCALE
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
      toolName: item.label || item.typography || 'Outil Inconnu',
      brand: item.brand || item.brandColor || 'Marque N/A', // On garde brandColor en secours pour les anciens scans en cache
      category: item.categorie_id || 'main',
      location: item.location || 'Atelier',
      condition: item.etat || 'Bon état',
      notes: item.description || '',
      isConsumable: item.isConsumable,
      consumableLevel: item.consumableLevel,
      confidence: item.confidence ? item.confidence : undefined,
      imageUrl: item.imageUrl
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

  // 🛡️ BOUCLIERS D'AUTHENTIFICATION
  if (isAuthChecking) {
    return (
      <div className="w-screen h-[100dvh] bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-black border-t-[#FF6600] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthShield onSuccess={() => setIsAuthenticated(true)} />;
  }

  // 🖥️ AFFICHAGE NORMAL DE L'APP
  return (
    <main className="w-screen min-h-[100dvh] bg-[#121212] text-white font-sans pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] overflow-hidden relative">

      {view !== 'hub' && (
        <header className="fixed top-0 left-0 w-full h-[12.5vh] min-h-[70px] bg-[#121212] z-[100] border-b-2 border-[#D3D3D3]">
          <Logo activeModule={currentModule as any} />
        </header>
      )}

      <div className={view !== 'hub' ? 'pt-[12.5vh] h-full flex flex-col' : 'h-full flex flex-col'}>
        
        {/* CORRECTION DU ROUTAGE HUB AVEC INJECTION DU TIER */}
        {view === 'hub' && <Hub onSelectModule={(m: string) => setView(m as ViewState)} userTier={currentTier} />}
        
        {view === 'home' && <HomeMenu onNavigate={setView} tier={currentTier} />}
        {view === 'garage' && <GarageDashboard onBack={() => setView('hub')} />}
        {view === 'kitchen' && <KitchenDashboard onBack={() => setView('hub')} />}

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
            onDelete={deleteTool}
          />
        )}

        {view === 'tool_detail' && selectedTool && (
          <ToolDetail 
            tool={selectedTool} 
            onBack={() => setView('category_detail')} 
            onUpdate={handleUpdateTool}
            onDelete={() => deleteTool(selectedTool.id)}
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