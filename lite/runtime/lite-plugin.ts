import { type BunPlugin } from 'bun'

// the api is almost identical to esbuild
export function lite() {
  return {
    name: 'islands',
    setup(build) {
      console.log('custom plugin')
      /* build.onLoad({ filter: /\.tsx$/ }, async (args) => {
        const text = await Bun.file(args.path).text()

        console.log('custom loader', args)
        // console.log('custom loader', text)
        return { contents: text }
      }) */
    },
  } satisfies BunPlugin
}
