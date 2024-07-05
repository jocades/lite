import {
  h,
  type FunctionalComponent as FC,
  type AnyComponent,
  type Attributes,
  type VNode,
} from 'preact'
import renderToString from 'preact-render-to-string'
import { renderToReadableStream } from 'preact-render-to-string/stream'
import { useState } from 'preact/hooks'

import {
  createRouter,
  addRoute,
  findRoute,
  removeRoute,
  matchAllRoutes,
} from 'rou3'
import { html } from 'htm/preact/index.js'
import { Counter } from '../app/islands/counter'
import { merge } from './util'
import type { BunFile } from 'bun'

const router = createRouter<{ payload: string }>()

addRoute(router, '/path', 'GET', { payload: 'this path' })
addRoute(router, '/path/:name', 'GET', { payload: 'named route' })
addRoute(router, '/path/foo/**', 'GET', { payload: 'wildcard route' })
addRoute(router, '/path/foo/**:name', 'GET', {
  payload: 'named wildcard route',
})

// Returns { payload: 'this path' }
findRoute(router, '/path/h', 'GET')

// Returns { payload: 'named route', params: { name: 'fooval' } }
findRoute(router, '/path/fooval', 'GET')

// Returns { payload: 'wildcard route' }
findRoute(router, '/path/foo/bar/baz', 'GET')

// Returns undefined (no route matched for/)
findRoute(router, '/', 'GET')

const Script = () => html`
  <script type="module">
    console.log('Loaded')
  </script>
`

const App: FC<{ title?: string }> = (props) => (
  <html>
    <head>
      <title>{props.title}</title>
    </head>

    <body>
      <h1>Hello World</h1>
      <Counter count={10} />
      <Script />
      <script type="module" src="/client.js"></script>
    </body>
  </html>
)

class LiteRequest extends Request {
  raw: Request
  path: string
  query: URLSearchParams
  params: Record<string, string>

  constructor(req: Request, params: Record<string, string> = {}) {
    super(req)
    this.raw = req
    const url = new URL(req.url)
    this.path = trimTrailingSlash(url.pathname)
    this.query = url.searchParams
    this.params = params
  }
}

export type Headers = Record<string, string>

class Context {
  req: LiteRequest
  #status = 200
  headers: Headers = {}

  constructor(req: Request) {
    this.req = new LiteRequest(req)
  }

  status(code: number) {
    this.#status = code
  }

  header(key: string, value: string) {
    this.headers[key] = value
  }

  json(data: unknown, status?: number, headers?: Headers) {
    return Response.json(data, this.#opts(status, headers))
  }

  text(data: string, status?: number, headers?: Headers) {
    this.header('content-type', 'text/plain')
    return new Response(data, this.#opts(status, headers))
  }

  html(data: string, status?: number, headers?: Headers) {
    this.header('content-type', 'text/html')
    return new Response(data, this.#opts(status, headers))
  }

  render<P = {}>(vnode: VNode<P>, context?: any, status?: number) {
    return this.html(renderToString(vnode, context), status)
  }

  file(file: string | BunFile, status?: number, headers?: Headers) {
    file = typeof file === 'string' ? Bun.file(file) : file
    this.header('content-type', file.type)
    return new Response(file, this.#opts(status, headers))
  }

  #opts(status?: number, headers?: Headers): ResponseInit {
    return {
      status: status ?? this.#status,
      headers: merge(this.headers, headers),
    }
  }
}

const server = Bun.serve({
  port: 8000,
  async fetch(req) {
    const c = new Context(req)

    if (c.req.path === '/client.js') {
      return c.file('app/client.js')
    }

    /* if (c.req.path === '/client.js') {
      const file = Bun.file('app/client.js')
      return new Response(file)
    } */

    return c.render(<App title="Home" />)

    // return new Response(renderToString(<App title="Home" />), {
    //   headers: { 'content-type': 'text/html' },
    // })
  },
})

console.log(`🔥Listening at ${trimTrailingSlash(server.url.href)}`)

function trimTrailingSlash(url: string) {
  return url.replace(/\/$/, '')
}
