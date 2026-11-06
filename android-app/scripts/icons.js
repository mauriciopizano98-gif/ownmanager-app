// Genera los íconos de la app a partir del logo (assets/logo-original.jpg): cubo "om" con gota.
// Uso: npm run icons
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const RES = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');
const LOGO = path.join(__dirname, '..', 'assets', 'logo-original.jpg');
const FONDO = '#1F2323';                       // color de fondo del logo
const sizes = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };

// Recorte del motivo dentro del original de 2000×2000 (con un poco de aire alrededor)
const RECORTE = { left: 600, top: 560, width: 800, height: 820 };

async function motivo(size, escala) {
  // el motivo ocupa `escala` del lienzo, centrado, sobre fondo transparente
  const lado = Math.round(size * escala);
  const m = await sharp(LOGO).extract(RECORTE).resize(lado, lado, { fit: 'inside' }).png().toBuffer();
  const meta = await sharp(m).metadata();
  return sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: m, left: Math.round((size - meta.width) / 2), top: Math.round((size - meta.height) / 2) }]).png().toBuffer();
}
const fondo = (size, radio) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radio}" fill="${FONDO}"/></svg>`);

(async () => {
  for (const [dpi, size] of Object.entries(sizes)) {
    const dir = path.join(RES, `mipmap-${dpi}`);
    fs.mkdirSync(dir, { recursive: true });
    // ícono clásico (cuadrado redondeado) y redondo
    const m = await motivo(size, 0.78);
    await sharp(fondo(size, Math.round(size * 0.2))).composite([{ input: m }]).png().toFile(path.join(dir, 'ic_launcher.png'));
    await sharp(fondo(size, Math.round(size / 2))).composite([{ input: await motivo(size, 0.7) }]).png().toFile(path.join(dir, 'ic_launcher_round.png'));
    // foreground adaptativo: el motivo dentro del área segura (66 de 108)
    await sharp(await motivo(size, 0.52)).toFile(path.join(dir, 'ic_launcher_foreground.png'));
  }
  const valuesDir = path.join(RES, 'values');
  fs.mkdirSync(valuesDir, { recursive: true });
  fs.writeFileSync(path.join(valuesDir, 'ic_launcher_background.xml'),
    `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${FONDO}</color>\n</resources>\n`);
  console.log('íconos generados en', RES);
})().catch((e) => { console.error(e); process.exit(1); });
