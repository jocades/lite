import { Router } from 'lite/trie/router'

const app = new Router()

app.get('/router', (c) => {
  return c.json(c.req.headers)
})

app.post('/router', async (c) => {
  const body = await c.req.json()
  return c.json(body)
})

export default app
