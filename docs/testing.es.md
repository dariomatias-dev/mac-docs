<strong>Idioma:</strong> <a href="testing.md">English</a> | Español | <a href="testing.pt-BR.md">Português</a>

# Tests

## Qué realmente merece un test aquí

La cobertura es un piso, no una meta. Ver los umbrales y su
justificación en `vitest.config.ts`. La decisión de criterio que importa
más que el número es _qué_ probar:

- **Lógica real**: un cálculo, una rama, un fragmento de estado que
  puede estar mal. Operaciones de matrices, la lógica de ordenar/filtrar
  en el panel de anotaciones, el camino de recuperación de errores de un
  hook (`localStorage` malformado, una escritura que falla), todo
  amerita un test.
- **Interacción real de usuario**: hacer clic en un botón, esperar un
  resultado específico. Los tests de componentes aquí renderizan el
  componente real e interactúan con él vía queries de Testing Library
  (`getByRole`, `getByText`), no accediendo a internos.
- **Caso límite genuino, no relleno**: un límite de validación, un
  estado de lista vacía, una condición de carrera contra la que el
  código explícitamente se protege. Agregar un cuarto caso de test casi
  idéntico para una quinta entrada casi idéntica no es cobertura, es
  ruido.

Lo que deliberadamente **no** se persigue:

- **Componentes marcadores que retornan `null`** (`Option`, `Step`,
  `Alternative` en los componentes de estudio): existen solo para que
  `Children.toArray` lea sus props; llamarlos directamente no afirma
  nada real.
- **`mdx-renderer.tsx`**: el `MDXRemote` de `next-mdx-remote/rsc` es un
  Server Component asíncrono; el renderizador cliente de Testing Library
  no puede montarlo (`<MDXRemote> is an async Client Component` es el
  error que obtendrás). En cambio, se ejercita de verdad en cada página
  durante `next build` y por la suite e2e de a11y contra contenido real.
- **Wrappers de paso trivial** (`theme-provider.tsx` reexportando el
  provider de `next-themes`): no hay lógica que pueda estar mal.

## Test doubles

- **`vi.hoisted()` + `vi.mock()`** para hooks y módulos de los que un
  componente depende pero que no son lo que está bajo test: el
  `usePathname` de `next/navigation`, el `useTheme` de `next-themes`,
  una función de obtención de datos.
- **Providers de contexto reales en vez de mocks profundos, cuando son
  baratos.** `ActiveMobileSheetProvider`, `SidebarCollapseProvider` y
  `SidebarGroupsProvider` se envuelven directamente alrededor del
  componente bajo test en vez de mockearse, ya que están probados de
  forma independiente y usar la cosa real atrapa bugs de integración que
  un mock no atraparía.
- **`localStorage.clear()`** en `beforeEach` para todo lo respaldado por
  estado persistido (anotaciones, colapso de la sidebar), para que los
  tests no se filtren estado entre sí.
- **Timers falsos (`vi.useFakeTimers()`)** para todo lo que haga
  debounce o expire solo (la ventana de deshacer de las anotaciones, el
  reseteo del "copiado" de un botón de copiar). Prefiere `fireEvent`
  sobre `userEvent` cuando los timers están falseados: los delays
  internos de `userEvent` pelean con `vi.useFakeTimers()` y pueden
  colgar un test.
- **Las brechas de jsdom son reales y merecen un comentario, no un
  parche silencioso.** `Element.prototype.scrollIntoView` simplemente no
  existe en jsdom (ver el polyfill en `vitest.setup.ts`);
  `scrollHeight` y propiedades derivadas del layout tienen valor por
  defecto `0` (ver los stubs explícitos en `toc.test.tsx` y
  `reading-progress.test.tsx`). No dejes que una limitación de jsdom
  haga que una rama parezca no-testeable silenciosamente cuando en
  realidad solo falta un stub.

## Corriendo las suites

```bash
pnpm test              # Vitest en modo watch
pnpm run test:run       # Vitest una vez
pnpm run test:coverage  # Vitest una vez, con los umbrales de cobertura aplicados
pnpm run test:e2e       # Playwright, contra una app ya compilada
```

Los propios archivos de test de los scripts
(`scripts/__tests__/check-content.test.mjs`,
`scripts/__tests__/check-bundle-size.test.mjs`) corren por los mismos
comandos `test:*`: el patrón `include` de Vitest en `vitest.config.ts`
cubre también `scripts/**/*.{test,spec}.mjs`, no solo `src/`.

## Depurando un test que falla

Para un test unitario/de componente, el propio `--reporter=verbose` de
Vitest y `test.only` acotan las cosas rápidamente. Para e2e, ver
[ci.es.md](ci.es.md#depurando-una-ejecución-de-e2e-fallida) para cómo extraer
un trace de una falla de CI; localmente, `pnpm exec playwright test
--debug` abre directamente el inspector de Playwright.
