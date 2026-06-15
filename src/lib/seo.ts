export type SeoInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
};

import { contact } from '../data/site';

const siteUrl = import.meta.env.SITE_URL || 'https://lukasibanez.cl';
const defaultImage = '/og-image.png';

export function buildSeo({ title, description, path = '/', image = defaultImage, type = 'website' }: SeoInput) {
  const canonical = new URL(path, siteUrl).toString();
  const imageUrl = new URL(image, siteUrl).toString();

  return {
    title,
    description,
    canonical,
    image: imageUrl,
    type,
  };
}

export function personJsonLd() {
  const sameAs = [contact.github, contact.linkedin].filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Lukas Ibáñez',
    jobTitle: 'Desarrollador Full-Stack',
    alumniOf: 'Duoc UC',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Santiago',
      addressCountry: 'CL',
    },
    knowsAbout: ['Linux', 'Seguridad web', 'Astro', 'Backend', 'SEO técnico', 'Optimización web'],
    url: siteUrl,
    ...(sameAs.length ? { sameAs } : {}),
  };
}
