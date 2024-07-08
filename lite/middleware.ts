import type { Context } from './context'
import type { Handler } from './trie/router'
import { isDef } from './util'
import { join } from 'path'

export function logger(
  opts: {
    in?: (c: Context) => string
    out?: (c: Context, elapsed: number) => string
    logIncoming?: boolean
  } = {},
): Handler {
  return async (c, next) => {
    const start = performance.now()
    if (opts.logIncoming || !isDef(opts.logIncoming)) {
      console.log(opts.in ? opts.in(c) : `-> ${c.req.method} ${c.req.path}`)
    }
    await next()
    const elapsed = (performance.now() - start).toFixed(3)
    console.log(
      opts.out
        ? opts.out(c, Number(elapsed))
        : `<- ${c.req.method} ${c.req.path} | ${c.res.status} | ${elapsed}ms`,
    )
  }
}

export function serveStatic(dir: string, fallback: string): Handler {
  return async (c, next) => {
    const path = join(dir, c.req.path)
    const file = (await Bun.file(path).exists())
      ? Bun.file(path)
      : Bun.file(join(dir, fallback))

    if (!(await file.exists())) {
      return await next()
    }

    return c.file(file)
  }
}
