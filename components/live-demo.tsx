"use client"

import { useState } from "react"
import { Wallet } from "lucide-react"

export function LiveDemo() {
  const [selectedMove, setSelectedMove] = useState<string | null>(null)
  const [gameStatus, setGameStatus] = useState("Waiting for opponent...")

  const moves = ["Rock", "Paper", "Scissors"]

  const handleMove = (move: string) => {
    setSelectedMove(move)
    setGameStatus(`You selected ${move}. Waiting for opponent...`)
  }

  return (
    <section id="demo" className="px-4 py-20 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">Try Rock-Paper-Scissors Demo</h2>
          <p className="text-lg text-muted-foreground">Experience provably fair gaming in action</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Game Interface */}
          <div className="rounded-xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm">
            <h3 className="mb-6 text-xl font-semibold text-foreground">Game Interface</h3>

            <div className="space-y-6">
              <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-primary/50 text-primary hover:bg-primary/10 transition-colors font-semibold">
                <Wallet className="h-5 w-5" />
                Connect Wallet
              </button>

              <div>
                <p className="mb-3 text-sm text-muted-foreground">Your Move</p>
                <div className="grid grid-cols-3 gap-3">
                  {moves.map((move) => (
                    <button
                      key={move}
                      onClick={() => handleMove(move)}
                      className={`py-4 rounded-lg font-semibold transition-all ${
                        selectedMove === move
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "border border-border/50 text-foreground hover:border-primary/50 hover:bg-card/80"
                      }`}
                    >
                      {move}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground mb-2">Game Status</p>
                <p className="text-foreground font-semibold">{gameStatus}</p>
              </div>
            </div>
          </div>

          {/* Proof Panel */}
          <div className="rounded-xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm">
            <h3 className="mb-6 text-xl font-semibold text-foreground">Proof Panel</h3>

            <div className="space-y-4">
              <div className="rounded-lg bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                <p className="text-sm font-mono text-primary break-all">0x7a3f8c2e9b1d4f6a5e8c3b2d9f1a4e7c...</p>
              </div>

              <div className="rounded-lg bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground mb-1">Player 1 Commitment</p>
                <p className="text-sm font-mono text-primary break-all">0x9f2e1a3c5b7d8e4f6a2c9b1e3d5f7a8c...</p>
              </div>

              <div className="rounded-lg bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground mb-1">Player 2 Commitment</p>
                <p className="text-sm font-mono text-secondary break-all">0x4c6e8a2f1d9b3e5c7a1f4d8b2e6a9c3f...</p>
              </div>

              <div className="rounded-lg bg-muted/30 p-4 border border-primary/30">
                <p className="text-xs text-muted-foreground mb-1">Fairness Verification</p>
                <p className="text-sm text-primary font-semibold">✓ Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
