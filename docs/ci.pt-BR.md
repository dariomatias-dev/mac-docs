<strong>Idioma:</strong> <a href="ci.md">English</a> | Português | <a href="ci.es.md">Español</a>

# Integração Contínua

Dois princípios atravessam todo workflow aqui:

1. **Gate e relatório são coisas diferentes.** O que de fato barra um pull
   request mora neste repositório (um script, um threshold): nunca só
   num serviço externo, então um PR de fork sem um secret configurado
   nunca fica bloqueado por falta de token.
2. **O gate local espelha o CI.** `pnpm run verify` (veja
   [contributing.md](contributing.md#o-gate-local)) roda os mesmos checks
   que o `ci.yml` roda, na mesma ordem. Um run local verde deveria
   significar um run de CI verde.

## `.github/workflows/ci.yml`

| Job               | Verifica                                                                                                    | Gate ou relatório?                                                                        |
| ----------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `quality`         | format, lint, tipos, conteúdo, paridade de idiomas dos docs                                                 | Gate, barra o merge                                                                       |
| `unit`            | Vitest com thresholds de cobertura, depois upload pro Codecov                                               | Os testes são gate; o upload é só relatório                                               |
| `build`           | `next build`, depois o orçamento de tamanho de bundle                                                       | Ambos gate; veja [performance.pt-BR.md](performance.pt-BR.md)                             |
| `e2e`             | Playwright (smoke, navegação, busca, anotações, estudo, seo, segurança, a11y; desktop e um viewport mobile) | Gate, barra o merge                                                                       |
| `vulnerabilities` | `pnpm audit`, `osv-scanner` contra o lockfile, `gitleaks` pra segredos commitados                           | Só relatório, nunca barra um PR                                                           |
| `lighthouse`      | Lighthouse (performance, acessibilidade, SEO, boas práticas) contra três páginas                            | Só relatório: toda asserção é `"warn"`, veja [performance.pt-BR.md](performance.pt-BR.md) |

O `build` sobe o `.next` como artefato; `e2e` e `lighthouse` baixam esse
artefato em vez de reconstruir, então o app é buildado exatamente uma vez
por execução.

O job `vulnerabilities` é intencionalmente não-bloqueante: um advisory
novo de alta severidade numa dependência de ferramenta de desenvolvimento
sem relação com o código não deveria travar todo PR até alguém atualizar
um pacote que nem controla diretamente. Mesmo raciocínio pro
`lighthouse`: notas do Lighthouse têm ruído real de execução pra
execução, então usá-las como gate antes de confirmar que estão estáveis
falharia PRs sem nenhuma regressão real.

## Outros workflows

- **`codeql.yml`**: análise estática (JavaScript/TypeScript), em todo
  PR, todo push pra `main`, e um schedule semanal pra um update do
  query-pack aparecer até numa semana quieta. Barra via o check de code
  scanning do GitHub.
- **`dependency-review.yml`**: em todo PR, falha só num advisory de
  severidade alta ou acima _recém-introduzido_ ou numa licença não
  permitida; um advisory já presente na `main` não barra retroativamente
  um PR sem relação (é o que o job `vulnerabilities` reporta em vez
  disso).
- **`release-please.yml`**: no push pra `main`, mantém um pull request
  de release permanente com o `CHANGELOG.md` e o bump de versão do
  `package.json`. Veja o [README](../README.pt-BR.md#deploy) pra como
  o merge dele corta uma release.

## Reproduzindo o CI localmente com `act`

O [`nektos/act`](https://github.com/nektos/act) roda o workflow do
GitHub Actions em Docker, usando a imagem fixada em
[`.actrc`](../.actrc):

```bash
act -l              # lista os jobs e a ordem de dependência
act -j quality       # roda um job específico
act                  # roda tudo
```

`quality`, `unit` e `vulnerabilities` rodam limpos no `act`. `build` e
`e2e` hoje não completam de ponta a ponta localmente: o servidor de
artefatos local do `act` ainda não suporta o protocolo que
`actions/upload-artifact@v7` e `actions/download-artifact@v8` usam
(rastreado no upstream em
[nektos/act#6022](https://github.com/nektos/act/issues/6022) e
[#6114](https://github.com/nektos/act/issues/6114)). O passo de build em
si roda e o resultado continua correto; só a transferência do artefato
pros jobs que dependem dele falha localmente. Abra um PR em rascunho pra
ver esses jobs rodando de verdade.

## Debugando uma falha de e2e

`playwright.config.ts` configura `trace: "retain-on-failure"`; uma
execução de CI que falha sobe `playwright-report/` e `test-results/`
como artefato (veja o passo "Upload Playwright report" do job `e2e`).
Baixe e:

```bash
npx playwright show-trace caminho/do/trace.zip
```

Isso abre uma timeline com screenshot, o DOM e a atividade de rede no
momento da falha, geralmente mais rápido do que tentar reproduzir uma
falha exclusiva do CI relendo a asserção.
