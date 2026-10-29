export type Report = {
  durationMs: number
  billedDurationMs: number
  memorySizeMb: number
  maxMemoryUsedMb: number
  initDurationMs?: number
}

const number = (line: string, label: string) => {
  const match = line.match(new RegExp(`${label}:\\s*([\\d.]+)`))
  return match ? Number(match[1]) : undefined
}

// Liest eine REPORT-Zeile aus CloudWatch Logs. Init Duration steht nur bei Cold Starts drin.
export const parseReport = (line: string): Report | undefined => {
  if (!line.includes('REPORT RequestId')) return undefined
  return {
    durationMs: number(line, 'Duration') ?? 0,
    billedDurationMs: number(line, 'Billed Duration') ?? 0,
    memorySizeMb: number(line, 'Memory Size') ?? 0,
    maxMemoryUsedMb: number(line, 'Max Memory Used') ?? 0,
    initDurationMs: number(line, 'Init Duration'),
  }
}

const average = (values: number[]) =>
  values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100 : 0

export const summarize = (lines: string[]) => {
  const reports = lines.map(parseReport).filter((r): r is Report => r !== undefined)
  const cold = reports.filter((r) => r.initDurationMs !== undefined)
  return {
    invocations: reports.length,
    coldStarts: cold.length,
    avgInitDurationMs: average(cold.map((r) => r.initDurationMs!)),
    avgDurationMs: average(reports.map((r) => r.durationMs)),
  }
}
