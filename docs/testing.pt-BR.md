<strong>Idioma:</strong> <a href="testing.md">English</a> | Português | <a href="testing.es.md">Español</a>

# Testes

## O que de fato merece um teste aqui

Cobertura é um piso, não uma meta. Veja os thresholds e a razão deles em
`vitest.config.ts`. A decisão de julgamento que importa mais que o número
é _o quê_ testar:

- **Lógica real**: um cálculo, um branch, um pedaço de estado que pode
  estar errado. Operações de matriz, a lógica de ordenar/filtrar no
  painel de anotações, o caminho de recuperação de erro de um hook
  (`localStorage` malformado, uma escrita que falha), tudo vale um
  teste.
- **Interação real de usuário**: clicar num botão, esperar um resultado
  específico. Os testes de componente aqui renderizam o componente de
  verdade e interagem com ele via queries do Testing Library
  (`getByRole`, `getByText`), não acessando internos.
- **Caso de borda genuíno, não enchimento**: um limite de validação, um
  estado de lista vazia, uma corrida contra a qual o código
  explicitamente se protege. Adicionar um quarto caso de teste quase
  idêntico pra uma quinta entrada quase idêntica não é cobertura, é
  ruído.

O que deliberadamente **não** é perseguido:

- **Componentes marcadores que retornam `null`** (`Option`, `Step`,
  `Alternative` nos componentes de estudo): existem só pra
  `Children.toArray` ler suas props; chamá-los diretamente não afirma
  nada real.
- **`mdx-renderer.tsx`**: o `MDXRemote` do `next-mdx-remote/rsc` é um
  Server Component assíncrono; o renderizador cliente do Testing Library
  não consegue montá-lo (`<MDXRemote> is an async Client Component` é o
  erro que você recebe). Em compensação, é exercitado de verdade por toda
  página no `next build` e pela suíte e2e de a11y contra conteúdo real.
- **Wrappers passthrough triviais** (`theme-provider.tsx` reexportando o
  provider do `next-themes`): não há lógica pra dar errado.

## Test doubles

- **`vi.hoisted()` + `vi.mock()`** pra hooks e módulos dos quais um
  componente depende mas que não são a coisa sob teste: o
  `usePathname` do `next/navigation`, o `useTheme` do `next-themes`, uma
  função de busca de dados.
- **Providers de contexto reais em vez de mock profundo, quando são
  baratos.** `ActiveMobileSheetProvider`, `SidebarCollapseProvider` e
  `SidebarGroupsProvider` são envolvidos diretamente ao redor do
  componente sob teste em vez de mockados, já que são testados de forma
  independente e usar a coisa real pega bugs de integração que um mock
  não pegaria.
- **`localStorage.clear()`** no `beforeEach` pra qualquer coisa apoiada
  em estado persistido (anotações, colapso da sidebar), pra os testes
  não vazarem estado um pro outro.
- **Timers falsos (`vi.useFakeTimers()`)** pra qualquer coisa que faça
  debounce ou expire sozinha (a janela de desfazer das anotações, o
  reset do "copiado" de um botão de copiar). Prefira `fireEvent` a
  `userEvent` quando os timers estão fakeados: os delays internos do
  `userEvent` brigam com o `vi.useFakeTimers()` e podem travar um teste.
- **Lacunas do jsdom são reais e merecem um comentário, não um gambiarra
  silenciosa.** `Element.prototype.scrollIntoView` simplesmente não
  existe no jsdom (veja o polyfill em `vitest.setup.ts`); `scrollHeight`
  e propriedades derivadas de layout vêm com valor padrão `0` (veja os
  stubs explícitos em `toc.test.tsx` e `reading-progress.test.tsx`). Não
  deixe uma limitação do jsdom fazer um branch parecer não-testável
  silenciosamente quando na verdade só falta um stub.

## Rodando as suítes

```bash
pnpm test              # Vitest em modo watch
pnpm run test:run       # Vitest uma vez
pnpm run test:coverage  # Vitest uma vez, com os thresholds de cobertura aplicados
pnpm run test:e2e       # Playwright, contra um app já buildado
```

Os próprios arquivos de teste dos scripts
(`scripts/__tests__/check-content.test.mjs`,
`scripts/__tests__/check-bundle-size.test.mjs`) rodam pelos mesmos
comandos `test:*`: o padrão `include` do Vitest em `vitest.config.ts`
cobre `scripts/**/*.{test,spec}.mjs` também, não só `src/`.

## Debugando um teste que falha

Pra um teste unitário/de componente, o próprio `--reporter=verbose` do
Vitest e o `test.only` restringem as coisas rapidamente. Pra e2e, veja
[ci.md](ci.md#debugando-uma-falha-de-e2e) pra como extrair um trace de
uma falha do CI; localmente, `pnpm exec playwright test --debug` abre o
inspector do Playwright direto.
