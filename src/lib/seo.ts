export type SeoInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
};

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
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Lukas Ibáñez',
    jobTitle: 'Desarrollador Full-Stack',
    alumniOf: 'Duoc UC',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CL',
    },
    knowsAbout: ['Linux', 'Seguridad web', 'Astro', 'Backend', 'SEO técnico', 'Optimización web'],
    url: siteUrl,
  };
}
