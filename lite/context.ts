import type { BunFile } from 'bun'
import type { ComponentChildren, VNode } from 'preact'
import { h, type FunctionalComponent as FC } from 'preact'
import { renderToString } from 'preact-render-to-string'
import { merge } from './util'
import type { AnyObject } from './types'

class LiteRequest extends Request {
  path: string
  query: URLSearchParams
  params!: Record<string, string>

  constructor(req: Request, _url?: URL) {
    super(req)
    const url = _url ?? new URL(req.url)
    this.path = url.pathname
    this.query = url.searchParams
  }
}

export type Headers = Record<string, string>

export class Context {
  req: LiteRequest
  #status = 200
  #headers: Headers = {}
  #renderer?: FC
  #res?: Response
  error?: Error
  flushed = false

  constructor(req: Request, url?: URL) {
    this.req = new LiteRequest(req, url)
  }

  set res(res: Response) {
    this.#res = res
    this.flushed = true
  }

  get res(): Response {
    return (this.#res ||= new Response('404 Not Found', { status: 404 }))
  }

  status(code: number) {
    this.#status = code
  }

  header(key: string, value: string) {
    this.#headers[key] = value
  }

  send(body: BodyInit, status?: number, headers?: Headers) {
    // return new Response(body, this.#opts(status, headers))
    this.res = new Response(body, this.#opts(status, headers))
    return this.res
  }

  json(data: unknown, status?: number, headers?: Headers) {
    // return Response.json(data, this.#opts(status, headers))
    this.res = Response.json(data, this.#opts(status, headers))
    return this.res
  }

  text(data: string, status?: number, headers?: Headers) {
    this.header('content-type', 'text/plain')
    // return new Response(data, this.#opts(status, headers))
    this.res = new Response(data, this.#opts(status, headers))
    return this.res
  }

  html(data: string | VNode, status?: number, headers?: Headers) {
    this.header('content-type', 'text/html')
    if (typeof data !== 'string') {
      // return new Response(renderToString(data), this.#opts(status, headers))
      this.res = new Response(renderToString(data), this.#opts(status, headers))
      return this.res
    }
    // return new Response(data, this.#opts(status, headers))
    this.res = new Response(data, this.#opts(status, headers))
    return this.res
  }

  render(children: VNode | string, props: AnyObject | null = null) {
    if (!this.#renderer) return this.html(children)
    return this.html(h(this.#renderer, props, children))
  }

  setRenderer(renderer: FC) {
    console.log('RENDERER', renderer)
    this.#renderer = renderer
  }

  file(file: string | BunFile, status?: number, headers?: Headers) {
    file = typeof file === 'string' ? Bun.file(file) : file
    this.header('content-type', file.type)
    // return new Response(file, this.#opts(status, headers))
    this.res = new Response(file, this.#opts(status, headers))
    return this.res
  }

  notFound() {
    this.status(404)
    // return new Response('404 Not Found', this.#opts())
    this.res = new Response('404 Not Found', this.#opts())
    return this.res
  }

  redirect(url: string, status?: number) {
    // return Response.redirect(url, status)
    this.res = Response.redirect(url, status)
    return this.res
  }

  #opts(status?: number, headers?: Headers): ResponseInit {
    return {
      status: status ?? this.#status,
      headers: headers ? merge(this.#headers, headers) : this.#headers,
    }
  }
}
