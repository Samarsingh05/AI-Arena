"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export function Navbar() {
  const { data: session } = useSession()

  return (
    <header className="border-b-2 border-green-500/20 bg-gradient-to-r from-black/60 to-zinc-900/40 backdrop-blur-lg sticky top-0 z-30 shadow-lg shadow-green-500/5">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 shadow-lg shadow-green-500/30" />
          <div>
            <div className="text-base tracking-[0.3em] uppercase text-zinc-400">AI Arena</div>
            <div className="text-sm text-zinc-500">Battle-tested LLM comparison</div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {session?.user?.email && <span className="text-zinc-400">{session.user.email}</span>}
          {session ? (
            <button
              className="px-3 py-1 rounded-full border border-zinc-700 hover:bg-zinc-800 transition text-sm"
              onClick={() => signOut()}
            >
              Sign out
            </button>
          ) : (
            <button
              className="px-3 py-1 rounded-full border border-zinc-700 hover:bg-zinc-800 transition text-sm"
              onClick={() => signIn()}
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
