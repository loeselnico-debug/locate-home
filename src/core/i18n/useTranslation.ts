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