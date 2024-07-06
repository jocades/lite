import { mdx } from 'lite/runtime/mdx-plugin'

export async function buildClient() {
  const result = await Bun.build({
    entrypoints: ['./lite/build/example.mdx'],
    outdir: './static',
    plugins: [mdx()],
  })

  if (!result.success) {
    throw new AggregateError(result.logs, 'Build failed')
  }

  for (const output of result.outputs) {
    console.log(output.path, '-', (output.size / 1024).toFixed(2), 'KB')
  }
}

const transpiler = new Bun.Transpiler({ loader: 'tsx' })

// const imports = transpiler.scan(
//   await Bun.file('app/client.ts').arrayBuffer(),
// )
// console.log(imports)
