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
  const level = tool.consumableLevel ?? 0;
  const isLow = level <= 20;

  const getLevelColor = () => {
    if (level <= 20) return 'bg-red-500 shadow-[0_0_10px_#ef4444]';
    if (level <= 50) return 'bg-orange-500 shadow-[0_0_10px_#f97316]';
    return 'bg-green-500 shadow-[0_0_10px_#22c55e]';
  };

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
          /* SI MODE LECTURE NORMAL */
          <>
            <div className="w-full bg-[#0a0a0a] rounded-2xl border-2 border-[#1E1E1E] overflow-hidden relative shadow-[0_10px_20px_rgba(0,0,0,0.6)] mb-6 group">
              <div className="h-56 w-full flex items-center justify-center">
                {tool.imageUrl ? (
                  <img src={tool.imageUrl} className="w-full h-full object-cover" alt={tool.toolName} />
                ) : (
                  <div className="flex flex-col items-center opacity-30">
                    <span className="text-5xl mb-2 drop-shadow-lg">📷</span>
                    <span className="text-white text-[10px] font-black tracking-widest uppercase">Photo requise</span>
                  </div>
                )}
              </div>

              {tool.isConsumable && (
                <div className="absolute bottom-0 left-0 w-full h-2 bg-black/40 backdrop-blur-sm">
                  <div className={`h-full transition-all duration-1000 ease-out ${getLevelColor()}`} style={{ width: `${level}%` }} />
                  <div className="absolute -top-6 right-3 bg-black/60 px-2 py-0.5 rounded text-[9px] font-black text-white uppercase tracking-tighter">
                    Stock: {level}%
                  </div>
                </div>
              )}

              <div className={`absolute top-4 right-4 px-4 py-1.5 rounded shadow-2xl backdrop-blur-md border ${tool.safetyStatus ? 'bg-red-500/90 border-red-300 text-white' : 'bg-green-500/90 border-green-300 text-white'}`}>
                <span className="font-black text-[10px] uppercase tracking-widest drop-shadow-md">
                  {tool.safetyStatus ? '⚠️ ALERTE SÉCURITÉ' : '✓ OPÉRATIONNEL'}
                </span>
              </div>
            </div>

            <div className="w-full bg-[#D3D3D3] rounded-xl flex items-center gap-4 p-4 shadow-[0_5px_15px_rgba(0,0,0,0.4)] border border-gray-300 mb-6">
              <img src={categoryIcon} className="w-16 h-16 object-contain drop-shadow-xl shrink-0" alt="Catégorie" />
              <div className="flex-1 min-w-0">
                <h1 className="text-[#121212] font-black text-lg uppercase leading-tight truncate">
                  {tool.toolName}
                </h1>
                <p className="text-[#FF6600] text-[11px] font-black mt-1.5 tracking-widest uppercase truncate drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                  📍 {tool.location || 'ZONE NON DÉFINIE'}
                </p>
              </div>
            </div>

            {tool.isConsumable && isLow && (
              <button onClick={() => setIsStoreOpen(true)} className="w-full bg-[#FF6600] py-4 rounded-xl mb-6 flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(255,102,0,0.2)] active:scale-95 transition-all animate-pulse">
                <span className="text-white font-black uppercase text-xs tracking-[0.2em]">Réapprovisionner Stock</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-white text-[10px] font-bold">PRO</span>
              </button>
            )}

            <div className="bg-[#1E1E1E] rounded-r-xl rounded-l-sm border-l-4 border-[#FF6600] p-5 shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex flex-col gap-4">
              <h3 className="text-white/40 text-[10px] font-black tracking-[0.2em] uppercase border-b border-white/10 pb-2">
                Spécifications Techniques
              </h3>

              <div className="bg-[#121212] rounded-lg p-3 border border-white/5 flex flex-col gap-2 relative overflow-hidden">
                <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Numéro de Série / S-N</span>
                <span className="text-[#FF6600] font-mono font-black text-sm tracking-[0.15em] bg-black/50 px-3 py-1.5 rounded shadow-inner inline-block w-max">
                  {tool.serialNumber || 'S/N MANQUANT'}
                </span>
              </div>

              <div className="flex justify-between items-center bg-[#121212] rounded-lg p-3 border border-white/5 mt-1">
                <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Valeur Estimée</span>
                <span className="text-white font-bold text-sm tracking-wider">{tool.price ? `${tool.price} €` : 'NON DÉFINIE'}</span>
              </div>

              <div className="flex justify-between items-center bg-[#121212] rounded-lg p-3 border border-white/5 mt-1">
                <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Enregistré le</span>
                <span className="text-white font-bold text-xs tracking-wider">{tool.date}</span>
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