import type { Context } from 'lite/context'
import type { VNode } from 'preact'
import type { MaybePromise } from 'lite/types'
import Markdown from '../blog/markdown.mdx'
import { Counter } from '../islands/counter'

export const title = 'Home'

function lite(h: (c: Context) => MaybePromise<Response | VNode>) {
  return h
}

// export const GET = (c: Context) => null

export default lite(async (c) => {
  const name = c.req.query.get('name') || 'world'
  c.header('x-what', 'secret')

  return (
    <>
      <div class="flex space-x-4">
        <Counter count={0} />
        <Counter count={1} />
      </div>
      <h1>Home Page</h1>
      <Markdown />
    </>
  )
})
