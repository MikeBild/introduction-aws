import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { bundleSize } from '../src/bundle-size.ts'

const src = (file: string) => fileURLToPath(new URL(`../src/${file}`, import.meta.url))

describe('Bundle-Größe', () => {
  it('das schlanke Bundle ist mindestens zehnmal kleiner', async () => {
    const heavy = await bundleSize(src('heavy.ts'))
    const lean = await bundleSize(src('lean.ts'), { minify: true, external: ['@aws-sdk/*'] })
    expect(lean * 10).toBeLessThan(heavy)
  })
})
