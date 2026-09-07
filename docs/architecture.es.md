<strong>Idioma:</strong> <a href="architecture.md">English</a> | <a href="architecture.pt-BR.md">Português</a> | Español

# Arquitectura

Organización feature-first: cada feature es autocontenida (componentes,
hooks, libs, tipos, tests). Solo lo genuinamente compartido sube a
`shared/`.

```
src/
├── app/                  # rutas delgadas, solo componen features
│   ├── layout.tsx
│   ├── page.tsx
│   ├── error.tsx  not-found.tsx  loading.tsx
│   ├── sitemap.ts  robots.ts  og/route.tsx
│   └── docs/[[...slug]]/
│       ├── page.tsx
│       ├── build-doc-view.ts   # composición content + navigation + toc
│       └── error.tsx  not-found.tsx  loading.tsx
│
├── features/
│   ├── annotations/      # anotaciones por página (localStorage), exportar/importar
│   ├── content/          # leer, parsear y renderizar MDX, tiempo de lectura, copiar
│   ├── contributors/     # página /contribuidores: monitoría, material y código (API de GitHub)
│   ├── navigation/       # sidebar, breadcrumb, prev/next, header, providers
│   ├── schedule/         # horario de clases, tarjeta "próxima clase" en el inicio
│   ├── search/           # índice y diálogo de búsqueda
│   ├── study/            # componentes interactivos del MDX y registry
│   ├── toc/              # índice del artículo y scroll spy
│   └── theme/            # provider y toggle de tema
│
└── shared/
    ├── hooks/            # use-persisted-state, use-disclosure, use-copy, use-raf-scroll
    ├── lib/              # cn, site, content-config, env, json-ld, git-dates
    ├── components/       # cta-link (CtaLink/CtaButton)
    └── providers/        # active-mobile-sheet-provider (coordina los sheets móviles)

content/                  # contenido (.mdx) en la raíz del repositorio
```

## Reglas de dependencia

- Los imports solo bajan: `app`, luego `features`, luego `shared`.
- `shared/` nunca importa de `features/`.
- `app/` y una feature solo alcanzan otra feature por su barril `index.ts`,
  nunca por un archivo interno. Los archivos internos de la PROPIA feature
  (su `lib/`, `components/`) valen libremente.
- Cada feature expone su API pública vía `index.ts`.
- Archivos en kebab-case, componentes en PascalCase, hooks nombrados `useX`.
- Todo el código en inglés, textos de visualización en portugués.

El `import/no-restricted-paths` de `eslint.config.mjs` es lo que de hecho
aplica las tres reglas de arriba: `pnpm run lint` falla ante un import
cruzado que esta sección no liste como excepción abajo, así que esta
sección no puede divergir de lo que realmente está permitido, como sí
podría divergir una convención documentada solo en comentarios.

## Excepciones conscientes

Cada una de estas es también una entrada `except` explícita en
`eslint.config.mjs`, no solo una nota aquí.

- `search` agrega `navigation` (el árbol) y `content` (el texto); es una
  feature de nivel superior cuya función es justamente combinar las dos.
- El `Header` (en `navigation`) usa el `ThemeToggle` de `theme`.
- `navigation` (sidebar móvil) y `annotations` (panel de anotaciones)
  coordinan qué sheet móvil está abierto vía `ActiveMobileSheetProvider`, en
  `shared/`, para que como máximo uno quede abierto a la vez.
- `annotations` lee `search/lib/search-shared.ts` directamente, en vez de
  pasar por el barril de `search`: el barril también reexporta
  `getSearchIndex`, que lee `content/` del disco, y la página
  `"use client"` de `annotations` no puede arrastrar eso al bundle del
  navegador.

## Renderizado y rutas

- La ruta catch-all opcional `app/docs/[[...slug]]` pre-renderiza todas
  las páginas vía `generateStaticParams` (SSG puro), con `generateMetadata`
  por página (title, description, canonical, Open Graph).
- El contenido se lee del sistema de archivos en build; nada corre en el
  cliente además de las islas interactivas (búsqueda, sidebar, componentes
  de estudio, índice del artículo, tema, anotaciones).
- `/contribuidores` busca los contribuidores de código en la API de GitHub
  en build/revalidación (streaming vía `Suspense`); monitoría y material
  son curados a mano en `src/features/contributors/data/`.

## Flujo de datos: de un `.mdx` a la página renderizada y a un resultado de búsqueda

Un único archivo bajo `content/` alimenta dos caminos independientes,
ambos leyendo el mismo sistema de archivos en tiempo de build y sin
comunicarse nunca directamente:

1. **La página.** `content/lib/mdx.ts` recorre `content/`, valida el
   frontmatter de cada archivo contra `frontmatter-schema.ts` (el mismo
   schema que `scripts/check-content.mjs` usa en CI, una única fuente de
   verdad, no dos), y transforma una ruta de archivo en un `Doc` (slug,
   URL, frontmatter, código fuente MDX crudo). `app/docs/[[...slug]]/page.tsx`
   llama a `getDocBySlug`, lo compone con el árbol de la sidebar y el
   índice del artículo en `build-doc-view.ts`, y entrega la cadena MDX
   cruda a `MdxRenderer`, que la compila con `next-mdx-remote/rsc` a
   través del pipeline remark/rehype (GFM, matemática, ids de heading,
   KaTeX, pretty-code) y resuelve cualquier tag personalizado
   (`<MatrixCalculator>`, `<Quiz>`, ...) contra el mapa de componentes de
   `study/registry.ts`.
2. **La entrada de búsqueda.** `search/lib/search-index.ts` recorre el
   mismo árbol de documentos (`getSidebarTree`, a su vez construido a
   partir de `getAllDocs()`) de forma completamente separada, y para cada
   página llama a `getPagePlainText`, que reduce el MDX a texto plano
   (quitando la sintaxis Markdown y las tags JSX, aplanando LaTeX a texto
   legible vía `latex-to-text.ts`) y lo limita a 2000 caracteres. Eso
   produce el `SearchItem[]` plano servido estáticamente en
   `/search-index.json`, buscado bajo demanda por `SearchDialog` y
   comparado en el cliente con Fuse.js. La página renderizada y el índice
   de búsqueda pueden, en principio, divergir (p. ej. un bug de
   renderizado en un pipeline pero no en el otro), ya que procesan la
   misma fuente por caminos de código genuinamente distintos; esa es la
   contrapartida aceptada para que el índice de búsqueda no dependa del
   (y sea mucho más liviano que el) pipeline completo de renderizado MDX.

## Decisiones

- **Por qué SSG.** Cada página aquí es igual para cada visitante (notas
  de curso, no contenido por usuario), y el único fragmento de estado real
  por usuario (anotaciones) ya vive enteramente en el cliente. No hay una
  solicitud contra la cual renderizar, así que pagar por un renderizado en
  servidor en cada visita no compraría nada; `generateStaticParams`
  pre-renderizando cada página en tiempo de build convierte a cada una en
  un archivo estático cacheable en el borde.
- **Por qué `next-mdx-remote/rsc` en vez de `@next/mdx`.** `@next/mdx`
  espera archivos `.mdx` colocados como archivos de ruta dentro de `app/`;
  el contenido de este proyecto vive en `content/` en la raíz del
  repositorio, leído como cadenas puras y compilado bajo demanda, así que
  el mismo archivo puede alimentar una página, una entrada del índice de
  búsqueda, y (vía `scripts/check-content.mjs`) una verificación de
  contenido en CI sin tres mecanismos de carga distintos.
  `next-mdx-remote/rsc` compila una cadena MDX con un pipeline
  remark/rehype personalizado y resuelve un mapa de componentes arbitrario
  (`study/registry.ts`) contra ella en un Server Component, que es
  exactamente ese formato.
- **Por qué `localStorage` para las anotaciones.** Este sitio no tiene
  cuentas ni backend (ver el alcance declarado en
  [security.es.md](security.es.md)): una nota personal por página es
  exactamente el tipo de estado que no justifica levantar ninguno de los
  dos. `localStorage` mantiene las anotaciones funcionando sin conexión,
  no necesita ningún tratamiento de privacidad para contenido de usuario
  guardado en servidor, y no cuesta nada de hospedar. La contrapartida,
  aceptada deliberadamente: las notas no se sincronizan entre
  dispositivos ni navegadores, razón por la cual el panel también ofrece
  exportar/importar explícitamente como JSON.
