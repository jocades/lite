import { type BunPlugin } from 'bun'
import { default as mdxPlugin } from '@mdx-js/esbuild'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'

export function mdx() {
  return mdxPlugin({
    jsxImportSource: 'preact',
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
  }) as unknown as BunPlugin
}
