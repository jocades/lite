import { h, hydrate, type FunctionalComponent as FC } from 'preact'

let currentId = 0

export function island<P extends Record<string, any>>(Component: FC<P>) {
  const id = currentId++

  if (typeof window !== 'undefined') {
    const $island = document.querySelector(`[data-island="${id}"]`)!
    const data = JSON.parse(
      $island.querySelector('[type="application/json"]')?.textContent || '{}',
    )

    console.log('Island:')
    console.log($island)
    console.log(data)

    return hydrate(h(Component, data), $island) as unknown as FC<P>
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
