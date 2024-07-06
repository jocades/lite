import { type BunPlugin } from 'bun'
import { default as mdxPlugin } from '@mdx-js/esbuild'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

export function mdx() {
  console.log('loading mdx plugin')

  return mdxPlugin({
    jsxImportSource: 'preact',
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
  }) as unknown as BunPlugin
}
