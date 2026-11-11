// Genera los íconos de la app Android a partir del ícono oficial de OwnManager
// (assets/om-icono-app-verde-1254.png: cuadro lima #84FF00 con el isotipo "Om" en negro, Manual de identidad v1.1).
// - ic_launcher / ic_launcher_round: el ícono oficial recortado (cuadrado redondeado y círculo).
// - ic_launcher_foreground (adaptativo): el ícono completo dentro del área segura; el fondo adaptativo es lima,
//   así que el cuadro se funde con él y solo se ve el "Om" centrado en cualquier forma de máscara.
// Uso: npm run icons   (requiere `npm i sharp`)
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const RES = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');
const ICONO = path.join(__dirname, '..', 'assets', 'om-icono-app-verde-1254.png');
const LIMA = '#84FF00';
const sizes = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
// El PNG oficial trae un marco negro de ~48 px alrededor del cuadro lima (1254 px): se recorta para que el ícono sea el cuadro.
async function cuadro(size) { // recorte un poco por dentro del borde y máscara redondeada, para no arrastrar las esquinas negras del PNG
  const b = await sharp(ICONO).extract({ left: 58, top: 58, width: 1138, height: 1138 }).resize(size, size).png().toBuffer();
  return sharp(b).composite([{ input: mascara(size, Math.round(size * 0.21)), blend: 'dest-in' }]).png().toBuffer(); }
const mascaraNegra = (size, radio) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="#000"/><rect width="${size}" height="${size}" rx="${radio}" fill="#fff"/></svg>`);
const mascara = (size, radio) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radio}" fill="#fff"/></svg>`);
(async () => {
  for (const [dpi, size] of Object.entries(sizes)) {
    const dir = path.join(RES, `mipmap-${dpi}`); fs.mkdirSync(dir, { recursive: true });
    const base = await cuadro(size);
    await sharp(base).toFile(path.join(dir, 'ic_launcher.png'));
    await sharp(base).composite([{ input: mascara(size, Math.round(size / 2)), blend: 'dest-in' }]).png().toFile(path.join(dir, 'ic_launcher_round.png'));
    // foreground adaptativo: solo el "Om" en negro (recortado por su oscuridad) sobre lima plano, dentro del área segura (66/108)
    const n = Math.round(size * 0.72), off = Math.round((size - n) / 2);
    const alfaPng = await sharp(ICONO).extract({ left: 58, top: 58, width: 1138, height: 1138 }).grayscale().threshold(110).negate().resize(n, n).png().toBuffer(); // negro=opaco, lima=transparente, borde suavizado al reducir
    const alfa = await sharp(alfaPng).composite([{ input: mascaraNegra(n, Math.round(n * 0.3)), blend: 'multiply' }]).grayscale().raw().toBuffer(); // quita las esquinas negras del PNG
    const om = await sharp({ create: { width: n, height: n, channels: 3, background: '#000000' } }).joinChannel(alfa, { raw: { width: n, height: n, channels: 1 } }).png().toBuffer();
    const fg = await sharp({ create: { width: size, height: size, channels: 4, background: { r: 132, g: 255, b: 0, alpha: 1 } } }).composite([{ input: om, left: off, top: off }]).png().toBuffer();
    await sharp(fg).toFile(path.join(dir, 'ic_launcher_foreground.png'));
  }
  const valuesDir = path.join(RES, 'values'); fs.mkdirSync(valuesDir, { recursive: true });
  fs.writeFileSync(path.join(valuesDir, 'ic_launcher_background.xml'), `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${LIMA}</color>\n</resources>\n`);
  console.log('íconos generados en', RES);
})().catch((e) => { console.error(e); process.exit(1); });
