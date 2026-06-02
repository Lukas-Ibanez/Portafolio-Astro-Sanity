export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    { name: 'title', title: 'Título', type: 'string', validation: (Rule: any) => Rule.required() },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    { name: 'excerpt', title: 'Extracto', type: 'text', rows: 3 },
    { name: 'coverImage', title: 'Imagen de portada', type: 'image', options: { hotspot: true } },
    {
      name: 'body',
      title: 'Contenido',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    },
    { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] },
    { name: 'publishedAt', title: 'Fecha de publicación', type: 'datetime' },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'title', title: 'Título SEO', type: 'string' },
        { name: 'description', title: 'Descripción SEO', type: 'text', rows: 3 },
      ],
    },
  ],
};
