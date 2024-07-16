import type { Context } from 'lite/context'
import type { MaybePromise } from 'lite/types'

type ErrorHandler = (e: Error, c: Context) => MaybePromise<Response>

export function error(h: ErrorHandler) {
  return h
}

export default error((e, c) => {
  console.info('Catched', e.message)

  return c.render(<h1>Oops! Something went wrong</h1>, {
    title: 'Error',
    path: '',
  })
})
