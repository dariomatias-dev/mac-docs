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
