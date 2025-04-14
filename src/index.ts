import deepmerge from 'deepmerge'

import type { PluginConfig } from './types'
import { Plugin } from 'payload'

export default (pluginConfig: PluginConfig): Plugin =>
  config => {
    return deepmerge(config, pluginConfig.overwrites || {})
  }
