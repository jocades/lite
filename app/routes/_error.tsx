import type { Context } from 'lite/context'
import type { MaybePromise } from 'lite/types'

type ErrorHandler = (e: Error, c: Context) => MaybePromise<Response>

export function error(h: ErrorHandler) {
  return h
}

export default error((e, c) => {
  console.log('ERROR /_error.tsx', e)
  return c.render(<h1>Error! {e.message}</h1>)
})
