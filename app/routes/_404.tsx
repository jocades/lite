import type { Context } from 'lite/context'

export default (c: Context) => {
  console.log('NOT_FOUND /_404.tsx')
  return c.render(<h1>Sorry, Not Found...</h1>)
}
