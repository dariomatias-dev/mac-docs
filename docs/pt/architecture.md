<strong>Idioma:</strong> <a href="../en/architecture.md">English</a> | Português

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
│   ├── search/           # índice e diálogo de busca
│   ├── study/            # componentes interativos do MDX e registry
│   ├── toc/              # índice do artigo e scroll spy
│   └── theme/            # provider e toggle de tema
│
├── shared/
│   ├── hooks/            # use-persisted-state, use-disclosure, use-copy, use-raf-scroll
│   ├── lib/              # site, content-config, env, json-ld
│   ├── components/       # cta-link (CtaLink/CtaButton)
│   └── providers/        # active-mobile-sheet-provider (coordena os sheets mobile)
│
└── lib/
    └── utils.ts          # cn (clsx + tailwind-merge)

content/                  # conteúdo (.mdx) na raiz do repositório
```

## Regras de dependência

- Imports só descem: `app`, depois `features`, depois `shared`.
- Features não importam umas às outras. Quando precisam de dados de outra, a
  composição acontece na camada `app` (por exemplo, `build-doc-view.ts` combina
  `content`, `navigation` e `toc` para montar a página de docs).
- Cada feature expõe sua API pública via `index.ts`.
- Arquivos em kebab-case, componentes em PascalCase, hooks nomeados `useX`.
- Todo o código em inglês, textos de exibição em português.

## Exceções conscientes

- `search` agrega `navigation` (a árvore) e `content` (o texto); é uma feature de
  topo cuja função é justamente combinar as duas.
- O `Header` (em `navigation`) usa o `ThemeToggle` de `theme`.
- `navigation` (sidebar mobile) e `annotations` (painel de anotações) coordenam
  qual sheet mobile está aberto via `ActiveMobileSheetProvider`, em `shared/`,
  para no máximo um ficar aberto por vez.

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
