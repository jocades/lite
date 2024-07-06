import { html } from 'htm/preact'
import type { AnyObject } from 'lite/types'
import type { FC } from 'preact/compat'

const Script = () => html`
  <script type="module">
    const ws = new WebSocket('ws://localhost:8000/ws')
    ws.onopen = () => {
      console.log('Connected to server')
      ws.send('Hello from client')
    }
    ws.onmessage = (e) => {
      if (e.data === 'reload') {
        location.reload()
      }
    }
  </script>
`

function layout(Component: FC<{ title: string }>) {
  return Component
}

export default layout(({ children, title }) => {
  return (
    <html>
      <head>
        <title>{title}</title>
        {/* <script src="https://cdn.tailwindcss.com"></script> */}
      </head>
      <body>
        {children}
        <script type="module" src="/pub/client.js"></script>
        <Script />
      </body>
    </html>
  )
})
