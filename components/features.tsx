"use client"

import { Lock, Zap, Shield, Code2, Users, Gavel, Trophy, BookOpen, Puzzle, CheckCircle } from "lucide-react"

// Main features highlighting the core pillars of the kit
const coreFeatures = [
  {
    icon: Zap,
    title: "Verifiable Randomness",
     description: "Leverages a verifiable random function (VRF) to provide cryptographically secure and auditable random numbers for in-game events, ensuring outcomes cannot be manipulated. [  2]",
  },
  {
    icon: Users,
    title: "Decentralized Matchmaking",
     description: "Implement a transparent and tamper-proof system for pairing players based on predefined criteria like skill ratings or game types. [  2]",
  },
  {
    icon: Shield,
    title: "Secure Escrow & Payouts",
    description: "Smart contracts for handling bets, wagers, and prize pools.  Funds are released automatically based on game outcomes without central intermediaries. [  1, 2]",
  },
  {
    icon: Trophy,
    title: "Tournament Management",
     description: "An end-to-end framework for organizing decentralized tournaments, from fair, random seeding and bracket management to automated prize distribution. [  1, 2]",
  },
  {
    icon: Gavel,
    title: "On-Chain Dispute Resolution",
    description: "An ASC-based system for handling player disagreements transparently.  It records evidence and can automate arbitration to ensure impartial judgment. [  2]",
  },
  {
    icon: Code2,
    title: "Developer-First SDKs",
     description: "A turnkey suite of SDKs for TypeScript/JavaScript and Python that abstract away blockchain complexities, enabling rapid development. [  2]",
  },
]

// "Little ones" - essential supporting features that make the kit complete
const essentialFeatures = [
    {
        icon: Puzzle,
        title: "Modular by Design",
        description: "Each primitive is standalone yet interoperable, allowing developers to pick and choose the components they need for their specific game. [  2]"
    },
    {
        icon: BookOpen,
        title: "Game Templates & Examples",
         description: "Get started quickly with basic configurations for common mechanics like dice rolls and card draws, plus extensive code examples. [  1]"
    },
    {
        icon: CheckCircle,
        title: "Player Verification Tools",
        description: "Provide tools for players to independently confirm fair outcomes.  Every random number, bracket, and payout is publicly verifiable on-chain. [  1]"
    }
]

export function Features() {
  return (
    <section className="px-4 py-20 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">A Complete Toolkit for Fair Gaming</h2>
           <p className="text-lg text-muted-foreground">Everything you need for provably fair games on Algorand, out of the box. [  2]</p>
        </div>

        {/* Core Pillars Section */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {coreFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Essential Supporting Features Section */}
        <div className="mt-24 text-center">
            <h3 className="mb-12 text-3xl font-bold text-foreground sm:text-4xl">And All the Essentials...</h3>
            <div className="grid gap-8 md:grid-cols-3">
                {essentialFeatures.map((feature, index) => {
                    const Icon = feature.icon
                    return (
                        <div key={index} className="rounded-xl border border-border bg-card p-6 text-left">
                             <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <Icon className="h-5 w-5 text-foreground" />
                            </div>
                            <h4 className="mb-2 font-semibold text-foreground">{feature.title}</h4>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                    )
                })}
            </div>
        </div>

      </div>
    </section>
  )
}