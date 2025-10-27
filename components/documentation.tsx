"use client"

import { useState } from "react"

// Updated content for the documentation tabs
const tabs = [
  {
    id: "functions",
    label: "Core Functions",
    content: [
      { name: "createMatch", desc: "Creates a new game lobby for an opponent to join. Predicts the next Match ID." },
      { name: "joinMatch", desc: "Allows a second player to join an existing game lobby using a Match ID." },
      { name: "commitMove", desc: "Securely commits a player's hashed move to the smart contract without revealing it." },
      { name: "revealMove", desc: "Reveals the player's move. This is typically grouped with resolveMatch." },
      { name: "resolveMatch", desc: "Triggers the game logic in the smart contract to determine the winner." },
      { name: "getGlobalState", desc: "Reads the contract's global state, used for predicting the next Match ID." },
      { name: "getMatchState", desc: "Reads the box storage for a specific match to get its current state (players, wager, etc.)." },
    ],
  },
  {
    id: "integration",
    label: "Integration Guide",
    content: [
      { name: "Step 1: Initialization", desc: "Create a new instance of the FairPlaySDK with your App ID and Algod client details." },
      { name: "Step 2: Create Match (Player 1)", desc: "Read global state to predict the next Match ID. Call createMatch() to start a lobby." },
      { name: "Step 3: Join Match (Player 2)", desc: "Player 2 receives the Match ID and calls joinMatch() to enter the game." },
      { name: "Step 4: Commit Moves", desc: "Both players call commitMove() with their chosen move and a secret salt." },
      { name: "Step 5: Reveal & Resolve", desc: "After both players commit, one or both call revealMove() and resolveMatch() in an atomic group to finalize the game and determine the winner." },
    ],
  },
  {
    id: "api",
    label: "API Reference",
    content: [
      { name: "new FairPlaySDK(appId, token, server, port)", desc: "Constructor - Initializes the SDK." },
      { name: "createMatch(sender, wager, nextMatchId)", desc: "Returns an unsigned transaction to create a match lobby." },
      { name: "joinMatch(sender, matchId)", desc: "Returns an unsigned transaction to join a specific match." },
      { name: "commitMove(sender, matchId, move, salt)", desc: "Returns an unsigned transaction to commit a hashed move." },
      { name: "revealMove(sender, matchId, move, salt)", desc: "Returns an unsigned transaction to reveal a move." },
      { name: "resolveMatch(sender, matchId)", desc: "Returns an unsigned transaction to trigger match resolution." },
      { name: "getGlobalState()", desc: "Returns a Map of the application's global state." },
      { name: "getMatchState(matchId)", desc: "Returns an object with the state of a specific match box." },
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
          <p className="text-lg text-muted-foreground">Complete API reference and integration guide for the FairPlay SDK</p>
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