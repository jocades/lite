import { h, type VNode } from 'preact'
import path from 'path'
import { render } from 'preact-render-to-string'
import { type FunctionalComponent as FC } from 'preact'
import { Router } from './trie/router'
import { Context } from './context'
import { trimTrailingSlash } from './util'
import type { ServeWithoutFetch } from './types'
import { pathToFileURL, type Server } from 'bun'
import { watch } from 'chokidar'
import { importGlob } from './runtime/import-glob'
import { existsSync as exists } from 'fs'

async function toSSG(Component: FC) {
  const content = render(<Component />)
  await Bun.write('pub/index.html', content)
}

const fsRouter = new Bun.FileSystemRouter({
  style: 'nextjs',
  dir: 'app/routes',
  fileExtensions: ['.tsx', '.jsx', '.ts', '.js', '.mjs'],
})

// console.log(fsRouter.routes)

namespace Mod {
  export interface Route {
    title?: string
    default: (c: Context) => ReturnType<Context['render']> | Router
    GET?: (c: Context) => ReturnType<Context['render']>
    POST?: (c: Context) => ReturnType<Context['render']>
    PUT?: (c: Context) => ReturnType<Context['render']>
    DELETE?: (c: Context) => ReturnType<Context['render']>
  }
}

const LAYOUT = '_layout.tsx'
const NOT_FOUND = '_404.tsx'
const MIDDLEWARE = '_middleware.tsx'
const MW = '_mw.tsx' // alias

const re = {
  js: /^(.+)\.(ts|js|mjs)$/,
  jsx: /^(.+)\.(tsx|jsx)$/,
  html: /^(.+)\.html$/,
  index: /\/?index$/,
  htmljsx: /^(.+)\.(html|tsx|jsx)$/,
}

// console.log(fsRouter.routes)
// console.log(fsRouter.match('/_404'))

// const modules = importGlob('app/routes/**/*.tsx') // -> { [path]: () => Promise<Module> }

// const sorted = Object.entries(modules).sort(
//   ([a], [b]) => a.split('/').length - b.split('/').length,
// )

const layouts = importGlob('app/routes/**/_layout.tsx', { import: 'default' })

/* console.log('LAYOUTS', layouts)

const _layout = await layouts['app/routes/_layout.tsx']()

const req = new Request('http://localhost:3000/')
const c = new Context(req)
c.setRenderer(_layout)
const jsx = <h1>Hello, World!</h1>
const res = c.render(jsx, { title: 'Hello' })

console.log(await res.text())
*/
//
// const _notFound = importGlob('_404.tsx', {
//   import: 'default',
//   // cwd: 'app/routes',
// })

// console.log(_notFound)

export function devServer(
  opts: ServeWithoutFetch,
  cb?: (server: Server) => void,
) {
  watch('app/routes/**/*.tsx').on('all', async (event, path, stats) => {
    // console.log(event, path)

    if (['add', 'unlink'].includes(event)) {
      fsRouter.reload()
    }
  })

  const server = Bun.serve({
    ...opts,
    fetch: async (req) => {
      const c = new Context(req)

      if (c.req.path === '/ws') {
        if (server.upgrade(req, { data: { id: 1 } })) return
        return new Response('Upgrade failed', { status: 500 })
      }

      if (c.req.path === '/pub/client.js') {
        return c.file('pub/client.js')
      }

      const _import = layouts['app/routes/_layout.tsx']

      if (_import) {
        const _rootLayout = await _import()
        c.setRenderer(_rootLayout)
      }

      const match = fsRouter.match(c.req)

      if (!match) {
        return import('../app/routes/_404.tsx')
          .then((m) => m.default(c))
          .catch((err) => {
            console.error(err)
            return c.notFound()
          })
      }

      c.req.params = match.params

      const { href } = pathToFileURL(match.filePath)
      const _route = await import(href)

      if (_route.default instanceof Router) {
        return _route.default.request(c)
      }

      const handler = _route[req.method] ?? _route.default
      if (!handler) return c.text('Method not allowed', 405)

      const title = _route.title ?? match.src.replace(re.jsx, '$1')

      try {
        const res = await handler(c)
        return res instanceof Response ? res : c.render(res, { title })
      } catch (err: any) {
        return await import('../app/routes/_error.tsx')
          .then((m) => m.default(err, c))
          .catch((err) => {
            console.error(err)
            return c.text('Internal Server Error', 500)
          })
      }
    },

    websocket: {
      open(ws) {
        console.log('WS OPEN', ws.data)
      },
      message(ws, data) {
        console.log('WS MESSAGE', data)
        ws.send('Hello')
      },
    },
  })

  if (!cb) console.log(`🔥Listening at ${trimTrailingSlash(server.url.href)}`)
  else cb(server)

  return server
}
