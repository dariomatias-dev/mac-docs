<strong>Idioma:</strong> <a href="dependencies.md">English</a> | Português | <a href="dependencies.es.md">Español</a>

# Dependências

A maioria das dependências usa uma faixa com `^` e é atualizada livremente.
Algumas poucas ficam fixadas numa versão exata, por motivos que vale saber
antes de "simplesmente" atualizá-las:

| Pacote                   | Fixação                               | Motivo                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------ | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `next`                   | exata (`16.3.1`)                      | Linha de versão major recente com mudanças que quebram compatibilidade em relação à versão com que a maioria das ferramentas e assistentes de IA foi treinada — ver [`AGENTS.md`](../AGENTS.md). Convenções de arquivo já foram renomeadas dentro desta major (ex.: `middleware.ts` virou `proxy.ts` — percebido ao pesquisar o guia de nonce de CSP em `node_modules/next/dist/docs/`), e uma atualização não planejada pode reintroduzir esse tipo de mudança silenciosamente. Atualize deliberadamente, leia as notas de versão, reconfira `node_modules/next/dist/docs/` em busca de algo renomeado. |
| `eslint-config-next`     | exata, igual à versão exata do `next` | Traz regras de lint amarradas aos internos do `next` daquela versão específica. Atualize junto com o `next`, para a mesma versão, nunca de forma independente.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `eslint-plugin-jsx-a11y` | exata (`6.10.2`)                      | Já vinha instalado de forma transitiva via `eslint-config-next`; foi adicionado como dependência direta e com versão exata (em vez de uma faixa com `^`) para que declará-lo explicitamente não resolva silenciosamente para uma versão diferente daquela contra a qual a configuração de lint de acessibilidade deste repositório — incluindo o ajuste de `no-noninteractive-tabindex` em `eslint.config.mjs` — foi de fato escrita e testada.                                                                                                                                                          |

Todo o resto usa `^` e é atualizado automaticamente via Dependabot
(`.github/dependabot.yml`), agrupado em um único PR para bumps de
patch/minor por ecossistema (`npm`, `github-actions`) e deixado sem
agrupamento para majors, já que um major é justamente o tipo de mudança que
merece uma pessoa lendo o changelog.

## Triando um PR do Dependabot

1. Se for um **PR de grupo patch/minor** (npm ou GitHub Actions), o gate
   local é a checagem que importa: `pnpm run verify`. Se passar, faça o
   merge — o ponto todo do gate local é não precisar re-derivar nada por
   dependência.
2. Se for um **bump major**, dê uma olhada no changelog do pacote em busca
   de mudanças que quebrem compatibilidade antes de mergear, mesmo que
   `pnpm run verify` passe; um major pode quebrar comportamento que a
   suíte de testes não cobre. O próprio `next` é excluído do Dependabot
   exatamente por isso (ver a nota de fixação acima) — suas próprias
   versões minor já renomearam convenções de arquivo antes.
3. Se o PR tocar em um dos três pacotes fixados na tabela, não deixe o
   Dependabot atualizá-lo diretamente — eles são excluídos dos grupos
   automáticos justamente para que uma pessoa leia o "motivo" acima
   primeiro.
4. `pnpm audit`, `osv-scanner` e o CodeQL (ver `.github/workflows/`) rodam
   de forma independente do Dependabot e apenas reportam, sem bloquear; um
   PR do Dependabot que fecha um alerta que eles sinalizaram é o caso
   comum, não uma coincidência.
