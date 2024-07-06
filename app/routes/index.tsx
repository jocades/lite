import type { Context } from 'lite/context'
import { Router } from 'lite/router'
import { Counter } from '../islands/counter'

const Component = () => <div>Hello World</div>

export const title = 'Hello'

export default async (c: Context) => {
  console.log('GET /')
  return c.render(<Counter count={0} />)
}

/* const app = new Router()

app.get('/', (c) => {
  console.log('GET /')
  return c.render(<div>Hello, World!</div>)
})

app.post('/', (c) => {
  console.log('POST /')
  return c.text('Hello, World!')
})

export default app */
