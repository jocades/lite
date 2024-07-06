import { h, type VNode } from 'preact'
import path from 'path'
import { html } from 'htm/preact'
import { render } from 'preact-render-to-string'
import { type FunctionalComponent as FC } from 'preact'
import { Router } from './router'
import { Context } from './context'
import { trimTrailingSlash } from './util'
import type { ServeWithoutFetch } from './types'
import type { Server } from 'bun'

async function toSSG(Component: FC) {
  const content = render(<Component />)
  await Bun.write('pub/index.html', content)
}

const fsRouter = new Bun.FileSystemRouter({
  style: 'nextjs',
  dir: 'app/routes',
  fileExtensions: ['.tsx', '.jsx'],
})

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

export function devServer(
  opts: ServeWithoutFetch,
  cb?: (server: Server) => void,
) {
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

      const match = fsRouter.match(c.req)
      if (!match) return c.notFound()

      c.req.params = match.params

      const _route = await import('file://' + match.filePath)

      if (_route.default instanceof Router) {
        return _route.default.request(c)
      }

      const filepath = path.join(path.dirname(match.filePath), LAYOUT)

      // const title =
      console.log(match)

      let _layout
      try {
        _layout = await import('file://' + filepath)
        console.log('found layout')
        c.setRenderer(_layout.default)
      } catch (err) {
        console.error(err)
      }

      const handler = _route[req.method] ?? _route.default
      if (!handler) return c.text('Method not allowed', 405)

      const title = _route.title ?? match.src.replace(re.jsx, '$1')

      let res = handler(c)
      // res = res instanceof Promise ? await res : res
      if (res instanceof Promise) {
        console.log('awaiting')
        res = await res
      }

      return res instanceof Response ? res : c.render(res, { title })
    },

    websocket: {
      open(ws) {
        console.log('WS OPEN', ws)
      },
      message(ws, data) {
        console.log('WS MESSAGE', data)
        ws.send('Hello')
      },
    },
  })

  cb?.(server) ??
    console.log(`🔥Listening at ${trimTrailingSlash(server.url.href)}`)

  return server
}

devServer({ port: 8000 })
