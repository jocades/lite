import { h, hydrate, type FunctionalComponent as FC } from 'preact'
import type { AnyObject } from './types'

// This module will be sent to the client.

let componentId = 0

// for dev
const islands = new Map<number, FC<any>>()

export function island<P extends AnyObject>(Component: FC<P>) {
  const id = componentId++
  islands.set(id, Component)

  if (typeof window !== 'undefined') {
    document
      .querySelectorAll(`[__island="${id}"]:not([hydrated])`)
      .forEach(($island) => {
        $island.setAttribute('hydrated', '')
        $island.removeAttribute('__island')

        const $script = $island.querySelector('[type="application/json"]')
        const props = JSON.parse($script?.textContent || '{}')
        $script?.remove()

        hydrate(h(Component, props), $island)
      })

    return null as unknown as FC<P>
  }

  return (props: P) => {
    return h(
      'div',
      { __island: id },
      h('script', {
        type: 'application/json',
        dangerouslySetInnerHTML: { __html: JSON.stringify(props) },
      }),
      h(Component, props),
    )
  }
}
