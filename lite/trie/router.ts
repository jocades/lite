import { Context } from '../context'
import path from 'path'
import {
  createRouter,
  addRoute,
  findRoute,
  removeRoute,
  matchAllRoutes,
  type RouterContext,
} from './index'
import type { MaybePromise } from '../types'
import { pipe } from './pipe'

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

export type H<T extends string = string> = (
  path: T,
  ...handlers: Handler<T>[]
) => Router

export type Handler<T extends string = ''> = (
  c: Context,
  next: Next,
) => MaybePromise<Response | void>

export class Router {
  basePath: string
  ctx: RouterContext<{ handlers: Handler[] }>
  middleware: Handler[]
  subRouters: { [path: string]: Router }

  get!: H
  post!: H
  put!: H
  delete!: H
  patch!: H
  options!: H

  constructor(basePath = '') {
    this.basePath = basePath
    this.ctx = createRouter()
    this.middleware = []
    this.subRouters = {}

    for (const method of HTTP_METHODS) {
      this[method.toLowerCase() as Lowercase<HTTP_METHOD>] = (
        path,
        ...handlers
      ) => {
        this.#addRoute(path, handlers, method)
        return this
      }
    }
  }

  all(path: string, ...handlers: Handler[]) {
    for (const method of HTTP_METHODS) {
      this.#addRoute(path, handlers, method)
    }
    return this
  }

  #addRoute<T extends string>(
    path: T,
    handlers: Handler<T>[],
    method: HTTP_METHOD,
  ) {
    addRoute(this.ctx, this.basePath + path, method, { handlers })
  }

  #lookup(path: string, method: HTTP_METHOD | (string & {})) {
    return findRoute(this.ctx, path, method)
  }

  use(...handlers: Handler[]) {
    this.middleware.push(...handlers)
    return this
  }

  route(path: string, router: Router) {
    this.subRouters[this.basePath + path] = router
    return this
  }

  #dispatch(c: Context) {
    const match = this.#lookup(c.req.path, c.req.method)
    if (!match) return c.notFound()

    c.req.params = match.params ?? {}

    const handlers = [...this.middleware, ...match.data!.handlers]
    const dispatch = pipe(
      handlers,
      (err) => {
        console.error(err)
        return c.text('Internal Server Error', 500)
      },
      (c) => {
        return c.notFound()
      },
    )

    return dispatch(c)
  }

  fetch = async (req: Request): Promise<Response> => {
    return this.#dispatch(new Context(req))
  }

  request(where: string | Request | URL, origin?: string) {
    if (where instanceof Request) {
      return this.#dispatch(new Context(where))
    }

    if (where instanceof URL) {
      const req = new Request(where)
      return this.#dispatch(new Context(req, where))
    }

    origin ??= 'http://localhost:3000'
    const url = new URL(where, origin)
    const req = new Request(url)
    return this.#dispatch(new Context(req, url))
  }
}

const app = new Router()

app.get('/', (c) => c.html('<h1>Home</h1>'))

// const req = new Request('http://localhost:3000')
// const res = await app.fetch(req)
// console.log(await res.text())
//
const r2 = new Request('http://localhost:3000/')
const s2 = await app.fetch(r2)
console.log(await s2.text())
console.log(s2.headers)

// console.log(app.subRouters)
