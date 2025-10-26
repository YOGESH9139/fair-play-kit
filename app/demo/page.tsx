"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GameDemo } from "@/components/game-demo"
import { useState } from "react"

export default function DemoPage() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const handleConnectWallet = async () => {
    // Simulate wallet connection
    setWalletAddress("ALGO...7XYZ")
    setWalletConnected(true)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-foreground">Fair Play Demo Game</h1>
            <p className="text-lg text-muted-foreground">Experience provably fair gaming on Algorand</p>
          </div>

          {!walletConnected ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-8 text-center">
                <div className="mb-4 text-6xl">🎮</div>
                <h2 className="mb-4 text-2xl font-bold text-foreground">Connect Your Wallet to Play</h2>
                <p className="mb-8 text-muted-foreground max-w-md">
                  Connect your Algorand wallet to start playing and experience the fairness of our gaming module
                </p>
              </div>
              <button
                onClick={handleConnectWallet}
                className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-8 p-4 rounded-lg bg-muted border border-border">
                <p className="text-sm text-muted-foreground">Connected Wallet:</p>
                <p className="font-mono font-bold text-foreground">{walletAddress}</p>
              </div>
              <GameDemo />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
