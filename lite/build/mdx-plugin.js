import { plugin } from 'bun'
import mdx from '@mdx-js/esbuild'

console.log('loading plugin')

plugin(mdx({ jsxImportSource: 'preact' }))
