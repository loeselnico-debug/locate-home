export const ResultModal = ({ tool, tier, onClose }: { tool: any, tier: string, onClose: () => void }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1A1A1A] border-2 border-[#FF6600] w-full max-w-sm rounded-lg overflow-hidden shadow-2xl">
        <div className="relative h-48 bg-gray-800">
          <img src={tool.imageUrl} alt={tool.name} className="w-full h-full object-cover opacity-60" />
          {/* Détourage en mode Premium ou PRO */}
          {(tier === 'PREMIUM' || tier === 'PRO') && (
            <div className="absolute border-2 border-[#FF6600] animate-pulse" 
                 style={{ left: '20%', top: '30%', width: '40%', height: '40%' }}>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-[#FF6600] font-bold text-lg">{tool.category} {tool.name}</h3>
          <p className="text-white mt-2">
            {tier === 'FREE' ? `Zone : ${tool.generalZone}` : tool.locationDescription}
          </p>
          <button onClick={onClose} className="w-full mt-4 bg-[#FF6600] text-black py-2 font-bold uppercase text-sm">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};