import {
  h,
  type FunctionalComponent as FC,
  type AnyComponent,
  type Attributes,
} from 'preact'
import { render } from 'preact-render-to-string'
import { renderToReadableStream } from 'preact-render-to-string/stream'
import { useState } from 'preact/hooks'

import {
  createRouter,
  addRoute,
  findRoute,
  removeRoute,
  matchAllRoutes,
} from 'rou3'
import { html } from 'htm/preact/index.js'
import { Counter } from '../app/islands/counter'

const router = createRouter<{ payload: string }>()

addRoute(router, '/path', 'GET', { payload: 'this path' })
addRoute(router, '/path/:name', 'GET', { payload: 'named route' })
addRoute(router, '/path/foo/**', 'GET', { payload: 'wildcard route' })
addRoute(router, '/path/foo/**:name', 'GET', {
  payload: 'named wildcard route',
})

// Returns { payload: 'this path' }
findRoute(router, '/path/h', 'GET')

// Returns { payload: 'named route', params: { name: 'fooval' } }
findRoute(router, '/path/fooval', 'GET')

// Returns { payload: 'wildcard route' }
findRoute(router, '/path/foo/bar/baz', 'GET')

// Returns undefined (no route matched for/)
findRoute(router, '/', 'GET')

const Script = () => html`
  <script type="module">
    console.log('Loaded')
  </script>
`

console.log(render(<Script />))
// console.log(<Counter />)

const App: FC<{ title?: string }> = (props) => (
  <html>
    <head>
      <title>{props.title}</title>
    </head>

    <body>
      <h1>Hello World</h1>
      <Counter count={10} />
      <Script />
      <script type="module" src="/client.js"></script>
    </body>
  </html>
)

const server = Bun.serve({
  port: 8000,
  async fetch(req) {
    const url = new URL(req.url)
    // console.log(url)

    if (url.pathname === '/client.js') {
      // When passing a BunFile instance to the response body it will automatically
      // set the correct 'content-type' based on the file type.

      const file = Bun.file('app/client.js')
      return new Response(file)
    }

    return new Response(render(<App title="WTF" />), {
      headers: { 'content-type': 'text/html' },
    })
  },
})

console.log(`🔥Listening at ${trimTrailingSlash(server.url.href)}`)

function trimTrailingSlash(url: string) {
  return url.replace(/\/$/, '')
}
