import type { Context } from 'lite/context'
import { Router } from 'lite/router'

// export default (c: Context) => {
//   console.log('GET /')
//   return c.render(<div>Hello, World!</div>)
// }

const app = new Router()

app.get('/', (c) => {
  console.log('GET /')
  return c.render(<div>Hello, World!</div>)
})

app.post('/', (c) => {
  console.log('POST /')
  return c.text('Hello, World!')
})

export default app
