import { plugin, type BunPlugin } from 'bun'

// the api is almost identical to esbuild
const litePlugin: BunPlugin = {
  name: 'custom-loader',
  setup(build) {
    console.log('custom loader setup')
    // filter tsx files
    /* build.onLoad({ filter: /\.ts$/ }, async (args) => {
      const text = await Bun.file(args.path).text()
      console.log('custom loader', args)
      return { contents: text }
    }) */
  },
}

plugin(litePlugin)
