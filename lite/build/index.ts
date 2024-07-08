import { mdx } from 'lite/runtime/mdx-plugin'

export async function buildClient() {
  const result = await Bun.build({
    entrypoints: ['./app/client.ts'],
    outdir: './pub',
    plugins: [mdx()],
  })

  if (!result.success) {
    throw new AggregateError(result.logs, 'Build failed')
  }

  for (const output of result.outputs) {
    console.log(output.path, '-', (output.size / 1024).toFixed(2), 'KB')
  }
}

if (import.meta.main) {
  await buildClient()
}
