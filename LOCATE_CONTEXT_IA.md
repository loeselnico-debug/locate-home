# 🧠 CONTEXTE CODE SOURCE LOCATE


// ==========================================
// 📂 FICHIER : \src\App.tsx
// ==========================================

```tsx
import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import type { InventoryItem } from './types';
import { useUserTier } from './core/security/useUserTier';

import Hub from './core/ui/Hub';
import Logo from './core/ui/Logo';
import HomeMenu from './modules/home/components/HomeMenu';
import Dashboard from './modules/home/views/Dashboard';
import Library from './modules/home/components/Library';
import { Scanner } from './core/camera/Scanner';
import Search from './modules/home/components/Search';
import { SettingsPage } from './modules/home/views/SettingsPage';
import ValidationSas from './modules/home/views/ValidationSas';
import ToolDetail from './modules/home/components/ToolDetail';
import type { AIScanResult } from './modules/home/views/ValidationSas';

type ViewState = 'hub' | 'home' | 'inventory' | 'scanner' | 'search' | 'settings' | 'category_detail' | 'validation' | 'tool_detail';

const App = () => {
  const [view, setView] = useState<ViewState>('hub');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<InventoryItem | null>(null);
  const [pendingItems, setPendingItems] = useState<AIScanResult[]>([]);
  const { currentTier } = useUserTier();

  useEffect(() => {
    get('locate_systems_db').then((savedItems: InventoryItem[] | undefined) => {
      if (savedItems) setInventory(savedItems);
      setIsDbLoaded(true);
    }).catch(() => setIsDbLoaded(true));
  }, []);

  useEffect(() => {
    if (isDbLoaded) {
      set('locate_systems_db', inventory);
    }
  }, [inventory, isDbLoaded]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setView('category_detail');
  };

  const deleteTool = (id: string) => {
    if (window.confirm("Supprimer cet outil définitivement ?")) {
      setInventory(prev => prev.filter(item => item.id !== id));
      if (view === 'tool_detail') setView('category_detail');
    }
  };

  // LA FONCTION MANQUANTE EST ICI :
  const handleUpdateTool = (updatedTool: InventoryItem) => {
    setInventory(prev => prev.map(item => item.id === updatedTool.id ? updatedTool : item));
    setSelectedTool(updatedTool);
  };

  const handleAnalysisResults = (newItems: AIScanResult[]) => {
    setPendingItems(newItems);
    setView('validation');
  };

 const handleValidatePending = (validatedItems: AIScanResult[]) => {
    const itemsToAdd: InventoryItem[] = validatedItems.map(item => ({
      id: crypto.randomUUID(),
      date: new Date().toLocaleString(),
      // On utilise uniquement le nouveau vocabulaire strict (typography, brandColor)
      toolName: item.label || item.typography || 'Outil Inconnu',
      brand: item.brandColor || 'Marque N/A',
      category: item.categorie_id || 'main',
      location: 'Atelier',
      condition: item.etat || 'Bon état',
      notes: item.description || '',
      isConsumable: item.isConsumable,
      consumableLevel: item.consumableLevel,
      confidence: item.confidence ? item.confidence : undefined,
      imageUrl: item.imageUrl // L'image est sauvegardée ici
    }));

    setInventory(prev => [...itemsToAdd, ...prev]);
    setPendingItems([]);
    setView('inventory');
  };

  const handleRejectPending = () => {
    setPendingItems([]);
    setView('home');
  };

  const getActiveModule = () => {
    if (view.includes('garage')) return 'GARAGE';
    return 'HOME'; 
  };
  const currentModule = getActiveModule();

  return (
    <main className="w-screen min-h-[100dvh] bg-[#121212] text-white font-sans pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] overflow-hidden relative">

      {view !== 'hub' && (
        <header className="fixed top-0 left-0 w-full h-[12.5vh] min-h-[70px] bg-[#121212] z-[100] border-b-2 border-[#D3D3D3]">
          <Logo activeModule={currentModule as any} />
        </header>
      )}

      <div className={view !== 'hub' ? 'pt-[12.5vh] h-full flex flex-col' : 'h-full flex flex-col'}>
        {view === 'hub' && <Hub onSelectModule={(m: string) => m === 'home' && setView('home')} />}
        {view === 'home' && <HomeMenu onNavigate={setView} tier={currentTier} />}

        {view === 'inventory' && (
          <Dashboard
            inventory={inventory}
            onStartScan={() => setView('scanner')}
            onDelete={deleteTool}
            onSelectCategory={handleCategorySelect}
            onBack={() => setView('home')}
          />
        )}

        {view === 'category_detail' && (
          <Library
            onBack={() => setView('inventory')}
            selectedCategoryId={selectedCategory}
            onStartScan={() => setView('scanner')}
            inventory={inventory}
            onSelectTool={(tool) => {
              setSelectedTool(tool);
              setView('tool_detail');
            }}
          />
        )}

        {view === 'tool_detail' && selectedTool && (
          <ToolDetail 
            tool={selectedTool} 
            onBack={() => setView('category_detail')} 
            onUpdate={handleUpdateTool} // BRANCHEMENT SAUVEGARDE
            onDelete={() => deleteTool(selectedTool.id)} // BRANCHEMENT SUPPRESSION
          />
        )}

        {view === 'scanner' && <Scanner onBack={() => setView('home')} onAnalysisComplete={handleAnalysisResults} />}
        {view === 'search' && <Search onBack={() => setView('home')} inventory={inventory} />}

        {view === 'validation' && (
          <ValidationSas
            pendingItems={pendingItems}
            onValidateAll={handleValidatePending}
            onRejectAll={handleRejectPending}
          />
        )}

        {view === 'settings' && (
          <div className="flex-1 overflow-hidden relative">
            <SettingsPage onBack={() => setView('home')} />
          </div>
        )}
      </div>
    </main>
  );
};

export default App;
```

// ==========================================
// 📂 FICHIER : \src\core\ai\decisionEngine.ts
// ==========================================

```tsx
// Logique de validation selon la Charte de Vérité LOCATEHOME
export interface ScanResult {
  typography?: string;  // Étape 4 : Modèle exact (ex: DHP484)
  zoomDetail?: string;  // Étape 3 : Mandrin, sabot, etc.
  morphology: string;   // Étape 2 : Type d'objet
  brandColor: string;   // Étape 1 : Hypothèse de marque
  confidence: number;   // Seuil de certitude
}

export const validateLocateObject = (data: ScanResult) => {
  // Seuil de Vigilance : 70% minimum pour agir
  if (data.confidence < 0.70) {
    return { status: "MANUAL_VALIDATION", message: "Certitude insuffisante" };
  }

  // Application de la hiérarchie stricte : 4 -> 3 -> 2 -> 1
  const isFullyValidated = !!(data.typography && data.zoomDetail && data.morphology);

  if (isFullyValidated) {
    return {
      status: "CERTIFIED",
      label: data.typography,
      safetyCheck: "OK" 
    };
  }

  return { status: "ANALYZING", message: "Analyse morphologique en cours..." };
};
```

// ==========================================
// 📂 FICHIER : \src\core\ai\expertisemetier\home.ts
// ==========================================

```tsx
/**
 * LOCATEHOME - RÉFÉRENTIEL D'EXPERTISE MÉTIER (V1.5)
 * Source : "La Bible" (Charte de Vérité) & Analyse Technique Électroportatif.
 * MASTER DATA : Intègre 100% des spécifications terrain (Documents 01, 02, 03).
 */

export const INDUSTRIAL_RULES = {
  // 1. PROTOCOLE D'ANALYSE VISUELLE PYRAMIDALE (PAVP V5.0)
  // L’identification doit strictement être réalisée selon une validation régressive (Étape 4 -> 3 -> 2 -> 1). 
  // Un objet est confirmé avec >90% de certitude si au moins 3 niveaux concordent parfaitement.
  identification_protocol: {
    step_4_ocr: "Lecture typographique et gravure. Scan instantané des flancs pour logos et nomenclatures. Arbitre final décisif.",
    step_3_zoom: "Analyse des sous-systèmes : Position LED, interface batterie (Pod 12V vs Glissière 18V), gâchette, accouplement.",
    step_2_morphology: "Définition du type d'objet : Analyse du nez (mandrin, sabot) et du corps.",
    step_1_color: "Colorimétrie et signature visuelle globale. Filtre primaire d'hypothèse de marque."
  },

  // 2. SIGNATURES MARQUES & ADN DESIGN
  brand_dna: {
    makita: { color: "Bleu-vert/cyan", style: "Austère, vis d'assemblage apparentes, aspect bourru", led: "Sous le mandrin", battery: "LXT 18V (~630g) ou XGT 40V." },
    milwaukee: { color: "Rouge", style: "Design 'Bloc' (boxy), aspect brut", led: "Sous le mandrin (ombre portée)", battery: "M18 (jeu mécanique) ou M12", feature: "Logo/Bouton ONE-KEY." },
    bosch_professional: { color: "Bleu foncé", style: "Premium, soft-grip parfaitement moulé", led: "Sur le pied (base)", battery: "ProCore", feature: "Module Bluetooth Connectivity." },
    dewalt: { color: "Jaune et noir", style: "Robuste et ergonomique", battery: "XR 20V, FlexVolt 54V, Powerstack", prefix: "DC (Cordless) ou DWHT (Hand Tool)." },
    hilti: { color: "Rouge Signalisation RAL 3020", feature: "Perçage et démolition, identification OCR requise." },
    metabo: { color: "Vert qualitatif", feature: "Gâchette antidérapante caoutchoutée unique (99% certitude), système CAS." },
    festool_ryobi: { feature: "Validation EXCLUSIVEMENT par OCR (Étape 4). Système Centrotec pour Festool." }
  },

  // 3. NOMENCLATURES OCR (JUGE DE PAIX)
  nomenclatures: {
    makita: "DDF (Perceuse), DTD (Chocs), DHP (Percussion), DGA (Meuleuse). Suffixe J = Coffret Makpac.",
    dewalt_codes: {
      logic: "3ème lettre : D (Drill), G (Grinder), S (Saw), H (Hammer).",
      suffixes: "N (Nu), NT (Coffret TSTAK), E (Powerstack 1.7Ah), T (FlexVolt 54V / TSTAK)."
    }
  },

  // 4. DISTINCTION TECHNIQUE (NEZ ET TÊTE)
  tool_head_logic: {
    perceuse_visseuse: "Mandrin rond auto-serrant + Bague de couple graduée.",
    visseuse_choc: "Nez court, mandrin hexagonal rapide, absence de bague de couple.",
    boulonneuse: "Réception carrée 1/2 ou 3/4 sur tête métallique.",
    perforateur: "Corps allongé, mandrin type SDS / SDS+ (système à gorge).",
    modulaire: "Bague d'accouplement + icône 'cadenas' à la base du mandrin (ex: Bosch FlexiClick)."
  },

  // 5. OUTILLAGE À MAIN (PAVP V5.0 ADAPTÉ)
  hand_tools: {
    facom_protwist: { jaune: "Phillips", rouge: "Plat", bleu: "Pozidriv", vert: "Torx", gris: "Hexagonal." },
    facom_douilles: "Système 'GRIP' : observation d’un système angulaire multiple à l'intérieur.",
    wera_kraftform: { noir: "Pozidriv", bleu: "Hexagonal", vert: "Torx." },
    wera_douilles: "Orange (5.5), Bleu (6), Jaune m. (7), Rose (8), Jaune (10), Noir (12), Vert (13).",
    others: "Kirschen (Deux Cerises + protections bleues), Wiha (Manche VDE Rouge/Jaune + marquage laser)."
  },

  // 6. SÉCURITÉ ET VIGILANCE (SOCLE INALTÉRABLE)
  security: {
    trust_threshold: 70, // Blocage si < 70%. Règle des 90% pour validation automatique.
    safety_check: "Contrôle gainage (isolement 1000V) et procédure VAT systématique pour électriciens.",
    epi_alert: "Machine tournante = Gants + Lunettes. Machine à chocs = Lunettes + Bouchons.",
    battery_status: "Rails visibles sans batterie = 'Électroportatif non opérationnel'."
  },

  // 7. CONSOMMABLES ET JAUGE DE DROPSHIPPING
  consumables: {
    mastic_silicone: "Canule pointue = Neuf / Canule coupée ou biseautée = Entamé (Priorité d'utilisation).",
    visserie_joints: "Quantité en % du volume. Joints par profilage des strates (éviter les ombres).",
    contenants: "Scellé rompu / rabats entrouverts = 'Présence à confirmer physiquement'.",
    // VERROUILLAGE INFORMATIQUE STRICT :
    format_obligatoire: "Si l'objet analysé est un consommable, tu DOIS évaluer le volume restant selon les strates et l'air. Tu retourneras UNIQUEMENT un nombre entier compris entre 0 et 100 pour définir le niveau. Interdiction stricte d'utiliser le symbole '%' ou du texte."
  },

  // 8. CLAUSES PUNITIVES ET ANTI-HALLUCINATION (STRICT)
  anti_hallucination: {
    regle_1_contenants: "INTERDICTION STRICTE de deviner le contenu d'une mallette, d'un carton fermé ou d'un bac opaque. Si le contenant est fermé, décris le contenant et plafonne la certitude à 50%.",
    regle_2_certitude_ocr: "Si aucune typographie (Étape 4) n'est lisible clairement sur l'image, la valeur 'confidence' NE DOIT JAMAIS dépasser 0.65.",
    regle_3_doute_et_couleur: "La couleur seule (Étape 1) ne suffit pas. Une machine bleue n'est pas forcément Bosch. Sans confirmation de l'Étape 2 ou 3, plafonne la certitude à 0.40.",
    regle_4_franchise: "Si tu ne reconnais pas l'outil, n'invente rien. Retourne des valeurs génériques et une 'confidence' de 0.10."
  }
};
```

// ==========================================
// 📂 FICHIER : \src\core\ai\expertisemetier\maintenance.ts
// ==========================================

```tsx

```

// ==========================================
// 📂 FICHIER : \src\core\ai\expertisemetier\mecanique.ts
// ==========================================

```tsx
export const GARAGE_M5_RULES = {
  // 1. PROTOCOLE DE COMMUNICATION (STRICT)
  comm_logic: {
    format: "Étape [X] : [Action]. Dis 'Fait' quand terminé.",
    style: "Zéro courtoisie, isolation du doute, ordre de nettoyage lentille si flou."
  },

  // 2. SAFETY GATES (VETO IA)
  safety_veto: {
    levage: "Confirmation visuelle CHANDELLES/BÉQUILLES obligatoire. Veto si hydraulique seul.",
    ve_hvb: "Si > 60V DC / 25V AC : Exiger Gants Classe 0 + Sur-gants + Habilitation B1VL/B2VL.",
    hydraulique: "Consignation PTO (Prise de mouvement) obligatoire avant flexible."
  },

  // 3. DIAGNOSTIC J1939 (BUS CAN PL)
  j1939_logic: {
    fmi_codes: {
      3: "Court-circuit au pôle + (Vcc)",
      4: "Court-circuit à la masse (GND)",
      5: "Circuit ouvert (Fil coupé/débranché)"
    },
    utac_braking: {
      target_pressure: "7.2 à 8.1 bars",
      min_test_pressure: "6.2 à 6.9 bars",
      alert_threshold: "Dessiccateur anormal si < 7.2 bars"
    }
  },

  // 4. COUPLES DE SERRAGE (SÉCURITÉ LIAISON AU SOL)
  torque_specs: {
    volvo_fh_fm: "610 Nm",
    scania_mercedes_daf: "600 Nm",
    renault_t: "450-500 Nm",
    post_service: "Alerte resserrage obligatoire à 100 km"
  },

  // 5. THERMIQUE & COLORIMÉTRIE (VISION HDR)
  thermal_analysis: {
    scale: [
      { color: "Jaune Paille", temp: "220°C", status: "Dureté Max / Cassant" },
      { color: "Bleu", temp: "295°C", status: "DANGER : Acier détrempé / Remplacement obligatoire" },
      { color: "Gris", temp: ">350°C", status: "CRITIQUE : Structure compromise" }
    ],
    hydraulique_tactile: {
      "60C": "Tolérable 10s",
      "70C": "Tolérable 3s",
      "80C": "Douleur aiguë / Brûlure / Veto IA"
    }
  },

  // 6. AUDIO SPECTRAL (SIGNATURES)
  acoustic_signatures: {
    claquement: "Injecteur / Embiellage / Distribution",
    sifflement: "Fuite air (EBS) / Turbo / Cavitation pompe"
  }
};
```

// ==========================================
// 📂 FICHIER : \src\core\ai\geminiService.ts
// ==========================================

```tsx
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CATEGORIES } from '../../types';
import { INDUSTRIAL_RULES } from './expertisemetier/home';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

// 🧠 INJECTION STRICTE DE LA BIBLE MÉTIER ET DU FORMAT JSON
const getSystemPrompt = (userLocation: string, rulesContext: string, categoriesContext: string) => `
Tu es l'Expert Vision Industrielle du système LOCATE HOME. Localisation de l'analyse : ${userLocation}.
Ton rôle est d'analyser les images/vidéos en appliquant STRICTEMENT le Protocole d'Analyse Visuelle Pyramidale (PAVP V5.0) en 4 étapes.

VOICI TON RÉFÉRENTIEL D'EXPERTISE MÉTIER OBLIGATOIRE :
${rulesContext}

CATÉGORIES AUTORISÉES (Utilise uniquement ces ID) :
${categoriesContext}

RÈGLE ABSOLUE : Tu dois retourner UNIQUEMENT un tableau JSON valide. Pas de texte avant, pas de markdown, juste le tableau.
Chaque outil détecté doit être un objet avec cette structure EXACTE :
[
  {
    "brandColor": "Étape 1 : Hypothèse de marque (ex: Bosch Professional, Makita)",
    "morphology": "Étape 2 : Type d'objet (ex: Perceuse-visseuse)",
    "zoomDetail": "Étape 3 : Détail technique (ex: Mandrin auto-serrant, batterie 12V)",
    "typography": "Étape 4 : Modèle exact lu ou déduit (ex: GSR 12V-15)",
    "confidence": 0.95,
    "categorie_id": "ID exact de la catégorie correspondante",
    "etat": "Bon état / Usagé / Neuf",
    "description": "Justification de l'analyse métier",
    "isConsumable": false,
    "consumableLevel": 100
  }
]
IMPORTANT : La valeur "confidence" DOIT impérativement être un nombre décimal compris entre 0.01 et 0.99 (ex: 0.85).
`;

export const geminiService = {
  analyzeVideoBurst: async (base64Images: string[], userLocation: string = "Atelier"): Promise<any[]> => {
    if (!apiKey) return [];
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const categoriesContext = CATEGORIES.map(cat => `- ID: "${cat.id}" | Label: ${cat.label}`).join('\n');
      const rulesContext = JSON.stringify(INDUSTRIAL_RULES, null, 2);

      // On utilise bien la fonction ici !
      const prompt = getSystemPrompt(userLocation, rulesContext, categoriesContext);
      
      const imageParts = base64Images.map(base64 => ({
        inlineData: { data: base64.split(',')[1], mimeType: "image/jpeg" }
      }));

      const result = await model.generateContent([prompt, ...imageParts]);
      return JSON.parse(result.response.text());
    } catch (error) { 
      console.error("Erreur Gemini (Burst):", error);
      return []; 
    }
  },

  analyzeVideo: async (videoBase64: string, userLocation: string = "Atelier"): Promise<any[]> => {
    if (!apiKey) return [];
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const categoriesContext = CATEGORIES.map(cat => `- ID: "${cat.id}" | Label: ${cat.label}`).join('\n');
      const rulesContext = JSON.stringify(INDUSTRIAL_RULES, null, 2);

      // Appel de la fonction pour la vidéo
      const prompt = getSystemPrompt(userLocation, rulesContext, categoriesContext);

      const videoPart = {
        inlineData: { data: videoBase64.split(',')[1], mimeType: "video/webm" }
      };

      const result = await model.generateContent([prompt, videoPart]);
      return JSON.parse(result.response.text());
    } catch (error) { 
      console.error("Erreur Gemini (Video):", error);
      return []; 
    }
  }
};
```

// ==========================================
// 📂 FICHIER : \src\core\ai\liveService.ts
// ==========================================

```tsx
/**
 * LOCATE SYSTEMS - LIVE ASSISTANT SERVICE (V1.1)
 * Architecture : WebSocket Multimodal (Gemini 2.0 Flash)
 * Standard : OSA/CBM & RGPD Zéro-Trace
 */

import { INDUSTRIAL_RULES } from './expertisemetier/home';

export interface LiveDiagnostic {
  hypothesis: string;
  confidence: number;
  nextStep: string;
  safetyAlert?: string;
}

class LiveService {
  private socket: WebSocket | null = null;
  private frameInterval: number | null = null;

  async connect(mode: 'maintenance' | 'mecanique', onMessage: (data: LiveDiagnostic) => void) {
    // 1. Récupération de la clé API
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
    
    if (!apiKey) {
      console.error("Clé d'API manquante. Vérifiez le fichier .env.");
      throw new Error("Impossible d'établir le tunnel sécurisé.");
    }

    const systemInstruction = `
      Tu es l'Expert de Maintenance Industrielle LOCATE. 
      Mode actuel : ${mode.toUpperCase()}.
      Protocole de sécurité strict : ${INDUSTRIAL_RULES.security.epi_alert}
      Utilise la méthode AMDEC pour le diagnostic.
    `;

    try {
      // 2. Injection de la clé directement dans l'URL (Requis par Gemini WebSocket)
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BiDiGenerateContent?key=${apiKey}`;
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log("🔗 Tunnel Live LOCATE établi.");
        
        // 3. Envoi du Setup Message avec le Manifeste Métier
        const setupMessage = {
          setup: {
            model: "models/gemini-2.0-flash",
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            }
          }
        };
        this.socket?.send(JSON.stringify(setupMessage));
      };

      this.socket.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          
          // Log brut pour surveiller les retours complexes de l'API Bidi
          console.log("Trame IA reçue :", response);

          // Remplacement du hardcoding par un retour générique en attendant le parsing complet des 'serverContent'
          onMessage({
            hypothesis: "Analyse du flux visuel en cours...",
            confidence: 0.90,
            nextStep: "Attente de votre directive vocale ou visuelle."
          });
        } catch (error) {
          console.error("Erreur de lecture de la trame IA :", error);
        }
      };

    } catch (error) {
      console.error("Erreur de connexion Live :", error);
      throw new Error("Connexion impossible. Passage en mode Edge (Asynchrone).");
    }
  }

  sendVideoFrame(canvas: HTMLCanvasElement) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      // 4. Nettoyage du signal : Gemini refuse l'en-tête "data:image/jpeg;base64,"
      const base64Data = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
      
      const message = {
        realtimeInput: {
          mediaChunks: [{
            mimeType: "image/jpeg",
            data: base64Data
          }]
        }
      };
      this.socket.send(JSON.stringify(message));
    }
  }

  terminate() {
    if (this.frameInterval) {
      window.clearInterval(this.frameInterval);
      this.frameInterval = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    console.log("🔒 [ZÉRO-TRACE] Session terminée. Buffer vidéo détruit.");
  }
}

export const liveService = new LiveService();
```

// ==========================================
// 📂 FICHIER : \src\core\ai\vehicleLiveDiag.ts
// ==========================================

```tsx
/**
 * LOCATE GARAGE - Moteur de Sécurité Live (M5)
 * Rôle : Validation visuelle avant intervention.
 */

export interface SafetyCheckResult {
  authorized: boolean;
  missingElement?: string;
  alertLevel: 'INFO' | 'WARNING' | 'CRITICAL';
}

export const checkMechanicalSafety = (
  mode: 'levage' | 'electrique' | 'hydraulique',
  visualTags: string[]
): SafetyCheckResult => {
  
  if (mode === 'levage') {
    const hasChandelles = visualTags.includes('chandelle_securite');
    return {
      authorized: hasChandelles,
      missingElement: hasChandelles ? undefined : "CHANDELLES DE SÉCURITÉ NON DÉTECTÉES",
      alertLevel: hasChandelles ? 'INFO' : 'CRITICAL'
    };
  }

  if (mode === 'electrique') {
    const hasGants = visualTags.includes('gants_classe_0');
    return {
      authorized: hasGants,
      missingElement: hasGants ? undefined : "GANTS ISOLANTS CLASSE 0 OBLIGATOIRES",
      alertLevel: 'CRITICAL'
    };
  }

  return { authorized: true, alertLevel: 'INFO' };
};
```

// ==========================================
// 📂 FICHIER : \src\core\camera\Scanner.tsx
// ==========================================

```tsx
import React, { useState, useRef, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import { geminiService } from '../ai/geminiService';
import { getCustomLocations } from '../../core/storage/memoryService';
import { validateLocateObject } from '../ai/decisionEngine';
import type { ScanResult } from '../ai/decisionEngine';

interface ScannerProps {
  onBack: () => void;
  onAnalysisComplete: (newItems: any[]) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onBack, onAnalysisComplete }) => {
  const [selectedLocation, setSelectedLocation] = useState(getCustomLocations()[0].label);
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [pendingItems, setPendingItems] = useState<any[] | null>(null);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  
  // NOUVEAU : État du consentement légal
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { console.error("Accès caméra refusé", err); }
  };

  // Initialisation : Vérification du consentement avant d'allumer la caméra
  useEffect(() => {
    get('locate_ai_consent').then((val) => {
      if (val === true) {
        setHasConsented(true);
        startCamera();
      } else {
        setHasConsented(false); // Affiche la modale
      }
    });

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const handleConsent = async () => {
    await set('locate_ai_consent', true);
    setHasConsented(true);
    startCamera();
  };

  const toggleTorch = async () => {
    if (!videoRef.current?.srcObject) return;
    const track = (videoRef.current.srcObject as MediaStream).getVideoTracks()[0];
    const capabilities = track.getCapabilities() as any;
    if (capabilities.torch) {
      try {
        const newState = !flashOn;
        await track.applyConstraints({ advanced: [{ torch: newState }] } as any);
        setFlashOn(newState);
      } catch (err) { console.error("Erreur Torche:", err); }
    }
  };

  const handlePhotoClick = async () => {
    if (!flashOn) await toggleTorch();
    setTimeout(async () => {
      if (!videoRef.current) return;
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const img = canvas.toDataURL('image/jpeg', 0.9);
      if (flashOn) await toggleTorch();
      runAnalysis(img, true);
    }, 500);
  };

  const handleVideoRecord = async () => {
    if (!videoRef.current?.srcObject) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    // On force un bitrate bas pour garantir un fichier léger
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8', videoBitsPerSecond: 1000000 });
    const chunks: Blob[] = [];

    setIsScanning(true);
    setRecordingTime(0);
    if (!flashOn) await toggleTorch();

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        runAnalysis(base64, false);
      };
      reader.readAsDataURL(blob);
      if (flashOn) await toggleTorch();
      setIsScanning(false);
      setRecordingTime(0);
    };

    mediaRecorder.start();

    // Coupe-circuit strict et chronomètre visuel
    let timeElapsed = 0;
    const timerInterval = setInterval(() => {
      timeElapsed++;
      setRecordingTime(timeElapsed);
      if (timeElapsed >= 10) {
        clearInterval(timerInterval);
        if (mediaRecorder.state === "recording") mediaRecorder.stop();
      }
    }, 1000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Videur : Cas d'une image
    if (file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        alert("ERREUR ZÉRO-TRUST : L'image dépasse la limite stricte de 5 Mo.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => runAnalysis(reader.result as string, true);
      reader.readAsDataURL(file);
    } 
    // 2. Videur : Cas d'une vidéo
    else if (file.type.startsWith('video/')) {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.onloadedmetadata = () => {
        URL.revokeObjectURL(videoElement.src);
        if (videoElement.duration > 11) { // 1s de tolérance technique
          alert("ERREUR ZÉRO-TRUST : La vidéo dépasse la limite stricte de 10 secondes.");
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => runAnalysis(reader.result as string, false);
        reader.readAsDataURL(file);
      };
      videoElement.src = URL.createObjectURL(file);
    }
  };

  const runAnalysis = async (data: string, isImage: boolean) => {
    setIsAnalyzing(true);
    try {
      const rawResults = isImage 
        ? await geminiService.analyzeVideoBurst([data], selectedLocation)
        : await geminiService.analyzeVideo(data, selectedLocation);

      if (rawResults && rawResults.length > 0) {
        const certifiedItems = rawResults.map((item: any) => {
          const validation = validateLocateObject(item as ScanResult);
          return {
            ...item,
            _validationStatus: validation.status,
            _validationMessage: validation.message,
            label: validation.status === "CERTIFIED" ? validation.label : item.label,
            // C'est ICI qu'on sauve l'image en Base64 pour l'inventaire !
            imageUrl: isImage ? data : undefined 
          };
        }).filter((item: any) => item._validationStatus === "CERTIFIED");
        
        if (certifiedItems.length > 0) {
          setPendingItems(certifiedItems);
        } else {
          console.warn("LOCATEHOME: Aucun objet n'a passé le sas de sécurité (seuil < 70%).");
        }
      }
    } finally { 
      setIsAnalyzing(false); 
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white overflow-hidden flex flex-col font-sans">
      
      {/* ========================================== */}
      {/* SAS LÉGAL - CONSENTEMENT IA OBLIGATOIRE    */}
      {/* ========================================== */}
      {hasConsented === false && (
        <div className="absolute inset-0 z-[300] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-[6vw] text-center">
          <div className="bg-[#1E1E1E] border border-[#FF6600]/30 rounded-2xl p-[6vw] max-w-sm w-full shadow-[0_0_30px_rgba(255,102,0,0.15)] flex flex-col items-center">
            <div className="w-[15vw] h-[15vw] max-w-[60px] max-h-[60px] bg-[#FF6600]/10 rounded-full flex items-center justify-center mb-[3vh] border border-[#FF6600]/50">
              <span className="text-[#FF6600] text-2xl font-black">!</span>
            </div>
            <h2 className="text-white font-black uppercase tracking-widest text-[clamp(1.2rem,5vw,1.5rem)] mb-[2vh]">
              Consentement IA
            </h2>
            <p className="text-white/70 text-[clamp(0.85rem,3vw,1rem)] leading-relaxed mb-[4vh]">
              Locate Home utilise l'IA pour identifier vos outils. L'image est analysée puis <strong className="text-white">immédiatement supprimée</strong>. Aucune photo n'est stockée sur nos serveurs.
            </p>
            <button 
              onClick={handleConsent}
              className="w-full bg-[#FF6600] text-white py-[2vh] rounded-xl font-black uppercase tracking-widest text-[clamp(0.8rem,3vw,1rem)] shadow-[0_0_15px_rgba(255,102,0,0.3)] active:scale-95 transition-transform"
            >
              J'accepte et j'active
            </button>
            <button 
              onClick={onBack}
              className="w-full mt-[2vh] bg-transparent text-white/50 py-[1.5vh] rounded-xl font-bold uppercase tracking-widest text-[clamp(0.7rem,2.5vw,0.9rem)] active:scale-95 transition-transform"
            >
              Refuser & Quitter
            </button>
          </div>
        </div>
      )}

      {/* INJECTION CSS POUR LE LASER FLUIDE */}
      <style>{`
        .laser-sweep { animation: sweep 2.5s ease-in-out infinite alternate; }
        @keyframes sweep { 0% { top: 5%; opacity: 0.5; } 50% { opacity: 1; } 100% { top: 95%; opacity: 0.5; } }
      `}</style>

      {/* FLUX VIDÉO & ASSOMBRISSEMENT */}
      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,102,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,102,0,0.03)_1px,transparent_1px)] bg-[size:5vw_5vw]"></div>

      {/* AFFICHAGE TÊTE HAUTE (HUD TOP BAR) */}
      <div className="absolute top-[env(safe-area-inset-top,2vh)] left-0 w-full flex justify-between items-center px-[4vw] pt-[2vh] z-20">
        <button onClick={onBack} className="w-[12vw] h-[12vw] max-w-[50px] max-h-[50px] bg-black/40 border border-white/10 rounded-xl backdrop-blur-md flex items-center justify-center active:scale-90">
          <img src="/icon-return.png" alt="Retour" className="w-[60%] h-[60%] object-contain opacity-80" />
        </button>
        
        <div className="flex flex-col items-center">
          <h1 className="text-[4vw] sm:text-xl tracking-widest uppercase flex gap-2">
            <span className="font-bold text-white">LOCATE</span>
            <span className="font-black text-[#FF6600] drop-shadow-[0_0_10px_rgba(255,102,0,0.8)]">SCAN</span>
          </h1>
        </div>

        <button onClick={toggleTorch} className={`w-[12vw] h-[12vw] max-w-[50px] max-h-[50px] rounded-xl backdrop-blur-md flex items-center justify-center border transition-all active:scale-90 ${flashOn ? 'bg-[#FF6600]/20 border-[#FF6600] shadow-[0_0_15px_rgba(255,102,0,0.4)]' : 'bg-black/40 border-white/10'}`}>
          <span className={`text-xl ${flashOn ? 'text-[#FF6600]' : 'text-white/50 opacity-50 grayscale'}`}>⚡</span>
        </button>
      </div>

      {/* VISEUR TACTIQUE (CENTRE) */}
      <div className="absolute inset-x-[8vw] top-[20vh] bottom-[30vh] pointer-events-none z-10 flex flex-col justify-between">
        <div className="bg-[#FF6600] text-black font-black text-[2vw] sm:text-[10px] uppercase tracking-widest self-start px-2 py-1 rounded shadow-[0_0_10px_rgba(255,102,0,0.6)]">
          {isScanning ? 'ACQUISITION VIDÉO...' : 'EN ATTENTE CIBLE'}
        </div>

        <div className="relative flex-1 my-4 border border-white/10 bg-black/10 rounded-lg">
          <div className="absolute top-0 left-0 w-[8vw] h-[8vw] border-t-4 border-l-4 border-[#FF6600] rounded-tl-lg shadow-[0_0_15px_#FF6600,inset_0_0_10px_#FF6600]"></div>
          <div className="absolute top-0 right-0 w-[8vw] h-[8vw] border-t-4 border-r-4 border-[#FF6600] rounded-tr-lg shadow-[0_0_15px_#FF6600,inset_0_0_10px_#FF6600]"></div>
          <div className="absolute bottom-0 left-0 w-[8vw] h-[8vw] border-b-4 border-l-4 border-[#FF6600] rounded-bl-lg shadow-[0_0_15px_#FF6600,inset_0_0_10px_#FF6600]"></div>
          <div className="absolute bottom-0 right-0 w-[8vw] h-[8vw] border-b-4 border-r-4 border-[#FF6600] rounded-br-lg shadow-[0_0_15px_#FF6600,inset_0_0_10px_#FF6600]"></div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[6vw] h-[6vw] flex items-center justify-center opacity-40">
            <div className="absolute w-full h-[1px] bg-[#FF6600]"></div>
            <div className="absolute h-full w-[1px] bg-[#FF6600]"></div>
            <div className="absolute w-1/3 h-1/3 border border-[#FF6600] rounded-full"></div>
          </div>

          <div className="absolute left-0 right-0 h-[2px] bg-[#FF6600] shadow-[0_0_20px_#FF6600] laser-sweep"></div>

          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-30 rounded-lg">
              <div className="w-[12vw] h-[12vw] border-4 border-black border-t-[#FF6600] rounded-full animate-spin mb-4"></div>
              <div className="text-[#FF6600] font-black tracking-widest text-[3vw] sm:text-xs animate-pulse uppercase">Traitement Zéro-Trust</div>
            </div>
          )}
        </div>
      </div>

      {/* CONSOLE DE COMMANDE INFERIEURE */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent pt-[10vh] pb-[max(8vh,env(safe-area-inset-bottom))] px-[4vw] z-20 flex flex-col gap-[3vh]">
        <div className="flex gap-[2vw] overflow-x-auto no-scrollbar w-full px-[2vw]">
          {getCustomLocations().map(loc => (
            <button 
              key={loc.id} 
              onClick={() => setSelectedLocation(loc.label)} 
              className={`whitespace-nowrap px-[4vw] py-[1vh] rounded-lg text-[2.5vw] sm:text-[10px] font-black border transition-all ${selectedLocation === loc.label ? 'bg-black border-[#FF6600] text-[#FF6600] shadow-[0_0_10px_rgba(255,102,0,0.3)]' : 'bg-black/50 border-white/10 text-white/40'}`}
            >
              {loc.label.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-end w-full px-[2vw]">
          <div className="flex flex-col items-center gap-[1vh] w-1/4">
            <button onClick={() => fileInputRef.current?.click()} className="w-[14vw] h-[14vw] max-w-[60px] max-h-[60px] bg-black/60 border border-white/10 rounded-2xl flex items-center justify-center active:scale-90 backdrop-blur">
              <img src="/icon-import.png" className="w-[60%] h-[60%] object-contain" alt="Import" />
            </button>
            <span className="text-[2vw] sm:text-[8px] text-[#FF6600] font-bold uppercase tracking-widest text-center leading-tight">MAX 5MO<br/>/ 10S</span>
            {/* Ajout du support vidéo dans l'input */}
            <input type="file" ref={fileInputRef} onChange={handleImport} hidden accept="image/*,video/*" />
          </div>

          <div className="flex flex-col items-center gap-[1vh] w-1/4">
            <button onClick={handlePhotoClick} disabled={isScanning || isAnalyzing} className="w-[18vw] h-[18vw] max-w-[80px] max-h-[80px] bg-black/60 border border-white/10 rounded-3xl flex items-center justify-center active:scale-95 backdrop-blur shadow-[0_5px_20px_rgba(0,0,0,0.5)]">
              <img src="/icon-photo.png" className="w-[70%] h-[70%] object-contain" alt="Photo" />
            </button>
            <span className="text-[2vw] sm:text-[8px] text-[#FF6600] font-bold uppercase tracking-widest">MAX 5MO</span>
          </div>

          <div className="flex flex-col items-center gap-[1vh] w-1/4">
            <button onClick={handleVideoRecord} disabled={isScanning || isAnalyzing} className={`w-[18vw] h-[18vw] max-w-[80px] max-h-[80px] bg-black/60 border rounded-3xl flex items-center justify-center backdrop-blur active:scale-95 transition-all ${isScanning ? 'border-[#FF6600] shadow-[0_0_20px_rgba(255,102,0,0.5)] animate-pulse' : 'border-white/10 shadow-[0_5px_20px_rgba(0,0,0,0.5)]'}`}>
              <img src="/icon-video.png" className="w-[70%] h-[70%] object-contain" alt="Vidéo" />
            </button>
            <span className="text-[2vw] sm:text-[8px] text-[#FF6600] font-bold uppercase tracking-widest">
              {isScanning ? `SCAN... ${recordingTime}S` : 'MAX 10S'}
            </span>
          </div>
        </div>
      </div>

      {/* MODAL RÉSULTATS */}
      {pendingItems && (
        <div className="absolute inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col p-[4vw] animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between mt-[6vh] mb-[4vh] border-b border-white/10 pb-[2vh]">
            <h2 className="text-[#FF6600] font-black text-[6vw] sm:text-2xl tracking-widest uppercase">Inventaire Vidéo</h2>
            <span className="bg-[#1E1E1E] px-4 py-2 rounded-xl text-[#FF6600] font-black text-[3vw] sm:text-sm">{pendingItems.length} OBJETS</span>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3">
            {pendingItems.map((item, idx) => (
                <div key={idx} className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-lg leading-tight">{item.label || item.typography || "Outil identifié"}</span>
                    <span className="text-white/40 text-[9px] uppercase tracking-widest">{item.categorie_id}</span>
                  </div>
                  <div className="text-[#FF6600] font-black text-xs">{item.confidence ? Math.round(item.confidence * 100) : 0}%</div>
                </div>
              ))}
          </div>
          <div className="flex gap-4 mt-auto pt-6 pb-[env(safe-area-inset-bottom,4vh)]">
            <button onClick={() => {setPendingItems(null);}} className="flex-1 py-4 rounded-2xl bg-[#1E1E1E] text-white font-black uppercase tracking-widest active:scale-95 border border-white/10">Rejeter</button>
            <button onClick={() => onAnalysisComplete(pendingItems)} className="flex-[2] py-4 rounded-2xl bg-[#FF6600] text-black font-black uppercase tracking-widest active:scale-95 shadow-[0_0_20px_rgba(255,102,0,0.4)]">Intégrer</button>
          </div>
        </div>
      )}
    </div>
  );
};
```

// ==========================================
// 📂 FICHIER : \src\core\i18n\useTranslation.ts
// ==========================================

```tsx
import { useAppSettings } from '../storage/useAppSettings';

const dictionary = {
  FR: {
    settings_title: "Paramètres",
    settings_subtitle: "Configuration du système Locate Home",
    intl_title: "INTERNATIONALISATION",
    intl_lang: "LANGUE & UNITÉS",
    intl_lang_desc: "Action combinée : Langue + Système de mesure",
    tier_title: "OFFRE & ABONNEMENT",
    tier_desc: "Accès Dev / Sélection du Tier",
    sec_title: "SÉCURITÉ & DONNÉES",
    sec_zero: "ARCHITECTURE ZÉRO-SERVEUR",
    sec_desc_1: "Vos données sont stockées ",
    sec_desc_2: "exclusivement et localement",
    sec_desc_3: " sur cet appareil.",
    sec_vol: "VOLUME OCCUPÉ : ",
    legal_agree: "J'accepte les ",
    legal_link: "Conditions Générales (CGU/CGV) et la Politique de confidentialité",
    // NOUVEAU : Textes du profil Assurance
    profile_title: "IDENTITÉ & ENTREPRISE (MODULE ASSURANCE)",
    profile_fullname: "Nom Prénom / Responsable",
    profile_company: "Nom de l'entreprise (Optionnel)",
    profile_address: "Adresse complète",
  },
  UK: {
    settings_title: "Settings",
    settings_subtitle: "Locate Home System Configuration",
    intl_title: "INTERNATIONALIZATION",
    intl_lang: "LANGUAGE & UNITS",
    intl_lang_desc: "Combined action: Language + Measurement system",
    tier_title: "OFFERS & SUBSCRIPTION",
    tier_desc: "Dev Access / Tier Selection",
    sec_title: "SECURITY & DATA",
    sec_zero: "ZERO-SERVER ARCHITECTURE",
    sec_desc_1: "Your data is stored ",
    sec_desc_2: "exclusively and locally",
    sec_desc_3: " on this device.",
    sec_vol: "USED STORAGE : ",
    legal_agree: "I accept the ",
    legal_link: "Terms of Service (TOS) and Privacy Policy",
    // NOUVEAU : Textes du profil Assurance
    profile_title: "IDENTITY & COMPANY (INSURANCE MODULE)",
    profile_fullname: "Full Name / Manager",
    profile_company: "Company Name (Optional)",
    profile_address: "Full Address",
  }
};

export const useTranslation = () => {
  const { settings } = useAppSettings();
  const lang = settings.language || 'FR';
  
  const t = (key: keyof typeof dictionary['FR']) => {
    return dictionary[lang][key] || key;
  };

  return { t, lang };
};
```

// ==========================================
// 📂 FICHIER : \src\core\index.ts
// ==========================================

```tsx
// Définition de la structure
export interface Category {
  id: string;
  label: string;
  iconName: string;
  description: string;
}

```

// ==========================================
// 📂 FICHIER : \src\core\security\safetyService.ts
// ==========================================

```tsx
/**
 * LOCATE SAFETY - Module de Sécurité Industrielle
 * Rôle : Détection des défauts de gainage et conformité VAT
 */

export interface ToolSafetyStatus {
  isConform: boolean;
  alertMessage: string | null;
  status: 'DISPONIBLE' | 'HORS SERVICE' | 'MAINTENANCE';
}

export const checkToolSafety = (toolName: string, analysisData: { hasGripDamage: boolean }): ToolSafetyStatus => {
  // Les outils critiques qui activent le verrou de sécurité
  const criticalTools = ['VAT', '1000V', 'Multimètre'];
  const isCritical = criticalTools.some(keyword => toolName.includes(keyword));

  // Si l'outil est critique et qu'un défaut de gainage est détecté
  if (isCritical && analysisData.hasGripDamage) {
    return {
      isConform: false,
      alertMessage: `🛑 DANGER : Défaut d'isolement détecté sur ${toolName}. Utilisation interdite.`,
      status: 'HORS SERVICE'
    };
  }

  return {
    isConform: true,
    alertMessage: null,
    status: 'DISPONIBLE'
  };
};
```

// ==========================================
// 📂 FICHIER : \src\core\security\tiers.ts
// ==========================================

```tsx
export type UserTier = 'FREE' | 'PREMIUM' | 'PRO';

// On crée un "moule" strict pour éviter les erreurs de frappe dans VSCode
export interface TierConfig {
  label: string;
  itemLimit: number;
  safetyAudit: boolean;
  canExportPdf: boolean; // Autorisation pour le Module Assurance
  canUseRanger: boolean; // Autorisation pour le Module Rangement
}

// On applique le moule à notre configuration
export const TIERS_CONFIG: Record<UserTier, TierConfig> = {
  FREE: { 
    label: "LOCATE HOME Basic", 
    itemLimit: 15, // Aligné sur la V1.4 - Limite stricte
    safetyAudit: false,
    canExportPdf: false, // Bloqué en version gratuite
    canUseRanger: true   // On laisse l'accès basique au rangement
  },
  PREMIUM: { 
    label: "LOCATE HOME Premium", 
    itemLimit: 1000, 
    safetyAudit: false,
    canExportPdf: true,  // Débloqué
    canUseRanger: true
  },
  PRO: { 
    label: "LOCATE SYSTEMS Expert", 
    itemLimit: 9999, 
    safetyAudit: true,
    canExportPdf: true,  // Débloqué
    canUseRanger: true
  }
};
```

// ==========================================
// 📂 FICHIER : \src\core\security\useUserTier.ts
// ==========================================

```tsx
import { useState, useEffect } from 'react';
import { type UserTier, TIERS_CONFIG, type TierConfig } from './tiers';

const TIER_STORAGE_KEY = 'locate_user_tier';

// Par défaut, on démarre en PRO pour honorer la promesse Beta
const DEFAULT_TIER: UserTier = 'PRO';

export const useUserTier = () => {
  const [currentTier, setCurrentTier] = useState<UserTier>(DEFAULT_TIER);
  // On stocke aussi la configuration complète associée au statut
  const [tierConfig, setTierConfig] = useState<TierConfig>(TIERS_CONFIG[DEFAULT_TIER]);

  useEffect(() => {
    // Chargement initial
    const savedTier = localStorage.getItem(TIER_STORAGE_KEY) as UserTier;
    if (savedTier && ['FREE', 'PREMIUM', 'PRO'].includes(savedTier)) {
      setCurrentTier(savedTier);
      setTierConfig(TIERS_CONFIG[savedTier]);
    }
  }, []);

  const setTier = (tier: UserTier) => {
    localStorage.setItem(TIER_STORAGE_KEY, tier);
    setCurrentTier(tier);
    setTierConfig(TIERS_CONFIG[tier]);
    // Force un reload pour que toute l'app prenne en compte le changement (utile pour le dev)
    window.location.reload();
  };

  return { 
    currentTier, 
    tierConfig, // L'interface HUD pourra lire tierConfig.canExportPdf directement
    setTier 
  };
};
```

// ==========================================
// 📂 FICHIER : \src\core\storage\imageService.ts
// ==========================================

```tsx
export const applyIndustrialHDR = async (base64Str: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(base64Str);
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctx.filter = 'contrast(1.2) brightness(1.1) saturate(1.1)';
      ctx.drawImage(canvas, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
  });
};
```

// ==========================================
// 📂 FICHIER : \src\core\storage\memoryService.ts
// ==========================================

```tsx
import type { InventoryItem } from '../../types';

const STORAGE_KEY = 'locatehome_inventory';

/**
 * Récupère la liste complète des outils de l'inventaire
 */
export const getInventory = (): InventoryItem[] => {
  if (typeof window === 'undefined') return []; // Sécurité pour le rendu côté serveur (SSR)
  
  const saved = localStorage.getItem(STORAGE_KEY);
  try {
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Erreur de lecture du stockage :", error);
    return [];
  }
};

/**
 * Ajoute un nouvel outil en haut de la liste
 */
export const addTool = (tool: InventoryItem) => {
  const tools = getInventory();
  const updated = [tool, ...tools];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

/**
 * Optionnel : Alias pour ToolMemory si nécessaire dans ton projet
 */
export type ToolMemory = InventoryItem;

// --- AJOUTER À LA FIN DU FICHIER ---
import type { Location } from '../../types'; // Assurez-vous que l'import est présent en haut du fichier

const LOCATIONS_KEY = 'locatehome_custom_locations';

// Zones par défaut au premier lancement de l'application
const DEFAULT_LOCATIONS: Location[] = [
  { id: 'fourgon', label: 'Fourgon', iconName: 'Truck', description: 'Véhicule d\'intervention' },
  { id: 'atelier', label: 'Atelier', iconName: 'Wrench', description: 'Zone principale' }
];

export const getCustomLocations = (): Location[] => {
  if (typeof window === 'undefined') return DEFAULT_LOCATIONS;
  const saved = localStorage.getItem(LOCATIONS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error("Erreur de lecture des lieux personnalisés :", error);
    }
  }
  // Initialisation si la mémoire est vierge
  localStorage.setItem(LOCATIONS_KEY, JSON.stringify(DEFAULT_LOCATIONS));
  return DEFAULT_LOCATIONS;
};

export const addCustomLocation = (label: string): boolean => {
  const current = getCustomLocations();
  if (current.length >= 4) return false; // Bloque strictement à 4 zones

  const newLocation: Location = {
    id: label.toLowerCase().replace(/\s+/g, '-'),
    label: label.trim(),
    iconName: 'MapPin' // Icône générique pour les zones créées
  };

  const updated = [...current, newLocation];
  localStorage.setItem(LOCATIONS_KEY, JSON.stringify(updated));
  return true;
};

// Fonction utilitaire pour une future vue "Paramètres des zones"
export const deleteCustomLocation = (id: string): void => {
  const current = getCustomLocations();
  if (current.length <= 1) return; // Sécurité : impossible de supprimer la toute dernière zone
  const updated = current.filter(loc => loc.id !== id);
  localStorage.setItem(LOCATIONS_KEY, JSON.stringify(updated));
};
```

// ==========================================
// 📂 FICHIER : \src\core\storage\useAppSettings.ts
// ==========================================

```tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Language = 'FR' | 'UK';
export type UnitSystem = 'METRIC' | 'IMPERIAL';

const SETTINGS_KEY = 'locate_app_settings';

// NOUVEAU : On définit la structure de l'identité pour le PDF
export interface UserProfile {
  fullName: string;
  company: string;
  address: string;
}

export interface AppSettings {
  language: Language;
  unitSystem: UnitSystem;
  acceptedTerms?: boolean;
  userProfile?: UserProfile; // NOUVEAU : Intégration au cerveau
}

const defaultSettings: AppSettings = {
  language: 'FR',
  unitSystem: 'METRIC',
  acceptedTerms: false,
  userProfile: { fullName: '', company: '', address: '' }
};

interface AppSettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Erreur de lecture des paramètres locaux", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  };

  if (!isLoaded) return null; 

  return React.createElement(
    AppSettingsContext.Provider,
    { value: { settings, updateSettings } },
    children
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings doit être utilisé à l\'intérieur de AppSettingsProvider');
  }
  return context;
};
```

// ==========================================
// 📂 FICHIER : \src\core\ui\Hub.tsx
// ==========================================

```tsx
import { useState } from 'react';

interface HubProps {
  onSelectModule: (module: 'home' | 'asset' | 'kitchen' | 'garage' | 'care') => void;
}

export default function Hub({ onSelectModule }: HubProps) {
  // État pour suivre le module survolé/actif (Gère la couleur du noyau et des flux)
  const [hoveredModule, setHoveredModule] = useState<string>('home');

  const modules = [
    { id: 'home', name: 'HOME', color: '#FF6600', iconName: 'home', active: true },
    { id: 'asset', name: 'ASSET', color: '#007BFF', iconName: 'asset', active: false },
    { id: 'garage', name: 'GARAGE', color: '#DC3545', iconName: 'garage', active: true },
    { id: 'kitchen', name: 'KITCHEN', color: '#28A745', iconName: 'kitchen', active: false },
    { id: 'care', name: 'CARE', color: '#E0E0E0', iconName: 'care', active: false }
  ];

  // Couleur dynamique du noyau central selon le module survolé
  const activeColor = modules.find(m => m.id === hoveredModule)?.color || '#FF6600';

  return (
<div className="relative h-[100dvh] bg-[#050505] flex flex-col items-center justify-between py-[3vh] px-[2vw] font-sans overflow-hidden">      
      {/* INJECTION CSS : Animation du flux d'énergie liquide (remontant) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dashFlow {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
        .animate-dash {
          animation: dashFlow 2s linear infinite;
        }
      `}} />

      {/* FOND GRILLE : Circuit imprimé */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>

      {/* SVG : LES FLUX D'ÉNERGIE (Inversés : du bas vers le centre) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
        {modules.map((mod, index) => {
          // Nouveau calcul des positions : départ en bas, arrivée au centre
          const startX = 10 + (index * 20); // Départs : 10%, 30%, 50%, 70%, 90%
          const startY = 82; // Hauteur de départ au-dessus des boutons en bas
          const endX = 50;   // Centre absolu
          const endY = 50;   // Cible du noyau central
          
          const isHovered = mod.id === hoveredModule;

          return (
            <path
              key={`path-${mod.id}`}
              // Courbe de Bézier inversée (C startX startY-15, endX endY+15)
              d={`M ${startX} ${startY} C ${startX} ${startY - 15}, ${endX} ${endY + 15}, ${endX} ${endY}`}
              stroke={mod.color}
              strokeWidth={isHovered ? "0.4" : "0.1"}
              fill="none"
              strokeDasharray="2 2"
              className={isHovered ? "animate-dash" : ""}
              style={{ opacity: isHovered ? 1 : 0.2, transition: 'all 0.4s ease' }}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {/* 1/3 HAUT : LA CITATION (Augmentée de +10%) */}
      <div className="z-10 text-center mt-[4vh] px-[4vw] max-w-[90%]">
        <p className="text-[#B0BEC5] text-[0.7rem] sm:text-[0.9rem] font-medium italic leading-loose tracking-wide">
          "L'homme ne parle pas à l'IA pour l'écouter, <br className="hidden sm:block"/>
          mais pour qu'elle devienne le prolongement de son expertise terrain."
        </p>
      </div>

      {/* 1/3 CENTRAL : NOYAU LOCATE SYSTEMS (Scaling augmenté) */}
      <div className="relative z-10 flex flex-col items-center flex-1 justify-center mt-[2vh]">
        
        {/* Halo Pulsant (Couleur dynamique) adapté au nouveau gabarit */}
        <div
          className="absolute inset-0 blur-[60px] rounded-full w-[45vw] h-[45vw] max-w-[16rem] max-h-[16rem] -z-10 animate-pulse transition-colors duration-500 m-auto"
          style={{ backgroundColor: activeColor, opacity: 0.25 }}
        ></div>

        {/* Texte SYSTEMS sorti du conteneur et placé au-dessus */}
        <span className="text-white font-black tracking-[0.2em] text-[0.8rem] sm:text-[1rem] relative z-10 drop-shadow-md mb-[2vh]">
          SYSTEMS
        </span>

        {/* Le Processeur (Gabarit augmenté : w-32vw / max-12rem) */}
        <div
          className="w-[32vw] h-[32vw] max-w-[12rem] max-h-[12rem] bg-[#121212] border-t-[0.15rem] border-b-[0.35rem] rounded-[2.5rem] flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group transition-colors duration-500"
          style={{ borderColor: activeColor }}
        >
            {/* Reflet de vitre 3D */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            
            {/* Cœur 3D (core.png) poussé à 80% du conteneur */}
            <div className="relative w-[90%] h-[90%] flex items-center justify-center filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              <img src="/core.png" alt="Core Scanner" className="w-full h-full object-contain" />
            </div>
        </div>
      </div>

      {/* 1/3 BAS : LES 5 MODULES (Thumb Zone, gabarits augmentés, icônes à 95%) */}
      <div className="flex justify-between items-end w-full max-w-[95%] z-10 mb-[2vh] px-[2vw]">
        {modules.map((mod) => {
          const isHovered = mod.id === hoveredModule;
          return (
            <div
              key={mod.id}
              className="flex flex-col items-center group w-[18%]"
              onMouseEnter={() => setHoveredModule(mod.id)}
              onClick={() => {
                setHoveredModule(mod.id);
                if (mod.active) onSelectModule(mod.id as any);
              }}
            >
              {/* Bouton du module (Gabarit augmenté : w-16vw / max-6rem) */}
              <button
                className={`relative w-[16vw] h-[16vw] max-w-[6rem] max-h-[6rem] rounded-2xl border-b-[0.25rem] flex items-center justify-center transition-all duration-300
                  ${mod.active ? 'cursor-pointer' : 'cursor-not-allowed opacity-40 grayscale'}
                  ${isHovered && mod.active ? 'translate-y-[-0.5vh]' : ''}
                `}
                style={{
                  backgroundColor: '#1A1A1A',
                  borderColor: mod.color,
                  boxShadow: isHovered ? `0 0 20px ${mod.color}80, inset 0 2px 10px rgba(255,255,255,0.1)` : '0 4px 6px rgba(0,0,0,0.3)'
                }}
              >
                {/* Icône étendue à 95% de la base */}
                <img
                  src={`/${mod.iconName}.png`}
                  alt={mod.name}
                  className="w-[95%] h-[95%] object-contain drop-shadow-md"
                />
              </button>

              {/* Titre du module ajusté en dessous */}
              <h3 className={`text-[0.6rem] sm:text-[0.8rem] font-black uppercase tracking-widest mt-[1.5vh] text-center h-[2vh] transition-colors duration-300 ${isHovered ? 'text-white' : 'text-[#B0BEC5]'}`}>
                {mod.name}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

// ==========================================
// 📂 FICHIER : \src\core\ui\LocationBar.tsx
// ==========================================

```tsx
import React, { useState, useEffect } from 'react';
import { getCustomLocations, addCustomLocation } from '../storage/memoryService';
import type { Location } from '../../types';

interface LocationBarProps {
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
}

export const LocationBar: React.FC<LocationBarProps> = ({ selectedLocation, setSelectedLocation }) => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    // Charge les lieux depuis le Zéro-Serveur (IndexedDB/LocalStorage) au montage
    setLocations(getCustomLocations());
  }, []);

  const handleAddLocation = () => {
    if (locations.length >= 4) {
      alert("Limite système : 4 zones maximum. Pour le détail (bacs/boîtes), utilisez notre système d'étiquettes QR.");
      return;
    }
    
    // UI native simple pour ne pas alourdir l'application
    const newLabel = window.prompt("Nom de la nouvelle zone d'intervention (ex: Chantier B) :");
    
    if (newLabel && newLabel.trim() !== '') {
      const success = addCustomLocation(newLabel);
      if (success) {
        setLocations(getCustomLocations()); // Rafraîchit l'affichage HUD
        setSelectedLocation(newLabel.trim()); // Auto-focus sur la nouvelle zone
      }
    }
  };

  return (
    <div className="flex overflow-x-auto gap-[0.8rem] mb-[3vh] no-scrollbar px-[4vw]">
      {locations.map((loc) => (
        <button
          key={loc.id}
          onClick={() => setSelectedLocation(loc.label)}
          className={`px-[1.2rem] py-[0.5rem] rounded-full border text-[0.8rem] whitespace-nowrap transition-all duration-300 ${
            selectedLocation === loc.label
              ? "bg-[#FF6600] border-[#FF6600] text-white shadow-[0_0_15px_rgba(255,102,0,0.3)]"
              : "bg-transparent border-gray-700 text-gray-400"
          }`}
        >
          {loc.label.toUpperCase()}
        </button>
      ))}
      
      {/* Rendu conditionnel du bouton d'ajout si limite non atteinte */}
      {locations.length < 4 && (
        <button
          onClick={handleAddLocation}
          className="w-8 h-8 rounded-full border border-dashed border-gray-500 flex items-center justify-center text-gray-400 hover:text-[#FF6600] hover:border-[#FF6600] transition-colors shrink-0"
          title="Ajouter une nouvelle zone"
        >
          +
        </button>
      )}
    </div>
  );
};
```

// ==========================================
// 📂 FICHIER : \src\core\ui\Logo.tsx
// ==========================================

```tsx
import React from 'react';

// Référérentiel strict des couleurs par module
export type AppModule = 'HOME' | 'ASSET' | 'KITCHEN' | 'GARAGE' | 'CARE';

const MODULE_CONFIG: Record<AppModule, { color: string; label: string }> = {
  HOME: { color: '#FF6600', label: 'HOME' },
  ASSET: { color: '#007BFF', label: 'ASSET' },
  KITCHEN: { color: '#28A745', label: 'KITCHEN' },
  GARAGE: { color: '#DC3545', label: 'GARAGE' },
  CARE: { color: '#E0E0E0', label: 'CARE' }
};

interface LogoProps {
  activeModule?: AppModule;
}

const Logo: React.FC<LogoProps> = ({ activeModule = 'HOME' }) => {
  const config = MODULE_CONFIG[activeModule];

  return (
    // Conteneur s'adaptant parfaitement au 12.5vh du header, avec marges de sécurité bord d'écran (px-[5vw])
    <div className="w-full h-full flex justify-between items-center px-[5vw] select-none">
      
      {/* BLOC GAUCHE : LOCATE + NOM DU MODULE */}
      <div 
        className="flex items-center gap-[2vw]"
        style={{ fontFamily: "'Intro Rust', sans-serif" }} // Appel de ta police Canva
      >
        <span 
          className="font-black text-white uppercase tracking-widest text-[clamp(1.2rem,6vw,2.2rem)] leading-none"
          style={{ WebkitTextStroke: '1px #000000' }} // Effet bordure 50 de Canva
        >
          LOCATE
        </span>
        <span 
          className="font-black uppercase tracking-widest text-[clamp(1.2rem,6vw,2.2rem)] leading-none transition-colors duration-500"
          style={{ 
            color: config.color,
            WebkitTextStroke: '1px #000000' // Effet bordure 50 de Canva
          }}
        >
          {config.label}
        </span>
      </div>

      {/* BLOC DROITE : By Systems */}
      <div 
        className="self-end mb-[2.5vh] flex flex-col items-end" // Alignement au 1/3 bas
        style={{ fontFamily: "'Rebel', cursive, sans-serif" }} // Appel de ta police Canva
      >
        <span className="text-[#a6a6a6] text-[clamp(0.8rem,4vw,1.4rem)] leading-none drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]">
          By Systems
        </span>
      </div>
    </div>
  );
};

export default Logo;
```

// ==========================================
// 📂 FICHIER : \src\core\ui\ResultModal.tsx
// ==========================================

```tsx
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
```

// ==========================================
// 📂 FICHIER : \src\core\ui\SafetyBadge.tsx
// ==========================================

```tsx

import { AlertTriangle, ShieldCheck, Lock } from 'lucide-react'; // Icônes temporaires Lucide
import type { UserTier } from '../security/tiers';
interface SafetyBadgeProps {
  hasDanger: boolean;
  details: string;
  level?: 'LOW' | 'MEDIUM' | 'HIGH';
  userTier: UserTier;
}

export const SafetyBadge: React.FC<SafetyBadgeProps> = ({ hasDanger, details, level, userTier }) => {
  
  if (!hasDanger) {
    return (
      <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-800 rounded-lg text-green-500">
        <ShieldCheck size={20} />
        <span className="text-sm font-medium">Sécurité : Conforme (Visuel)</span>
      </div>
    );
  }

  // Logique d'affichage selon le Tier
  const isFree = userTier === 'FREE';
  const isPremium = userTier === 'PREMIUM';
  const isPro = userTier === 'PRO';

  return (
    <div className={`flex flex-col gap-2 p-3 rounded-lg border ${
      isFree ? 'bg-yellow-900/20 border-yellow-800' : 'bg-red-900/20 border-red-800'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} className={isFree ? "text-yellow-500" : "text-red-500"} />
          <span className={`font-bold ${isFree ? "text-yellow-500" : "text-red-500"}`}>
            {isFree ? "Vigilance Requise" : "DANGER DÉTECTÉ"}
          </span>
        </div>
        {isFree && <Lock size={16} className="text-gray-500" />}
      </div>

      {/* Contenu filtré */}
      <div className="text-sm text-gray-300">
        {isFree && (
          <p className="italic opacity-60">
            Une anomalie potentielle a été détectée sur cet outil. 
            <br/><span className="text-orange-500 font-bold">Disponible en version PREMIUM.</span>
          </p>
        )}

        {isPremium && (
          <div>
            <p className="font-semibold text-red-400">Anomalie critique identifiée.</p>
            <p className="blur-[3px] select-none mt-1 opacity-50">
              Câble d'alimentation sectionné au niveau de la gaine principale. Risque d'électrisation.
            </p>
            <span className="text-xs text-orange-500 mt-2 block">Détail complet en version PRO</span>
          </div>
        )}

        {isPro && (
          <div className="animate-pulse-slow">
            <p className="font-mono text-red-300">
              <span className="font-black text-red-500">[{level || 'SCAN'}]</span> {">"} {details}
            </p>
            <div className="mt-2 pt-2 border-t border-red-900/50 text-xs text-red-400">
              ACTION : Mise en quarantaine recommandée immédiate.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

// ==========================================
// 📂 FICHIER : \src\data\catalog.ts
// ==========================================

```tsx
/**
 * LOCATEHOME - CATALOGUE PRODUITS (V1.0)
 * Référentiel Zéro-Serveur pour le dropshipping (Marque Blanche)
 * Les dimensions sont utilisées par l'IA pour le calcul absolu des volumes.
 */

export interface ProductDimensions {
  length: number; // en mm
  width: number;  // en mm
  height: number; // en mm
  volumeCapacity?: number; // en Litres
}

export interface CatalogItem {
  id: string;
  name: string;
  price: number; // Prix en Euros (€) pour Revolut
  description: string;
  imageUrl: string;
  isContainer: boolean;
  dimensions?: ProductDimensions;
}

export const LOCATE_CATALOG: CatalogItem[] = [
  {
    id: 'loc-qr-pack',
    name: 'Pack Découverte QR Codes',
    price: 14.90,
    description: 'Lot de 50 étiquettes industrielles ultra-résistantes (hydrocarbures, UV). Parfait pour identifier vos outils existants.',
    imageUrl: '/catalog/qr-pack.png',
    isContainer: false,
  },
  {
    id: 'loc-bac-5l',
    name: 'Bac LOCATE Hype 5L',
    price: 12.50,
    description: "Bac de rangement normé. L'IA reconnaît ce format instantanément pour calculer vos consommables au gramme près.",
    imageUrl: '/catalog/bac-5l.png',
    isContainer: true,
    dimensions: {
      length: 300,
      width: 200,
      height: 114,
      volumeCapacity: 5
    }
  },
  {
    id: 'loc-bac-10l',
    name: 'Bac LOCATE Industriel 10L',
    price: 18.90,
    description: 'Conçu pour les chantiers et la maintenance. Ultra-robuste, empilable et pré-calibré pour la vision artificielle LOCATE.',
    imageUrl: '/catalog/bac-10l.png',
    isContainer: true,
    dimensions: {
      length: 400,
      width: 300,
      height: 114,
      volumeCapacity: 10
    }
  }
];

// Fonction utilitaire pour récupérer un produit au moment du paiement
export const getProductById = (id: string): CatalogItem | undefined => {
  return LOCATE_CATALOG.find(product => product.id === id);
};
```

// ==========================================
// 📂 FICHIER : \src\main.tsx
// ==========================================

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { AppSettingsProvider } from './core/storage/useAppSettings';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppSettingsProvider>
      <App />
    </AppSettingsProvider>
  </React.StrictMode>,
);
```

// ==========================================
// 📂 FICHIER : \src\modules\garage\components\GaragePdfButton.tsx
// ==========================================

```tsx
import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { GarageReport } from './GarageReport';
import { FileDown } from 'lucide-react';

interface GaragePdfButtonProps {
  reportData: any;
}

// Composant isolé pour éviter de faire crasher le LiveAssistant
const GaragePdfButton: React.FC<GaragePdfButtonProps> = ({ reportData }) => {
  return (
    <PDFDownloadLink
      document={<GarageReport reportData={reportData} />}
      fileName={`${reportData.metadata.reportId}.pdf`}
      className="flex-1 bg-[#DC2626] hover:bg-red-700 text-white py-4 px-6 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)] active:scale-95"
    >
      {({ loading }) => (
        <>
          <FileDown size={18} />
          {loading ? "Génération PDF en cours..." : "Télécharger Rapport PDF"}
        </>
      )}
    </PDFDownloadLink>
  );
};

export default GaragePdfButton;
```

// ==========================================
// 📂 FICHIER : \src\modules\garage\components\GarageReport.tsx
// ==========================================

```tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#DC2626', paddingBottom: 10 },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#DC2626' },
  logoSub: { fontSize: 12, color: '#333333', marginTop: 4 },
  reportInfo: { fontSize: 10, textAlign: 'right', color: '#666666' },
  
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#DC2626', marginTop: 15, marginBottom: 8, textTransform: 'uppercase' },
  
  summaryBox: { backgroundColor: '#FFF5F5', padding: 15, borderRadius: 5, marginBottom: 15, borderWidth: 1, borderColor: '#DC2626' },
  row: { flexDirection: 'row', marginBottom: 6 },
  label: { width: '40%', fontSize: 10, fontWeight: 'bold', color: '#333333' },
  value: { width: '60%', fontSize: 10, color: '#555555' },

  table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#E5E7EB', borderRightWidth: 0, borderBottomWidth: 0, marginTop: 5 },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableColHeader: { width: '70%', borderStyle: 'solid', borderWidth: 1, borderColor: '#E5E7EB', borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#FFF5F5', padding: 5 },
  tableColHeaderStatus: { width: '30%', borderStyle: 'solid', borderWidth: 1, borderColor: '#E5E7EB', borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#FFF5F5', padding: 5 },
  tableCol: { width: '70%', borderStyle: 'solid', borderWidth: 1, borderColor: '#E5E7EB', borderLeftWidth: 0, borderTopWidth: 0, padding: 5 },
  tableColStatus: { width: '30%', borderStyle: 'solid', borderWidth: 1, borderColor: '#E5E7EB', borderLeftWidth: 0, borderTopWidth: 0, padding: 5 },
  tableCellHeader: { margin: 2, fontSize: 10, fontWeight: 'bold', color: '#DC2626' },
  tableCell: { margin: 2, fontSize: 10, color: '#4B5563' },
  tableCellStatus: { margin: 2, fontSize: 10, fontWeight: 'bold', color: '#059669' },

  diagnosticBox: { padding: 15, borderLeftWidth: 4, borderLeftColor: '#DC2626', backgroundColor: '#F9FAFB', marginTop: 5 },
  diagnosticText: { fontSize: 11, fontStyle: 'italic', color: '#333333', lineHeight: 1.5 },
  
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', fontSize: 8, color: '#9CA3AF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 10 },
});

interface GarageReportProps {
  reportData: any;
}

export const GarageReport: React.FC<GarageReportProps> = ({ reportData }) => {
  const isMeca = reportData.metadata.mode === 'mecanique';
  
  // Textes dynamiques selon le métier
  const docTitle = isMeca ? "Ordre de Réparation Mécanique" : "Rapport d'Intervention GMAO";
  const durationLabel = isMeca ? "Temps d'intervention :" : "MTTR (Temps de réparation) :";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* EN-TÊTE DYNAMIQUE */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logoText}>LOCATE GARAGE</Text>
            <Text style={styles.logoSub}>Système Expert M5</Text>
          </View>
          <View style={styles.reportInfo}>
            <Text style={{ fontWeight: 'bold', color: '#DC2626' }}>{docTitle}</Text>
            <Text>ID : {reportData.metadata.reportId}</Text>
            <Text>Date : {new Date(reportData.metadata.timestamp).toLocaleString('fr-FR')}</Text>
          </View>
        </View>

        {/* CONTEXTE D'INTERVENTION */}
        <View style={styles.summaryBox}>
          <View style={styles.row}>
            <Text style={styles.label}>Opérateur / Technicien :</Text>
            <Text style={styles.value}>{reportData.metadata.technician}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{reportData.context.equipmentLabel} :</Text>
            <Text style={styles.value}>{reportData.context.equipmentId} (Zone: {reportData.context.location})</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{durationLabel}</Text>
            <Text style={styles.value}>{reportData.metadata.duration}</Text>
          </View>
          <View style={{ ...styles.row, marginBottom: 0 }}>
            <Text style={styles.label}>{reportData.context.classificationLabel} :</Text>
            <Text style={styles.value}>{reportData.context.classificationValue}</Text>
          </View>
        </View>

        {/* SAFETY GATES */}
        <Text style={styles.sectionTitle}>1. Contrôles & Sécurité Avant Intervention</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Procédure validée</Text></View>
            <View style={styles.tableColHeaderStatus}><Text style={styles.tableCellHeader}>Statut</Text></View>
          </View>
          {reportData.safetyGates.map((gate: any, idx: number) => (
            <View style={styles.tableRow} key={idx}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{gate.step}</Text></View>
              <View style={styles.tableColStatus}><Text style={styles.tableCellStatus}>{gate.status}</Text></View>
            </View>
          ))}
        </View>

        {/* DIAGNOSTIC IA */}
        <Text style={styles.sectionTitle}>2. Synthèse du Diagnostic (Assisté par IA)</Text>
        <View style={styles.diagnosticBox}>
          <Text style={styles.diagnosticText}>"{reportData.diagnostic.hypothesis}"</Text>
          <Text style={{ fontSize: 10, color: '#666', marginTop: 10 }}>
            Niveau de certitude du modèle : {reportData.diagnostic.aiConfidence}
          </Text>
          <Text style={{ fontSize: 10, color: '#666', marginTop: 4 }}>
            Action recommandée : {reportData.diagnostic.actionPlan}
          </Text>
        </View>

        {/* PIED DE PAGE LÉGAL */}
        <Text style={styles.footer} fixed>
          Ce document est édité localement via l'application LOCATE GARAGE. L'analyse algorithmique est fournie à titre indicatif. Le professionnel intervenant sur site demeure le seul décisionnaire et responsable de l'intervention.
        </Text>

      </Page>
    </Document>
  );
};
```

// ==========================================
// 📂 FICHIER : \src\modules\garage\components\LiveAssistant.tsx
// ==========================================

```tsx
import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { Shield, Zap, Wind, Mic, Power, X, CheckCircle2, AlertTriangle, Camera, CheckSquare, LogOut } from 'lucide-react';
import { liveService, type LiveDiagnostic } from '../../../core/ai/liveService';
import { reportService } from '../services/reportService';

// IMPORT DIFFÉRÉ DU BOUTON PDF (LAZY LOADING)
const GaragePdfButton = lazy(() => import('./GaragePdfButton'));

interface LiveAssistantProps {
  mode: 'maintenance' | 'mecanique';
  onExit: () => void;
}

const LiveAssistant: React.FC<LiveAssistantProps> = ({ mode, onExit }) => {
  const [isLive, setIsLive] = useState(false);
  const [showSafety, setShowSafety] = useState(true);
  const [sessionClosed, setSessionClosed] = useState(false);
  const [finalReport, setFinalReport] = useState<any>(null);
  
  const [diagnosticText, setDiagnosticText] = useState(`Système ${mode.toUpperCase()} en attente. Sécurisez la zone.`);
  const [currentDiagnostic, setCurrentDiagnostic] = useState<LiveDiagnostic>({
    hypothesis: "En attente de flux...",
    confidence: 0,
    nextStep: "-"
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  const [checks, setChecks] = useState([
    { id: 'loto', label: 'Consignation LOTO effectuée', icon: <Power size={18} />, validated: false },
    { id: 'vat', label: 'VAT (Absence Tension)', icon: <Zap size={18} />, validated: false },
    { id: 'h2s', label: 'Détecteur H2S & Gaz actif', icon: <Wind size={18} />, validated: false },
    { id: 'epi', label: 'EPI adéquats portés', icon: <Shield size={18} />, validated: false },
  ]);

  const allValidated = checks.every(c => c.validated);

  useEffect(() => {
    return () => {
      if (isLive) forceTerminate();
    };
  }, [isLive]);

  const captureAndSendFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context && video.videoWidth > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        liveService.sendVideoFrame(canvas);
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      return true;
    } catch (err) {
      setDiagnosticText("Erreur Flux Vidéo : Vérifiez les permissions.");
      return false;
    }
  };

  const startLiveSession = async () => {
    if (allValidated) {
      setShowSafety(false);
      const cameraStarted = await startCamera();
      
      if (cameraStarted) {
        setIsLive(true);
        startTimeRef.current = new Date();
        setDiagnosticText("Initialisation du tunnel sécurisé...");

        try {
          await liveService.connect(mode, (data) => {
            setDiagnosticText(data.hypothesis);
            setCurrentDiagnostic(data);
          });

          frameIntervalRef.current = window.setInterval(() => {
            captureAndSendFrame();
          }, 1600);
        } catch (error) {
          setDiagnosticText("Échec réseau. Mode Edge asynchrone activé.");
        }
      }
    }
  };

  const forceTerminate = () => {
    if (frameIntervalRef.current) {
      window.clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    liveService.terminate();
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setIsLive(false);
  };

  const closeAndGenerateReport = async () => {
    forceTerminate();
    
    const endTime = new Date();
    const reportData = {
      mode: mode,
      technicianId: "TECH-M5-001",
      location: "Zone d'Intervention",
      equipmentId: "EQ-INCONNU",
      safetyChecks: checks,
      diagnostic: currentDiagnostic,
      startTime: startTimeRef.current || endTime,
      endTime: endTime
    };

    const generatedReport = await reportService.generateMaintenanceReport(reportData);
    setFinalReport(generatedReport);
    setSessionClosed(true);
  };

  // ==========================================
  // ÉCRAN DE CLÔTURE (GMAO & PDF)
  // ==========================================
  if (sessionClosed && finalReport) {
    return (
      <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col p-6 overflow-y-auto font-sans">
        <div className="max-w-2xl mx-auto w-full mt-8">
          <div className="flex items-center gap-4 mb-8 border-b border-[#DC2626]/30 pb-4">
            <CheckSquare className="text-[#DC2626] w-10 h-10" />
            <div>
              <h1 className="text-white font-black text-2xl uppercase tracking-widest">Intervention Clôturée</h1>
              <p className="text-gray-400 text-xs font-mono mt-1">ID: {finalReport.metadata.reportId}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-black border border-white/10 rounded-xl p-5 shadow-[0_0_15px_rgba(220,38,38,0.1)]">
              <h3 className="text-[#DC2626] font-bold text-xs uppercase tracking-widest mb-4">Indicateurs de Performance (KPI)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#121212] p-4 rounded-lg border border-white/5">
                  <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider block mb-1">MTTR (Temps de réparation)</span>
                  <span className="text-white font-mono text-lg">{finalReport.metadata.duration}</span>
                </div>
                <div className="bg-[#121212] p-4 rounded-lg border border-white/5">
                  <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider block mb-1">{finalReport.context.classificationLabel}</span>
                  <span className="text-white font-mono text-xs leading-tight block">{finalReport.context.classificationValue}</span>
                </div>
              </div>
            </div>

            <div className="bg-black border border-white/10 rounded-xl p-5">
              <h3 className="text-[#DC2626] font-bold text-xs uppercase tracking-widest mb-3">Synthèse Diag. IA</h3>
              <p className="text-gray-300 text-sm italic border-l-2 border-[#DC2626] pl-3">
                "{finalReport.diagnostic.hypothesis}"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              
              {/* INTÉGRATION DU BOUTON EN LAZY LOADING */}
              <Suspense fallback={
                <div className="flex-1 bg-[#DC2626]/50 text-white py-4 px-6 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 animate-pulse">
                  Chargement Moteur PDF...
                </div>
              }>
                <GaragePdfButton reportData={finalReport} />
              </Suspense>
              
              <button
                onClick={onExit}
                className="flex-1 bg-[#121212] border border-white/10 text-white py-4 px-6 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-colors hover:bg-[#1a1a1a] active:scale-95"
              >
                <LogOut size={18} /> Quitter le terminal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // COCKPIT IA (Caméra)
  // ==========================================
  return (
    <div className="fixed inset-0 bg-black flex flex-col font-sans overflow-hidden">
      <div className="relative flex-1 bg-[#0a0a0a] overflow-hidden">
        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute inset-0 border-[1px] border-white/5 pointer-events-none grid grid-cols-3 grid-rows-3" />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-[#DC2626]/20 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-[#DC2626] rounded-full shadow-[0_0_10px_#DC2626]" />
        </div>

        <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none z-10">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-xl">
            <h1 className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Locate Garage</h1>
            <p className="text-[9px] font-bold uppercase mt-1 italic text-[#DC2626]">M5 - Live {mode}</p>
          </div>
          {isLive && (
            <div className="bg-red-600/90 px-3 py-1 rounded-full animate-pulse border border-red-400">
              <span className="text-white font-black text-[10px] uppercase tracking-widest">Vision Live active</span>
            </div>
          )}
        </div>

        {showSafety && (
          <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl p-8 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full space-y-6">
              <div className="text-center">
                <AlertTriangle className="mx-auto mb-4 text-[#DC2626]" size={40} />
                <h2 className="text-white font-black text-lg uppercase tracking-tight italic">Validation des Risques</h2>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-2">
                  Check-list obligatoire ({mode === 'maintenance' ? 'AFNOR Niveau 2/3' : 'Atelier'})
                </p>
              </div>

              <div className="space-y-2">
                {checks.map(check => (
                  <button
                    key={check.id}
                    onClick={() => setChecks(prev => prev.map(c => c.id === check.id ? {...c, validated: !c.validated} : c))}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                      check.validated ? 'bg-[#DC2626]/10 border-[#DC2626] text-white' : 'bg-white/5 border-white/5 text-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {check.icon}
                      <span className="text-[10px] font-black uppercase tracking-widest">{check.label}</span>
                    </div>
                    {check.validated && <CheckCircle2 size={18} className="text-[#DC2626]" />}
                  </button>
                ))}
              </div>

              <button onClick={onExit} className="w-full py-3 mt-4 text-gray-500 text-xs uppercase font-bold tracking-widest underline decoration-gray-700 underline-offset-4 active:text-white">
                Retour à l'aiguillage
              </button>

              <button
                disabled={!allValidated}
                onClick={startLiveSession}
                className={`w-full py-5 rounded-2xl mt-2 font-black text-[10px] uppercase tracking-[0.3em] transition-all ${
                  allValidated ? 'bg-white text-black active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-gray-900 text-gray-700'
                }`}
              >
                Ouvrir Tunnel Expertise
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="h-[28vh] bg-[#050505] border-t border-white/5 p-6 flex flex-col gap-4 z-20">
        <div className="flex-1 bg-black rounded-lg border border-white/5 p-4 relative">
          <p className="text-[#DC2626] font-mono text-[9px] leading-relaxed uppercase tracking-widest">
            {diagnosticText}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button className="flex-1 bg-[#121212] py-4 rounded-xl flex flex-col items-center gap-1 border border-white/5 active:scale-95">
            <Camera size={18} className="text-white" />
            <span className="text-[8px] text-white font-black uppercase">Scan {mode === 'maintenance' ? 'Folio' : 'Pièce'}</span>
          </button>
          
          <button className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all ${
            isLive ? 'bg-[#DC2626] animate-pulse scale-110' : 'bg-gray-900'
          }`}>
            <Mic size={32} className="text-white" />
          </button>

          <button
            onClick={closeAndGenerateReport}
            className="flex-1 bg-[#121212] py-4 rounded-xl flex flex-col items-center gap-1 border border-white/5 active:scale-95"
          >
            <X size={18} className="text-red-500" />
            <span className="text-[8px] text-red-500 font-black uppercase">Clôture</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveAssistant;
```

// ==========================================
// 📂 FICHIER : \src\modules\garage\services\reportService.ts
// ==========================================

```tsx
/**
 * LOCATE GARAGE - REPORT SERVICE (V1.2 - Dualité Métier)
 * Génération de rapports : Maintenance Industrielle (AFNOR) & Mécanique (OBD2)
 */

import type { LiveDiagnostic } from '../../../core/ai/liveService';

export interface ReportData {
  mode: 'maintenance' | 'mecanique'; // <-- NOUVEAU : On exige le mode
  technicianId: string;
  location: string;
  equipmentId: string; // Sert aussi d'Immatriculation pour la mécanique
  safetyChecks: { id: string; label: string; validated: boolean }[];
  diagnostic: LiveDiagnostic;
  startTime: Date;
  endTime: Date;
}

class ReportService {
  private calculateDuration(start: Date, end: Date): string {
    const diffMs = Math.max(0, end.getTime() - start.getTime());
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins}m ${diffSecs}s`;
  }

  private estimateAfnorLevel(confidence: number): string {
    if (confidence >= 0.95) return "Niveau 2 (Dépannage par échange standard)";
    if (confidence >= 0.80) return "Niveau 3 (Identification d'origine de panne complexe)";
    return "Niveau 4/5 (Travaux importants / Atelier)";
  }

  async generateMaintenanceReport(data: ReportData) {
    const duration = this.calculateDuration(data.startTime, data.endTime);
    const isMeca = data.mode === 'mecanique';

    const reportContent = {
      metadata: {
        reportId: `M5-${isMeca ? 'MEC' : 'IND'}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        technician: data.technicianId,
        duration: duration,
        mode: data.mode, // On passe le mode au PDF
        standard: isMeca ? "Standard Garagiste" : "OSA/CBM"
      },
      context: {
        location: data.location,
        // Adaptation du vocabulaire selon le métier
        equipmentLabel: isMeca ? "Véhicule / Plaque" : "Équipement ID",
        equipmentId: data.equipmentId,
        classificationLabel: isMeca ? "Type d'intervention" : "Niveau AFNOR",
        classificationValue: isMeca ? "Diagnostic & Contrôle Visuel" : this.estimateAfnorLevel(data.diagnostic.confidence)
      },
      safetyGates: data.safetyChecks.map(check => ({
        step: check.label,
        status: check.validated ? "CONFORME" : "NON VALIDE"
      })),
      diagnostic: {
        hypothesis: data.diagnostic.hypothesis,
        actionPlan: data.diagnostic.nextStep,
        aiConfidence: `${(data.diagnostic.confidence * 100).toFixed(1)}%`
      }
    };

    // ... fin de la fonction generateMaintenanceReport ...
    console.log("📄 [GMAO] Rapport formaté :", reportContent);
    return reportContent;
  }
}

export const reportService = new ReportService();
```

// ==========================================
// 📂 FICHIER : \src\modules\garage\views\GarageDashboard.tsx
// ==========================================

```tsx
import React, { useState } from 'react';
import { Factory, Wrench, ChevronRight } from 'lucide-react';
import LiveAssistant from '../components/LiveAssistant';

const GarageDashboard: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'menu' | 'maintenance' | 'mecanique'>('menu');

  if (activeMode !== 'menu') {
    return <LiveAssistant mode={activeMode} onExit={() => setActiveMode('menu')} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* Header HUD */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h1 className="text-white font-black text-xl tracking-widest uppercase">Locate Garage</h1>
        <p className="text-red-600 text-[10px] font-bold uppercase tracking-widest mt-1">Terminal de Diagnostic IA</p>
      </div>

      {/* 🏭 BOUTON 1 : MAINTENANCE INDUSTRIELLE */}
      <button
        onClick={() => setActiveMode('maintenance')}
        className="flex-1 group relative overflow-hidden bg-[#0a0a0a] hover:bg-[#111] transition-all duration-500 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-center items-center p-8 active:scale-95"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <Factory size={72} className="text-white/60 mb-6 group-hover:text-red-500 group-hover:scale-110 transition-all duration-500" />
        <h2 className="text-white font-black text-3xl uppercase tracking-tighter mb-2 text-center">Maintenance<br/>Industrielle</h2>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest text-center mb-12">Usines • Stations d'épuration • Automatisme</p>

        <div className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase tracking-[0.2em] bg-red-950/30 px-6 py-3 rounded-full border border-red-500/20">
          Système OSA/CBM <ChevronRight size={14} />
        </div>
      </button>

      {/* 🚜 BOUTON 2 : MÉCANIQUE AUTO & PL */}
      <button
        onClick={() => setActiveMode('mecanique')}
        className="flex-1 group relative overflow-hidden bg-[#080808] hover:bg-[#111] transition-all duration-500 flex flex-col justify-center items-center p-8 active:scale-95"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <Wrench size={72} className="text-white/60 mb-6 group-hover:text-red-500 group-hover:scale-110 transition-all duration-500" />
        <h2 className="text-white font-black text-3xl uppercase tracking-tighter mb-2 text-center">Mécanique<br/>Auto & P.L.</h2>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest text-center mb-12">Véhicules Légers • Poids Lourds • Hydraulique</p>

        <div className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase tracking-[0.2em] bg-red-950/30 px-6 py-3 rounded-full border border-red-500/20">
          Diagnostic OBD2 <ChevronRight size={14} />
        </div>
      </button>

    </div>
  );
};

export default GarageDashboard;
```

// ==========================================
// 📂 FICHIER : \src\modules\home\components\HomeMenu.tsx
// ==========================================

```tsx
import React from 'react';

interface HomeMenuProps {
  onNavigate: (view: 'inventory' | 'scanner' | 'search' | 'settings' | any) => void;
  tier: string;
}

const HomeMenu: React.FC<HomeMenuProps> = ({ onNavigate, tier }) => {
  return (
    // NOUVEAU : Hauteur fluide et flexibilité interne pour bloquer tout scroll
    <div className="h-full w-full flex flex-col justify-between px-[5vw] pt-[1vh] pb-[3vh] overflow-hidden">
      
      {/* ========================================== */}
      {/* STRATE HAUTE (Contrôles du Module)         */}
      {/* ========================================== */}
      <div className="w-full flex justify-between items-center shrink-0">
        
        {/* NOUVEAU : Badge Néon Orange avec Texte Argent pour les Offres */}
        <div className="bg-[#121212] px-[4vw] sm:px-5 py-[0.8vh] rounded-full border border-[#FF6600]/50 shadow-[0_0_15px_rgba(255,102,0,0.4),inset_0_0_10px_rgba(255,102,0,0.2)] flex items-center justify-center">
          <span className="text-[clamp(0.6rem,2vw,0.7rem)] font-black uppercase tracking-widest bg-[linear-gradient(180deg,#ffffff,#c0c0c0,#8a8a8a,#ffffff)] bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            {tier}
          </span>
        </div>

        <button 
          onClick={() => onNavigate('settings')} 
          className="opacity-90 hover:opacity-100 transition-opacity active:scale-90 p-1"
        >
          <img 
            src="/gear.png" 
            className="w-[8vw] h-[8vw] max-w-[35px] max-h-[35px] object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" 
            alt="Paramètres" 
          />
        </button>
      </div>

      {/* ========================================== */}
      {/* STRATE MÉDIANE (Le Manifeste - "Le Ressort") */}
      {/* ========================================== */}
      {/* NOUVEAU : Le flex-1 est ici pour pousser le contenu bas vers le fond */}
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-[85vw] mx-auto min-h-[15vh]">
        <p className="text-center text-white font-black uppercase tracking-wide leading-tight text-[clamp(0.6rem,2.5vw,0.9rem)] drop-shadow-md">
          "L'homme ne parle pas à l'IA pour l'écouter,<br />
          mais pour qu'elle devienne le prolongement de son<br />
          expertise terrain."
        </p>
        <p className="mt-[1.5vh] text-center font-black uppercase tracking-[0.2em] text-[clamp(0.6rem,2vw,0.8rem)] bg-[linear-gradient(180deg,#858489,#e7e4ef,#858489,#b9b9b9,#858489)] bg-clip-text text-transparent drop-shadow-sm">
          - Locate Systems -
        </p>
      </div>

      {/* ========================================== */}
      {/* STRATE BASSE (Thumb Zone - Boutons 3D)     */}
      {/* ========================================== */}
      <div className="w-full flex flex-col items-center gap-[4vh] shrink-0">
        
        {/* LIGNE 1 : RANGER / SCANNER */}
        <div className="flex justify-between w-full max-w-[80vw] sm:max-w-sm">
          <button 
            onClick={() => onNavigate('inventory')} 
            className="flex flex-col items-center gap-[1.5vh] active:scale-95 transition-transform w-[45%]"
          >
            <img src="/icon-ranger.png" alt="Ranger" className="w-[28vw] max-w-[120px] object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]" />
            <span className="text-[#FF6600] font-black uppercase tracking-widest text-[clamp(0.7rem,2.5vw,1rem)]">
              Ranger
            </span>
          </button>

          <button 
            onClick={() => onNavigate('scanner')} 
            className="flex flex-col items-center gap-[1.5vh] active:scale-95 transition-transform w-[45%]"
          >
            <img src="/icon-scanner.png" alt="Scanner" className="w-[28vw] max-w-[120px] object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]" />
            <span className="text-[#FF6600] font-black uppercase tracking-widest text-[clamp(0.7rem,2.5vw,1rem)]">
              Scanner
            </span>
          </button>
        </div>

        {/* LIGNE 2 : RETROUVER (Action Maîtresse) */}
        <div className="flex justify-center w-full mt-[1vh]">
          <button 
            onClick={() => onNavigate('search')} 
            className="flex flex-col items-center gap-[1.5vh] active:scale-95 transition-transform"
          >
            <img src="/icon-retrouver.png" alt="Retrouver" className="w-[32vw] max-w-[140px] object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]" />
            <span className="text-[#FF6600] font-black uppercase tracking-widest text-[clamp(0.8rem,3vw,1.1rem)]">
              Retrouver
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default HomeMenu;
```

// ==========================================
// 📂 FICHIER : \src\modules\home\components\InsuranceReport.tsx
// ==========================================

```tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { InventoryItem } from '../../../types';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#FF6600', paddingBottom: 10 },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#FF6600' },
  logoSub: { fontSize: 12, color: '#333333', marginTop: 4 },
  reportInfo: { fontSize: 10, textAlign: 'right', color: '#666666' },
  summaryBox: { backgroundColor: '#FFF5EB', padding: 15, borderRadius: 5, marginBottom: 20, borderWidth: 1, borderColor: '#FF6600' },
  summaryTitle: { fontSize: 14, fontWeight: 'bold', color: '#FF6600', marginBottom: 8 },
  summaryText: { fontSize: 12, color: '#333333', marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#FF6600', marginTop: 15, marginBottom: 10 },
  table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#E5E7EB', borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableColHeader: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderColor: '#E5E7EB', borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#F9FAFB', padding: 5 },
  tableCol: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderColor: '#E5E7EB', borderLeftWidth: 0, borderTopWidth: 0, padding: 5 },
  tableCellHeader: { margin: 2, fontSize: 10, fontWeight: 'bold', color: '#374151' },
  tableCell: { margin: 2, fontSize: 9, color: '#4B5563' },
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', fontSize: 8, color: '#9CA3AF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 10 },
});

interface InsuranceReportProps {
  items: InventoryItem[];
  userInfo: { name: string; address: string };
}

export const InsuranceReport: React.FC<InsuranceReportProps> = ({ items, userInfo }) => {
  const totalValue = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const reportId = `REP-${Date.now().toString().slice(-6)}`;
  const date = new Date().toLocaleString('fr-FR');

  const groupedItems = items.reduce((acc, item) => {
    const loc = item.location || 'Non assigné';
    if (!acc[loc]) acc[loc] = [];
    acc[loc].push(item);
    return acc;
  }, {} as Record<string, InventoryItem[]>);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logoText}>LOCATE HOME</Text>
            <Text style={styles.logoSub}>by Locate Systems</Text>
          </View>
          <View style={styles.reportInfo}>
            <Text>Rapport d'inventaire certifié</Text>
            <Text>ID Rapport : {reportId}</Text>
            <Text>Édité le : {date}</Text>
          </View>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Synthèse du Parc Outillage</Text>
          <Text style={styles.summaryText}>Titulaire : {userInfo.name}</Text>
          <Text style={styles.summaryText}>Lieu de stockage principal : {userInfo.address}</Text>
          <Text style={styles.summaryText}>Nombre total d'articles : {items.length}</Text>
          <Text style={{ ...styles.summaryText, fontWeight: 'bold', marginTop: 5 }}>
            Valeur Totale Estimée : {totalValue.toLocaleString('fr-FR')} €
          </Text>
        </View>

        {Object.entries(groupedItems).map(([location, locItems]) => (
          <View key={location} wrap={false}>
            <Text style={styles.sectionTitle}>Zone : {location.toUpperCase()}</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Désignation</Text></View>
                <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>S/N (Numéro de Série)</Text></View>
                <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>État</Text></View>
                <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Valeur estimée</Text></View>
              </View>
              {locItems.map((item, idx) => (
                <View style={styles.tableRow} key={idx}>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{item.toolName || 'Outil non nommé'}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{item.serialNumber || 'N/A'}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{item.condition || 'Usagé'}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{item.price ? `${item.price} €` : 'N/A'}</Text></View>
                </View>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.footer} fixed>
          Ce rapport a été généré localement via l'application LOCATE HOME. Les données sont certifiées conformes par l'utilisateur au moment de la validation manuelle dans le système (Sas Zéro-Trust). Locate Systems ne saurait être tenu responsable de l'exactitude des informations saisies.
        </Text>
      </Page>
    </Document>
  );
};
```

// ==========================================
// 📂 FICHIER : \src\modules\home\components\InventoryCard.tsx
// ==========================================

```tsx
import type { InventoryItem } from '../../../types';

interface InventoryCardProps {
  item: InventoryItem;
}

export default function InventoryCard({ item }: InventoryCardProps) {
  return (
    <div className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-3 flex items-center gap-4 shadow-[0_4px_10px_rgba(0,0,0,0.3)] group active:scale-[0.98] transition-all w-full mb-3">
      
      {/* 1. MINIATURE PHOTO (Carré gauche) */}
      <div className="w-16 h-16 bg-black rounded-xl border border-white/10 overflow-hidden shrink-0 flex items-center justify-center relative shadow-inner">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.toolName} 
            className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity" 
          />
        ) : (
          <span className="text-xl opacity-30 drop-shadow-md">📷</span>
        )}
      </div>

      {/* 2. INFOS VITALES (Au centre, sans texte tronqué) */}
      <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
        <h3 className="text-white font-black uppercase text-[clamp(0.8rem,3.5vw,1rem)] leading-snug">
          {item.toolName}
        </h3>
        
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[#FF6600] text-[10px] font-black uppercase tracking-widest drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            📍 {item.location || 'N/A'}
          </span>
        </div>
      </div>

      {/* 3. STATUT OPÉRATIONNEL (Badge à droite) */}
      <div className="shrink-0 flex flex-col items-end justify-center">
         <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border shadow-sm ${
           item.safetyStatus 
            ? 'bg-red-500/20 text-red-500 border-red-500/30 animate-pulse' 
            : 'bg-green-500/10 text-green-500 border-green-500/30'
         }`}>
           {item.safetyStatus ? 'ALERTE' : 'OK'}
         </span>
      </div>

    </div>
  );
}
```

// ==========================================
// 📂 FICHIER : \src\modules\home\components\Library.tsx
// ==========================================

```tsx
import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../views/Dashboard';
import type { InventoryItem } from '../../../types';

interface LibraryProps {
  onBack: () => void;
  selectedCategoryId: string | null;
  onStartScan: () => void;
  inventory?: InventoryItem[];
  // NOUVEAU : Fonction pour gérer le clic sur un outil
  onSelectTool: (tool: InventoryItem) => void; 
}

const Library: React.FC<LibraryProps> = ({ onBack, selectedCategoryId, inventory, onSelectTool }) => {
  const [tools, setTools] = useState<InventoryItem[]>([]);

  // Récupération de la catégorie active
  const activeCategoryIndex = CATEGORIES.findIndex(c => c.id === selectedCategoryId);
  const activeCategory = CATEGORIES[activeCategoryIndex];

  const categoryLabel = activeCategory ? activeCategory.label : 'TOUT L\'INVENTAIRE';
  const categoryIcon = activeCategory ? `/${activeCategory.id}.png` : '/icon-photo.png';
  const categoryNumber = activeCategoryIndex !== -1 ? String(activeCategoryIndex + 1).padStart(2, '0') + '.' : '';

  // Filtre Zéro-Bug (Gère les espaces et la casse)
  useEffect(() => {
    const data = inventory || [];
    const safeCategoryId = selectedCategoryId?.trim().toLowerCase();

    const filtered = safeCategoryId
      ? data.filter(t => {
          const cat = t.category?.trim().toLowerCase();
          const label = activeCategory?.label.trim().toLowerCase();
          return cat === safeCategoryId || cat === label;
        })
      : data;

    setTools(filtered.sort((a, b) => a.toolName.localeCompare(b.toolName)));
  }, [selectedCategoryId, inventory, activeCategory]);

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* EN-TÊTE PREMIUM 3D */}
      <div className="flex justify-between items-center px-[4vw] py-4 shrink-0">
        <button className="w-14 h-14 active:scale-90 transition-transform">
          <img src="/icon-assurance.png" alt="Assurance" className="w-full h-full object-contain drop-shadow-lg" />
        </button>
        <button onClick={onBack} className="w-14 h-14 active:scale-90 transition-transform">
          <img src="/icon-return.png" alt="Retour" className="w-full h-full object-contain drop-shadow-lg" />
        </button>
      </div>

      {/* HERO BANNER : Barre Grise */}
      {activeCategory && (
        <div className="px-[4vw] mb-6 shrink-0">
          <div className="w-full bg-[#D3D3D3] rounded-xl flex items-center justify-between p-3 shadow-[0_5px_15px_rgba(0,0,0,0.4)] border border-gray-300">
            <div className="flex items-center gap-4">
              <span className="text-[#FF6600] font-black italic text-2xl tracking-widest [-webkit-text-stroke:1.5px_#121212] drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
                {categoryNumber}
              </span>
              <h2 className="text-[#121212] font-black uppercase text-[0.85rem] tracking-tight leading-none text-left">
                {categoryLabel}
              </h2>
            </div>
            <img src={categoryIcon} alt={categoryLabel} className="w-14 h-14 object-contain drop-shadow-xl shrink-0" />
          </div>
        </div>
      )}

      {/* LISTE DES OUTILS SCANNÉS */}
      <div className="flex-1 overflow-y-auto px-[4vw] pb-[12vh] no-scrollbar">
        {tools.length > 0 ? (
          <div className="flex flex-col gap-4">
            {tools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => onSelectTool(tool)} // NOUVEAU : Action de clic ajoutée
                className="bg-[#1E1E1E] rounded-r-xl rounded-l-sm border-l-4 border-[#FF6600] p-4 flex gap-4 shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer active:scale-[0.98] transition-transform"
              >
                {/* Photo miniature */}
                <div className="w-16 h-16 rounded-lg bg-black/50 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                  {tool.imageUrl ? (
                    <img src={tool.imageUrl} className="w-full h-full object-cover" alt={tool.toolName} />
                  ) : (
                    <span className="text-[8px] font-black text-white/20">NO IMG</span>
                  )}
                </div>

                {/* Détails */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="text-white font-black text-sm uppercase truncate leading-tight">
                      {tool.toolName}
                    </h3>
                    <p className="text-[#FF6600] text-[10px] font-bold mt-0.5 tracking-wider truncate">
                      📍 {tool.location || 'ZONE NON DÉFINIE'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-widest border ${tool.safetyStatus ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-green-500/10 text-green-500 border-green-500/30'}`}>
                      {tool.safetyStatus ? 'ALERTE' : 'OPÉRATIONNEL'}
                    </span>
                    <span className="text-[#B0BEC5] text-[9px] italic opacity-60">
                      {tool.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[40vh] flex flex-col items-center justify-center opacity-30">
            <div className="w-16 h-16 border-2 border-dashed border-white/50 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-2xl">?</span>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-center text-white">Inventaire Vide</p>
            <p className="text-[10px] mt-2 text-center text-white">Aucun outil scanné dans cette catégorie.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
```

// ==========================================
// 📂 FICHIER : \src\modules\home\components\PdfExportButton.tsx
// ==========================================

```tsx
import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InsuranceReport } from './InsuranceReport';
import type { InventoryItem } from '../../../types';

interface PdfExportButtonProps {
  inventory: InventoryItem[];
  userInfo: { name: string; address: string };
}

// Ce composant contient la logique lourde et sera chargé en différé (Lazy Load)
const PdfExportButton: React.FC<PdfExportButtonProps> = ({ inventory, userInfo }) => {
  return (
    <PDFDownloadLink
      document={<InsuranceReport items={inventory} userInfo={userInfo} />}
      fileName={`LocateHome_Assurance_${new Date().toISOString().split('T')[0]}.pdf`}
      className="w-14 h-14 active:scale-90 transition-transform block"
    >
      {({ loading }) => (
        <img
          src="/icon-assurance.png"
          alt="Assurance"
          className={`w-full h-full object-contain drop-shadow-lg ${loading ? 'opacity-50 animate-pulse' : ''}`}
        />
      )}
    </PDFDownloadLink>
  );
};

export default PdfExportButton;
```

// ==========================================
// 📂 FICHIER : \src\modules\home\components\Search.tsx
// ==========================================

```tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Mic, MicOff, Search as SearchIcon, MapPin } from 'lucide-react';
import type { InventoryItem, Location } from '../../../types';
import { getCustomLocations } from '../../../core/storage/memoryService';

interface SearchProps {
  onBack: () => void;
  inventory: InventoryItem[];
}

const Search: React.FC<SearchProps> = ({ onBack, inventory }) => {
  const [isListening, setIsListening] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | 'ALL'>('ALL');
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    setLocations(getCustomLocations());
  }, []);

  // --- VOCAL PRO : PARSEUR D'INTENTION LOCAL ---
  const analyzeIntent = (transcript: string) => {
    let cleanedQuery = transcript.toLowerCase();
    let detectedLocation: string | null = null;

    // 1. Détection de la Zone (Location dynamique)
    locations.forEach(loc => {
      const locName = loc.label.toLowerCase();
      if (cleanedQuery.includes(locName)) {
        detectedLocation = loc.label;
        // On retire le nom de la zone de la recherche texte
        cleanedQuery = cleanedQuery.replace(locName, '').trim();
      }
    });

    // 2. Nettoyage des mots de liaison inutiles pour une recherche propre
    const stopWords = ['dans le', 'dans la', 'dans', 'sur le', 'sur la', 'sur', 'montre-moi', 'cherche', 'trouve', 'les', 'des'];
    stopWords.forEach(word => {
      cleanedQuery = cleanedQuery.replace(new RegExp(`\\b${word}\\b`, 'gi'), '').trim();
    });

    // 3. Application automatique des filtres HUD
    if (detectedLocation) {
      setSelectedLocation(detectedLocation);
    }

    // 4. On injecte l'essence de la recherche (ex: "perceuse bosch") dans l'input
    setQuery(cleanedQuery.replace(/\s+/g, ' ').trim());
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition;
    if (!SpeechRecognition) {
      alert("La reconnaissance vocale n'est pas supportée sur ce navigateur.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false; // Arrêt auto après la phrase
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      analyzeIntent(transcript); // Injection dans le parseur au lieu de setQuery direct
    };

    recognition.start();
  };

  // --- FILTRAGE INTELLIGENT MULTI-CRITÈRES ---
  const results = useMemo(() => {
    return inventory.filter(tool => {
      // Découpage de la requête en mots pour une recherche plus tolérante (ex: "bosch perceuse" trouve "Perceuse Bosch")
      const searchTerms = query.toLowerCase().split(' ').filter(word => word.length > 2);
      
      const matchesQuery = query.trim() === '' || searchTerms.every(term => 
        tool.toolName.toLowerCase().includes(term) || 
        tool.category.toLowerCase().includes(term) ||
        (tool.sku && tool.sku.toLowerCase().includes(term))
      );
      
      const matchesLocation = selectedLocation === 'ALL' || tool.location === selectedLocation;
      return matchesQuery && matchesLocation;
    });
  }, [query, selectedLocation, inventory]);

  return (
    <div className="min-h-screen bg-[#121212] text-white p-[4vh] font-sans pb-[15vh]">
      
      {/* HEADER & RETOUR */}
      <div className="flex justify-between items-center mb-[6vh]">
        <button onClick={onBack} className="flex items-center gap-[2vw] active:scale-90 transition-transform">
          <img src="/icon-return.png" alt="Retour" className="w-[2.5rem] h-[2.5rem] object-contain" />
          <span className="text-[#FF6600] font-black uppercase text-[0.7rem] tracking-widest mt-1">Menu</span>
        </button>
        
        <div className="flex flex-col items-end text-right">
          <h2 className="text-[1.5rem] font-black italic uppercase tracking-tighter leading-none">Retrouver</h2>
        </div>
      </div>

      {/* ZONE DE RECHERCHE TEXTUELLE (Centrée) */}
      <div className="relative mb-[4vh]">
        <div className="absolute inset-y-0 left-[4vw] flex items-center pointer-events-none">
          <SearchIcon size={20} className="text-[#FF6600]/50" />
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un outil..."
          className="w-full bg-[#1E1E1E] border border-white/10 rounded-2xl py-[2.5vh] pl-[12vw] pr-[4vw] text-[1rem] font-bold tracking-wide focus:border-[#FF6600] transition-all outline-none shadow-inner text-white placeholder-white/30 text-center"
        />
      </div>

      {/* BOUTON MICRO GÉANT (Sous le pouce) */}
      <div className="flex justify-center mb-[5vh]">
        <button 
          onClick={startListening}
          className={`w-[20vw] h-[20vw] max-w-[80px] max-h-[80px] rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening 
              ? 'bg-red-600 scale-110 shadow-[0_0_30px_rgba(220,53,69,0.6)] animate-pulse' 
              : 'bg-[#FF6600] shadow-[0_0_20px_rgba(255,102,0,0.4)] hover:scale-105 active:scale-95'
          }`}
        >
          {isListening ? <MicOff size={32} color="white" /> : <Mic size={32} color="white" />}
        </button>
      </div>

      {/* FILTRES DE ZONES DYNAMIQUES */}
      <div className="flex overflow-x-auto no-scrollbar gap-[1rem] mb-[5vh] pb-[1vh] snap-x">
        <button 
          onClick={() => setSelectedLocation('ALL')}
          className={`snap-center shrink-0 px-[1.5rem] py-[0.5rem] rounded-full border text-[0.7rem] font-black transition-all ${
            selectedLocation === 'ALL' ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'border-white/10 text-gray-500'
          }`}
        >
          TOUT
        </button>
        
        {locations.map(loc => (
          <button 
            key={loc.id}
            onClick={() => setSelectedLocation(loc.label)}
            className={`snap-center shrink-0 px-[1.5rem] py-[0.5rem] rounded-full border text-[0.7rem] font-black transition-all ${
              selectedLocation === loc.label ? 'bg-[#FF6600] text-white border-[#FF6600] shadow-[0_0_10px_#FF6600]' : 'border-white/10 text-gray-500'
            }`}
          >
            {loc.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* LISTE DES RÉSULTATS */}
      <div className="grid gap-[2vh]">
        {(query.trim() !== '' || selectedLocation !== 'ALL') && results.length > 0 ? (
          results.map(tool => (
            <div key={tool.id} className="relative bg-[#1E1E1E] border border-white/5 rounded-[1.5rem] p-[1rem] flex items-center gap-[4vw] overflow-hidden group active:scale-[0.98] transition-transform">
              
              <div className="absolute top-0 left-0 w-full h-[1px] bg-[#FF6600] shadow-[0_0_10px_#FF6600] opacity-0 group-active:opacity-100"></div>
              
              <div className="w-[5rem] h-[5rem] rounded-[1rem] overflow-hidden bg-black border border-white/10 flex-shrink-0 relative">
                <img src={tool.imageUrl || "/placeholder-tool.png"} alt={tool.toolName} className="w-full h-full object-cover opacity-80" />
                <div className="absolute bottom-1 right-1 w-4 h-4">
                  <img src={`/${tool.category}.png`} className="w-full h-full object-contain" alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-black text-[0.9rem] uppercase text-white truncate leading-tight">{tool.toolName}</h3>
                <div className="flex items-center gap-[0.5rem] text-[#FF6600] mt-[0.5vh]">
                  <MapPin size={12} />
                  <span className="text-[0.6rem] font-black uppercase tracking-tighter">{tool.location}</span>
                </div>
                <p className="text-[0.5rem] text-gray-500 mt-[1vh] font-mono opacity-50">ID: {tool.sku || tool.id.split('-')[0].toUpperCase()}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-[10vh] border-2 border-dashed border-white/5 rounded-[2rem]">
            <img src="/icon-retrouver.png" className="w-[4rem] opacity-20 mb-[2vh]" alt="" />
            <p className="text-gray-600 text-[0.7rem] uppercase font-bold tracking-widest italic text-center px-[10vw]">
              {query ? "Aucun actif identifié" : "En attente d'une commande vocale ou textuelle"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
```

// ==========================================
// 📂 FICHIER : \src\modules\home\components\StoreModal.tsx
// ==========================================

```tsx
import React from 'react';
import { LOCATE_CATALOG } from '../../../data/catalog';
import { useAppSettings } from '../../../core/storage/useAppSettings'; // NOUVEAU : Import de nos paramètres

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StoreModal: React.FC<StoreModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useAppSettings(); // NOUVEAU : Récupération du choix de l'utilisateur

  if (!isOpen) return null;

  // NOUVEAU : Fonction utilitaire pour convertir dynamiquement les mm en inches
  const formatDimension = (valueInMm: number) => {
    if (settings.unitSystem === 'IMPERIAL') {
      return (valueInMm / 25.4).toFixed(1); // Conversion avec 1 chiffre après la virgule
    }
    return valueInMm;
  };

  const unitLabel = settings.unitSystem === 'IMPERIAL' ? 'in' : 'mm';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Overlay flouté (cliquable pour fermer) */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Conteneur de la Modale (Slide up) */}
      <div className="relative w-full max-w-md bg-[#121212] rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh] animate-slide-up">

        {/* En-tête du magasin */}
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#0a0a0a]">
          <div>
            <h2 className="text-white font-black text-xl tracking-widest uppercase">Boutique LOCATE</h2>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">Écosystème Certifié IA</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-[#1E1E1E] rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            ✕
          </button>
        </div>

        {/* Liste des produits (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {LOCATE_CATALOG.map((product) => (
            <div key={product.id} className="bg-[#1E1E1E] rounded-2xl p-4 border border-white/5 shadow-lg flex flex-col gap-3 group">

              <div className="flex gap-4">
                {/* Image Produit */}
                <div className="w-24 h-24 bg-[#0a0a0a] rounded-xl border border-white/5 flex items-center justify-center shrink-0 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5 pointer-events-none"></div>
                  <span className="text-3xl opacity-50">📦</span>
                </div>

                {/* Infos Produit */}
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-white font-black text-sm leading-tight mb-1">{product.name}</h3>
                  <p className="text-gray-400 text-[10px] leading-snug line-clamp-2 mb-2">
                    {product.description}
                  </p>

                  {/* Badge Dimension Dynamique */}
                  {product.isContainer && product.dimensions && (
                    <span className="self-start px-2 py-0.5 bg-black/50 border border-white/10 rounded text-[9px] text-[#FF6600] font-mono tracking-wider transition-all">
                      {formatDimension(product.dimensions.length)}x{formatDimension(product.dimensions.width)}x{formatDimension(product.dimensions.height)} {unitLabel}
                    </span>
                  )}
                </div>
              </div>

              {/* Bouton d'Achat (Préparé pour Revolut) */}
              <button className="w-full bg-white text-black py-3 rounded-xl font-black text-xs uppercase tracking-widest flex justify-between items-center px-5 active:scale-95 transition-transform hover:bg-gray-200">
                <span>Commander</span>
                <span className="bg-black text-white px-2 py-1 rounded-lg text-[10px]">{product.price.toFixed(2)} €</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer sécurisé Revolut */}
        <div className="p-4 bg-[#0a0a0a] border-t border-white/5 flex justify-center items-center gap-2">
          <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Paiement Sécurisé</span>
          <span className="text-white text-[10px] font-black tracking-widest">REVOLUT PAY</span>
        </div>

      </div>
    </div>
  );
};

export default StoreModal;
```

// ==========================================
// 📂 FICHIER : \src\modules\home\components\ToolDetail.tsx
// ==========================================

```tsx
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
```

// ==========================================
// 📂 FICHIER : \src\modules\home\views\Dashboard.tsx
// ==========================================

```tsx
import React, { Suspense, lazy } from 'react';
import { useUserTier } from '../../../core/security/useUserTier';
import type { InventoryItem } from '../../../types';

// Import différé (Lazy Loading) pour éviter le crash au Runtime
const PdfExportButton = lazy(() => import('../components/PdfExportButton'));

export const CATEGORIES = [
  { id: 'electro', label: 'Outillage Électroportatif' },
  { id: 'main', label: 'Outillage à main' },
  { id: 'serrage', label: 'Serrage et Clés' },
  { id: 'quinc', label: 'Quincaillerie et Consommables' },
  { id: 'elec', label: 'Électricité et Éclairage' },
  { id: 'peinture', label: 'Peinture et Finition' },
  { id: 'mesure', label: 'Mesure et Traçage' },
  { id: 'jardin', label: 'Jardin et Extérieur' },
  { id: 'epi', label: 'Équipements De Protection' },
];

interface DashboardProps {
  inventory: InventoryItem[];
  onStartScan: () => void;
  onDelete: (id: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onBack?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ inventory, onSelectCategory, onBack, onDelete }) => {
  const { currentTier } = useUserTier();
  const canExportPdf = currentTier === 'PREMIUM' || currentTier === 'PRO';

  const dummyUserInfo = {
    name: 'Utilisateur Premium',
    address: 'Atelier Principal / Fourgon'
  };
 
  const handleReturn = () => {
    if (onBack) onBack();
    else window.history.back();
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
     
      {/* EN-TÊTE PREMIUM 3D */}
      <div className="flex justify-between items-center px-[4vw] py-4 shrink-0">
       
        {/* Actions Gauche : Assurance uniquement */}
        <div className="flex gap-4">
          {canExportPdf ? (
            <Suspense fallback={<div className="w-14 h-14 opacity-50 animate-pulse bg-gray-300 rounded-full" />}>
              <PdfExportButton inventory={inventory} userInfo={dummyUserInfo} />
            </Suspense>
          ) : (
            <button
              onClick={() => alert("L'export PDF Assurance est réservé aux comptes PREMIUM et PRO.")}
              className="w-14 h-14 active:scale-90 transition-transform opacity-50 cursor-not-allowed"
              title="Passer Premium pour exporter"
            >
              <img
                src="/icon-assurance.png"
                alt="Assurance (Verrouillé)"
                className="w-full h-full object-contain drop-shadow-lg grayscale"
              />
            </button>
          )}
        </div>

        {/* Action Droite : Retour */}
        <button onClick={handleReturn} className="w-14 h-14 active:scale-90 transition-transform">
          <img src="/icon-return.png" alt="Retour" className="w-full h-full object-contain drop-shadow-lg" />
        </button>
      </div>

      {/* LISTE DES 9 CATÉGORIES */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-[4vw] pb-[12vh]">
        <div className="flex flex-col gap-4">
          {CATEGORIES.map((cat, index) => {
            const number = String(index + 1).padStart(2, '0') + '.';
           
            // Comptage Blindé (Gère la casse et les espaces)
            const itemCount = inventory.filter(item =>
              item.category?.trim().toLowerCase() === cat.id.toLowerCase() ||
              item.category?.trim().toLowerCase() === cat.label.toLowerCase()
            ).length;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="w-full bg-[#D3D3D3] rounded-xl flex items-center justify-between p-3 shadow-[0_5px_15px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all border border-gray-300"
              >
               
                <div className="flex items-center gap-4">
                  <span className="text-[#FF6600] font-black italic text-2xl tracking-widest [-webkit-text-stroke:1.5px_#121212] drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
                    {number}
                  </span>

                  <div className="flex flex-col items-start text-left">
                    <h3 className="text-[#121212] font-black uppercase text-[0.85rem] tracking-tight leading-none">
                      {cat.label}
                    </h3>
                    <span className="text-gray-700 text-[10px] font-bold mt-1">
                      {itemCount} OBJET{itemCount > 1 ? 'S' : ''}
                    </span>
                  </div>
                </div>

                <img
                  src={`/${cat.id}.png`}
                  alt={cat.label}
                  className="w-14 h-14 object-contain drop-shadow-xl shrink-0"
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="hidden">{onDelete.name}</div>
    </div>
  );
};

export default Dashboard;
```

// ==========================================
// 📂 FICHIER : \src\modules\home\views\PrivacyPolicy.tsx
// ==========================================

```tsx
import React from 'react';
import { useAppSettings } from '../../../core/storage/useAppSettings';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  // Connexion au cerveau global pour connaître la langue active
  const { settings } = useAppSettings();
  const isUK = settings.language === 'UK';

  return (
    <div className="flex flex-col h-full bg-[#121212] px-[5vw] pt-[2vh] pb-[calc(2vh+env(safe-area-inset-bottom))] overflow-y-auto relative z-[110]">

      {/* Bouton Retour Dynamique */}
      <button
        onClick={onBack}
        className="self-start text-[#FF6600] border border-[#FF6600] bg-[#1E1E1E] px-[4vw] py-[1vh] rounded-md font-black uppercase tracking-widest text-[clamp(0.7rem,3vw,1rem)] mb-[3vh] active:scale-95 transition-transform"
      >
        ← {isUK ? 'Back' : 'Retour'}
      </button>

      {/* CONTENU ANGLAIS (UK) */}
      {isUK ? (
        <div className="space-y-[4vh] pb-[5vh] text-white/70 text-[clamp(0.8rem,2.8vw,0.95rem)] leading-relaxed">
          
          <div className="mb-[4vh] border-b border-white/10 pb-[2vh]">
            <h1 className="text-white font-black uppercase tracking-widest text-[clamp(1.2rem,5vw,2rem)] leading-none mb-[1vh]">
              GENERAL TERMS <span className="text-[#FF6600]">OF SERVICE</span>
            </h1>
            <p className="italic text-white/50">Last updated: February 26, 2026 | LOCATE HOME (by Locate Systems)</p>
          </div>

          <section>
            <h2 className="text-[#FF6600] font-bold text-[clamp(1rem,4vw,1.1rem)] uppercase tracking-wide mb-[1vh]">PREAMBLE: Legal Notice</h2>
            <ul className="list-none space-y-1">
              <li><strong>Service Publisher:</strong> Nicolas Loesel EI - Locate Systems</li>
              <li><strong>SIRET:</strong> [Your SIRET number]</li>
              <li><strong>Headquarters:</strong> 209 rue Jacques Brel 30730 FONS, France</li>
              <li><strong>Contact:</strong> contact@locate-systems.com</li>
              <li><strong>Hosting:</strong> Application deployed via Vercel / Database stored locally on the user's device.</li>
            </ul>
            <p className="mt-3 italic border-l-2 border-[#FF6600] pl-3">"Man does not speak to AI to listen to it, but so that it becomes the extension of his field expertise."</p>
          </section>

          <section>
            <h2 className="text-[#FF6600] font-bold text-[clamp(1rem,4vw,1.1rem)] uppercase tracking-wide mb-[1vh]">ARTICLE 1: PURPOSE OF THE APPLICATION</h2>
            <p>The LOCATE HOME application is a digital assistance tool for managing, locating, and inventorying power and hand tools. It uses Artificial Intelligence (visual analysis) to propose tool identification, thereby facilitating the creation of inventory reports, particularly for insurance purposes or maintenance tracking.</p>
          </section>

          <section>
            <h2 className="text-[#FF6600] font-bold text-[clamp(1rem,4vw,1.1rem)] uppercase tracking-wide mb-[1vh]">ARTICLE 2: "ZERO-TRUST" ARCHITECTURE AND PERSONAL DATA</h2>
            <p><strong>Local Storage (IndexedDB):</strong> Unlike traditional cloud applications, LOCATE HOME is built on a local processing architecture. The entirety of the user's inventory (photos, descriptions, values) is physically saved on their device.</p>
            <p className="mt-2"><strong>Confidentiality:</strong> Locate Systems has no access to, does not collect, and does not sell its users' inventory data.</p>
            <p className="mt-2"><strong>Data Loss:</strong> The user is solely responsible for backing up their data or exporting their reports. In the event of loss, theft, or resetting of their device, Locate Systems cannot be held responsible for the loss of the inventory.</p>
          </section>

          <section>
            <h2 className="text-[#FF6600] font-bold text-[clamp(1rem,4vw,1.1rem)] uppercase tracking-wide mb-[1vh]">ARTICLE 3: ROLE OF AI AND USER RESPONSIBILITY</h2>
            <p><strong>Technical Assistance:</strong> The integrated AI acts exclusively as a data entry assistant. It submits identification hypotheses via a "Validation Checkpoint".</p>
            <p className="mt-2"><strong>Human Validation:</strong> The user retains full control and must imperatively validate, correct, or reject the AI's proposals before any integration into the database.</p>
            <p className="mt-2"><strong>Limitation of Liability:</strong> Locate Systems does not guarantee the infallible accuracy of the visual recognition. In the event of a dispute with an insurance company, the responsibility lies entirely with the user who validated the entry.</p>
          </section>

          <section>
            <h2 className="text-[#FF6600] font-bold text-[clamp(1rem,4vw,1.1rem)] uppercase tracking-wide mb-[1vh]">ARTICLE 4: ACCESS LEVELS AND PRICING (TIER MODEL)</h2>
            <div className="space-y-3">
              <div className="bg-[#1E1E1E] p-3 rounded border border-white/5">
                <span className="font-black text-white">4.1. FREE Tier:</span> Strictly limited to a maximum of 15 tools. No certified PDF reports. Free, no time limit.
              </div>
              <div className="bg-[#1E1E1E] p-3 rounded border border-[#FF6600]/30">
                <span className="font-black text-[#FF6600]">4.2. PREMIUM Tier:</span> Unlimited inventory. Access to Insurance module for PDF reports. Monthly/Annual subscription.
              </div>
              <div className="bg-[#1E1E1E] p-3 rounded border border-white/5">
                <span className="font-black text-white">4.3. PRO Tier:</span> Exclusive tool for professionals. Advanced multi-zone management. Billable to companies.
              </div>
            </div>
<p className="mt-3"><strong>Downgrade Terms:</strong> In the event of cancellation, the account reverts to FREE. If inventory &gt; 15 tools, it remains read-only until reduced or resubscribed.</p>          </section>

          <section>
            <h2 className="text-[#FF6600] font-bold text-[clamp(1rem,4vw,1.1rem)] uppercase tracking-wide mb-[1vh]">ARTICLE 5 & 6: IP & TERMS OF SALE</h2>
            <p>The entire interface, architecture, and visual assets are the exclusive intellectual property of Locate Systems. Payments are securely processed by our providers. You can cancel your subscription at any time from your settings.</p>
          </section>

          {/* PRIVACY POLICY UK */}
          <div className="mt-[6vh] mb-[4vh] border-b border-white/10 pb-[2vh] pt-[4vh] border-t">
            <h1 className="text-white font-black uppercase tracking-widest text-[clamp(1.2rem,5vw,2rem)] leading-none mb-[1vh]">
              PRIVACY <span className="text-[#FF6600]">POLICY</span>
            </h1>
            <p className="italic text-white/50">Philosophy: Privacy by Design</p>
          </div>

          <section className="space-y-[3vh]">
            <div>
              <h3 className="text-white font-bold mb-1">1. THE PRINCIPLE OF LOCAL SOVEREIGNTY</h3>
              <p>Locate Home does not upload your inventory to our servers. Your photos and data are stored exclusively in your device's memory. Locate Systems is technically unable to read, sell, or lose your data.</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-1">2. COLLECTED DATA (THE EXCEPTIONS)</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Identity & Payments:</strong> Email and name for Premium/Pro access. Banking info is processed by our PCI-DSS provider. We never store your card number.</li>
                <li><strong>AI Analysis:</strong> Images are sent ephemerally to the vision API. No image is retained after processing.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-1">3. YOUR RIGHTS & SECURITY</h3>
              <p>You can delete your entire inventory by clearing your cache or deleting your account. You can export your data at any time. The security of your inventory relies on your device (we recommend biometric locks).</p>
            </div>
          </section>

        </div>
      ) : (
        /* ========================================================= */
        /* CONTENU FRANÇAIS (FR)                                     */
        /* ========================================================= */
        <div className="space-y-[4vh] pb-[5vh] text-white/70 text-[clamp(0.8rem,2.8vw,0.95rem)] leading-relaxed">
          
          <div className="mb-[4vh] border-b border-white/10 pb-[2vh]">
            <h1 className="text-white font-black uppercase tracking-widest text-[clamp(1.2rem,5vw,2rem)] leading-none mb-[1vh]">
              CONDITIONS GÉNÉRALES <br/><span className="text-[#FF6600]">D'UTILISATION (CGU/CGV)</span>
            </h1>
            <p className="italic text-white/50">Dernière mise à jour : 26 Février 2026 | LOCATE HOME</p>
          </div>

          <section>
            <h2 className="text-[#FF6600] font-bold text-[clamp(1rem,4vw,1.1rem)] uppercase tracking-wide mb-[1vh]">PRÉAMBULE : Mentions Légales</h2>
            <ul className="list-none space-y-1">
              <li><strong>Éditeur du service :</strong> Nicolas Loesel EI - Locate Systems</li>
              <li><strong>SIRET :</strong> [Ton numéro SIRET]</li>
              <li><strong>Siège Social :</strong> 209 rue Jacques Brel 30730 FONS, France</li>
              <li><strong>Contact :</strong> contact@locate-systems.com</li>
              <li><strong>Hébergement :</strong> Application déployée via Vercel / Base de données stockée en local sur l'appareil.</li>
            </ul>
            <p className="mt-3 italic border-l-2 border-[#FF6600] pl-3">"L'homme ne parle pas à l'IA pour l'écouter, mais pour qu'elle devienne le prolongement de son expertise terrain."</p>
          </section>

          <section>
            <h2 className="text-[#FF6600] font-bold text-[clamp(1rem,4vw,1.1rem)] uppercase tracking-wide mb-[1vh]">ARTICLE 1 : OBJET DE L'APPLICATION</h2>
            <p>L'application LOCATE HOME est un outil numérique d'assistance à la gestion, au repérage et à l'inventaire d'outillage. Elle utilise une Intelligence Artificielle (analyse visuelle) pour proposer une identification des outils, facilitant ainsi la création de rapports d'inventaire pour les assurances ou la maintenance.</p>
          </section>

          <section>
            <h2 className="text-[#FF6600] font-bold text-[clamp(1rem,4vw,1.1rem)] uppercase tracking-wide mb-[1vh]">ARTICLE 2 : ARCHITECTURE "ZÉRO-TRUST" ET DONNÉES</h2>
            <p><strong>Stockage Local (IndexedDB) :</strong> Contrairement aux applications cloud, LOCATE HOME sauvegarde l'intégralité de l'inventaire physiquement sur l'appareil de l'utilisateur.</p>
            <p className="mt-2"><strong>Confidentialité :</strong> Locate Systems n'a aucun accès, ne collecte pas et ne revend pas les données.</p>
            <p className="mt-2"><strong>Perte de données :</strong> L'utilisateur est seul responsable de la sauvegarde de ses données. En cas de perte, de vol ou de réinitialisation de l'appareil, Locate Systems ne pourra être tenu responsable.</p>
          </section>

          <section>
            <h2 className="text-[#FF6600] font-bold text-[clamp(1rem,4vw,1.1rem)] uppercase tracking-wide mb-[1vh]">ARTICLE 3 : RÔLE DE L'IA ET RESPONSABILITÉ</h2>
            <p><strong>Assistance Technique :</strong> L'IA agit exclusivement comme un assistant à la saisie via un "Sas de Validation".</p>
            <p className="mt-2"><strong>Validation Humaine :</strong> L'utilisateur garde le contrôle total et doit obligatoirement valider ou rejeter les propositions de l'IA.</p>
            <p className="mt-2"><strong>Limitation de Responsabilité :</strong> Locate Systems ne garantit pas l'exactitude infaillible de la reconnaissance. En cas de litige avec une assurance, la responsabilité incombe exclusivement à l'utilisateur.</p>
          </section>

          <section>
            <h2 className="text-[#FF6600] font-bold text-[clamp(1rem,4vw,1.1rem)] uppercase tracking-wide mb-[1vh]">ARTICLE 4 : NIVEAUX D'ACCÈS ET TARIFICATION</h2>
            <div className="space-y-3">
              <div className="bg-[#1E1E1E] p-3 rounded border border-white/5">
                <span className="font-black text-white">4.1. Niveau FREE :</span> Limité à 15 outils maximum. Pas de rapport PDF. Gratuit.
              </div>
              <div className="bg-[#1E1E1E] p-3 rounded border border-[#FF6600]/30">
                <span className="font-black text-[#FF6600]">4.2. Niveau PREMIUM :</span> Inventaire illimité. Accès Module Assurance (PDF). Abonnement mensuel/annuel.
              </div>
              <div className="bg-[#1E1E1E] p-3 rounded border border-white/5">
                <span className="font-black text-white">4.3. Niveau PRO :</span> Outil professionnel. Gestion multi-zones. Facturable aux entreprises (TVA).
              </div>
            </div>
            <p className="mt-3"><strong>Rétrogradation :</strong> En cas de résiliation, le compte redevient FREE. Si l'inventaire dépasse 15 outils, il passe en lecture seule jusqu'à régularisation.</p>
          </section>

          <section>
            <h2 className="text-[#FF6600] font-bold text-[clamp(1rem,4vw,1.1rem)] uppercase tracking-wide mb-[1vh]">ARTICLE 5 & 6 : PROPRIÉTÉ ET VENTE</h2>
            <p>L'ensemble de l'interface et des actifs visuels (Icônes 3D) sont la propriété exclusive de Locate Systems. Les paiements sont traités de manière sécurisée. Vous pouvez résilier votre abonnement à tout moment.</p>
          </section>

          {/* POLITIQUE DE CONFIDENTIALITE FR */}
          <div className="mt-[6vh] mb-[4vh] border-b border-white/10 pb-[2vh] pt-[4vh] border-t">
            <h1 className="text-white font-black uppercase tracking-widest text-[clamp(1.2rem,5vw,2rem)] leading-none mb-[1vh]">
              POLITIQUE DE <span className="text-[#FF6600]">CONFIDENTIALITÉ</span>
            </h1>
            <p className="italic text-white/50">Philosophie : Privacy by Design</p>
          </div>

          <section className="space-y-[3vh]">
            <div>
              <h3 className="text-white font-bold mb-1">1. SOUVERAINETÉ LOCALE</h3>
              <p>Locate Home ne télécharge pas votre inventaire sur nos serveurs. Vos photos et descriptions sont stockées exclusivement dans la mémoire de votre appareil (IndexedDB). Nous n'y avons jamais accès.</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-1">2. DONNÉES COLLECTÉES (EXCEPTIONS)</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Compte & Paiements :</strong> Email pour l'accès Premium. Les informations bancaires sont gérées par notre prestataire certifié. Nous ne stockons pas de numéros de carte.</li>
                <li><strong>Analyse IA :</strong> L'image est envoyée de manière éphémère à l'API de vision. Aucune image n'est conservée après le traitement.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-1">3. VOS DROITS & SÉCURITÉ</h3>
              <p>Vous disposez du droit à l'effacement (en vidant le cache de l'app) et à la portabilité (export de données). La sécurité de votre inventaire repose sur le verrouillage biométrique ou par code de votre propre smartphone.</p>
            </div>
          </section>

        </div>
      )}

    </div>
  );
};

export default PrivacyPolicy;
```

// ==========================================
// 📂 FICHIER : \src\modules\home\views\SettingsPage.tsx
// ==========================================

```tsx
import React, { useState, useEffect } from 'react';
import { useAppSettings } from '../../../core/storage/useAppSettings';
import { useUserTier } from '../../../core/security/useUserTier';
import { TIERS_CONFIG, type UserTier } from '../../../core/security/tiers';
import { useTranslation } from '../../../core/i18n/useTranslation';
import PrivacyPolicy from './PrivacyPolicy';

interface SettingsPageProps {
  onBack?: () => void; 
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const { settings, updateSettings } = useAppSettings();
  const { currentTier, setTier } = useUserTier();
  const { t, lang } = useTranslation();
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [storageUsed, setStorageUsed] = useState<string>("0.00");

  useEffect(() => {
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(({ usage }) => {
        if (usage) {
          setStorageUsed((usage / (1024 * 1024)).toFixed(2));
        }
      });
    }
  }, []);

  if (showPrivacy) {
    return <PrivacyPolicy onBack={() => setShowPrivacy(false)} />;
  }

  // Sécurisation de l'objet profil au cas où il serait vide lors du premier chargement
  const profile = settings.userProfile || { fullName: '', company: '', address: '' };

  const handleProfileChange = (field: keyof typeof profile, value: string) => {
    updateSettings({ 
      userProfile: { ...profile, [field]: value } 
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#121212] text-white p-[3vh_5vw] overflow-y-auto pb-[15vh]">
      
      {/* EN-TÊTE AVEC BOUTON RETOUR 3D */}
      <div className="flex items-center justify-between mb-[4vh] mt-[4vh]">
        <div>
          <h1 className="text-[clamp(1.5rem,6vw,2.5rem)] font-black text-[#FF6600] uppercase tracking-wide font-['Rebel']">
            {t('settings_title')}
          </h1>
          <p className="text-[clamp(0.8rem,3vw,1rem)] text-gray-400">
            {t('settings_subtitle')}
          </p>
        </div>
        
        {onBack && (
          <button 
            onClick={onBack}
            className="w-[clamp(40px,10vw,60px)] h-[clamp(40px,10vw,60px)] bg-[#1A1A1A] rounded-xl flex items-center justify-center border border-[#333] shadow-[0_4px_0_#000] active:shadow-[0_0px_0_#000] active:translate-y-[4px] transition-all shrink-0"
          >
            <img src="/icon-return.png" alt="Retour" className="w-[50%] h-[50%] object-contain" />
          </button>
        )}
      </div>

      <div className="w-full h-[1px] bg-[#333] mb-[4vh]"></div>

      {/* SECTION 1 : INTERNATIONALISATION */}
      <div className="mb-[5vh]">
        <h2 className="text-[clamp(1rem,4vw,1.2rem)] font-bold mb-[2vh] flex items-center tracking-widest text-gray-200">
          <span className="w-[4px] h-[1.2em] bg-[#FF6600] mr-[2vw]"></span>
          {t('intl_title')}
        </h2>

        <div className="bg-[#1A1A1A] rounded-2xl p-[2vh_4vw] border border-[#222]">
          <div className="flex justify-between items-center">
            <div className="flex-1 pr-[2vw]">
              <div className="font-bold text-[clamp(0.9rem,3.5vw,1.1rem)]">{t('intl_lang')}</div>
              <div className="text-[clamp(0.7rem,2.5vw,0.8rem)] text-gray-500 uppercase">{t('intl_lang_desc')}</div>
            </div>
            <div className="flex bg-[#0A0A0A] rounded-lg p-[4px] gap-[1vw] shrink-0">
              <button 
                onClick={() => updateSettings({ language: 'FR', unitSystem: 'METRIC' })}
                className={`px-[3vw] py-[1vh] rounded-md font-black text-[clamp(0.8rem,3vw,1rem)] transition-all ${lang === 'FR' ? 'bg-[#FF6600] text-white shadow-[0_0_15px_rgba(255,102,0,0.4)]' : 'text-gray-500 hover:text-gray-300'}`}
              >
                FR (CM)
              </button>
              <button 
                onClick={() => updateSettings({ language: 'UK', unitSystem: 'IMPERIAL' })}
                className={`px-[3vw] py-[1vh] rounded-md font-black text-[clamp(0.8rem,3vw,1rem)] transition-all ${lang === 'UK' ? 'bg-[#FF6600] text-white shadow-[0_0_15px_rgba(255,102,0,0.4)]' : 'text-gray-500 hover:text-gray-300'}`}
              >
                UK (IN)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1.5 (NOUVEAU) : IDENTITÉ ASSURANCE */}
      <div className="mb-[5vh]">
        <h2 className="text-[clamp(1rem,4vw,1.2rem)] font-bold mb-[2vh] flex items-center tracking-widest text-gray-200">
          <span className="w-[4px] h-[1.2em] bg-[#FF6600] mr-[2vw]"></span>
          {t('profile_title')}
        </h2>

        <div className="bg-[#1A1A1A] rounded-2xl p-[3vh_4vw] border border-[#222] space-y-[2vh]">
          {/* Champ Nom */}
          <div>
            <label className="block text-gray-400 text-[clamp(0.7rem,2.5vw,0.9rem)] font-bold mb-[1vh] uppercase tracking-wider">
              {t('profile_fullname')}
            </label>
            <input 
              type="text" 
              value={profile.fullName}
              onChange={(e) => handleProfileChange('fullName', e.target.value)}
              placeholder="Ex: Nicolas Loesel"
              className="w-full bg-[#0A0A0A] border border-[#333] rounded-lg text-white p-[1.5vh_3vw] text-[clamp(0.8rem,3vw,1rem)] focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] outline-none transition-all placeholder:text-gray-600"
            />
          </div>

          {/* Champ Entreprise */}
          <div>
            <label className="block text-gray-400 text-[clamp(0.7rem,2.5vw,0.9rem)] font-bold mb-[1vh] uppercase tracking-wider">
              {t('profile_company')}
            </label>
            <input 
              type="text" 
              value={profile.company}
              onChange={(e) => handleProfileChange('company', e.target.value)}
              placeholder="Ex: Locate Systems EI"
              className="w-full bg-[#0A0A0A] border border-[#333] rounded-lg text-white p-[1.5vh_3vw] text-[clamp(0.8rem,3vw,1rem)] focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] outline-none transition-all placeholder:text-gray-600"
            />
          </div>

          {/* Champ Adresse */}
          <div>
            <label className="block text-gray-400 text-[clamp(0.7rem,2.5vw,0.9rem)] font-bold mb-[1vh] uppercase tracking-wider">
              {t('profile_address')}
            </label>
            <input 
              type="text" 
              value={profile.address}
              onChange={(e) => handleProfileChange('address', e.target.value)}
              placeholder="Ex: 209 rue Jacques Brel, 30730 FONS"
              className="w-full bg-[#0A0A0A] border border-[#333] rounded-lg text-white p-[1.5vh_3vw] text-[clamp(0.8rem,3vw,1rem)] focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] outline-none transition-all placeholder:text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2 : ACCÈS TOTAL & ABONNEMENTS */}
      <div className="mb-[5vh]">
        <h2 className="text-[clamp(1rem,4vw,1.2rem)] font-bold mb-[2vh] flex items-center tracking-widest text-gray-200">
          <span className="w-[4px] h-[1.2em] bg-[#FF6600] mr-[2vw]"></span>
          {t('tier_title')}
        </h2>
        <div className="bg-[#1A1A1A] rounded-2xl p-[2vh_4vw] border border-[#222]">
          <div className="flex items-center justify-between mb-[2vh]">
            <p className="text-[clamp(0.75rem,2.8vw,0.9rem)] text-gray-400">
              {t('tier_desc')}
            </p>
            <span className="text-[clamp(0.6rem,2vw,0.8rem)] bg-[#333] text-white px-[2vw] py-[0.5vh] rounded-full uppercase tracking-wider">
              Admin Mode
            </span>
          </div>
          
          <div className="flex bg-[#0A0A0A] rounded-lg p-[4px] justify-between">
            {(Object.keys(TIERS_CONFIG) as UserTier[]).map((tier) => (
              <button
                key={tier}
                onClick={() => setTier(tier)}
                className={`flex-1 mx-[1vw] py-[1.5vh] rounded-md font-black text-[clamp(0.7rem,2.5vw,0.9rem)] transition-all ${currentTier === tier ? 'bg-[#FF6600] text-white shadow-[0_0_15px_rgba(255,102,0,0.4)]' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3 : SÉCURITÉ & DONNÉES */}
      <div className="mb-[5vh]">
        <h2 className="text-[clamp(1rem,4vw,1.2rem)] font-bold mb-[2vh] flex items-center tracking-widest text-gray-200">
          <span className="w-[4px] h-[1.2em] bg-[#FF6600] mr-[2vw]"></span>
          {t('sec_title')}
        </h2>

        <div className="bg-[#121812] rounded-2xl p-[3vh_4vw] border border-[#2EA043]">
          <div className="flex items-center text-[#2EA043] font-black tracking-wide text-[clamp(0.8rem,3vw,1rem)] mb-[1.5vh]">
            <span className="w-[8px] h-[8px] rounded-full bg-[#2EA043] mr-[2vw] animate-pulse"></span>
            {t('sec_zero')}
          </div>
          <p className="text-gray-300 text-[clamp(0.8rem,3.5vw,1rem)] mb-[3vh] leading-relaxed">
            {t('sec_desc_1')} <strong className="text-white">{t('sec_desc_2')}</strong> {t('sec_desc_3')}
          </p>
          
          <div className="bg-[#0A0A0A] inline-block px-[4vw] py-[1.5vh] rounded-lg border border-[#222]">
            <span className="text-gray-400 text-[clamp(0.7rem,3vw,0.9rem)] tracking-wider">{t('sec_vol')}</span>
            <span className="text-[#2EA043] font-bold text-[clamp(0.8rem,3vw,1rem)]">{storageUsed} Mo</span>
          </div>
        </div>
      </div>

      {/* SECTION 4 : LÉGAL (CGU / CGV / Confidentialité) */}
      <div className="mt-auto">
        <div className="flex items-start gap-[3vw] bg-[#1A1A1A] p-[2vh_4vw] rounded-xl border border-[#333]">
          <input
            type="checkbox"
            checked={settings.acceptedTerms || false}
            onChange={(e) => updateSettings({ acceptedTerms: e.target.checked })}
            className="mt-[0.5vh] shrink-0 w-[clamp(20px,5vw,24px)] h-[clamp(20px,5vw,24px)] accent-[#FF6600] cursor-pointer"
          />
          <div className="text-[clamp(0.8rem,3vw,1rem)] text-gray-400 leading-snug">
            {t('legal_agree')} <button onClick={() => setShowPrivacy(true)} className="text-[#FF6600] underline decoration-[#FF6600] underline-offset-2 hover:text-white transition-colors text-left">{t('legal_link')}</button>.
          </div>
        </div>
      </div>

    </div>
  );
};

export default SettingsPage;
```

// ==========================================
// 📂 FICHIER : \src\modules\home\views\ValidationSas.tsx
// ==========================================

```tsx
import React, { useState } from 'react';

// 1. Définition stricte du format renvoyé par l'IA Gemini
export interface AIScanResult {
  typography?: string;
  brandColor?: string;
  categorie_id?: string;
  confidence?: number; // <-- C'est LE mot que Gemini utilise
  etat?: string;
  description?: string;
  label?: string;
  isConsumable?: boolean;
  consumableLevel?: number;
  imageUrl?: string;
}

interface ValidationSasProps {
  pendingItems: AIScanResult[];
  onValidateAll: (items: AIScanResult[]) => void;
  onRejectAll: () => void;
}

const ValidationSas: React.FC<ValidationSasProps> = ({ pendingItems, onValidateAll, onRejectAll }) => {
  const [itemsToValidate, setItemsToValidate] = useState<AIScanResult[]>(pendingItems);

  const handleRemoveItem = (index: number) => {
    setItemsToValidate(prev => prev.filter((_, i) => i !== index));
  };

  if (itemsToValidate.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-[5vw] text-center gap-[2vh]">
        <h2 className="text-[#FF6600] font-black uppercase tracking-widest text-[clamp(1rem,4vw,1.5rem)]">Scan Vide</h2>
        <p className="text-white/70 text-[clamp(0.8rem,2.5vw,1rem)]">Aucun outil détecté ou validé.</p>
        <button onClick={onRejectAll} className="mt-[4vh] bg-[#333333] text-white px-[6vw] py-[1.5vh] rounded-md font-bold uppercase tracking-wide">
          Retour au Hub
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#121212] px-[5vw] pt-[2vh] pb-[calc(2vh+env(safe-area-inset-bottom))]">
      
      {/* HEADER DU SAS */}
      <div className="flex flex-col mb-[3vh]">
        <h2 className="text-white font-black uppercase tracking-widest text-[clamp(1.2rem,5vw,1.8rem)]">
          SAS DE VALIDATION <span className="text-[#FF6600]">(01 C1)</span>
        </h2>
        <p className="text-white/60 text-[clamp(0.7rem,2.5vw,0.9rem)] italic mt-[0.5vh]">
          Vérification métier requise avant injection base de données.
        </p>
      </div>

      {/* LISTE DES OUTILS DÉTECTÉS */}
      <div className="flex-1 overflow-y-auto space-y-[2vh] pr-[1vw]">
        {itemsToValidate.map((item, index) => {
         // On utilise 'confidence' (ex: 0.95) qu'on multiplie par 100
          const score = item.confidence ? Math.round(item.confidence * 100) : 0;
          const scoreColor = score >= 90 ? 'text-green-500' : score >= 70 ? 'text-[#FF6600]' : 'text-red-500';

          return (
            <div key={index} className="bg-[#1E1E1E] border border-white/10 p-[3vw] rounded-lg flex flex-col relative">
              
              <button 
                onClick={() => handleRemoveItem(index)}
                className="absolute top-[2vw] right-[2vw] text-white/40 hover:text-red-500 font-bold text-[clamp(1rem,4vw,1.5rem)] leading-none"
              >
                ×
              </button>

              <div className="flex justify-between items-start pr-[6vw]">
                <div>
                  <h3 className="text-white font-bold text-[clamp(0.9rem,3.5vw,1.2rem)]">{item.label || item.typography || 'Outil Inconnu'}</h3>
                  <p className="text-white/60 uppercase tracking-widest text-[clamp(0.6rem,2vw,0.8rem)] mt-[0.5vh]">
                    {item.brandColor || 'Marque N/A'}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`font-black text-[clamp(1.2rem,5vw,1.8rem)] ${scoreColor}`}>
                    {score}%
                  </span>
                  <span className="text-white/40 text-[clamp(0.5rem,1.5vw,0.6rem)] uppercase tracking-widest">
                    Confiance
                  </span>
                </div>
              </div>

              {item.description && (
                <div className="mt-[2vh] p-[2vw] bg-[#121212] rounded border border-white/5">
                  <p className="text-white/70 italic text-[clamp(0.7rem,2vw,0.85rem)] leading-snug">
                    " {item.description} "
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* THUMB ZONE : ACTIONS GLOBALES */}
      <div className="mt-auto pt-[2vh] flex justify-between gap-[3vw]">
        <button 
          onClick={onRejectAll}
          className="flex-1 bg-[#333333] active:bg-[#444] text-white py-[2vh] rounded-md font-black uppercase tracking-widest text-[clamp(0.8rem,3vw,1rem)] transition-colors"
        >
          Rejeter
        </button>
        <button 
          onClick={() => onValidateAll(itemsToValidate)}
          className="flex-[2] bg-[#FF6600] active:bg-[#e65c00] text-white py-[2vh] rounded-md font-black uppercase tracking-widest text-[clamp(0.8rem,3vw,1rem)] shadow-[0_0_15px_rgba(255,102,0,0.3)] transition-colors"
        >
          Valider & Ranger
        </button>
      </div>

    </div>
  );
};

export default ValidationSas;
```

// ==========================================
// 📂 FICHIER : \src\types\index.ts
// ==========================================

```tsx
/**
 * LOCATEHOME - Source de Vérité Unique (V1.4)
 * Toute modification de ce schéma doit être validée par l'Architecte.
 */

export interface Category {
  id: string;
  label: string;
  iconName: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  { id: 'electro', label: 'Outillage Électroportatif', iconName: 'Zap', description: 'Perceuse, visseuse, meuleuse...' },
  { id: 'main', label: 'Outillage à main', iconName: 'Hammer', description: 'Marteaux, scies, niveaux...' },
  { id: 'serrage', label: 'Serrage et Clés', iconName: 'Wrench', description: 'Clés, pinces, serre-joints...' },
  { id: 'quinc', label: 'Quincaillerie', iconName: 'Nut', description: 'Vis, clous, boulons...' },
  { id: 'elec', label: 'Électricité', iconName: 'Lightbulb', description: 'Multimètres, câbles, ampoules...' },
  { id: 'peinture', label: 'Peinture et Finition', iconName: 'Paintbrush', description: 'Pinceaux, rouleaux, enduits...' },
  { id: 'mesure', label: 'Mesure et Traçage', iconName: 'Ruler', description: 'Mètres, lasers, équerres...' },
  { id: 'jardin', label: 'Jardin et Extérieur', iconName: 'Leaf', description: 'Sécateurs, taille-haie, gants...' },
  { id: 'epi', label: 'Protection & EPI', iconName: 'Shield', description: 'Gants, lunettes, masques, casques...' },
];

export interface Location {
  id: string;
  label: string;
  iconName: string;
  description?: string;
};

export interface InventoryItem {
  id: string;
  toolName: string;
  location: string;
  category: string;
  sku?: string;
  safetyStatus?: string;
  imageUrl?: string;
  date: string;
  confidence?: number; // <--- Ajout de la propriété manquante (optionnelle avec ?)
  price?: number;           // Valeur estimée de remplacement
  serialNumber?: string;    // Numéro de série (S/N)
  condition?: string;       // État : Neuf, Usagé, etc.
  isConsumable?: boolean;   // Détermine si l'objet est un consommable (vis, mastic...)
  consumableLevel?: number; // Jauge de remplissage stricte de 0 à 100 (Entier pur)
}

// Alias de compatibilité pour les anciens fichiers (à supprimer en V2.0)
export type ToolMemory = InventoryItem;

// --- EXTENSION LOCATE GARAGE (M5) ---

export type DiagnosticMode = 'maintenance' | 'mecanique';

export interface J1939DTC {
  spn: number; // Suspect Parameter Number
  fmi: number; // Failure Mode Identifier (3, 4, 5...)
  label: string;
}

export interface MetalThermalProfile {
  zone: 1 | 2 | 3 | 4 | 5;
  colorName: string;
  tempCelsius: number;
  isCritical: boolean;
  instruction: string;
}

export const METAL_ZONES: Record<number, MetalThermalProfile> = {
  1: { zone: 1, colorName: "Jaune Paille", tempCelsius: 220, isCritical: false, instruction: "Dureté max, attention au glaçage." },
  4: { zone: 4, colorName: "Bleu", tempCelsius: 295, isCritical: true, instruction: "DANGER : Acier détrempé. Remplacement obligatoire." },
  5: { zone: 5, colorName: "Gris", tempCelsius: 350, isCritical: true, instruction: "DESTRUCTION : Structure compromise." }
};
```
