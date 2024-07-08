import { h, hydrate, type FunctionalComponent as FC } from 'preact'
import type { AnyObject } from './types'

// This module will be sent to the client.

let componentId = 0

const islands = new Map<number, FC<any>>()

export function island<P extends AnyObject>(Component: FC<P>) {
  const id = componentId++
  islands.set(id, Component)

  if (typeof window !== 'undefined') {
    console.log('hydrating component', id)

    document
      .querySelectorAll(`[data-island="${id}"]:not([data-hydrated])`)
      .forEach(($island) => {
        console.log('query')
        $island.setAttribute('data-hydrated', '')

        const data = $island.querySelector(
          '[type="application/json"]',
        )?.textContent

        const props = JSON.parse(data || '{}')
        console.log('props', props)

        hydrate(h(Component, props), $island)

        console.log('Hydrating island:', id)

        return null as unknown as FC<P>
      })
  }

  return (props: P) => {
    console.log('executing component')

    return h(
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
