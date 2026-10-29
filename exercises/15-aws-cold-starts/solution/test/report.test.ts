import { describe, expect, it } from 'vitest'
import { parseReport, summarize } from '../src/report.ts'

const cold = 'REPORT RequestId: 3f1c  Duration: 41.20 ms  Billed Duration: 354 ms  Memory Size: 1024 MB  Max Memory Used: 98 MB  Init Duration: 312.45 ms'
const warm = 'REPORT RequestId: 9a2b  Duration: 8.80 ms  Billed Duration: 9 ms  Memory Size: 1024 MB  Max Memory Used: 99 MB'

describe('parseReport', () => {
  it('liest die Init Duration eines Cold Starts', () => {
    expect(parseReport(cold)).toEqual({
      durationMs: 41.2, billedDurationMs: 354, memorySizeMb: 1024, maxMemoryUsedMb: 98, initDurationMs: 312.45,
    })
  })

  it('erkennt warme Aufrufe an der fehlenden Init Duration', () => {
    expect(parseReport(warm)?.initDurationMs).toBeUndefined()
  })

  it('ignoriert andere Log-Zeilen', () => {
    expect(parseReport('START RequestId: 3f1c Version: $LATEST')).toBeUndefined()
  })
})

describe('summarize', () => {
  it('zählt Cold Starts und mittelt die Init Duration', () => {
    expect(summarize([cold, warm, warm, 'irgendwas'])).toEqual({
      invocations: 3, coldStarts: 1, avgInitDurationMs: 312.45, avgDurationMs: 19.6,
    })
  })
})
