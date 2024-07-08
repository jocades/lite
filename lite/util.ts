import { Glob } from 'bun'
import type { VNode } from 'preact'
import type { AnyObject } from './types'

export function isObj(value: unknown): value is Record<any, any> {
  return value !== null && typeof value === 'object'
}

export function isFn(value: unknown): value is Function {
  return typeof value === 'function'
}

export function isLiteral(value: unknown): value is string | number {
  return typeof value === 'string' || typeof value === 'number'
}

export function isDef<T>(value: T | undefined): value is T {
  return value !== undefined
}

export function isVNode(value: unknown): value is VNode {
  return isObj(value) && 'type' in value && 'props' in value
}

export function merge<
  T extends AnyObject | undefined,
  U extends AnyObject | undefined,
>(a: T, b: U) {
  return { ...a, ...b }
}

export function trimTrailingSlash(url: string) {
  return url.replace(/\/$/, '')
}

export const re = {
  js: /^(.+)\.(ts|js|mjs)$/,
  jsx: /^(.+)\.(tsx|jsx)$/,
}

export function importGlob<
  M extends AnyObject,
  K extends keyof M | undefined = undefined,
>(pattern: string, opts?: { cwd?: string; import?: K }) {
  const glob = new Glob(pattern)
  const result: Record<string, () => Promise<M>> = {}

  for (const path of glob.scanSync(opts?.cwd)) {
    const { href } = Bun.pathToFileURL(path)
    if (opts?.import) {
      result[path] = () => import(href).then((m) => m[opts.import!])
    } else {
      result[path] = () => import(href)
    }
  }

  return result as K extends string
    ? Record<string, () => Promise<M[K]>>
    : Record<string, () => Promise<M>>
}
