# Contexto del Portafolio Lukas Ibáñez

## Stack y versiones

| Área | Elección |
|---|---|
| Framework | Astro `^6.4.3`, `output: 'static'` |
| Node | `>=22.13.0` para Astro 6 y dependencias actuales |
| Estilos | Tailwind CSS `^3.4.19` vía PostCSS local |
| Animaciones | GSAP `^3.15.0` + ScrollTrigger, importados como módulos |
| CMS blog | Sanity build-time con `@sanity/client ^7.22.1` |
| Portable Text | `@portabletext/to-html ^5.0.2` |
| Fuentes | `@fontsource-variable/inter` y `@fontsource-variable/plus-jakarta-sans` |

Regla principal: cero requests externos en runtime. Sanity y GitHub se resuelven en build-time y quedan horneados en HTML estático. Fuentes, imágenes, CSS y JS salen del propio dominio.

Nota de compatibilidad: `@astrojs/tailwind@6.0.2` declara peer dependency hasta Astro 5. Para mantener Astro última estable (`6.4.3`), el proyecto usa Tailwind local con PostCSS, conservando `tailwind.config.mjs` y variables CSS.

## Tokens de diseño

| Token | Hex | Uso |
|---|---:|---|
| `--color-bg` | `#F7F4EE` | fondo principal |
| `--color-bg-alt` | `#EFEBE2` | bandas alternas |
| `--color-surface` | `#FBFAF7` | tarjetas |
| `--color-accent` | `#CC785C` | acento coral |
| `--color-accent-soft` | `#EBC9BA` | badges/fondos suaves |
| `--color-accent-strong` | `#B5654A` | hover/enlaces |
| `--color-sage` | `#9CAA8B` | acento secundario |
| `--color-text` | `#2B2A27` | texto principal |
| `--color-text-soft` | `#6B6862` | texto secundario |
| `--color-border` | `#E3DDD1` | bordes |

Tipografías: Plus Jakarta Sans Variable para títulos/display, Inter Variable para cuerpo/UI. Se importan desde npm y se precargan en `BaseLayout`.

## Mapa de archivos

| Ruta | Rol |
|---|---|
| `src/layouts/BaseLayout.astro` | HTML base, SEO, OG/Twitter, fuentes locales, JSON-LD y script GSAP |
| `src/styles/global.css` | tokens CSS, Tailwind, componentes utilitarios y estilos de artículo |
| `src/components/` | Nav, Hero, About, Skills, Projects, BlogTeaser, Contact, Footer |
| `src/components/icons/` | SVG locales como componentes Astro, incluido `BrandLogo.astro` para logos de tecnologías sin requests externos |
| `src/content.config.ts` | configuración Astro 6 de colecciones con loader `glob` |
| `src/content/projects/` | colección local de proyectos |
| `src/lib/sanity.ts` | cliente y queries Sanity en build-time |
| `src/lib/github.ts` | consulta GitHub en build-time, falla silenciosamente sin token |
| `src/lib/seo.ts` | helper de metadatos y JSON-LD Person |
| `src/scripts/animations.ts` | GSAP, ScrollTrigger, guard de reduced motion y cleanup |
| `src/pages/` | rutas Astro estáticas |
| `sanity/` | Studio y schema `post`, documentado como opción embebida/local |

## Patrón de CSS e inspector

Regla de mantenibilidad: evitar cadenas largas de utilidades Tailwind en el markup. Los componentes Astro principales usan clases semánticas y un bloque `<style>` local con `@apply`. `src/styles/global.css` queda para tokens, base, helpers compartidos (`container-site`, `section-title`, botones, reveals) y estilos del cuerpo de artículos. El ancho general del sitio usa `max-w-site: 90rem` (1440px); los textos largos conservan límites más bajos para lectura.

IDs por zona para inspeccionar fácil:

| Zona | ID principal |
|---|---|
| Header | `site-header`, `main-navigation`, `mobile-menu` |
| Home hero | `hero`, `hero-content`, `hero-system` |
| Secciones home | `stats`, `about`, `skills`, `featured-projects`, `blog-teaser`, `contact` |
| Páginas internas | `projects-page-hero`, `projects`, `github-repos`, `blog-page`, `blog-post` |
| Footer | `site-footer` |

Al usar `@apply` scoped, evitar aplicar clases custom compuestas como `container-site`; usar las utilidades reales (`mx-auto`, `max-w-site`, `px-5`, `sm:px-8`). Para opacidades de colores custom (`bg-bg/90`, `bg-surface/70`), preferir CSS normal con `rgba(...)`, porque `@apply` puede fallar en build.

## Comandos

```bash
npm run dev
npm run build
npm run preview
```

Astro 6 no corre con Node 20. Usar Node `>=22.13.0`; el repo incluye `.nvmrc`, `.node-version` y `package.json#engines`.

Los scripts de `package.json` usan comandos estándar (`astro dev`, `astro check && astro build`, `astro preview`) para funcionar en Cloudflare Pages. En esta máquina hay un Node global `20.20.0`; para correr localmente sin instalar Node global, usar el Node portable ignorado por git:

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'; .\.local-node\node.exe node_modules\astro\bin\astro.mjs dev
$env:ASTRO_TELEMETRY_DISABLED='1'; .\.local-node\node.exe node_modules\@astrojs\check\bin\astro-check.js; .\.local-node\node.exe node_modules\astro\bin\astro.mjs build
```

`.local-node/` está ignorado por git y no se usa en deploy.

Deploy sugerido: Cloudflare Pages con `npm run build`, salida `dist/` y variable `NODE_VERSION=22.13.0`.

## Variables de entorno

```bash
SITE_URL=https://lukasibanez.cl
SANITY_PROJECT_ID=9286uqeo
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01
GITHUB_TOKEN=...
GITHUB_USERNAME=Lukas-Ibanez
```

El dataset público actual de Sanity usa `_type: post`, `content` como Portable Text, `coverImage`, `category`, `readTime`, `sources`, `tags`, `publishedAt` y `seo`. El cliente mantiene fallback a `body` por compatibilidad. Sin GitHub configurado, el build no se rompe.

## Cómo agregar un post

1. Crear o abrir el Studio de Sanity usando `sanity/sanity.config.ts`.
2. Crear un documento `post` con `title`, `slug`, `excerpt`, `content`, `tags`, `publishedAt`, `readTime`, `category`, `sources` y `seo`.
3. Publicar el post.
4. Configurar un webhook de Sanity hacia un deploy hook del host para reconstruir el sitio. Así el blog sigue 100% estático.

## Cómo agregar un proyecto

1. Crear un `.md` en `src/content/projects/`.
2. Completar frontmatter: `title`, `excerpt`, `problem`, `solution`, `stack`, `role`, `featured`, `image`, `order`.
3. Usar una key de imagen existente: `linux`, `admin`, `seo`, `api`, o agregar un PNG en `src/assets/` y mapearlo en `src/components/Projects.astro`.
4. Agregar `liveUrl` o `repoUrl` cuando exista un enlace real.

## GSAP

`src/scripts/animations.ts` registra ScrollTrigger una sola vez por carga, anima:

- Hero principal sin imágenes: escena técnica con chips de stack, rutas SVG, anillos, núcleo full-stack y movimiento GSAP contenido.
- Sección `Stats`: bloque "Base operativa" con grilla de fondo, paths SVG dibujados con ScrollTrigger, contador de años, tarjetas técnicas y workflow animado.
- Sección `About`: nueva sección con título grande propio y fondo de grilla idéntico a Hero/Stats; cajas entran desde la izquierda en secuencia, luego se dibuja una línea SVG con trazado de escalera; mantiene movimiento ambiente sutil en tarjetas y scan interno, sin scrub.
- Sección `Skills`: escena de tecnologías con logos SVG locales (`BrandLogo.astro`), fondo interno de grilla, paths/nodos SVG, tarjetas que entran como panel técnico y movimiento ambiente controlado.
- Sección `Projects`: showcase distinto al resto, sin fondo cuadriculado ni tarjetas flotantes; usa slider con pantallazo grande, overlay de proyecto, progreso/dots, texto lateral y transiciones GSAP horizontales.
- Sección `BlogTeaser`: vuelve al patrón de secciones técnicas del Home, con fondo cuadriculado, escena de lectura, paths/nodos SVG, tarjeta centrada del último post de Sanity y una regla interna animada con GSAP.
- Sección `Contact`: cierre con fondo cuadriculado, correo real `lukasibvi@gmail.com`, GitHub real `https://github.com/Lukas-Ibanez`, escena SVG de disponibilidad y badges animados. No muestra LinkedIn hasta tener un enlace real.
- `.reveal` en cascada inicial.
- `.batch-reveal` con `ScrollTrigger.batch`.
- parallax sutil en `.parallax-media`.

Si `prefers-reduced-motion: reduce` está activo, se muestran estados finales sin animar.

## SEO y performance

Reglas:

- `lang="es-CL"`.
- Metadatos por página: title, description, canonical, OG y Twitter.
- Sitemap con `@astrojs/sitemap`.
- JSON-LD `Person` en home y `BlogPosting` en posts.
- JS mínimo: solo GSAP como módulo local.
- Imágenes locales con `astro:assets`.
- Sin analytics de terceros por defecto. Opción futura: analytics self-hosted.

Presupuesto objetivo: Lighthouse 100/100/100/100 y JS home bajo ~50KB gzip. Revisar bundle si GSAP supera el presupuesto.

## Qué no hacer

- No usar CDNs externos.
- No usar Google Fonts por CDN.
- No usar Material Symbols ni icon-fonts remotas.
- No llamar Sanity o GitHub desde el navegador.
- No agregar analytics de terceros sin discutir la regla de cero requests externos.
- No usar copy genérico de agencia ni promesas infladas.

## TODOs pendientes

- Agregar LinkedIn real cuando Lukas lo entregue; por ahora no se muestra en `Footer.astro` ni `Contact.astro`.
- Reemplazar proyectos de ejemplo por casos reales, con links, métricas e imágenes propias.
- Definir dominio final en `SITE_URL` y `public/robots.txt`.
- Configurar proyecto Sanity real y deploy hook.
- Configurar `GITHUB_USERNAME` y `GITHUB_TOKEN` si se quieren repos horneados en build.
