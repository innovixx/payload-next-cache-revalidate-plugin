# Payload Next Cache Revalidate Plugin

A plugin for https://github.com/payloadcms/payload that calls Next.js revalidation endpoints to clear the server-side cache, ensuring that users receive the most up-to-date content.

## Core Features:

- Revalidate cache for specified collections
- Supports dynamic URL generation for revalidation endpoints

## Installation

```bash
pnpm add @innovixx/payload-next-cache-revalidate-plugin
# OR
npm i @innovixx/payload-next-cache-revalidate-plugin
```

## Basic Usage

```js
import { payloadNextCacheRevalidatePlugin } from '@innovixx/payload-next-cache-revalidate-plugin';

const payloadConfig = {
	...
  plugins: [
    payloadNextCacheRevalidatePlugin({
      collections: [
        'page',
      ],
      generateUrl: async ({ doc, collectionConfig, req }) => {
        switch (collectionConfig.slug) {
          default:
          case 'page': {
            return `${process.env.CLIENT_URL}/revalidate?path=/${doc.slug}`;
          }
        }
      },
    }),
  ],
	...
};
```

## Development

To actively develop or debug this plugin, you can either work directly within the demo directory of this repo or link your own project.

### Internal Demo

This repo includes a fully working, self-seeding instance of Payload that installs the plugin directly from the source code. This is the easiest way to get started. To spin up this demo, follow these steps:

1. First, clone the repo
2. `cd YOUR_PLUGIN_REPO && pnpm && pnpm watch `
3. `cd YOUR_PLUGIN_REPO/demo && pnpm && pnpm cleanDev`
4. Now open `http://localhost:3000/admin` in your browser
5. Enter username `admin@innovixx.co.uk` and password `Pa$$w0rd!`

That's it! Changes made in `./src` will be reflected in your demo.