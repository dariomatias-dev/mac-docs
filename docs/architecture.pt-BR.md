<strong>Idioma:</strong> <a href="architecture.md">English</a> | <a href="architecture.es.md">Español</a> | Português

# Arquitetura

Organização feature first: cada feature é autocontida (componentes, hooks, libs,
tipos, testes). Só o genuinamente compartilhado sobe para `shared/`.

```
src/
├── app/                  # rotas finas, só compõem features
│   ├── layout.tsx
│   ├── page.tsx
│   ├── error.tsx  not-found.tsx  loading.tsx
│   ├── sitemap.ts  robots.ts  og/route.tsx
│   └── docs/[[...slug]]/
│       ├── page.tsx
│       ├── build-doc-view.ts   # composição content + navigation + toc
│       └── error.tsx  not-found.tsx  loading.tsx
│
├── features/
│   ├── annotations/      # anotações por página (localStorage), exportar/importar
│   ├── content/          # ler, parsear e renderizar MDX, tempo de leitura, cópia
│   ├── contributors/     # página /contribuidores: monitoria, material e código (API do GitHub)
│   ├── navigation/       # sidebar, breadcrumb, prev/next, header, providers
│   ├── schedule/         # horário de aulas, card "próxima aula" na home
│   ├── search/           # índice e diálogo de busca
│   ├── study/            # componentes interativos do MDX e registry
│   ├── toc/              # índice do artigo e scroll spy
│   └── theme/            # provider e toggle de tema
│
└── shared/
    ├── hooks/            # use-persisted-state, use-disclosure, use-copy, use-raf-scroll
    ├── lib/              # cn, site, content-config, env, json-ld, git-dates
    ├── components/       # cta-link (CtaLink/CtaButton)
    └── providers/        # active-mobile-sheet-provider (coordena os sheets mobile)

content/                  # conteúdo (.mdx) na raiz do repositório
```

## Regras de dependência

- Imports só descem: `app`, depois `features`, depois `shared`.
- `shared/` nunca importa de `features/`.
- `app/` e uma feature só alcançam outra feature pelo barril `index.ts` dela,
  nunca por um arquivo interno. Os arquivos internos da PRÓPRIA feature (seu
  `lib/`, `components/`) valem livremente.
- Cada feature expõe sua API pública via `index.ts`.
- Arquivos em kebab-case, componentes em PascalCase, hooks nomeados `useX`.
- Todo o código em inglês, textos de exibição em português.

O `import/no-restricted-paths` do `eslint.config.mjs` é o que de fato aplica
as três regras acima: `pnpm run lint` falha num import cruzado que esta seção
não lista como exceção abaixo, então esta seção não pode divergir do que é
realmente permitido do jeito que uma convenção só-em-comentário divergiria.

## Exceções conscientes

Cada uma destas também é uma entrada `except` explícita no
`eslint.config.mjs`, não só uma observação aqui.

- `search` agrega `navigation` (a árvore) e `content` (o texto); é uma feature de
  topo cuja função é justamente combinar as duas.
- O `Header` (em `navigation`) usa o `ThemeToggle` de `theme`.
- `navigation` (sidebar mobile) e `annotations` (painel de anotações) coordenam
  qual sheet mobile está aberto via `ActiveMobileSheetProvider`, em `shared/`,
  para no máximo um ficar aberto por vez.
- `annotations` lê `search/lib/search-shared.ts` direto, em vez de passar pelo
  barril de `search`: o barril também reexporta `getSearchIndex`, que lê
  `content/` do disco, e a página `"use client"` de `annotations` não pode
  arrastar isso para o bundle do navegador.

## Renderização e rotas

- A rota catch all opcional `app/docs/[[...slug]]` pré-renderiza todas as
  páginas via `generateStaticParams` (SSG puro), com `generateMetadata` por
  página (title, description, canonical, Open Graph).
- O conteúdo é lido do sistema de arquivos em build; nada roda no cliente além
  das ilhas interativas (busca, sidebar, componentes de estudo, índice do
  artigo, tema, anotações).
- `/contribuidores` busca os contribuidores de código na API do GitHub em
  build/revalidação (streaming via `Suspense`); monitoria e material são
  curados à mão em `src/features/contributors/data/`.

## Fluxo de dados: de um `.mdx` até a página renderizada e um resultado de busca

Um único arquivo em `content/` alimenta dois caminhos independentes, ambos
lendo o mesmo sistema de arquivos em tempo de build e nunca se comunicando
diretamente:

1. **A página.** `content/lib/mdx.ts` percorre `content/`, valida o
   frontmatter de cada arquivo contra `frontmatter-schema.ts` (o mesmo
   schema que `scripts/check-content.mjs` usa no CI, uma única fonte de
   verdade, não duas), e transforma um caminho de arquivo num `Doc` (slug,
   URL, frontmatter, código-fonte MDX cru). `app/docs/[[...slug]]/page.tsx`
   chama `getDocBySlug`, compõe com a árvore da sidebar e o índice do
   artigo em `build-doc-view.ts`, e entrega a string MDX crua ao
   `MdxRenderer`, que a compila com `next-mdx-remote/rsc` através do
   pipeline remark/rehype (GFM, matemática, ids de heading, KaTeX,
   pretty-code) e resolve qualquer tag customizada (`<MatrixCalculator>`,
   `<Quiz>`, ...) contra o mapa de componentes de `study/registry.ts`.
2. **A entrada de busca.** `search/lib/search-index.ts` percorre a mesma
   árvore de documentos (`getSidebarTree`, ela mesma construída a partir de
   `getAllDocs()`) de forma completamente separada, e para cada página
   chama `getPagePlainText`, que reduz o MDX a texto puro (removendo
   sintaxe Markdown e tags JSX, achatando LaTeX pra texto legível via
   `latex-to-text.ts`) e limita a 2000 caracteres. Isso produz o
   `SearchItem[]` plano servido estaticamente em `/search-index.json`,
   buscado sob demanda pelo `SearchDialog` e casado no cliente com o
   Fuse.js. A página renderizada e o índice de busca podem, em princípio,
   divergir (ex.: um bug de renderização num pipeline mas não no outro),
   já que processam a mesma fonte por caminhos de código genuinamente
   diferentes; essa é a troca aceita pra que o índice de busca não dependa
   do (e seja bem mais leve que) o pipeline completo de renderização MDX.

## Decisões

- **Por que SSG.** Toda página aqui é igual pra todo visitante (notas de
  curso, não conteúdo por usuário), e o único pedaço de estado real por
  usuário (anotações) já vive inteiramente no cliente. Não há requisição
  pra renderizar contra, então pagar por uma renderização no servidor a
  cada visita não compraria nada; o `generateStaticParams` pré-renderizando
  cada página em tempo de build torna cada uma um arquivo estático
  cacheável na borda.
- **Por que `next-mdx-remote/rsc` em vez de `@next/mdx`.** O `@next/mdx`
  espera arquivos `.mdx` colocados como arquivos de rota dentro de `app/`;
  o conteúdo deste projeto vive em `content/` na raiz do repositório, lido
  como strings puras e compilado sob demanda, então o mesmo arquivo pode
  alimentar uma página, uma entrada do índice de busca, e (via
  `scripts/check-content.mjs`) uma checagem de conteúdo no CI sem três
  mecanismos de carregamento diferentes. O `next-mdx-remote/rsc` compila
  uma string MDX com um pipeline remark/rehype customizado e resolve um
  mapa de componentes arbitrário (`study/registry.ts`) contra ela num
  Server Component, que é exatamente esse formato.
- **Por que `localStorage` pras anotações.** Este site não tem contas nem
  backend (ver o escopo declarado em [security.pt-BR.md](security.pt-BR.md)): uma
  nota pessoal por página é exatamente o tipo de estado que não justifica
  erguer nenhum dos dois. O `localStorage` mantém as anotações funcionando
  offline, não precisa de nenhum tratamento de privacidade pra conteúdo de
  usuário guardado em servidor, e não custa nada pra hospedar. A troca,
  aceita deliberadamente: as notas não sincronizam entre dispositivos ou
  navegadores, motivo pelo qual o painel também oferece exportar/importar
  explicitamente como JSON.
