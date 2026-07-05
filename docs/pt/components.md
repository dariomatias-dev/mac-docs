<strong>Idioma:</strong> <a href="../en/components.md">English</a> | Português

# Componentes de estudo

Registrados em `src/features/study/registry.ts` e injetados no MDX. Todos recebem
conteúdo via children (markdown e KaTeX completos).

## Callout

Destaque em bloco, com 6 tipos: `tip`, `caution`, `definition`, `example`,
`simulation`, `connection`.

```mdx
<Callout type="definition" title="Definição">
  O limite descreve o entorno de um ponto.
</Callout>
```

## Collapsible

Bloco recolhível.

```mdx
<Collapsible title="Ver detalhes" defaultOpen={false}>
  Conteúdo oculto.
</Collapsible>
```

## Exercise / Answer

Exercício com resposta revelável.

```mdx
<Exercise>
Calcule $\lim_{x \to 3}(2x + 1)$.

<Answer>
$7$.
</Answer>
</Exercise>
```

## Quiz / Option

Múltipla escolha com correção. Marque a certa com `correct`. As opções são
embaralhadas no cliente, sem mismatch de hidratação.

```mdx
<Quiz question="Qual é a correta?" explanation="Justificativa opcional.">
  <Option>Errada</Option>
  <Option correct>Certa</Option>
</Quiz>
```

## StepByStep / Step

Resolução passo a passo, revelada um passo por vez.

```mdx
<StepByStep title="Resolver">
  <Step title="Fatorar">$x^2 - 1 = (x - 1)(x + 1)$.</Step>
  <Step title="Simplificar">Cancele $(x - 1)$.</Step>
</StepByStep>
```

## YouTube

Embed via `youtube-nocookie`. Aceita um id ou uma URL.

```mdx
<YouTube id="WUvTyaaNkzM" title="Título do vídeo" />
```

> O embed exige `frame-src https://www.youtube-nocookie.com` na CSP, já
> configurado em `next.config.ts`.
