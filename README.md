# Atlas de Episodios — TVMaze

Una versión de diseño propio del ejercicio de series de TVMaze.

## Estructura

```text
TVMaze_Atlas/
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── index.html
    ├── index.css
    ├── index.js
    └── services/
        └── tvmaze.js
```

La consulta solo consume `name`, `rating`, `image` y los datos `number`, `season`, `rating.average` de los episodios. Las temporadas se agrupan por su número real. Las clases de valoración `rating-0` a `rating-10` siguen el enunciado.

## Ejecutar en VS Code (Windows)

1. Descomprimir el ZIP **una vez** en una carpeta, por ejemplo `Descargas/TVMaze_Atlas`.
2. Abrir **esa carpeta** en VS Code: debe verse `package.json` directamente en el explorador.
3. En la terminal de VS Code, elegir **Command Prompt / CMD**. PowerShell puede bloquear `npm.ps1` en Windows, aunque el código esté bien.
4. Ejecutar:

```bat
npm install
npm run dev
```

5. Abrir la dirección de Vite; está configurada para `http://localhost:1234/`.

## Publicar en GitHub Pages

1. Crear un repositorio nuevo en GitHub, por ejemplo `atlas-episodios`.
2. Subir a la raíz del repositorio los archivos del proyecto (en especial `package.json`, `vite.config.js` y `src/`). No subir `node_modules/` ni `dist/` ni ningún ZIP comprimido.
3. Abrir la carpeta del proyecto en CMD, instalar dependencias (`npm install`), inicializar Git y añadir el remoto:

```bat
git init
git add .
git commit -m "Proyecto TVMaze Atlas"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/atlas-episodios.git
git push -u origin main
npm run deploy
```

4. En GitHub, ir a **Settings → Pages → Build and deployment** y elegir **Deploy from a branch**, rama `gh-pages`, carpeta `/(root)`; guardar.
5. Abrir `https://TU_USUARIO.github.io/atlas-episodios/` (puede demorar unos minutos en publicarse).

`vite.config.js` usa `base: './'`, por lo que los recursos estáticos funcionan bajo cualquier nombre de repositorio en GitHub Pages. El sitio consulta la API TVMaze desde el navegador y requiere conexión a Internet.

## Detalles

- ID inicial: `2993`. Puede cambiarse en pantalla o con `?id=123` en el enlace.
- API: https://api.tvmaze.com/shows/{id} y https://api.tvmaze.com/shows/{id}/episodes
- No hay restricción `pnpm`, se utiliza `npm`.
- Los ratings sin datos se muestran en gris.
