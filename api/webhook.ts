import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Initialisation de Stripe (Clé secrète backend)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-02-25.clover', // <-- LA VERSION RÉCLAMÉE PAR TYPESCRIPT
});

// Initialisation de Supabase avec la clé "Service Role" (Bypass des sécurités)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: any, res: any) {
  // Le Webhook ne doit accepter que les requêtes POST venant de Stripe
  if (req.method !== 'POST') {
    return res.status(405).send('Méthode non autorisée');
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // 1. Vérification cryptographique : Est-ce que ça vient VRAIMENT de Stripe ?
    // (req.body doit être lu sous forme brute, Vercel gère ça si on désactive le bodyParser)
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret!);
  } catch (err: any) {
    console.error('⚠️ Erreur de signature Webhook.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 2. Si le paiement est réussi
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // On récupère l'ID Supabase qu'on avait injecté à l'Étape 1
    const userId = session.client_reference_id; 

    if (userId) {
      console.log(`💰 Paiement validé pour l'utilisateur : ${userId}. Passage en PREMIUM.`);
      
      // 3. Mise à jour SÉCURISÉE dans Supabase (Backend)
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { tier: 'PREMIUM' }
      });

      if (error) {
        console.error('❌ Erreur de mise à jour Supabase :', error);
        return res.status(500).send('Erreur BDD');
      }
    }
  }

  // On répond 200 OK à Stripe pour lui dire qu'on a bien reçu le message
  res.status(200).json({ received: true });
}

// Configuration spéciale Vercel pour lire le "Raw Body" indispensable à la crypto Stripe
export const config = {
  api: {
    bodyParser: false,
  },
};

// Fonction utilitaire pour lire le flux de données brut
async function getRawBody(req: any) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}