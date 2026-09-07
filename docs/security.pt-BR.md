<strong>Idioma:</strong> <a href="security.md">English</a> | Português | <a href="security.es.md">Español</a>

# Política de Segurança

## Escopo

Este repositório é um site de documentação estático (SSG, sem contas de
usuário, sem backend, sem banco de dados). Não há login, não há dados de
usuário, e nada para exfiltrar além do próprio conteúdo público do site.
Preocupações realistas aqui são coisas como: uma dependência com
vulnerabilidade conhecida, um bypass da Content Security Policy, um vetor de
cross-site scripting através de conteúdo MDX renderizado, ou um problema de
supply-chain no build/CI — não tomada de conta ou vazamento de dados, já que
nem contas nem dados de usuário armazenados existem.

## Versões suportadas

Existe uma única versão implantada: o que está na branch `main` e no ar em
produção. Não há matriz de versões nem branch de suporte de longo prazo para
acompanhar.

## Relatando uma vulnerabilidade

Por favor não abra uma issue pública para um relato de segurança. Em vez
disso:

1. Prefira o relato privado de vulnerabilidades do GitHub: aba **Security** →
   **Report a vulnerability**. Se essa opção não aparecer neste repositório,
   é porque ainda não foi habilitada — use o e-mail de contingência abaixo.
2. Contingência: e-mail para
   [dariomatias.dev@gmail.com](mailto:dariomatias.dev@gmail.com) com
   "SECURITY" no assunto.

Inclua, na medida do possível:

- O que é a vulnerabilidade e seu impacto potencial.
- Passos para reproduzi-la (uma URL, um payload, uma requisição).
- O commit ou a versão em produção testada.

## Expectativa de resposta

Este é um projeto pessoal mantido por uma pessoa, não uma empresa com equipe
de segurança — não há SLA de tempo de resposta garantido. Relatos são levados
a sério e confirmados assim que razoavelmente possível, tipicamente em
poucos dias.

## Divulgação

Por favor dê um tempo razoável para corrigir um problema confirmado antes de
qualquer divulgação pública. Crédito é dado com prazer na mensagem de commit
da correção ou nas notas de versão, se você quiser.
