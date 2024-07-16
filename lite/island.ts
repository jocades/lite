import { h, hydrate, type FunctionalComponent as FC } from 'preact'
import type { AnyObject } from './types'

// This module will be sent to the client.

let componentId = 0

// for dev
export const islands = new Map<number, FC<any>>()

export function island<P extends AnyObject>(Component: FC<P>) {
  const id = componentId++
  islands.set(id, Component)

  /* if (typeof window !== 'undefined') {
    document
      .querySelectorAll(`[data-island="${id}"]:not([data-hydrated])`)
      .forEach(($island) => {
        console.log('Hydrating', id, Component.defaultProps)
        $island.setAttribute('data-hydrated', '')

        const $script = $island.querySelector('[type="application/json"]')
        const props = JSON.parse($script?.textContent || '{}')
        $script?.remove()

        hydrate(h(Component, props), $island)
      })

    return null as unknown as FC<P>
  } */

  return (props: P) => {
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
