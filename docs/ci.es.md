<strong>Idioma:</strong> <a href="ci.md">English</a> | <a href="ci.pt-BR.md">Português</a> | Español

# Integración Continua

Dos principios atraviesan cada workflow aquí:

1. **Un gate y un reporte son cosas distintas.** Lo que realmente hace
   fallar un pull request vive en este repositorio (un script, un
   umbral) — nunca solo en un servicio externo, así que un PR de fork sin
   un secret configurado nunca queda bloqueado por falta de token.
2. **El gate local espeja al CI.** `pnpm run verify` (ver
   [contributing.es.md](contributing.es.md#el-gate-local)) corre las mismas
   verificaciones que corre `ci.yml`, en el mismo orden. Un run local en
   verde debería significar un run de CI en verde.

## `.github/workflows/ci.yml`

| Job               | Verifica                                                                                                           | ¿Gate o reporte?                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `quality`         | format, lint, tipos, contenido, paridad de nombres de archivos de docs                                             | Gate, bloquea el merge                                                               |
| `unit`            | Vitest con umbrales de cobertura, luego un upload a Codecov                                                        | Los tests son gate; el upload es solo reporte                                        |
| `build`           | `next build`, luego el presupuesto de tamaño de bundle                                                             | Ambos gate; ver [performance.es.md](performance.es.md)                               |
| `e2e`             | Playwright (smoke, navegación, búsqueda, anotaciones, estudio, seo, seguridad, a11y — desktop y un viewport móvil) | Gate, bloquea el merge                                                               |
| `vulnerabilities` | `pnpm audit`, `osv-scanner` contra el lockfile, `gitleaks` para secretos commiteados                               | Solo reporte, nunca bloquea un PR                                                    |
| `lighthouse`      | Lighthouse (performance, accesibilidad, SEO, buenas prácticas) contra tres páginas                                 | Solo reporte — cada aserción es `"warn"`, ver [performance.es.md](performance.es.md) |

`build` sube `.next` como artefacto; `e2e` y `lighthouse` lo descargan en
vez de reconstruir, así que la app se compila exactamente una vez por
ejecución.

El job `vulnerabilities` es deliberadamente no bloqueante: un advisory
nuevo de severidad alta en una dependencia de herramientas de desarrollo
sin relación no debería trabar todos los PRs hasta que alguien actualice
un paquete que ni siquiera controla directamente. Mismo razonamiento
para `lighthouse`: los puntajes de Lighthouse tienen ruido real de
ejecución a ejecución, así que usarlos como gate antes de confirmar que
son estables haría fallar PRs sin ninguna regresión real.

## Otros workflows

- **`codeql.yml`** — análisis estático (JavaScript/TypeScript), en cada
  PR, cada push a `main`, y un cronograma semanal para que una
  actualización del query-pack aparezca incluso en una semana tranquila.
  Bloquea vía el check de code scanning de GitHub.
- **`dependency-review.yml`** — en cada PR, falla solo ante un advisory
  de severidad alta o superior _recién introducido_ o una licencia no
  permitida; un advisory ya presente en `main` no bloquea
  retroactivamente un PR sin relación (eso es lo que reporta en su lugar
  el job `vulnerabilities`).
- **`release-please.yml`** — al hacer push a `main`, mantiene un pull
  request de release permanente con el `CHANGELOG.md` y el bump de
  versión de `package.json`. Ver el [README](../README.es.md#despliegue)
  para cómo el merge de ese PR corta un release.

## Reproduciendo el CI localmente con `act`

[`nektos/act`](https://github.com/nektos/act) corre el workflow de
GitHub Actions en Docker, usando la imagen fijada en
[`.actrc`](../.actrc):

```bash
act -l              # lista los jobs y su orden de dependencia
act -j quality       # corre un solo job
act                  # corre todo
```

`quality`, `unit` y `vulnerabilities` corren limpios bajo `act`. `build`
y `e2e` hoy no se completan de punta a punta localmente: el servidor de
artefactos local de `act` todavía no soporta el protocolo que usan
`actions/upload-artifact@v7` y `actions/download-artifact@v8` (rastreado
upstream como
[nektos/act#6022](https://github.com/nektos/act/issues/6022) y
[#6114](https://github.com/nektos/act/issues/6114)). El paso de build en
sí corre y su salida sigue siendo correcta; solo falla localmente la
entrega del artefacto a los jobs que dependen de él. Abre un PR en
borrador para ver esos jobs correr de verdad.

## Depurando una ejecución de e2e fallida

`playwright.config.ts` configura `trace: "retain-on-failure"`; una
ejecución de CI que falla sube `playwright-report/` y `test-results/`
como artefacto (ver el paso "Upload Playwright report" del job `e2e`).
Descárgalo y:

```bash
npx playwright show-trace ruta/al/trace.zip
```

Eso abre una línea de tiempo con captura de pantalla, el DOM y la
actividad de red en el momento de la falla — generalmente más rápido que
intentar reproducir una falla exclusiva del CI releyendo la aserción.
