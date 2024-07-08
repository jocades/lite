import { Glob, type BunPlugin } from 'bun'

const transpiler = new Bun.Transpiler({ loader: 'tsx' })

// the api is almost identical to esbuild
export function lite() {
  return {
    name: 'islands',
    setup(build) {
      // console.log('custom plugin')
      // ts or tsx
      build.onLoad({ filter: /\.(ts|tsx)$/ }, async (args) => {
        const text = await Bun.file(args.path).text()

        // check if the file is an island
        const { imports, exports } = transpiler.scan(text)

        // console.log('custom loader', text)
        return { contents: text, loader: 'tsx' }
      })
    },
  } satisfies BunPlugin
}
