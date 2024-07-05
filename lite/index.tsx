import { html } from 'htm/preact/index.js'
import { render } from 'preact-render-to-string'
import { type FunctionalComponent as FC } from 'preact'
import { Counter } from '../app/islands/counter'
import { Context } from './context'

const Script = () => html`
  <script type="module">
    console.log('Loaded')
  </script>
`

const App: FC<{ title?: string }> = (props) => (
  <html>
    <head>
      <title>{props.title}</title>
      {/* <script src="https://cdn.tailwindcss.com"></script> */}
    </head>
    <body>
      {props.children}
      <script type="module" src="/client.js"></script>
    </body>
  </html>
)

async function toSSG(Component: FC) {
  const content = render(<Component />)
  await Bun.write('pub/index.html', content)
}

// await toSSG(App)

const server = Bun.serve({
  port: 8000,
  fetch: async (req) => {
    const c = new Context(req)

    c.setRenderer(<App />)

    if (c.req.path === '/') {
      return c.render(<Counter count={0} />, { title: 'Home' })
    }

    if (c.req.path === '/client.js') {
      return c.file('pub/client.js')
    }

    return c.notFound()
  },
})

console.log(`🔥Listening at ${trimTrailingSlash(server.url.href)}`)

function trimTrailingSlash(url: string) {
  return url.replace(/\/$/, '')
}
