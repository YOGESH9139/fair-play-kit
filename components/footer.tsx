"use client"

import Link from "next/link"
import { Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-3 mb-8">
          <div>
            <span className="font-bold text-foreground block mb-4">Fair Play Kit</span>
            <p className="text-sm text-muted-foreground">Provably fair gaming primitives for Algorand</p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Live Demo
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  API Reference
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Community</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Algorand Foundation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">Built for AlgoBharat Hackseries 2025</p>
        </div>
      </div>
    </footer>
  )
}
