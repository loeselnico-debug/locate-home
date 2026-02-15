import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import Library from './components/Library'; // On importe la page Ranger

export default function App() {
  const [view, setView] = useState<'dashboard' | 'scanner' | 'library' | 'search'>('dashboard');

  return (
    <main className="max-w-md mx-auto shadow-2xl min-h-screen bg-[#121212]">
      {view === 'dashboard' && (
        <Dashboard onNavigate={setView} />
      )}
      
      {view === 'scanner' && (
        <Scanner onBack={() => setView('dashboard')} />
      )}

      {view === 'library' && (
        <Library onBack={() => setView('dashboard')} />
      )}

      {/* Ajoute ici la vue 'search' quand elle sera prête */}
    </main>
  );
}
