"use client"

import { useState, useEffect } from "react"
import { ProviderId, PROVIDERS, getProviderMeta } from "@/lib/providers"
import { loadSessions, SessionHistory as SessionHistoryType } from "@/lib/sessionHistory"

type Selection = {
  provider: ProviderId
  model: string
}

type Props = {
  selectedModels: Selection[]
  toggleModelSelection: (provider: ProviderId, model: string) => void
  usableProviders: ProviderId[]
  connectedProviders: ProviderId[]
}

// Comprehensive list of all ACTUALLY AVAILABLE models (verified API model IDs)
const ALL_MODELS: Record<ProviderId, string[]> = {
  openai: [
    // GPT-3.5 Turbo (most common, works with basic API access)
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-0125",
    "gpt-3.5-turbo-1106",
    "gpt-3.5-turbo-16k",
    "gpt-3.5-turbo-0613",
    // GPT-4 (requires paid API access)
    "gpt-4",
    "gpt-4-0613",
    "gpt-4-32k",
    "gpt-4-32k-0613",
    // GPT-4 Turbo
    "gpt-4-turbo",
    "gpt-4-turbo-2024-04-09",
    "gpt-4-turbo-preview",
    "gpt-4-0125-preview",
    "gpt-4-1106-preview",
    // GPT-4o (latest, requires paid API access)
    "gpt-4o",
    "gpt-4o-2024-08-06",
    "gpt-4o-2024-05-13",
    "gpt-4o-mini",
    "gpt-4o-mini-2024-07-18"
  ],
  "openai-mini": [],
  anthropic: [
    // Claude Instant (basic tier)
    "claude-instant-1.2",
    // Claude 2 (requires paid access)
    "claude-2.0",
    "claude-2.1",
    // Claude 3 (requires paid access)
    "claude-3-haiku-20240307",
    "claude-3-sonnet-20240229",
    "claude-3-opus-20240229",
    // Claude 3.5 (latest, requires paid access)
    "claude-3-5-haiku-20241022",
    "claude-3-5-sonnet-20241022",
    "claude-3-5-sonnet-20240620"
  ],
  gemini: [
    // Gemini 1.0 Pro
    "gemini-pro",
    "gemini-pro-vision",
    "gemini-1.0-pro",
    "gemini-1.0-pro-latest",
    // Gemini 1.5
    "gemini-1.5-pro",
    "gemini-1.5-pro-latest",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    // Gemini 2.0
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash-live",
    "gemini-2.0-flash-exp",
    // Gemini 2.5
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash-live",
    "gemini-2.5-flash-tts",
    "gemini-2.5-flash-native-audio-dialog",
    "gemini-2.5-pro",
    // Gemini 3.0
    "gemini-3-pro",
    // Gemini Robotics
    "gemini-robotics-er-1.5-preview",
    // Gemma models
    "gemma-3-1b",
    "gemma-3-2b",
    "gemma-3-4b",
    "gemma-3-12b",
    "gemma-3-27b",
    // LearnLM
    "learnlm-2.0-flash-experimental"
  ],
  perplexity: [
    // Sonar Online models (real-time search)
    "sonar-small-online",
    "sonar-medium-online",
    "sonar-large-online",
    // Sonar Chat models (conversational)
    "sonar-small-chat",
    "sonar-medium-chat",
    "sonar-large-chat",
    // Llama-based Sonar models
    "llama-3.1-sonar-small-32k-online",
    "llama-3.1-sonar-small-32k-chat",
    "llama-3.1-sonar-large-32k-online",
    "llama-3.1-sonar-large-32k-chat"
  ]
}

export function Sidebar({
  selectedModels,
  toggleModelSelection,
  usableProviders,
  connectedProviders
}: Props) {
  const [openProviders, setOpenProviders] = useState<Record<ProviderId, boolean>>({
    openai: false,
    "openai-mini": false,
    anthropic: false,
    gemini: false,
    perplexity: false
  })

  const [sessions, setSessions] = useState<SessionHistoryType[]>([])
  const [selectedSession, setSelectedSession] = useState<SessionHistoryType | null>(null)

  useEffect(() => {
    setSessions(loadSessions())
  }, [])

  function toggleProvider(provider: ProviderId) {
    setOpenProviders(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }))
  }

  return (
    <div className="w-80 bg-gradient-to-b from-arena-card to-zinc-900/30 border-r-2 border-green-500/20 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin sticky top-16 flex-shrink-0 shadow-xl">
      <div className="p-5 space-y-6">
        {/* Model Selection Section */}
        <div>
          <h2 className="text-lg font-bold text-zinc-50 mb-4 uppercase tracking-wider">
            Select Models
          </h2>
          <div className="space-y-2">
            {PROVIDERS.filter(p => p.id !== "openai-mini").map(provider => {
              const isUsable =
                usableProviders.includes(provider.id) || connectedProviders.includes(provider.id)
              const isOpen = openProviders[provider.id]
              const models = ALL_MODELS[provider.id]
              const selectedCount = selectedModels.filter(s => s.provider === provider.id).length

              return (
                <div key={provider.id} className="border border-zinc-800 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleProvider(provider.id)}
                    disabled={!isUsable}
                    className={`w-full px-3 py-2.5 flex items-center justify-between text-left transition-colors ${
                      isUsable
                        ? "hover:bg-zinc-900/50 text-zinc-200"
                        : "opacity-50 cursor-not-allowed text-zinc-500"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-zinc-100">{provider.label}</span>
                      {selectedCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-medium">
                          {selectedCount}
                        </span>
                      )}
                      {!isUsable && (
                        <span className="text-[10px] text-zinc-500">(Connect key)</span>
                      )}
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isOpen && isUsable && (
                    <div className="border-t border-zinc-800 bg-black/30 max-h-64 overflow-y-auto scrollbar-thin">
                      <div className="p-2 space-y-1">
                        {models.map(model => {
                          const checked = selectedModels.some(
                            s => s.provider === provider.id && s.model === model
                          )
                          return (
                            <label
                              key={model}
                              className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-xs ${
                                checked
                                  ? "bg-green-500/10 border border-green-500/50 text-green-300"
                                  : "hover:bg-zinc-800/50 text-zinc-400"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleModelSelection(provider.id, model)}
                                className="h-3.5 w-3.5 accent-green-500"
                              />
                              <span className="font-mono text-sm text-zinc-200">{model}</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Session History Section */}
        <div>
          <h2 className="text-lg font-bold text-zinc-50 mb-4 uppercase tracking-wider">
            Session History
          </h2>
          <div className="space-y-1.5">
            {sessions.length === 0 ? (
              <div className="text-xs text-zinc-500 px-2">No previous sessions</div>
            ) : (
              sessions
                .slice()
                .reverse()
                .slice(0, 10)
                .map(session => (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className="w-full text-left px-3 py-2 rounded-md border border-zinc-800 hover:border-green-500/50 hover:bg-zinc-900/30 transition-colors"
                  >
                    <div className="text-base text-zinc-200 font-medium">
                      {new Date(session.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                    <div className="text-sm text-zinc-400 mt-0.5">
                      {session.runs.length} prompt{session.runs.length !== 1 ? "s" : ""}
                    </div>
                  </button>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[85vh] bg-arena-card border-2 border-green-500/30 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-black/20">
              <div>
                <div className="text-xl font-bold text-zinc-50">
                  Session {new Date(selectedSession.createdAt).toLocaleString()}
                </div>
                <div className="text-base text-zinc-400 mt-1">
                  {selectedSession.runs.length} prompt{selectedSession.runs.length !== 1 ? "s" : ""}
                </div>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-zinc-800/50 transition-colors group"
                onClick={() => setSelectedSession(null)}
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6 text-zinc-400 group-hover:text-zinc-200 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin">
              {selectedSession.runs.map(run => (
                <div key={run.id} className="border border-zinc-800 rounded-xl p-5 bg-black/20">
                  <div className="text-base text-zinc-400 mb-3 font-medium">
                    {new Date(run.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit"
                    })}
                  </div>
                  <div className="text-base bg-black/40 border border-zinc-800 rounded-lg p-4 font-mono whitespace-pre-wrap mb-4 text-zinc-200">
                    {run.prompt}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {run.results.map(res => (
                      <div
                        key={`${res.provider}-${res.model}`}
                        className="border border-zinc-800 rounded-lg p-4 bg-black/30"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="font-bold text-zinc-100 text-base">
                            {getProviderMeta(res.provider as ProviderId).label} - {res.model}
                          </div>
                          <div className="text-base text-green-400 font-semibold">${res.metrics.cost.toFixed(4)}</div>
                        </div>
                        <div className="max-h-40 overflow-auto bg-black/40 rounded-md p-3 font-mono whitespace-pre-wrap text-sm text-zinc-200 scrollbar-thin">
                          {res.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

