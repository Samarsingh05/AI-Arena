// src/components/ModelCard.tsx

"use client"

import { useState } from "react"
import { ProviderMeta } from "@/lib/providers"
import { MetricsBlock } from "./MetricsBlock"
import { QuotaChart } from "./QuotaChart"

type QuotaPoint = {
  timestamp: string
  leftPercent: number
  tokens: number
}

type Props = {
  meta: ProviderMeta
  modelName?: string
  responseText: string
  loading: boolean
  error?: string
  metrics?: {
    responseTimeMs: number
    startTime?: number
    endTime?: number
    tokensIn: number
    tokensOut: number
    cost: number
    leftPercent: number
  }
  quotaHistory: QuotaPoint[]
  fastest: boolean
  cheapest: boolean
}

function explainError(error?: string | null): string | null {
  if (!error) return null
  
  // Extract error code if present
  const match = error.match(/(\d{3})/)
  const code = match ? Number(match[1]) : null

  // Remove "API error XXX -" prefix
  let plainMessage = error.replace(/^API error \d{3}\s*-\s*/i, "")
  
  // Try to extract JSON error message - handle multiple JSON formats
  try {
    // Try to find and parse JSON object
    const jsonMatch = plainMessage.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const json = JSON.parse(jsonMatch[0])
      
      // Extract message from various JSON error formats
      if (json.error?.message) {
        plainMessage = json.error.message
      } else if (json.message) {
        plainMessage = json.message
      } else if (json.error) {
        if (typeof json.error === "string") {
          plainMessage = json.error
        } else if (json.error.type && json.error.message) {
          plainMessage = json.error.message
        }
      }
    }
  } catch {
    // Not JSON or parse failed, continue with plain message
  }
  
  // Remove HTML tags if present
  plainMessage = plainMessage.replace(/<[^>]*>/g, "")
  
  // Remove backticks and code formatting
  plainMessage = plainMessage.replace(/`/g, "")
  
  // Clean up whitespace and newlines
  plainMessage = plainMessage.replace(/\s+/g, " ").trim()
  
  // Provide user-friendly messages based on error code
  if (code === 429) {
    return "Rate limit exceeded. Please wait before trying again."
  }
  if (code === 401 || code === 403) {
    return "Authentication failed. The API key may be invalid, expired, or missing billing."
  }
  if (code === 400) {
    // If we have a specific message, use it; otherwise generic
    if (plainMessage && plainMessage.length > 0 && !plainMessage.includes("{")) {
      return plainMessage
    }
    return "Bad request. The model ID may be incorrect or the input format was rejected."
  }
  if (code === 404) {
    if (plainMessage && plainMessage.length > 0 && !plainMessage.includes("{")) {
      return plainMessage
    }
    return "Model not found. This model may not exist or you may not have access to it."
  }
  if (code && code >= 500) {
    return "The provider's API is experiencing issues. Please try again later."
  }
  
  // Return cleaned plain message (without JSON) or default
  if (plainMessage && plainMessage.length > 0 && !plainMessage.includes("{") && !plainMessage.includes("}")) {
    return plainMessage
  }
  
  return "An error occurred. Please check your API key and model settings."
}

export function ModelCard({
  meta,
  modelName,
  responseText,
  loading,
  error,
  metrics,
  quotaHistory,
  fastest,
  cheapest
}: Props) {
  const errorHint = explainError(error)

  return (
    <div
      className={`bg-gradient-to-br from-arena-card to-zinc-900/30 border-2 ${meta.accentClass} rounded-2xl p-6 flex flex-col shadow-2xl shadow-green-500/10 hover:shadow-green-500/20 transition-all`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <div className="text-xl font-bold text-green-50 mb-1">{meta.label}</div>
          {modelName && (
            <div className="text-base text-green-200 font-mono mb-1">{modelName}</div>
          )}
          <div className="text-base text-green-300/80">{meta.blurb}</div>
        </div>
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 shadow-lg shadow-green-500/30 flex-shrink-0" />
      </div>

      {/* Response */}
      <div className="mb-4 relative flex-1 flex flex-col">
        <div className="text-base font-bold text-green-300 mb-3 uppercase tracking-wider">Response</div>
        <div className="relative flex-1">
          <div className="rounded-xl bg-gradient-to-br from-black/60 to-zinc-900/40 border-2 border-green-500/20 p-5 h-80 overflow-auto scrollbar-thin text-lg font-mono whitespace-pre-wrap leading-relaxed text-green-50 shadow-inner">
            {loading && !responseText && !error && (
              <div className="flex items-center gap-2 text-green-400">
                <div className="animate-pulse">●</div>
                <span>Thinking...</span>
              </div>
            )}

            {!loading && error && (
              <div className="text-red-400 font-semibold text-lg">
                {errorHint || "An error occurred"}
              </div>
            )}

            {!loading && !error && responseText && (
              <div className="animate-fade-in">
                {responseText}
              </div>
            )}

            {!loading && !error && !responseText && (
              <span className="text-zinc-500">Waiting for response...</span>
            )}
          </div>
        </div>
      </div>

      {/* Metrics */}
      {metrics && (
        <MetricsBlock
          responseTimeMs={metrics.responseTimeMs}
          startTime={metrics.startTime}
          endTime={metrics.endTime}
          tokensIn={metrics.tokensIn}
          tokensOut={metrics.tokensOut}
          cost={metrics.cost}
          leftPercent={metrics.leftPercent}
          fastest={fastest}
          cheapest={cheapest}
        />
      )}

      {/* Quota history line chart (per provider) */}
      <QuotaChart data={quotaHistory} />

      {/* Fastest/Cheapest badges */}
      {(fastest || cheapest) && (
        <div className="mt-4 pt-4 border-t border-zinc-800 flex gap-2 justify-center">
          {fastest && (
            <span className="px-4 py-2 rounded-lg text-sm bg-amber-500/20 border border-amber-400/60 text-amber-200 font-semibold">
              ⚡ Fastest Response
            </span>
          )}
          {cheapest && (
            <span className="px-4 py-2 rounded-lg text-sm bg-emerald-500/20 border border-emerald-400/60 text-emerald-200 font-semibold">
              💸 Cheapest Option
            </span>
          )}
        </div>
      )}
    </div>
  )
}
