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

  // const res2 = await app.request('/api/about', {
  //   headers: { 'x-foo': 'bar' },
  // })

  // expect(res2.status).toBe(404)
  //
  const res3 = await app.request(new Request('https://example.com/about'))
  expect(res3.status).toBe(200)
})

test('sub', async () => {
  const app1 = new Router()
  app1.get('/', (c) => c.send())
  const app2 = new Router()
  app2.get('/me', (c) => c.send())
  // app1.route('/about', app2)

  const res = await app1.request('/')

  console.log(res)

  expect(res.status).toBe(200)
})
