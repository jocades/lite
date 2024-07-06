import type { Context } from 'lite/context'
import { Counter } from '../islands/counter'

export const title = 'Home'

export default async (c: Context) => {
  console.log('GET /')
  return <Counter count={0} />
  // return c.render(<Counter count={0} />)
}
