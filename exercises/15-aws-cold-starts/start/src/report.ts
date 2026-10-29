export type Report = {
  durationMs: number
  billedDurationMs: number
  memorySizeMb: number
  maxMemoryUsedMb: number
  initDurationMs?: number
}

// TODO: Zahlen aus einer REPORT-Zeile lesen. Init Duration gibt es nur bei Cold Starts.
export const parseReport = (_line: string): Report | undefined => undefined

// TODO: Aufrufe und Cold Starts zählen, Init Duration und Duration mitteln.
export const summarize = (lines: string[]) => {
  const reports = lines.map(parseReport).filter((r): r is Report => r !== undefined)
  return { invocations: reports.length, coldStarts: 0, avgInitDurationMs: 0, avgDurationMs: 0 }
}
