const fs = require('fs');
const path = require('path');

// Dossier cible (ton code source) et fichier de sortie
const srcDir = path.join(__dirname, 'src');
const outputFile = path.join(__dirname, 'LOCATE_CONTEXT_IA.md');

const dateExport = new Date().toLocaleString('fr-FR');
let outputText = `# 🧠 CONTEXTE CODE SOURCE LOCATE\n> 📅 Archive générée le : ${dateExport}\n\n`;

function readFiles(dir) {
  // Sécurité : si le dossier src n'existe pas, on arrête
  if (!fs.existsSync(dir)) {
    console.error('❌ Erreur : Le dossier "src" est introuvable.');
    return;
  }
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    
    // Si c'est un dossier, on rentre dedans (récursivité)
    if (fs.statSync(filePath).isDirectory()) {
      readFiles(filePath);
    } 
    // Si c'est un fichier TypeScript ou React
    else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      const relativePath = filePath.replace(__dirname, '');
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Formatage propre pour la lecture de l'IA
      outputText += `\n// ==========================================\n`;
      outputText += `// 📂 FICHIER : ${relativePath}\n`;
      outputText += `// ==========================================\n\n\`\`\`tsx\n${content}\n\`\`\`\n`;
    }
  });
}

console.log('⏳ Aspiration du code source en cours...');
readFiles(srcDir);
fs.writeFileSync(outputFile, outputText);
console.log('✅ Export terminé avec succès !');
console.log('👉 Tu peux maintenant ouvrir le fichier LOCATE_CONTEXT_IA.md et tout copier.');