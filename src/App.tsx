import { useState } from 'react';
import Scanner from './components/Scanner';
import Dashboard from './components/Dashboard';
import Search from './components/Search'; // Ton nouveau module vocal
import { type UserTier } from './constants/tiers';
import Library from './components/Library';

function App() {
  // 1. Définition de l'état du Tier (Résout l'erreur 'Cannot find name currentTier')
  const [currentTier] = useState<UserTier>('PRO');
  
  // 2. Gestion de la navigation sur les 3 piliers (Ranger, Scanner, Retrouver)
  const [view, setView] = useState<'dashboard' | 'scanner' | 'search' | 'library'>('dashboard');
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white font-sans">
      {/* Barre de navigation Phoenix-Eye */}
      <nav className="p-4 border-b border-[#FF6600] flex justify-between items-center bg-black sticky top-0 z-50">
        <h1 
          className="text-[#FF6600] font-black tracking-tighter text-xl cursor-pointer italic"
          onClick={() => setView('dashboard')}
        >
          PHOENIX-EYE
        </h1>
        <div className="flex gap-4 items-center">
          <span className="text-[10px] bg-gray-800 px-2 py-1 rounded border border-gray-600 font-bold uppercase">
            MODE: {currentTier}
          </span>
        </div>
      </nav>

      {/* 3. Bloc de navigation unique (Résout l'erreur 'one parent element') */}
      <main className="pb-24">
        {view === 'dashboard' && (
          <Dashboard 
            tier={currentTier} 
            onNavigate={(target) => setView(target as any)} 
           
          />
        )}
        
        {view === 'scanner' && <Scanner />}
        {view === 'library' && <Library onBack={() => setView('dashboard')} />}
        {view === 'search' && (
          <Search onBack={() => setView('dashboard')} />
        )}
      </main>
    </div>
  );
}

export default App;