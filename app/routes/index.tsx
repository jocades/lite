import type { Context } from 'lite/context'
import { Counter } from '../islands/counter'
import type { VNode } from 'preact'
import type { MaybePromise } from 'lite/types'
import Markdown from '../islands/markdown.mdx'
import type { FC } from 'preact/compat'

export const title = 'Home'

function lite(h: (c: Context) => MaybePromise<Response | VNode>) {
  return h
}

// export const GET = (c: Context) => null

const Link: FC<{ href: string }> = ({ href, children }) => {
  return (
    <a data-prefetch href={href}>
      {children}
    </a>
  )
}

export default lite(async (c) => {
  const name = c.req.query.get('name') || 'world'
  return (
    <main class="relative flex flex-col min-h-screen items-center justify-center">
      <h1>Hello, {name}!</h1>
      <Counter count={0} />
      <Counter count={1} />

      <Link href="/about">Home</Link>
    </main>
  )
})
