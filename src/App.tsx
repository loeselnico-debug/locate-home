import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import { LayoutDashboard, Camera, Settings } from 'lucide-react';

function App() {
  // Définition du levier de navigation (Par défaut : Dashboard)
  const [currentView, setCurrentView] = useState<'dashboard' | 'scanner'>('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. Zone d'affichage dynamique */}
      <main className="flex-grow pb-24">
        {currentView === 'dashboard' ? <Dashboard /> : <Scanner />}
      </main>

      {/* 2. Barre de Navigation Basse (Master Class) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 shadow-2xl z-50">
        <div className="max-w-md mx-auto flex justify-between items-center relative">
          
          {/* Bouton Inventaire */}
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <LayoutDashboard size={24} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Inventaire</span>
          </button>

          {/* Bouton SCAN (Action Centrale) */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-12">
            <button 
              onClick={() => setCurrentView('scanner')}
              className={`flex items-center justify-center w-16 h-16 rounded-full border-4 border-slate-50 shadow-xl transition-all active:scale-90 ${currentView === 'scanner' ? 'bg-blue-700' : 'bg-blue-600'}`}
            >
              <Camera size={28} className="text-white" />
            </button>
          </div>

          {/* Bouton Réglages (Grisonné pour le mode Freemium) */}
          <button className="flex flex-col items-center gap-1 text-slate-300 cursor-not-allowed">
            <Settings size={24} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Réglages</span>
          </button>

        </div>
      </nav>
    </div>
  );
}

export default App;