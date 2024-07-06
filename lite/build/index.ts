import mdx from '@mdx-js/esbuild'

const result = await Bun.build({
  entrypoints: ['./lite/build/example.mdx'],
  outdir: './lite/build',
  plugins: [mdx({ jsxImportSource: 'preact' })],
})

if (!result.success) {
  throw new AggregateError(result.logs, 'Build failed')
}

// plugin(mdx({ jsxImportSource: 'preact' }))
