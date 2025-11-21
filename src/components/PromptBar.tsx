"use client"

import { useEffect } from "react"

type Props = {
  prompt: string
  setPrompt: (v: string) => void
  onRun: () => void
  disabled?: boolean
}

export function PromptBar({ prompt, setPrompt, onRun, disabled }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault()
        if (!disabled) onRun()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onRun, disabled])

  return (
    <div className="bg-gradient-to-br from-arena-card to-zinc-900/30 border-2 border-green-500/20 rounded-2xl p-6 shadow-2xl shadow-green-500/10">
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-semibold text-zinc-200">Enter your prompt</div>
        <div className="text-base text-zinc-400">Ctrl / Cmd + Enter to run</div>
      </div>
      <textarea
        className="w-full rounded-xl bg-gradient-to-br from-black/60 to-zinc-900/40 border-2 border-green-500/30 focus:border-green-400 focus:ring-2 focus:ring-green-500/30 outline-none resize-none text-lg p-5 h-40 scrollbar-thin font-mono text-green-50 placeholder:text-zinc-500 transition-all shadow-inner"
        placeholder="Ask one prompt to rule them all..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
      />
    </div>
  )
}
