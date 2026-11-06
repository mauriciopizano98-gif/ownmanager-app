// Genera los íconos de la app a partir del isotipo oficial de Own Manager
// (assets/om-isotipo-lima-1024.png: cubo "om" + gota en Lima Volt #CCFF00 sobre Abyss #07080A).
// Regla del manual: fondo sólido #07080A, isotipo en el 62–66 % central, nunca el nombre debajo.
// Uso: npm run icons
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const RES = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');
const LOGO = path.join(__dirname, '..', 'assets', 'om-isotipo-lima-1024.png');
const FONDO = '#07080A';
const sizes = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };

// En el PNG de 1024 el isotipo ya ocupa el 64 % central; `escala` reescala ese lienzo completo.
async function lienzo(size, escala) {
  const lado = Math.round(size * escala);
  const m = await sharp(LOGO).resize(lado, lado).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: { r: 7, g: 8, b: 10, alpha: 1 } } })
    .composite([{ input: m, left: Math.round((size - lado) / 2), top: Math.round((size - lado) / 2) }]).png().toBuffer();
}
const mascara = (size, radio) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radio}" fill="#fff"/></svg>`);

(async () => {
  for (const [dpi, size] of Object.entries(sizes)) {
    const dir = path.join(RES, `mipmap-${dpi}`);
    fs.mkdirSync(dir, { recursive: true });
    // ícono clásico (cuadrado redondeado) y redondo: el lienzo completo recortado con la máscara
    const base = await lienzo(size, 1);
    await sharp(base).composite([{ input: mascara(size, Math.round(size * 0.2)), blend: 'dest-in' }]).png().toFile(path.join(dir, 'ic_launcher.png'));
    await sharp(base).composite([{ input: mascara(size, Math.round(size / 2)), blend: 'dest-in' }]).png().toFile(path.join(dir, 'ic_launcher_round.png'));
    // foreground adaptativo: el isotipo dentro del área segura (66 de 108): lienzo al 95 % → isotipo ≈ 61 %
    await sharp(await lienzo(size, 0.95)).toFile(path.join(dir, 'ic_launcher_foreground.png'));
  }
  const valuesDir = path.join(RES, 'values');
  fs.mkdirSync(valuesDir, { recursive: true });
  fs.writeFileSync(path.join(valuesDir, 'ic_launcher_background.xml'),
    `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${FONDO}</color>\n</resources>\n`);
  console.log('íconos generados en', RES);
})().catch((e) => { console.error(e); process.exit(1); });
