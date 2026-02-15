import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';

function App() {
  const [view, setView] = useState<'dashboard' | 'scanner' | 'library' | 'search'>('dashboard');

  return (
    <main className="max-w-md mx-auto">
      {view === 'dashboard' && <Dashboard onNavigate={setView} />}
      {view === 'scanner' && <Scanner onBack={() => setView('dashboard')} />}
      {/* Tu pourras ajouter les autres vues ici */}
    </main>
  );
}

export default App;