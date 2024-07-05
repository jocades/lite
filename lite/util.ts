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

export function merge<
  T extends AnyObject | undefined,
  U extends AnyObject | undefined,
>(a: T, b: U) {
  return { ...a, ...b }
}
