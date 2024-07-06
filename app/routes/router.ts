import { Router } from 'lite/trie/router'

const app = new Router()

app.get('/router', (c) => {
  return c.json(c.req.headers)
})

export default app
