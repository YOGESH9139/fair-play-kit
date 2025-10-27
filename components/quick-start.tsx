"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"

export function QuickStart() {
  // Separate state for each copy button to avoid confusion
  const [copiedClone, setCopiedClone] = useState(false)
  const [copiedNpm, setCopiedNpm] = useState(false)
  const [copiedUsage, setCopiedUsage] = useState(false)

  // Updated snippet to show a local import path
  const codeSnippet = `// Import directly from your local SDK folder
import FairPlaySDK from './fair-play-module/sdk';

// 1. Initialize the SDK with your App ID and client details
const sdk = new FairPlaySDK(APP_ID, ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);

// 2. Predict the next Match ID by reading the contract's state
const globalState = await sdk.getGlobalState();
const currentCounter = globalState.get("match_counter") || 0;
const nextMatchId = currentCounter + 1;

// 3. Create the transaction to start a match lobby
const unsignedTxns = await sdk.createMatch(
  myAddress,
  betAmount,
  nextMatchId
);

// 4. Sign and send this transaction group using a wallet.`

  const handleCopy = (type: 'clone' | 'npm' | 'usage') => {
    let textToCopy = '';
    
    if (type === 'clone') {
      textToCopy = 'git clone https://github.com/YOGESH9139/fair-play-kit.git'; // Replace with your actual repo URL
      navigator.clipboard.writeText(textToCopy);
      setCopiedClone(true);
      setTimeout(() => setCopiedClone(false), 2000);
    } else if (type === 'npm') {
      textToCopy = 'npm install fair-play-kit'; // Replace with your actual package name
      navigator.clipboard.writeText(textToCopy);
      setCopiedNpm(true);
      setTimeout(() => setCopiedNpm(false), 2000);
    } else {
      textToCopy = codeSnippet;
      navigator.clipboard.writeText(textToCopy);
      setCopiedUsage(true);
      setTimeout(() => setCopiedUsage(false), 2000);
    }
  }

  return (
    <section className="px-4 py-20 sm:py-32 bg-muted/30">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">Quick Start</h2>
          <p className="text-lg text-muted-foreground">Get up and running in minutes</p>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">1. Get the Code</h3>
            
            <div className="space-y-4">
                <div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">Option A: Clone from GitHub (For Development)</p>
                    <div className="flex items-center gap-2 rounded bg-muted p-3">
                        <code className="flex-1 text-sm text-foreground font-mono">git clone https://github.com/YOGESH9139/fair-play-kit.git</code>
                        <button onClick={() => handleCopy('clone')} className="p-2 hover:bg-muted/50 rounded transition-colors" aria-label="Copy git clone command">
                            {copiedClone ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                        </button>
                    </div>
                </div>

                <div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">Option B: Install from npm (For Production)</p>
                    <div className="flex items-center gap-2 rounded bg-muted p-3">
                        <code className="flex-1 text-sm text-foreground font-mono">npm install fair-play-kit</code>
                        <button onClick={() => handleCopy('npm')} className="p-2 hover:bg-muted/50 rounded transition-colors" aria-label="Copy npm install command">
                            {copiedNpm ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                        </button>
                    </div>
                </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">2. Usage Example</h3>
            <div className="relative">
              <pre className="overflow-x-auto rounded bg-muted p-4 text-sm text-foreground font-mono">
                <code>{codeSnippet}</code>
              </pre>
              <button
                onClick={() => handleCopy('usage')}
                className="absolute top-3 right-3 p-2 hover:bg-muted/50 rounded transition-colors"
                aria-label="Copy usage example"
              >
                {copiedUsage ? (
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