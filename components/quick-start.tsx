"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"

export function QuickStart() {
  const [copied, setCopied] = useState(false)

  const codeSnippet = `import { FairPlayKit } from '@fairplaykit/algorand'

const kit = new FairPlayKit(algodClient)
const match = await kit.createMatch(player1, player2, betAmount)`

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="px-4 py-20 sm:py-32 bg-muted/30">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">Quick Start</h2>
          <p className="text-lg text-muted-foreground">Get up and running in minutes</p>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-3 text-sm font-semibold text-muted-foreground">Installation</p>
            <div className="flex items-center gap-2 rounded bg-muted p-3">
              <code className="flex-1 text-sm text-foreground font-mono">npm install @fairplaykit/algorand</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("npm install @fairplaykit/algorand")
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
                className="p-2 hover:bg-muted/50 rounded transition-colors"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-3 text-sm font-semibold text-muted-foreground">Usage Example</p>
            <div className="relative">
              <pre className="overflow-x-auto rounded bg-muted p-4 text-sm text-foreground font-mono">
                <code>{codeSnippet}</code>
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 hover:bg-muted/50 rounded transition-colors"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
