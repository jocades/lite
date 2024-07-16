import type { BunFile } from 'bun'
import {
  h,
  type ComponentChildren,
  type FunctionComponent as FC,
  type VNode,
} from 'preact'
import { renderToString } from 'preact-render-to-string'
import { isVNode, merge } from './util'

class LiteRequest extends Request {
  path: string
  query: URLSearchParams
  params!: Record<string, string>

  constructor(req: Request, url?: URL) {
    super(req)
    url ??= new URL(req.url)
    this.path = url.pathname
    this.query = url.searchParams
  }

  param(): Record<string, string | undefined>
  param(key: string): string | undefined
  param(key?: string): unknown {
    if (!key) return this.params
    return this.params[key]
  }
}

export type Headers = Record<string, string>

export interface RendererProps extends RenderProps {
  children: ComponentChildren
  Layout: FC<RenderProps>
}

declare global {
  interface RenderProps {}
}

export class Context {
  req: LiteRequest
  #status = 200
  #headers: Headers = {}
  #layouts: FC<RendererProps>[] = []
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

  status(code: number) {
    this.#status = code
  }

  header(key: string, value: string) {
    this.#headers[key] = value
  }

  send(body?: BodyInit | null, status?: number, headers?: Headers) {
    return (this.res ??= new Response(body, this.#opts(status, headers)))
  }

  json(data: unknown, status?: number, headers?: Headers) {
    return (this.res ??= Response.json(data, this.#opts(status, headers)))
  }

  text(data: string, status?: number, headers?: Headers) {
    this.header('content-type', 'text/plain;charset=utf8')
    return (this.res ??= new Response(data, this.#opts(status, headers)))
  }

  html(data: string | VNode, status?: number, headers?: Headers) {
    this.header('content-type', 'text/html;charset=utf8')
    if (isVNode(data)) {
      return (this.res ??= new Response(
        renderToString(data),
        this.#opts(status, headers),
      ))
    }
    return (this.res ??= new Response(data, this.#opts(status, headers)))
  }

  render(children: VNode | string, props: RenderProps | null = null) {
    if (!this.#layouts.length) return this.html(children)
    const vdom = this.#layouts.reduce((acc, Layout) => {
      // @ts-ignore
      return h(Layout, props, acc)
    }, children)

    return this.html(vdom)
  }

  setRenderer(renderer: FC<RendererProps>) {
    this.#layouts.unshift(renderer)
  }

  file(file: string | BunFile, status?: number, headers?: Headers) {
    file = typeof file === 'string' ? Bun.file(file) : file
    // content-type automatically set by bun
    // this.header('content-type', file.type)
    return (this.res ??= new Response(file, this.#opts(status, headers)))
  }

  notFound() {
    this.status(404)
    return (this.res ??= new Response('404 Not Found', this.#opts()))
  }

  redirect(url: string, status?: number) {
    return (this.res ??= Response.redirect(url, status))
  }

  #opts(status?: number, headers?: Headers): ResponseInit {
    return {
      status: status ?? this.#status,
      headers: headers ? merge(this.#headers, headers) : this.#headers,
    }
  }
}
