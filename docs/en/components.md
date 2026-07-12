<strong>Language:</strong> English | <a href="../pt/components.md">Português</a>

# Study components

Registered in `src/features/study/registry.ts` and injected into the MDX. All of
them receive content through children (full markdown and KaTeX).

## Callout

Block highlight, with 6 types: `tip`, `caution`, `definition`, `example`,
`simulation`, `connection`.

```mdx
<Callout type="definition" title="Definition">
  A limit describes the neighborhood of a point.
</Callout>
```

## Collapsible

Collapsible block.

```mdx
<Collapsible title="Show details" defaultOpen={false}>
  Hidden content.
</Collapsible>
```

## Exercise / Answer

Exercise with a revealable answer.

```mdx
<Exercise>
Compute $\lim_{x \to 3}(2x + 1)$.

<Answer>
$7$.
</Answer>
</Exercise>
```

## Quiz / Option

Multiple choice with grading. Mark the correct one with `correct`. Options are
shuffled on the client, without a hydration mismatch.

```mdx
<Quiz question="Which one is correct?" explanation="Optional rationale.">
  <Option>Wrong</Option>
  <Option correct>Right</Option>
</Quiz>
```

## StepByStep / Step

Step by step solution, revealed one step at a time.

```mdx
<StepByStep title="Solve">
  <Step title="Factor">$x^2 - 1 = (x - 1)(x + 1)$.</Step>
  <Step title="Simplify">Cancel $(x - 1)$.</Step>
</StepByStep>
```

## YouTube

Embed via `youtube-nocookie`. Accepts an id or a URL.

```mdx
<YouTube id="WUvTyaaNkzM" title="Video title" />
```

> The embed requires `frame-src https://www.youtube-nocookie.com` in the CSP,
> already configured in `next.config.ts`.

## Question / Badge / Resolution / Proof

Used on exam pages (`content/.../avaliacoes/`). `Badge` is an inline tag for
the question heading (points, source); `Question` is the question container;
`Resolution` hides the resolution behind a "Ver resolução" button; `Proof` is
an always visible proof block with a side border.

```mdx
## Questão 1 <Badge>1,0 pt</Badge>

<Question>Let A and B be finite sets...</Question>

<Resolution>$|A \cup B| = |A| + |B| - |A \cap B|$.</Resolution>

<Proof>By induction on $n$...</Proof>
```

## Alternatives / Alternative

Static list of alternatives (a, b, c...), no interaction; not to be confused
with `Quiz`, which grades the answer.

```mdx
<Alternatives>
  <Alternative>First option.</Alternative>
  <Alternative>Second option.</Alternative>
</Alternatives>
```

## PixelGrid

Black-and-white pixel grid built from a binary string, used in questions
involving images/bitmaps.

```mdx
<PixelGrid columns="3" pattern="000 011 001 011 011" />
```

`pattern` ignores whitespace; each `1` becomes a white pixel, each `0` a
black pixel. `columns` is the grid's column count.

## RegionDiagram

SVG diagram of a rectangle split into 4 regions by a cut point, with one
region highlighted.

```mdx
<RegionDiagram xMax="5" yMax="7" xSplit="3" ySplit="5" highlight="top-left" />
```

`highlight` accepts `bottom-left`, `bottom-right`, `top-left` or
`top-right`.

## SetCalculator / MatrixCalculator / BooleanMatrixCalculator

Interactive calculators with no props and no children; each is a
self-contained client-side island for exploring a course topic.

```mdx
<SetCalculator />
<MatrixCalculator />
<BooleanMatrixCalculator />
```

- `SetCalculator`: union, intersection, difference and symmetric difference
  between two user-typed sets.
- `MatrixCalculator`: chained addition, subtraction, multiplication and
  scalar multiplication over user-defined numeric matrices.
- `BooleanMatrixCalculator`: boolean sum, boolean product and matrix product
  over bit matrices.
