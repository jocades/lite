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
