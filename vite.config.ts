import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Met à jour l'app en arrière-plan sur les téléphones
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'LOCATE SYSTEMS', // Le vrai nom officiel
        short_name: 'LOCATE', // Le nom court sous l'icône sur l'écran du téléphone
        description: 'Système expert de gestion et d\'inventaire spatialisé',
        theme_color: '#050505', // Ta couleur de fond (Noir profond)
        background_color: '#050505',
        display: 'standalone', // Cache la barre du navigateur, donne un aspect d'app native
        icons: [
          {
            src: 'pwa-192x192.png', // Pour les densités d'écran standard
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png', // Pour les très hautes densités (ex: iPhone 17 Pro)
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Permet à Android d'arrondir l'icône selon son design
          }
        ]
      }
    })
  ]
});