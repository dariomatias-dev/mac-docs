<br>
<div align="center">
<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
<img src="https://img.shields.io/badge/MDX-1B1F24?style=for-the-badge&logo=mdx&logoColor=white" alt="MDX">
</div>
<br>

<p align="center">
<strong>Idioma:</strong> <a href="README.md">English</a> | Português
</p>

<p align="center">
<img src="public/svgs/logo.svg" alt="Logo do MAC Docs" width="700">
</p>

<p align="center">
Documentação interativa de Matemática Aplicada à Computação, renderizada a partir de MDX com fórmulas em LaTeX, busca full text e componentes de estudo interativos.
<br>
<a href="#sobre-o-projeto"><strong>Explore a documentação »</strong></a>
</p>

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Começando](#começando)
- [Scripts](#scripts)
- [Conteúdo](#conteúdo)
- [Arquitetura](#arquitetura)
- [Testes](#testes)
- [Deploy](#deploy)
- [Licença](#licença)
- [Autor](#autor)

</br>

## Sobre o Projeto

O MacDocs é um site de documentação totalmente estático (SSG) no estilo
react.dev. Ele transforma uma árvore de arquivos MDX em um site navegável,
buscável e interativo. Basta adicionar um arquivo `.mdx` para gerar uma rota,
um item na sidebar, breadcrumb, navegação anterior/próximo e uma entrada na
busca.

## Funcionalidades

- Renderização de MDX com GFM e KaTeX (matemática inline e em bloco).
- Sidebar hierárquica derivada da estrutura de pastas, com grupos colapsáveis
  cujo estado é persistido.
- Busca full text aberta com `Ctrl`/`Cmd` + `K`, ranqueada e navegável por
  teclado.
- Componentes de estudo interativos: Callout, Collapsible, Exercise, Quiz,
  StepByStep, YouTube e, para páginas de avaliação, Question, Badge,
  Resolution, Proof, Alternatives, PixelGrid, RegionDiagram e calculadoras de
  conjuntos/matrizes.
- Índice do artigo com scroll spy no desktop e dropdown no mobile.
- Tempo de leitura e chips de pré-requisitos por página.
- Anotações por página, salvas localmente, com busca, ordenação,
  exportar/importar e desfazer ao remover.
- Página de contribuidores (monitoria, material e código via API do GitHub).
- Tema claro e escuro que segue o sistema, sem flash.
- SEO: sitemap, robots, Open Graph, URLs canônicas e 404 personalizado.
- Cabeçalhos de segurança e Content Security Policy.

## Tecnologias

- Next.js (App Router, Turbopack), React e TypeScript em modo strict.
- Tailwind CSS v4 com o plugin de tipografia.
- MDX via `next-mdx-remote/rsc` e `gray-matter`.
- KaTeX (`remark-math`, `rehype-katex`), `remark-gfm` e `rehype-slug`.
- `next-themes`, `lucide-react` e `zod`.
- Vitest com Testing Library, e Playwright com axe.
- ESLint, Prettier, Husky, commitlint e GitHub Actions.

## Começando

```bash
npm install
cp .env.example .env.local   # defina NEXT_PUBLIC_SITE_URL
npm run dev                  # http://localhost:3000
```

## Scripts

| Comando             | Descrição                   |
| ------------------- | --------------------------- |
| `npm run dev`       | Servidor de desenvolvimento |
| `npm run build`     | Build de produção (SSG)     |
| `npm run start`     | Serve o build de produção   |
| `npm run lint`      | ESLint                      |
| `npm run typecheck` | `tsc --noEmit`              |
| `npm run format`    | Prettier (escrita)          |
| `npm run test`      | Vitest (watch)              |
| `npm run test:run`  | Vitest (uma vez)            |
| `npm run test:e2e`  | Playwright (smoke e axe)    |

## Conteúdo

O conteúdo vive em [`content/`](content/), organizado em três níveis:

```
content/<curso>/<grupo>/<página>.mdx
```

Criar um arquivo `.mdx` gera automaticamente rota, item na sidebar, breadcrumb,
navegação anterior/próximo e entrada na busca. Veja
[docs/pt/authoring.md](docs/pt/authoring.md).

## Arquitetura

O código é organizado feature first em `src/features/*`, com apenas o
genuinamente compartilhado em `src/shared/*`. Veja
[docs/pt/architecture.md](docs/pt/architecture.md).

## Testes

- Testes de unidade e componente com Vitest e Testing Library
  (`npm run test:run`).
- Testes de smoke e acessibilidade com Playwright e axe (`npm run test:e2e`).

## Deploy

O deploy roda na Vercel, com preview automático por pull request e produção no
merge para `main`. A Vercel roda `next build`, enquanto o
[CI do GitHub Actions](.github/workflows/ci.yml) roda os gates de qualidade
(tipos, lint, testes, e2e e auditoria) que barram o merge.

## Licença

Distribuído sob a **Licença MIT**. Veja o arquivo [LICENSE](LICENSE) para
detalhes.

</br>

## Autor

Desenvolvido por **Dário Matias**:

- Portfólio: [https://dariomatias-dev.com](https://dariomatias-dev.com)
- GitHub: [https://github.com/dariomatias-dev](https://github.com/dariomatias-dev)
- Email: [matiasdario75@gmail.com](mailto:matiasdario75@gmail.com)
- Instagram: [https://instagram.com/dariomatias_dev](https://instagram.com/dariomatias_dev)
- LinkedIn: [https://linkedin.com/in/dariomatias-dev](https://linkedin.com/in/dariomatias-dev)
