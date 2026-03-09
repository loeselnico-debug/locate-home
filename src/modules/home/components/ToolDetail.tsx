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

  const brandName = tool.brand || 'Marque N/A';
  const cleanToolName = tool.toolName.toLowerCase().startsWith(brandName.toLowerCase())
    ? tool.toolName.substring(brandName.length).trim()
    : tool.toolName;

  // DÉTECTION DES CONSOMMABLES (Quincaillerie)
  const isConsumableType = tool.category === 'quinc' || tool.isConsumable;

  return (
    <div className="flex flex-col h-full bg-transparent">

      {/* EN-TÊTE */}
      <div className="flex justify-between items-center px-[4vw] py-4 shrink-0">
        {isEditing ? (
          <button onClick={handleSave} className="h-14 px-4 min-w-[3.5rem] bg-[#FF6600] rounded-xl flex items-center justify-center shadow-[0_4px_15px_rgba(255,102,0,0.4)] active:scale-95 transition-transform">
            <span className="text-black font-black text-[11px] uppercase tracking-widest text-center">Save</span>
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="h-14 px-3 min-w-[3.5rem] bg-[#FF6600] rounded-xl flex items-center justify-center shadow-[0_4px_15px_rgba(255,102,0,0.4)] active:scale-95 transition-transform">
            <span className="text-black font-black text-[11px] uppercase tracking-widest text-center">Éditer</span>
          </button>
        )}

        <button onClick={isEditing ? () => setIsEditing(false) : onBack} className="w-14 h-14 active:scale-90 transition-transform">
          <img src="/icon-return.png" alt="Retour" className="w-full h-full object-contain drop-shadow-lg" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-[4vw] pb-[12vh] no-scrollbar">

        {isEditing ? (
          /* ========================================== */
          /* MODE ÉDITION                               */
          /* ========================================== */
          <div className="bg-[#1E1E1E] rounded-xl border border-[#FF6600]/50 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col gap-4 mb-6">
            
            {/* BLOC 1 : IDENTITÉ */}
            <div className="flex gap-4 items-start">
              <div className="w-[20vw] h-[20vw] max-w-[80px] max-h-[80px] bg-black rounded-lg border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-inner mt-1">
                {tool.imageUrl ? (
                  <img src={tool.imageUrl} className="w-full h-full object-cover" alt="Miniature" />
                ) : (
                  <span className="text-2xl opacity-30">📷</span>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <div>
                  <label className="text-[9px] text-[#FF6600] font-black uppercase tracking-widest ml-1">Marque</label>
                  <input type="text" value={editedTool.brand || ''} onChange={(e) => handleChange('brand', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-white text-[13px] font-bold outline-none focus:border-[#FF6600]" />
                </div>
                <div>
                  <label className="text-[9px] text-[#FF6600] font-black uppercase tracking-widest ml-1">Modèle / Réf</label>
                  <input type="text" value={editedTool.toolName || ''} onChange={(e) => handleChange('toolName', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-white text-[13px] font-bold outline-none focus:border-[#FF6600]" />
                </div>
              </div>
            </div>

            {/* BLOC 2 : SPÉCIFICATIONS TECHNIQUES */}
            <h4 className="text-white/40 text-[9px] font-black uppercase tracking-widest border-b border-white/10 pb-1 mt-2">
              {isConsumableType ? "Gestion des Stocks" : "Spécifications Matérielles"}
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              {/* NOUVEAU : JAUGE POUR LES CONSOMMABLES */}
              {isConsumableType ? (
                <div className="col-span-2">
                  <label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest ml-1 mb-1 block">Niveau de remplissage (%)</label>
                  <div className="flex items-center gap-3 bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      step="5"
                      value={editedTool.consumableLevel || 0} 
                      onChange={(e) => handleChange('consumableLevel', parseInt(e.target.value))} 
                      className="flex-1 accent-[#FF6600]" 
                    />
                    <span className="text-[#FF6600] font-black text-xs w-10 text-right">{editedTool.consumableLevel || 0}%</span>
                  </div>
                </div>
              ) : (
                /* ÉNERGIE / MOTEUR UNIQUEMENT POUR MACHINES */
                <>
                  <div>
                    <label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest ml-1">Énergie</label>
                    <input type="text" value={editedTool.energy || ''} onChange={(e) => handleChange('energy', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-white text-[13px] outline-none focus:border-[#FF6600]" />
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest ml-1">Moteur</label>
                    <input type="text" value={editedTool.motor || ''} onChange={(e) => handleChange('motor', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-white text-[13px] outline-none focus:border-[#FF6600]" />
                  </div>
                </>
              )}

              <div className="col-span-2">
                <label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest ml-1">Numéro de Série / Lot</label>
                <input type="text" value={editedTool.serialNumber || ''} onChange={(e) => handleChange('serialNumber', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-[#FF6600] font-mono text-[13px] outline-none focus:border-[#FF6600]" />
              </div>
            </div>

            {/* BLOC 3 : LOGISTIQUE ET ÉTAT */}
            <h4 className="text-white/40 text-[9px] font-black uppercase tracking-widest border-b border-white/10 pb-1 mt-2">Logistique & Audit</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest ml-1">Valeur (€)</label>
                <input type="number" value={editedTool.price || ''} onChange={(e) => handleChange('price', parseFloat(e.target.value))} placeholder="0.00" className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-white text-[13px] outline-none focus:border-[#FF6600]" />
              </div>
              <div>
                <label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest ml-1">État</label>
                <input type="text" value={editedTool.condition || ''} onChange={(e) => handleChange('condition', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-white text-[13px] outline-none focus:border-[#FF6600]" />
              </div>
              <div className="col-span-2">
                <label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest ml-1">Zone de stockage</label>
                <input type="text" value={editedTool.location || ''} onChange={(e) => handleChange('location', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-white text-[13px] outline-none focus:border-[#FF6600]" />
              </div>
              <div className="col-span-2">
                <label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest ml-1">Observations</label>
                <textarea rows={2} value={editedTool.notes || ''} onChange={(e) => handleChange('notes', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-white text-[13px] outline-none focus:border-[#FF6600] resize-none"></textarea>
              </div>
            </div>

            {onDelete && (
              <div className="mt-4 pt-4 border-t border-red-500/20">
                <button onClick={onDelete} className="w-full bg-red-500/10 text-red-500 border border-red-500/30 py-3.5 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-colors active:scale-95 flex justify-center items-center gap-2">
                  <span className="text-lg leading-none mb-0.5">×</span> Supprimer définitivement
                </button>
              </div>
            )}
          </div>

        ) : (

          /* ========================================== */
          /* MODE LECTURE (RAPPORT DÉTAILLÉ)            */
          /* ========================================== */
          <div className="flex flex-col gap-5">
            
            {/* 1. PHOTO AJUSTÉE */}
            <div className="w-full bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden relative shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
              {/* BADGE UNIQUEMENT POUR MACHINES NON-CONSOMMABLES */}
              {!isConsumableType && (
                <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-md border z-10 ${tool.safetyStatus ? 'bg-red-500/90 border-red-300 text-white' : 'bg-[#2EA043]/90 border-green-300 text-white'}`}>
                  <span className="font-black text-[9px] uppercase tracking-widest drop-shadow-md">
                    {tool.safetyStatus ? '⚠️ ALERTE' :  '✓ OPÉRATIONNEL' }
                  </span>
                </div>
              )}
              
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

            {/* 2. GAUCHE ICONE / DROITE INFOS */}
            <div className="flex items-center gap-4 bg-[#1E1E1E] p-4 rounded-xl border border-white/10 shadow-inner">
              <div className="w-16 h-16 bg-[#D3D3D3] rounded-xl flex items-center justify-center border border-gray-300 shadow-md shrink-0">
                <img src={categoryIcon} className="w-10 h-10 object-contain drop-shadow-md" alt="Catégorie" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h2 className="text-gray-400 font-black text-[10px] tracking-widest uppercase">{brandName}</h2>
                <h1 className="text-white font-black text-[clamp(1.1rem,4.5vw,1.4rem)] uppercase leading-tight whitespace-normal">
                  {cleanToolName}
                </h1>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {!isConsumableType && (tool as any).energy && (
                    <span className="bg-[#FF6600]/20 text-[#FF6600] border border-[#FF6600]/30 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                      ⚡ {(tool as any).energy}
                    </span>
                  )}
                  <span className="text-[#D3D3D3] text-[10px] font-bold uppercase tracking-widest truncate">
                    📍 {tool.location || 'Zone inconnue'}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. SPÉCIFICATIONS TECHNIQUES */}
            <div className="bg-[#1E1E1E] rounded-xl border-t-4 border-[#FF6600] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex flex-col gap-3">
              <h3 className="text-white text-[11px] font-black tracking-[0.2em] uppercase mb-1 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#FF6600] rounded-full shadow-[0_0_8px_#FF6600]"></span>
                {isConsumableType ? "Données Logistiques" : "Spécifications Techniques"}
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {/* NOUVEAU : AFFICHAGE DE LA JAUGE */}
                {isConsumableType ? (
                  <div className="bg-[#121212] rounded-lg p-3 border border-white/5 col-span-2">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Niveau de Stock</span>
                      <span className="text-[#FF6600] font-black text-sm">{tool.consumableLevel || 0}%</span>
                    </div>
                    <div className="w-full bg-black rounded-full h-2.5 overflow-hidden border border-white/10">
                      <div 
                        className="h-full transition-all duration-500 bg-gradient-to-r from-orange-600 to-[#FF6600]" 
                        style={{ width: `${tool.consumableLevel || 0}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-[#121212] rounded-lg p-3 border border-white/5 flex flex-col justify-center">
                      <span className="text-gray-500 text-[8px] font-black uppercase tracking-widest mb-1">Type de Moteur</span>
                      <span className="text-white font-bold text-xs uppercase tracking-wider">{(tool as any).motor || 'Non spécifié'}</span>
                    </div>
                    <div className="bg-[#121212] rounded-lg p-3 border border-white/5 flex flex-col justify-center">
                      <span className="text-gray-500 text-[8px] font-black uppercase tracking-widest mb-1">État Matériel</span>
                      <span className="text-white font-bold text-xs tracking-wider capitalize">{tool.condition || 'Usagé'}</span>
                    </div>
                  </>
                )}

                <div className="bg-[#121212] rounded-lg p-3 border border-white/5 flex justify-between items-center col-span-2">
                  <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Valeur estimée</span>
                  <span className="text-white font-bold text-sm tracking-wider bg-white/5 px-3 py-1 rounded">{tool.price ? `${tool.price} €` : 'N/A'}</span>
                </div>
              </div>

              <div className="bg-[#121212] rounded-lg p-3 border border-white/5 flex justify-between items-center mt-1">
                <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Lot / Réf</span>
                <span className="text-[#FF6600] font-mono font-black text-[11px] tracking-widest bg-[#FF6600]/10 px-2 py-1 rounded border border-[#FF6600]/20">
                  {tool.serialNumber || 'NON RENSEIGNÉ'}
                </span>
              </div>

              {tool.notes && (
                <div className="bg-[#121212] rounded-lg p-3 border border-white/5 mt-1">
                  <span className="text-gray-500 text-[8px] font-black uppercase tracking-widest mb-1 block">Observations</span>
                  <p className="text-white/80 text-[11px] leading-relaxed italic">{tool.notes}</p>
                </div>
              )}
              
              <div className="text-center mt-4 pt-3 border-t border-white/5">
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