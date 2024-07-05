import { h, hydrate, type FunctionalComponent as FC } from 'preact'

// This module will be sent to the client.

let currentId = 0

export function island<P extends Record<string, any>>(Component: FC<P>) {
  const id = currentId++

  if (typeof window !== 'undefined') {
    const $island = document.querySelector(`[data-island="${id}"]`)!
    const data = $island.querySelector('[type="application/json"]')?.textContent
    const props = JSON.parse(data || '{}')

    console.log('Island:')
    console.log($island)
    console.log(props)

    return hydrate(h(Component, props), $island) as unknown as FC<P>
  }

  return (props: P) => {
    return h(
      // @ts-ignore
      'div',
      { 'data-island': id },
      h('script', {
        type: 'application/json',
        dangerouslySetInnerHTML: { __html: JSON.stringify(props) },
      }),
      h(Component, props),
    )
  }
}
