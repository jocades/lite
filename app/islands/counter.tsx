import { useState } from 'preact/hooks'
import { island } from './_island'

interface CounterProps {
  count: number
}

export const Counter = island<CounterProps>((props) => {
  const [count, setCount] = useState(props.count ?? 0)

  return <button onClick={() => setCount(count + 1)}>{count}</button>
})
