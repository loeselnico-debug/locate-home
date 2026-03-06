// ==========================================
// 📂 FICHIER : \src\modules\home\components\ToolDetail.tsx
// ==========================================
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedTool, setEditedTool] = useState<any>(tool); 

  useEffect(() => {
    setEditedTool(tool);
  }, [tool]);

  const category = CATEGORIES.find(c => c.id === tool.category);
  const categoryIcon = category ? `/${category.id}.png` : '/icon-photo.png';
  
  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedTool as InventoryItem);
    }
    setIsEditing(false);
  };

  const handleChange = (field: string, value: any) => {
    setEditedTool((prev: any) => ({ ...prev, [field]: value }));
  };

  // ==========================================
  // LOGIQUE ANTI-REDONDANCE POUR LA MARQUE
  // ==========================================
  const brandName = tool.brand || 'Marque N/A';
  // Si le nom de l'outil commence déjà par la marque (ex: "RYOBI RRS1801"), on enlève le mot "RYOBI" du titre principal pour éviter le doublon visuel.
  const cleanToolName = tool.toolName.toLowerCase().startsWith(brandName.toLowerCase())
    ? tool.toolName.substring(brandName.length).trim()
    : tool.toolName;

  return (
    <div className="flex flex-col h-full bg-transparent">

      {/* ========================================== */}
      {/* EN-TÊTE DYNAMIQUE */}
      {/* ========================================== */}
      <div className="flex justify-between items-center px-[4vw] py-4 shrink-0">
        {isEditing ? (
          /* BOUTON SAVE (Carré Orange / Texte Noir) - Hauteur alignée sur le retour */
          <button onClick={handleSave} className="h-14 px-4 min-w-[3.5rem] bg-[#FF6600] rounded-xl flex items-center justify-center shadow-[0_4px_15px_rgba(255,102,0,0.4)] active:scale-95 transition-transform">
            <span className="text-black font-black text-[11px] uppercase tracking-widest text-center">Save</span>
          </button>
        ) : (
          /* BOUTON ÉDITER (Carré Orange / Texte Noir / Sans coupure) - Hauteur alignée sur le retour */
          <button onClick={() => setIsEditing(true)} className="h-14 px-3 min-w-[3.5rem] bg-[#FF6600] rounded-xl flex items-center justify-center shadow-[0_4px_15px_rgba(255,102,0,0.4)] active:scale-95 transition-transform">
            <span className="text-black font-black text-[11px] uppercase tracking-widest text-center">Éditer</span>
          </button>
        )}

        {/* BOUTON RETOUR */}
        <button onClick={isEditing ? () => setIsEditing(false) : onBack} className="w-14 h-14 active:scale-90 transition-transform">
          <img src="/icon-return.png" alt="Retour" className="w-full h-full object-contain drop-shadow-lg" />
        </button>
      </div>

      {/* ========================================== */}
      {/* CORPS DE LA FICHE (SCROLLABLE) */}
      {/* ========================================== */}
      <div className="flex-1 overflow-y-auto px-[4vw] pb-[12vh] no-scrollbar">

        {isEditing ? (
          /* ========================================== */
          /* MODE ÉDITION (CHAMPS DE SAISIE) */
          /* ========================================== */
          <div className="bg-[#1E1E1E] rounded-xl border-2 border-[#FF6600] p-5 shadow-[0_10px_30px_rgba(255,102,0,0.15)] flex flex-col gap-4 mb-6">
            <h3 className="text-[#FF6600] font-black uppercase tracking-widest text-[clamp(1rem,4vw,1.2rem)] border-b border-white/10 pb-2 flex justify-between items-center">
              Mode Édition
            </h3>

            {/* Le bouton caméra non-fonctionnel a été supprimé ici */}

            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Marque</label>
              <input type="text" value={editedTool.brand || ''} onChange={(e) => handleChange('brand', e.target.value)} placeholder="Ex: Makita, Hilti..." className="w-full bg-[#121212] border border-white/10 rounded p-3 text-white mt-1 text-sm outline-none focus:border-[#FF6600]" />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Désignation / Type</label>
              <input type="text" value={editedTool.toolName || ''} onChange={(e) => handleChange('toolName', e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded p-3 text-white mt-1 text-sm outline-none focus:border-[#FF6600]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Énergie</label>
                <input type="text" value={editedTool.energy || ''} onChange={(e) => handleChange('energy', e.target.value)} placeholder="Ex: 18V" className="w-full bg-[#121212] border border-white/10 rounded p-3 text-white mt-1 text-sm outline-none focus:border-[#FF6600]" />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Moteur</label>
                <input type="text" value={editedTool.motor || ''} onChange={(e) => handleChange('motor', e.target.value)} placeholder="Ex: Brushless" className="w-full bg-[#121212] border border-white/10 rounded p-3 text-white mt-1 text-sm outline-none focus:border-[#FF6600]" />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Numéro de Série (S/N)</label>
              <input type="text" value={editedTool.serialNumber || ''} onChange={(e) => handleChange('serialNumber', e.target.value)} placeholder="Ex: ABC123456789" className="w-full bg-[#121212] border border-white/10 rounded p-3 text-white mt-1 text-sm outline-none focus:border-[#FF6600]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Lieu / Zone</label>
                <input type="text" value={editedTool.location || ''} onChange={(e) => handleChange('location', e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded p-3 text-white mt-1 text-sm outline-none focus:border-[#FF6600]" />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Valeur (€)</label>
                <input type="number" value={editedTool.price || ''} onChange={(e) => handleChange('price', parseFloat(e.target.value))} className="w-full bg-[#121212] border border-white/10 rounded p-3 text-white mt-1 text-sm outline-none focus:border-[#FF6600]" />
              </div>
            </div>

            {onDelete && (
              <button onClick={onDelete} className="mt-4 bg-red-900/30 text-red-500 border border-red-500/50 py-3 rounded-lg font-black uppercase text-xs tracking-widest hover:bg-red-500 hover:text-white transition-colors">
                Supprimer de l'inventaire
              </button>
            )}
          </div>

        ) : (

          /* ========================================== */
          /* MODE LECTURE (RAPPORT DÉTAILLÉ) */
          /* ========================================== */
          <div className="flex flex-col gap-5">
            
            {/* 1. PHOTO AJUSTÉE & ISOLÉE */}
            <div className="w-full bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden relative shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
              <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-md border z-10 ${tool.safetyStatus ? 'bg-red-500/90 border-red-300 text-white' : 'bg-[#2EA043]/90 border-green-300 text-white'}`}>
                <span className="font-black text-[9px] uppercase tracking-widest drop-shadow-md">
                  {tool.safetyStatus ? '⚠️ ALERTE' :  '✓ OPÉRATIONNEL' }
                </span>
              </div>
              <div className="h-[28vh] w-full flex items-center justify-center p-4">
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

            {/* 3. GAUCHE ICONE / DROITE INFOS (Marque, Type, Energie, Lieux) */}
            <div className="flex items-center gap-4 bg-[#1E1E1E] p-4 rounded-xl border border-white/10 shadow-inner">
              <div className="w-16 h-16 bg-[#D3D3D3] rounded-xl flex items-center justify-center border border-gray-300 shadow-md shrink-0">
                <img src={categoryIcon} className="w-10 h-10 object-contain drop-shadow-md" alt="Catégorie" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h2 className="text-gray-400 font-black text-[10px] tracking-widest uppercase">{brandName}</h2>
                <h1 className="text-white font-black text-[clamp(1.1rem,4.5vw,1.4rem)] uppercase leading-tight truncate">
                  {cleanToolName}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-[#FF6600]/20 text-[#FF6600] border border-[#FF6600]/30 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                    ⚡ {(tool as any).energy || 'N/A'}
                  </span>
                  <span className="text-[#D3D3D3] text-[10px] font-bold uppercase tracking-widest truncate">
                    📍 {tool.location || 'Zone inconnue'}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. SPÉCIFICATIONS TECHNIQUES */}
            <div className="bg-[#1E1E1E] rounded-xl border-t-4 border-[#FF6600] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex flex-col gap-2">
              <h3 className="text-white text-[11px] font-black tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#FF6600] rounded-full"></span>
                Spécifications Techniques
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#121212] rounded-lg p-3 border border-white/5 flex flex-col justify-center">
                  <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Type de Moteur</span>
                  <span className="text-white font-bold text-xs uppercase tracking-wider">{(tool as any).motor || 'Non spécifié'}</span>
                </div>
                <div className="bg-[#121212] rounded-lg p-3 border border-white/5 flex flex-col justify-center">
                  <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Valeur estimée</span>
                  <span className="text-white font-bold text-xs tracking-wider">{tool.price ? `${tool.price} €` : 'N/A'}</span>
                </div>
              </div>

              <div className="bg-[#121212] rounded-lg p-3 border border-white/5 flex justify-between items-center mt-1">
                <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">S/N (Numéro de série)</span>
                <span className="text-[#FF6600] font-mono font-black text-[11px] tracking-widest bg-[#FF6600]/10 px-2 py-1 rounded border border-[#FF6600]/20">
                  {tool.serialNumber || 'NON RENSEIGNÉ'}
                </span>
              </div>
              
              {/* ENREGISTRÉ LE... (TOUT EN BAS) */}
              <div className="text-center mt-3 pt-3 border-t border-white/5">
                <span className="text-gray-600 text-[9px] font-black uppercase tracking-widest">
                  Fiche enregistrée le : {tool.date}
                </span>
              </div>
            </div>

          </div>
        )}
      </div>

      <StoreModal isOpen={isStoreOpen} onClose={() => setIsStoreOpen(false)} />
    </div>
  );
};

export default ToolDetail;