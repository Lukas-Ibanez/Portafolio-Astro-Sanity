# Contexto del Portafolio Lukas Ibáñez

## Stack y versiones

| Área | Elección |
|---|---|
| Framework | Astro `^6.4.3`, `output: 'static'` |
| Node | `>=22.12.0` requerido por Astro 6 |
| Estilos | Tailwind CSS `^3.4.19` vía PostCSS local |
| Animaciones | GSAP `^3.15.0` + ScrollTrigger, importados como módulos |
| CMS blog | Sanity build-time con `@sanity/client ^7.22.1` |
| Portable Text | `@portabletext/to-html ^5.0.2` |
| Fuentes | `@fontsource-variable/inter` y `@fontsource-variable/fraunces` |

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

Tipografías: Fraunces Variable para títulos, Inter Variable para cuerpo/UI. Se importan desde npm y se precargan en `BaseLayout`.

## Mapa de archivos

| Ruta | Rol |
|---|---|
| `src/layouts/BaseLayout.astro` | HTML base, SEO, OG/Twitter, fuentes locales, JSON-LD y script GSAP |
| `src/styles/global.css` | tokens CSS, Tailwind, componentes utilitarios y estilos de artículo |
| `src/components/` | Nav, Hero, About, Skills, Projects, BlogTeaser, Contact, Footer |
| `src/components/icons/` | SVG locales como componentes Astro |
| `src/content.config.ts` | configuración Astro 6 de colecciones con loader `glob` |
| `src/content/projects/` | colección local de proyectos |
| `src/lib/sanity.ts` | cliente y queries Sanity en build-time |
| `src/lib/github.ts` | consulta GitHub en build-time, falla silenciosamente sin token |
| `src/lib/seo.ts` | helper de metadatos y JSON-LD Person |
| `src/scripts/animations.ts` | GSAP, ScrollTrigger, guard de reduced motion y cleanup |
| `src/pages/` | rutas Astro estáticas |
| `sanity/` | Studio y schema `post`, documentado como opción embebida/local |

## Comandos

```bash
npm run dev
npm run build
npm run preview
```

Astro 6 no corre con Node 20. Usar Node `>=22.12.0`; el repo incluye `.nvmrc`, `.node-version` y `package.json#engines`.

En esta máquina hay un Node global `20.20.0`, así que se instaló Node `22.12.0` portable en `.local-node/` y los scripts de npm lo usan directamente. También desactivan `ASTRO_TELEMETRY_DISABLED=1` para evitar escrituras en AppData. `.local-node/` está ignorado por git.

Deploy sugerido: Vercel o Cloudflare Pages con `npm run build` y salida `dist/`.

## Variables de entorno

```bash
SITE_URL=https://lukasibanez.cl
SANITY_PROJECT_ID=...
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01
GITHUB_TOKEN=...
GITHUB_USERNAME=...
```

Sin Sanity o GitHub configurados, el build no se rompe. Se muestran estados vacíos/TODOs.

## Cómo agregar un post

1. Crear o abrir el Studio de Sanity usando `sanity/sanity.config.ts`.
2. Crear un documento `post` con `title`, `slug`, `excerpt`, `body`, `tags`, `publishedAt` y `seo`.
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

- Reemplazar `TODO@lukasibanez.cl` por email real.
- Reemplazar LinkedIn y GitHub placeholder en `Footer.astro` y `Contact.astro`.
- Reemplazar proyectos de ejemplo por casos reales, con links, métricas e imágenes propias.
- Definir dominio final en `SITE_URL` y `public/robots.txt`.
- Configurar proyecto Sanity real y deploy hook.
- Configurar `GITHUB_USERNAME` y `GITHUB_TOKEN` si se quieren repos horneados en build.
