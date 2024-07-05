import { join } from 'path'
import { Context } from './context'
import {
  createRouter,
  addRoute,
  findRoute,
  removeRoute,
  matchAllRoutes,
  type RouterContext,
} from './trie'
import type { MaybePromise } from './types'

export const HTTP_METHODS = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'OPTIONS',
] as const

export type HTTP_METHOD = (typeof HTTP_METHODS)[number]

export type Next = () => MaybePromise<Response | void>

export interface Handler<T extends string> {
  (c: Context, next: Next): MaybePromise<Response>
}

export class Router {
  basePath: string
  ctx: RouterContext<{
    handler: (c: Context, next: Next) => MaybePromise<Response>
  }>
  fallback: [HTTP_METHOD, Handler<string>][] = []

  constructor(basePath = '') {
    this.basePath = basePath
    this.ctx = createRouter()
  }

  #addRoute<T extends string>(
    path: T,
    handler: Handler<T>,
    method: HTTP_METHOD | 'ALL',
  ) {
    addRoute(this.ctx, path, method, { handler })
  }

  lookup(path: string, method: string) {
    return findRoute(this.ctx, path, method)
  }

  get<T extends string>(path: T, handler: Handler<T>) {
    if (path === '*') {
      this.fallback.push(['GET', handler])
      return this
    }
    this.#addRoute(path, handler, 'GET')
    return this
  }

  post<T extends string>(path: T, handler: Handler<T>) {
    this.#addRoute(path, handler, 'POST')
    return this
  }

  put<T extends string>(path: T, handler: Handler<T>) {
    this.#addRoute(path, handler, 'PUT')
    return this
  }

  delete<T extends string>(path: T, handler: Handler<T>) {
    this.#addRoute(path, handler, 'DELETE')
    return this
  }

  patch<T extends string>(path: T, handler: Handler<T>) {
    this.#addRoute(path, handler, 'PATCH')
    return this
  }

  options<T extends string>(path: T, handler: Handler<T>) {
    this.#addRoute(path, handler, 'OPTIONS')
    return this
  }

  all<T extends string>(path: T, handler: Handler<T>) {
    this.#addRoute(path, handler, 'ALL')
  }

  fetch = (req: Request) => {
    const c = new Context(req)
    console.log(c.req.path)

    const match = this.lookup(c.req.path, c.req.method)

    if (!match) {
      for (const [method, handler] of this.fallback) {
        if (method === c.req.method) {
          return handler(c, () => void 0)
        }
      }
      return c.notFound()
    }

    c.req.params = match.params ?? {}

    return match.data!.handler(c, () => void 0)
  }

  fire(c: Context) {
    const match = this.lookup(c.req.path, c.req.method)
    if (!match) return c.notFound()
    return match.data!.handler(c, () => void 0)
  }

  request(where: RequestInfo | URL | Context, init?: RequestInit) {
    if (where instanceof Context) {
      return this.fire(where)
    }
    const origin = 'https://example.com'
    const path = where instanceof Request ? where.url : where
    const req = new Request(new URL(path, origin), init)
    return this.fetch(req)
  }
}
