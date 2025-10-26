"use client"

import { Lock, Zap, Shield, Code2 } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Verifiable Randomness",
    description: "On-chain random number generation with cryptographic proofs for true fairness",
  },
  {
    icon: Lock,
    title: "Commit-Reveal",
    description: "Hide moves until both players commit, preventing information leakage",
  },
  {
    icon: Shield,
    title: "Secure Escrow",
    description: "Automatic bet handling and payouts with smart contract security",
  },
  {
    icon: Code2,
    title: "Easy Integration",
    description: "Import and use in 3 lines of code with comprehensive documentation",
  },
]

export function Features() {
  return (
    <section className="px-4 py-20 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">Powerful Features</h2>
          <p className="text-lg text-muted-foreground">Everything you need for provably fair gaming</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
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
      </div>
    </section>
  )
}
