import type { Context } from 'lite/context'

export default (c: Context) => {
  c.status(404)
  // return c.render(<h1>Sorry, Not Found...</h1>)
  return c.notFound()
}
