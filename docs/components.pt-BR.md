<strong>Idioma:</strong> <a href="components.md">English</a> | <a href="components.es.md">Español</a> | Português

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

Exercício com resposta revelável. Sem `title`, os exercícios se numeram na
ordem da página ("Exercício 1", "Exercício 2"...).

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

## Question / Badge / Resolution / Proof

Usados nas páginas de avaliações (`content/.../avaliacoes/`). `Badge` é um
selo inline para o cabeçalho da questão (pontuação, fonte); `Question` é o
container da questão; `Resolution` esconde a resolução atrás de um botão
"Ver resolução"; `Proof` é um bloco de demonstração com borda lateral,
sempre visível.

```mdx
## Questão 1 <Badge>1,0 pt</Badge>

<Question>Sejam A e B conjuntos finitos...</Question>

<Resolution>$|A \cup B| = |A| + |B| - |A \cap B|$.</Resolution>

<Proof>Por indução em $n$...</Proof>
```

## Alternatives / Alternative

Lista de alternativas estática (a, b, c...), sem interação; não confundir
com `Quiz`, que corrige a resposta.

```mdx
<Alternatives>
  <Alternative>Primeira opção.</Alternative>
  <Alternative>Segunda opção.</Alternative>
</Alternatives>
```

## PixelGrid

Grade de pixels em preto e branco a partir de uma string binária, usada em
questões que envolvem imagens/bitmaps.

```mdx
<PixelGrid columns="3" pattern="000 011 001 011 011" />
```

`pattern` ignora espaços; cada `1` vira um pixel branco, cada `0` um pixel
preto. `columns` é o número de colunas da grade.

## RegionDiagram

Diagrama SVG de um retângulo dividido em 4 regiões por um ponto de corte,
com uma região destacada.

```mdx
<RegionDiagram xMax="5" yMax="7" xSplit="3" ySplit="5" highlight="top-left" />
```

`highlight` aceita `bottom-left`, `bottom-right`, `top-left` ou `top-right`.

## SetCalculator / MatrixCalculator / BooleanMatrixCalculator

Calculadoras interativas sem props e sem children; cada uma é uma ilha
client-side autocontida para explorar um tópico do curso.

```mdx
<SetCalculator />
<MatrixCalculator />
<BooleanMatrixCalculator />
```

- `SetCalculator`: união, interseção, diferença e diferença simétrica entre
  dois conjuntos digitados pelo usuário.
- `MatrixCalculator`: soma, subtração, multiplicação e escalar encadeados
  sobre matrizes numéricas definidas pelo usuário.
- `BooleanMatrixCalculator`: soma booleana, produto booleano e produto de
  matrizes sobre matrizes de bits.

## Facts

Envolve uma lista `- **Rótulo:** valor` e a exibe como uma grade de cartões
rotulados. A lista continua no MDX, então a busca e o "copiar conteúdo"
mantêm o texto; uma lista em outro formato aparece sem mudanças.

```mdx
<Facts>

- **Pré-requisito:** Nenhum
- **Carga horária:** 67 horas

</Facts>
```

## ClassSchedule

Envolve a tabela `Data | Assunto` da disciplina (datas em `dd/mm/aaaa`) e a
exibe como uma linha do tempo agrupada por mês: aulas passadas ficam
esmaecidas, a próxima aula fica em destaque e linhas em negrito são marcadas
como avaliação. A tabela continua no MDX; se nenhuma linha tiver data, ela
aparece como tabela comum. Fica na feature `schedule` e é registrado aqui.

```mdx
<ClassSchedule>

| Data           | Assunto              |
| -------------- | -------------------- |
| 04/08/2026     | Conceito de conjunto |
| **08/09/2026** | **Avaliação 1**      |

</ClassSchedule>
```
