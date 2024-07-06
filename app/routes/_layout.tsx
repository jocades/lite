import type { Context } from 'lite/context'
import { html } from 'htm/preact'
import type { AnyObject } from 'lite/types'

const Script = () => html`
  <script type="module" src="/pub/client.js"></script>
  <script type="module">
    console.log('Loaded')
  </script>
`

export default ({ children, title }: AnyObject) => {
  return (
    <html>
      <head>
        <title>{title}</title>
        {/* <script src="https://cdn.tailwindcss.com"></script> */}
      </head>
      <body>
        {children}
        <Script />
      </body>
    </html>
  )
}
