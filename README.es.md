<br>
<div align="center">
<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
<img src="https://img.shields.io/badge/MDX-1B1F24?style=for-the-badge&logo=mdx&logoColor=white" alt="MDX">
</div>
<br>

<p align="center">
<strong>Idioma:</strong> <a href="README.md">English</a> | <a href="README.pt-BR.md">Português (Brasil)</a> | Español
</p>

<p align="center">
<img src="public/svgs/logo.svg" alt="Logo de MAC Docs" width="700">
</p>

<p align="center">
Documentación interactiva de Matemática Aplicada a la Computación, generada a partir de MDX con fórmulas en LaTeX, búsqueda de texto completo y componentes de estudio interactivos.
<br>
<a href="#sobre-el-proyecto"><strong>Explora la documentación »</strong></a>
</p>

## Índice

- [Sobre el Proyecto](#sobre-el-proyecto)
- [Funcionalidades](#funcionalidades)
- [Tecnologías](#tecnologías)
- [Primeros Pasos](#primeros-pasos)
- [Scripts](#scripts)
- [Contenido](#contenido)
- [Arquitectura](#arquitectura)
- [Pruebas](#pruebas)
- [Despliegue](#despliegue)
- [Licencia](#licencia)
- [Autor](#autor)

</br>

## Sobre el Proyecto

MacDocs es un sitio de documentación totalmente estático (SSG) al estilo de
react.dev. Convierte un árbol de archivos MDX en un sitio navegable,
buscable e interactivo. Basta con agregar un archivo `.mdx` para generar una
ruta, un elemento en la barra lateral, breadcrumb, navegación
anterior/siguiente y una entrada en el buscador.

## Funcionalidades

- Renderizado de MDX con GFM y KaTeX (matemáticas en línea y en bloque).
- Barra lateral jerárquica derivada de la estructura de carpetas, con grupos
  colapsables cuyo estado se persiste.
- Búsqueda de texto completo abierta con `Ctrl`/`Cmd` + `K`, con ranking y
  navegable por teclado.
- Componentes de estudio interactivos: Callout, Collapsible, Exercise, Quiz,
  StepByStep, YouTube y, en páginas de evaluación, Question, Badge,
  Resolution, Proof, Alternatives, PixelGrid, RegionDiagram y calculadoras de
  conjuntos/matrices.
- Tabla de contenidos con scroll spy en escritorio y menú desplegable en
  móvil.
- Tiempo de lectura y chips de prerrequisitos por página.
- Anotaciones por página, guardadas localmente, con búsqueda, orden,
  exportar/importar y deshacer al eliminar.
- Página de colaboradores (monitoría, material y código vía API de GitHub).
- Tema claro y oscuro que sigue al sistema, sin parpadeo.
- SEO: sitemap, robots, Open Graph, URLs canónicas y 404 personalizado.
- Cabeceras de seguridad y Content Security Policy.

## Tecnologías

- Next.js (App Router, Turbopack), React y TypeScript en modo strict.
- Tailwind CSS v4 con el plugin de tipografía.
- MDX vía `next-mdx-remote/rsc` y `gray-matter`.
- KaTeX (`remark-math`, `rehype-katex`), `remark-gfm` y `rehype-slug`.
- `next-themes`, `lucide-react` y `zod`.
- Vitest con Testing Library, y Playwright con axe.
- ESLint, Prettier, Husky, commitlint y GitHub Actions.

## Primeros Pasos

```bash
npm install
cp .env.example .env.local   # define NEXT_PUBLIC_SITE_URL
npm run dev                  # http://localhost:3000
```

## Scripts

| Comando             | Descripción                  |
| ------------------- | ---------------------------- |
| `npm run dev`       | Servidor de desarrollo       |
| `npm run build`     | Build de producción (SSG)    |
| `npm run start`     | Sirve el build de producción |
| `npm run lint`      | ESLint                       |
| `npm run typecheck` | `tsc --noEmit`               |
| `npm run format`    | Prettier (escritura)         |
| `npm run test`      | Vitest (watch)               |
| `npm run test:run`  | Vitest (una sola vez)        |
| `npm run test:e2e`  | Playwright (smoke y axe)     |

## Contenido

El contenido vive en [`content/`](content/), organizado en tres niveles:

```
content/<curso>/<grupo>/<página>.mdx
```

Crear un archivo `.mdx` genera automáticamente ruta, elemento en la barra
lateral, breadcrumb, navegación anterior/siguiente y entrada en el buscador.
Ver [docs/en/authoring.md](docs/en/authoring.md).

## Arquitectura

El código está organizado feature first en `src/features/*`, con solo lo
genuinamente compartido en `src/shared/*`. Ver
[docs/en/architecture.md](docs/en/architecture.md).

## Pruebas

- Pruebas unitarias y de componentes con Vitest y Testing Library
  (`npm run test:run`).
- Pruebas de smoke y accesibilidad con Playwright y axe (`npm run test:e2e`).

## Despliegue

El despliegue corre en Vercel, con preview automático por pull request y
producción al hacer merge a `main`. Vercel ejecuta `next build`, mientras que
el [CI de GitHub Actions](.github/workflows/ci.yml) ejecuta los gates de
calidad (tipos, lint, tests, e2e y auditoría) que bloquean el merge.

## Licencia

Distribuido bajo la **Licencia MIT**. Ver el archivo [LICENSE](LICENSE) para
más detalles.

</br>

## Autor

Desarrollado por **Dário Matias Sales**:

- Portafolio: [https://dariomatias-dev.com](https://dariomatias-dev.com)
- GitHub: [https://github.com/dariomatias-dev](https://github.com/dariomatias-dev)
- Email: [dariomatias.dev@gmail.com](mailto:dariomatias.dev@gmail.com)
- Instagram: [https://instagram.com/dariomatias_dev](https://instagram.com/dariomatias_dev)
- LinkedIn: [https://linkedin.com/in/dariomatias-dev](https://linkedin.com/in/dariomatias-dev)
