# Manual Técnico — Portafolio Lukas Ibáñez

> Documento generado el 4 de junio de 2026.  
> Cubre arquitectura, tecnologías, flujo de trabajo, administración de contenido, backups y operación general del sitio.

---

## Tabla de contenidos

1. [Resumen del sistema](#1-resumen-del-sistema)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Estructura de directorios](#3-estructura-de-directorios)
4. [Variables de entorno](#4-variables-de-entorno)
5. [Arquitectura y flujo de datos](#5-arquitectura-y-flujo-de-datos)
6. [Dependencias detalladas](#6-dependencias-detalladas)
7. [Sistema de diseño y estilos](#7-sistema-de-diseño-y-estilos)
8. [Sistema de animaciones (GSAP)](#8-sistema-de-animaciones-gsap)
9. [SEO y metadatos](#9-seo-y-metadatos)
10. [Sanity CMS — funcionamiento completo](#10-sanity-cms--funcionamiento-completo)
11. [Backups de Sanity](#11-backups-de-sanity)
12. [GitHub API — repositorios](#12-github-api--repositorios)
13. [Colección de proyectos (Markdown local)](#13-colección-de-proyectos-markdown-local)
14. [Páginas del sitio](#14-páginas-del-sitio)
15. [Componentes](#15-componentes)
16. [Flujo de trabajo para producción](#16-flujo-de-trabajo-para-producción)
17. [Requisitos del servidor o plataforma de hosting](#17-requisitos-del-servidor-o-plataforma-de-hosting)
18. [Checklist de operación](#18-checklist-de-operación)
19. [Cosas pendientes (TODOs detectados)](#19-cosas-pendientes-todos-detectados)

---

## 1. Resumen del sistema

El sitio es un **portafolio profesional estático** construido con **Astro 6**. Se genera como HTML puro en tiempo de compilación (*build-time*) y no necesita ningún servidor de aplicaciones en producción.

**Regla central del proyecto:** cero requests externos en runtime. Todo el contenido dinámico (posts de blog de Sanity, repositorios de GitHub) se resuelve durante el build y queda embebido en el HTML generado. El visitante nunca espera llamadas a APIs externas.

```
Código fuente (Git)
       │
       ▼
   npm run build
       │
  ┌────┴──────────────────────────────────┐
  │  Build-time fetches:                  │
  │   · Sanity API  → posts de blog       │
  │   · GitHub API  → repos destacados    │
  │   · Archivos .md → proyectos          │
  └────┬──────────────────────────────────┘
       │
       ▼
   dist/ (HTML + CSS + JS estático)
       │
       ▼
  Servidor / CDN (Nginx, Netlify, Vercel…)
```

---

## 2. Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | **Astro** | `^6.4.3` |
| Estilos | **Tailwind CSS** | `^3.4.19` |
| Animaciones | **GSAP + ScrollTrigger** | `^3.15.0` |
| CMS (Blog) | **Sanity** | `^5.29.0` |
| Cliente Sanity | `@sanity/client` | `^7.22.1` |
| Portable Text | `@portabletext/to-html` | `^5.0.2` |
| Fuentes | Inter Variable + Plus Jakarta Sans Variable | `^5.x` |
| Sitemap | `@astrojs/sitemap` | `^3.7.3` |
| Lenguaje | **TypeScript** | `^5.9.3` |
| Procesador CSS | PostCSS + Autoprefixer | `^8.5.6` / `^10.4.22` |
| Linter de tipos | `@astrojs/check` | `^0.9.9` |
| Entorno de ejecución | **Node.js** | `>=22.13.0` |

---

## 3. Estructura de directorios

```
Port/
├── astro.config.mjs          # Configuración principal de Astro
├── tailwind.config.mjs       # Tokens de diseño y configuración de Tailwind
├── postcss.config.mjs        # Pipeline CSS (Tailwind + Autoprefixer)
├── tsconfig.json             # TypeScript (extiende astro/strict, alias @/*)
├── package.json              # Dependencias y scripts
│
├── public/                   # Archivos servidos tal cual (favicon, og-image, robots.txt)
│   └── robots.txt
│
├── sanity/                   # Studio de Sanity (CMS embebido)
│   ├── sanity.config.ts      # Configuración del Studio
│   └── schemas/
│       └── post.ts           # Esquema del tipo "post" (blog)
│
└── src/
    ├── content.config.ts     # Define colecciones de contenido de Astro
    ├── assets/               # Imágenes y recursos importados por componentes
    │
    ├── components/           # Componentes .astro reutilizables
    │   ├── Nav.astro
    │   ├── Hero.astro
    │   ├── Stats.astro
    │   ├── About.astro
    │   ├── Skills.astro
    │   ├── Projects.astro
    │   ├── ProjectCard.astro
    │   ├── BlogTeaser.astro
    │   ├── GithubRepos.astro
    │   ├── Contact.astro
    │   ├── Footer.astro
    │   └── icons/            # SVGs como componentes Astro
    │
    ├── content/
    │   └── projects/         # Archivos .md con datos de proyectos
    │       ├── api-rest.md
    │       ├── linux-deploy.md
    │       ├── panel-fullstack.md
    │       └── seo-performance.md
    │
    ├── layouts/
    │   └── BaseLayout.astro  # Layout base: <head> completo, Nav, Footer, animaciones
    │
    ├── lib/                  # Módulos TypeScript de integración de datos
    │   ├── sanity.ts         # Cliente Sanity, tipos, queries
    │   ├── github.ts         # Cliente GitHub REST API
    │   └── seo.ts            # buildSeo(), personJsonLd()
    │
    ├── pages/                # Rutas del sitio (file-based routing)
    │   ├── index.astro       # Página principal (/)
    │   ├── contacto.astro    # /contacto/
    │   ├── proyectos/
    │   │   └── index.astro   # /proyectos/
    │   └── blog/
    │       ├── index.astro   # /blog/
    │       └── [slug].astro  # /blog/:slug/ (rutas dinámicas generadas en build)
    │
    ├── scripts/
    │   └── animations.ts     # Lógica GSAP completa (inicialización y cleanup)
    │
    └── styles/
        └── global.css        # @font-face, variables CSS, utilidades Tailwind
```

---

## 4. Variables de entorno

El sitio se configura completamente a través de variables de entorno. **Ninguna variable es obligatoria para compilar**; si faltan, los módulos retornan arrays vacíos en lugar de romper el build.

### Archivo `.env` (crear en la raíz del proyecto)

```env
# ── Sanity CMS ───────────────────────────────────────────
SANITY_PROJECT_ID=xxxxxxxx          # ID del proyecto en sanity.io/manage
SANITY_DATASET=production           # Nombre del dataset (por defecto: production)
SANITY_API_VERSION=2025-01-01       # Versión de la API de Sanity

# ── GitHub API ────────────────────────────────────────────
GITHUB_TOKEN=ghp_xxxxxxxxxxxx       # Personal Access Token (scope: public_repo)
GITHUB_USERNAME=tu-usuario-github   # Usuario cuyas repos se mostrarán

# ── URL del sitio ─────────────────────────────────────────
SITE_URL=https://lukasibanez.cl     # Usado en canonical URLs y OG tags
```

> **Sanity Studio** (`sanity/sanity.config.ts`) usa variables con prefijo `SANITY_STUDIO_*`:
> ```env
> SANITY_STUDIO_PROJECT_ID=xxxxxxxx
> SANITY_STUDIO_DATASET=production
> ```

### Comportamiento cuando faltan variables

| Variable ausente | Efecto |
|---|---|
| `SANITY_PROJECT_ID` | El blog muestra un aviso "TODO Sanity"; el sitio compila sin errores |
| `GITHUB_TOKEN` o `GITHUB_USERNAME` | La sección de repos de GitHub se omite silenciosamente |
| `SITE_URL` | Se usa `https://lukasibanez.cl` como fallback |

---

## 5. Arquitectura y flujo de datos

### 5.1 Modo de salida: estático

`astro.config.mjs` define `output: 'static'`. Astro genera HTML puro; no hay servidor Node en producción.

### 5.2 Dónde se llaman las APIs

Todas las llamadas a datos externos ocurren en el frontmatter de los archivos `.astro` (el bloque `---`), que se ejecuta **solo en build-time**, nunca en el navegador.

```
src/pages/index.astro
  ├── getCollection('projects')     → Lee archivos .md locales
  └── getLatestPost()               → Llama a Sanity API (build-time)

src/pages/proyectos/index.astro
  ├── getCollection('projects')     → Lee archivos .md locales
  └── getFeaturedRepos()            → Llama a GitHub API (build-time)

src/pages/blog/index.astro
  └── getAllPosts()                  → Llama a Sanity API (build-time)

src/pages/blog/[slug].astro
  ├── getAllPosts()                  → Para generar rutas estáticas (getStaticPaths)
  └── getPostBySlug(slug)           → Para obtener contenido del post
```

### 5.3 Flujo de un post de blog

```
Sanity Studio (sanity.io o sanity/basePath)
   └── Editor crea/publica un "post"
         │
         ▼
   Sanity Content Lake (API GROQ)
         │
         ▼ (solo durante npm run build)
   src/lib/sanity.ts
   · getAllPosts()  → GROQ query
   · normalizePost() → toHTML(body) convierte Portable Text a HTML
   · estimateReadingTime() → cuenta palabras / 200
         │
         ▼
   src/pages/blog/[slug].astro
   · getStaticPaths() genera una ruta por cada slug
   · El HTML del post queda embebido en dist/blog/[slug]/index.html
```

---

## 6. Dependencias detalladas

### Producción (runtime del build)

| Paquete | Propósito |
|---|---|
| `astro` | Framework principal, compilador, file-based routing |
| `@astrojs/sitemap` | Genera `sitemap.xml` automáticamente al build |
| `tailwindcss` | Framework CSS utility-first |
| `gsap` | Animaciones de entrada y scroll (Hero, Stats, About, Skills, Projects) |
| `@sanity/client` | Cliente oficial para queries GROQ al Content Lake de Sanity |
| `sanity` | Studio embebido (editor visual del CMS) |
| `@portabletext/to-html` | Convierte el formato Portable Text de Sanity a HTML |
| `@fontsource-variable/inter` | Fuente Inter (variable, solo latin, carga local) |
| `@fontsource-variable/plus-jakarta-sans` | Fuente Plus Jakarta Sans (variable, solo latin) |

### Desarrollo

| Paquete | Propósito |
|---|---|
| `@astrojs/check` | Verifica tipos TypeScript en archivos `.astro` |
| `typescript` | Compilador TypeScript |
| `autoprefixer` | Agrega prefijos de vendor a CSS |
| `postcss` | Procesador CSS (pipeline de Tailwind) |

---

## 7. Sistema de diseño y estilos

### 7.1 Tokens de color (CSS custom properties)

Definidos en `src/styles/global.css` y mapeados como utilidades Tailwind en `tailwind.config.mjs`:

| Token CSS | Valor | Uso |
|---|---|---|
| `--color-bg` | `#F7F4EE` | Fondo principal (crema cálido) |
| `--color-bg-alt` | `#EFEBE2` | Fondo alternativo / separadores |
| `--color-surface` | `#FBFAF7` | Cards, overlays claros |
| `--color-accent` | `#CC785C` | Acento principal (terracota) |
| `--color-accent-soft` | `#EBC9BA` | Tags, highlights suaves |
| `--color-accent-strong` | `#B5654A` | Hover de botones, links activos |
| `--color-sage` | `#9CAA8B` | Acento secundario (verde salvia) |
| `--color-text` | `#2B2A27` | Texto principal (casi negro) |
| `--color-text-soft` | `#6B6862` | Texto secundario / subtítulos |
| `--color-border` | `#E3DDD1` | Bordes y divisores |

### 7.2 Tipografía

- **Cuerpo / UI:** `Inter Variable` — variable font, carga local desde `@fontsource-variable/inter`
- **Títulos / Serifa visual:** `Plus Jakarta Sans Variable` — variable font, carga local
- Ambas fuentes se precargan con `<link rel="preload">` en `BaseLayout.astro`
- `font-display: swap` evita Flash of Invisible Text

### 7.3 Clases utilitarias globales

Definidas en la capa `@layer components` de `global.css`:

| Clase | Uso |
|---|---|
| `.container-site` | Contenedor centrado, max-width `90rem`, padding responsivo |
| `.eyebrow` | Etiqueta pequeña uppercase (ej: "Proyectos") |
| `.section-title` | Título de sección (serif, `4xl`/`5xl`) |
| `.section-copy` | Párrafo de sección (max-width `2xl`, color soft) |
| `.button-primary` | Botón relleno oscuro, bordes redondeados |
| `.button-secondary` | Botón borde sutil, hover terracota |
| `.reveal` | Elemento invisible que GSAP anima al entrar |
| `.batch-reveal` | Igual pero en grupo (ScrollTrigger.batch) |
| `.article-body` | Estilos tipográficos para cuerpo de artículos de blog |

### 7.4 Accesibilidad: prefers-reduced-motion

Si el usuario tiene activada la preferencia de sistema "reducir movimiento":
- CSS desactiva todas las transiciones y animaciones
- GSAP detecta `matchMedia('(prefers-reduced-motion: reduce)')` y llama a `setFinalState()`, que pone todos los elementos en su estado visible final sin animar

---

## 8. Sistema de animaciones (GSAP)

`src/scripts/animations.ts` es el único archivo JavaScript cargado en el cliente (importado desde `BaseLayout.astro`).

### 8.1 Inicialización

```
DOMContentLoaded / astro:page-load
    └── initAnimations()
          ├── gsap.registerPlugin(ScrollTrigger)
          ├── initHero()        → Animación de entrada del hero
          ├── initStats()       → Cards de estadísticas con contador
          ├── initAbout()       → Capas de la sección About
          ├── initSkills()      → Cards de habilidades con clip-path
          └── initProjects()    → Slider de proyectos con dots y autoplay
```

### 8.2 Cleanup para View Transitions

```
astro:before-swap
    └── cleanupAnimations()
          └── ScrollTrigger.getAll().forEach(t => t.kill())
```

Esto es necesario porque Astro realiza transiciones de página sin recargar; sin cleanup los ScrollTriggers quedarían acumulados en memoria.

### 8.3 Slider de proyectos

- Autoplay de 4.8 segundos por slide
- Navegación por dots con barra de progreso animada
- Transición con `clipPath` + `xPercent` para efecto de barrido
- Se pausa cuando la sección sale del viewport (ScrollTrigger `toggleActions`)

---

## 9. SEO y metadatos

### 9.1 `src/lib/seo.ts`

Dos exportaciones:

**`buildSeo(input)`** — construye el objeto de metadatos para cada página:
- URL canónica completa
- URL absoluta de la imagen OG
- Title y description

**`personJsonLd()`** — genera el JSON-LD `Person` para la página principal (Schema.org).

### 9.2 `BaseLayout.astro` implementa

- `<title>`, `<meta name="description">`, `<link rel="canonical">`
- Open Graph: `og:title`, `og:description`, `og:url`, `og:image`, `og:type`, `og:locale`
- Twitter Card: `summary_large_image`
- JSON-LD embebido en `<script type="application/ld+json">`
- `<link rel="icon" href="/favicon.svg">` (SVG moderno)
- Skip link accesible (`Saltar al contenido`)

### 9.3 SEO por página

| Página | JSON-LD |
|---|---|
| `/` | `Person` (desarrollador full-stack) |
| `/blog/[slug]/` | `BlogPosting` (headline, datePublished, author) |
| Resto | Sin JSON-LD específico |

### 9.4 Sitemap

Generado automáticamente por `@astrojs/sitemap` al ejecutar `npm run build`. Se publica en `/sitemap-index.xml`.

---

## 10. Sanity CMS — funcionamiento completo

### 10.1 Qué es Sanity en este proyecto

Sanity actúa como **backend de contenido para el blog**. El editor escribe posts en el Studio (interfaz web), y el sitio los consume durante el build mediante queries GROQ.

### 10.2 Arquitectura de Sanity

```
sanity.io Content Lake
   └── Dataset: "production"
         └── Tipo: "post"
               ├── title (string, requerido)
               ├── slug (generado desde title, requerido)
               ├── excerpt (text)
               ├── coverImage (image con hotspot)
               ├── body (array de blocks + images → Portable Text)
               ├── tags (array de strings)
               ├── publishedAt (datetime)
               └── seo { title, description }
```

### 10.3 El Studio

El archivo `sanity/sanity.config.ts` configura un Studio embebido. Puede desplegarse de dos formas:

**Opción A — Sanity Studio en la nube (recomendado)**
```bash
cd sanity
npx sanity deploy
# Queda disponible en: https://tu-proyecto.sanity.studio
```

**Opción B — Studio local durante desarrollo**
```bash
npx sanity dev
# Accesible en http://localhost:3333
```

> El `basePath: '/sanity'` en `sanity.config.ts` está pensado para servir el Studio como subruta del sitio si se configura SSR, pero dado que el sitio es estático, la opción recomendada es el deploy en la nube de Sanity.

### 10.4 Cómo crear y publicar un post

1. Abrir el Studio (cloud o local)
2. Ir a **Post → New Post**
3. Rellenar los campos:
   - **Título** — texto del encabezado
   - **Slug** — se genera automáticamente desde el título (puede editarse)
   - **Extracto** — resumen de 1-2 oraciones (aparece en el índice del blog y en OG description)
   - **Imagen de portada** — opcional, con hotspot para recorte inteligente
   - **Contenido** — editor de bloques rich text (Portable Text); admite texto, imágenes, listas, links, código
   - **Tags** — etiquetas separadas (ej: `Linux`, `SEO`, `Astro`)
   - **Fecha de publicación** — controla el orden y la fecha visible
   - **SEO** → título y descripción custom (si se deja vacío se usan title y excerpt)
4. Hacer clic en **Publish**
5. Ejecutar `npm run build` para regenerar el sitio con el nuevo post

> **Importante:** Publicar en Sanity no actualiza el sitio en vivo. Es necesario un nuevo build.

### 10.5 Cómo funciona `src/lib/sanity.ts`

```typescript
// Conexión
const client = createClient({
  projectId,   // SANITY_PROJECT_ID
  dataset,     // SANITY_DATASET (default: production)
  apiVersion,  // SANITY_API_VERSION (default: 2025-01-01)
  useCdn: true,          // Usa CDN de Sanity para builds
  perspective: 'published', // Solo contenido publicado
});

// Funciones exportadas
getAllPosts()        // Todos los posts, ordenados por fecha desc
getLatestPost()     // Solo el más reciente (usado en BlogTeaser del home)
getPostBySlug(slug) // Un post específico (usado en /blog/[slug])
```

La función `normalizePost()` convierte el Portable Text del campo `body` a HTML usando `@portabletext/to-html`, y calcula `readingTime` dividiendo el conteo de palabras por 200.

### 10.6 Query GROQ usada

```groq
*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  excerpt,
  tags,
  publishedAt,
  body,
  seo
}
```

---

## 11. Backups de Sanity

Sanity no tiene papelera de reciclaje. Una vez borrado un documento, se pierde si no hay backup.

### 11.1 Backup con CLI de Sanity (método oficial)

```bash
# Instalar CLI si no está
npm install -g @sanity/cli

# Autenticarse
sanity login

# Exportar todo el dataset como archivo .tar.gz (incluye assets)
sanity dataset export production ./backups/production-$(date +%Y%m%d).tar.gz --project <PROJECT_ID>

# Para listar los datasets disponibles
sanity dataset list
```

El archivo exportado contiene:
- Todos los documentos en formato NDJSON
- Los assets (imágenes) referenciados

### 11.2 Restaurar un backup

```bash
# Crear un dataset vacío de destino (o usar el mismo si se quiere restaurar)
sanity dataset create production-restore

# Importar
sanity dataset import ./backups/production-20260604.tar.gz production-restore --replace
```

> **Atención:** `--replace` elimina el contenido existente del dataset de destino antes de importar.

### 11.3 Exportar solo documentos (sin assets)

```bash
sanity documents query '*[_type == "post"]' --output json > backups/posts-$(date +%Y%m%d).json
```

Útil para backups livianos solo del contenido editorial.

### 11.4 Automatizar backups

Script PowerShell para Windows (ejecutar periódicamente con Task Scheduler):

```powershell
$date = Get-Date -Format "yyyyMMdd"
$outPath = "C:\backups\sanity\production-$date.tar.gz"
sanity dataset export production $outPath --project $env:SANITY_PROJECT_ID
```

### 11.5 Versionado en Sanity

Sanity mantiene un historial de versiones de cada documento en la nube. Desde el Studio se puede acceder a versiones anteriores de un documento específico desde el panel de historial (ícono de reloj en la barra lateral del editor).

### 11.6 Frecuencia recomendada de backups

| Actividad del blog | Frecuencia |
|---|---|
| Alta (varios posts/semana) | Backup semanal automatizado |
| Media (1-2 posts/mes) | Backup mensual manual |
| Baja / mantenimiento | Antes de cada cambio mayor al schema |

---

## 12. GitHub API — repositorios

`src/lib/github.ts` hace una llamada a la API REST de GitHub durante el build para mostrar hasta 4 repositorios en `/proyectos/`.

### 12.1 Configuración requerida

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxx    # PAT con scope public_repo
GITHUB_USERNAME=nombre-de-usuario
```

Si alguna variable falta o el username empieza con `TODO-`, la función retorna `[]` silenciosamente y el componente `GithubRepos` no se renderiza.

### 12.2 Lógica de selección

- Se piden 6 repos ordenados por `pushed` (más recientes)
- Se filtran los forks (`!repo.fork`)
- Se toma el slice de los primeros 4
- Los datos expuestos: `name`, `description`, `url`, `language`, `pushedAt`, `stars`

### 12.3 Rate limits

Sin token: 60 requests/hora por IP. Con token: 5000 requests/hora. Para un sitio que solo hace builds puntuales, el límite sin token raramente se alcanza, pero el token es necesario para builds automatizados en CI.

---

## 13. Colección de proyectos (Markdown local)

Los proyectos del portafolio son archivos `.md` en `src/content/projects/`. Se administran **editando los archivos directamente** (no hay CMS para esto).

### 13.1 Schema del frontmatter

```typescript
{
  title: string          // Nombre del proyecto
  excerpt: string        // Descripción corta (aparece en cards)
  problem: string        // Qué problema resolvía
  solution: string       // Cómo se resolvió
  stack: string[]        // Tecnologías usadas ["Node.js", "PostgreSQL"]
  role: string           // Rol en el proyecto ("Backend", "Full-Stack")
  featured: boolean      // Si aparece en el home (default: false)
  repoUrl?: string       // URL del repositorio (opcional)
  liveUrl?: string       // URL en producción (opcional)
  image?: string         // Identificador de imagen (opcional)
  order: number          // Orden de aparición (default: 0, menor = primero)
}
```

### 13.2 Cómo agregar un proyecto

1. Crear un nuevo archivo `.md` en `src/content/projects/`
2. Rellenar el frontmatter con los campos del schema
3. El cuerpo del archivo puede contener descripción extendida en Markdown
4. Ejecutar `npm run build`; el proyecto aparecerá automáticamente

### 13.3 Filtrado por `featuredOnly`

En la página principal (`index.astro`), el componente `Projects` recibe `featuredOnly`. Solo muestra los proyectos con `featured: true`. En `/proyectos/` se muestran todos sin filtro.

---

## 14. Páginas del sitio

| Ruta | Archivo | Contenido |
|---|---|---|
| `/` | `src/pages/index.astro` | Hero, Stats, About, Skills, Projects (featured), BlogTeaser, Contact |
| `/contacto/` | `src/pages/contacto.astro` | Sección de contacto |
| `/proyectos/` | `src/pages/proyectos/index.astro` | Todos los proyectos + repos de GitHub |
| `/blog/` | `src/pages/blog/index.astro` | Índice de posts de Sanity |
| `/blog/[slug]/` | `src/pages/blog/[slug].astro` | Post individual (rutas generadas en build) |

### Ruta dinámica `/blog/[slug]/`

Funciona mediante `getStaticPaths()`:
```typescript
export async function getStaticPaths() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ params: { slug: post.slug } }));
}
```
Si Sanity no está configurado, `getAllPosts()` retorna `[]` y no se genera ninguna ruta dinámica. El sitio sigue siendo válido.

Si se accede a un slug que no existe, Astro redirecciona a `/blog/`.

---

## 15. Componentes

### 15.1 Estructura

Todos los componentes son archivos `.astro`. No hay React, Vue ni Svelte. La interactividad está implementada enteramente con JavaScript vanilla y GSAP en `animations.ts`.

| Componente | Sección | Notas |
|---|---|---|
| `Nav.astro` | Barra de navegación | Menú mobile, links a secciones |
| `Hero.astro` | Portada del sitio | SVG animado, chips tecnológicos, sistema de señales |
| `Stats.astro` | "Base operativa" | Contador animado, tarjetas de stats, workflow steps |
| `About.astro` | Sobre mí | Capas flotantes, línea de proceso animada |
| `Skills.astro` | Habilidades | Tarjetas con logos, grafo SVG de conexiones |
| `Projects.astro` | Proyectos | Slider con autoplay, dots de navegación |
| `ProjectCard.astro` | Card individual de proyecto | Stack, links, rol |
| `BlogTeaser.astro` | Último post del blog | Solo se renderiza si `getLatestPost()` retorna datos |
| `GithubRepos.astro` | Repos de GitHub | Solo se renderiza si `getFeaturedRepos()` retorna datos |
| `Contact.astro` | Contacto | Links a email, LinkedIn, GitHub |
| `Footer.astro` | Pie de página | Copyright, links |

### 15.2 Iconos SVG

Ubicados en `src/components/icons/`. Cada icono es un componente Astro que acepta props como `class`, `width`, `height` y renderiza un SVG inline (permite control de color vía CSS `currentColor`).

| Icono | Uso |
|---|---|
| `ArrowRight.astro` | Botones CTA |
| `BrandLogo.astro` | Logos dinámicos de tecnologías |
| `Code.astro` | Skills / servicios de código |
| `ExternalLink.astro` | Links que abren en nueva pestaña |
| `Github.astro` | Link a GitHub |
| `Linkedin.astro` | Link a LinkedIn |
| `Mail.astro` | Link de email |
| `Search.astro` | Servicios de SEO |
| `Server.astro` | Servicios de infraestructura |
| `Shield.astro` | Servicios de seguridad |

---

## 16. Flujo de trabajo para producción

### 16.1 Prerrequisitos locales

```bash
node --version   # Debe ser >= 22.13.0
npm --version    # >= 10 recomendado
```

### 16.2 Comandos disponibles

```bash
npm run dev       # Servidor de desarrollo en http://localhost:4321
npm run build     # Verifica tipos (astro check) + genera dist/
npm run preview   # Sirve dist/ localmente para revisar el build
npm run astro     # CLI de Astro directo (ej: npm run astro add sitemap)
```

### 16.3 Repositorio y plataforma de producción

- **Código fuente:** GitHub (repositorio privado/público del proyecto)
- **Hosting:** **Cloudflare Pages** — conectado directamente al repositorio de GitHub
- **Variables de entorno:** configuradas en el panel de Cloudflare Pages (Settings → Environment variables)

Cuando se hace `git push` a la rama `main`, Cloudflare Pages detecta el cambio automáticamente, ejecuta `npm run build` en sus servidores, y publica el resultado. No hay intervención manual necesaria.

### 16.4 Flujo completo de desarrollo a producción

```
1. Desarrollo local
   ──────────────
   git checkout -b feature/nombre-del-cambio
   npm run dev
   # Hacer cambios en src/

2. Verificación antes del commit
   ────────────────────────────
   npm run build
   # Si hay errores de TypeScript, los reporta astro check
   # Si el build pasa, revisar dist/ con npm run preview

3. Commit y push
   ─────────────
   git add .
   git commit -m "feat: descripción del cambio"
   git push origin main          ← dispara el build en Cloudflare Pages

4. Deploy automático en Cloudflare Pages
   ─────────────────────────────────────
   # Cloudflare detecta el push, clona el repo, ejecuta:
   #   npm install
   #   npm run build
   # El contenido de dist/ queda publicado en la CDN global de Cloudflare
   # URL de producción: https://lukasibanez.cl (dominio custom)
   # URL de preview:    https://<hash>.lukasibanez-cl.pages.dev

5. Verificación post-deploy
   ─────────────────────────
   # Revisar el dashboard de Cloudflare Pages para confirmar build exitoso
   # Verificar la URL de producción en el navegador
```

### 16.5 Variables de entorno en Cloudflare Pages

Las variables de entorno **no deben estar en el repositorio** (`.env` está en `.gitignore`). Se configuran en:

**Cloudflare Pages → proyecto → Settings → Environment variables**

| Variable | Entorno |
|---|---|
| `SANITY_PROJECT_ID` | Production + Preview |
| `SANITY_DATASET` | Production + Preview |
| `SANITY_API_VERSION` | Production + Preview |
| `GITHUB_TOKEN` | Production + Preview |
| `GITHUB_USERNAME` | Production + Preview |
| `SITE_URL` | Production (`https://lukasibanez.cl`) |

> Cloudflare Pages expone estas variables durante el build (`npm run build`). Como el sitio es estático, **no se exponen en el navegador** del visitante.

### 16.6 Configuración del proyecto en Cloudflare Pages

| Parámetro | Valor |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` (raíz del repo) |
| Node.js version | `22.x` (configurar en Settings → Build & deployments) |

### 16.7 Previews por rama

Cada push a una rama que **no sea `main`** genera una URL de preview temporal (`https://<hash>.pages.dev`). Útil para revisar cambios antes de mergear a main.

---

## 17. Requisitos del servidor o plataforma de hosting

El sitio es **HTML puro** y se sirve desde **Cloudflare Pages**, conectado al repositorio de GitHub.

| Capa | Servicio |
|---|---|
| Código fuente | GitHub |
| Build y hosting | Cloudflare Pages |
| CDN | Red global de Cloudflare (automática) |
| SSL | Gestionado por Cloudflare (automático) |
| Dominio | Configurado en Cloudflare DNS |

### Node.js requerido solo en build-time

En producción Node.js **no es necesario**. Cloudflare Pages usa Node 22.x durante el build (configurable en Settings → Build & deployments → Environment variables → `NODE_VERSION=22`).

---

## 18. Checklist de operación

### Antes de cada deploy

- [ ] `npm run build` sin errores TypeScript
- [ ] `npm run preview` y revisar páginas principales visualmente
- [ ] Verificar que las variables de entorno están configuradas en el entorno de destino
- [ ] Si se agregaron posts en Sanity: verificar que se ven en `/blog/` del preview

### Mantenimiento periódico

- [ ] Actualizar dependencias: `npm outdated` → `npm update` → `npm run build`
- [ ] Backup de Sanity (ver sección 11)
- [ ] Renovar SSL si es servidor propio (Certbot renueva automáticamente; verificar el cron)
- [ ] Revisar `GITHUB_TOKEN`: los PATs de GitHub expiran si se configura expiración

### Si el blog no muestra posts

1. Verificar que `SANITY_PROJECT_ID` y `SANITY_DATASET` están definidos en el entorno de build
2. Verificar que los posts tienen `publishedAt` y `slug` definidos en el Studio
3. Verificar que el post está en estado **Published** (no Draft)
4. Ejecutar un nuevo build

---

## 19. Cosas pendientes (TODOs detectados)

Estos elementos fueron encontrados en el código y requieren atención para tener el sitio en producción real:

| Ubicación | Pendiente |
|---|---|
| `src/content/projects/api-rest.md` | Reemplazar por repositorio o caso productivo real |
| `src/content/projects/linux-deploy.md` | Reemplazar por caso real con métricas, capturas y enlaces |
| `src/content/projects/panel-fullstack.md` | Reemplazar por proyecto real, agregar link privado/demo |
| `src/content/projects/seo-performance.md` | Agregar antes/después de Lighthouse o métricas reales |
| `src/lib/github.ts` | `GITHUB_USERNAME` está en `'TODO-lukas-github'`; configurar variable de entorno |
| `sanity/sanity.config.ts` | `projectId` y `dataset` usan `'TODO'` como fallback; configurar variables de entorno |
| `public/` | Agregar `og-image.png` (1200×630 px) para Open Graph |
| `public/` | Agregar `favicon.svg` si no existe |
| Blog | Publicar el primer post real en Sanity |
| Proyectos | Reemplazar todos los proyectos de placeholder con trabajo real |

---

*Manual generado automáticamente a partir del análisis completo del código fuente. Actualizar este documento al realizar cambios arquitectónicos significativos.*
