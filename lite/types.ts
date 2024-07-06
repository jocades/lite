import type {
  ServeOptions,
  TLSServeOptions,
  TLSWebSocketServeOptions,
  UnixServeOptions,
  UnixTLSServeOptions,
  UnixTLSWebSocketServeOptions,
  UnixWebSocketServeOptions,
  WebSocketServeOptions,
} from 'bun'

export type AnyObject<T = any> = Record<string, T>

export type AnyFn<R = any> = (...args: any[]) => R

export type MaybePromise<T = any> = T | Promise<T>

export type Unwrap<T> = T extends Promise<infer R> ? R : T

export type Use<T extends AnyFn<MaybePromise>> = Unwrap<ReturnType<T>>

type OmitFetch<T> = Omit<T, 'fetch'>

export type ServeWithoutFetch<WebSocketDataType = undefined> =
  | OmitFetch<ServeOptions>
  | TLSServeOptions
  | OmitFetch<UnixServeOptions>
  | UnixTLSServeOptions
  | OmitFetch<WebSocketServeOptions<WebSocketDataType>>
  | TLSWebSocketServeOptions<WebSocketDataType>
  | OmitFetch<UnixWebSocketServeOptions<WebSocketDataType>>
  | UnixTLSWebSocketServeOptions<WebSocketDataType>
