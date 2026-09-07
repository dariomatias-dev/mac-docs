<strong>Idioma:</strong> <a href="performance.md">English</a> | Español | <a href="performance.pt-BR.md">Português</a>

# Performance

Dos verificaciones automatizadas observan la performance: un presupuesto
duro de tamaño de bundle por ruta crítica, y Lighthouse CI, que por ahora
solo reporta, sin bloquear.

## Presupuesto de tamaño de bundle

`scripts/check-bundle-size.mjs` lee la salida real de un `next build`:
para cada ruta que verifica, analiza el HTML pre-renderizado de esa ruta
en busca de cada tag `<script src="/_next/static/chunks/*.js">`, suma el
tamaño real en disco de esos archivos, y falla si el total supera el
presupuesto de la ruta. Ejecútalo con `pnpm run check:bundle-size` (es
parte de `pnpm run verify` y del job `build` del CI, justo después de
`next build`).

Esto mide la salida estática por ruta directamente, en vez de interpretar
el formato interno de client-reference-manifest de Next, que no es un
contrato lo suficientemente estable para depender de él: la versión de
Next de este proyecto ya renombró internos una vez (ver
[dependencies.es.md](dependencies.es.md)).

### Presupuestos actuales

| Ruta                                   | Presupuesto | Medido en la última revisión |
| -------------------------------------- | ----------- | ---------------------------- |
| `/`                                    | 1050 KB     | ~957 KB                      |
| `/docs/[[...slug]]` (contenido simple) | 1050 KB     | ~978 KB                      |

Estos números son un **piso contra regresar más allá del baseline
medido**, no una meta: misma filosofía que los umbrales de cobertura de
Vitest en `vitest.config.ts`. Bajar un presupuesto es una decisión
deliberada que necesita una medición detrás, igual que subir uno.

### Qué compone realmente ese peso, y de dónde vendría el próximo recorte

El baseline de arriba ya refleja una corrección real hecha al armar este
presupuesto: `src/features/study/registry.ts` importaba estáticamente
cada componente interactivo (ambas calculadoras de matrices, la
calculadora de matrices booleanas, la calculadora de conjuntos, el quiz,
el paso a paso, el diagrama de región, la grilla de píxeles) en un único
objeto pasado a `MdxRenderer` en **cada** página de documentación. Como
las 73 páginas comparten un único archivo de ruta
(`app/docs/[[...slug]]/page.tsx`), el bundler no tenía forma de saber qué
página realmente renderiza qué tag MDX, así que enviaba todos: medido
antes de la corrección como un único chunk de ~324 KB (calculadoras +
KaTeX) cargado incluso por una página sin ningún contenido interactivo.
Envolver cada uno en `next/dynamic()` le da a cada uno su propio chunk,
buscado solo cuando una página realmente lo renderiza: confirmado
comparando la lista de chunks que referencia una página cargada de
calculadoras contra una de prosa simple, después del cambio.

Lo que queda en los ~957-978 KB es mayormente baseline de framework
(React, React DOM, el runtime de Next.js) más KaTeX (~260 KB), que
todavía se carga de forma anticipada en **cada** página sin importar si
esa página contiene matemática o no: confirmado en
`plano-de-disciplina`, que no tiene ningún `$...$` en su código fuente y
aun así envía el chunk de KaTeX. Ese es el próximo recorte real
disponible aquí: o detectar la presencia de matemática en tiempo de
build (a partir del AST del MDX compilado) y solo registrar
`rehype-katex` / cargar `katex.css` en las páginas que lo necesitan, o
aceptar la carga anticipada como una contrapartida razonable para un
sitio de documentación repleto de matemática, donde la mayoría de las
páginas de hecho tienen al menos una fórmula. Nadie tomó esa decisión
todavía: está señalada aquí, no resuelta aquí.

## Lighthouse CI

`lighthouserc.json` corre Lighthouse tres veces contra `/`, una página de
contenido, y `/anotacoes`, en un servidor `next start` real. `pnpm run
lighthouse` lo corre localmente; el CI lo corre en un job `lighthouse`
dedicado que descarga el artefacto del job `build` en vez de reconstruir.

Cada aserción en `lighthouserc.json` es `"warn"`, no `"error"`: reporta
un puntaje sin fallar el job ni el pipeline. Esto es deliberado, no un
descuido: según el plan del que vino este trabajo, la intención es
reportar durante un par de semanas, confirmar que los números se
mantienen estables a través de commits reales (los puntajes de
Lighthouse tienen ruido natural de ejecución a ejecución), y solo
entonces cambiar las categorías que importan a `"error"` en un cambio
posterior. Nadie debería mover ese interruptor sin antes mirar unas
semanas de salida real del job `lighthouse`.

El puntaje de SEO de `/anotacoes` se espera que quede por debajo de su
presupuesto: la página es deliberadamente `robots: { index: false }`
(personal, respaldada por `localStorage`, nada que indexar), y la
auditoría de SEO de Lighthouse penaliza una página noindex por diseño.
Eso está documentado directamente en `lighthouserc.json`, al lado de la
lista de URLs, no solo aquí.
