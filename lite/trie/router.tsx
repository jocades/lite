import { Context } from '../context'
import {
  createRouter,
  addRoute,
  findRoute,
  matchAllRoutes,
  type RouterContext,
} from './index'
import type { MaybePromise } from '../types'
import { pipe } from './pipe'
import { isDef } from 'lite/util'

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
  #basePath = ''
  ctx: RouterContext<{ handlers: Handler[] }>
  middleware: Handler[]

  get!: H
  post!: H
  put!: H
  delete!: H
  patch!: H
  options!: H

  constructor() {
    this.ctx = createRouter()
    this.middleware = []

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

  baseBath(path: string) {}

  use(...handlers: Handler[]) {
    this.middleware.push(...handlers)
    return this
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
    addRoute(this.ctx, path, method, { handlers })
  }

  #lookup(path: string, method: HTTP_METHOD | (string & {})) {
    return findRoute(this.ctx, path, method)
  }

  dispatch = (c: Context) => {
    console.log(c.req.path)
    console.log(c.req.path, c.req.method)

    const match = this.#lookup(c.req.path, c.req.method)
    if (!match) return c.notFound()

    c.req.params = match.params ?? {}

    const handlers = [...this.middleware, ...match.data!.handlers]
    const dispatch = pipe(
      handlers,
      (err) => {
        console.error('Catched', err)
        return c.text('Internal Server Error', 500)
      },
      (c) => {
        return c.notFound()
      },
    )

    return dispatch(c)
  }

  fetch = (req: Request): MaybePromise<Response> => {
    return this.dispatch(new Context(req))
  }

  request(where: RequestInfo | URL | Context, init?: RequestInit) {
    console.log('request', where, init)

    if (where instanceof Context) {
      return this.dispatch(where)
    }

    if (where instanceof Request) {
      if (isDef(init)) {
        where = new Request(where, init)
      }
      return this.dispatch(new Context(where))
    }

    if (where instanceof URL) {
      const req = new Request(where)
      return this.dispatch(new Context(req, where))
    }

    const url = new URL(where, 'http://localhost')
    const req = new Request(url)
    return this.dispatch(new Context(req, url))
  }
}

const app = new Router()

app.get(
  '/first',
  async (c, next) => {
    console.log('mw1')
    c.setRenderer((props) => <main>{props.children}</main>)
    await next()
    console.log('mw1 after', c.req.headers.get('x-foo'))
  },
  (c) => {
    c.req.headers.set('x-foo', 'bar')
    // throw new Error('oops')
    return c.render('Hello, World!')
  },
)
