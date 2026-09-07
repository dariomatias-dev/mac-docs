<strong>Idioma:</strong> <a href="../en/contributing.md">English</a> | Português

# Como contribuir

Este é um projeto pessoal de notas de curso (veja o [README](../../README.pt-BR.md)),
mantido majoritariamente por uma pessoa. Correções de conteúdo, relatos de bug
e ajustes pequenos são bem-vindos de verdade; propostas de funcionalidade
maiores têm mais chance de entrar se abertas primeiro como issue, já que o
escopo do site é propositalmente restrito.

## Setup

```bash
git clone https://github.com/dariomatias-dev/mac-docs.git
cd mac-docs
pnpm install
cp .env.example .env.local   # defina NEXT_PUBLIC_SITE_URL
pnpm run dev                  # http://localhost:3000
```

A versão do Node está fixada em [`.nvmrc`](../../.nvmrc); `nvm use` (ou
equivalente) já pega a versão certa.

## Antes de abrir um pull request

- [ ] A mudança tem um único foco (correção de conteúdo, funcionalidade,
      refactor, não uma mistura).
- [ ] `pnpm run verify` passa localmente (veja
      [O gate local](#o-gate-local) abaixo).
- [ ] Testes foram adicionados ou atualizados para comportamento que pode
      regredir.
- [ ] Mudanças de conteúdo foram revisadas; veja
      [Autoria de conteúdo](authoring.md) para as convenções de MDX do
      projeto.
- [ ] A mensagem de commit segue
      [Conventional Commits](https://www.conventionalcommits.org/) (forçado
      pelo commitlint; veja [Commits](#commits) abaixo).

## O gate local

```bash
pnpm run verify         # gate completo: tudo que o CI roda, incluindo e2e
pnpm run verify --fast  # pula build e e2e: o que o pre-push roda
```

[`scripts/verify.sh`](../../scripts/verify.sh) roda exatamente os mesmos
checks do [CI](../../.github/workflows/ci.yml), na mesma ordem. Um
`pnpm run verify` verde localmente significa que o CI também deveria ficar
verde. Se não ficar, é bug no gate, não coincidência para ignorar.

### O que o CI de fato verifica

| Job               | Verifica                           | Gate ou relatório?                    |
| ----------------- | ---------------------------------- | ------------------------------------- |
| `quality`         | format, lint, typecheck, conteúdo  | Gate, barra o merge                   |
| `unit`            | Vitest com thresholds de cobertura | Gate, barra o merge                   |
| `build`           | `next build`                       | Gate, barra o merge                   |
| `e2e`             | Playwright (smoke + axe)           | Gate, barra o merge                   |
| `vulnerabilities` | `pnpm audit --audit-level=high`    | Só relatório, visível, nunca barra PR |

O job de auditoria é intencionalmente não-bloqueante: um advisory novo de alta
severidade numa dependência de ferramenta de desenvolvimento sem relação com
o código (isso já aconteceu, numa dependência transitiva do `commitlint`) não
deveria travar todo PR até alguém atualizar um pacote que nem controla
diretamente.

### Reproduzindo o CI localmente com `act`

O [`nektos/act`](https://github.com/nektos/act) roda o workflow do GitHub
Actions em Docker, usando a imagem fixada em [`.actrc`](../../.actrc):

```bash
act -l              # lista os jobs e a ordem de dependência
act -j quality       # roda um job específico
act                  # roda tudo
```

`quality`, `unit` e `vulnerabilities` rodam limpos no `act`. `build` e `e2e`
hoje não completam de ponta a ponta localmente: o servidor de artefatos local
do `act` ainda não suporta o protocolo que `actions/upload-artifact@v7` e
`actions/download-artifact@v8` usam (rastreado no upstream em
[nektos/act#6022](https://github.com/nektos/act/issues/6022) e
[#6114](https://github.com/nektos/act/issues/6114)). O passo de build em si
roda e o resultado continua correto; só a transferência do artefato para o
job `e2e` falha localmente. Abra um PR em rascunho para ver esses dois jobs
rodando de verdade.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/), forçado por um
hook `commit-msg` (`@commitlint/config-conventional`). Linha de cabeçalho
≤ 72 caracteres (`commitlint.config.mjs`). Tipos comuns usados neste
repositório: `feat`, `fix`, `docs`, `test`, `ci`, `chore`, `refactor`, `perf`.

```
fix(avaliacoes): corrige o sinal na demonstração da questão 12
```

## Branches

Não há um esquema de nomenclatura forçado. Parta de `main`, abra um pull
request contra `main`, e deixe o
[template de PR](../../.github/pull_request_template.md) guiar a descrição.

## Trabalhando com um agente de IA

Se você está usando um agente de codificação de IA (Claude Code ou similar)
neste repositório, leia o [`AGENTS.md`](../../AGENTS.md) primeiro: ele
carrega regras específicas do repositório que o agente precisa e que não
cabem neste guia voltado a humanos.
