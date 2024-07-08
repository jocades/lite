import type { Context } from 'lite/context'
import type { Handler } from './router'
import type { AnyFn, MaybePromise } from 'lite/types'

export function pipe(
  fns: Handler[],
  onError?: AnyFn<MaybePromise<Response>>,
  onNotFound?: AnyFn<MaybePromise<Response>>,
) {
  return async (c: Context) => {
    let index = -1

    let res: Response
    let isError = false

    async function dispatch(i: number) {
      if (i <= index) throw new Error('Cannot call next() multiple times')
      index = i

      const handler = fns[i]

      if (!handler) {
        if (onNotFound) {
          return await onNotFound(c)
        }
        throw new Error(`Handler not found at index ${i}`)
      }

      try {
        const _res = await handler(c, () => dispatch(i + 1))
        if (_res instanceof Response) {
          res = _res
        } else {
          // do nothing
        }
      } catch (err: any) {
        if (onError) {
          c.error = err
          res = await onError(err, c)
          isError = true
        } else {
          throw err
        }
      }
    }

    await dispatch(0)

    if (!res! && !isError) {
      throw new Error('No response returned from the pipeline')
    }

    return res!
  }
}
