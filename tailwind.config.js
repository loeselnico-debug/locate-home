/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // On définit TA palette industrielle exacte
      colors: {
        anthracite: {
          DEFAULT: '#121212', // Le fond profond principal
          light: '#1E1E1E',   // Pour les "cartes" posées dessus
          border: '#333333',  // Pour les bordures effet métal
        },
        phoenix: {
          orange: '#FF6600', // TON orange de référence
          glow: 'rgba(255, 102, 0, 0.3)', // Pour les effets de lumière
        }
      },
      fontFamily: {
        // Une police technique pour les chiffres (à installer si tu veux plus tard)
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}