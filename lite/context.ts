import type { BunFile } from 'bun'
import type { VNode } from 'preact'
import { renderToString } from 'preact-render-to-string'
import { merge } from './util'

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
export type Renderer = VNode

export class Context {
  req: LiteRequest
  #status = 200
  #headers: Headers = {}
  #renderer?: Renderer

  constructor(req: Request) {
    this.req = new LiteRequest(req)
  }

  status(code: number) {
    this.#status = code
  }

  header(key: string, value: string) {
    this.#headers[key] = value
  }

  send(body: BodyInit, status?: number, headers?: Headers) {
    return new Response(body, this.#opts(status, headers))
  }

  json(data: unknown, status?: number, headers?: Headers) {
    return Response.json(data, this.#opts(status, headers))
  }

  text(data: string, status?: number, headers?: Headers) {
    this.header('content-type', 'text/plain')
    return new Response(data, this.#opts(status, headers))
  }

  html(data: string | VNode, status?: number, headers?: Headers) {
    this.header('content-type', 'text/html')
    if (typeof data !== 'string') {
      return new Response(renderToString(data), this.#opts(status, headers))
    }
    return new Response(data, this.#opts(status, headers))
  }

  render(data: VNode | string, props?: Record<string, unknown>) {
    if (!this.#renderer) return this.html(data)
    this.#renderer.props = { ...props, children: data }
    return this.html(this.#renderer)
  }

  setRenderer(renderer: Renderer) {
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
