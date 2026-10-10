<strong>Idioma:</strong> <a href="authoring.md">English</a> | <a href="authoring.es.md">Español</a> | Português

# Autoria de conteúdo (MDX)

## Estrutura de pastas

O conteúdo fica em `content/`, em três níveis:

```
content/
  matematica-discreta/       # curso (rótulo na sidebar)
    matrizes/                # grupo (dropdown colapsável)
      index.mdx              # página do grupo (define título e ordem)
      operacoes.mdx          # página
      matrizes-booleanas.mdx # página
```

- **Curso**: pasta de topo. O rótulo vem de `COURSE_TITLES` em
  `src/features/navigation/lib/sidebar-tree.ts`, ou do nome da pasta.
- **Grupo**: subpasta com `index.mdx`. O `index.mdx` define o título e a ordem.
- **Página**: qualquer outro `.mdx`. O campo `order` define a sequência.

Criar um arquivo `.mdx` gera automaticamente a rota (`/docs/...`), o item na
sidebar, o breadcrumb, a navegação anterior/próximo e a entrada no índice de
busca. O `index.mdx` de um módulo (um grupo logo abaixo do curso) também
ganha, depois do conteúdo, a lista "Tópicos deste módulo" com as páginas e
suas descrições, então não é preciso escrevê-la à mão.

## Frontmatter

Validado por `zod` em build. Um frontmatter inválido quebra o build com um erro
claro.

```yaml
---
title: Operações com matrizes # obrigatório
description: Adição, subtração e multiplicação. # opcional
order: 1 # opcional (ordena as páginas do grupo)
prerequisites: # opcional, cada item deve começar com /docs/
  - /docs/matematica-discreta/matrizes
kind: resource # opcional, só no index.mdx de um grupo (padrão: module)
---
```

`kind: resource` marca um grupo que é material da disciplina, não um assunto
(o plano de disciplina, as avaliações). A sidebar o mantém fora de "Conteúdo": no
topo se vier antes do primeiro assunto (o plano de disciplina), em
"Recursos" caso contrário, e ele não entra na numeração de módulos mostrada no
cabeçalho da página ("Módulo 1" é o primeiro assunto).

## Markdown e matemática

- GFM completo: tabelas, listas de tarefas, `~~riscado~~`, autolinks.
- KaTeX **inline** com `$...$` e em **bloco** com `$$...$$`.
- Títulos `##` e `###` viram o índice do artigo, com âncoras.
- Não use `#` (h1): o título da página já é renderizado a partir do frontmatter.

Para a sintaxe das fórmulas, veja:

- [KaTeX: Supported Functions](https://katex.org/docs/supported.html): lista completa de comandos, símbolos e ambientes aceitos pelo renderizador.
- [KaTeX: Support Table](https://katex.org/docs/support_table.html): tabela pesquisável com cada símbolo e seu comando.
- [LaTeX/Mathematics (Wikibooks)](https://en.wikibooks.org/wiki/LaTeX/Mathematics): guia mais amplo de notação matemática em LaTeX.

## Componentes de estudo

Disponíveis dentro de qualquer arquivo `.mdx`, recebendo conteúdo via children.
Veja a referência em [components.pt-BR.md](components.pt-BR.md).
