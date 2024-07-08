import { Glob, type BunPlugin } from 'bun'
const path = await import('path')

// the api is almost identical to esbuild
export function lite() {
  return {
    name: 'islands',
    setup(build) {
      // console.log('custom plugin')
      // ts or tsx
      build.onLoad({ filter: /\.(ts)$/ }, async (args) => {
        let text = await Bun.file(args.path).text()
        let modified = text

        // imitate vites import.meta.glob behavior
        // import.meta.glob('./**/*.ts')
        const regex = /import\.meta\.glob\(['"](.+)['"]\)/g
        let match

        const cwd = path.dirname(args.path)

        // console.log(regex.exec(text))
        while ((match = regex.exec(text))) {
          const [full, pattern] = match

          console.log(import.meta.url)

          // const files = Array.from(new Glob(pattern).scanSync())
          const glob = new Glob(pattern)

          const files = Array.from(glob.scanSync({ cwd }))

          console.log('FILES', files)
          console.log(full, pattern)

          const imports = files
            .map((file, index) => {
              return `import * as mod${index} from './${file.replace(/\\/g, '/')}';`
            })
            .join('\n')

          const modules = files
            .map((file, index) => {
              return `'./${file.replace(/\\/g, '/')}': mod${index}`
            })
            .join(', ')

          const replacement = `
            ${imports}
            const mods = { ${modules} }
          `

          modified = modified.replace(full, replacement)

          console.log('REPLACEMENT', replacement)

          await Bun.write('app/client.mod.ts', modified)

          return { contents: modified, loader: 'ts' }
        }
      })
    },
  } satisfies BunPlugin
}
