<strong>Idioma:</strong> <a href="../en/authoring.md">English</a> | Português

# Autoria de conteúdo (MDX)

## Estrutura de pastas

O conteúdo fica em `content/`, em três níveis:

```
content/
  calculo-1/                 # curso (rótulo maiúsculo na sidebar)
    limites/                 # grupo (dropdown colapsável)
      index.mdx              # página do grupo (define título e ordem)
      conceito-intuitivo.mdx # página
      definicao-formal.mdx   # página
```

- **Curso**: pasta de topo. O rótulo vem de `COURSE_TITLES` em
  `src/features/navigation/lib/sidebar-tree.ts`, ou do nome da pasta.
- **Grupo**: subpasta com `index.mdx`. O `index.mdx` define o título e a ordem.
- **Página**: qualquer outro `.mdx`. O campo `order` define a sequência.

Criar um arquivo `.mdx` gera automaticamente a rota (`/docs/...`), o item na
sidebar, o breadcrumb, a navegação anterior/próximo e a entrada no índice de
busca.

## Frontmatter

Validado por `zod` em build. Um frontmatter inválido quebra o build com um erro
claro.

```yaml
---
title: Conceito intuitivo # obrigatório
description: Uma primeira ideia de limite. # opcional
order: 1 # opcional (ordena as páginas do grupo)
prerequisites: # opcional, cada item deve começar com /docs/
  - /docs/calculo-1/limites
---
```

## Markdown e matemática

- GFM completo: tabelas, listas de tarefas, `~~riscado~~`, autolinks.
- KaTeX **inline** com `$...$` e em **bloco** com `$$...$$`.
- Títulos `##` e `###` viram o índice do artigo, com âncoras.
- Não use `#` (h1): o título da página já é renderizado a partir do frontmatter.

## Componentes de estudo

Disponíveis dentro de qualquer arquivo `.mdx`, recebendo conteúdo via children.
Veja a referência em [components.pt.md](components.md).
