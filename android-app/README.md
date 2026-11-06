# Own Manager · app Android

Proyecto Capacitor que empaqueta la app publicada (GitHub Pages) como aplicación
Android: pantalla siempre encendida, vertical, sin barras del sistema, cámara y
opción de usarla como pantalla de inicio (modo kiosco).

La app Android **no contiene la app de corte**: la carga desde
`https://mauriciopizano98-gif.github.io/ownmanager-app/`. Publicar un cambio en
Pages actualiza todos los teléfonos sin reinstalar nada. Solo hace falta un APK
nuevo cuando cambia algo de la cáscara Android (permisos, ícono, nombre).

## Cómo se compila

Lo compila GitHub Actions (`.github/workflows/android.yml`), no una computadora:

- Se dispara solo al hacer push a `main` con cambios en `android-app/`, o a mano en
  **Actions → "APK Android" → Run workflow**.
- Necesita dos secretos del repositorio (Settings → Secrets and variables → Actions):
  `KEYSTORE_BASE64` (el keystore de firma en base64) y `KEYSTORE_PASSWORD`.
- Deja el APK en **Releases**. El último siempre está en
  `https://github.com/mauriciopizano98-gif/ownmanager-app/releases/download/latest-apk/OwnManager.apk`.

## Nueva versión del APK

1. En `android/app/build.gradle` sube `versionCode` (entero, +1) y `versionName` (texto, p. ej. `1.0.1`).
2. Commit y push a `main`. El workflow compila y publica.
3. En el teléfono, descargar el APK nuevo e instalar encima (misma firma, conserva datos).

## Íconos

`npm run icons` regenera los íconos (fondo #1F4FB0, "OM" en blanco) en `android/app/src/main/res/mipmap-*`.


