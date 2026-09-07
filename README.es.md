<br>
<div align="center">
<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
<img src="https://img.shields.io/badge/MDX-1B1F24?style=for-the-badge&logo=mdx&logoColor=white" alt="MDX">
</div>
<br>

<p align="center">
<a href="https://github.com/dariomatias-dev/mac-docs/actions/workflows/ci.yml"><img src="https://github.com/dariomatias-dev/mac-docs/actions/workflows/ci.yml/badge.svg" alt="Estado del CI"></a>
<a href="https://codecov.io/gh/dariomatias-dev/mac-docs"><img src="https://img.shields.io/codecov/c/github/dariomatias-dev/mac-docs" alt="Cobertura"></a>
<a href="LICENSE"><img src="https://img.shields.io/github/license/dariomatias-dev/mac-docs" alt="Licencia"></a>
<img src="https://img.shields.io/badge/node-%3E%3D24-339933?logo=node.js&logoColor=white" alt="Versión de Node.js">
</p>

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
- [Preview](#preview)
- [Funcionalidades](#funcionalidades)
- [Tecnologías](#tecnologías)
- [Primeros Pasos](#primeros-pasos)
- [Scripts](#scripts)
- [Contenido](#contenido)
- [Arquitectura](#arquitectura)
- [Pruebas](#pruebas)
- [Despliegue](#despliegue)
- [Contribuir](#contribuir)
- [Seguridad](#seguridad)
- [Licencia](#licencia)
- [Autor](#autor)

</br>

## Sobre el Proyecto

MacDocs es un sitio de documentación totalmente estático (SSG) al estilo de
react.dev. Convierte un árbol de archivos MDX en un sitio navegable,
buscable e interactivo. Basta con agregar un archivo `.mdx` para generar una
ruta, un elemento en la barra lateral, breadcrumb, navegación
anterior/siguiente y una entrada en el buscador.

## Preview

<p align="center">
<img src="public/screenshots/home.png" alt="Página de inicio de MacDocs" width="800">
<br><em>Página de inicio</em>
<br><br>
<img src="public/screenshots/docs-page.png" alt="Una página de documentación de MacDocs, con la barra lateral, el índice del artículo y una fórmula KaTeX renderizada" width="800">
<br><em>Una página de documentación, con la barra lateral, el índice del artículo y una fórmula renderizada</em>
</p>

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
pnpm install
cp .env.example .env.local   # define NEXT_PUBLIC_SITE_URL
pnpm run dev                  # http://localhost:3000
```

## Scripts

| Comando              | Descripción                  |
| -------------------- | ---------------------------- |
| `pnpm run dev`       | Servidor de desarrollo       |
| `pnpm run build`     | Build de producción (SSG)    |
| `pnpm run start`     | Sirve el build de producción |
| `pnpm run lint`      | ESLint                       |
| `pnpm run typecheck` | `tsc --noEmit`               |
| `pnpm run format`    | Prettier (escritura)         |
| `pnpm run test`      | Vitest (watch)               |
| `pnpm run test:run`  | Vitest (una sola vez)        |
| `pnpm run test:e2e`  | Playwright (smoke y axe)     |

## Contenido

El contenido vive en [`content/`](content/), organizado en tres niveles:

```
content/<curso>/<grupo>/<página>.mdx
```

Crear un archivo `.mdx` genera automáticamente ruta, elemento en la barra
lateral, breadcrumb, navegación anterior/siguiente y entrada en el buscador.
Ver [docs/authoring.es.md](docs/authoring.es.md).

## Arquitectura

El código está organizado feature first en `src/features/*`, con solo lo
genuinamente compartido en `src/shared/*`. Ver
[docs/architecture.es.md](docs/architecture.es.md).

## Pruebas

- Pruebas unitarias y de componentes con Vitest y Testing Library
  (`pnpm run test:run`).
- Pruebas de smoke y accesibilidad con Playwright y axe (`pnpm run test:e2e`).

## Despliegue

El despliegue corre en Vercel, con preview automático por pull request y
producción al hacer merge a `main`. Vercel ejecuta `next build`, mientras que
el [CI de GitHub Actions](.github/workflows/ci.yml) ejecuta los gates de
calidad (formato, lint, tipos, enlaces internos, tests y e2e) que bloquean el
merge. La auditoría de dependencias también corre, pero solo como reporte no
bloqueante. Ver [Contribuir](#contribuir). Los releases se versionan
automáticamente: [release-please](https://github.com/googleapis/release-please)
mantiene un PR permanente con el [`CHANGELOG.md`](CHANGELOG.md) y el bump de
versión de `package.json`, cortando un release etiquetado en GitHub cuando
se hace merge.

## Contribuir

Correcciones de contenido, reportes de errores y ajustes pequeños son
bienvenidos. Ver [docs/contributing.es.md](docs/contributing.es.md) para el
setup, el gate local (`pnpm run verify`) y las convenciones de commit. Este
proyecto sigue el [Contributor Covenant](docs/code_of_conduct.es.md).

## Seguridad

¿Encontraste una vulnerabilidad? Por favor no abras un issue público. Ver
[docs/security.es.md](docs/security.es.md) para cómo reportarla de forma
privada.

## Licencia

Distribuido bajo la **Licencia MIT**. Ver el archivo [LICENSE](LICENSE) para
más detalles.

## Autor

Desarrollado por **Dário Matias Sales**:

- Portafolio: [https://dariomatias-dev.com](https://dariomatias-dev.com)
- GitHub: [https://github.com/dariomatias-dev](https://github.com/dariomatias-dev)
- Email: [dariomatias.dev@gmail.com](mailto:dariomatias.dev@gmail.com)
- Instagram: [https://instagram.com/dariomatias_dev](https://instagram.com/dariomatias_dev)
- LinkedIn: [https://linkedin.com/in/dariomatias-dev](https://linkedin.com/in/dariomatias-dev)
