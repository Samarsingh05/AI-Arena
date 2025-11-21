"use client"

import { useState } from "react"
import { PROVIDERS, ProviderId } from "@/lib/providers"

type KeyStatus = {
  id: string
  provider: ProviderId
  status: string
}

type Props = {
  keyStatuses: KeyStatus[]
  refreshKeys: () => Promise<void>
}

type ProviderInputState = {
  value: string
  testing: boolean
  result: "idle" | "ok" | "error"
  message: string
}

function ProviderInstructionsContent({ provider }: { provider: ProviderId }) {
  switch (provider) {
    case "openai":
    case "openai-mini":
      return (
        <div className="text-[10px] text-zinc-500 leading-relaxed space-y-1">
          <p className="font-medium text-zinc-300">How to get your OpenAI API key:</p>
          <ol className="list-decimal list-inside space-y-[2px]">
            <li>
              Go to{" "}
              <a
                href="https://platform.openai.com/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-dotted"
              >
                platform.openai.com
              </a>
            </li>
            <li>Log in or create an account.</li>
            <li>
              Click your profile icon →{" "}
              <span className="font-mono text-[10px]">View API keys</span>.
            </li>
            <li>
              Click <span className="font-mono text-[10px]">Create new secret key</span> and copy it.
            </li>
          </ol>
        </div>
      )
    case "anthropic":
      return (
        <div className="text-[10px] text-zinc-500 leading-relaxed space-y-1">
          <p className="font-medium text-zinc-300">How to get your Claude (Anthropic) API key:</p>
          <ol className="list-decimal list-inside space-y-[2px]">
            <li>
              Go to{" "}
              <a
                href="https://console.anthropic.com/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-dotted"
              >
                console.anthropic.com
              </a>
            </li>
            <li>Sign in / sign up.</li>
            <li>
              Open the <span className="font-mono text-[10px]">API Keys</span> section from the sidebar.
            </li>
            <li>
              Click <span className="font-mono text-[10px]">Create key</span> and copy it.
            </li>
          </ol>
        </div>
      )
    case "gemini":
      return (
        <div className="text-[10px] text-zinc-500 leading-relaxed space-y-1">
          <p className="font-medium text-zinc-300">How to get your Google Gemini API key:</p>
          <ol className="list-decimal list-inside space-y-[2px]">
            <li>
              Go to{" "}
              <a
                href="https://ai.google.dev/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-dotted"
              >
                ai.google.dev
              </a>
            </li>
            <li>
              Click <span className="font-mono text-[10px]">Get API key</span>.
            </li>
            <li>Select or create a Google Cloud project if asked.</li>
            <li>Generate an API key and copy it.</li>
          </ol>
        </div>
      )
    case "perplexity":
      return (
        <div className="text-[10px] text-zinc-500 leading-relaxed space-y-1">
          <p className="font-medium text-zinc-300">How to get your Perplexity API key:</p>
          <ol className="list-decimal list-inside space-y-[2px]">
            <li>
              Go to{" "}
              <a
                href="https://www.perplexity.ai/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-dotted"
              >
                perplexity.ai
              </a>
            </li>
            <li>Sign in to your account.</li>
            <li>
              Open <span className="font-mono text-[10px]">Settings</span> →{" "}
              <span className="font-mono text-[10px]">API</span>.
            </li>
            <li>Generate a new API key and copy it.</li>
          </ol>
        </div>
      )
    default:
      return null
  }
}

export function ApiKeysPanel({ keyStatuses, refreshKeys }: Props) {
  const [inputs, setInputs] = useState<Record<ProviderId, ProviderInputState>>({
    openai: { value: "", testing: false, result: "idle", message: "" },
    "openai-mini": { value: "", testing: false, result: "idle", message: "" },
    anthropic: { value: "", testing: false, result: "idle", message: "" },
    gemini: { value: "", testing: false, result: "idle", message: "" },
    perplexity: { value: "", testing: false, result: "idle", message: "" }
  })

  const [openInstructions, setOpenInstructions] = useState<ProviderId | null>(null)

  function statusFor(provider: ProviderId) {
    const s = keyStatuses.find(k => k.provider === provider)
    if (!s) return "missing"
    return s.status
  }

  function updateInput(provider: ProviderId, patch: Partial<ProviderInputState>) {
    setInputs(prev => ({
      ...prev,
      [provider]: { ...prev[provider], ...patch }
    }))
  }

  async function handleTestAndSave(provider: ProviderId) {
    const state = inputs[provider]
    if (!state.value.trim()) return
    updateInput(provider, { testing: true, result: "idle", message: "" })
    try {
      const testRes = await fetch("/api/keys/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey: state.value.trim() })
      })
      if (!testRes.ok) {
        updateInput(provider, { testing: false, result: "error", message: "Key seems invalid" })
        return
      }
      const saveRes = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey: state.value.trim(), status: "connected" })
      })
      if (!saveRes.ok) {
        updateInput(provider, { testing: false, result: "error", message: "Failed to save key" })
        return
      }
      updateInput(provider, { testing: false, result: "ok", message: "Connected" })
      await refreshKeys()
    } catch {
      updateInput(provider, { testing: false, result: "error", message: "Network error" })
    }
  }

  return (
    <div className="mt-6 bg-gradient-to-br from-arena-card to-zinc-900/30 border-2 border-green-500/20 rounded-2xl p-6 shadow-xl shadow-green-500/5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-lg font-semibold text-zinc-200">Add API keys</div>
          <div className="text-base text-zinc-400 mt-1">
            Paste your own keys for each provider. They are stored for this account so you can log in later and
            keep using the same models.
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {PROVIDERS.filter(p => p.id !== "openai-mini").map(p => {
          const provider = p.id
          const status = statusFor(provider)
          const state = inputs[provider]

          const badgeText =
            status === "connected"
              ? "Connected"
              : status === "invalid"
              ? "Invalid"
              : status === "payment_required"
              ? "Payment Required"
              : "Missing"

          const badgeClass =
            status === "connected"
              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
              : status === "invalid"
              ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
              : status === "payment_required"
              ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-300"
              : "bg-zinc-800/80 border-zinc-700 text-zinc-400"

          const isOpen = openInstructions === provider

          return (
            <div
              key={provider}
              className="border-2 border-green-500/20 rounded-xl p-4 bg-gradient-to-br from-black/40 to-zinc-900/20 flex flex-col gap-3 shadow-lg hover:border-green-500/40 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-base font-bold text-zinc-100">{p.label}</div>
                <span className={`px-2 py-[2px] rounded-full text-[10px] border ${badgeClass}`}>
                  {badgeText}
                </span>
              </div>

              {status === "payment_required" && (
                <div className="text-[10px] text-yellow-400 leading-snug">
                  This provider requires a payment method saved in your account. Add billing details in the
                  provider’s website to use this API.
                </div>
              )}

              <input
                type="password"
                placeholder="Paste API key"
                value={state.value}
                onChange={e => updateInput(provider, { value: e.target.value })}
                className="w-full text-sm px-2 py-2 rounded-md bg-black/60 border border-zinc-700 focus:border-green-500 outline-none font-mono"
              />

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => handleTestAndSave(provider)}
                  disabled={!state.value.trim() || state.testing}
                  className="px-3 py-1 rounded-full text-sm border border-zinc-700 hover:border-green-500/70 hover:bg-green-500/10 disabled:opacity-50"
                >
                  {state.testing ? "Testing..." : "Test & Save"}
                </button>
                <div className="text-xs text-zinc-500">
                  {state.result === "ok" && <span className="text-emerald-400">{state.message}</span>}
                  {state.result === "error" && <span className="text-amber-400">{state.message}</span>}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpenInstructions(isOpen ? null : provider)}
                className="mt-1 inline-flex items-center justify-between w-full text-[10px] px-2 py-1 rounded-md bg-zinc-900/70 border border-zinc-800 hover:border-zinc-600"
              >
                <span className="text-sm">Instructions for the API key</span>
                <span className="text-xs text-zinc-500">{isOpen ? "▲" : "▼"}</span>
              </button>

              {isOpen && (
                <div className="mt-1 rounded-md border border-zinc-800 bg-black/60 px-2 py-2">
                  <ProviderInstructionsContent provider={provider} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-3 text-sm text-zinc-500 leading-relaxed">
        <span className="font-semibold text-zinc-300">Important note:</span> Do not delete or regenerate your API
        keys on OpenAI, Anthropic, Google Gemini or Perplexity without updating them here. If a key is deleted,
        invalid or changed and you don&apos;t paste the new key and click{" "}
        <span className="font-mono text-[10px]">Test &amp; Save</span>, AI Arena will not be able to use that AI
        tool, and you won&apos;t see its responses, metrics or quota graph in the comparison view.
      </div>
    </div>
  )
}
