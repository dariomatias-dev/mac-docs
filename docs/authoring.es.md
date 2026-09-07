<strong>Idioma:</strong> <a href="authoring.md">English</a> | Español | <a href="authoring.pt-BR.md">Português</a>

# Autoría de contenido (MDX)

## Estructura de carpetas

El contenido vive en `content/`, en tres niveles:

```
content/
  matematica-discreta/       # curso (etiqueta en la sidebar)
    matrizes/                # grupo (dropdown colapsable)
      index.mdx              # página del grupo (define título y orden)
      operacoes.mdx          # página
      matrizes-booleanas.mdx # página
```

- **Curso**: carpeta de nivel superior. La etiqueta viene de
  `COURSE_TITLES` en `src/features/navigation/lib/sidebar-tree.ts`, o del
  nombre de la carpeta.
- **Grupo**: subcarpeta con `index.mdx`. El `index.mdx` define el título y
  el orden.
- **Página**: cualquier otro `.mdx`. El campo `order` define la secuencia.

Crear un archivo `.mdx` genera automáticamente la ruta (`/docs/...`), el
ítem en la sidebar, el breadcrumb, la navegación anterior/siguiente y la
entrada en el índice de búsqueda.

## Frontmatter

Validado por `zod` en build. Un frontmatter inválido rompe el build con un
error claro.

```yaml
---
title: Operações com matrizes # obligatorio
description: Adición, sustracción y multiplicación. # opcional
order: 1 # opcional (ordena las páginas del grupo)
prerequisites: # opcional, cada ítem debe empezar con /docs/
  - /docs/matematica-discreta/matrizes
---
```

## Markdown y matemática

- GFM completo: tablas, listas de tareas, `~~tachado~~`, autolinks.
- KaTeX **inline** con `$...$` y en **bloque** con `$$...$$`.
- Los títulos `##` y `###` se convierten en el índice del artículo, con
  anclas.
- No uses `#` (h1): el título de la página ya se renderiza desde el
  frontmatter.

Para la sintaxis de las fórmulas, ver:

- [KaTeX: Supported Functions](https://katex.org/docs/supported.html): lista completa de comandos, símbolos y entornos aceptados por el renderizador.
- [KaTeX: Support Table](https://katex.org/docs/support_table.html): tabla buscable con cada símbolo y su comando.
- [LaTeX/Mathematics (Wikibooks)](https://en.wikibooks.org/wiki/LaTeX/Mathematics): guía más amplia de notación matemática en LaTeX.

## Componentes de estudio

Disponibles dentro de cualquier archivo `.mdx`, reciben contenido vía
children. Ver la referencia en [components.es.md](components.es.md).
