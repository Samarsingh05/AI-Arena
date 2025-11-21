"use client"

import { useState } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from "recharts"

type Point = {
  timestamp: string
  leftPercent: number
  tokens: number
}

type Props = {
  data: Point[]
}

export function QuotaChart({ data }: Props) {
  const [isHovered, setIsHovered] = useState(false)

  const now = new Date().toISOString()
  let chartData: Point[]

  if (data.length === 0) {
    chartData = [
      { timestamp: new Date(Date.now() - 86400000).toISOString(), leftPercent: 100, tokens: 0 },
      { timestamp: now, leftPercent: 100, tokens: 0 }
    ]
  } else {
    const firstPoint = data[0]
    const startTime = new Date(new Date(firstPoint.timestamp).getTime() - 3600000).toISOString()
    chartData = [
      { timestamp: startTime, leftPercent: 100, tokens: 0 },
      ...data
    ]
  }

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem)
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <div className="w-full h-64 bg-gradient-to-br from-black/40 to-zinc-900/30 rounded-xl p-5 border-2 border-green-500/30 shadow-xl">
      <div className="text-base text-green-300 mb-4 font-bold">Quota Usage Over Time</div>

      <div className="w-full" style={{ height: "220px", minHeight: "220px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 15, left: 5, bottom: 30 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                <stop offset="100%" stopColor="#16a34a" stopOpacity={1} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              tick={{ fill: "#22c55e", fontSize: 12, fontWeight: 700 }}
              axisLine={{ stroke: "#22c55e", strokeWidth: 2 }}
              tickLine={{ stroke: "#22c55e", strokeWidth: 1 }}
              label={{
                value: "Time",
                position: "insideBottom",
                offset: -8,
                fill: "#22c55e",
                fontSize: 13,
                fontWeight: 700
              }}
              interval="preserveStartEnd"
            />

            <YAxis
              domain={[0, 100]}
              tickFormatter={v => `${v}%`}
              tick={{ fill: "#22c55e", fontSize: 12, fontWeight: 700 }}
              axisLine={{ stroke: "#22c55e", strokeWidth: 2 }}
              tickLine={{ stroke: "#22c55e", strokeWidth: 1 }}
              label={{
                value: "Quota Left (%)",
                angle: -90,
                position: "insideLeft",
                fill: "#22c55e",
                fontSize: 13,
                fontWeight: 700,
                style: { textAnchor: "middle" }
              }}
              width={60}
            />

            <CartesianGrid
              stroke="#22c55e"
              strokeDasharray="3 3"
              strokeOpacity={0.3}
              vertical={false}
            />

            <ReferenceLine
              y={100}
              stroke="#22c55e"
              strokeDasharray="4 4"
              strokeOpacity={0.5}
              strokeWidth={2}
              label={{ value: "100%", position: "right", fill: "#22c55e", fontSize: 11, fontWeight: 700 }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0b0c10",
                border: "2px solid #22c55e",
                borderRadius: "8px",
                color: "#e5e7eb",
                padding: "10px 14px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
              }}
              cursor={{
                stroke: "#22c55e",
                strokeWidth: 2,
                strokeDasharray: "5 5",
                strokeOpacity: 0.8
              }}
              formatter={(value: any, _name, props: any) => {
                const v = value as number
                return [`${v.toFixed(1)}%`, `Tokens: ${props.payload.tokens.toLocaleString()}`]
              }}
              labelFormatter={label => {
                const date = new Date(label)
                return date.toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit"
                })
              }}
            />

            <Line
              type="monotone"
              dataKey="leftPercent"
              stroke={isHovered ? "url(#lineGradient)" : "transparent"}
              strokeWidth={3}
              dot={{
                fill: "#22c55e",
                r: 5,
                strokeWidth: 2,
                stroke: "#0b0c10",
                opacity: 1
              }}
              activeDot={{
                r: 7,
                fill: "#22c55e",
                stroke: "#0b0c10",
                strokeWidth: 3
              }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
