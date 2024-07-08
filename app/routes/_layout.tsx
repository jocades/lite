import { html } from 'htm/preact'
import type { FC } from 'preact/compat'

const Script = () => html`
  <script type="module">
    const ws = new WebSocket('ws://localhost:8000/ws')

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data)
      if (msg?.type === 'reload') {
        location.reload()
      }
    }
  </script>
`

function layout(Component: FC<RenderProps>) {
  return Component
}

export default layout(({ children, title }) => {
  return (
    <html>
      <head>
        <title>{title}</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        {children}
        <script src="/pub/client.js"></script>
        <Script />
      </body>
    </html>
  )
})
