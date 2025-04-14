import deepmerge from 'deepmerge'
import type { PluginConfig } from './types'
import { CollectionConfig, Config, Document, Operation, PayloadRequest, Plugin, RequestContext } from 'payload'


export const payloadNextCacheRevalidatePlugin = (pluginConfig: PluginConfig): Plugin => (config) => {
  const updatedConfig: Config = {
    ...config,
    collections: config.collections?.map((collection) => {
      const { slug } = collection
      const isEnabled = pluginConfig.collections[slug] !== undefined

      if (isEnabled) {
        return {
          ...collection,
          hooks: {
            ...collection.hooks,
            afterChange: [
              ...collection.hooks?.afterChange || [],
              async ({ doc, req }: { doc: Document; req: PayloadRequest; operation: Operation; collection: CollectionConfig }) => {
                try {
                  const { generatePath } = pluginConfig.collections[slug]
                  const path = await generatePath({
                    collectionConfig: collection,
                    doc,
                    req,
                    globalConfig: config.globals,
                    locale: req.locale as string,
                  })

                  const url = `${config.serverURL || pluginConfig.nextUrl}${path}`

                  await fetch(url, {
                    method: 'GET',
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
