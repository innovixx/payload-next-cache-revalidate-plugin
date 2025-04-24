import type { PluginConfig } from './types'
import { CollectionConfig, Document, Operation, PayloadRequest, Plugin } from 'payload'


export const payloadNextCacheRevalidatePlugin = (pluginConfig: PluginConfig): Plugin => (config) => ({
  ...config,
  collections: config.collections?.map((collection) => {
    const { slug } = collection
    const isEnabled = pluginConfig.collections.includes(slug as string)

    if (isEnabled) {
      return {
        ...collection,
        hooks: {
          ...collection.hooks,
          afterChange: [
            ...collection.hooks?.afterChange || [],
            async ({ doc, req }: { doc: Document; req: PayloadRequest; operation: Operation; collection: CollectionConfig }) => {
              try {
                const url = await pluginConfig.generateUrl({
                  collectionConfig: collection,
                  doc,
                  req,
                })

                fetch(url, {
                  method: 'POST',
                  headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json',
                  },
                }).then(() => {
                  if (pluginConfig.verbose) req.payload.logger.info(`Cache revalidation triggered for ${url}`)
                }).catch((err) => {
                  if (pluginConfig.verbose) req.payload.logger.error(`Error revalidating cache for ${slug}`, err)
                })
              } catch (err) {
                throw new Error(`Error in Payload Next cache validation plugin afterChange hook: ${err}`)
              }
            }
          ]
        }
      }
    }
    return collection
  })
})
