import { Router } from './trie/router'
import { h, type FunctionComponent as FC } from 'preact'
import type { Handler } from './trie/router'
import { Counter } from '../app/islands/counter'
import type { RendererProps } from './context'
import { render } from 'preact-render-to-string'

declare global {
  interface RenderProps {
    title: string
    path: string
  }
}

function layout(Component: FC<RendererProps>): Handler {
  return async (c, next) => {
    c.setRenderer(Component)
    await next()
  }
}

// const App = () => {
//   return h(First, null, h(Second, null, h(Content, null)))
// }

// how to accomplish the above programatically?

const app = new Router()
  /* .use(async (c, next) => {
    c.setRenderer((props) => {
      return (
        <html>
          <head>
            <title>{props.title}</title>
          </head>
          <body>
            <header>Header</header>
            {props.children}
            <footer>Footer</footer>
          </body>
        </html>
      )
    })

    await next()
  }) */
  .use(
    layout((props) => {
      return (
        <html>
          <head>
            <title>{props.title}</title>
          </head>
          <body>
            <header>Header</header>
            {props.children}
            <Counter count={0} />
            <footer>Footer</footer>
          </body>
        </html>
      )
    }),
  )

  .get(
    '/',
    layout(({ children }) => {
      return <div class="wrapper">{children}</div>
    }),
    (c) => {
      return c.render(<h1>Hello, World!</h1>, { title: 'Home' })
    },
  )

export default app
