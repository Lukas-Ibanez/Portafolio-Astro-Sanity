import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL || 'https://lukasibanez.cl';

export default defineConfig({
  site,
  output: 'static',
  integrations: [sitemap()],
  image: {
    responsiveStyles: true,
  },
  vite: {},
});
