import { html } from 'htm/preact'
import type { FunctionComponent as FC } from 'preact'
import type { HTMLAttributes } from 'preact/compat'

const Script = () => html`
  <script type="module">
    import mod from '/pub/what.js'

    mod.test()

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

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

interface LinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string // make it required
}

const Link: FC<LinkProps> = ({ children, href, ...props }) => {
  return (
    <a href={href} {...props} data-prefetch>
      {children}
    </a>
  )
}

const links = [
  { href: '/', text: 'Home' },
  { href: '/about', text: 'About' },
  { href: '/other', text: 'Other' },
  { href: '/throw', text: 'Error' },
]

export default layout(({ children, title, path }) => {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <meta
          name="description"
          content="A simple example of using Lite with Preact."
        />
        <meta name="author" content="Jordi Calafat" />
        <link rel="icon" type="image/png" href="/pub/icon.png" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script defer type="module" src="/pub/client.js"></script>
        <Script />
      </head>
      <body class="flex flex-col bg-blue-200 ">
        <header class="sticky top-0 z-10 p-4 shadow bg-green-200">
          <div class="flex space-x-2 items-center">
            <img
              src="/pub/palm-tree.png"
              class="size-8 rotate-[20deg] cursor-pointer hover:rotate-0 transition-transform duration-200 ease"
            />
            {links.map((link, i) => (
              <>
                <Link
                  href={link.href}
                  class={cn(
                    'font-semibold tracking-tight hover:underline',
                    link.href === path && 'text-blue-400 underline',
                  )}
                >
                  {link.text}
                </Link>
                {i < links.length - 1 && <span> | </span>}
              </>
            ))}
          </div>
        </header>

        <main class="flex flex-col container max-w-4xl self-center py-4 gap-y-4 bg-red-200">
          {children}
        </main>
      </body>
    </html>
  )
})
