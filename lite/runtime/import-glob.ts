import { Glob } from 'bun'
import type { AnyObject } from 'lite/types'

export function importGlob<M extends AnyObject, K extends keyof M = keyof M>(
  pattern: string,
  opts?: { cwd?: string; import?: K },
) {
  const glob = new Glob(pattern)
  const result: Record<string, () => Promise<M>> = {}

  for (const path of glob.scanSync(opts?.cwd)) {
    const { href } = Bun.pathToFileURL(path)
    if (opts?.import) {
      result[path] = () => import(href).then((m) => m[opts.import!])
    } else {
      result[path] = () => import(href)
    }
  }

  return result as K extends string
    ? Record<string, () => Promise<M[K]>>
    : Record<string, () => Promise<M>>
}

// const routes = importGlob('app/routes/**/*.tsx')
// const layouts = importGlob('app/routes/**/_layout.tsx', { import: 'default' })

// console.log('ROUTES', routes)
// console.log('LAYOUTS', layouts)
