// ─────────────────────────────────────────────────────────────────────────────
// Central site data (no Sanity). Edit these values to update the site.
// Channels with an empty string are simply NOT rendered, so there are never
// visible placeholders in production. Fill a value to make the channel appear.
// ─────────────────────────────────────────────────────────────────────────────

export const siteUrl = import.meta.env.SITE_URL || 'https://lukasibanez.cl';

export const owner = {
  name: 'Lukas Ibáñez',
  role: 'Desarrollador Full-Stack',
  location: 'Santiago, Chile · remoto / híbrido',
  tagline:
    'Un solo responsable técnico desde el deploy hasta el usuario final: frontend, backend, servidor Linux, seguridad, SEO y performance.',
};

// Real, public values are filled. Owner-only values are left empty on purpose;
// an empty string hides the channel rather than showing a placeholder.
export const contact = {
  email: 'lukasibvi@gmail.com',
  github: 'https://github.com/Lukas-Ibanez',
  // ── Fill these when available ──────────────────────────────────────────────
  whatsapp: '', // International format digits only, e.g. '56912345678'
  linkedin: '', // Full URL, e.g. 'https://www.linkedin.com/in/lukas-ibanez'
  cv: '', // Path to a PDF in /public, e.g. '/cv-lukas-ibanez.pdf'
};

export type ContactChannel = {
  key: 'email' | 'whatsapp' | 'linkedin' | 'github';
  label: string;
  value: string;
  href: string;
};

// Returns only the channels that actually have a value.
export function contactChannels(): ContactChannel[] {
  const list: ContactChannel[] = [];

  if (contact.email) {
    list.push({
      key: 'email',
      label: contact.email,
      value: contact.email,
      href: `mailto:${contact.email}`,
    });
  }

  if (contact.whatsapp) {
    const digits = contact.whatsapp.replace(/\D/g, '');
    const pretty = digits.startsWith('56') ? `+${digits.slice(0, 2)} ${digits.slice(2)}` : `+${digits}`;
    list.push({
      key: 'whatsapp',
      label: pretty,
      value: pretty,
      href: `https://wa.me/${digits}`,
    });
  }

  if (contact.linkedin) {
    list.push({
      key: 'linkedin',
      label: 'LinkedIn',
      value: contact.linkedin,
      href: contact.linkedin,
    });
  }

  if (contact.github) {
    list.push({
      key: 'github',
      label: contact.github.replace(/^https?:\/\//, ''),
      value: contact.github,
      href: contact.github,
    });
  }

  return list;
}

// Web3Forms access key (free, works on static Cloudflare Pages, no server).
// Set PUBLIC_WEB3FORMS_KEY in the environment to enable the contact form.
// Without it, the page falls back to direct channels (email/WhatsApp).
export const web3formsKey = import.meta.env.PUBLIC_WEB3FORMS_KEY || '';
