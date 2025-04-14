import { CollectionConfig, CollectionSlug, Config, GlobalConfig, PayloadRequest } from "payload";

export type GenerateUrl<T = any> = (
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
  generateUrl: GenerateUrl
  collections: CollectionSlug[]
}
