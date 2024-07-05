import {
  h,
  type Attributes,
  type FunctionalComponent as FC,
  type VNode,
} from 'preact'
import renderToString from 'preact-render-to-string'
import { html } from 'htm/preact/index.js'
import { Counter } from '../app/islands/counter'
import { merge } from './util'
import type { BunFile } from 'bun'

export type Params = Record<string, string>

class LiteRequest extends Request {
  raw: Request
  path: string
  query: URLSearchParams
  params: Params

  constructor(req: Request, params: Params = {}) {
    super(req)
    this.raw = req
    const url = new URL(req.url)
    this.path = url.pathname
    this.query = url.searchParams
    this.params = params
  }
}

export type Headers = Record<string, string>

class Context {
  req: LiteRequest
  #status = 200
  #headers: Headers = {}
  #renderer?: VNode<Attributes>

  constructor(req: Request) {
    this.req = new LiteRequest(req)
  }

  status(code: number) {
    this.#status = code
  }

  header(key: string, value: string) {
    this.#headers[key] = value
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

  render<P = {}>(vnode: VNode<P>, props?: P) {
    if (!this.#renderer) {
      return this.html(renderToString(vnode))
    }
    this.#renderer.props = { ...props, children: vnode }
    return this.html(renderToString(this.#renderer))
  }

  setRenderer(renderer: VNode<Attributes>) {
    this.#renderer = renderer
  }

  file(file: string | BunFile, status?: number, headers?: Headers) {
    file = typeof file === 'string' ? Bun.file(file) : file
    this.header('content-type', file.type)
    return new Response(file, this.#opts(status, headers))
  }

  notFound() {
    return new Response('404 Not Found', { status: 404 })
  }

  #opts(status?: number, headers?: Headers): ResponseInit {
    return {
      status: status ?? this.#status,
      headers: headers ? merge(this.#headers, headers) : this.#headers,
    }
  }
}

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
      {props.children}
      <script type="module" src="/client.js"></script>
    </body>
  </html>
)

/* const renderer = <App />
const children = <Counter count={0} />
const props = { title: 'Home', children }

renderer.props = props

console.log(renderer, '')
// console.log(renderToString(renderer))
await Bun.write('app/index.html', renderToString(renderer)) */

// console.log(jsx, '')

const server = Bun.serve({
  port: 8000,
  fetch: async (req) => {
    const c = new Context(req)

    c.setRenderer(<App />)

    if (c.req.path === '/') {
      return c.render(<Counter count={0} />, { title: 'Home' })
    }

    if (c.req.path === '/client.js') {
      return c.file('app/client.js')
    }

    return c.notFound()

    /* if (c.req.path === '/client.js') {
      const file = Bun.file('app/client.js')
      return new Response(file)
    } */

    // return c.render(<Counter count={0} />)

    // return new Response(renderToString(<App title="Home" />), {
    //   headers: { 'content-type': 'text/html' },
    // })
  },
})

console.log(`🔥Listening at ${trimTrailingSlash(server.url.href)}`)

function trimTrailingSlash(url: string) {
  return url.replace(/\/$/, '')
}
