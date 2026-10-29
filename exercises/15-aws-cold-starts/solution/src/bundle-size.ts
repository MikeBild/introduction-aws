// Baut ein Lambda-Bundle wie NodejsFunction und misst die Größe.
//   node src/bundle-size.ts
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

export const bundleSize = async (entry: string, { minify = false, external = [] as string[] } = {}) => {
  const result = await build({
    entryPoints: [entry],
    bundle: true,
    platform: 'node',
    target: 'node24',
    format: 'esm',
    minify,
    external,
    write: false,
    logLevel: 'silent',
  })
  return result.outputFiles.reduce((sum, file) => sum + file.contents.byteLength, 0)
}

if (import.meta.main) {
  const src = (file: string) => fileURLToPath(new URL(file, import.meta.url))
  const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`
  console.table({
    heavy: kb(await bundleSize(src('./heavy.ts'))),
    lean: kb(await bundleSize(src('./lean.ts'), { minify: true, external: ['@aws-sdk/*'] })),
  })
}
