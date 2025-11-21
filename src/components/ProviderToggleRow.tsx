"use client"

import { ProviderId, PROVIDERS } from "@/lib/providers"

type Props = {
  connectedProviders: ProviderId[]
  billingRequiredProviders: ProviderId[]
  selected: ProviderId[]
  setSelected: (v: ProviderId[]) => void
}


export function ProviderToggleRow({ connectedProviders, billingRequiredProviders, selected, setSelected }: Props) {
  function toggle(p: ProviderId) {
    if (selected.includes(p)) {
      setSelected(selected.filter(x => x !== p))
    } else {
      setSelected([...selected, p])
    }
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {PROVIDERS.map(p => {
        const isConnected =
  connectedProviders.includes(p.id) || billingRequiredProviders.includes(p.id)

        const billingRequired = billingRequiredProviders.includes(p.id)

        const active = selected.includes(p.id)
        return (
          <button
  key={p.id}
  disabled={!isConnected && !billingRequired}
  onClick={() => toggle(p.id)}
  className={`px-3 py-1 rounded-full text-xs border transition ${
    active
      ? "border-green-500 bg-green-500/10 text-green-300"
      : isConnected
      ? "border-zinc-700 text-zinc-300 hover:border-green-500/70"
      : billingRequired
      ? "border-amber-600/40 text-amber-400 hover:border-amber-500/60"
      : "border-zinc-900 text-zinc-600 cursor-not-allowed"
  }`}
>
  {active
    ? "✓"
    : isConnected
    ? "○"
    : billingRequired
    ? "⚠"
    : "✗"}{" "}
  {p.label.split("–")[0].trim()}
</button>

        )
      })}
    </div>
  )
}
