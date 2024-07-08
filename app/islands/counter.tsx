import { useState } from 'preact/hooks'
import { island } from 'lite/island'

interface CounterProps {
  count: number
}

export const Counter = island<CounterProps>((props) => {
  const [count, setCount] = useState(props.count)

  return (
    <section>
      <h1>I am an Island</h1>
      <button class="btn" onClick={() => setCount(count + 1)}>
        {count}
      </button>
    </section>
  )
})
