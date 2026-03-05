import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../views/Dashboard';
import type { InventoryItem } from '../../../types';
import StoreModal from './StoreModal';

interface ToolDetailProps {
  tool: InventoryItem;
  onBack: () => void;
  onUpdate?: (tool: InventoryItem) => void;
  onDelete?: () => void;
}

const ToolDetail: React.FC<ToolDetailProps> = ({ tool, onBack, onUpdate, onDelete }) => {
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  
  // ÉTATS DU MODE ÉDITION
  const [isEditing, setIsEditing] = useState(false);
  const [editedTool, setEditedTool] = useState<InventoryItem>(tool);

  // Synchronisation si l'outil change
  useEffect(() => {
    setEditedTool(tool);
  }, [tool]);

  const category = CATEGORIES.find(c => c.id === tool.category);
  const categoryIcon = category ? `/${category.id}.png` : '/icon-photo.png';
  
  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedTool);
    }
    setIsEditing(false);
  };

  const handleChange = (field: keyof InventoryItem, value: any) => {
    setEditedTool(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col h-full bg-transparent">

      {/* EN-TÊTE DYNAMIQUE */}
      <div className="flex justify-between items-center px-[4vw] py-4 shrink-0">
        {isEditing ? (
          <button onClick={handleSave} className="w-12 h-12 bg-[#2EA043] rounded-xl flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.5)] active:scale-95 transition-transform">
            <span className="text-white font-black text-[9px] uppercase tracking-widest text-center">Sauver</span>
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="w-12 h-12 bg-[#1E1E1E] border border-white/10 rounded-xl flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.5)] active:scale-95 transition-transform">
            <span className="text-white font-black text-[10px] uppercase tracking-widest text-center">Édit<br/>er</span>
          </button>
        )}

        <button onClick={isEditing ? () => setIsEditing(false) : onBack} className="w-14 h-14 active:scale-90 transition-transform">
          <img src="/icon-return.png" alt="Retour" className="w-full h-full object-contain drop-shadow-lg" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-[4vw] pb-[12vh] no-scrollbar">

        {/* SI MODE ÉDITION ACTIF */}
        {isEditing ? (
          <div className="bg-[#1E1E1E] rounded-xl border-2 border-[#FF6600] p-5 shadow-[0_10px_30px_rgba(255,102,0,0.15)] flex flex-col gap-4 mb-6">
            <h3 className="text-[#FF6600] font-black uppercase tracking-widest text-[clamp(1rem,4vw,1.2rem)] border-b border-white/10 pb-2">
              Mode Édition
            </h3>

            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Désignation</label>
              <input type="text" value={editedTool.toolName} onChange={(e) => handleChange('toolName', e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded p-3 text-white mt-1 text-sm outline-none focus:border-[#FF6600]" />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Valeur d'achat estimée (€)</label>
              <input type="number" value={editedTool.price || ''} onChange={(e) => handleChange('price', parseFloat(e.target.value))} placeholder="Ex: 149.90" className="w-full bg-[#121212] border border-white/10 rounded p-3 text-white mt-1 text-sm outline-none focus:border-[#FF6600]" />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Numéro de Série (S/N)</label>
              <input type="text" value={editedTool.serialNumber || ''} onChange={(e) => handleChange('serialNumber', e.target.value)} placeholder="Ex: ABC123456789" className="w-full bg-[#121212] border border-white/10 rounded p-3 text-white mt-1 text-sm outline-none focus:border-[#FF6600]" />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Zone de rangement</label>
              <input type="text" value={editedTool.location} onChange={(e) => handleChange('location', e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded p-3 text-white mt-1 text-sm outline-none focus:border-[#FF6600]" />
            </div>

            {onDelete && (
              <button onClick={onDelete} className="mt-4 bg-red-900/30 text-red-500 border border-red-500/50 py-3 rounded-lg font-black uppercase text-xs tracking-widest hover:bg-red-500 hover:text-white transition-colors">
                Supprimer cet outil
              </button>
            )}
          </div>
        ) : (
          /* SI MODE LECTURE NORMAL (BLOC D DU SCHÉMA) */
        <>
          {/* PHOTO AJUSTÉE & BADGE OPÉRATIONNEL */}
          <div className="w-full bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden relative shadow-[0_10px_20px_rgba(0,0,0,0.6)] mb-5 group">
            {/* Le badge statut collé en haut à gauche comme sur le croquis */}
            <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-md border z-10 ${tool.safetyStatus ? 'bg-red-500/90 border-red-300 text-white' : 'bg-green-500/90 border-green-300 text-white'}`}>
              <span className="font-black text-[9px] uppercase tracking-widest drop-shadow-md">
                {tool.safetyStatus ? '⚠️ ALERTE' :  '✓ OPÉRATIONNEL' }
              </span>
            </div>

            {/* Zone image (object-contain pour ne pas couper l'outil) */}
            <div className="h-[25vh] w-full flex items-center justify-center p-4">
              {tool.imageUrl ? (
                <img src={tool.imageUrl} className="w-full h-full object-contain drop-shadow-2xl" alt={tool.toolName} />
              ) : (
                <div className="flex flex-col items-center opacity-30">
                  <span className="text-5xl mb-2 drop-shadow-lg">📷</span>
                  <span className="text-white text-[10px] font-black tracking-widest uppercase">Photo requise</span>
                </div>
              )}
            </div>
          </div>

          {/* TITRE (ICON, MARQUE, ENERGIE, LIEUX) */}
          <div className="flex items-center gap-4 mb-6 px-1">
            <div className="w-14 h-14 bg-[#D3D3D3] rounded-xl flex items-center justify-center border border-gray-300 shadow-inner shrink-0">
              <img src={categoryIcon} className="w-10 h-10 object-contain drop-shadow-md" alt="Catégorie" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-white font-black text-[clamp(1.1rem,4.5vw,1.4rem)] uppercase leading-tight">
                {tool.toolName}
              </h1>
              <p className="text-[#FF6600] text-[11px] font-black mt-1 tracking-widest uppercase">
                📍 {tool.location || 'ZONE NON DÉFINIE'}
              </p>
            </div>
          </div>

          {/* ENCART SPE. TECH. */}
          <div className="bg-[#1E1E1E] rounded-xl border-l-4 border-[#FF6600] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex flex-col gap-3">
            <h3 className="text-white/40 text-[10px] font-black tracking-[0.2em] uppercase border-b border-white/10 pb-2 mb-1">
              SPE. TECH.
            </h3>

            <div className="flex justify-between items-center bg-[#121212] rounded-lg p-3 border border-white/5">
              <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">S/N (Numéro de série)</span>
              <span className="text-[#FF6600] font-mono font-black text-xs tracking-widest">
                {tool.serialNumber || '---'}
              </span>
            </div>

            <div className="flex justify-between items-center bg-[#121212] rounded-lg p-3 border border-white/5">
              <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Valeur</span>
              <span className="text-white font-bold text-sm tracking-wider">{tool.price ? `${tool.price} €` : '---'}</span>
            </div>

            <div className="flex justify-between items-center bg-[#121212] rounded-lg p-3 border border-white/5">
              <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Enregistré le</span>
              <span className="text-white/70 font-bold text-[10px] tracking-wider">{tool.date}</span>
            </div>
          </div>
        </>
        )}
      </div>

      <StoreModal isOpen={isStoreOpen} onClose={() => setIsStoreOpen(false)} />
    </div>
  );
};

export default ToolDetail;