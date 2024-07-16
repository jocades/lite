import { islands } from 'lite/island'
import './islands/counter'
import './islands/chess-board'
import { h, hydrate } from 'preact'
import { onLoad } from 'lite/client/hacky-router'
import type { FC } from 'preact/compat'

declare global {
  interface Window {
    App: {
      islands: Map<number, FC>
      hydrate(): void
      mount(): void
    }
  }
}

window.App = {
  islands,
  mount() {
    onLoad()
  },
  hydrate() {
    const start = performance.now()
    for (const [id, Component] of islands) {
      document
        .querySelectorAll(`[data-island="${id}"]:not([data-hydrated])`)
        .forEach(($island) => {
          // console.log('Hydrating', id, $island)
          $island.setAttribute('data-hydrated', '')

          const $script = $island.querySelector('[type="application/json"]')
          const props = JSON.parse($script?.textContent || '{}')
          $script?.remove()

          hydrate(h(Component, props), $island)
        })
    }
    console.log('Hydrate time:', (performance.now() - start).toFixed(3), 'ms')
  },
}

window.App.mount()
