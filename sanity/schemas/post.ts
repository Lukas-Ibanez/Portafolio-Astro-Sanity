export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    { name: 'title', title: 'Titulo', type: 'string', validation: (Rule: any) => Rule.required() },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    { name: 'excerpt', title: 'Extracto', type: 'text', rows: 3 },
    { name: 'category', title: 'Categoria', type: 'string' },
    {
      name: 'coverImage',
      title: 'Imagen de portada',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Texto alternativo', type: 'string', validation: (Rule: any) => Rule.required() },
      ],
    },
    {
      name: 'content',
      title: 'Contenido',
      type: 'array',
      of: [
        { type: 'block' },
        {
          name: 'code',
          title: 'Codigo',
          type: 'object',
          fields: [
            {
              name: 'language',
              title: 'Lenguaje',
              type: 'string',
              options: {
                list: [
                  { title: 'JavaScript', value: 'javascript' },
                  { title: 'TypeScript', value: 'typescript' },
                  { title: 'Bash', value: 'bash' },
                  { title: 'CSS', value: 'css' },
                  { title: 'HTML', value: 'html' },
                ],
              },
            },
            { name: 'code', title: 'Codigo', type: 'text', rows: 8 },
          ],
        },
        { type: 'image', options: { hotspot: true } },
      ],
    },
    { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] },
    { name: 'publishedAt', title: 'Fecha de publicacion', type: 'datetime' },
    { name: 'readTime', title: 'Tiempo de lectura', type: 'string' },
    {
      name: 'sources',
      title: 'Fuentes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Titulo', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' },
          ],
        },
      ],
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'title', title: 'Titulo SEO', type: 'string' },
        { name: 'description', title: 'Descripcion SEO', type: 'text', rows: 3 },
      ],
    },
  ],
};
