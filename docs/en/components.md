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
