import { test, expect } from 'bun:test'
import { Router } from './router'

test('router', async () => {
  const app = new Router()
    .get('/', (c) => {
      return c.text('Hello, World!')
    })
    .get('/about', (c) => {
      return c.text('About page')
    })

  const req = new Request('https://example.com')
  const res = await app.fetch(req)

  expect(res.status).toBe(200)
  expect(await res.text()).toBe('Hello, World!')

  const res2 = await app.request('/api/about', {
    headers: { 'x-foo': 'bar' },
  })

  expect(res2.status).toBe(404)

  const res3 = await app.request(new Request('https://example.com/about'))
  expect(res3.status).toBe(200)
})
