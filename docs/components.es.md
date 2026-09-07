<strong>Idioma:</strong> <a href="components.md">English</a> | <a href="components.pt-BR.md">Português</a> | Español

# Componentes de estudio

Registrados en `src/features/study/registry.ts` e inyectados en el MDX.
Todos reciben contenido vía children (markdown y KaTeX completos).

## Callout

Destacado en bloque, con 6 tipos: `tip`, `caution`, `definition`,
`example`, `simulation`, `connection`.

```mdx
<Callout type="definition" title="Definición">
  El límite describe el entorno de un punto.
</Callout>
```

## Collapsible

Bloque colapsable.

```mdx
<Collapsible title="Ver detalles" defaultOpen={false}>
  Contenido oculto.
</Collapsible>
```

## Exercise / Answer

Ejercicio con respuesta revelable.

```mdx
<Exercise>
Calcula $\lim_{x \to 3}(2x + 1)$.

<Answer>
$7$.
</Answer>
</Exercise>
```

## Quiz / Option

Opción múltiple con corrección. Marca la correcta con `correct`. Las
opciones se mezclan en el cliente, sin mismatch de hidratación.

```mdx
<Quiz question="¿Cuál es la correcta?" explanation="Justificación opcional.">
  <Option>Incorrecta</Option>
  <Option correct>Correcta</Option>
</Quiz>
```

## StepByStep / Step

Resolución paso a paso, revelada un paso a la vez.

```mdx
<StepByStep title="Resolver">
  <Step title="Factorizar">$x^2 - 1 = (x - 1)(x + 1)$.</Step>
  <Step title="Simplificar">Cancela $(x - 1)$.</Step>
</StepByStep>
```

## YouTube

Embed vía `youtube-nocookie`. Acepta un id o una URL.

```mdx
<YouTube id="WUvTyaaNkzM" title="Título del video" />
```

> El embed requiere `frame-src https://www.youtube-nocookie.com` en la
> CSP, ya configurado en `next.config.ts`.

## Question / Badge / Resolution / Proof

Usados en las páginas de evaluaciones (`content/.../avaliacoes/`).
`Badge` es un sello inline para el encabezado de la pregunta (puntaje,
fuente); `Question` es el contenedor de la pregunta; `Resolution`
esconde la resolución detrás de un botón "Ver resolución"; `Proof` es un
bloque de demostración con borde lateral, siempre visible.

```mdx
## Pregunta 1 <Badge>1,0 pt</Badge>

<Question>Sean A y B conjuntos finitos...</Question>

<Resolution>$|A \cup B| = |A| + |B| - |A \cap B|$.</Resolution>

<Proof>Por inducción en $n$...</Proof>
```

## Alternatives / Alternative

Lista de alternativas estática (a, b, c...), sin interacción; no
confundir con `Quiz`, que corrige la respuesta.

```mdx
<Alternatives>
  <Alternative>Primera opción.</Alternative>
  <Alternative>Segunda opción.</Alternative>
</Alternatives>
```

## PixelGrid

Grilla de píxeles en blanco y negro a partir de una cadena binaria,
usada en preguntas que involucran imágenes/bitmaps.

```mdx
<PixelGrid columns="3" pattern="000 011 001 011 011" />
```

`pattern` ignora espacios; cada `1` se convierte en un píxel blanco, cada
`0` en un píxel negro. `columns` es el número de columnas de la grilla.

## RegionDiagram

Diagrama SVG de un rectángulo dividido en 4 regiones por un punto de
corte, con una región resaltada.

```mdx
<RegionDiagram xMax="5" yMax="7" xSplit="3" ySplit="5" highlight="top-left" />
```

`highlight` acepta `bottom-left`, `bottom-right`, `top-left` o
`top-right`.

## SetCalculator / MatrixCalculator / BooleanMatrixCalculator

Calculadoras interactivas sin props ni children; cada una es una isla
del lado del cliente, autocontenida, para explorar un tema del curso.

```mdx
<SetCalculator />
<MatrixCalculator />
<BooleanMatrixCalculator />
```

- `SetCalculator`: unión, intersección, diferencia y diferencia simétrica
  entre dos conjuntos escritos por el usuario.
- `MatrixCalculator`: suma, resta, multiplicación y escalar encadenados
  sobre matrices numéricas definidas por el usuario.
- `BooleanMatrixCalculator`: suma booleana, producto booleano y producto
  de matrices sobre matrices de bits.
