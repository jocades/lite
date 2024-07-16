import type { Handler } from 'lite/trie/router'

const fsRouter = new Bun.FileSystemRouter({
  style: 'nextjs',
  dir: 'app/routes',
  fileExtensions: ['.tsx', '.jsx', '.ts', '.js', '.mjs'],
})

console.log(fsRouter.routes)

// sort routes by path length

const routes = Object.fromEntries(
  Object.entries(fsRouter.routes).sort(([a], [b]) => a.length - b.length),
)

console.log(routes)

export async function createApp() {
  let notFound: Handler | undefined
  let onError: Handler | undefined
  let layouts = []

  for (const route in fsRouter.routes) {
    if (route === '/_404') {
      const mod = await import(fsRouter.routes[route])
      notFound = mod.default
    }

    if (route === '/_error') {
      const mod = await import(fsRouter.routes[route])
      onError = mod.default
    }

    if (route.includes('_layout')) {
      const mod = await import(fsRouter.routes[route])
      layouts.push(mod.default)
    }
  }

  console.log(onError, notFound, layouts)

  // const c = new Context(new Request('http://localhost'))

  // const notFoundRes = notFound?.(c, () => void 0)
  // const errorRes = onError?.(c, () => void 0)

  // console.log(notFoundRes, errorRes)
}
