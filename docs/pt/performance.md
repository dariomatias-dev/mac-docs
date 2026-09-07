<strong>Idioma:</strong> <a href="../en/performance.md">English</a> | Português

# Performance

Duas checagens automatizadas observam performance: um orçamento rígido de
tamanho de bundle por rota crítica, e o Lighthouse CI, que por enquanto só
reporta, sem bloquear.

## Orçamento de tamanho de bundle

`scripts/check-bundle-size.mjs` lê a saída real de um `next build`: para
cada rota que checa, ele analisa o HTML pré-renderizado daquela rota em
busca de cada tag `<script src="/_next/static/chunks/*.js">`, soma o
tamanho real em disco desses arquivos, e falha se o total ultrapassar o
orçamento da rota. Rode com `pnpm run check:bundle-size` (faz parte do
`pnpm run verify` e do job `build` do CI, logo após o `next build`).

Isso mede a saída estática por rota diretamente, em vez de interpretar o
formato interno de client-reference-manifest do Next, que não é um contrato
estável pra depender — a versão do Next deste projeto já renomeou internos
uma vez (ver [dependencies.md](dependencies.md)).

### Orçamentos atuais

| Rota                                   | Orçamento | Medido na última revisão |
| -------------------------------------- | --------- | ------------------------ |
| `/`                                    | 1050 KB   | ~957 KB                  |
| `/docs/[[...slug]]` (conteúdo simples) | 1050 KB   | ~978 KB                  |

Esses números são um **piso contra regredir além do baseline medido**, não
uma meta — mesma filosofia dos thresholds de cobertura do Vitest em
`vitest.config.ts`. Baixar um orçamento é uma decisão deliberada que
precisa de uma medição por trás, assim como subir um.

### O que realmente compõe esse peso, e de onde viria o próximo corte

O baseline acima já reflete uma correção real feita ao montar esse
orçamento: `src/features/study/registry.ts` importava estaticamente todo
componente interativo (as duas calculadoras de matrizes, a calculadora de
matrizes booleanas, a calculadora de conjuntos, o quiz, o passo a passo, o
diagrama de região, a grade de pixels) num único objeto passado ao
`MdxRenderer` em **toda** página de documentação. Como as 73 páginas
compartilham um único arquivo de rota (`app/docs/[[...slug]]/page.tsx`), o
bundler não tinha como saber qual página de fato renderiza qual tag MDX,
então enviava todos eles — medido antes da correção como um único chunk de
~324 KB (calculadoras + KaTeX) carregado até por uma página sem nenhum
conteúdo interativo. Envolver cada um em `next/dynamic()` dá a cada um seu
próprio chunk, buscado só quando uma página de fato o renderiza — confirmado
comparando a lista de chunks referenciada por uma página cheia de
calculadoras contra uma de prosa simples, depois da mudança.

O que sobra nos ~957-978 KB é majoritariamente baseline de framework (React,
React DOM, o runtime do Next.js) mais o KaTeX (~260 KB), que ainda é
carregado de forma antecipada em **toda** página independente de ela conter
matemática ou não — confirmado em `plano-de-disciplina`, que não tem nenhum
`$...$` no código-fonte e mesmo assim envia o chunk do KaTeX. Esse é o
próximo corte real disponível aqui: ou detectar a presença de matemática em
tempo de build (a partir da AST do MDX compilado) e só registrar o
`rehype-katex` / carregar o `katex.css` nas páginas que precisam, ou aceitar
o carregamento antecipado como uma troca razoável para um site de
documentação repleto de matemática, onde a maioria das páginas de fato tem
pelo menos uma fórmula. Ninguém tomou essa decisão ainda — está sinalizada
aqui, não resolvida aqui.

## Lighthouse CI

`lighthouserc.json` roda o Lighthouse três vezes contra `/`, uma página de
conteúdo, e `/anotacoes`, num servidor `next start` real. `pnpm run
lighthouse` roda localmente; o CI roda num job `lighthouse` dedicado que
baixa o artefato do job `build` em vez de reconstruir.

Toda asserção em `lighthouserc.json` é `"warn"`, não `"error"`: reporta uma
nota sem falhar o job nem o pipeline. Isso é deliberado, não um descuido:
conforme o plano de onde este trabalho veio, a intenção é reportar por
algumas semanas, confirmar que os números se mantêm estáveis ao longo de
commits reais (notas do Lighthouse têm ruído natural de execução pra
execução), e só então trocar as categorias que importam pra `"error"` numa
mudança futura. Ninguém deveria virar essa chave sem antes olhar algumas
semanas de saída real do job `lighthouse`.

A nota de SEO de `/anotacoes` fica abaixo do orçamento por design: a página
é deliberadamente `robots: { index: false }` (pessoal, guardada em
`localStorage`, nada pra indexar), e a auditoria de SEO do Lighthouse
penaliza uma página noindex de propósito. Isso está documentado direto no
`lighthouserc.json`, ao lado da lista de URLs, não só aqui.
