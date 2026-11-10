export type Report = {
  durationMs: number
  billedDurationMs: number
  memorySizeMb: number
  maxMemoryUsedMb: number
  initDurationMs?: number
}

// TODO: Read the numbers from a REPORT line. Init Duration only exists for cold starts.
export const parseReport = (_line: string): Report | undefined => undefined

// TODO: Count invocations and cold starts, average Init Duration and Duration.
export const summarize = (lines: string[]) => {
  const reports = lines.map(parseReport).filter((r): r is Report => r !== undefined)
  return { invocations: reports.length, coldStarts: 0, avgInitDurationMs: 0, avgDurationMs: 0 }
}
