# 🧠 CONTEXTE CODE SOURCE LOCATE
> 📅 Archive générée le : 15/03/2026 14:56:09


// ==========================================
// 📂 FICHIER : \src\App.tsx
// ==========================================

```tsx
import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import type { InventoryItem } from './types';
import { useUserTier } from './core/security/useUserTier';

// IMPORTS SUPABASE & AUTH
import AuthShield from './core/ui/AuthShield';
import { supabase } from './core/security/supabaseClient';

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
import GarageDashboard from './modules/garage/views/GarageDashboard';
import KitchenDashboard from './modules/kitchen/views/KitchenDashboard';

type ViewState = 'hub' | 'home' | 'garage' | 'kitchen' | 'inventory' | 'scanner' | 'search' | 'settings' | 'category_detail' | 'validation' | 'tool_detail';

const App = () => {
  // ÉTATS D'AUTHENTIFICATION
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // ROUTAGE INTELLIGENT : Hub pour l'Admin (PRO), Accueil direct pour les utilisateurs standards
  const [view, setView] = useState<ViewState>(() => {
    const savedTier = localStorage.getItem('locate_user_tier');
    return (savedTier === 'FREE' || savedTier === 'PREMIUM') ? 'home' : 'hub';
  });

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<InventoryItem | null>(null);
  const [pendingItems, setPendingItems] = useState<AIScanResult[]>([]);
  const { currentTier } = useUserTier();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      window.history.replaceState({}, document.title, window.location.pathname);
      // On affiche juste un message. Le Webhook a déjà mis à jour la BDD en coulisse !
      alert("✅ Paiement validé ! Bienvenue dans l'univers LOCATE PREMIUM. Veuillez rafraîchir la page si vos droits ne sont pas encore actifs.");
    }
    // --------------------------------------------------

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setIsAuthChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // CHARGEMENT DE LA BASE DE DONNEES LOCALE
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
      toolName: item.label || item.typography || 'Outil Inconnu',
      brand: item.brand || item.brandColor || 'Marque N/A', // On garde brandColor en secours pour les anciens scans en cache
      category: item.categorie_id || 'main',
      location: item.location || 'Atelier',
      condition: item.etat || 'Bon état',
      notes: item.description || '',
      isConsumable: item.isConsumable,
      consumableLevel: item.consumableLevel,
      confidence: item.confidence ? item.confidence : undefined,
      imageUrl: item.imageUrl
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

  // 🛡️ BOUCLIERS D'AUTHENTIFICATION
  if (isAuthChecking) {
    return (
      <div className="w-screen h-[100dvh] bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-black border-t-[#FF6600] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthShield onSuccess={() => setIsAuthenticated(true)} />;
  }

  // 🖥️ AFFICHAGE NORMAL DE L'APP
  return (
    <main className="w-screen min-h-[100dvh] bg-[#121212] text-white font-sans pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] overflow-hidden relative">

      {view !== 'hub' && (
        <header className="fixed top-0 left-0 w-full h-[12.5vh] min-h-[70px] bg-[#121212] z-[100] border-b-2 border-[#D3D3D3]">
          <Logo activeModule={currentModule as any} />
        </header>
      )}

      <div className={view !== 'hub' ? 'pt-[12.5vh] h-full flex flex-col' : 'h-full flex flex-col'}>
        
        {/* CORRECTION DU ROUTAGE HUB AVEC INJECTION DU TIER */}
        {view === 'hub' && <Hub onSelectModule={(m: string) => setView(m as ViewState)} userTier={currentTier} />}
        
        {view === 'home' && <HomeMenu onNavigate={setView} tier={currentTier} />}
        {view === 'garage' && <GarageDashboard onBack={() => setView('hub')} />}
        {view === 'kitchen' && <KitchenDashboard onBack={() => setView('hub')} />}

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
            onDelete={deleteTool}
          />
        )}

        {view === 'tool_detail' && selectedTool && (
          <ToolDetail 
            tool={selectedTool} 
            onBack={() => setView('category_detail')} 
            onUpdate={handleUpdateTool}
            onDelete={() => deleteTool(selectedTool.id)}
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
// 📂 FICHIER : \src\core\ai\expertisemetier\kitchen.ts
// ==========================================

```tsx
/**
 * LOCATE KITCHEN - RÉFÉRENTIEL D'EXPERTISE CULINAIRE (M4)
 * Source : "Bible HACCP & Sécurité Alimentaire"
 * Normes : PMS (Plan de Maîtrise Sanitaire), Traçabilité, DLC/DDM
 */

export const KITCHEN_M4_RULES = {
  // 1. SAFETY GATES (VETO IA - PRIORITÉ ABSOLUE HYGIÈNE)
  safety_veto: {
    dlc_depassee: "Date Limite de Consommation (DLC) dépassée : Alerte CRITIQUE. Retrait immédiat de la consommation humaine. Blocage de l'utilisation.",
    chaine_du_froid: "Rupture de la chaîne du froid détectée (ex: givre de décongélation, emballage gonflé) : Veto sur l'utilisation.",
    contamination_croisee: "Détection de stockage mixte cru/cuit non isolé : Alerte MAJEURE HACCP."
  },

  // 2. PROTOCOLE D'ANALYSE VISUELLE HACCP
  haccp_logic: {
    marche_en_avant: "Analyse des flux : Le propre et le sale ne doivent jamais se croiser.",
    planche_a_decouper_codes: {
      rouge: "Viande crue",
      bleu: "Poissons et crustacés crus",
      jaune: "Volailles crues",
      vert: "Légumes et fruits",
      blanc: "Pains, fromages, pâtisseries",
      marron: "Viandes cuites"
    },
    etiquetage: "Présence obligatoire de l'étiquette de traçabilité (Date d'ouverture, DLC secondaire, numéro de lot) sur tout contenant entamé ou reconditionné."
  },

  // 3. GESTION DES STOCKS & PÉRISSABLES
  stock_management: {
    fifo: "First In, First Out (Premier entré, premier sorti). Les dates les plus courtes doivent être utilisées en priorité.",
    feFo: "First Expired, First Out. Base de la rotation des stocks périssables."
  },

  // 4. CLAUSES ANTI-HALLUCINATION CULINAIRE
  anti_hallucination: {
    regle_1_fraicheur: "INTERDICTION STRICTE de garantir la fraîcheur bactériologique d'un produit sur une simple photo. L'analyse visuelle ne remplace pas les prélèvements de surface ou d'échantillons.",
    regle_2_incertitude_date: "Si l'étiquette de DLC/DDM est illisible, l'IA DOIT classer le produit en 'Alerte Traçabilité - Date Inconnue'."
  }
};
```

// ==========================================
// 📂 FICHIER : \src\core\ai\expertisemetier\maintenance.ts
// ==========================================

```tsx
/**
 * LOCATE GARAGE - RÉFÉRENTIEL MAINTENANCE INDUSTRIELLE (M5)
 * Source : "Bible Maintenance 5.0"
 * Normes : OSA/CBM, AFNOR, LOTO, GD&T
 */

export const MAINTENANCE_M5_RULES = {
  // 1. SAFETY GATES (VETO IA - PRIORITÉ ABSOLUE)
  safety_veto: {
    loto: "Consignation (Lockout-Tagout) : Validation visuelle ou vocale de la coupure des énergies obligatoire avant action.",
    vat: "Vérification d'Absence de Tension (VAT) exigée avant lecture de schémas de puissance ou ouverture d'armoire.",
    espaces_confines: "Risque Gaz (H2S) : Exiger le port du détecteur 4 gaz et des EPI respiratoires."
  },

  // 2. MÉTHODOLOGIE DE DIAGNOSTIC (ENTONNOIR)
  diagnostic_logic: {
    approche: "AMDEC, QQOQCCP, Ishikawa. Toujours isoler le composant racine en allant du test le plus simple/visuel au plus intrusif/complexe. Interdiction de deviner.",
    afnor_levels: {
      1: "Réglages simples, vérifications visuelles.",
      2: "Dépannages par échange standard (Technicien habilité).",
      3: "Identification origines de pannes complexes, échanges de composants.",
      4: "Travaux importants, révisions complètes en atelier.",
      5: "Rénovation, reconstruction."
    }
  },

  // 3. ANALYSE SENSORIELLE MULTIMODALE (OSA/CBM)
  multimodal_analysis: {
    acoustic: "Détection de fuites (air, eau, gaz) et usure de roulements (ultrasons).",
    vibration: "Défauts d'alignement, balourd sur machines tournantes.",
    vision_hdr: "Corrosion, fuites externes, détection de corps étrangers, état de surface.",
    thermography: "Points chauds électriques, mauvais raccordements, frottements anormaux."
  },

  // 4. LECTURE TECHNIQUE ET PLANS
  technical_reading: {
    electrical: "Analyse unifilaire, multifilaire, cartes automates (API). Identifier la nomenclature, les références croisées et les borniers.",
    mechanical: "Tolérancement géométrique (GD&T - ISO 1101). Le 3D est insuffisant : exiger le 2D pour la rugosité (ex: Ra 3.2) et les tolérances."
  },

  // 5. EXPERTISE MÉTALLURGIQUE (COLORIMÉTRIE THERMIQUE)
  metallurgy_thermal: {
    zone_1: { color: "Jaune Paille", temp: "220°C", instruction: "Dureté max, attention au glaçage (plateau presseur)." },
    zone_4: { color: "Bleu", temp: "295°C", instruction: "DANGER : Acier détrempé. Surchauffe extrême. Remplacement obligatoire." },
    zone_5: { color: "Gris", temp: ">350°C", instruction: "DESTRUCTION : Structure compromise. Remplacement immédiat." }
  },

  // 6. PIPELINE GMAO & INDICATEURS (KPI)
  gmao_kpi: {
    mtbf: "Mean Time Between Failures (Fiabilité).",
    mttr: "Mean Time To Repair (Maintenabilité).",
    trs: "Taux de Rendement Synthétique (Disponibilité x Performance x Qualité)."
  }
};
```

// ==========================================
// 📂 FICHIER : \src\core\ai\expertisemetier\mecanique.ts
// ==========================================

```tsx
/**
 * LOCATE GARAGE - RÉFÉRENTIEL MÉCANIQUE VL / PL (M5)
 * Version : V20 (Mise à jour Live Diagnostic)
 * Vision : "L'IA est le Chef d'Atelier embarqué"
 */

export const GARAGE_M5_RULES = {
  // 1. PROTOCOLE DE COMMUNICATION (STRICT)
  comm_logic: {
    format: "Étape [X] : Fais [Action]. Dis 'Fait' quand c'est terminé.",
    style: "Zéro phrase de courtoisie. Va à l'essentiel.",
    isolation_doute: "Aucune extrapolation. Si vidéo floue ou audio saturé, ordonne : 'Visuel non conforme. Nettoie la lentille.'"
  },

  // 2. SAFETY GATES (VETO IA - PRIORITÉ 0)
  safety_veto: {
    levage: "Interdiction d'intervenir sous maintien hydraulique seul. Confirmation visuelle OBLIGATOIRE des chandelles ou béquilles mécaniques.",
    ve_hvb: "Si tension > 60V DC / 25V AC : Affichage visuel habilitation (B1VL/B2VL/BCL) et port gants isolants (Classe 0) avec sur-gants cuir EXIGÉS.",
    hydraulique: "Consignation de la Prise de Mouvement (PTO) obligatoire avant intervention sur flexibles."
  },

  // 3. DIAGNOSTIC J1939 (BUS CAN PL) & MULTIMÈTRE
  j1939_logic: {
    fmi_codes: {
      0: "Surcharge/Surchauffe (Valeur au-dessus plage normale). Effectuer contrôle physique.",
      1: "Manque/Fuite (Valeur en dessous plage normale). Effectuer contrôle physique.",
      3: "Court-circuit au +Vcc (Tension mesurée ≈ Vbat).",
      4: "Court-circuit à la masse (Tension mesurée ≈ 0V sur ligne signal).",
      5: "Circuit ouvert (Résistance = ∞, inspecter broches ou fil coupé)."
    }
  },

  // 4. STANDARDS UTAC (FREINAGE PNEUMATIQUE)
  utac_braking: {
    target_pressure: "7.2 à 8.1 bars (Régulation dessiccateur).",
    min_test_pressure: "6.2 à 6.9 bars (Pression d'essai réglementaire).",
    test_epuisabilite: "Validation de 4 coups de pédale minimum après alarme."
  },

  // 5. COUPLES DE SERRAGE (SÉCURITÉ LIAISON AU SOL)
  torque_specs: {
    volvo_fh_fm: "610 Nm (Serrage en croix à sec)",
    scania_mercedes_daf: "600 Nm (Serrage en croix à sec)",
    renault_t: "450-500 Nm (Serrage en croix à sec)",
    post_service: "Alerte IA OBLIGATOIRE : Planifier un resserrage à 100 km dans la GMAO."
  },

  // 6. EXPERTISE MÉTALLURGIQUE (ANALYSE THERMIQUE & REVENU ACIER)
  thermal_analysis: {
    zone_1: { color: "Jaune Paille", temp: "220°C", status: "Dureté Max / Cassant. Si pièce de friction : début de glaçage thermique détecté." },
    zone_2: { color: "Jaune Foncé", temp: "260°C", status: "Bon équilibre dureté/ténacité." },
    zone_3: { color: "Violet/Pourpre", temp: "285°C", status: "Début de perte de dureté." },
    zone_4: { color: "Bleu", temp: "290°C+", status: "DANGER : Acier détrempé. Surchauffe extrême. Remplacement OBLIGATOIRE (Perte résistance structurelle)." },
    zone_5: { color: "Gris", temp: ">350°C", status: "CRITIQUE : Destruction thermique. Remplacement immédiat." },
    hydraulique_tactile: {
      "40C": "Forte fièvre",
      "50C": "Main se réchauffe, transpiration",
      "60C": "Tolérable 10s. Si > 60°C anormalement : contrôler limiteur de pression.",
      "70C": "Tolérable 3s",
      "80C": "Douleur aiguë / Risque de brûlure. EPI Gants Obligatoires."
    }
  },

  // 7. AUDIO SPECTRAL (SIGNATURES)
  acoustic_signatures: {
    claquement: "Injecteur / Embiellage / Distribution",
    sifflement: "Fuite air (EBS/Pneumatique) / Turbo",
    graviers: "Cavitation pompe hydraulique"
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
import { KITCHEN_M4_RULES } from './expertisemetier/kitchen';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

// --- PROMPT SYSTEME DYNAMIQUE HOME & KITCHEN ---
const getSystemPrompt = (userLocation: string, rulesContext: string, categoriesContext: string, module: 'HOME' | 'KITCHEN' = 'HOME') => {
  const brandInstruction = module === 'HOME' ? 'Marque exacte SEULE. DÉDUIRE OBLIGATOIREMENT la marque via couleurs/formes/design si le texte est flou (ex: Bleu/Rouge = Bosch/Milwaukee).' : 'Marque ou Origine';
  const typeInstruction = module === 'HOME' ? 'Nom générique usuel (ex: perceuse, meuleuse, niveau laser)' : 'Famille de produit';
  const morphInstruction = module === 'HOME' ? 'Type d outil détaillé' : 'Type de denree ou objet';
  const zoomInstruction = module === 'HOME' ? 'Detail technique (ex: 12V, 18V, filaire, batterie)' : 'Etat de fraicheur ou detail HACCP';
  const typoInstruction = module === 'HOME' ? 'Modèle ou Gamme. DÉDUIRE via design si plaque illisible (ex: Bosch Professional, gamme M18). Écrire Inconnu uniquement si impossible.' : 'DLC DDM ou SKU';
  const consumableInstruction = module === 'KITCHEN' ? 'true' : 'true si vis, clou, joint, foret, colle. false sinon.';
  
  return `
Tu es l Expert Vision ${module === 'HOME' ? 'Industrielle' : 'Culinaire HACCP'} du système LOCATE. 
Localisation de l analyse : ${userLocation}.
Ton rôle est d analyser les images/vidéos en appliquant STRICTEMENT le protocole d expertise fourni.

VOICI TON RÉFÉRENTIEL D EXPERTISE MÉTIER OBLIGATOIRE :
${rulesContext}

CATÉGORIES AUTORISÉES (Utilise uniquement ces ID) :
${categoriesContext}

RÈGLE ABSOLUE : Tu dois retourner UNIQUEMENT un tableau JSON valide. Pas de texte avant, pas de markdown.

Chaque objet détecté doit suivre cette structure EXACTE :
[
  {
    "brand": "${brandInstruction}",
    "type": "${typeInstruction}",
    "morphology": "${morphInstruction}",
    "zoomDetail": "${zoomInstruction}",
    "typography": "${typoInstruction}",
    "confidence": 0.95,
    "categorie_id": "ID exact de la categorie",
    "etat": "Bon etat / Usage / Neuf / Perime",
    "description": "Justification metier courte",
    "isConsumable": "${consumableInstruction}",
    "consumableLevel": 100
  }
]
`;
};

export const geminiService = {
  analyzeVideoBurst: async (base64Images: string[], userLocation: string = "Atelier", module: 'HOME' | 'KITCHEN' = 'HOME'): Promise<any[]> => {
    if (!apiKey) return [];
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const categoriesContext = CATEGORIES.map(cat => `- ID: "${cat.id}" | Label: ${cat.label}`).join('\n');
      const rulesContext = JSON.stringify(module === 'KITCHEN' ? KITCHEN_M4_RULES : INDUSTRIAL_RULES, null, 2);

      const prompt = getSystemPrompt(userLocation, rulesContext, categoriesContext, module);
      
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

  analyzeVideo: async (videoBase64: string, userLocation: string = "Atelier", module: 'HOME' | 'KITCHEN' = 'HOME'): Promise<any[]> => {
    if (!apiKey) return [];
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const categoriesContext = CATEGORIES.map(cat => `- ID: "${cat.id}" | Label: ${cat.label}`).join('\n');
      const rulesContext = JSON.stringify(module === 'KITCHEN' ? KITCHEN_M4_RULES : INDUSTRIAL_RULES, null, 2);

      const prompt = getSystemPrompt(userLocation, rulesContext, categoriesContext, module);

      const videoPart = {
        inlineData: { data: videoBase64.split(',')[1], mimeType: "video/webm" }
      };

      const result = await model.generateContent([prompt, videoPart]);
      return JSON.parse(result.response.text());
    } catch (error) { 
      console.error("Erreur Gemini (Video):", error);
      return []; 
    }
  },

  // --- FONCTION SPÉCIALISÉE POUR L'ANALYSE FOD ---
  analyzeServanteFOD: async (base64Images: string[], servanteId: string = "INCONNU"): Promise<{status: string, tags: string[], justification: string} | null> => {
    if (!apiKey) {
      console.error("Clé API Gemini introuvable.");
      return null;
    }

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `
Tu es l'Expert Vision Industrielle du protocole FOD (Foreign Object Debris) du système LOCATE M5.
Tu vas analyser ${base64Images.length} clichés consécutifs représentant les tiroirs et le plateau de la servante d'atelier "${servanteId}".

RÈGLE D'ANALYSE (LE STANDARD 5S ET LES MOUSSES BICOLORES) :
- Les tiroirs possèdent des mousses de rangement bicolores (ex: noir en surface, rouge ou couleur vive au fond).
- ATTENTION AUX FAUX POSITIFS : Il est normal de voir de petites zones rouges autour des outils présents (ce sont les encoches de préhension pour les doigts). Ignore ces petites zones.
- LA VRAIE ANOMALIE : Tu dois chercher les "trous complets" (une empreinte d'outil entièrement vide laissant apparaître la silhouette complète de l'outil dans la couleur de fond).
- Outils en vrac : détecte les zones de "Rangement chaos" où les outils ne sont pas dans leurs empreintes, ou si le plateau supérieur est encombré de pièces non rangées.

INSTRUCTION DE SORTIE :
Tu dois retourner UNIQUEMENT un objet JSON valide suivant cette structure EXACTE :
{
  "status": "CONFORME" | "DEGRADE",
  "tags": [],
  "justification": ""
}

Logique de remplissage :
- Si AUCUN trou complet n'est visible et que le plateau est propre -> "status": "CONFORME", "tags": [], "justification": "Contrôle visuel OK. Mousses pleines, aucune anomalie détectée."
- Si au moins UNE empreinte est totalement vide ou qu'un tiroir/plateau est en vrac -> "status": "DEGRADE". 
  - Dans "tags", inclus les motifs pertinents : ["Outil manquant", "Rangement chaos", "Outil mal placé"].
  - Dans "justification", sois descriptif. Ex: "Tiroir 02 : Empreinte de pince vide visible au centre. Tiroir 04 : Clés plates en vrac."
`;

      const imageParts = base64Images.map(base64 => ({
        inlineData: { data: base64.split(',')[1], mimeType: "image/jpeg" }
      }));

      const result = await model.generateContent([prompt, ...imageParts]);
      return JSON.parse(result.response.text());
      
    } catch (error) {
      console.error("Erreur Gemini (Analyse FOD):", error);
      return null;
    }
  },

  // --- FONCTION SPÉCIALISÉE : LECTURE DU PASSEPORT SÉCURITÉ ---
  analyzePasseportSecurite: async (base64Image: string): Promise<{fullName: string, company: string, techId: string, habilitations: string[]} | null> => {
    if (!apiKey) {
      console.error("Clé API Gemini introuvable.");
      return null;
    }

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `
Tu es l'Expert de Conformité et Sécurité du système LOCATE M5.
Analyse cette photo qui représente un passeport sécurité, une carte d'habilitation électrique, un CACES ou un badge professionnel.

INSTRUCTION DE SORTIE :
Tu dois retourner UNIQUEMENT un objet JSON valide suivant cette structure EXACTE :
{
  "fullName": "Nom et Prénom du technicien",
  "company": "Nom de l'entreprise ou de l'employeur (si visible, sinon vide)",
  "techId": "Numéro de matricule, numéro de titre ou identifiant (si visible, sinon vide)",
  "habilitations": ["Liste", "des", "habilitations", "visibles", "ex: BR, B0, CACES R489, H1V..."]
}

Règles : 
- Cherche minutieusement les symboles d'habilitation électrique française (B0, B1V, BR, BC, H0, etc.).
- Ne retourne pas de Markdown, uniquement le JSON brut.
`;

      const imagePart = {
        inlineData: { data: base64Image.split(',')[1], mimeType: "image/jpeg" }
      };

      const result = await model.generateContent([prompt, imagePart]);
      return JSON.parse(result.response.text());
      
    } catch (error) {
      console.error("Erreur Gemini (Analyse Passeport):", error);
      return null;
    }
  },

  // --- FONCTION SPÉCIALISÉE : PRÉPARATION DE CHANTIER (M5) ---
  generateChantierPrep: async (intervention: string, inventoryStr: string): Promise<any | null> => {
    if (!apiKey) return null;

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `
Tu es l'Expert de Préparation de Chantier M5 (Maintenance Industrielle et Mécanique).
Le technicien va réaliser l'intervention suivante : "${intervention}".

Voici la liste des outils dont il dispose actuellement dans son inventaire (séparés par des virgules) : 
[${inventoryStr}]

Génère une fiche de préparation complète et sécurisée.
RÈGLE ABSOLUE : Tu dois retourner UNIQUEMENT un objet JSON valide suivant cette structure EXACTE :
{
  "titre": "Titre reformulé et professionnel de l'intervention",
  "analyseRisques": ["Risque 1", "Risque 2", "Risque 3"],
  "epiRequis": ["EPI 1", "EPI 2"],
  "outillageRecommande": [
    { "nom": "Nom de l'outil", "possede": true (si présent dans l'inventaire) ou false (s'il ne l'a pas) }
  ],
  "piecesRechange": ["Pièce 1", "Pièce 2 (Consommables probables)"]
}
`;
      const result = await model.generateContent([prompt]);
      return JSON.parse(result.response.text());
    } catch (error) {
      console.error("Erreur Gemini (Préparation Chantier):", error);
      return null;
    }
  }
};
```

// ==========================================
// 📂 FICHIER : \src\core\ai\liveService.ts
// ==========================================

```tsx
/**
 * LOCATE SYSTEMS - LIVE ASSISTANT SERVICE (V2.1 - JSON Schema Forcé)
 * Architecture : REST Multimodal (Gemini 2.5 Flash)
 * Standard : OSA/CBM, OBD-II, J1939 & RGPD Zéro-Trace
 */

import { GARAGE_M5_RULES } from './expertisemetier/mecanique';
import { MAINTENANCE_M5_RULES } from './expertisemetier/maintenance';

export interface LiveDiagnostic {
  hypothesis: string;
  confidence: number;
  nextStep: string;
  safetyAlert?: string;
}

class LiveService {
  private apiKey: string = "";
  private systemInstruction: string = "";
  private latestFrame: string | null = null;
  private onMessageCallback: ((data: LiveDiagnostic) => void) | null = null;

  async connect(mode: 'maintenance' | 'mecanique', onMessage: (data: LiveDiagnostic) => void) {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_GENAI_API_KEY || "";
    
    if (!this.apiKey) {
      console.error("Clé d'API manquante. Vérifiez le fichier .env.");
      throw new Error("Impossible d'établir le tunnel sécurisé.");
    }

    this.onMessageCallback = onMessage;

    let role = mode === 'mecanique' ? "Expert Mécanique Auto & Poids Lourds" : "Expert Maintenance Industrielle";
    let rulesContext = mode === 'mecanique' ? JSON.stringify(GARAGE_M5_RULES) : JSON.stringify(MAINTENANCE_M5_RULES);

    this.systemInstruction = `
      Tu es l'${role} du système LOCATE. Mode actif : ${mode.toUpperCase()}.
      
      VOICI TA BIBLE MÉTIER STRICTE :
      ${rulesContext}

      PROTOCOLE DE COMMUNICATION :
      - Zéro phrase de courtoisie. Va à l'essentiel.
      - Droit de veto absolu si une condition de sécurité manque (LOTO, VAT, etc.). Pose des questions pour valider ces étapes si le technicien ne l'a pas fait.
      - Ton objectif est de guider pas à pas.
    `;

    setTimeout(() => {
      console.log(`🔗 [EDGE MODE] Tunnel Asynchrone établi en mode : ${mode.toUpperCase()}`);
    }, 500);
  }

  sendVideoFrame(canvas: HTMLCanvasElement) {
    this.latestFrame = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
  }

  async sendPrompt(text: string) {
    if (!this.onMessageCallback) return;

    console.log(`🚀 [EDGE MODE] Transmission en cours... Texte : "${text}"`);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;
      
      const parts: any[] = [{ text: text }];
      
      if (this.latestFrame) {
        console.log("📸 [EDGE MODE] Image bionique jointe à la transmission.");
        parts.push({
          inlineData: { mimeType: "image/jpeg", data: this.latestFrame }
        });
        this.latestFrame = null; 
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: this.systemInstruction }] },
          contents: [{ role: "user", parts: parts }],
          generationConfig: { 
            responseMimeType: "application/json",
            // L'ARME ABSOLUE : ON FORCE L'IA À UTILISER EXACTEMENT CES VARIABLES
            responseSchema: {
              type: "OBJECT",
              properties: {
                hypothesis: { 
                  type: "STRING", 
                  description: "Ta réponse verbale, ton diagnostic ou ta question directe au technicien." 
                },
                confidence: { 
                  type: "NUMBER", 
                  description: "Ton niveau de certitude technique sous forme de nombre (ex: 0.95)." 
                },
                nextStep: { 
                  type: "STRING", 
                  description: "L'action physique que le technicien doit accomplir ensuite." 
                },
                safetyAlert: { 
                  type: "STRING", 
                  description: "Une alerte de danger immédiat. Laisse vide s'il n'y a pas de danger." 
                }
              },
              required: ["hypothesis", "confidence", "nextStep"]
            }
          }
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      const textResponse = data.candidates[0].content.parts[0].text;
      console.log("✅ [EDGE MODE] Réponse brute de l'IA :", textResponse);
      
      const parsedData = JSON.parse(textResponse);
      
      // FILET DE SÉCURITÉ : Au cas où l'IA trébuche, on ne fait pas crasher l'UI
      const finalData: LiveDiagnostic = {
        hypothesis: parsedData.hypothesis || "Action confirmée.",
        confidence: parsedData.confidence !== undefined ? parsedData.confidence : 0.99,
        nextStep: parsedData.nextStep || "-",
        safetyAlert: parsedData.safetyAlert || undefined
      };

      this.onMessageCallback(finalData);

    } catch (error) {
      console.error("💥 [EDGE MODE] Erreur de transmission :", error);
      this.onMessageCallback({
        hypothesis: "Erreur de transmission réseau. Répétez.",
        confidence: 0,
        nextStep: "Vérifier la connexion.",
        safetyAlert: "COMMUNICATION PERDUE"
      });
    }
  }

  terminate() {
    this.latestFrame = null;
    this.onMessageCallback = null;
    console.log("🔒 [ZÉRO-TRACE] Session terminée. Buffer mémoire purgé.");
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
// ==========================================
// 📂 FICHIER : \src\core\camera\Scanner.tsx
// ==========================================
import React, { useState, useRef, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import { geminiService } from '../ai/geminiService';
import { getCustomLocations } from '../../core/storage/memoryService';
import { validateLocateObject } from '../ai/decisionEngine';
import type { ScanResult } from '../ai/decisionEngine';
import { useUserTier } from '../security/useUserTier'; // <-- NOUVEAU : Cerveau de sécurité

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
  
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);
  const { currentTier } = useUserTier(); // <-- NOUVEAU
  
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

  useEffect(() => {
    get('locate_ai_consent').then((val) => {
      if (val === true) {
        setHasConsented(true);
        startCamera();
      } else {
        setHasConsented(false);
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
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8', videoBitsPerSecond: 1000000 });
    const chunks: Blob[] = [];
    const capturedFrames: string[] = []; // NOUVEAU : Tableau pour stocker nos 3 images clés

    setIsScanning(true);
    setRecordingTime(0);
    if (!flashOn) await toggleTorch();

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // NOUVEAU : On transmet nos frames capturées à l'analyseur
        runAnalysis(base64, false, capturedFrames);
      };
      reader.readAsDataURL(blob);
      if (flashOn) await toggleTorch();
      setIsScanning(false);
      setRecordingTime(0);
    };

    mediaRecorder.start();

    let timeElapsed = 0;
    const timerInterval = setInterval(() => {
      timeElapsed++;
      setRecordingTime(timeElapsed);

      // NOUVEAU : EXTRACTION SILENCIEUSE À 3s, 8s et 12s
      if (timeElapsed === 3 || timeElapsed === 8 || timeElapsed === 12) {
        if (videoRef.current) {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
          capturedFrames.push(canvas.toDataURL('image/jpeg', 0.8)); // Qualité 80%
        }
      }

      if (timeElapsed >= 15) {
        clearInterval(timerInterval);
        if (mediaRecorder.state === "recording") mediaRecorder.stop();
      }
    }, 1000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      if (file.size > 7 * 1024 * 1024) {
        alert("ERREUR ZÉRO-TRUST : L'image dépasse la limite stricte de 7 Mo.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => runAnalysis(reader.result as string, true);
      reader.readAsDataURL(file);
    } 
    else if (file.type.startsWith('video/')) {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.onloadedmetadata = () => {
        URL.revokeObjectURL(videoElement.src);
        if (videoElement.duration > 15) {
          alert("ERREUR ZÉRO-TRUST : La vidéo dépasse la limite stricte de 15 secondes.");
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => runAnalysis(reader.result as string, false);
        reader.readAsDataURL(file);
      };
      videoElement.src = URL.createObjectURL(file);
    }
  };

  // NOUVEAU : Ajout du paramètre fallbackImages
  const runAnalysis = async (data: string, isImage: boolean, fallbackImages: string[] = []) => {
    setIsAnalyzing(true);
    try {
      const rawResults = isImage 
        ? await geminiService.analyzeVideoBurst([data], selectedLocation)
        : await geminiService.analyzeVideo(data, selectedLocation);

      if (rawResults && rawResults.length > 0) {
        const certifiedItems = rawResults.map((item: any, index: number) => {
          const validation = validateLocateObject(item as ScanResult);
          
          // NOUVEAU : On attribue cycliquement l'une de nos 3 frames capturées à l'objet
          const fallbackImg = fallbackImages.length > 0 ? fallbackImages[index % fallbackImages.length] : undefined;

          return {
            ...item,
            _validationStatus: validation.status,
            _validationMessage: validation.message,
            label: validation.status === "CERTIFIED" ? validation.label : item.label,
            imageUrl: isImage ? data : fallbackImg, // <-- Si vidéo, on utilise la frame capturée
            location: selectedLocation
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
      
      {/* SAS LÉGAL - CONSENTEMENT IA OBLIGATOIRE */}
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
        <button onClick={onBack} className="w-14 h-14 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md flex items-center justify-center active:scale-90 shrink-0">
          <img src="/icon-return.png" alt="Retour" className="w-full h-full object-contain opacity-80" />
        </button>
        
        <div className="flex flex-col items-center">
          <h1 className="text-[6vw] sm:text-xl tracking-widest uppercase flex gap-2">
            <span className="font-bold text-white">LOCATE</span>
            <span className="font-black text-[#FF6600] drop-shadow-[0_0_10px_rgba(255,102,0,0.8)]">SCAN</span>
          </h1>
        </div>

        <button onClick={toggleTorch} className={`w-14 h-14 rounded-xl backdrop-blur-md flex items-center justify-center border transition-all active:scale-90 shrink-0 ${flashOn ? 'bg-[#FF6600]/20 border-[#FF6600] shadow-[0_0_15px_rgba(255,102,0,0.4)]' : 'bg-black/40 border-white/10'}`}>
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
        
        {/* NOUVEAU : VERROUILLAGE DES ZONES PREMIUM */}
        <div className="flex gap-[2vw] overflow-x-auto no-scrollbar w-full px-[2vw]">
          {getCustomLocations().map(loc => {
            const isLocked = currentTier === 'FREE' && (loc.id === 'chantier' || loc.id === 'pret');
            
            return (
              <button 
                key={loc.id} 
                onClick={() => {
                  if (isLocked) {
                    alert("🔒 La gestion des zones Chantier et Prêt est réservée aux membres PREMIUM.");
                    return;
                  }
                  setSelectedLocation(loc.label);
                }} 
                className={`whitespace-nowrap px-[4vw] py-[1vh] rounded-lg text-[2.5vw] sm:text-[10px] font-black border transition-all ${
                  isLocked 
                    ? 'bg-black/80 border-red-500/30 text-gray-500 opacity-60' 
                    : selectedLocation === loc.label 
                      ? 'bg-black border-[#FF6600] text-[#FF6600] shadow-[0_0_10px_rgba(255,102,0,0.3)]' 
                      : 'bg-black/50 border-white/10 text-white/40'
                }`}
              >
                {isLocked && <span className="mr-1">🔒</span>}
                {loc.label.toUpperCase()}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-end w-full px-[2vw]">
          <div className="flex flex-col items-center gap-[1vh] w-1/4">
            <button onClick={() => fileInputRef.current?.click()} className="w-14 h-14 bg-black/60 border border-white/10 rounded-full flex items-center justify-center active:scale-90 backdrop-blur shrink-0">
              <img src="/icon-import.png" className="w-[85%] h-[85%] object-contain" alt="Import" />
            </button>
            <span className="text-[2vw] sm:text-[8px] text-[#FF6600] font-bold uppercase tracking-widest text-center leading-tight">MAX 7MO<br/>/ 15S</span>
            <input type="file" ref={fileInputRef} onChange={handleImport} hidden accept="image/*,video/*" />
          </div>

          <div className="flex flex-col items-center gap-[1vh] w-1/4">
            <button onClick={handlePhotoClick} disabled={isScanning || isAnalyzing} className="w-14 h-14 bg-black/60 border border-white/10 rounded-2xl flex items-center justify-center active:scale-95 backdrop-blur shadow-[0_5px_20px_rgba(0,0,0,0.5)] shrink-0">
              <img src="/icon-photo.png" className="w-[100%] h-[100%] object-contain" alt="Photo" />
            </button>
            <span className="text-[2vw] sm:text-[8px] text-[#FF6600] font-bold uppercase tracking-widest">MAX 7MO</span>
          </div>

          <div className="flex flex-col items-center gap-[1vh] w-1/4">
            <button onClick={handleVideoRecord} disabled={isScanning || isAnalyzing} className={`w-14 h-14 bg-black/60 border rounded-2xl flex items-center justify-center backdrop-blur active:scale-95 transition-all shrink-0 ${isScanning ? 'border-[#FF6600] shadow-[0_0_20px_rgba(255,102,0,0.5)] animate-pulse' : 'border-white/10 shadow-[0_5px_20px_rgba(0,0,0,0.5)]'}`}>
              <img src="/icon-video.png" className="w-[100%] h-[100%] object-contain" alt="Vidéo" />
            </button>
            <span className="text-[2vw] sm:text-[8px] text-[#FF6600] font-bold uppercase tracking-widest">
              {isScanning ? `SCAN... ${recordingTime}S` : 'MAX 15S'}
            </span>
          </div>
        </div>
      </div>

      {/* VUE A : MODAL DE RÉSULTAT */}
      {pendingItems && (
        <div className="absolute inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col p-[4vw] animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between mt-[6vh] mb-[4vh] border-b border-white/10 pb-[2vh]">
            <h2 className="text-[#FF6600] font-black text-[6vw] sm:text-2xl tracking-widest uppercase">Inventaire Vidéo</h2>
            <span className="bg-[#1E1E1E] px-4 py-2 rounded-xl text-[#FF6600] font-black text-[3vw] sm:text-sm">{pendingItems.length} OBJETS</span>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4">
            {pendingItems.map((item, idx) => {
              const score = item.confidence ? Math.round(item.confidence * 100) : 0;
              const scoreColor = score >= 90 ? 'bg-green-500/10 text-green-500 border-green-500/30' : score >= 70 ? 'bg-[#FF6600]/10 text-[#FF6600] border-[#FF6600]/30' : 'bg-red-500/10 text-red-500 border-red-500/30';

              return (
                <div key={idx} className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-4 flex gap-4 items-center shadow-lg">
                  
                  <div className="w-16 h-16 rounded-xl bg-black/50 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.label || 'Outil'} />
                    ) : (
                      <span className="text-xl opacity-30">📷</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <span className="text-gray-400 font-black text-[9px] tracking-widest uppercase mb-1">
                      {item.brandColor || 'Marque Inconnue'}
                    </span>
                    
                    <h3 className="text-white font-bold text-sm leading-tight whitespace-normal">
                      {item.label || item.typography || item.morphology || "Outil identifié"}
                    </h3>

                    <span className="text-[#FF6600] text-[10px] font-bold mt-1.5 tracking-wider uppercase">
                      {item.type || item.categorie_id}
                    </span>
                  </div>

                  <div className="shrink-0 flex flex-col items-end">
                     <span className={`px-2 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${scoreColor}`}>
                       {score}%
                     </span>
                  </div>
                </div>
              );
            })}
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
  EN: {
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
// 📂 FICHIER : \src\core\security\supabaseClient.ts
// ==========================================

```tsx
// ==========================================
// 📂 FICHIER : \src\core\security\supabaseClient.ts
// ==========================================
import { createClient } from '@supabase/supabase-js';

// Récupération des variables d'environnement depuis le .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Garde-fou : Avertissement si les clés sont introuvables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("🔴 ERREUR CRITIQUE : Variables d'environnement Supabase introuvables. Vérifiez le fichier .env.local");
}

// Création et exportation de l'instance unique du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
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
import { supabase } from './supabaseClient';

const TIER_STORAGE_KEY = 'locate_user_tier';
const DEFAULT_TIER: UserTier = 'FREE';

export const useUserTier = () => {
  const [currentTier, setCurrentTier] = useState<UserTier>(DEFAULT_TIER);
  const [tierConfig, setTierConfig] = useState<TierConfig>(TIERS_CONFIG[DEFAULT_TIER]);

  useEffect(() => {
    const fetchTierInfo = async () => {
      // 1. Lecture ultra-rapide du stockage local (pour l'affichage immédiat)
      const savedTier = localStorage.getItem(TIER_STORAGE_KEY) as UserTier;
      if (savedTier && ['FREE', 'PREMIUM', 'PRO'].includes(savedTier)) {
        setCurrentTier(savedTier);
        setTierConfig(TIERS_CONFIG[savedTier]);
      }

      // 2. Vérification sécurisée auprès de Supabase (La BDD a toujours raison)
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // NOUVEAU : On interroge directement ta nouvelle table 'profiles'
        const { data, error } = await supabase
          .from('profiles')
          .select('subscription_plan')
          .eq('id', session.user.id)
          .single();

        if (error) console.warn("Information Supabase :", error.message);

        if (data && data.subscription_plan) {
          // On passe le 'free' de Supabase en 'FREE' pour React
          const realTier = data.subscription_plan.toUpperCase() as UserTier;
          
          if (['FREE', 'PREMIUM', 'PRO'].includes(realTier) && realTier !== savedTier) {
            setCurrentTier(realTier);
            setTierConfig(TIERS_CONFIG[realTier]);
            localStorage.setItem(TIER_STORAGE_KEY, realTier);
          }
        }
      }
    };

    fetchTierInfo();
  }, []);

  const setTier = async (tier: UserTier) => {
    // 1. Mise à jour visuelle immédiate
    localStorage.setItem(TIER_STORAGE_KEY, tier);
    setCurrentTier(tier);
    setTierConfig(TIERS_CONFIG[tier]);
    
    // 2. Synchronisation sécurisée dans Supabase (Backdoor Admin)
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase
        .from('profiles')
        .update({ subscription_plan: tier.toLowerCase() }) // On renvoie en minuscules
        .eq('id', session.user.id);
    }
    
    window.location.reload();
  };

  return { currentTier, tierConfig, setTier };
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
// ==========================================
// 📂 FICHIER : \src\core\storage\memoryService.ts
// ==========================================
import type { InventoryItem, Location } from '../../types';

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

export type ToolMemory = InventoryItem;

// ==========================================
// 🏗️ NOUVEAU : LES 4 PILIERS MÉTIERS (STATIQUES)
// ==========================================
export const DEFAULT_LOCATIONS: Location[] = [
  { id: 'atelier', label: 'Atelier', iconName: 'Wrench', description: 'Zone principale' },
  { id: 'fourgon', label: 'Fourgon', iconName: 'Truck', description: 'Véhicule d\'intervention' },
  { id: 'chantier', label: 'Chantier', iconName: 'HardHat', description: 'Chez le client' },
  { id: 'pret', label: 'En Prêt', iconName: 'Users', description: 'Matériel prêté' }
];

export const getCustomLocations = (): Location[] => {
  // Pour la V1, on by-pass le localStorage et on force ces 4 zones universelles
  return DEFAULT_LOCATIONS;
};
```

// ==========================================
// 📂 FICHIER : \src\core\storage\useAppSettings.ts
// ==========================================

```tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Language = 'FR' | 'EN';
export type UnitSystem = 'METRIC' | 'IMPERIAL';

const SETTINGS_KEY = 'locate_app_settings';

// NOUVEAU : On enrichit la structure de l'identité pour inclure les habilitations M5
export interface UserProfile {
  fullName: string;
  company: string;
  address: string;
  techId?: string; // Matricule / N° de badge
  habilitations?: string[]; // Ex: ["BR", "B0", "CACES R489", "H1V"]
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
// 📂 FICHIER : \src\core\ui\AuthShield.tsx
// ==========================================

```tsx
// ==========================================
// 📂 FICHIER : \src\core\ui\AuthShield.tsx
// ==========================================
import React, { useState } from 'react';
import { supabase } from '../security/supabaseClient';

interface AuthShieldProps {
  onSuccess: () => void;
}

export default function AuthShield({ onSuccess }: AuthShieldProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Logique d'inscription
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Compte créé ! Vérifiez vos emails pour valider l'inscription.");
      } else {
        // Logique de connexion
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Déverrouillage de l'application
        onSuccess(); 
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'authentification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center p-[5vw] font-sans">
      
      {/* Grille matricielle de fond */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>

      {/* Conteneur Glassmorphism */}
      <div className="relative w-full max-w-sm bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_40px_rgba(255,102,0,0.15)] z-10 flex flex-col">
        
        {/* En-tête / Logo */}
        <div className="text-center mb-8">
          <h1 className="text-white font-black text-3xl tracking-widest uppercase mb-1 drop-shadow-lg">
            LOCATE <span className="text-[#FF6600]">SYSTEMS</span>
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">
            Portail Sécurisé
          </p>
        </div>

        {/* Formulaire interactif */}
        <form onSubmit={handleAuth} className="flex flex-col gap-5">
          
          {/* Bloc d'erreur dynamique */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-400 text-xs p-3 rounded-lg text-center font-bold tracking-wide">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
              Identifiant (Email)
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-[#FF6600] outline-none transition-colors shadow-inner"
              placeholder="technicien@locate.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
              Clé d'accès (Mot de passe)
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-[#FF6600] outline-none transition-colors shadow-inner"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Bouton de soumission primaire */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#FF6600] text-white font-black uppercase tracking-widest py-4 rounded-lg mt-2 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,102,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e65c00]"
          >
            {loading ? 'Connexion au serveur...' : (isSignUp ? 'Créer un compte' : 'Accéder au terminal')}
          </button>
        </form>

        {/* Switch Inscription / Connexion */}
        <button 
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null); // Réinitialise les erreurs au changement de mode
          }}
          className="mt-6 text-gray-500 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors"
        >
          {isSignUp ? 'Déjà accrédité ? Se connecter' : 'Nouvel opérateur ? Créer un profil'}
        </button>
      </div>
    </div>
  );
}
```

// ==========================================
// 📂 FICHIER : \src\core\ui\Hub.tsx
// ==========================================

```tsx
import { useState } from 'react';

interface HubProps {
  onSelectModule: (module: 'home' | 'asset' | 'kitchen' | 'garage' | 'care') => void;
  userTier: string; // <-- NOUVEAU : Récupération du grade
}

export default function Hub({ onSelectModule, userTier }: HubProps) {
  const isPro = userTier === 'PRO'; // Seul le PRO débloque tout
  // État pour suivre le module survolé/actif (Gère la couleur du noyau et des flux)
  const [hoveredModule, setHoveredModule] = useState<string>('home');

  const modules = [
    { id: 'home', name: 'HOME', color: '#FF6600', iconName: 'home', active: true }, // Toujours actif (le bridage Free/Premium se fait dedans)
    { id: 'asset', name: 'ASSET', color: '#007BFF', iconName: 'asset', active: isPro },
    { id: 'garage', name: 'GARAGE', color: '#DC3545', iconName: 'garage', active: isPro },
    { id: 'kitchen', name: 'KITCHEN', color: '#28A745', iconName: 'kitchen', active: isPro },
    { id: 'care', name: 'CARE', color: '#E0E0E0', iconName: 'care', active: isPro }
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
                {/* NOUVEAU : Affichage du cadenas si inactif */}
                {!mod.active && <div className="absolute -top-2 -right-2 text-lg z-20 drop-shadow-lg">🔒</div>}

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
// 📂 FICHIER : \src\modules\garage\components\FinDePosteReport.tsx
// ==========================================

```tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#DC2626', paddingBottom: 10 },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#DC2626' },
  logoSub: { fontSize: 12, color: '#333333', marginTop: 4 },
  reportInfo: { fontSize: 10, textAlign: 'right', color: '#666666' },
  summaryBox: { padding: 15, borderRadius: 5, marginBottom: 20, borderWidth: 1 },
  summaryBoxOK: { backgroundColor: '#F0FDF4', borderColor: '#22C55E' },
  summaryBoxKO: { backgroundColor: '#FEF2F2', borderColor: '#DC2626' },
  statusText: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  metaText: { fontSize: 10, color: '#333333', marginBottom: 3 },
  justificationBox: { marginTop: 10, padding: 10, backgroundColor: '#FFFFFF', borderLeftWidth: 3, borderLeftColor: '#DC2626' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 5, marginBottom: 5 },
  tagBadge: { backgroundColor: '#FEE2E2', color: '#991B1B', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 3, fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase' },
  
  // NOUVEAU : Styles pour la grille Avant/Après
  comparisonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 10 },
  column: { width: '48%' },
  colHeader: { fontSize: 10, fontWeight: 'bold', backgroundColor: '#1F2937', color: 'white', padding: 4, textAlign: 'center', marginBottom: 4 },
  image: { width: '100%', height: 140, objectFit: 'cover', borderRadius: 2, borderWidth: 1, borderColor: '#D1D5DB' },
  drawerTitle: { fontSize: 12, fontWeight: 'bold', color: '#DC2626', marginBottom: 5, marginTop: 10 },
  
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', fontSize: 8, color: '#9CA3AF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 10 },
});

interface FinDePosteReportProps {
  data: {
    profileId: string;
    profileName: string;
    timestamp: string;
    status: 'CONFORME' | 'DEGRADE';
    tags: string[];
    justification: string;
    morningImages: string[]; // Les photos de la Prise de Poste
    eveningImages: string[]; // Les photos qu'il vient de prendre
    totalDrawers: number;
  }
}

export const FinDePosteReport: React.FC<FinDePosteReportProps> = ({ data }) => {
  const isOK = data.status === 'CONFORME';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* EN-TÊTE */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logoText}>LOCATE GARAGE</Text>
            <Text style={styles.logoSub}>Protocole FOD / 5S</Text>
          </View>
          <View style={styles.reportInfo}>
            <Text style={{ fontWeight: 'bold', color: '#DC2626' }}>CLÔTURE DE POSTE (AVANT/APRÈS)</Text>
            <Text>Date : {data.timestamp}</Text>
            <Text>Opérateur : TECH-M5-001</Text>
          </View>
        </View>

        {/* SYNTHÈSE */}
        <View style={[styles.summaryBox, isOK ? styles.summaryBoxOK : styles.summaryBoxKO]}>
          <Text style={[styles.statusText, { color: isOK ? '#15803D' : '#B91C1C' }]}>
            BILAN FIN DE POSTE : {data.status}
          </Text>
          <Text style={styles.metaText}>Équipement : {data.profileId}</Text>
          
          {!isOK && (data.tags.length > 0 || data.justification) && (
            <View style={styles.justificationBox}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#DC2626' }}>Déclaration d'anomalie :</Text>
              {data.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {data.tags.map((tag, i) => (
                    <Text key={i} style={styles.tagBadge}>{tag}</Text>
                  ))}
                </View>
              )}
              {data.justification && (
                <Text style={{ fontSize: 10, color: '#333333', marginTop: 4, fontStyle: 'italic' }}>
                  "{data.justification}"
                </Text>
              )}
            </View>
          )}
        </View>

        {/* COMPARATEUR VISUEL (La magie opère ici) */}
        {data.eveningImages.map((eveningImg, idx) => {
          const isPlateau = idx === data.totalDrawers;
          // Si on n'a pas l'image du matin (ex: bug système), on met un espace vide, mais normalement on l'a.
          const morningImg = data.morningImages[idx] || eveningImg; 

          return (
            <View key={idx} wrap={false}>
              <Text style={styles.drawerTitle}>
                {isPlateau ? 'PLATEAU SUPÉRIEUR' : `TIROIR 0${idx + 1}`}
              </Text>
              <View style={styles.comparisonRow}>
                <View style={styles.column}>
                  <Text style={styles.colHeader}>PRISE DE POSTE (08:00)</Text>
                  <Image src={morningImg} style={styles.image} />
                </View>
                <View style={styles.column}>
                  <Text style={styles.colHeader}>FIN DE POSTE (MAINTENANT)</Text>
                  <Image src={eveningImg} style={styles.image} />
                </View>
              </View>
            </View>
          );
        })}

        <Text style={styles.footer} fixed>
          Document généré par le système LOCATE M5. Ce rapport de comparaison Avant/Après sert de preuve irréfutable de l'état de l'outillage entre la prise et la fin de poste.
        </Text>
      </Page>
    </Document>
  );
};
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
import { Shield, Zap, Wind, Mic, Power, X, CheckCircle2, AlertTriangle, Camera, CameraOff, CheckSquare, LogOut, Lock, Clock, AlertOctagon, User } from 'lucide-react';
import { liveService, type LiveDiagnostic } from '../../../core/ai/liveService';
import { reportService } from '../services/reportService';
import { useUserTier } from '../../../core/security/useUserTier';
import { useAppSettings } from '../../../core/storage/useAppSettings'; // <-- NOUVEAU: Import du Cerveau Local

const GaragePdfButton = lazy(() => import('./GaragePdfButton'));

interface LiveAssistantProps {
  mode: 'maintenance' | 'mecanique';
  onExit: () => void;
}

type SessionPhase = 'AUDIT' | 'DIAGNOSTIC';

const LiveAssistant: React.FC<LiveAssistantProps> = ({ mode, onExit }) => {
  const { currentTier } = useUserTier();
  const { settings } = useAppSettings(); // <-- NOUVEAU: Récupération du profil
  const profile = settings.userProfile;

  const [isLive, setIsLive] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [sessionPhase, setSessionPhase] = useState<SessionPhase>('AUDIT');
  const [showDegradedConfirm, setShowDegradedConfirm] = useState(false);
  const [isDegradedMode, setIsDegradedMode] = useState(false);
  const [bypassedWarnings, setBypassedWarnings] = useState<string[]>([]);

  const [sessionClosed, setSessionClosed] = useState(false);
  const [finalReport, setFinalReport] = useState<any>(null);
  
  const [diagnosticText, setDiagnosticText] = useState(`Phase d'Audit ${mode.toUpperCase()} initiée. Analysez la zone.`);
  const [currentDiagnostic, setCurrentDiagnostic] = useState<LiveDiagnostic>({
    hypothesis: "Initialisation du tunnel de sécurité...",
    confidence: 0,
    nextStep: "-"
  });
  
  const [freeTimeLeft, setFreeTimeLeft] = useState<number | null>(null);
  const [cooldownMsg, setCooldownMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const recognitionRef = useRef<any>(null);

  const [checks, setChecks] = useState(
    mode === 'maintenance'
      ? [
          { id: 'loto', label: 'Consignation LOTO', icon: <Power size={14} />, validated: false },
          { id: 'vat', label: 'Absence Tension (VAT)', icon: <Zap size={14} />, validated: false },
          { id: 'h2s', label: 'Détecteur Gaz', icon: <Wind size={14} />, validated: false },
        ]
      : [
          { id: 'levage', label: 'Chandelles Sécurité', icon: <Shield size={14} />, validated: false },
          { id: 'pto', label: 'Consignation PTO', icon: <Power size={14} />, validated: false },
          { id: 've', label: 'EPI Haute Tension', icon: <Zap size={14} />, validated: false },
        ]
  );

  const allValidated = checks.every(c => c.validated);

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0;
    utterance.pitch = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'fr-FR';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDiagnosticText(`🎙️ VOUS : "${transcript.toUpperCase()}"`);
        setIsListening(false);
        liveService.sendPrompt(`[PHASE: ${sessionPhase}] L'opérateur dit : ${transcript}`);
      };
      
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [sessionPhase]);

  const getCooldownStatus = () => {
    const stored = localStorage.getItem('m5_free_usage');
    if (!stored) return { allowed: true, count: 0, waitMin: 0 };
    const { count, lastUsed } = JSON.parse(stored);
    const elapsedMin = (Date.now() - lastUsed) / 60000;
    if (elapsedMin > 24 * 60) return { allowed: true, count: 0, waitMin: 0 };
    let requiredWait = 0;
    if (count === 1) requiredWait = 5;
    else if (count === 2) requiredWait = 20;
    else if (count === 3) requiredWait = 60;
    else if (count >= 4) requiredWait = 24 * 60;
    if (elapsedMin < requiredWait) return { allowed: false, count, waitMin: Math.ceil(requiredWait - elapsedMin) };
    return { allowed: true, count };
  };

  useEffect(() => {
    if (currentTier === 'FREE') {
      const status = getCooldownStatus();
      if (!status.allowed) {
        setCooldownMsg(`Tunnel IA en refroidissement. Attendez ${status.waitMin} min.`);
        return; 
      }
      setFreeTimeLeft(120);
    }
    startLiveSession(false);
  }, [currentTier]);

  const registerFreeUsage = () => {
    const stored = localStorage.getItem('m5_free_usage');
    const count = stored ? JSON.parse(stored).count : 0;
    localStorage.setItem('m5_free_usage', JSON.stringify({ count: count + 1, lastUsed: Date.now() }));
  };

  useEffect(() => {
    let timer: number;
    if (isLive && currentTier === 'FREE' && freeTimeLeft !== null) {
      if (freeTimeLeft <= 0) {
        registerFreeUsage();
        closeAndGenerateReport("Temps gratuit écoulé. Mode Premium requis.");
      } else {
        timer = window.setInterval(() => setFreeTimeLeft(prev => (prev !== null ? prev - 1 : 0)), 1000);
      }
    }
    return () => clearInterval(timer);
  }, [isLive, freeTimeLeft, currentTier]);

  const captureAndSendFrame = () => {
    if (videoRef.current && canvasRef.current && isVideoActive) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context && videoRef.current.videoWidth > 0) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        liveService.sendVideoFrame(canvas);
      }
    }
  };

  const toggleVisionBionique = async () => {
    if (isVideoActive) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(t => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      if (frameIntervalRef.current) {
        window.clearInterval(frameIntervalRef.current);
        frameIntervalRef.current = null;
      }
      setIsVideoActive(false);
      setDiagnosticText("Vision Bionique désactivée. Mode Radio actif.");
      speak("Caméra coupée.");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setIsVideoActive(true);
        
        setDiagnosticText("Vision Bionique activée. Analyse visuelle...");
        speak("Vision activée.");
        setTimeout(() => {
          captureAndSendFrame();
          liveService.sendPrompt(`[PHASE: ${sessionPhase}] Je viens d'activer la caméra. Décris-moi l'environnement et les points de vigilance liés à la sécurité.`);
        }, 1500);

        frameIntervalRef.current = window.setInterval(captureAndSendFrame, 1600);
      } catch (err) { 
        setDiagnosticText("Erreur : Accès caméra refusé."); 
      }
    }
  };

  const startLiveSession = async (degraded: boolean) => {
    setShowDegradedConfirm(false);
    setIsDegradedMode(degraded);
    
    speak("Initialisation du système LOCATE.");

    try {
      setIsLive(true);
      startTimeRef.current = new Date();
      await liveService.connect(mode, (data) => {
        setDiagnosticText(data.hypothesis);
        setCurrentDiagnostic(data); 
        speak(data.hypothesis);
      });
      
      const msg = degraded 
        ? "Tunnel ouvert en MODE DÉGRADÉ. Prudence maximale."
        : "Phase d'Audit Sécurité en cours. Validez vos consignations dans le bandeau supérieur.";
      
      setDiagnosticText(msg);
      
    } catch (err) { 
      setDiagnosticText("Erreur d'ouverture du Tunnel IA."); 
    }
  };

  const handleTransitionToDiagnostic = () => {
    if (allValidated) {
      setSessionPhase('DIAGNOSTIC');
      speak("Sécurité validée. Passage en mode diagnostic.");
      liveService.sendPrompt(`[SYSTEM] L'opérateur (Habilitations: ${profile?.habilitations?.join(', ') || 'Aucune'}) a validé toutes les procédures de sécurité. Passage en mode DIAGNOSTIC. Quel est ton premier conseil d'investigation ?`);
    } else {
      const warnings: string[] = [];
      checks.forEach(c => {
        if (!c.validated) {
          if (c.id === 'loto' || c.id === 'pto') warnings.push("L'énergie mécanique ou pneumatique résiduelle pardonne rarement.");
          if (c.id === 'vat' || c.id === 've') warnings.push("Une VAT prend 10 secondes et te garantit de rentrer chez toi ce soir.");
          if (c.id === 'h2s') warnings.push("Dans un espace confiné, les gaz ne préviennent pas.");
          if (c.id === 'levage') warnings.push("Sécurise toujours avec des chandelles mécaniques.");
        }
      });
      setBypassedWarnings(warnings);
      setShowDegradedConfirm(true);
    }
  };

  const togglePTT = () => {
    if (!isLive) return;
    if (isListening) {
      setIsListening(false);
      try { recognitionRef.current?.stop(); } catch(e) {}
    } else {
      setIsListening(true);
      setDiagnosticText("Écoute en cours... (Parlez puis patientez)");
      try { recognitionRef.current?.start(); } catch(e) {}
    }
  };

  const closeAndGenerateReport = async (forcedReason?: string) => {
    if (frameIntervalRef.current) window.clearInterval(frameIntervalRef.current);
    liveService.terminate();
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
    setIsLive(false);
    setIsVideoActive(false);
    
    let finalHypothesis = currentDiagnostic.hypothesis;
    if (isDegradedMode) {
      finalHypothesis = `[MODE DÉGRADÉ ENGAGÉ] - ${finalHypothesis}`;
    }

    const reportData = {
      mode, technicianId: profile?.techId || "TECH-INCONNU", location: "Zone Opérationnelle", equipmentId: "EQ-INCONNU",
      safetyChecks: checks, 
      diagnostic: forcedReason ? { ...currentDiagnostic, hypothesis: forcedReason } : { ...currentDiagnostic, hypothesis: finalHypothesis },
      startTime: startTimeRef.current || new Date(), endTime: new Date()
    };
    
    const report = await reportService.generateMaintenanceReport(reportData);
    setFinalReport(report);
    setSessionClosed(true);
    speak("Intervention clôturée. Génération du rapport.");
  };

  if (sessionClosed && finalReport) {
    return (
      <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full mt-8">
          <div className="flex items-center gap-4 mb-8 border-b border-[#DC2626]/30 pb-4">
            <CheckSquare className="text-[#DC2626] w-10 h-10" />
            <h1 className="text-white font-black text-2xl uppercase tracking-widest">Intervention Clôturée</h1>
          </div>
          <div className="bg-black border border-white/10 rounded-xl p-5 mb-6">
            <h3 className="text-[#DC2626] font-bold text-xs uppercase mb-3">Synthèse Diag. IA</h3>
            <p className="text-gray-300 text-sm italic">"{finalReport.diagnostic.hypothesis}"</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {currentTier === 'FREE' ? (
              <button disabled className="flex-1 bg-gray-900 text-gray-500 py-4 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-3"><Lock size={18}/> PDF Verrouillé</button>
            ) : (
              <Suspense fallback={<div className="animate-pulse">Chargement...</div>}><GaragePdfButton reportData={finalReport} /></Suspense>
            )}
            <button onClick={onExit} className="flex-1 bg-[#121212] text-white py-4 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-3"><LogOut size={18}/> Quitter</button>
          </div>
        </div>
      </div>
    );
  }

  if (cooldownMsg) {
    return (
      <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col items-center justify-center p-6 text-center">
         <AlertTriangle className="text-[#FF6600] w-16 h-16 mb-4 animate-pulse" />
         <h2 className="text-white font-black uppercase tracking-widest text-xl mb-2">Refroidissement IA</h2>
         <p className="text-gray-400 text-sm">{cooldownMsg}</p>
         <button onClick={onExit} className="mt-8 bg-white/10 text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-xs">Retour</button>
      </div>
    );
  }

  const themeColor = mode === 'maintenance' ? '#00E5FF' : '#DC2626'; 

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col overflow-hidden select-none">
      
      <div className="relative flex-1 bg-[#050505] overflow-hidden">
        <canvas ref={canvasRef} className="hidden" />

        <video ref={videoRef} autoPlay playsInline className={`absolute inset-0 w-full h-full object-cover ${sessionPhase === 'AUDIT' ? 'opacity-40' : 'opacity-70'} ${isVideoActive ? 'block' : 'hidden'}`} />
        
        {isVideoActive && (
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:5vw_5vw]"></div>
        )}

        {!isVideoActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]">
            {isLive ? (
              <div className="flex flex-col items-center justify-center">
                <div className={`w-40 h-40 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isListening ? `border-[${themeColor}] scale-110 shadow-[0_0_50px_${themeColor}40]` : 'border-white/10'}`}>
                  <div className={`w-32 h-32 rounded-full border flex items-center justify-center ${isListening ? `border-[${themeColor}] animate-pulse bg-[${themeColor}]/10` : 'border-white/5'}`}>
                    <Mic size={48} className={isListening ? `text-[${themeColor}]` : 'text-gray-600'} />
                  </div>
                </div>
              </div>
            ) : (
              <Shield size={64} className="text-white/10" />
            )}
          </div>
        )}
        
        {/* ========================================================= */}
        {/* NOUVEAU : HUD TACTIQUE (FILIGRANE SUPÉRIEUR)              */}
        {/* ========================================================= */}
        <div className="absolute top-4 left-4 right-4 z-40 flex flex-col gap-2">
          
          {/* LIGNE 1 : PROFIL & ÉTATS */}
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center justify-between shadow-lg">
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#1A1A1A] rounded-full border border-white/20 flex items-center justify-center">
                <User size={16} className="text-gray-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-[10px] uppercase tracking-widest leading-none mb-1">
                  {profile?.fullName || 'OPÉRATEUR INCONNU'}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-[8px] uppercase tracking-widest leading-none text-[${themeColor}]`}>
                    {profile?.techId || 'ID N/A'}
                  </span>
                  {/* REINTÉGRATION DU CHRONO FREE ICI */}
                  {currentTier === 'FREE' && freeTimeLeft !== null && (
                    <span className="flex items-center gap-1 text-gray-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                      <Clock size={8} />
                      <span className="font-mono text-[8px] font-black">{Math.floor(freeTimeLeft / 60)}:{(freeTimeLeft % 60).toString().padStart(2, '0')}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-1.5 items-center">
              {profile?.habilitations?.map(hab => (
                <span key={hab} className="bg-green-500/20 border border-green-500/50 text-green-400 px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase">
                  {hab}
                </span>
              ))}
              {(!profile?.habilitations || profile.habilitations.length === 0) && (
                <span className="bg-red-500/20 border border-red-500/50 text-red-400 px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase">
                  ⚠️ SANS HABILITATION
                </span>
              )}
            </div>

          </div>

          {/* LIGNE 2 : PILULES DE CONSIGNATION (Phase Audit Uniquement) */}
          {sessionPhase === 'AUDIT' && !showDegradedConfirm && (
            <div className="bg-black/60 backdrop-blur-md border border-orange-500/30 rounded-xl p-2 flex items-center justify-between shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {checks.map(check => (
                  <button 
                    key={check.id} 
                    onClick={() => setChecks(prev => prev.map(c => c.id === check.id ? {...c, validated: !c.validated} : c))}
                    className={`px-3 py-1.5 rounded-full border flex items-center gap-1.5 whitespace-nowrap transition-all ${
                      check.validated 
                        ? `bg-[${themeColor}]/20 border-[${themeColor}] text-[${themeColor}] shadow-[0_0_10px_${themeColor}40]` 
                        : 'bg-black/50 border-white/10 text-gray-500 hover:text-white'
                    }`}
                  >
                    {check.validated ? <CheckCircle2 size={12} /> : check.icon}
                    <span className="text-[9px] font-black uppercase tracking-widest">{check.label}</span>
                  </button>
                ))}
              </div>
              
              <button 
                onClick={handleTransitionToDiagnostic}
                className={`ml-2 px-3 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest transition-all shrink-0 flex items-center gap-1 ${
                  allValidated 
                    ? `bg-[${themeColor}] text-black shadow-[0_0_15px_${themeColor}80]` 
                    : 'bg-red-900/50 text-red-400 border border-red-500/30'
                }`}
              >
                {allValidated ? 'DIAGNOSTIC' : 'FORCER'}
              </button>
            </div>
          )}

          {/* LIGNE 2 (Alternative) : PHASE DIAGNOSTIC ACTUELLE */}
          {sessionPhase === 'DIAGNOSTIC' && (
            <div className="flex justify-end mt-1">
              <span className={`px-3 py-1 rounded-full border bg-[${themeColor}]/20 border-[${themeColor}]/50 text-[${themeColor}] text-[8px] font-black uppercase tracking-widest shadow-[0_0_10px_${themeColor}40] flex items-center gap-1`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                Phase Diagnostic Active
              </span>
            </div>
          )}

        </div>
        {/* ========================================================= */}


        {/* MODALE DE CONFIRMATION DÉGRADÉE */}
        {showDegradedConfirm && (
          <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-3xl p-6 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full bg-[#1A0505] border border-[#DC2626] rounded-2xl p-6 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
              <div className="flex items-center gap-3 mb-6 border-b border-[#DC2626]/30 pb-4">
                <AlertOctagon className="text-[#DC2626] w-8 h-8" />
                <h2 className="text-white font-black text-sm uppercase tracking-widest leading-tight">Dédouanement<br/>Mode Dégradé</h2>
              </div>
              
              <div className="space-y-4 mb-8">
                {bypassedWarnings.map((warning, idx) => (
                  <div key={idx} className="bg-black/50 p-4 rounded-lg border-l-4 border-orange-500">
                    <p className="text-white/80 text-xs italic leading-relaxed">"{warning}"</p>
                  </div>
                ))}
              </div>

              <div className="bg-red-950/50 p-3 rounded-lg mb-6 border border-red-500/20">
                <p className="text-red-400 text-[9px] uppercase tracking-widest text-center font-bold">
                  En poursuivant, vous engagez votre responsabilité. Locate Systems décline toute responsabilité. Le rapport sera tagué.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowDegradedConfirm(false)} className="flex-1 py-4 bg-gray-900 text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-widest">
                  Annuler
                </button>
                <button onClick={() => { setSessionPhase('DIAGNOSTIC'); startLiveSession(true); }} className="flex-[2] py-4 bg-[#DC2626] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.4)] active:scale-95">
                  J'y vais quand même
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* CONSOLE INFÉRIEURE */}
      <div className="h-[30vh] bg-[#050505] border-t border-white/5 p-6 flex flex-col items-center justify-between z-40 relative">
        
        <div className="w-full bg-black/60 rounded-xl border border-white/10 p-4 min-h-[80px] flex items-center shadow-inner">
          <p className={`font-mono text-[10px] uppercase tracking-wider leading-relaxed ${currentDiagnostic.safetyAlert ? 'text-red-500 font-bold animate-pulse' : 'text-gray-300'}`}>
            <span className={`text-[${themeColor}]`}>{">"}</span> {diagnosticText}
          </p>
        </div>

        <div className="flex items-center justify-between w-full mt-4 px-2">
            
           <button 
             onClick={toggleVisionBionique}
             disabled={!isLive}
             className={`flex flex-col items-center gap-2 transition-all group ${!isLive ? 'opacity-30' : 'active:scale-90'}`}
           >
              <div className={`w-14 h-14 rounded-full border flex items-center justify-center transition-colors ${isVideoActive ? `bg-[${themeColor}]/20 border-[${themeColor}] shadow-[0_0_15px_${themeColor}40]` : 'bg-white/5 border-white/10 group-hover:border-white/30'}`}>
                {isVideoActive ? <Camera size={22} className={`text-[${themeColor}]`} /> : <CameraOff size={22} className="text-white/60" />}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-tighter ${isVideoActive ? `text-[${themeColor}]` : 'text-white/60'}`}>
                {isVideoActive ? 'Vision ON' : 'Vision OFF'}
              </span>
           </button>

           <div className="relative">
              <button 
                onClick={togglePTT}
                disabled={!isLive}
                className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-b-[6px] transition-all shadow-2xl select-none ${
                  !isLive 
                    ? 'bg-gray-900 border-black opacity-50' 
                    : isListening 
                      ? 'bg-orange-600 border-orange-900 scale-95 translate-y-[4px] animate-pulse' 
                      : 'bg-orange-500 border-orange-800 active:scale-95 hover:bg-[#ff7b24]'
                }`}
              >
                <Mic size={32} className="text-white drop-shadow-md" />
                <span className="text-[9px] font-black text-white uppercase mt-1 tracking-widest drop-shadow-md">
                  {isListening ? 'PARLEZ' : 'PTT'}
                </span>
              </button>
           </div>

           <button 
             onClick={() => closeAndGenerateReport()} 
             className="flex flex-col items-center gap-2 active:scale-90 transition-all group"
           >
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-red-500/50 transition-colors">
                <X size={22} className="text-[#DC2626]" />
              </div>
              <span className="text-[8px] font-black uppercase text-[#DC2626] tracking-tighter">Fin Diag.</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default LiveAssistant;
```

// ==========================================
// 📂 FICHIER : \src\modules\garage\components\PassportScanner.tsx
// ==========================================

```tsx
import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, Loader2, } from 'lucide-react';
import { geminiService } from '../../../core/ai/geminiService';

interface PassportScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: { fullName: string; company: string; techId: string; habilitations: string[] }) => void;
}

const PassportScanner: React.FC<PassportScannerProps> = ({ isOpen, onClose, onSuccess }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isOpen) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Erreur caméra:", err));
    }
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [isOpen]);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context && video.videoWidth > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const base64Image = canvas.toDataURL('image/jpeg', 0.8);
      setIsAnalyzing(true);
      
      // Appel à notre nouvelle fonction métier
      const result = await geminiService.analyzePasseportSecurite(base64Image);
      
      setIsAnalyzing(false);
      if (result) {
        onSuccess(result);
      } else {
        alert("L'IA n'a pas réussi à lire les données. Veuillez réessayer avec un meilleur éclairage.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col font-sans">
      {isAnalyzing && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
          <Loader2 size={64} className="text-[#FF6600] mb-4 animate-spin" />
          <h2 className="text-white font-black uppercase tracking-widest animate-pulse">Lecture OCR en cours...</h2>
          <p className="text-gray-400 text-xs mt-2">Extraction des habilitations de sécurité</p>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-80" />

      {/* HUD Scanner */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <h1 className="text-[#FF6600] font-black text-xl uppercase tracking-widest">SCAN PASSEPORT</h1>
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">Acquisition Sécurité M5</p>
        </div>
        <button onClick={onClose} className="w-12 h-12 bg-black/50 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md active:scale-90">
          <X className="text-white" size={24} />
        </button>
      </div>

      {/* Cadre de visée */}
      <div className="absolute inset-x-[10vw] top-[25vh] bottom-[30vh] border-2 border-[#FF6600] border-dashed rounded-xl flex items-center justify-center pointer-events-none z-10 shadow-[0_0_20px_rgba(255,102,0,0.3)]">
        <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-[#FF6600]/30">
          <span className="text-[#FF6600] font-bold text-[10px] uppercase tracking-widest">Cadrer la carte ici</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[25vh] bg-gradient-to-t from-black to-transparent flex items-center justify-center z-10 pb-[env(safe-area-inset-bottom)]">
        <button onClick={handleCapture} disabled={isAnalyzing} className="w-20 h-20 bg-[#FF6600] rounded-full border-4 border-black ring-2 ring-[#FF6600] flex items-center justify-center active:scale-90 transition-transform shadow-[0_0_30px_rgba(255,102,0,0.6)]">
          <Camera size={32} className="text-black" />
        </button>
      </div>
    </div>
  );
};

export default PassportScanner;

```

// ==========================================
// 📂 FICHIER : \src\modules\garage\components\PriseDePosteReport.tsx
// ==========================================

```tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#DC2626', paddingBottom: 10 },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#DC2626' },
  logoSub: { fontSize: 12, color: '#333333', marginTop: 4 },
  reportInfo: { fontSize: 10, textAlign: 'right', color: '#666666' },
  summaryBox: { padding: 15, borderRadius: 5, marginBottom: 20, borderWidth: 1 },
  summaryBoxOK: { backgroundColor: '#F0FDF4', borderColor: '#22C55E' },
  summaryBoxKO: { backgroundColor: '#FEF2F2', borderColor: '#DC2626' },
  statusText: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  metaText: { fontSize: 10, color: '#333333', marginBottom: 3 },
  justificationBox: { marginTop: 10, padding: 10, backgroundColor: '#FFFFFF', borderLeftWidth: 3, borderLeftColor: '#DC2626' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 5, marginBottom: 5 },
  tagBadge: { backgroundColor: '#FEE2E2', color: '#991B1B', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 3, fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  imageContainer: { width: '48%', marginBottom: 15 },
  image: { width: '100%', height: 160, objectFit: 'cover', borderRadius: 4, borderWidth: 1, borderColor: '#E5E7EB' },
  imageLabel: { fontSize: 10, fontWeight: 'bold', marginTop: 5, textAlign: 'center', backgroundColor: '#F9FAFB', padding: 4 },
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', fontSize: 8, color: '#9CA3AF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 10 },
});

interface PriseDePosteReportProps {
  data: {
    profileId: string;
    profileName: string;
    timestamp: string;
    status: 'CONFORME' | 'DEGRADE';
    tags: string[];
    justification: string;
    images: string[];
    totalDrawers: number;
  }
}

export const PriseDePosteReport: React.FC<PriseDePosteReportProps> = ({ data }) => {
  const isOK = data.status === 'CONFORME';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* EN-TÊTE */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logoText}>LOCATE GARAGE</Text>
            <Text style={styles.logoSub}>Protocole FOD / 5S</Text>
          </View>
          <View style={styles.reportInfo}>
            <Text style={{ fontWeight: 'bold', color: '#DC2626' }}>CERTIFICAT D'ÉTAT (SERVANTE)</Text>
            <Text>Date : {data.timestamp}</Text>
            <Text>Opérateur : TECH-M5-001</Text>
          </View>
        </View>

        {/* SYNTHÈSE ET JUSTIFICATION */}
        <View style={[styles.summaryBox, isOK ? styles.summaryBoxOK : styles.summaryBoxKO]}>
          <Text style={[styles.statusText, { color: isOK ? '#15803D' : '#B91C1C' }]}>
            STATUT : {data.status}
          </Text>
          <Text style={styles.metaText}>Équipement ciblé : {data.profileId} ({data.profileName})</Text>
          <Text style={styles.metaText}>Contrôle visuel : {data.images.length} zones inspectées et photographiées.</Text>
          
          {!isOK && (data.tags.length > 0 || data.justification) && (
            <View style={styles.justificationBox}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#DC2626' }}>Déclaration d'anomalie :</Text>
              
              {/* Affichage des Tags (Chantier, Chaos, etc.) */}
              {data.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {data.tags.map((tag, i) => (
                    <Text key={i} style={styles.tagBadge}>{tag}</Text>
                  ))}
                </View>
              )}

              {/* Texte libre éventuel */}
              {data.justification && (
                <Text style={{ fontSize: 10, color: '#333333', marginTop: 4, fontStyle: 'italic' }}>
                  "{data.justification}"
                </Text>
              )}
            </View>
          )}
        </View>

        {/* GRILLE DES PREUVES VISUELLES */}
        <View style={styles.grid}>
          {data.images.map((img, idx) => {
            const isPlateau = idx === data.totalDrawers;
            return (
              <View key={idx} style={styles.imageContainer} wrap={false}>
                <Image src={img} style={styles.image} />
                <Text style={styles.imageLabel}>
                  {isPlateau ? 'PLATEAU SUPÉRIEUR' : `TIROIR 0${idx + 1}`}
                </Text>
              </View>
            );
          })}
        </View>

        {/* FOOTER LÉGAL */}
        <Text style={styles.footer} fixed>
          Document généré cryptographiquement par le système LOCATE M5. La responsabilité de la vérification de l'intégrité de la servante incombe à l'opérateur. Ce rapport sert de preuve visuelle de l'état de l'outillage.
        </Text>
      </Page>
    </Document>
  );
};
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
// 📂 FICHIER : \src\modules\garage\views\FinDePoste.tsx
// ==========================================

```tsx
import React, { useState, useRef, useEffect } from 'react';
import { QrCode, ArrowLeft, CheckCircle2, Zap, Loader2, RotateCcw, AlertOctagon } from 'lucide-react';
import { supabase } from '../../../core/security/supabaseClient';

interface FinDePosteProps {
  onBack: () => void;
}

interface ServanteProfile {
  id: string;
  name: string;
  totalDrawers: number;
  foamColor: string;
}

type Step = 'scan_qr' | 'shooting' | 'analyzing' | 'report';
type ShiftStatus = 'CONFORME' | 'DEGRADE';

const ANOMALY_TAGS = [
  "Outil sur chantier",
  "Rangement chaos",
  "Outil cassé / rebut",
  "Outil perdu / volé"
];

// LE CATALOGUE ISSU DE TES PDF (QR CODES)
const SERVANTE_CATALOG: Record<string, ServanteProfile> = {
  "JETM4X-FDW": {
    id: "JETM4X-FDW",
    name: "Servante FACOM JET M4 (8 Tiroirs)",
    totalDrawers: 8,
    foamColor: "Rouge"
  },
  "OPSIAL-MEC": {
    id: "OPSIAL-MEC",
    name: "Servante OPSIAL Standard (6 Tiroirs)",
    totalDrawers: 6,
    foamColor: "Noir"
  }
};

const MOCK_MORNING_BASE64 = "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";

const FinDePoste: React.FC<FinDePosteProps> = ({ onBack }) => {
  const [step, setStep] = useState<Step>('scan_qr');
  const [profile, setProfile] = useState<ServanteProfile | null>(null);
  
  const [currentShot, setCurrentShot] = useState<number>(1);
  const [flashOn, setFlashOn] = useState(false);
  const [showFlash, setShowFlash] = useState(false); 
  
  const [eveningImages, setEveningImages] = useState<string[]>([]);
  const [morningImagesMock, setMorningImagesMock] = useState<string[]>([]); 
  
  const [shiftStatus, setShiftStatus] = useState<ShiftStatus>('CONFORME');
  const [justification, setJustification] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (step === 'shooting') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Erreur caméra:", err));
    }
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [step]);

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

  const handleSimulateScan = () => {
    // ON SIMULE LE SCAN DU QR CODE FACOM (8 Tiroirs)
    const scannedCode = "JETM4X-FDW";
    const foundProfile = SERVANTE_CATALOG[scannedCode];

    if (foundProfile) {
      setProfile(foundProfile);
      setEveningImages([]);
      
      const savedMorningShots = localStorage.getItem(`locatem5_morning_${scannedCode}`);
      if (savedMorningShots) {
        setMorningImagesMock(JSON.parse(savedMorningShots));
      } else {
        setMorningImagesMock(Array(foundProfile.totalDrawers + 1).fill(MOCK_MORNING_BASE64));
      }
      
      setCurrentShot(1);
      setShiftStatus('CONFORME');
      setJustification('');
      setSelectedTags([]);
      setStep('shooting');
    } else {
      alert("QR Code inconnu.");
    }
  };

  const handleCapture = () => {
    if (!profile || !videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context && video.videoWidth > 0) {
      // On force un ratio Paysage standard (16:9)
      const targetWidth = 1280;
      const targetHeight = 720; 

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // On dessine l'image en forçant le remplissage du rectangle 16:9
      // (Cela évite les bandes noires si l'écran du tel a un ratio bizarre)
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // On compresse légèrement plus (0.6) car les images larges pèsent plus lourd dans le PDF
      const base64Image = canvas.toDataURL('image/jpeg', 0.6);
      setEveningImages(prev => [...prev, base64Image]);
    }

    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 150);

    const maxShots = profile.totalDrawers + 1;

    if (currentShot < maxShots) {
      setCurrentShot(prev => prev + 1);
    } else {
      if (flashOn) toggleTorch();
      setStep('analyzing');
      setTimeout(() => setStep('report'), 1500);
    }
  };

  const handleUndo = () => {
    if (eveningImages.length > 0) {
      setEveningImages(prev => prev.slice(0, -1));
      setCurrentShot(prev => prev - 1);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  if (step === 'scan_qr') {
    return (
      <div className="w-full h-full bg-[#121212] flex flex-col px-[4vw] pt-[2vh] pb-[4vh] font-sans">
        <div className="h-[10vh] flex items-center shrink-0">
          <button onClick={onBack} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
            <ArrowLeft className="text-white" size={24} />
          </button>
          <div className="ml-4">
            <h2 className="text-white font-black uppercase tracking-widest text-[clamp(1.1rem,4vw,1.4rem)] leading-none">Fin de Poste</h2>
            <span className="text-[#00E5FF] font-bold uppercase tracking-widest text-[10px]">Étape 1 : Clôture</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-[60vw] h-[60vw] max-w-[250px] max-h-[250px] border-2 border-[#00E5FF] rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(0,229,255,0.15)] mb-8">
            <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-[#00E5FF] rounded-tl-lg"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-[#00E5FF] rounded-tr-lg"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-[#00E5FF] rounded-bl-lg"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-[#00E5FF] rounded-br-lg"></div>
            <QrCode size={80} className="text-[#00E5FF] opacity-80 animate-pulse" />
          </div>
          <h3 className="text-white font-black text-xl uppercase tracking-widest text-center">Clôturer la servante</h3>
          <p className="text-gray-400 text-xs text-center mt-2 px-[10vw]">Scannez pour valider l'état final de l'outillage.</p>
          <button onClick={handleSimulateScan} className="mt-12 bg-[#00E5FF] text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs active:scale-95 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.4)]">
            <Zap size={16} /> Simuler Détection
          </button>
        </div>
      </div>
    );
  }

  if (step === 'shooting' && profile) {
    const isPlateauLibre = currentShot > profile.totalDrawers;
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden font-sans select-none">
        {showFlash && <div className="absolute inset-0 bg-white z-40 opacity-80 transition-opacity duration-150"></div>}
        <canvas ref={canvasRef} className="hidden" />
        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-80" />
        
        <div className="absolute top-0 left-0 w-full p-6 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start z-10">
          <div>
            <span className="text-[#00E5FF] font-black text-[10px] uppercase tracking-widest block mb-1">{profile.id}</span>
            <h1 className="text-white font-black text-2xl uppercase tracking-wider drop-shadow-md">
              {isPlateauLibre ? "Plateau Libre" : `Tiroir ${currentShot}/${profile.totalDrawers}`}
            </h1>
          </div>
          <button onClick={() => { if (flashOn) toggleTorch(); setStep('scan_qr'); }} className="w-10 h-10 bg-black/50 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md active:scale-90">
            <span className="text-white font-bold text-xl leading-none mb-1">×</span>
          </button>
        </div>

        <div className="absolute inset-x-[5vw] top-[20vh] bottom-[25vh] border-2 border-dashed border-[#00E5FF]/40 rounded-2xl flex items-center justify-center pointer-events-none z-10">
          <p className="text-[#00E5FF]/70 font-bold uppercase tracking-widest text-[10px] bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-sm">
            Cadrage de Clôture
          </p>
        </div>

        {eveningImages.length > 0 && (
          <div className="absolute bottom-[22vh] left-0 w-full px-[5vw] flex gap-3 overflow-x-auto no-scrollbar z-20 items-end pb-2">
            {eveningImages.map((img, idx) => (
              <div key={idx} className="relative w-14 h-14 shrink-0 rounded-lg border-2 border-[#00E5FF] overflow-hidden shadow-lg animate-in fade-in zoom-in duration-200">
                <img src={img} className="w-full h-full object-cover opacity-90" alt={`Miniature ${idx}`} />
                <div className="absolute bottom-0 left-0 w-full bg-black/80 text-[8px] text-[#00E5FF] text-center font-black py-0.5">
                  {idx === profile.totalDrawers ? 'PLAT.' : `T${idx + 1}`}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full h-[20vh] bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between z-10 pb-[env(safe-area-inset-bottom)] px-[8vw]">
          <div className="w-14 flex justify-start">
            {eveningImages.length > 0 && (
              <button onClick={handleUndo} className="w-12 h-12 bg-black/60 border border-white/20 rounded-full flex flex-col items-center justify-center active:scale-90 transition-all text-white/70 hover:text-white">
                <RotateCcw size={18} className="mb-0.5" />
                <span className="text-[6px] font-black uppercase tracking-widest">Refaire</span>
              </button>
            )}
          </div>
          <button onClick={handleCapture} className="w-[20vw] h-[20vw] max-w-[80px] max-h-[80px] rounded-full border-[4px] border-white/20 flex items-center justify-center active:scale-90 transition-transform shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className={`w-[85%] h-[85%] rounded-full transition-colors ${isPlateauLibre ? 'bg-[#FF6600]' : 'bg-[#00E5FF]'}`}></div>
          </button>
          <div className="w-14 flex justify-end">
            <button onClick={toggleTorch} className={`w-14 h-14 rounded-2xl backdrop-blur-md flex items-center justify-center border transition-all active:scale-90 ${flashOn ? 'bg-[#00E5FF]/20 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'bg-black/40 border-white/10'}`}>
              <Zap size={24} className={flashOn ? 'text-[#00E5FF] fill-[#00E5FF]' : 'text-white/50'} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'analyzing') {
    return (
      <div className="w-full h-full bg-[#121212] flex flex-col items-center justify-center px-6 text-center font-sans">
        <Loader2 size={64} className="text-[#00E5FF] mb-6 animate-spin" />
        <h2 className="text-white font-black uppercase text-2xl tracking-widest mb-2 animate-pulse">Comparaison...</h2>
        <p className="text-gray-400 text-xs uppercase tracking-widest mt-4">Traitement croisé Avant/Après en cours.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#121212] flex flex-col px-[4vw] pt-[2vh] pb-[4vh] font-sans">
      <div className="h-[10vh] flex items-center shrink-0 border-b border-white/5 mb-4">
        <h2 className="text-white font-black uppercase tracking-widest text-[clamp(1.1rem,4vw,1.4rem)] leading-none">Clôture Servante</h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-5 pb-[2vh]">
        <div className="flex gap-3">
          <button onClick={() => { setShiftStatus('CONFORME'); setSelectedTags([]); setJustification(''); }} className={`flex-1 py-4 rounded-xl flex flex-col items-center justify-center gap-2 border transition-all ${shiftStatus === 'CONFORME' ? 'bg-green-500/20 border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-[#1A1A1A] border-white/5 text-gray-500'}`}>
            <CheckCircle2 size={24} />
            <span className="font-black text-[10px] uppercase tracking-widest">Conforme</span>
          </button>
          <button onClick={() => setShiftStatus('DEGRADE')} className={`flex-1 py-4 rounded-xl flex flex-col items-center justify-center gap-2 border transition-all ${shiftStatus === 'DEGRADE' ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-[#1A1A1A] border-white/5 text-gray-500'}`}>
            <AlertOctagon size={24} />
            <span className="font-black text-[10px] uppercase tracking-widest">Incomplet</span>
          </button>
        </div>

        {shiftStatus === 'DEGRADE' && (
          <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
            <label className="text-red-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 mb-3"><AlertOctagon size={14} /> Déclaration d'anomalie</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {ANOMALY_TAGS.map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)} className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${selectedTags.includes(tag) ? 'bg-red-500 text-white border-red-500' : 'bg-black/50 text-red-300/60 border-red-500/20'}`}>{tag}</button>
              ))}
            </div>
            <textarea value={justification} onChange={(e) => setJustification(e.target.value)} placeholder="Précisions..." className="w-full bg-black/50 border border-red-500/20 rounded-lg p-3 text-white text-sm outline-none focus:border-red-500 min-h-[60px] resize-none" />
          </div>
        )}

        <h4 className="text-[#D3D3D3] font-bold text-[10px] uppercase tracking-widest pt-2 border-b border-white/10 pb-2">Clichés de Fin de Poste</h4>
        <div className="grid grid-cols-2 gap-3">
          {eveningImages.map((img, idx) => (
            <div key={idx} className="relative aspect-square bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden">
              <img src={img} alt={`Shot ${idx}`} className="w-full h-full object-cover opacity-80" />
            </div>
          ))}
        </div>
      </div>
      
      <button 
        onClick={async () => {
          if (shiftStatus === 'DEGRADE' && selectedTags.length === 0 && justification.trim() === '') { alert("Saisir un motif."); return; }
          setIsGenerating(true);
          try {
            // TRANSMISSION SATELLITE À LA TOUR DE CONTRÔLE
            const { error: dbError } = await supabase.from('servantes_status').upsert({
              id: profile?.id || 'FACOM-JET-001',
              technician_id: 'TECH-01',
              technician_name: 'Alexandre (TECH-01)',
              status: shiftStatus,
              tags: selectedTags,
              details: justification,
              updated_at: new Date().toISOString()
            });

            if (dbError) {
              console.warn("Erreur de transmission :", dbError.message);
            }

            const { pdf } = await import('@react-pdf/renderer');
            const { FinDePosteReport } = await import('../components/FinDePosteReport');
            const reportData = {
              profileId: profile?.id || 'INCONNU', profileName: profile?.name || 'Servante',
              timestamp: new Date().toLocaleString('fr-FR'),
              status: shiftStatus, tags: selectedTags, justification: justification,
              morningImages: morningImagesMock, eveningImages: eveningImages,
              totalDrawers: profile?.totalDrawers || 6
            };
            const blob = await pdf(<FinDePosteReport data={reportData} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url; link.download = `Cloture_FOD_${profile?.id}_${Date.now()}.pdf`; link.click(); URL.revokeObjectURL(url);
            onBack();
          } catch (error) { console.error("Erreur PDF:", error); setIsGenerating(false); }
        }}
        disabled={isGenerating}
        className={`mt-4 w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all flex items-center justify-center gap-3 ${shiftStatus === 'CONFORME' ? 'bg-green-600 text-white' : 'bg-[#DC2626] text-white'} ${isGenerating ? 'opacity-70 grayscale' : ''}`}
      >
        {isGenerating && <Loader2 size={18} className="animate-spin" />}
        {isGenerating ? 'Archivage en cours...' : 'Signer & Clôturer'}
      </button>
    </div>
  );
};

export default FinDePoste;
```

// ==========================================
// 📂 FICHIER : \src\modules\garage\views\GarageDashboard.tsx
// ==========================================

```tsx
import React, { useState } from 'react';
import { ArrowLeft, ScanQrCode, Mic, ClipboardCheck, Factory, Wrench, Settings, Shield, ShieldAlert, HardHat, User } from 'lucide-react';
import LiveAssistant from '../components/LiveAssistant';
import { useUserTier } from '../../../core/security/useUserTier';
import PriseDePoste from './PriseDePoste';
import TourDeControle from './TourDeControle';
import FinDePoste from './FinDePoste';
import TechProfile from './TechProfile';
import PreparationChantier from './PreparationChantier';

interface GarageDashboardProps {
  onBack?: () => void;
}

type ViewState = 'home' | 'maintenance_menu' | 'maintenance_live' | 'prepa_chantier' | 'mecanique_menu' | 'mecanique_live' | 'prise_poste' | 'fin_poste' | 'tour_controle_maint' | 'tour_controle_mec' | 'tech_profile_maint' | 'tech_profile_mec' | 'admin_settings';

const GarageDashboard: React.FC<GarageDashboardProps> = ({ onBack }) => {
  const [activeMode, setActiveMode] = useState<ViewState>('home');
  const { currentTier } = useUserTier();

  // =======================================================================
  // ROUTAGE DES VUES GLOBALES & ADMINISTRATIVES
  // =======================================================================
  if (activeMode === 'admin_settings') {
    return (
      <div className="w-full h-full bg-[#121212] flex flex-col p-6 justify-center items-center text-center font-sans">
         <Settings size={64} className="text-gray-500 mb-6 animate-[spin_10s_linear_infinite]" />
         <h2 className="text-white font-black uppercase tracking-widest text-xl mb-3">Zone Administrative</h2>
         <p className="text-gray-400 text-xs mb-8 leading-relaxed max-w-sm">
           Gestion des abonnements PRO, facturation, CGU, CGV et Politique de confidentialité. (En cours de développement).
         </p>
         <button onClick={() => setActiveMode('home')} className="px-8 py-4 bg-white/10 text-white rounded-xl font-black uppercase text-xs tracking-widest active:scale-95 transition-transform border border-white/20">
           Retour au Hub
         </button>
      </div>
    );
  }

  // =======================================================================
  // ROUTAGE UNIVERS MAINTENANCE (M5)
  // =======================================================================
  if (activeMode === 'tech_profile_maint') return <TechProfile onBack={() => setActiveMode('maintenance_menu')} />;
  if (activeMode === 'tour_controle_maint') return <TourDeControle onBack={() => setActiveMode('maintenance_menu')} />;
  if (activeMode === 'prepa_chantier') return <PreparationChantier onBack={() => setActiveMode('maintenance_menu')} />;
  if (activeMode === 'maintenance_live') return <LiveAssistant mode="maintenance" onExit={() => setActiveMode('maintenance_menu')} />;

  // =======================================================================
  // ROUTAGE UNIVERS MÉCANIQUE AUTO / PL
  // =======================================================================
  if (activeMode === 'tech_profile_mec') return <TechProfile onBack={() => setActiveMode('mecanique_menu')} />;
  if (activeMode === 'tour_controle_mec') return <TourDeControle onBack={() => setActiveMode('mecanique_menu')} />;
  if (activeMode === 'prise_poste') return <PriseDePoste onBack={() => setActiveMode('mecanique_menu')} />;
  if (activeMode === 'fin_poste') return <FinDePoste onBack={() => setActiveMode('mecanique_menu')} />;
  if (activeMode === 'mecanique_live') return <LiveAssistant mode="mecanique" onExit={() => setActiveMode('mecanique_menu')} />;

  // =======================================================================
  // VUE 1 : SOUS-MENU MAINTENANCE INDUSTRIELLE (Thème Cyan)
  // =======================================================================
  if (activeMode === 'maintenance_menu') {
    return (
      <div className="w-full h-full bg-[#121212] flex flex-col font-sans px-[4vw] pt-[2vh] pb-[1.5vh] gap-[2vh]">
        
        {/* HEADER MAINTENANCE */}
        <div className="h-[10vh] min-h-[64px] bg-[#121212] border border-[#00E5FF]/30 rounded-2xl flex items-center px-[4vw] shrink-0 shadow-lg mb-2">
          <button onClick={() => setActiveMode('home')} className="mr-4 active:scale-90 transition-transform">
            <ArrowLeft className="text-[#00E5FF]" size={24} />
          </button>
          <div className="flex flex-col min-w-0">
            <h2 className="text-[clamp(1.1rem,4vw,1.4rem)] font-black uppercase tracking-widest text-white leading-none whitespace-nowrap truncate">
              Maintenance Indus.
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF] mt-1">
              Terminal Opérateur
            </span>
          </div>
        </div>

        {/* HEADER OUTILS RAPIDES (MAINTENANCE) */}
        <header className="flex items-center justify-between mb-2 px-2 shrink-0">
          <div className="flex gap-3">
            <button onClick={() => setActiveMode('tech_profile_maint')} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors active:scale-90 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
              <User size={16} /> <span className="text-[9px] font-bold uppercase tracking-widest">Fiche Tech</span>
            </button>
            <button onClick={() => setActiveMode('tour_controle_maint')} className="flex items-center gap-2 text-[#00E5FF] hover:text-white transition-colors active:scale-90 bg-[#00E5FF]/10 px-3 py-2 rounded-lg border border-[#00E5FF]/30">
              <ShieldAlert size={16} /> <span className="text-[9px] font-bold uppercase tracking-widest">Supervision</span>
            </button>
          </div>
        </header>

        {/* BOUTON PRÉPARATION CHANTIER */}
        <button 
          onClick={() => setActiveMode('prepa_chantier')}
          className="flex-1 relative overflow-hidden bg-black border border-[#00E5FF]/50 hover:border-[#00E5FF] rounded-2xl flex flex-col justify-center items-center active:scale-[0.98] transition-all group"
        >
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,229,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.05)_1px,transparent_1px)] bg-[size:4vw_4vw]"></div>
          <HardHat className="text-[#00E5FF] mb-4 relative z-10 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]" size={56} />
          <h3 className="text-[clamp(1.5rem,5vw,2rem)] font-black uppercase tracking-widest text-white leading-none relative z-10 text-center">
            Prépa. Chantier
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2 relative z-10">
            Plan de Prévention IA & Inventaire
          </span>
        </button>

        {/* BOUTON ASSISTANT IA LIVE */}
        <button 
          onClick={() => setActiveMode('maintenance_live')}
          className="flex-1 relative overflow-hidden bg-black border border-[#D3D3D3]/50 hover:border-[#D3D3D3] rounded-2xl flex flex-col justify-center items-center active:scale-[0.98] transition-all group hover:shadow-[0_0_30px_rgba(211,211,211,0.15)]"
        >
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(211,211,211,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(211,211,211,0.05)_1px,transparent_1px)] bg-[size:4vw_4vw]"></div>
          <Mic className="text-[#D3D3D3] mb-4 relative z-10 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(211,211,211,0.3)]" size={56} />
          <h3 className="text-[clamp(1.5rem,5vw,2rem)] font-black uppercase tracking-widest text-white leading-none relative z-10 text-center">
            Assistant IA
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2 relative z-10">
            Diagnostic & Guidage Vidéo
          </span>
        </button>

      </div>
    );
  }

  // =======================================================================
  // VUE 2 : SOUS-MENU MÉCANIQUE AUTO / PL (Thème Rouge)
  // =======================================================================
  if (activeMode === 'mecanique_menu') {
    return (
      <div className="w-full h-full bg-[#121212] flex flex-col font-sans px-[4vw] pt-[2vh] pb-[1.5vh] gap-[2vh]">
        
        {/* HEADER MÉCANIQUE */}
        <div className="h-[10vh] min-h-[64px] bg-[#121212] border border-[#DC2626]/30 rounded-2xl flex items-center px-[4vw] shrink-0 shadow-lg mb-2">
          <button onClick={() => setActiveMode('home')} className="mr-4 active:scale-90 transition-transform">
            <ArrowLeft className="text-[#DC2626]" size={24} />
          </button>
          <div className="flex flex-col min-w-0">
            <h2 className="text-[clamp(1.1rem,4vw,1.4rem)] font-black uppercase tracking-widest text-white leading-none whitespace-nowrap truncate">
              Mécanique Auto & P.L.
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#DC2626] mt-1">
              Terminal Opérateur
            </span>
          </div>
        </div>

        {/* HEADER OUTILS RAPIDES (MÉCANIQUE) */}
        <header className="flex items-center justify-between mb-2 px-2 shrink-0">
          <div className="flex gap-3">
            <button onClick={() => setActiveMode('tech_profile_mec')} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors active:scale-90 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
              <User size={16} /> <span className="text-[9px] font-bold uppercase tracking-widest">Fiche Tech</span>
            </button>
            <button onClick={() => setActiveMode('tour_controle_mec')} className="flex items-center gap-2 text-[#DC2626] hover:text-white transition-colors active:scale-90 bg-[#DC2626]/10 px-3 py-2 rounded-lg border border-[#DC2626]/30">
              <ShieldAlert size={16} /> <span className="text-[9px] font-bold uppercase tracking-widest">Supervision</span>
            </button>
          </div>
        </header>

        {/* BOUTON PRISE DE POSTE */}
        <button onClick={() => setActiveMode('prise_poste')} className="flex-1 relative overflow-hidden bg-black border border-[#DC2626]/50 hover:border-[#DC2626] rounded-2xl flex flex-col justify-center items-center active:scale-[0.98] transition-all group">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(220,38,38,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.05)_1px,transparent_1px)] bg-[size:4vw_4vw]"></div>
          <ScanQrCode className="text-[#DC2626] mb-4 relative z-10 group-hover:scale-110 transition-transform" size={56} />
          <h3 className="text-[clamp(1.5rem,5vw,2rem)] font-black uppercase tracking-widest text-white leading-none relative z-10 text-center">Prise de Poste</h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2 relative z-10">Contrôle Outillage FOD</span>
        </button>

        {/* BOUTON ASSISTANT IA */}
        <button onClick={() => setActiveMode('mecanique_live')} className="flex-1 relative overflow-hidden bg-black border border-[#D3D3D3]/50 hover:border-[#D3D3D3] rounded-2xl flex flex-col justify-center items-center active:scale-[0.98] transition-all group hover:shadow-[0_0_30px_rgba(211,211,211,0.15)]">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(211,211,211,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(211,211,211,0.05)_1px,transparent_1px)] bg-[size:4vw_4vw]"></div>
          <Mic className="text-[#D3D3D3] mb-4 relative z-10 group-hover:scale-110 transition-transform" size={56} />
          <h3 className="text-[clamp(1.5rem,5vw,2rem)] font-black uppercase tracking-widest text-white leading-none relative z-10 text-center">Assistant IA</h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2 relative z-10">Diagnostic OBD2 & Guidage</span>
        </button>

        {/* BOUTON FIN DE POSTE */}
        <button onClick={() => setActiveMode('fin_poste')} className="flex-1 relative overflow-hidden bg-black border border-[#DC2626]/50 hover:border-[#DC2626] rounded-2xl flex flex-col justify-center items-center active:scale-[0.98] transition-all group">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(220,38,38,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.05)_1px,transparent_1px)] bg-[size:4vw_4vw]"></div>
          <ClipboardCheck className="text-[#DC2626] mb-4 relative z-10 group-hover:scale-110 transition-transform" size={56} />
          <h3 className="text-[clamp(1.5rem,5vw,2rem)] font-black uppercase tracking-widest text-white leading-none relative z-10 text-center">Fin de Poste</h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2 relative z-10">Rapport Anti-Perte (FOD)</span>
        </button>

      </div>
    );
  }

  // =======================================================================
  // VUE 0 : MENU PRINCIPAL (AIGUILLEUR RACINE)
  // =======================================================================
  return (
    <div className="w-full h-full bg-[#121212] flex flex-col font-sans px-[4vw] pt-[2vh] pb-[1.5vh] gap-[2vh]">
      
      {/* HEADER RACINE */}
      <div className="h-[10vh] min-h-[64px] bg-[#121212] border border-[#D3D3D3] rounded-2xl flex items-center justify-between px-[4vw] shrink-0 shadow-lg">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="active:scale-90 transition-transform">
              <ArrowLeft className="text-[#D3D3D3]" size={24} />
            </button>
          )}
          <button onClick={() => setActiveMode('admin_settings')} className="active:scale-90 transition-transform group">
            <Settings className="text-[#D3D3D3] group-hover:rotate-90 transition-transform duration-500" size={22} />
          </button>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D3D3D3]/30 bg-black">
          <Shield className={currentTier === 'FREE' ? 'text-gray-400' : 'text-[#FF6600]'} size={14} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${currentTier === 'FREE' ? 'text-gray-400' : 'text-[#FF6600]'}`}>
            {currentTier}
          </span>
        </div>
      </div>

      {/* BLOC 1 : MAINTENANCE INDUSTRIELLE */}
      <button
        onClick={() => setActiveMode('maintenance_menu')}
        className="flex-1 relative overflow-hidden bg-black border border-[#00E5FF]/50 hover:border-[#00E5FF] rounded-2xl flex flex-col justify-center items-center active:scale-[0.98] transition-all group"
      >
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,229,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.05)_1px,transparent_1px)] bg-[size:4vw_4vw]"></div>
        
        <Factory size={64} className="text-[#D3D3D3] mb-6 relative z-10 group-hover:scale-110 transition-transform" />
        <h2 className="text-white font-black text-[clamp(1.5rem,5vw,2rem)] uppercase tracking-tighter mb-2 text-center leading-tight relative z-10">
          Maintenance<br/>Industrielle
        </h2>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest text-center mb-8 relative z-10">
          Usines • Stations • Automatisme
        </p>
        <div className="flex items-center gap-2 text-[#00E5FF] font-black text-[10px] uppercase tracking-[0.2em] bg-[#00E5FF]/10 px-6 py-3 rounded-full border border-[#00E5FF]/30 relative z-10 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
          Système OSA/CBM
        </div>
      </button>

      {/* BLOC 2 : MÉCANIQUE AUTO & P.L. */}
      <button
        onClick={() => setActiveMode('mecanique_menu')}
        className="flex-1 relative overflow-hidden bg-black border border-[#DC2626]/50 hover:border-[#DC2626] rounded-2xl flex flex-col justify-center items-center active:scale-[0.98] transition-all group"
      >
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(220,38,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.05)_1px,transparent_1px)] bg-[size:4vw_4vw]"></div>
        
        <Wrench size={64} className="text-[#D3D3D3] mb-6 relative z-10 group-hover:scale-110 transition-transform" />
        <h2 className="text-white font-black text-[clamp(1.5rem,5vw,2rem)] uppercase tracking-tighter mb-2 text-center leading-tight relative z-10">
          Mécanique<br/>Auto & P.L.
        </h2>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest text-center mb-8 relative z-10">
          Véhicules Légers • Poids Lourds
        </p>
        <div className="flex items-center gap-2 text-[#DC2626] font-black text-[10px] uppercase tracking-[0.2em] bg-[#DC2626]/10 px-6 py-3 rounded-full border border-[#DC2626]/30 relative z-10 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
          Diagnostic OBD2
        </div>
      </button>

    </div>
  );
};

export default GarageDashboard;
```

// ==========================================
// 📂 FICHIER : \src\modules\garage\views\PreparationChantier.tsx
// ==========================================

```tsx
import React, { useState } from 'react';
import { ArrowLeft, HardHat, AlertTriangle, Hammer, Wrench, ShieldAlert, Loader2, Send } from 'lucide-react';
import { geminiService } from '../../../core/ai/geminiService';
import { getInventory } from '../../../core/storage/memoryService';

interface PreparationChantierProps {
  onBack: () => void;
}

const PreparationChantier: React.FC<PreparationChantierProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prepData, setPrepData] = useState<any>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setPrepData(null);

    // On récupère l'inventaire actuel pour que l'IA sache ce qu'on possède
    const tools = getInventory().map(t => t.toolName).join(', ');

    const result = await geminiService.generateChantierPrep(prompt, tools);
    setPrepData(result);
    setIsGenerating(false);
  };

  return (
    <div className="w-full h-full bg-[#121212] flex flex-col font-sans px-[4vw] pt-[2vh] pb-[4vh]">
      
      {/* HEADER */}
      <div className="h-[10vh] flex items-center shrink-0 border-b border-white/5 mb-6">
        <button onClick={onBack} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
          <ArrowLeft className="text-white" size={24} />
        </button>
        <div className="ml-4 flex flex-col">
          <h2 className="text-white font-black uppercase tracking-widest text-[clamp(1.1rem,4vw,1.4rem)] leading-none">
            Prépa. Chantier
          </h2>
          <span className="text-[#00E5FF] font-bold uppercase tracking-widest text-[10px] mt-1">
            Analyse IA & Outillage
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
        
        {/* ZONE DE SAISIE */}
        <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-white/10 shadow-inner">
          <label className="flex items-center gap-2 text-[#00E5FF] text-[10px] font-black uppercase tracking-widest mb-3">
            <Wrench size={14} /> Description de l'intervention
          </label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Remplacement du moteur de la pompe de relevage P2 (400V)..."
            className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-4 focus:border-[#00E5FF] outline-none transition-colors text-sm min-h-[100px] resize-none"
          />
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={`w-full mt-4 py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${
              isGenerating || !prompt.trim() 
                ? 'bg-white/5 text-gray-500 cursor-not-allowed' 
                : 'bg-[#00E5FF] text-black shadow-[0_0_20px_rgba(0,229,255,0.3)] active:scale-95'
            }`}
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {isGenerating ? 'Analyse IA en cours...' : 'Générer le Plan de Prévention'}
          </button>
        </div>

        {/* RÉSULTAT IA */}
        {prepData && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            
            <div className="bg-[#00E5FF]/10 border border-[#00E5FF]/30 p-4 rounded-xl">
              <h3 className="text-[#00E5FF] font-black uppercase text-sm">{prepData.titre}</h3>
            </div>

            {/* RISQUES & EPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-red-950/30 border border-red-500/20 p-4 rounded-xl">
                <h4 className="text-red-400 font-bold uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2">
                  <AlertTriangle size={14} /> Analyse des Risques
                </h4>
                <ul className="space-y-2">
                  {prepData.analyseRisques.map((risque: string, i: number) => (
                    <li key={i} className="text-white/80 text-xs flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span> {risque}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-orange-950/30 border border-orange-500/20 p-4 rounded-xl">
                <h4 className="text-orange-400 font-bold uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2">
                  <HardHat size={14} /> EPI Obligatoires
                </h4>
                <div className="flex flex-wrap gap-2">
                  {prepData.epiRequis.map((epi: string, i: number) => (
                    <span key={i} className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-1 rounded text-[10px] font-bold uppercase">
                      {epi}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* OUTILLAGE */}
            <div className="bg-[#1A1A1A] border border-white/10 p-4 rounded-xl">
              <h4 className="text-white font-bold uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2">
                <Hammer size={14} className="text-[#00E5FF]" /> Outillage Recommandé
              </h4>
              <div className="space-y-2">
                {prepData.outillageRecommande.map((outil: any, i: number) => (
                  <div key={i} className="flex items-center justify-between bg-black/50 p-2.5 rounded-lg border border-white/5">
                    <span className="text-white/90 text-xs font-bold">{outil.nom}</span>
                    {outil.possede ? (
                      <span className="text-green-500 text-[9px] font-black uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded border border-green-500/20">En stock</span>
                    ) : (
                      <span className="text-red-400 text-[9px] font-black uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded border border-red-500/20">À préparer</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* PIÈCES */}
            {prepData.piecesRechange && prepData.piecesRechange.length > 0 && (
              <div className="bg-[#1A1A1A] border border-white/10 p-4 rounded-xl">
                <h4 className="text-white font-bold uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2">
                  <ShieldAlert size={14} className="text-yellow-500" /> Pièces & Consommables
                </h4>
                <div className="flex flex-wrap gap-2">
                  {prepData.piecesRechange.map((piece: string, i: number) => (
                    <span key={i} className="text-gray-300 text-xs bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10">
                      {piece}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default PreparationChantier;
```

// ==========================================
// 📂 FICHIER : \src\modules\garage\views\PriseDePoste.tsx
// ==========================================

```tsx
import React, { useState, useRef, useEffect } from 'react';
import { QrCode, ArrowLeft, CheckCircle2, Zap, Loader2, RotateCcw, AlertOctagon } from 'lucide-react';
import { geminiService } from '../../../core/ai/geminiService';
import { supabase } from '../../../core/security/supabaseClient';

interface PriseDePosteProps {
  onBack: () => void;
}

interface ServanteProfile {
  id: string;
  name: string;
  totalDrawers: number;
  foamColor: string;
}

type Step = 'scan_qr' | 'shooting' | 'analyzing' | 'report';
type ShiftStatus = 'CONFORME' | 'DEGRADE';

// NOUVEAU : Les motifs terrains récurrents
const ANOMALY_TAGS = [
  "Outil sur chantier",
  "Rangement chaos",
  "Outil cassé / rebut",
  "Outil perdu / volé"
];

// NOUVEAU : LE CATALOGUE ISSU DE TES PDF
const SERVANTE_CATALOG: Record<string, ServanteProfile> = {
  "JETM4X-FDW": {
    id: "JETM4X-FDW",
    name: "Servante FACOM JET M4 (8 Tiroirs)",
    totalDrawers: 8,
    foamColor: "Rouge"
  },
  "OPSIAL-MEC": {
    id: "OPSIAL-MEC",
    name: "Servante OPSIAL Standard (6 Tiroirs)",
    totalDrawers: 6,
    foamColor: "Noir"
  }
};

const PriseDePoste: React.FC<PriseDePosteProps> = ({ onBack }) => {
  const [step, setStep] = useState<Step>('scan_qr');
  const [profile, setProfile] = useState<ServanteProfile | null>(null);
  
  const [currentShot, setCurrentShot] = useState<number>(1);
  const [flashOn, setFlashOn] = useState(false);
  const [showFlash, setShowFlash] = useState(false); 
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  
  const [shiftStatus, setShiftStatus] = useState<ShiftStatus>('CONFORME');
  const [justification, setJustification] = useState<string>('');
  // NOUVEAU : Stockage des tags sélectionnés
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // =========================================================
  // 1. PREMIER CERVEAU : GESTION DE LA CAMÉRA
  // =========================================================
  useEffect(() => {
    if (step === 'shooting') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Erreur caméra:", err));
    }
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [step]);

  // =========================================================
  // 2. DEUXIÈME CERVEAU : L'ANALYSE IA (BIEN SÉPARÉ !)
  // =========================================================
  useEffect(() => {
    if (step === 'analyzing' && capturedImages.length > 0) {
      const runAI = async () => {
        try {
          const analysis = await geminiService.analyzeServanteFOD(capturedImages, profile?.id);

          if (analysis) {
            setShiftStatus(analysis.status as ShiftStatus);
            if (analysis.status === 'DEGRADE') {
              if (analysis.tags) setSelectedTags(analysis.tags);
              if (analysis.justification) setJustification(analysis.justification);
            }
          }
        } catch (error) {
          console.error("Erreur lors de l'analyse IA:", error);
        } finally {
          setStep('report');
        }
      };

      runAI();
    }
  }, [step, capturedImages, profile?.id]);
  // =========================================================

  const toggleTorch = async () => {
    if (!videoRef.current?.srcObject) return;
    const track = (videoRef.current.srcObject as MediaStream).getVideoTracks()[0];
    const capabilities = track.getCapabilities() as any;
    if (capabilities.torch) {
      try {
        const newState = !flashOn;
        await track.applyConstraints({ advanced: [{ torch: newState }] } as any);
        setFlashOn(newState);
      } catch (err) { 
        console.error("Erreur Torche:", err); 
      }
    }
  };

  const handleSimulateScan = () => {
    // On simule le fait que la caméra vient de lire le QR Code "JETM4X-FDW"
    const scannedCode = "JETM4X-FDW";
    const foundProfile = SERVANTE_CATALOG[scannedCode];

    if (foundProfile) {
      setProfile(foundProfile);
      setCapturedImages([]);
      setCurrentShot(1);
      setShiftStatus('CONFORME');
      setJustification('');
      setSelectedTags([]);
      setStep('shooting');
    } else {
      alert("QR Code inconnu au bataillon.");
    }
  };

  const handleCapture = () => {
    if (!profile || !videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context && video.videoWidth > 0) {
      // On force un ratio Paysage standard (16:9)
      const targetWidth = 1280;
      const targetHeight = 720; 

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // On dessine l'image en forçant le remplissage du rectangle 16:9
      // (Cela évite les bandes noires si l'écran du tel a un ratio bizarre)
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // On compresse légèrement plus (0.6) car les images larges pèsent plus lourd dans le PDF
      const base64Image = canvas.toDataURL('image/jpeg', 0.6);
      setCapturedImages(prev => [...prev, base64Image]);
    }

    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 150);

    const maxShots = profile.totalDrawers + 1;

    if (currentShot < maxShots) {
      setCurrentShot(prev => prev + 1);
    } else {
      if (flashOn) toggleTorch();
      
      // On passe en mode 'analyzing'. 
      // Le useEffect que l'on vient de créer va détecter ça et lancer l'IA automatiquement !
      setStep('analyzing'); 
    }
  };

  const handleUndo = () => {
    if (capturedImages.length > 0) {
      setCapturedImages(prev => prev.slice(0, -1));
      setCurrentShot(prev => prev - 1);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // ==========================================
  // VUE 1 : LE SCAN DU QR CODE
  // ==========================================
  if (step === 'scan_qr') {
    return (
      <div className="w-full h-full bg-[#121212] flex flex-col px-[4vw] pt-[2vh] pb-[4vh] font-sans">
        <div className="h-[10vh] flex items-center shrink-0">
          <button onClick={onBack} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
            <ArrowLeft className="text-white" size={24} />
          </button>
          <div className="ml-4">
            <h2 className="text-white font-black uppercase tracking-widest text-[clamp(1.1rem,4vw,1.4rem)] leading-none">Fin / Prise Poste</h2>
            <span className="text-[#D3D3D3] font-bold uppercase tracking-widest text-[10px]">Étape 1 : Identification</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-[60vw] h-[60vw] max-w-[250px] max-h-[250px] border-2 border-[#DC2626] rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.15)] mb-8">
            <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-[#DC2626] rounded-tl-lg"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-[#DC2626] rounded-tr-lg"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-[#DC2626] rounded-bl-lg"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-[#DC2626] rounded-br-lg"></div>
            <QrCode size={80} className="text-[#DC2626] opacity-80 animate-pulse" />
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#FF6600] shadow-[0_0_15px_#FF6600]"></div>
          </div>
          
          <h3 className="text-white font-black text-xl uppercase tracking-widest text-center">Scanner la servante</h3>
          <p className="text-gray-400 text-xs text-center mt-2 px-[10vw]">
            Visez le QR Code principal situé sur le flanc ou le plateau de votre servante.
          </p>

          <button 
            onClick={handleSimulateScan}
            className="mt-12 bg-[#DC2626] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs active:scale-95 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
          >
            <Zap size={16} /> Simuler Détection
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VUE 2 : LE MITRAILLAGE
  // ==========================================
  if (step === 'shooting' && profile) {
    const isPlateauLibre = currentShot > profile.totalDrawers;

    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden font-sans select-none">
        {showFlash && <div className="absolute inset-0 bg-white z-40 opacity-80 transition-opacity duration-150"></div>}
        
        <canvas ref={canvasRef} className="hidden" />

        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-80" />

        <div className="absolute top-0 left-0 w-full p-6 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start z-10">
          <div>
            <span className="text-[#DC2626] font-black text-[10px] uppercase tracking-widest block mb-1">
              {profile.id}
            </span>
            <h1 className="text-white font-black text-2xl uppercase tracking-wider drop-shadow-md">
              {isPlateauLibre ? "Plateau Libre" : `Tiroir ${currentShot}/${profile.totalDrawers}`}
            </h1>
          </div>
          <button onClick={() => {
            if (flashOn) toggleTorch();
            setStep('scan_qr');
          }} className="w-10 h-10 bg-black/50 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md active:scale-90">
            <span className="text-white font-bold text-xl leading-none mb-1">×</span>
          </button>
        </div>

        <div className="absolute inset-x-[5vw] top-[20vh] bottom-[25vh] border-2 border-dashed border-white/30 rounded-2xl flex items-center justify-center pointer-events-none z-10">
          <p className="text-white/50 font-bold uppercase tracking-widest text-[10px] bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
            {isPlateauLibre ? "Cadrer le dessus de la servante" : "Aligner le tiroir complet ici"}
          </p>
        </div>

        {capturedImages.length > 0 && (
          <div className="absolute bottom-[22vh] left-0 w-full px-[5vw] flex gap-3 overflow-x-auto no-scrollbar z-20 items-end pb-2">
            {capturedImages.map((img, idx) => (
              <div key={idx} className="relative w-14 h-14 shrink-0 rounded-lg border-2 border-[#DC2626] overflow-hidden shadow-lg animate-in fade-in zoom-in duration-200">
                <img src={img} className="w-full h-full object-cover opacity-90" alt={`Miniature ${idx}`} />
                <div className="absolute bottom-0 left-0 w-full bg-black/80 text-[8px] text-white text-center font-black py-0.5">
                  {idx === profile.totalDrawers ? 'PLAT.' : `T${idx + 1}`}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full h-[20vh] bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between z-10 pb-[env(safe-area-inset-bottom)] px-[8vw]">
          <div className="w-14 flex justify-start">
            {capturedImages.length > 0 && (
              <button onClick={handleUndo} className="w-12 h-12 bg-black/60 border border-white/20 rounded-full flex flex-col items-center justify-center active:scale-90 transition-all text-white/70 hover:text-white">
                <RotateCcw size={18} className="mb-0.5" />
                <span className="text-[6px] font-black uppercase tracking-widest">Refaire</span>
              </button>
            )}
          </div>

          <button onClick={handleCapture} className="w-[20vw] h-[20vw] max-w-[80px] max-h-[80px] rounded-full border-[4px] border-white/20 flex items-center justify-center active:scale-90 transition-transform shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className={`w-[85%] h-[85%] rounded-full transition-colors ${isPlateauLibre ? 'bg-[#FF6600]' : 'bg-white'}`}></div>
          </button>

          <div className="w-14 flex justify-end">
            <button onClick={toggleTorch} className={`w-14 h-14 rounded-2xl backdrop-blur-md flex items-center justify-center border transition-all active:scale-90 ${flashOn ? 'bg-[#DC2626]/20 border-[#DC2626] shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-black/40 border-white/10'}`}>
              <Zap size={24} className={flashOn ? 'text-[#DC2626] fill-[#DC2626]' : 'text-white/50'} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VUE 3 : EN COURS D'ANALYSE
  // ==========================================
  if (step === 'analyzing') {
    return (
      <div className="w-full h-full bg-[#121212] flex flex-col items-center justify-center px-6 text-center font-sans">
        <Loader2 size={64} className="text-[#D3D3D3] mb-6 animate-spin" />
        <h2 className="text-white font-black uppercase text-2xl tracking-widest mb-2 animate-pulse">
          Compilation...
        </h2>
        <p className="text-gray-400 text-xs uppercase tracking-widest mt-4">
          Traitement de {capturedImages.length} clichés en cours.
        </p>
      </div>
    );
  }

  // ==========================================
  // VUE 4 : LE RAPPORT / SAS DE VALIDATION
  // ==========================================
  return (
    <div className="w-full h-full bg-[#121212] flex flex-col px-[4vw] pt-[2vh] pb-[4vh] font-sans">
      <div className="h-[10vh] flex items-center shrink-0 border-b border-white/5 mb-4">
        <h2 className="text-white font-black uppercase tracking-widest text-[clamp(1.1rem,4vw,1.4rem)] leading-none">
          Bilan Servante
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-5 pb-[2vh]">
        
        <div className="flex gap-3">
          <button 
            onClick={() => {
              setShiftStatus('CONFORME');
              setSelectedTags([]);
              setJustification('');
            }}
            className={`flex-1 py-4 rounded-xl flex flex-col items-center justify-center gap-2 border transition-all ${
              shiftStatus === 'CONFORME' 
                ? 'bg-green-500/20 border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
                : 'bg-[#1A1A1A] border-white/5 text-gray-500'
            }`}
          >
            <CheckCircle2 size={24} />
            <span className="font-black text-[10px] uppercase tracking-widest">Conforme</span>
          </button>

          <button 
            onClick={() => setShiftStatus('DEGRADE')}
            className={`flex-1 py-4 rounded-xl flex flex-col items-center justify-center gap-2 border transition-all ${
              shiftStatus === 'DEGRADE' 
                ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                : 'bg-[#1A1A1A] border-white/5 text-gray-500'
            }`}
          >
            <AlertOctagon size={24} />
            <span className="font-black text-[10px] uppercase tracking-widest">Incomplet</span>
          </button>
        </div>

        {/* ZONE DE JUSTIFICATION DYNAMIQUE */}
        {shiftStatus === 'DEGRADE' && (
          <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
            <label className="text-red-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 mb-3">
              <AlertOctagon size={14} /> Déclaration d'anomalie
            </label>
            
            {/* NOUVEAU : QUICK TAGS */}
            <div className="flex flex-wrap gap-2 mb-4">
              {ANOMALY_TAGS.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button 
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${
                      isSelected 
                        ? 'bg-red-500 text-white border-red-500' 
                        : 'bg-black/50 text-red-300/60 border-red-500/20 hover:border-red-500/50'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            <textarea 
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Précisions (ex: Pince étau sur vanne 4, signalée hier)..."
              className="w-full bg-black/50 border border-red-500/20 rounded-lg p-3 text-white text-sm outline-none focus:border-red-500 min-h-[60px] resize-none"
            />
          </div>
        )}

        <h4 className="text-[#D3D3D3] font-bold text-[10px] uppercase tracking-widest pt-2 border-b border-white/10 pb-2">
          Clichés enregistrés ({capturedImages.length})
        </h4>

        <div className="grid grid-cols-2 gap-3">
          {capturedImages.map((img, idx) => {
            const isPlateau = idx === capturedImages.length - 1;
            return (
              <div key={idx} className="relative aspect-square bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden">
                <img src={img} alt={`Shot ${idx}`} className="w-full h-full object-cover opacity-80" />
                <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-md p-1.5 text-center border-t border-white/10">
                  <span className="text-[9px] font-black uppercase text-white tracking-widest">
                    {isPlateau ? 'Plateau' : `Tiroir ${idx + 1}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
      
      <button 
        onClick={async () => {
          if (shiftStatus === 'DEGRADE' && selectedTags.length === 0 && justification.trim() === '') {
            alert("Veuillez sélectionner un motif ou saisir une précision.");
            return;
          }
          
          setIsGenerating(true);

          try {
            // =========================================================
            // NOUVEAU : TRANSMISSION SATELLITE À LA TOUR DE CONTRÔLE
            // =========================================================
            const { error: dbError } = await supabase.from('servantes_status').upsert({
              id: profile?.id || 'FACOM-JET-001',
              technician_id: 'TECH-01',
              technician_name: 'Alexandre (TECH-01)',
              status: shiftStatus,
              tags: selectedTags,
              details: justification,
              updated_at: new Date().toISOString()
            });

            if (dbError) {
              console.warn("Erreur de transmission :", dbError.message);
            }
            // =========================================================
            const { pdf } = await import('@react-pdf/renderer');
            const { PriseDePosteReport } = await import('../components/PriseDePosteReport');

            const reportData = {
              profileId: profile?.id || 'INCONNU',
              profileName: profile?.name || 'Servante',
              timestamp: new Date().toLocaleString('fr-FR'),
              status: shiftStatus,
              tags: selectedTags, // Transmission des tags au PDF
              justification: justification,
              images: capturedImages,
              totalDrawers: profile?.totalDrawers || 6
            };

            const blob = await pdf(<PriseDePosteReport data={reportData} />).toBlob();
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Certificat_FOD_${profile?.id}_${Date.now()}.pdf`;
            link.click();
            URL.revokeObjectURL(url);

          // NOUVEAU : On sauvegarde les photos dans le cache du téléphone pour ce soir !
            localStorage.setItem(`locatem5_morning_${profile?.id}`, JSON.stringify(capturedImages))

            onBack();
          } catch (error) {
            console.error("Erreur PDF:", error);
            alert("Erreur lors de la génération du certificat.");
            setIsGenerating(false);
          }
        }}
        disabled={isGenerating}
        className={`mt-4 w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all shrink-0 flex items-center justify-center gap-3 ${
          shiftStatus === 'CONFORME'
            ? 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_20px_rgba(22,163,74,0.4)]'
            : 'bg-[#DC2626] hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]'
        } ${isGenerating ? 'opacity-70 cursor-not-allowed grayscale' : ''}`}
      >
        {isGenerating && <Loader2 size={18} className="animate-spin" />}
        {isGenerating ? 'Cryptage en cours...' : 'Signer & Clôturer'}
      </button>
    </div>
  );
};

export default PriseDePoste;
```

// ==========================================
// 📂 FICHIER : \src\modules\garage\views\TechProfile.tsx
// ==========================================

```tsx
import React, { useState } from 'react';
import { ArrowLeft, Camera, Zap, ShieldCheck, HardHat } from 'lucide-react';
import { useAppSettings } from '../../../core/storage/useAppSettings';
import PassportScanner from '../components/PassportScanner';

interface TechProfileProps {
  onBack: () => void;
}

const TechProfile: React.FC<TechProfileProps> = ({ onBack }) => {
  const { settings, updateSettings } = useAppSettings();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  return (
    <div className="w-full h-full bg-[#121212] flex flex-col font-sans px-[4vw] pt-[2vh] pb-[4vh]">
      
      {/* HEADER */}
      <div className="h-[10vh] flex items-center shrink-0 border-b border-white/5 mb-6">
        <button onClick={onBack} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
          <ArrowLeft className="text-white" size={24} />
        </button>
        <div className="ml-4 flex flex-col">
          <h2 className="text-white font-black uppercase tracking-widest text-[clamp(1.1rem,4vw,1.4rem)] leading-none">
            Fiche Technicien
          </h2>
          <span className="text-[#00E5FF] font-bold uppercase tracking-widest text-[10px] mt-1">
            Habilitations & Sécurité M5
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
        
        {/* BOUTON IA SCANNER */}
        <button 
          onClick={() => setIsScannerOpen(true)}
          className="w-full bg-[#00E5FF]/10 border border-[#00E5FF]/50 text-[#00E5FF] py-6 rounded-2xl flex flex-col items-center justify-center gap-3 active:scale-95 transition-all hover:bg-[#00E5FF] hover:text-black shadow-[0_0_20px_rgba(0,229,255,0.15)] group"
        >
          <div className="flex items-center gap-3">
            <Camera size={28} />
            <span className="font-black uppercase tracking-widest text-sm">Scanner Passeport Sécurité</span>
            <Zap size={20} className="animate-pulse" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 group-hover:opacity-100">
            Extraction OCR Automatique (CACES, BR, B0...)
          </span>
        </button>

        {/* AFFICHAGE DES BADGES */}
        <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-white/10 shadow-inner">
          <h3 className="text-gray-500 text-[10px] uppercase tracking-widest font-black mb-4 flex items-center gap-2">
            <ShieldCheck size={14} className="text-green-500" /> Habilitations Actives
          </h3>
          
          {settings.userProfile?.habilitations && settings.userProfile.habilitations.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {settings.userProfile.habilitations.map((hab, idx) => (
                <span key={idx} className="bg-green-500/20 border border-green-500/50 text-green-400 px-3 py-1.5 rounded-lg text-[11px] font-black tracking-wider uppercase shadow-[0_0_10px_rgba(34,197,94,0.1)] flex items-center gap-1.5">
                  <HardHat size={12} /> {hab}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 border-2 border-dashed border-white/10 rounded-xl">
              <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">Aucune habilitation enregistrée</span>
            </div>
          )}
        </div>

        {/* FORMULAIRE IDENTITÉ */}
        <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-white/10 flex flex-col gap-4">
          <div>
            <label className="block text-[#00E5FF] text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1">Identité Opérateur</label>
            <input 
              type="text" 
              value={settings.userProfile?.fullName || ''} 
              onChange={(e) => updateSettings({ userProfile: { ...(settings.userProfile || { fullName: '', company: '', address: '' }), fullName: e.target.value } })}
              placeholder="Nom et Prénom"
              className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-4 focus:border-[#00E5FF] outline-none transition-colors text-sm font-bold"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[#00E5FF] text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1">Entreprise</label>
              <input 
                type="text" 
                value={settings.userProfile?.company || ''} 
                onChange={(e) => updateSettings({ userProfile: { ...(settings.userProfile || { fullName: '', company: '', address: '' }), company: e.target.value } })}
                placeholder="Employeur"
                className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-4 focus:border-[#00E5FF] outline-none transition-colors text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[#00E5FF] text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1">Matricule</label>
              <input 
                type="text" 
                value={settings.userProfile?.techId || ''} 
                onChange={(e) => updateSettings({ userProfile: { ...(settings.userProfile || { fullName: '', company: '', address: '' }), techId: e.target.value } })}
                placeholder="TECH-001"
                className="w-full bg-[#0A0A0A] border border-[#00E5FF]/30 text-[#00E5FF] rounded-xl p-4 focus:border-[#00E5FF] outline-none transition-colors text-sm font-mono font-black"
              />
            </div>
          </div>
        </div>

      </div>

      <PassportScanner 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onSuccess={(data) => {
          updateSettings({ 
            userProfile: { 
              ...(settings.userProfile || { address: '' }), 
              fullName: data.fullName || settings.userProfile?.fullName || '',
              company: data.company || settings.userProfile?.company || '',
              techId: data.techId || settings.userProfile?.techId || '',
              habilitations: data.habilitations || []
            } 
          });
          setIsScannerOpen(false);
        }} 
      />
    </div>
  );
};

export default TechProfile;
```

// ==========================================
// 📂 FICHIER : \src\modules\garage\views\TourDeControle.tsx
// ==========================================

```tsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldAlert, CheckCircle2, AlertOctagon, Activity, Wrench, BellRing, Loader2 } from 'lucide-react';
import { supabase } from '../../../core/security/supabaseClient';

interface TourDeControleProps {
  onBack: () => void;
}

interface ServanteStatus {
  id: string;
  technician_id: string;
  technician_name: string;
  status: 'CONFORME' | 'DEGRADE' | 'EN_ATTENTE';
  tags: string[];
  details: string;
  updated_at: string;
}

const TourDeControle: React.FC<TourDeControleProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'ALERTS'>('ALL');
  const [fleet, setFleet] = useState<ServanteStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // NOUVEAU : Chargement de la BDD et écoute en temps réel
  useEffect(() => {
    fetchFleet();

    // On s'abonne aux modifications en direct sur Supabase
    const channel = supabase
      .channel('public:servantes_status')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'servantes_status' }, (payload) => {
        console.log("Mise à jour captée en direct :", payload);
        fetchFleet(); // On recharge les données à chaque signal
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchFleet = async () => {
    const { data, error } = await supabase
      .from('servantes_status')
      .select('*')
      .order('id', { ascending: true });

    if (!error && data) {
      setFleet(data as ServanteStatus[]);
    } else {
      console.error("Erreur de récupération :", error);
    }
    setIsLoading(false);
  };

  const anomaliesCount = fleet.filter(s => s.status === 'DEGRADE').length;
  const displayFleet = activeTab === 'ALERTS' ? fleet.filter(s => s.status === 'DEGRADE') : fleet;

  return (
    <div className="w-full h-full bg-[#121212] flex flex-col font-sans">
      
      {/* HEADER TACTIQUE */}
      <div className="h-[12vh] shrink-0 bg-[#1A1A1A] border-b border-white/10 flex items-center justify-between px-[4vw]">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-12 h-12 bg-black/20 rounded-xl flex items-center justify-center border border-white/5 active:scale-90 transition-transform">
            <ArrowLeft className="text-white" size={24} />
          </button>
          <div>
            <h2 className="text-white font-black uppercase tracking-widest text-lg leading-none flex items-center gap-2">
              <Activity size={18} className="text-[#00E5FF]" /> Supervision
            </h2>
            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
              Tour de Contrôle M5 
              {isLoading ? <Loader2 size={10} className="animate-spin text-[#00E5FF]" /> : <span className="text-green-500">● LIVE</span>}
            </span>
          </div>
        </div>
        
        {anomaliesCount > 0 && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-full animate-pulse">
            <BellRing size={14} className="text-red-500" />
            <span className="text-red-500 font-black text-[10px] tracking-widest">{anomaliesCount} ALERTE(S)</span>
          </div>
        )}
      </div>

      {/* KPI / FILTRES */}
      <div className="p-[4vw] flex gap-3">
        <button onClick={() => setActiveTab('ALL')} className={`flex-1 py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${activeTab === 'ALL' ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5 opacity-50'}`}>
          <span className="text-white font-black text-lg leading-none">{fleet.length}</span>
          <span className="text-gray-400 font-bold uppercase tracking-widest text-[8px]">Flotte Totale</span>
        </button>
        <button onClick={() => setActiveTab('ALERTS')} className={`flex-1 py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${activeTab === 'ALERTS' ? 'bg-red-500/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-transparent border-red-500/20 opacity-50'}`}>
          <span className="text-red-500 font-black text-lg leading-none">{anomaliesCount}</span>
          <span className="text-red-500 font-bold uppercase tracking-widest text-[8px]">Anomalies FOD</span>
        </button>
      </div>

      {/* LISTE DES SERVANTES (Données Réelles) */}
      <div className="flex-1 overflow-y-auto px-[4vw] space-y-3 pb-6 no-scrollbar">
        <h3 className="text-[#D3D3D3] font-bold text-[10px] uppercase tracking-widest mb-4 border-b border-white/10 pb-2">
          État du Parc Outillage
        </h3>

        {isLoading && fleet.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-50">
             <Loader2 size={32} className="text-white animate-spin mb-4" />
             <span className="text-white text-xs tracking-widest uppercase">Connexion satellite...</span>
          </div>
        ) : displayFleet.map((servante) => {
          
          // Formatage de l'heure (ex: 08:15)
          const timeString = new Date(servante.updated_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

          return (
            <div key={servante.id} className="bg-[#1A1A1A] border border-white/5 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${servante.status === 'CONFORME' ? 'bg-green-500' : servante.status === 'DEGRADE' ? 'bg-red-500' : 'bg-gray-600'}`} />

              <div className="flex justify-between items-start pl-2">
                <div>
                  <h4 className="text-white font-black text-sm uppercase tracking-wider">{servante.id}</h4>
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest flex items-center gap-1 mt-1">
                    <Wrench size={10} /> {servante.technician_name || 'Non assigné'}
                  </p>
                </div>
                
                <div className={`px-2 py-1 rounded border flex items-center gap-1.5 ${servante.status === 'CONFORME' ? 'bg-green-500/10 border-green-500/30 text-green-500' : servante.status === 'DEGRADE' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                  {servante.status === 'CONFORME' && <CheckCircle2 size={12} />}
                  {servante.status === 'DEGRADE' && <AlertOctagon size={12} />}
                  {servante.status === 'EN_ATTENTE' && <ShieldAlert size={12} />}
                  <span className="font-black text-[9px] tracking-widest">{servante.status}</span>
                </div>
              </div>

              {servante.status === 'DEGRADE' && (
                <div className="mt-2 bg-red-950/30 border border-red-500/20 rounded-lg p-3 pl-4 relative">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {servante.tags && servante.tags.map(tag => (
                      <span key={tag} className="bg-red-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {servante.details && <p className="text-red-200/70 text-xs italic">"{servante.details}"</p>}
                </div>
              )}
              
              <div className="text-right mt-1">
                <span className="text-gray-600 font-bold text-[9px] uppercase tracking-widest">
                  MÀJ : {timeString}
                </span>
              </div>
            </div>
          );
        })}

        {!isLoading && displayFleet.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-10 font-bold uppercase tracking-widest">
            Aucune anomalie détectée.
          </div>
        )}
      </div>
    </div>
  );
};

export default TourDeControle;
```

// ==========================================
// 📂 FICHIER : \src\modules\home\components\HomeMenu.tsx
// ==========================================

```tsx
// ==========================================
// 📂 FICHIER : \src\modules\home\components\HomeMenu.tsx
// ==========================================
import React from 'react';

interface HomeMenuProps {
  onNavigate: (view: 'inventory' | 'scanner' | 'search' | 'settings' | any) => void;
  tier: string;
}

const HomeMenu: React.FC<HomeMenuProps> = ({ onNavigate, tier }) => {
  return (
    <div className="h-full w-full flex flex-col justify-between px-[5vw] pt-[1vh] pb-[3vh] overflow-hidden font-sans">
      
      {/* ========================================== */}
      {/* STRATE HAUTE (Contrôles du Module)         */}
      {/* ========================================== */}
      <div className="w-full flex justify-between items-center shrink-0">
        
        {/* Badge Néon Orange (Hauteur standardisée h-14) */}
        <div className="h-14 bg-[#121212] px-[4vw] sm:px-5 rounded-full border border-[#FF6600]/50 shadow-[0_0_15px_rgba(255,102,0,0.4),inset_0_0_10px_rgba(255,102,0,0.2)] flex items-center justify-center">
          <span className="text-[clamp(0.6rem,4vw,0.7rem)] font-black uppercase tracking-widest bg-[linear-gradient(180deg,#ffffff,#c0c0c0,#8a8a8a,#ffffff)] bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            {tier}
          </span>
        </div>

        {/* Bouton Paramètres (Format standard w-14 h-14) */}
        <button 
          onClick={() => onNavigate('settings')} 
          className="w-14 h-14 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity active:scale-90 shrink-0"
        >
          <img 
            src="/gear.png" 
            className="w-[100%] h-[100%] object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" 
            alt="Paramètres" 
          />
        </button>
      </div>

      {/* ========================================== */}
      {/* STRATE MÉDIANE (Le Manifeste - "Le Ressort") */}
      {/* ========================================== */}
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
// ==========================================
// 📂 FICHIER : \src\modules\home\components\Library.tsx
// ==========================================
import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../views/Dashboard';
import type { InventoryItem } from '../../../types';
import { useUserTier } from '../../../core/security/useUserTier';

interface LibraryProps {
  onBack: () => void;
  selectedCategoryId: string | null;
  onStartScan: () => void;
  inventory?: InventoryItem[];
  onSelectTool: (tool: InventoryItem) => void;
  onDelete: (id: string) => void; 
}

const Library: React.FC<LibraryProps> = ({ onBack, selectedCategoryId, inventory, onSelectTool, onDelete }) => {
  const [tools, setTools] = useState<InventoryItem[]>([]);
  const { currentTier } = useUserTier(); // <-- NOUVEAU : On invoque la sécurité

  const activeCategoryIndex = CATEGORIES.findIndex(c => c.id === selectedCategoryId);
  const activeCategory = CATEGORIES[activeCategoryIndex];

  const categoryLabel = activeCategory ? activeCategory.label : 'TOUT L\'INVENTAIRE';
  const categoryIcon = activeCategory ? `/${activeCategory.id}.png` : '/icon-photo.png';
  const categoryNumber = activeCategoryIndex !== -1 ? String(activeCategoryIndex + 1).padStart(2, '0') + '.' : '';

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
    <div className="flex flex-col h-full bg-transparent font-sans">
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
                onClick={() => {
                  // <-- NOUVEAU : VERROU PREMIUM POUR L'ÉDITION
                  if (currentTier === 'FREE') {
                    alert("🔒 La fiche détaillée et l'édition sont réservées aux membres PREMIUM.");
                  } else {
                    onSelectTool(tool);
                  }
                }}
                className="relative bg-[#1E1E1E] rounded-r-xl rounded-l-sm border-l-4 border-[#FF6600] p-4 flex gap-4 shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer active:scale-[0.98] transition-transform"
              >
                {/* BOUTON SUPPRIMER */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(tool.id);   
                  }}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-white/30 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors z-10"
                >
                  <span className="text-xl font-bold leading-none mb-1">×</span>
                </button>

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
                  <div className="pr-6">
                    <span className="text-gray-400 font-black text-[9px] uppercase tracking-widest leading-none block mb-0.5">
                      {tool.brand || 'MARQUE N/A'}
                    </span>
                    <h3 className="text-white font-bold text-[clamp(0.9rem,3.5vw,1.1rem)] uppercase leading-tight whitespace-normal">
                      {tool.toolName}
                    </h3>
                    
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {/* <-- NOUVEAU : L'énergie est un privilège PREMIUM/PRO */}
                      {currentTier !== 'FREE' && (
                        <span className="bg-[#FF6600]/10 text-[#FF6600] border border-[#FF6600]/30 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                          ⚡ {(tool as any).energy || 'N/A'}
                        </span>
                      )}
                      <span className="text-[#D3D3D3] text-[9px] font-bold uppercase tracking-widest truncate">
                        📍 {tool.location || 'ZONE NON DÉFINIE'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 border-t border-white/5 pt-2">
                    {!(tool.category === 'quinc' || tool.isConsumable) ? (
                      <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${tool.safetyStatus ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-green-500/10 text-green-500 border-green-500/30'}`}>
                        {tool.safetyStatus ? 'ALERTE' : 'OPÉRATIONNEL'}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-[8px] font-black uppercase tracking-widest">
                        Niveau : {tool.consumableLevel || 0}%
                      </span>
                    )}
                    <span className="text-[#B0BEC5] text-[8px] italic opacity-60">
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
// ==========================================
// 📂 FICHIER : \src\modules\home\components\Search.tsx
// ==========================================
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

  const analyzeIntent = (transcript: string) => {
    let cleanedQuery = transcript.toLowerCase();
    let detectedLocation: string | null = null;

    locations.forEach(loc => {
      const locName = loc.label.toLowerCase();
      if (cleanedQuery.includes(locName)) {
        detectedLocation = loc.label;
        cleanedQuery = cleanedQuery.replace(locName, '').trim();
      }
    });

    const stopWords = ['dans le', 'dans la', 'dans', 'sur le', 'sur la', 'sur', 'montre-moi', 'cherche', 'trouve', 'les', 'des'];
    stopWords.forEach(word => {
      cleanedQuery = cleanedQuery.replace(new RegExp(`\\b${word}\\b`, 'gi'), '').trim();
    });

    if (detectedLocation) {
      setSelectedLocation(detectedLocation);
    }

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
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      analyzeIntent(transcript);
    };

    recognition.start();
  };

  const results = useMemo(() => {
    return inventory.filter(tool => {
      const searchTerms = query.toLowerCase().split(' ').filter(word => word.length > 1);
      
      const toolIndex = [
        tool.toolName,
        tool.brand,
        tool.category,
        tool.sku,
        tool.location,
        tool.notes,
        (tool as any).energy,
        (tool as any).motor,
        (tool as any).type
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesQuery = query.trim() === '' || searchTerms.every(term => toolIndex.includes(term));
      const matchesLocation = selectedLocation === 'ALL' || tool.location === selectedLocation;
      
      return matchesQuery && matchesLocation;
    });
  }, [query, selectedLocation, inventory]);

  return (
    <div className="min-h-screen bg-[#121212] text-white p-[4vh] font-sans pb-[15vh]">
      
      {/* HEADER & RETOUR INVERSÉS */}
      <div className="flex justify-between items-center mb-[6vh]">
        {/* Titre à gauche, format système standard */}
        <div className="flex flex-col items-start text-left">
          <h2 className="text-[1.5rem] font-sans font-black uppercase tracking-widest leading-none">RETROUVER</h2>
        </div>

        {/* Bouton retour à droite, w-14 h-14, sans le mot "Menu" */}
        <button onClick={onBack} className="w-14 h-14 flex items-center justify-center active:scale-90 transition-transform shrink-0">
          <img src="/icon-return.png" alt="Retour" className="w-full h-full object-contain" />
        </button>
      </div>

      {/* ZONE DE RECHERCHE TEXTUELLE */}
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

      {/* BOUTON MICRO GÉANT */}
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
```

// ==========================================
// 📂 FICHIER : \src\modules\home\views\Dashboard.tsx
// ==========================================

```tsx
import React, { Suspense, lazy } from 'react';
import { useUserTier } from '../../../core/security/useUserTier';
import type { InventoryItem } from '../../../types';
import { useAppSettings } from '../../../core/storage/useAppSettings';

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
  const { settings } = useAppSettings(); // NOUVEAU : Récupération du cerveau local
  const canExportPdf = currentTier === 'PREMIUM' || currentTier === 'PRO';

  // Formatage dynamique pour le PDF
  const userInfo = {
    name: settings.userProfile?.fullName || 'Utilisateur Premium',
    address: settings.userProfile?.company 
      ? `${settings.userProfile.company} - ${settings.userProfile.address || ''}`
      : (settings.userProfile?.address || 'Adresse non renseignée')
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
              <PdfExportButton inventory={inventory} userInfo={userInfo} />
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
  const isEN = settings.language === 'EN';

  return (
    <div className="flex flex-col h-full bg-[#121212] px-[5vw] pt-[2vh] pb-[calc(2vh+env(safe-area-inset-bottom))] overflow-y-auto relative z-[110]">

      {/* Bouton Retour Dynamique */}
      <button
        onClick={onBack}
        className="self-start text-[#FF6600] border border-[#FF6600] bg-[#1E1E1E] px-[4vw] py-[1vh] rounded-md font-black uppercase tracking-widest text-[clamp(0.7rem,3vw,1rem)] mb-[3vh] active:scale-95 transition-transform"
      >
        ← {isEN ? 'Back' : 'Retour'}
      </button>

      {/* CONTENU ANGLAIS (EN) */}
      {isEN ? (
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
                <span className="font-black text-[#FF6600]">4.2. PREMIUM Tier:</span> Unlimited inventory. Access to Insurance module for PDF reports. Monthly subscription at €2.99 incl. VAT or annual at €30.00 incl. VAT.
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
              <li><strong>SIRET :</strong> 101 891 190 00015 (Code APE : 62.01Z)</li>
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
                <span className="font-black text-[#FF6600]">4.2. Niveau PREMIUM :</span> Inventaire illimité. Accès Module Assurance (PDF). Abonnement mensuel à 2,99 € TTC ou annuel à 30,00 € TTC.
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
import { supabase } from '../../../core/security/supabaseClient';

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

  const hasAcceptedTerms = settings.acceptedTerms === true;

  // GESTIONNAIRE D'ABONNEMENT ET BACKDOOR ADMIN
  const handleTierSelection = async (tier: UserTier) => {
    if (!hasAcceptedTerms) return;

    if (tier === 'FREE') {
      setTier('FREE');
    } else if (tier === 'PRO') {
      const forceAdmin = window.confirm(
        "BACKDOOR ADMIN 🛠️\n\nForcer l'activation du grade PRO pour accéder au Hub ?"
      );
      if (forceAdmin) {
        setTier('PRO');
      }
    } else if (tier === 'PREMIUM') {
      const isAnnual = window.confirm(
        "LOCATE PREMIUM - Choix de la formule\n\n" +
        "▶ Cliquez sur [OK] pour l'abonnement ANNUEL (30,00 € TTC)\n" +
        "▶ Cliquez sur [Annuler] pour l'abonnement MENSUEL (2,99 € TTC)"
      );

      // 1. On récupère l'ID sécurisé de l'utilisateur connecté via Supabase
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) {
        alert("Erreur critique : Impossible de vous identifier. Veuillez vous reconnecter.");
        return;
      }

      // 2. Préparation des liens de paiement
      const stripeMensuelUrl = "https://buy.stripe.com/7sY6oG9eEa4X8sF2gU77O00";
      const stripeAnnuelUrl = "https://buy.stripe.com/dRm14m4Yob91eR34p277O01";
      const baseTargetUrl = isAnnual ? stripeAnnuelUrl : stripeMensuelUrl;

      // 3. LE BLINDAGE : On attache l'ID de l'utilisateur en filigrane pour Stripe
      const finalUrl = `${baseTargetUrl}?client_reference_id=${userId}`;

      // 4. Redirection vers le guichet de paiement
      window.location.href = finalUrl;
    }
  };
  if (showPrivacy) {
    return <PrivacyPolicy onBack={() => setShowPrivacy(false)} />;
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#121212] text-white p-[3vh_5vw] overflow-y-auto pb-[15vh] font-sans">
      
      <div className="flex items-center justify-between mb-[2vh] mt-[2vh]">
        <div>
          <h1 className="text-[clamp(1.5rem,6vw,2.5rem)] font-black text-[#FF6600] uppercase tracking-wide font-['Rebel']">
            {t('settings_title')}
          </h1>
          <p className="text-[clamp(0.8rem,3vw,1rem)] text-gray-400">
            {t('settings_subtitle')}
          </p>
        </div>
        
        {onBack && (
          <button onClick={onBack} className="w-14 h-14 active:scale-90 transition-transform shrink-0 flex items-center justify-center">
            <img src="/icon-return.png" alt="Retour" className="w-full h-full object-contain drop-shadow-lg" />
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
                onClick={() => updateSettings({ language: 'EN', unitSystem: 'IMPERIAL' })}
                className={`px-[3vw] py-[1vh] rounded-md font-black text-[clamp(0.8rem,3vw,1rem)] transition-all ${lang === 'EN' ? 'bg-[#FF6600] text-white shadow-[0_0_15px_rgba(255,102,0,0.4)]' : 'text-gray-500 hover:text-gray-300'}`}
              >
                EN (IN)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 : ACCÈS TOTAL & ABONNEMENTS */}
      <div className="mb-[5vh]">
        <h2 className="text-[clamp(1rem,4vw,1.2rem)] font-bold mb-[2vh] flex items-center tracking-widest text-gray-200">
          <span className="w-[4px] h-[1.2em] bg-[#FF6600] mr-[2vw]"></span>
          {t('tier_title')}
        </h2>
        
        {!hasAcceptedTerms && (
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-2 animate-pulse flex items-center gap-2">
            <span className="text-sm">⚠️</span> Veuillez accepter les CGU/CGV ci-dessous pour débloquer les accès.
          </p>
        )}

        <div className={`bg-[#1A1A1A] rounded-2xl p-[2vh_4vw] border transition-all duration-300 ${!hasAcceptedTerms ? 'border-red-500/30' : 'border-[#222]'}`}>
          <div className="flex items-center justify-between mb-[3vh]">
            <p className="text-[clamp(0.75rem,2.8vw,0.9rem)] text-gray-400">
              {t('tier_desc')}
            </p>
            <span className="text-[clamp(0.6rem,2vw,0.8rem)] bg-[#333] text-white px-[2vw] py-[0.5vh] rounded-full uppercase tracking-wider">
              Admin Mode
            </span>
          </div>
          
          <div className="flex gap-[2vw] justify-between">
            {(Object.keys(TIERS_CONFIG) as UserTier[]).map((tier) => {
              const displayLabel = tier === 'PRO' ? 'PRO (Devis)' : tier;
              
              return (
                <button
                  key={tier}
                  onClick={() => handleTierSelection(tier)}
                  disabled={!hasAcceptedTerms}
                  className={`flex-1 py-[1.5vh] rounded-2xl font-black text-[clamp(0.7rem,2vw,0.9rem)] uppercase tracking-widest transition-all border ${
                    !hasAcceptedTerms 
                      ? 'bg-[#121212] text-gray-700 border-white/5 cursor-not-allowed opacity-50'
                      : currentTier === tier 
                        ? 'bg-[#121212] text-white border-[#FF6600]/80 shadow-[0_0_15px_rgba(255,102,0,0.3),inset_0_0_10px_rgba(255,102,0,0.1)]' 
                        : 'bg-[#0A0A0A] text-gray-600 border-white/5 hover:text-gray-400'
                  }`}
                >
                  {!hasAcceptedTerms ? (
                    <span className="flex justify-center items-center gap-2">🔒 {displayLabel}</span>
                  ) : (
                    displayLabel
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 2.5 : PROFIL ASSURANCE & RAPPORTS */}
      <div className="mb-[5vh]">
        <h2 className="text-[clamp(1rem,4vw,1.2rem)] font-bold mb-[2vh] flex items-center tracking-widest text-gray-200">
          <span className="w-[4px] h-[1.2em] bg-[#FF6600] mr-[2vw]"></span>
          {t('profile_title')}
        </h2>

        <div className="bg-[#1A1A1A] rounded-2xl p-[3vh_4vw] border border-[#222] flex flex-col gap-[2.5vh]">
          <div>
            <label className="block text-gray-400 text-[clamp(0.7rem,2.5vw,0.8rem)] uppercase tracking-wider mb-[1vh]">{t('profile_fullname')}</label>
            <input 
              type="text" 
              value={settings.userProfile?.fullName || ''} 
              onChange={(e) => updateSettings({ userProfile: { ...(settings.userProfile || { fullName: '', company: '', address: '' }), fullName: e.target.value } })}
              placeholder="Ex: Jean Dupont"
              className="w-full bg-[#0A0A0A] border border-[#333] text-white rounded-lg p-[1.5vh_3vw] focus:border-[#FF6600] outline-none transition-colors text-[clamp(0.8rem,3vw,1rem)]"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-[clamp(0.7rem,2.5vw,0.8rem)] uppercase tracking-wider mb-[1vh]">{t('profile_company')}</label>
            <input 
              type="text" 
              value={settings.userProfile?.company || ''} 
              onChange={(e) => updateSettings({ userProfile: { ...(settings.userProfile || { fullName: '', company: '', address: '' }), company: e.target.value } })}
              placeholder="Ex: Locate Services"
              className="w-full bg-[#0A0A0A] border border-[#333] text-white rounded-lg p-[1.5vh_3vw] focus:border-[#FF6600] outline-none transition-colors text-[clamp(0.8rem,3vw,1rem)]"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-[clamp(0.7rem,2.5vw,0.8rem)] uppercase tracking-wider mb-[1vh]">{t('profile_address')}</label>
            <input 
              type="text" 
              value={settings.userProfile?.address || ''} 
              onChange={(e) => updateSettings({ userProfile: { ...(settings.userProfile || { fullName: '', company: '', address: '' }), address: e.target.value } })}
              placeholder="Ex: 123 avenue de l'Industrie, 75000 Paris"
              className="w-full bg-[#0A0A0A] border border-[#333] text-white rounded-lg p-[1.5vh_3vw] focus:border-[#FF6600] outline-none transition-colors text-[clamp(0.8rem,3vw,1rem)]"
            />
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

      {/* SECTION 4 : SUPPORT & ASSISTANCE */}
      <div className="mb-[5vh]">
        <h2 className="text-[clamp(1rem,4vw,1.2rem)] font-bold mb-[2vh] flex items-center tracking-widest text-gray-200">
          <span className="w-[4px] h-[1.2em] bg-[#FF6600] mr-[2vw]"></span>
          SUPPORT & ASSISTANCE
        </h2>
        <div className="bg-[#1A1A1A] rounded-2xl p-[3vh_4vw] border border-[#222] flex flex-col items-center text-center">
          <p className="text-gray-400 text-[clamp(0.8rem,3vw,0.95rem)] mb-[2.5vh] leading-relaxed">
            Une question, un bug ou une suggestion ? Notre équipe est à votre écoute pour améliorer l'expérience Locate.
          </p>
          <a 
            href="mailto:contact@locate-systems.com"
            className="w-full bg-[#121212] text-white border border-white/10 py-[1.8vh] rounded-xl font-black uppercase tracking-widest text-[clamp(0.8rem,3vw,1rem)] shadow-inner hover:border-[#FF6600]/50 hover:text-[#FF6600] transition-colors flex justify-center items-center gap-3 active:scale-95"
          >
            <span className="text-xl">✉️</span> Contacter le support
          </a>
        </div>
      </div>

      {/* SECTION 5 : LÉGAL (CGU / CGV / Confidentialité) */}
      <div className="mt-auto">
        <div className={`flex items-start gap-[3vw] bg-[#1A1A1A] p-[2vh_4vw] rounded-xl border transition-colors ${hasAcceptedTerms ? 'border-[#333]' : 'border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.2)]'}`}>
          <input
            type="checkbox"
            checked={hasAcceptedTerms}
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
import { useUserTier } from '../../../core/security/useUserTier';

export interface AIScanResult {
  brand?: string;
  typography?: string;
  brandColor?: string;
  categorie_id?: string;
  type?: string; 
  morphology?: string; 
  confidence?: number;
  etat?: string;
  description?: string;
  label?: string;
  isConsumable?: boolean;
  consumableLevel?: number;
  imageUrl?: string;
  location?: string;
  energy?: string; 
  safetyStatus?: boolean;
  // NOUVEAU : Champ pour stocker les coordonnées du contour
  box_2d?: number[]; 
}

interface ValidationSasProps {
  pendingItems: AIScanResult[];
  onValidateAll: (items: AIScanResult[]) => void;
  onRejectAll: () => void;
}

const ValidationSas: React.FC<ValidationSasProps> = ({ pendingItems, onValidateAll, onRejectAll }) => {
  const [itemsToValidate, setItemsToValidate] = useState<AIScanResult[]>(pendingItems);
  const [selectedItems, setSelectedItems] = useState<boolean[]>(pendingItems.map(() => true));
  const { currentTier } = useUserTier();

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<AIScanResult>>({});

  const handleRemoveItem = (indexToRemove: number) => {
    setItemsToValidate(prev => prev.filter((_, i) => i !== indexToRemove));
    setSelectedItems(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const toggleSelection = (index: number) => {
    const newSelection = [...selectedItems];
    newSelection[index] = !newSelection[index];
    setSelectedItems(newSelection);
  };

  const openEditModal = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...itemsToValidate[index] });
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const updatedItems = [...itemsToValidate];
      updatedItems[editingIndex] = { ...updatedItems[editingIndex], ...editForm };
      setItemsToValidate(updatedItems);
      setEditingIndex(null);
    }
  };

  const handleFinalValidation = () => {
    const itemsToKeep = itemsToValidate.filter((_, index) => selectedItems[index]);
    if (itemsToKeep.length > 0) {
      onValidateAll(itemsToKeep);
    } else {
      alert("Aucun outil n'est sélectionné pour l'intégration.");
    }
  };

  if (itemsToValidate.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-[5vw] text-center gap-[2vh] font-sans">
        <h2 className="text-[#FF6600] font-black uppercase tracking-widest text-[clamp(1rem,4vw,1.5rem)]">Scan Vide</h2>
        <p className="text-white/70 text-[clamp(0.8rem,2.5vw,1rem)]">Aucun outil détecté ou validé.</p>
        <button onClick={onRejectAll} className="mt-[4vh] bg-[#333333] text-white px-[6vw] py-[1.5vh] rounded-md font-bold uppercase tracking-wide">
          Retour au Hub
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#121212] px-[5vw] pt-[2vh] pb-[calc(2vh+env(safe-area-inset-bottom))] font-sans relative">
      
      <div className="flex flex-col mb-[3vh]">
        <h2 className="text-white font-black uppercase tracking-widest text-[clamp(1.2rem,5vw,1.8rem)]">
          SAS DE VALIDATION <span className="text-[#FF6600]">(SCAN)</span>
        </h2>
        <p className="text-white/60 text-[clamp(0.7rem,2.5vw,0.9rem)] italic mt-[0.5vh]">
          Vérification métier requise avant injection base de données.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-[3vh] pr-[1vw] no-scrollbar">
        {itemsToValidate.map((item, index) => {
          const score = item.confidence ? Math.round(item.confidence * 100) : 0;
          const scoreColor = score >= 90 ? 'text-green-500' : score >= 70 ? 'text-[#FF6600]' : 'text-red-500';
          const isSelected = selectedItems[index];
          const isConsumableType = item.categorie_id === 'quinc' || item.isConsumable;

          // CALCUL DES COORDONNÉES DU CONTOUR NÉON
          let neonOverlayStyle = {};
          if (item.box_2d && item.box_2d.length === 4) {
            // Gemini renvoie [ymin, xmin, ymax, xmax] normalisé entre 0 et 1000
            const [ymin, xmin, ymax, xmax] = item.box_2d;
            neonOverlayStyle = {
              top: `${ymin / 10}%`,
              left: `${xmin / 10}%`,
              height: `${(ymax - ymin) / 10}%`,
              width: `${(xmax - xmin) / 10}%`,
            };
          }

          return (
            <div 
              key={index} 
              className={`bg-[#1E1E1E] border rounded-xl flex flex-col overflow-hidden transition-all duration-300 ${isSelected ? 'border-[#FF6600] shadow-[0_0_15px_rgba(255,102,0,0.15)]' : 'border-white/5 opacity-50 grayscale-[50%]'}`}
            >
              <div className="flex p-[3vw] gap-[3vw]">
                {/* ZONE DE LA MINIATURE AVEC CONTOUR NÉON */}
                <div className="w-[22vw] h-[22vw] max-w-[90px] max-h-[90px] bg-[#0a0a0a] border border-white/10 rounded-lg shrink-0 relative overflow-hidden p-1 shadow-inner">
                  {item.imageUrl ? (
                    <>
                      <img 
                        src={item.imageUrl} 
                        alt={item.label} 
                        className="w-full h-full object-contain"
                      />
                      
                      {/* LE CONTOUR ORANGE NÉON (SUPERPOSÉ) */}
                      {item.box_2d && (
                        <div 
                          className="absolute border-2 border-[#FF6600] rounded-[2px] shadow-[0_0_10px_#FF6600,inset_0_0_5px_#FF6600] pointer-events-none"
                          style={neonOverlayStyle}
                        />
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <span className="text-2xl opacity-30">📷</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-2">
                      <span className="text-gray-400 font-black text-[9px] uppercase tracking-widest leading-none block mb-1">
                        {item.brand || item.brandColor || 'Marque N/A'}
                      </span>
                      <h3 className="text-white font-bold text-[clamp(0.9rem,3.5vw,1.1rem)] leading-tight whitespace-normal">
                        {item.label || item.typography || 'Outil Inconnu'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[#FF6600] text-[10px] font-bold tracking-wider uppercase">
                          {item.type || item.categorie_id}
                        </span>
                        {item.energy && (
                          <span className="bg-[#FF6600]/20 text-[#FF6600] px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
                            ⚡ {item.energy}
                          </span>
                        )}
                        {item.safetyStatus !== undefined && !isConsumableType && (
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${item.safetyStatus ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                            {item.safetyStatus ? 'ALERTE' : 'OPÉRATIONNEL'}
                          </span>
                        )}
                      </div>
                    </div>
                    {currentTier !== 'FREE' && (
                      <div className="flex flex-col items-end shrink-0">
                        <span className={`font-black text-[clamp(1.1rem,4vw,1.4rem)] leading-none ${scoreColor}`}>
                          {score}%
                        </span>
                        <span className="text-white/40 text-[8px] uppercase tracking-widest mt-1">
                          IA CONF.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex border-t border-white/10 bg-[#121212]">
                <button 
                  onClick={() => toggleSelection(index)}
                  className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors ${isSelected ? 'text-[#FF6600] bg-[#FF6600]/10' : 'text-gray-500 hover:text-white'}`}
                >
                  <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${isSelected ? 'border-[#FF6600] bg-[#FF6600]' : 'border-gray-500'}`}>
                    {isSelected && <span className="text-black text-[10px] font-black leading-none">✓</span>}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {isSelected ? 'Prêt' : 'Ignoré'}
                  </span>
                </button>

                <button 
                  onClick={() => currentTier === 'FREE' ? alert("L'édition détaillée est réservée aux membres PREMIUM.") : openEditModal(index)}
                  className="flex-1 py-3 border-l border-white/10 flex items-center justify-center gap-2 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm">{currentTier === 'FREE' ? '🔒' : '✎'}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Éditer</span>
                </button>

                <button 
                  onClick={() => handleRemoveItem(index)}
                  className="w-[15%] py-3 border-l border-white/10 flex items-center justify-center text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Supprimer définitivement"
                >
                  <span className="text-lg font-black leading-none">×</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto pt-[2vh] flex justify-between gap-[3vw] shrink-0">
        <button 
          onClick={onRejectAll}
          className="flex-1 bg-[#333333] active:bg-[#444] text-white py-[2vh] rounded-xl font-black uppercase tracking-widest text-[clamp(0.8rem,3vw,1rem)] transition-colors border border-white/5"
        >
          Rejeter
        </button>
        <button 
          onClick={handleFinalValidation}
          className="flex-[2] bg-[#FF6600] active:bg-[#e65c00] text-black py-[2vh] rounded-xl font-black uppercase tracking-widest text-[clamp(0.8rem,3vw,1rem)] shadow-[0_0_20px_rgba(255,102,0,0.4)] transition-transform active:scale-95"
        >
          Valider & Ranger ({selectedItems.filter(Boolean).length})
        </button>
      </div>

      {/* ========================================== */}
      {/* MODALE D'ÉDITION RAPIDE (QUICK EDIT)       */}
      {/* ========================================== */}
      {editingIndex !== null && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-end">
          <div className="bg-[#1E1E1E] rounded-t-3xl border-t border-[#FF6600]/50 p-[5vw] flex flex-col gap-[2.5vh] animate-slide-up shadow-[0_-10px_40px_rgba(0,0,0,0.8)] pb-[max(5vh,env(safe-area-inset-bottom))] relative overflow-hidden">
            
            {/* RAPPEL DE LA MINIATURE AVEC SON CONTOUR NÉON DANS LA MODALE */}
            <div className="absolute top-4 right-5 w-[15vw] h-[15vw] max-w-[60px] max-h-[60px] bg-black rounded-lg border border-white/10 p-1 overflow-hidden shadow-inner">
               {editForm.imageUrl && (
                    <>
                      <img src={editForm.imageUrl} alt="Miniature" className="w-full h-full object-contain" />
                      {editForm.box_2d && (
                        <div 
                          className="absolute border-[1.5px] border-[#FF6600] rounded-[1px] shadow-[0_0_6px_#FF6600,inset_0_0_3px_#FF6600] pointer-events-none"
                          style={{
                              top: `${editForm.box_2d[0] / 10}%`,
                              left: `${editForm.box_2d[1] / 10}%`,
                              height: `${(editForm.box_2d[2] - editForm.box_2d[0]) / 10}%`,
                              width: `${(editForm.box_2d[3] - editForm.box_2d[1]) / 10}%`,
                          }}
                        />
                      )}
                    </>
               )}
            </div>

            <div className="flex justify-between items-center border-b border-white/10 pb-3 pr-16">
              <h3 className="text-white font-black uppercase tracking-widest text-[1.2rem]">Correction IA</h3>
              <button onClick={() => setEditingIndex(null)} className="text-white/50 text-2xl font-light active:scale-90 absolute top-4 right-4 z-20">×</button>
            </div>

            {/* Champ 1 : Marque */}
            <div>
              <label className="text-[#FF6600] text-[10px] font-black uppercase tracking-widest ml-1 mb-1 block">Marque</label>
              <input type="text" value={editForm.brand || editForm.brandColor || ''} onChange={(e) => setEditForm({...editForm, brand: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-[#FF6600]" placeholder="Ex: DeWalt, Makita..."/>
            </div>

            {/* Champ 2 : Genre / Modèle */}
            <div>
              <label className="text-[#FF6600] text-[10px] font-black uppercase tracking-widest ml-1 mb-1 block">Genre / Modèle</label>
              <input type="text" value={editForm.label || editForm.typography || ''} onChange={(e) => setEditForm({...editForm, label: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-[#FF6600]" placeholder="Ex: Visseuse à choc, Scie circulaire..."/>
            </div>

            {/* Champ 3 : Énergie */}
            <div>
              <label className="text-[#FF6600] text-[10px] font-black uppercase tracking-widest ml-1 mb-1 block">Énergie (Batterie / Secteur)</label>
              <input type="text" value={editForm.energy || ''} onChange={(e) => setEditForm({...editForm, energy: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-[#FF6600]" placeholder="Ex: 18V, Filaire 220V, Thermique..."/>
            </div>

            {/* Champ 4 : Statut Opérationnel (Masqué si Quincaillerie) */}
            {!(editForm.categorie_id === 'quinc' || editForm.isConsumable) && (
              <div className="mt-2">
                <label className="text-[#FF6600] text-[10px] font-black uppercase tracking-widest ml-1 mb-2 block">Statut Machine</label>
                <div className="flex bg-[#0a0a0a] rounded-lg p-1 border border-white/10">
                  <button onClick={() => setEditForm({...editForm, safetyStatus: false})} className={`flex-1 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${!editForm.safetyStatus ? 'bg-green-500 text-black shadow-md' : 'text-gray-500'}`}>✓ Opérationnel</button>
                  <button onClick={() => setEditForm({...editForm, safetyStatus: true})} className={`flex-1 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${editForm.safetyStatus ? 'bg-red-500 text-white shadow-md' : 'text-gray-500'}`}>⚠️ En Panne</button>
                </div>
              </div>
            )}

            <button onClick={saveEdit} className="w-full bg-[#FF6600] text-black py-4 rounded-xl font-black uppercase tracking-widest mt-4 active:scale-95 transition-transform">
              Appliquer la correction
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationSas;
```

// ==========================================
// 📂 FICHIER : \src\modules\kitchen\views\KitchenDashboard.tsx
// ==========================================

```tsx
import React, { useState } from 'react';
import { UtensilsCrossed, ShieldCheck, ChevronRight } from 'lucide-react';

interface KitchenDashboardProps {
  onBack?: () => void;
}

const KitchenDashboard: React.FC<KitchenDashboardProps> = ({ onBack }) => {
  const [activeMode, setActiveMode] = useState<'menu' | 'inventory' | 'haccp'>('menu');

  // CORRECTION : Utilisation de activeMode pour changer de vue
  if (activeMode !== 'menu') {
    // On réutilise la logique du scanner asynchrone mais filtrée pour la cuisine
    // Cette partie sera développée juste après ta validation
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center font-sans">
        <UtensilsCrossed className="text-[#28A745] w-16 h-16 mb-4 animate-bounce" />
        <h2 className="text-white font-black text-2xl uppercase tracking-widest mb-2">
          SCANNER {activeMode === 'inventory' ? 'STOCKS' : 'HACCP'}
        </h2>
        <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-8">
          Initialisation du moteur de vision M4...
        </p>
        <button 
          onClick={() => setActiveMode('menu')} 
          className="bg-[#28A745] text-black px-8 py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] active:scale-95 transition-transform"
        >
          Annuler le Scan
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* Header HUD & Retour */}
      <div className="absolute top-6 left-6 z-10 pointer-events-auto flex items-start gap-4">
        {onBack && (
          <button onClick={onBack} className="w-12 h-12 bg-black/50 backdrop-blur border border-white/10 rounded-xl flex items-center justify-center active:scale-90 transition-transform">
            <img src="/icon-return.png" alt="Retour" className="w-[60%] h-[60%] object-contain opacity-80" />
          </button>
        )}
        <div className="pointer-events-none">
          <h1 className="text-white font-black text-xl tracking-widest uppercase">Locate Kitchen</h1>
          <p className="text-[#28A745] text-[10px] font-bold uppercase tracking-widest mt-1">Terminal de Gestion Culinaire</p>
        </div>
      </div>

      {/* 📦 BOUTON 1 : INVENTAIRE PÉRISSABLES */}
      <button
        onClick={() => setActiveMode('inventory')}
        className="flex-1 group relative overflow-hidden bg-[#0a0a0a] hover:bg-[#0c1a10] transition-all duration-500 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-center items-center p-8 active:scale-95"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#28A745]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <UtensilsCrossed size={72} className="text-white/60 mb-6 group-hover:text-[#28A745] group-hover:scale-110 transition-all duration-500" />
        <h2 className="text-white font-black text-3xl uppercase tracking-tighter mb-2 text-center">Inventaire<br/>Périssables</h2>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest text-center mb-12">Chambre Froide • Épicerie • DLC/DDM</p>

        <div className="flex items-center gap-2 text-[#28A745] font-black text-[10px] uppercase tracking-[0.2em] bg-green-950/30 px-6 py-3 rounded-full border border-[#28A745]/20">
          Système FEFO <ChevronRight size={14} />
        </div>
      </button>

      {/* 🛡️ BOUTON 2 : CONTRÔLE HACCP */}
      <button
        onClick={() => setActiveMode('haccp')}
        className="flex-1 group relative overflow-hidden bg-[#080808] hover:bg-[#0c1a10] transition-all duration-500 flex flex-col justify-center items-center p-8 active:scale-95"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#28A745]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <ShieldCheck size={72} className="text-white/60 mb-6 group-hover:text-[#28A745] group-hover:scale-110 transition-all duration-500" />
        <h2 className="text-white font-black text-3xl uppercase tracking-tighter mb-2 text-center">Contrôle<br/>HACCP</h2>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest text-center mb-12">Traçabilité • Hygiène • Planches de coupe</p>

        <div className="flex items-center gap-2 text-[#28A745] font-black text-[10px] uppercase tracking-[0.2em] bg-green-950/30 px-6 py-3 rounded-full border border-[#28A745]/20">
          Audit IA <ChevronRight size={14} />
        </div>
      </button>

    </div>
  );
};

export default KitchenDashboard;
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
  [x: string]: any;
  brand: string;
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

export type DiagnosticMode = 'maintenance' | 'mecanique' | 'haccp';

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
