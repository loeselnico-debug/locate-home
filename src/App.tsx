import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner'; // Ton composant de scan actuel
import { LayoutDashboard, Camera, Settings } from 'lucide-react';

const App = () => {
  // Le levier de navigation : par défaut on arrive sur le Dashboard
  const [currentView, setCurrentView] = useState<'dashboard' | 'scanner'>('dashboard');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Affichage de la vue active */}
      <main className="pb-20">
        {currentView === 'dashboard' ? <Dashboard /> : <Scanner />}
      </main>

      {/* BARRE DE NAVIGATION BASSE (Fixe) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 shadow-lg">
        <div className="max-w-md mx-auto flex justify-between items-center">
          
          {/* Bouton Dashboard */}
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center gap-1 ${currentView === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <LayoutDashboard size={24} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Inventaire</span>
          </button>

          {/* Bouton SCAN (Le bouton d'action central) */}
          <button 
            onClick={() => setCurrentView('scanner')}
            className={`flex flex-col items-center justify-center -mt-12 bg-blue-600 w-16 h-16 rounded-full border-4 border-slate-50 shadow-blue-200 shadow-xl transition-transform active:scale-95 ${currentView === 'scanner' ? 'bg-blue-700' : ''}`}
          >
            <Camera size={28} className="text-white" />
          </button>

          {/* Bouton Profil / Master Plan */}
          <button className="flex flex-col items-center gap-1 text-slate-400 opacity-50 cursor-not-allowed">
            <Settings size={24} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Réglages</span>
          </button>

        </div>
      </nav>
    </div>
  );
};

export default App;