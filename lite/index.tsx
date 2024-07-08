import { h, type VNode } from 'preact'
import path from 'path'
import { render } from 'preact-render-to-string'
import { type FunctionalComponent as FC } from 'preact'
import { Router, type HTTP_METHOD } from './trie/router'
import { Context } from './context'
import { isObj, isVNode, trimTrailingSlash } from './util'
import type { ServeWithoutFetch } from './types'
import { Glob, pathToFileURL, type Server, type ServerWebSocket } from 'bun'
import { watch } from 'chokidar'
import { importGlob } from './runtime/import-glob'
import { existsSync as exists } from 'fs'
import { buildClient } from './build/index.ts'
import { logger } from './middleware.ts'

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

type RouteModule = {
  title?: string
  default: Router | ((c: Context) => Response | VNode)
} & Record<HTTP_METHOD, (c: Context) => Response>

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

function getLayouts() {
  return importGlob('app/routes/**/_layout.tsx', {
    import: 'default',
  })
}

let layouts = getLayouts()

const transpiler = new Bun.Transpiler({ loader: 'tsx' })

const islands = new Glob('app/islands/**/*.tsx').scanSync()

console.log(Array.from(islands))

export function devServer(
  opts: ServeWithoutFetch,
  cb?: (server: Server) => void,
) {
  let ws: ServerWebSocket<unknown>

  watch('app/routes/**/*.tsx').on('all', async (event, path, stats) => {
    if (event === 'change') {
      console.log(path, 'changed')
      ws?.send(JSON.stringify({ type: 'reload', path }))
    }
  })

  watch('app/islands/**/*.tsx').on('all', async (event, path) => {
    if (event === 'change') {
      const client = await Bun.file('app/client.ts').text()
      const { imports, exports } = transpiler.scan(client)
      const importPath = path.replace('app', '.')

      if (!imports.some((imp) => imp.path === importPath)) {
        // console.log('Adding import', importPath)
        // await Bun.write('app/client.ts', client + `import '${importPath}'`)
      }

      console.log('Rebuilding client')
      await buildClient()
      ws?.send(JSON.stringify({ type: 'reload', path: '/pub/client.js' }))
    }
  })

  let wsID = 1

  const server = Bun.serve({
    ...opts,
    fetch: async (req) => {
      const c = new Context(req)

      if (c.req.path === '/ws') {
        if (server.upgrade(req, { data: { id: wsID++ } })) return
        return c.text('Upgrade failed', 500)
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
      console.log(match)

      const _route = await import(match.filePath)

      if (_route.default instanceof Router) {
        const newReq = new Request(req.url.replace(match.name, ''), req)
        return _route.default.fetch(newReq)
      }

      const handler = _route[req.method] ?? _route.default
      if (!handler) return c.text('Method not allowed', 405)

      const title = _route.title ?? match.src.replace(re.jsx, '$1')

      try {
        const res = await handler(c)
        if (res instanceof Response) return res
        if (isVNode(res)) return c.render(res, { title })
        throw new Error(`Invalid response at ${match.filePath}`)
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
      open(websocket) {
        console.log('WS OPEN', websocket.data)
        console.log(websocket.remoteAddress)
        ws = websocket
        websocket.send(JSON.stringify({ type: 'connected' }))
      },
      message(ws, data) {
        console.log('WS MESSAGE', data)
      },
    },
  })

  if (!cb) console.log(`🔥Listening at ${trimTrailingSlash(server.url.href)}`)
  else cb(server)

  return server
}
