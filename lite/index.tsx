import { html } from 'htm/preact'
import { render } from 'preact-render-to-string'
import { type FunctionalComponent as FC } from 'preact'
import { Counter } from '../app/islands/counter'
import { Context } from './context'
import { Router } from './router'

const Script = () => html`
  <script type="module" src="/pub/client.js"></script>
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
      <Script />
    </body>
  </html>
)

async function toSSG(Component: FC) {
  const content = render(<Component />)
  await Bun.write('pub/index.html', content)
}

const app = new Router()

app.get('/', (c) => {
  c.setRenderer(<App />)
  return c.render(<Counter count={0} />, { title: 'Home' })
})

app.get('/client', (c) => {
  return c.html(<Counter count={0} />)
})

app.get('/pub/client.js', (c) => {
  return c.file('pub/client.js')
})

// await toSSG(App)

const server = Bun.serve({
  port: 8000,
  fetch: async (req) => {
    const url = new URL(req.url)

    const match = app.lookup(url.pathname, req.method)

    if (!match?.data) {
      return new Response('404 Not found', { status: 404 })
    }

    const c = new Context(req, url, match.params)

    return match.data.handler(c, () => void 0)
  },
})

console.log(`🔥Listening at ${trimTrailingSlash(server.url.href)}`)

function trimTrailingSlash(url: string) {
  return url.replace(/\/$/, '')
}
