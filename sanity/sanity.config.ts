import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import post from './schemas/post';

export default defineConfig({
  name: 'lukas-ibanez-portfolio',
  title: 'Lukas Ibáñez Portfolio',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'TODO',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  basePath: '/sanity',
  plugins: [structureTool()],
  schema: {
    types: [post],
  },
});
