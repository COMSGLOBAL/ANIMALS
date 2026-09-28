# ANIMALS — GitHub Pages

Versión estática de la web ANIMALS preparada para GitHub Pages.

## Estructura

- `index.html` — estructura de la web
- `styles.css` — estilos
- `app.js` — navegación, colecciones y juego
- `data/products.js` — configuración de animales/productos
- `assets/products/` — imágenes de producto y fondos
- `.nojekyll` — evita procesamiento de Jekyll

## 1. Copiar imágenes

Copia las imágenes originales dentro de `assets/products/` respetando los nombres indicados en `assets/products/README.txt`.

La web comprueba si cada imagen existe. Los LANYARD son opcionales y aparecerán automáticamente cuando añadas el archivo correspondiente. Crocodile no tiene lanyard.

## 2. Subir a GitHub

1. Crea un repositorio nuevo en GitHub.
2. Sube todo el contenido de esta carpeta a la raíz del repositorio manteniendo las carpetas.
3. Ve a **Settings → Pages**.
4. En **Build and deployment**, elige **Deploy from a branch**.
5. Selecciona `main` y `/ (root)`.
6. Guarda. GitHub te mostrará la URL pública cuando termine el despliegue.

## Productos

La nomenclatura actual es:

- `*_CASE.png` → CASE
- `*_MONEDERO.png` → WALLET / MONEDERO
- `*_WALLET.png` → MAGSAFE WALLET
- `*_LANYARD.png` → LANYARD (opcional)
- `*_background.png` → fondo de PLAY WITH THE ANIMALS

## Nota importante

Esta versión ya no necesita Google Apps Script ni `DriveApp`. Las imágenes se sirven directamente desde el repositorio de GitHub, por lo que conviene subir los PNG a `assets/products/`.
