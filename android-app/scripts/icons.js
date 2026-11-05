// Genera los íconos de la app (fondo #1F4FB0, iniciales "OM" en blanco) en todos los tamaños.
// Uso: npm run icons
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const RES = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');
const AZUL = '#1F4FB0';
const sizes = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };

const svg = (size, fg) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 108 108">
  ${fg ? '' : `<rect width="108" height="108" rx="${size > 0 ? 22 : 0}" fill="${AZUL}"/>`}
  <text x="54" y="54" dy="0.36em" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="40" fill="#FFFFFF">OM</text>
</svg>`;
// el "foreground" del ícono adaptativo lleva el contenido dentro del área segura (66/108)
const svgFg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 108 108">
  <text x="54" y="54" dy="0.36em" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="32" fill="#FFFFFF">OM</text>
</svg>`;
const svgRound = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 108 108">
  <circle cx="54" cy="54" r="54" fill="${AZUL}"/>
  <text x="54" y="54" dy="0.36em" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="40" fill="#FFFFFF">OM</text>
</svg>`;

(async () => {
  for (const [dpi, size] of Object.entries(sizes)) {
    const dir = path.join(RES, `mipmap-${dpi}`);
    fs.mkdirSync(dir, { recursive: true });
    await sharp(Buffer.from(svg(size, false))).resize(size, size).png().toFile(path.join(dir, 'ic_launcher.png'));
    await sharp(Buffer.from(svgRound(size))).resize(size, size).png().toFile(path.join(dir, 'ic_launcher_round.png'));
    await sharp(Buffer.from(svgFg(size))).resize(size, size).png().toFile(path.join(dir, 'ic_launcher_foreground.png'));
  }
  // color de fondo del ícono adaptativo y del splash
  const valuesDir = path.join(RES, 'values');
  const colorsFile = path.join(valuesDir, 'ic_launcher_background.xml');
  fs.writeFileSync(colorsFile, `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${AZUL}</color>\n</resources>\n`);
  console.log('íconos generados en', RES);
})().catch((e) => { console.error(e); process.exit(1); });
