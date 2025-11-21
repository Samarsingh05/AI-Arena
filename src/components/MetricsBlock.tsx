type Props = {
  responseTimeMs: number
  startTime?: number
  endTime?: number
  tokensIn: number
  tokensOut: number
  cost: number
  leftPercent: number
  fastest: boolean
  cheapest: boolean
}

export function MetricsBlock({
  responseTimeMs,
  startTime,
  endTime,
  tokensIn,
  tokensOut,
  cost,
  leftPercent,
  fastest,
  cheapest
}: Props) {
  const seconds = responseTimeMs / 1000
  
  const formatTime = (timestamp?: number) => {
    if (!timestamp) return "—"
    return new Date(timestamp).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 2
    })
  }

  return (
    <div className="mb-4 border border-green-500/20 rounded-xl p-5 bg-gradient-to-br from-black/40 to-zinc-900/20 grid grid-cols-2 md:grid-cols-4 gap-5 shadow-lg">
      <div className="flex flex-col gap-2">
        <div className="text-sm text-green-400 uppercase tracking-wider font-semibold">Response Time</div>
        <div className="font-mono text-xl font-bold text-green-300">{seconds.toFixed(2)}s</div>
        {startTime && endTime && (
          <div className="text-xs text-zinc-500 space-y-0.5">
            <div>Start: {formatTime(startTime)}</div>
            <div>End: {formatTime(endTime)}</div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-sm text-green-400 uppercase tracking-wider font-semibold">Tokens</div>
        <div className="font-mono text-xl font-bold text-green-300">
          {tokensIn + tokensOut} total
        </div>
        <div className="text-xs text-zinc-500">
          {tokensIn} in · {tokensOut} out
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-sm text-green-400 uppercase tracking-wider font-semibold">Cost</div>
        <div className="font-mono text-xl font-bold text-green-300">${cost.toFixed(4)}</div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-sm text-green-400 uppercase tracking-wider font-semibold">Quota Left</div>
        <div className="font-mono text-xl font-bold text-green-300">{leftPercent.toFixed(1)}%</div>
      </div>
    </div>
  )
}
