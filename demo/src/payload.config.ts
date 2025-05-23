import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { payloadNextCacheRevalidatePlugin } from '../../src'

import Media from './collections/Media'
import Pages from './collections/Pages'
import Posts from './collections/Posts'
import Users from './collections/Users'
import { seed } from './seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
  },
  collections: [Media, Pages, Users, Posts],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  editor: lexicalEditor({}),
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'lib/schema.graphql'),
  },
  onInit: async payload => {
    if (process.env.NODE_ENV === 'development' && process.env.PAYLOAD_SEED_DATABASE) {
      await seed(payload)
    }
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'lib/types.ts'),
  },
  plugins: [
    payloadNextCacheRevalidatePlugin({
      nextUrl: process.env.NEXT_URL || 'http://localhost:3000',
      collections: {
        'pages': {
          generatePath: async ({ doc, req }) => {
            const { slug } = doc

            return `/${slug}`
          }
        },
      }
    }) as any,
  ]
})
