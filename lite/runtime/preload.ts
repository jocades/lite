import { plugin } from 'bun'
import { mdx } from './mdx-plugin'
import { lite } from './lite-plugin'

plugin(mdx())
plugin(lite())
