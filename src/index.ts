import deepmerge from 'deepmerge'
import type { PluginConfig } from './types'
import { CollectionConfig, Config, Document, Operation, PayloadRequest, Plugin } from 'payload'


export const payloadNextCacheRevalidatePlugin = (pluginConfig: PluginConfig): Plugin => (config) => {
  const updatedConfig: Config = {
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

                  await fetch(url, {
                    method: 'POST',
                    headers: {
                      'Cache-Control': 'no-cache',
                      'Content-Type': 'application/json',
                    },
                  })
                } catch (err) {
                  req.payload.logger.error(`Error in afterChange hook: ${err}`)
                }
              }
            ]
          }
        }
      }
      return collection
    })
  }

  return deepmerge(updatedConfig, pluginConfig.overwrites || {})
}
