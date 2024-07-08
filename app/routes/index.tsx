import type { Context } from 'lite/context'
import { Counter } from '../islands/counter'
import type { VNode } from 'preact'
import type { MaybePromise } from 'lite/types'

export const title = 'Home'

function lite(h: (c: Context) => MaybePromise<Response | VNode>) {
  return h
}

// export const GET = (c: Context) => null

export default lite(async (c) => {
  const name = c.req.query.get('name') || 'world'
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <Counter count={0} />
      <Counter count={1} />
    </div>
  )
})
