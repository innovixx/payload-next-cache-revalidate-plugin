import { CollectionConfig, CollectionSlug, Config, GlobalConfig, PayloadRequest } from "payload";
import type { DocumentInfoContext } from '@payloadcms/ui'

export type GeneratePath<T = any> = (
  args: {
    collectionConfig?: CollectionConfig
    doc: T
    globalConfig?: GlobalConfig[]
    locale?: string
    req: PayloadRequest
  },
) => Promise<string> | string

export interface PluginConfig {
  overwrites?: Partial<Config>
  nextUrl?: string
  collections: {
    [key: CollectionSlug]: {
      generatePath: GeneratePath
    }
  }
}
