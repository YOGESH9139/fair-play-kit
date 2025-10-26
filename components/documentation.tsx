"use client"

import { useState } from "react"

const tabs = [
  {
    id: "functions",
    label: "Functions",
    content: [
      { name: "createMatch", desc: "Initialize a new game match between two players" },
      { name: "commitMove", desc: "Commit a hashed move to the blockchain" },
      { name: "revealMove", desc: "Reveal your move and verify fairness" },
      { name: "claimWinnings", desc: "Claim your winnings from the escrow" },
    ],
  },
  {
    id: "integration",
    label: "Integration Guide",
    content: [
      { name: "Step 1: Setup", desc: "Initialize the FairPlayKit with your Algorand client" },
      { name: "Step 2: Create Match", desc: "Create a new match with player addresses and bet amount" },
      { name: "Step 3: Commit Moves", desc: "Both players commit their hashed moves" },
      { name: "Step 4: Reveal & Settle", desc: "Reveal moves and automatically settle the game" },
    ],
  },
  {
    id: "api",
    label: "API Reference",
    content: [
      { name: "FairPlayKit(client)", desc: "Constructor - Initialize with Algorand client" },
      { name: "createMatch(p1, p2, amount)", desc: "Create match - Returns match ID" },
      { name: "commitMove(matchId, hash)", desc: "Commit move - Returns transaction ID" },
      { name: "revealMove(matchId, move)", desc: "Reveal move - Returns result" },
    ],
  },
]

export function Documentation() {
  const [activeTab, setActiveTab] = useState("functions")

  const currentTab = tabs.find((tab) => tab.id === activeTab)

  return (
    <section className="px-4 py-20 sm:py-32 bg-muted/30">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">Documentation</h2>
          <p className="text-lg text-muted-foreground">Complete API reference and integration guide</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          {/* Tabs */}
          <div className="mb-8 flex gap-2 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 -mb-[2px] ${
                  activeTab === tab.id
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-4">
            {currentTab?.content.map((item, index) => (
              <div key={index} className="rounded-lg bg-muted p-4 hover:bg-muted/80 transition-colors">
                <p className="font-mono text-sm text-primary font-semibold mb-1">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
