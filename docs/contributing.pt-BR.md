<strong>Idioma:</strong> <a href="contributing.md">English</a> | Português | <a href="contributing.es.md">Español</a>

# Como contribuir

Este é um projeto pessoal de notas de curso (veja o [README](../README.pt-BR.md)),
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

A versão do Node está fixada em [`.nvmrc`](../.nvmrc); `nvm use` (ou
equivalente) já pega a versão certa.

## Antes de abrir um pull request

- [ ] A mudança tem um único foco (correção de conteúdo, funcionalidade,
      refactor, não uma mistura).
- [ ] `pnpm run verify` passa localmente (veja
      [O gate local](#o-gate-local) abaixo).
- [ ] Testes foram adicionados ou atualizados para comportamento que pode
      regredir.
- [ ] Mudanças de conteúdo foram revisadas; veja
      [Autoria de conteúdo](authoring.pt-BR.md) para as convenções de MDX do
      projeto.
- [ ] A mensagem de commit segue
      [Conventional Commits](https://www.conventionalcommits.org/) (forçado
      pelo commitlint; veja [Commits](#commits) abaixo).

## O gate local

```bash
pnpm run verify         # gate completo: tudo que o CI roda, incluindo e2e
pnpm run verify --fast  # pula build e e2e: o que o pre-push roda
```

[`scripts/verify.sh`](../scripts/verify.sh) roda exatamente os mesmos
checks do [CI](../.github/workflows/ci.yml), na mesma ordem. Um
`pnpm run verify` verde localmente significa que o CI também deveria ficar
verde. Se não ficar, é bug no gate, não coincidência para ignorar.

Veja [ci.pt-BR.md](ci.pt-BR.md) para o detalhamento job a job (gate vs.
relatório), o que os outros workflows (CodeQL, dependency review,
release-please, Lighthouse) fazem, como reproduzir uma execução
localmente com `act`, e como debugar uma falha de e2e a partir do trace
enviado.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/), forçado por um
hook `commit-msg` (`@commitlint/config-conventional`). Linha de cabeçalho
≤ 72 caracteres (`commitlint.config.mjs`). Tipos comuns usados neste
repositório: `feat`, `fix`, `docs`, `test`, `ci`, `chore`, `refactor`, `perf`.

```
fix(avaliacoes): corrige o sinal na demonstração da questão 12
```

## Atualizações de dependências

O Dependabot abre PRs semanais, agrupados por patch/minor em cada
ecossistema, então há um só pra revisar em vez de uma dezena. Veja
[dependencies.pt-BR.md](dependencies.pt-BR.md) pra saber quais pacotes ficam fixados
numa versão exata (e excluídos do agrupamento automático) e como triar um
PR do Dependabot.

## Branches

Não há um esquema de nomenclatura forçado. Parta de `main`, abra um pull
request contra `main`, e deixe o
[template de PR](../.github/pull_request_template.md) guiar a descrição.

## Trabalhando com um agente de IA

Se você está usando um agente de codificação de IA (Claude Code ou similar)
neste repositório, leia o [`AGENTS.md`](../AGENTS.md) primeiro: ele
carrega regras específicas do repositório que o agente precisa e que não
cabem neste guia voltado a humanos.
