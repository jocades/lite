import type { Context } from './context'
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

export type Next = () => MaybePromise<void | Response>

export interface Handler<T extends string> {
  (c: Context, next: Next): MaybePromise<Response>
}

export class Router {
  ctx: RouterContext<{
    handler: (c: Context, next: Next) => MaybePromise<Response>
  }>

  constructor() {
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
    this.#addRoute(path, handler, 'GET')
  }

  post<T extends string>(path: T, handler: Handler<T>) {
    this.#addRoute(path, handler, 'POST')
  }

  put<T extends string>(path: T, handler: Handler<T>) {
    this.#addRoute(path, handler, 'PUT')
  }

  delete<T extends string>(path: T, handler: Handler<T>) {
    this.#addRoute(path, handler, 'DELETE')
  }

  patch<T extends string>(path: T, handler: Handler<T>) {
    this.#addRoute(path, handler, 'PATCH')
  }

  options<T extends string>(path: T, handler: Handler<T>) {
    this.#addRoute(path, handler, 'OPTIONS')
  }

  all<T extends string>(path: T, handler: Handler<T>) {
    this.#addRoute(path, handler, 'ALL')
  }
}
