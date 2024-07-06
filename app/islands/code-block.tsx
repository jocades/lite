import { island } from 'lite/island'
import Markdown from './markdown.mdx'
import { useState } from 'preact/hooks'

export const CodeBlock = island((props) => {
  const [show, setShow] = useState(false)

  return (
    <div onClick={() => setShow((prev) => !prev)}>{show && <Markdown />}</div>
  )
})
