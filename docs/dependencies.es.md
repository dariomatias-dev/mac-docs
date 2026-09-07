<strong>Idioma:</strong> <a href="dependencies.md">English</a> | <a href="dependencies.pt-BR.md">Português</a> | Español

# Dependencias

La mayoría de las dependencias usa un rango con `^` y se actualiza
libremente. Unas pocas quedan fijadas en una versión exacta, por motivos
que vale la pena conocer antes de actualizarlas "sin más":

| Paquete                  | Fijación                                    | Motivo                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------ | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `next`                   | exacta (`16.3.1`)                           | Una línea de versión major reciente con cambios que rompen compatibilidad respecto a la versión con la que la mayoría de las herramientas y asistentes de IA fueron entrenados — ver [`AGENTS.md`](../AGENTS.md). Las convenciones de archivos ya se renombraron dentro de esta major (p. ej. `middleware.ts` ahora es `proxy.ts` — notado al investigar la guía de nonce de CSP en `node_modules/next/dist/docs/`), y una actualización no planificada puede reintroducir silenciosamente ese tipo de cambio. Actualiza deliberadamente, lee las notas de la versión, revisa de nuevo `node_modules/next/dist/docs/` en busca de algo renombrado. |
| `eslint-config-next`     | exacta, igual a la versión exacta de `next` | Trae reglas de lint atadas a los internos de `next` para esa versión específica. Actualízalo junto con `next`, a la misma versión, nunca de forma independiente.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `eslint-plugin-jsx-a11y` | exacta (`6.10.2`)                           | Ya venía instalado de forma transitiva vía `eslint-config-next`; se agregó como dependencia directa y con versión exacta (en vez de un rango con `^`) para que declararlo explícitamente no resuelva silenciosamente a una versión distinta de aquella contra la que la configuración de lint de accesibilidad de este repositorio — incluyendo el ajuste de `no-noninteractive-tabindex` en `eslint.config.mjs` — fue realmente escrita y probada.                                                                                                                                                                                                |

Todo lo demás usa `^` y se actualiza automáticamente vía Dependabot
(`.github/dependabot.yml`), agrupado en un único PR para bumps de
patch/minor por ecosistema (`npm`, `github-actions`) y sin agrupar para
los majors, ya que un major es justo el tipo de cambio que amerita que
una persona lea el changelog.

## Triando un PR de Dependabot

1. Si es un **PR de grupo patch/minor** (npm o GitHub Actions), el gate
   local es la verificación que importa: `pnpm run verify`. Si pasa en
   verde, haz merge — todo el sentido del gate local es no tener que
   re-derivar nada por dependencia.
2. Si es un **bump major**, revisa el changelog del paquete en busca de
   cambios que rompan compatibilidad antes de mergear, aunque `pnpm run
verify` pase; un major puede romper comportamiento que la suite de
   tests no cubre. El propio `next` está excluido de Dependabot
   exactamente por esto (ver la nota de fijación arriba) — sus propias
   versiones minor ya renombraron convenciones de archivos antes.
3. Si el PR toca uno de los tres paquetes fijados en la tabla, no dejes
   que Dependabot lo actualice directamente — están excluidos de los
   grupos automáticos justamente para que una persona lea el "motivo" de
   arriba primero.
4. `pnpm audit`, `osv-scanner` y CodeQL (ver `.github/workflows/`) corren
   de forma independiente de Dependabot y solo reportan, sin bloquear; un
   PR de Dependabot que cierra un advisory que ellos señalaron es el caso
   común, no una coincidencia.
