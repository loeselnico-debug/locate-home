import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import { LayoutDashboard, Camera, Settings } from 'lucide-react';

function App() {
  // Levier de navigation : on démarre sur l'inventaire
  const [currentView, setCurrentView] = useState<'dashboard' | 'scanner'>('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. Affichage dynamique de la vue */}
      <main className="flex-grow pb-24">
        {currentView === 'dashboard' ? <Dashboard /> : <Scanner />}
      </main>

      {/* 2. Barre de Navigation Basse */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 px-6 py-4 shadow-[0_-10px_20px_rgba(0,0,0,0.4)] z-50">
  <div className="max-w-md mx-auto flex justify-between items-center relative">
    
    <button onClick={() => setCurrentView('dashboard')} className={`flex flex-col items-center gap-1 transition-all ${currentView === 'dashboard' ? 'text-orange-500 scale-110' : 'text-slate-500'}`}>
      <LayoutDashboard size={24} strokeWidth={currentView === 'dashboard' ? 3 : 2} />
      <span className="text-[10px] font-black uppercase tracking-widest">Inventaire</span>
    </button>

    <div className="absolute left-1/2 -translate-x-1/2 -top-12">
      <button 
        onClick={() => setCurrentView('scanner')} 
        className="flex items-center justify-center w-18 h-18 rounded-full border-[6px] border-slate-900 shadow-2xl bg-orange-500 text-white active:scale-90 transition-transform"
      >
        <Camera size={32} strokeWidth={2.5} />
      </button>
    </div>

    <button className="flex flex-col items-center gap-1 text-slate-700 cursor-not-allowed">
      <Settings size={24} />
      <span className="text-[10px] font-black uppercase tracking-widest">Réglages</span>
    </button>
    
  </div>
</nav>
    </div>
  );
}

export default App;
