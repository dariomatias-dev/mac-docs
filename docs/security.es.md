<strong>Idioma:</strong> <a href="security.md">English</a> | <a href="security.pt-BR.md">Português</a> | Español

# Política de Seguridad

## Alcance

Este repositorio es un sitio de documentación estático (SSG, sin cuentas
de usuario, sin backend, sin base de datos). No hay login, no hay datos
de usuario, y nada que exfiltrar más allá del propio contenido público
del sitio. Las preocupaciones realistas aquí son cosas como: una
dependencia con una vulnerabilidad conocida, un bypass de la Content
Security Policy, un vector de cross-site scripting a través de contenido
MDX renderizado, o un problema de supply-chain en el build/CI — no toma
de cuenta ni filtración de datos, ya que no existen ni cuentas ni datos
de usuario almacenados.

## Versiones soportadas

Existe una única versión desplegada: lo que está en la rama `main` y en
producción. No hay matriz de versiones ni rama de soporte a largo plazo
que seguir.

## Reportar una vulnerabilidad

Por favor no abras una issue pública para un reporte de seguridad. En
cambio:

1. Prefiere el reporte privado de vulnerabilidades de GitHub: pestaña
   **Security** → **Report a vulnerability**. Si esa opción no aparece en
   este repositorio, es porque todavía no fue habilitada — usa el correo
   de respaldo abajo.
2. Respaldo: correo a
   [dariomatias.dev@gmail.com](mailto:dariomatias.dev@gmail.com) con
   "SECURITY" en el asunto.

Incluye, en la medida de lo posible:

- Qué es la vulnerabilidad y su impacto potencial.
- Pasos para reproducirla (una URL, un payload, una solicitud).
- El commit o la versión desplegada contra la que probaste.

## Expectativa de respuesta

Este es un proyecto personal mantenido por una persona, no una empresa
con equipo de seguridad — no hay un SLA de tiempo de respuesta
garantizado. Los reportes se toman en serio y se confirman tan pronto
como sea razonablemente posible, típicamente en pocos días.

## Divulgación

Por favor da un tiempo razonable para corregir un problema confirmado
antes de cualquier divulgación pública. El crédito se da con gusto en el
mensaje de commit de la corrección o en las notas de versión, si así lo
deseas.
