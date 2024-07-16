import { Router } from 'lite/trie/router'

const app = new Router()

app.get('/', (c) => {
  return c.render(<h1>Books Page</h1>)
  return c.json({
    incomingPath: c.req.path,
    request: c.req,
    currentPath: '/books',
  })
})

app.post('/', async (c) => {
  const body = await c.req.json()
  return c.json(body)
})

export default app
