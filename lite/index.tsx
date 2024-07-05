import { html } from 'htm/preact'
import { render } from 'preact-render-to-string'
import { type FunctionalComponent as FC } from 'preact'
import { Router } from './router'
import { Context } from './context'
import { trimTrailingSlash } from './util'

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

const fsRouter = new Bun.FileSystemRouter({
  style: 'nextjs',
  dir: 'app/routes',
  fileExtensions: ['.tsx', '.jsx'],
})

namespace Mod {
  export interface Route {
    title?: string
    default: (c: Context) => ReturnType<Context['render']> | Router
    GET?: (c: Context) => ReturnType<Context['render']>
    POST?: (c: Context) => ReturnType<Context['render']>
    PUT?: (c: Context) => ReturnType<Context['render']>
    DELETE?: (c: Context) => ReturnType<Context['render']>
  }
}

const server = Bun.serve({
  port: 8000,
  fetch: async (req) => {
    const c = new Context(req)

    const match = fsRouter.match(c.req)
    if (!match) return c.notFound()

    c.req.params = match.params

    const mod = await import('file://' + match.filePath)

    if (mod.default instanceof Router) {
      return mod.default.request(c)
    }

    const handler = mod[req.method] ?? mod.default
    if (!handler) return c.text('Method not allowed', 405)
    return handler(c)
  },
})

console.log(`🔥Listening at ${trimTrailingSlash(server.url.href)}`)
