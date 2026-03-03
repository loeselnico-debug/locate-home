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