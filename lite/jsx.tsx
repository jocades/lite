import { h, render, type FunctionComponent, type VNode } from 'preact'

const plane = <div>hello</div>
// console.log('PLANE', plane)

const Comp = () => {
  console.log('executing')
  return <div>hello</div>
}

console.log('COMP', <Comp />)
// console.log('COMP-h', h(Comp, {}))

// const help = h('div', null, 'hello')
// console.log('HELP', help)

let renderer!: FunctionComponent

function setRenderer(Component: (props) => VNode) {
  console.log('COMPONENT', Component)
  renderer = Component
}

// setRenderer((props) => <html>{props.children}</html>)

// const out = h(renderer)

// console.log('OUT', out)
