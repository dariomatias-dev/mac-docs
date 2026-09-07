<strong>Idioma:</strong> <a href="contributing.md">English</a> | Español | <a href="contributing.pt-BR.md">Português</a>

# Cómo contribuir

Este es un proyecto personal de notas de curso (ver el [README](../README.es.md)),
mantenido mayormente por una persona. Correcciones de contenido, reportes
de bugs y ajustes pequeños son bienvenidos de verdad; propuestas de
funcionalidades más grandes tienen más chance de avanzar si se abren
primero como issue, ya que el alcance del sitio es intencionalmente
acotado.

## Configuración

```bash
git clone https://github.com/dariomatias-dev/mac-docs.git
cd mac-docs
pnpm install
cp .env.example .env.local   # define NEXT_PUBLIC_SITE_URL
pnpm run dev                  # http://localhost:3000
```

La versión de Node está fijada en [`.nvmrc`](../.nvmrc); `nvm use` (o
equivalente) la toma automáticamente.

## Antes de abrir un pull request

- [ ] El cambio tiene un único foco (corrección de contenido,
      funcionalidad, refactor, no una mezcla).
- [ ] `pnpm run verify` pasa localmente (ver
      [El gate local](#el-gate-local) abajo).
- [ ] Se agregaron o actualizaron tests para el comportamiento que puede
      regresar.
- [ ] Los cambios de contenido fueron revisados; ver
      [Autoría de contenido](authoring.es.md) para las convenciones de MDX
      que sigue este proyecto.
- [ ] El mensaje de commit sigue
      [Conventional Commits](https://www.conventionalcommits.org/)
      (forzado por commitlint; ver [Commits](#commits) abajo).

## El gate local

```bash
pnpm run verify         # gate completo: todo lo que corre el CI, incluyendo e2e
pnpm run verify --fast  # salta build y e2e: lo que corre el pre-push
```

[`scripts/verify.sh`](../scripts/verify.sh) corre exactamente las
mismas verificaciones que el [CI](../.github/workflows/ci.yml), en el
mismo orden. Un `pnpm run verify` verde localmente significa que el CI
también debería quedar verde. Si no es así, es un bug en el gate, no una
coincidencia para ignorar.

Ver [ci.es.md](ci.es.md) para el desglose job por job (gate vs. reporte), qué
hacen los otros workflows (CodeQL, dependency review, release-please,
Lighthouse), cómo reproducir una ejecución localmente con `act`, y cómo
depurar una ejecución de e2e fallida a partir de su trace subido.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/), forzado
por un hook `commit-msg` (`@commitlint/config-conventional`). Línea de
encabezado ≤ 72 caracteres (`commitlint.config.mjs`). Tipos comunes
usados en este repositorio: `feat`, `fix`, `docs`, `test`, `ci`, `chore`,
`refactor`, `perf`.

```
fix(avaliacoes): correct the sign in question 12's proof
```

## Actualizaciones de dependencias

Dependabot abre PRs semanales, agrupados por patch/minor en cada
ecosistema, así que hay uno solo para revisar en vez de una docena. Ver
[dependencies.es.md](dependencies.es.md) para saber qué paquetes quedan
fijados en una versión exacta (y excluidos del agrupamiento automático)
y cómo triar un PR de Dependabot.

## Branches

No hay un esquema de nombres forzado. Ramifica desde `main`, abre un
pull request contra `main`, y deja que el
[template de PR](../.github/pull_request_template.md) guíe la
descripción.

## Trabajando con un agente de IA

Si estás usando un agente de codificación de IA (Claude Code o similar)
en este repositorio, lee primero [`AGENTS.md`](../AGENTS.md): trae
reglas específicas del repositorio que el agente necesita y que no
corresponden a esta guía orientada a humanos.
