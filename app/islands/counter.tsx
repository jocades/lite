import { useState } from 'preact/hooks'
import { island } from 'lite/island'

interface CounterProps {
  count?: number
}

export const Counter = island<CounterProps>((props) => {
  const [count, setCount] = useState(props.count ?? 0)

  return (
    <button
      class="border rounded px-4 py-1 hover:bg-zinc-300 transition-colors duration-150"
      onClick={() => setCount(count + 1)}
    >
      {count}
    </button>
  )
})
