<div align="center">

<img src="public/favicon.svg" alt="NiAnd Labs" width="64" height="70" />

# 🔒 Canal de Denuncia Ley 2365

**Recepción confidencial de denuncias de acoso sexual laboral con trazabilidad**

Laboratorio de la suite de cumplimiento operable de **NiAnd Labs S.A.S.**

[![CI](https://github.com/AndreZzRg/niand-canal-denuncia-2365/actions/workflows/ci.yml/badge.svg)](https://github.com/AndreZzRg/niand-canal-denuncia-2365/actions/workflows/ci.yml)
[![Pages](https://github.com/AndreZzRg/niand-canal-denuncia-2365/actions/workflows/pages.yml/badge.svg)](https://github.com/AndreZzRg/niand-canal-denuncia-2365/actions/workflows/pages.yml)
[![CodeQL](https://github.com/AndreZzRg/niand-canal-denuncia-2365/actions/workflows/codeql.yml/badge.svg)](https://github.com/AndreZzRg/niand-canal-denuncia-2365/actions/workflows/codeql.yml)
[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-4338CA)](LICENSE)
[![Node](https://img.shields.io/badge/node-%E2%89%A520.19-0E9F8E)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF)](https://vite.dev)

### [▶ Abrir la aplicación](https://andrezzrg.github.io/niand-canal-denuncia-2365/)

</div>

---

> [!IMPORTANT]
> **Proyecto de laboratorio construido por NiAnd Labs para demostrar capacidad técnica.
> No corresponde a un cliente real.** Los resultados que produce son orientativos y no
> constituyen concepto jurídico profesional. Véase [`DESCARGO.md`](DESCARGO.md).

## Qué resuelve

Canal web operable para la recepción, tramitación confidencial y trazabilidad de denuncias de acoso sexual laboral (Ley 2365 de 2024), acoso laboral (Ley 1010 de 2006) y violencias basadas en género en el trabajo.

Permite radicar casos con reserva de identidad o bajo anonimato estricto (sin crear cuentas de usuario), asigna un radicado formal (`DEN-AAAA-NNNN`) y una clave de consulta de 12 caracteres cuya huella SHA-256 es lo único que se almacena, proyecta los plazos de las 8 etapas de la ruta de atención en días hábiles colombianos y controla la adopción de medidas de protección inmediata garantizando que recaigan sobre la persona señalada para evitar represalias contra la víctima.

### Módulos

1. **Radicar denuncia**: Formulario de recepción que admite modalidad anónima, confidencial o identificada. No condiciona la radicación a la aportación de pruebas ni a la identificación previa. Genera radicado y clave de consulta protegida por hash criptográfico.
2. **Consultar radicado**: Consulta del estado del caso mediante radicado y clave normalizada, preservando el anonimato absoluto sin requerir registro ni sesión.
3. **Bandeja del comité**: Tablero de gestión para el Comité de Convivencia Laboral o área instructora designada, con indicadores de casos en trámite, no conciliables (acoso sexual y VBG) y observaciones normativas graves; avance motivado con bitácora de actuaciones.
4. **Ruta de atención y plazos**: Monitoreo de las 8 etapas del protocolo tipo (radicado, medidas de protección, traslado, pruebas, informe, decisión, seguimiento y cierre) con proyección en días hábiles (calendario colombiano de festivos) y garantías procesales (no revictimización, debido proceso).
5. **Medidas de protección**: Registro y auditoría de medidas cautelares inmediatas bajo el principio rector legal: la protección recae sobre la persona señalada y no sobre la persona denunciante, evitando represalias encubiertas.

---

## Puesta en marcha

Requiere **Node.js 20.19 o superior** (`.nvmrc` fija la 22) y npm 10+.

```bash
git clone https://github.com/AndreZzRg/niand-canal-denuncia-2365.git
cd niand-canal-denuncia-2365
npm install
npm run dev
```

La aplicación queda en <http://localhost:5173>.

### Comandos disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente (Vite) |
| `npm run build` | Verificación de tipos y construcción de producción en `dist/` |
| `npm run preview` | Sirve `dist/` localmente como lo hará GitHub Pages |
| `npm test` | Pruebas unitarias y de dominio (Vitest) |
| `npm run test:watch` | Pruebas en modo observación |
| `npm run test:coverage` | Pruebas con reporte de cobertura V8 y umbrales |
| `npm run lint` | Análisis estático con ESLint 9 |
| `npm run lint:fix` | Corrige automáticamente problemas detectados por ESLint |
| `npm run typecheck` | Verificación de tipos sin emitir (`tsc --noEmit`) |
| `npm run format` | Formatea el repositorio con Prettier |
| `npm run format:check` | Verifica el formato con Prettier sin modificar archivos |
| `npm run verify` | Formato, lint, tipos y pruebas, en el orden de la CI |

---

## Despliegue en GitHub Pages

Este repositorio se publica solo. La configuración ya está hecha; usted solo activa Pages una vez.

<details>
<summary><strong>Publicar por primera vez (3 pasos)</strong></summary>

**1. Cree el repositorio y suba el código**

```bash
# Con GitHub CLI
gh repo create AndreZzRg/niand-canal-denuncia-2365 --public --source=. --remote=origin --push

# O de forma manual, si ya creó el repositorio vacío en github.com
git remote add origin https://github.com/AndreZzRg/niand-canal-denuncia-2365.git
git branch -M main
git push -u origin main
```

**2. Active GitHub Pages**

En el repositorio: **Settings → Pages → Build and deployment → Source: _GitHub Actions_**.

**3. Espere el flujo de trabajo**

La pestaña **Actions** mostrará *Desplegar en GitHub Pages*. Al terminar, el sitio queda en:

```
https://andrezzrg.github.io/niand-canal-denuncia-2365/
```

Cada `git push` a `main` vuelve a construir y publicar.

</details>

> La construcción usa `base: './'`, de modo que el mismo artefacto funciona en GitHub
> Pages, en un subdirectorio arbitrario de cualquier servidor y abierto desde el disco.

### Otras plataformas

| Plataforma | Cómo |
|---|---|
| **Netlify** | Comando `npm run build`, directorio de publicación `dist` |
| **Vercel** | Preajuste *Vite*, sin configuración adicional |
| **Cloudflare Pages** | Comando `npm run build`, salida `dist` |
| **Servidor propio** | Copie `dist/` a cualquier servidor de archivos estáticos |

---

## Pila tecnológica

| Herramienta | Para qué |
|---|---|
| **React 19** | Interfaz declarativa con el compilador y las APIs concurrentes vigentes. |
| **TypeScript 5.9** | Tipado estricto de extremo a extremo; `strict` y `noUncheckedIndexedAccess` activos. |
| **Vite 8** | Servidor de desarrollo instantáneo y construcción de producción con Rolldown / Rollup. |
| **Tailwind CSS 4** | Sistema de diseño en CSS puro con `@theme`; los tokens de marca son utilidades directas. |
| **Zod 4** | Validación de esquemas en el límite de entrada y contratos de datos versionados. |
| **Zustand 5** | Estado de aplicación mínimo, con persistencia explícita en `localStorage`. |
| **date-fns 4** | Aritmética de fechas y cálculo de días hábiles sobre el calendario colombiano de festivos. |
| **Web Crypto API** | Generación de claves criptográficamente seguras y huella SHA-256 para consulta anónima. |
| **Vitest 5** | Pruebas unitarias y de dominio con cobertura V8 y umbrales exigidos en CI. |
| **Testing Library** | Pruebas de interfaz sobre el árbol accesible, no sobre detalles de implementación. |
| **ESLint 9** | Análisis estático con configuración plana (`eslint.config.js`) y reglas de `typescript-eslint`. |
| **Prettier 3** | Formato único verificado en integración continua. |
| **GitHub Actions** | Integración continua en Node 20, 22 y 24, y despliegue automático. |
| **GitHub Pages** | Publicación estática desde `main`, sin servidor que administrar. |
| **CodeQL** | Análisis de seguridad del código en cada cambio y una vez por semana. |
| **Dependabot** | Actualización agrupada de dependencias de npm y de las acciones. |
| **lucide-react** | Iconografía vectorial coherente con la retícula de la marca. |

---

## Marco normativo

| Norma | Qué aporta a esta herramienta |
|---|---|
| **Ley 2365 de 2024** | Prevención, protección y atención del acoso sexual en el ámbito laboral (inmediatez en medidas, no revictimización, no conciliable). |
| **Ley 1010 de 2006** | Acoso laboral y Comité de Convivencia Laboral (función conciliatoria voluntaria e informada). |
| **Ley 1581 de 2012** | Tratamiento de datos sensibles: reserva de identidad, autorización expresa y custodia reforzada. |
| **Resolución MinTrabajo 2764 de 2022** | Protocolo de prevención y atención de casos de violencia y acoso en los lugares de trabajo. |
| **Código Penal, art. 210A** | El acoso sexual es delito; el canal interno no sustituye ni impide la denuncia penal. |
| **Ley 1257 de 2008** | Sensibilización, prevención y sanción de violencias basadas en género (VBG, no conciliables). |

Cada regla implementada declara la norma que la sustenta. El detalle, con artículo y
fecha de verificación, está en [`docs/MARCO-NORMATIVO.md`](docs/MARCO-NORMATIVO.md).

> **Última verificación normativa: 17 de septiembre de 2026.**
> Las normas cambian. Antes de usar un resultado en una decisión real, confirme la
> vigencia en la fuente oficial.

---

## Arquitectura en una pantalla

```
src/
├── domain/        Reglas de negocio: conductas, catálogo de medidas de protección,
│                  etapas de la ruta, radicados, claves y observaciones normativas.
│                  TypeScript puro y determinista. Sin React, DOM ni storage.
├── lib/           Utilidades transversales: cálculo de días hábiles colombianos,
│                  huella SHA-256 (Web Crypto), persistencia tipada y exportación.
├── brand/         Sistema de diseño NiAnd Labs: Logo, Shell y piezas de UI.
├── features/      Módulos de la interfaz (Radicar, Consultar, Bandeja, Ruta, Medidas).
│                  Solo presentación y consumo del store; no deciden reglas.
├── styles/        brand.css — tokens de marca (@theme) y capa base.
├── store.ts       Estado de aplicación con Zustand y persistencia en localStorage.
├── App.tsx        Composición de módulos con navegación por pestañas.
└── main.tsx       Punto de entrada de la aplicación.
```

**La regla que no se negocia:** el cálculo vive en `src/domain/` y no sabe que existe
una interfaz. Así se puede probar, auditar y reutilizar desde otro contexto sin tocar
una línea de React.

Detalle completo en [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md) y las decisiones
con su justificación en [`docs/DECISIONES.md`](docs/DECISIONES.md).

---

## Privacidad y datos

- La aplicación es **estática**: no hay servidor propio ni base de datos remota.
- Lo que usted captura se guarda en el `localStorage` de su navegador y **no sale de su equipo**.
- **Garantía criptográfica de anonimato**: la clave generada solo se conserva como huella SHA-256 (`${radicado}:${claveNormalizada}`). La clave en claro no se almacena jamás.
- En las denuncias con modalidad anónima, el nombre de la persona denunciante no se persiste ni se almacena bajo ninguna circunstancia.
- No hay analítica, ni rastreadores, ni cookies de terceros.
- Borrar los datos del sitio en el navegador elimina la información de forma definitiva. La aplicación permite exportar e importar datos locales en JSON, CSV y texto.

Esto no releva a quien opere la herramienta con datos personales reales de sus obligaciones
bajo la **Ley 1581 de 2012**. Véase [`SECURITY.md`](SECURITY.md).

---

## Documentación

| Documento | Contenido |
|---|---|
| [`docs/GUIA-DE-USO.md`](docs/GUIA-DE-USO.md) | Recorrido funcional módulo por módulo |
| [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md) | Capas, dependencias y modelo de datos |
| [`docs/MARCO-NORMATIVO.md`](docs/MARCO-NORMATIVO.md) | Cada regla con su norma y fecha de verificación |
| [`docs/DECISIONES.md`](docs/DECISIONES.md) | Registro de decisiones de arquitectura (ADR) |
| [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md) | Publicación, entornos y resolución de problemas |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Flujo de trabajo y umbrales de calidad |
| [`SECURITY.md`](SECURITY.md) | Reporte de vulnerabilidades y modelo de seguridad |
| [`CHANGELOG.md`](CHANGELOG.md) | Registro de cambios |
| [`DESCARGO.md`](DESCARGO.md) | Alcance y límites de la herramienta |

---

## Compromisos de calidad

Los mismos que NiAnd Labs publica y puede sustentar (NL-05 §2.4):

- Cobertura de pruebas **mínima del 80 % sobre el dominio crítico**, verificada en CI.
- **Quality Gate aprobado** en análisis estático como condición de despliegue.
- **Cero vulnerabilidades críticas y altas** al momento de la entrega.
- **Código y documentación entregados**, sin dependencia de la firma para operarlos.

---

## Licencia

[MIT](LICENSE) © 2026 Carlos Andrés Roncancio Guerrero — NiAnd Labs S.A.S.

## Autor

**AndreZzRg** · [andresrg1999@hotmail.com](mailto:andresrg1999@hotmail.com) · [github.com/AndreZzRg](https://github.com/AndreZzRg)

<div align="center">
<sub>Parte de la suite de cumplimiento operable de NiAnd Labs · Bogotá D.C., Colombia</sub>
</div>
