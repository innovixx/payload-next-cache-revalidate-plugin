// eslint-disable-next-line import/no-relative-packages
import type { CollectionConfig } from 'payload'

const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'excerpt',
      type: 'text',
    },
    {
      name: 'date',
      type: 'date',
    },
  ],
}

export default Pages
