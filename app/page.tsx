import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-32 lg:py-40">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm font-medium text-primary">Algorand Gaming</span>
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
            Fair Play Kit
          </h1>

          <p className="mb-8 text-xl text-muted-foreground text-balance">
            Provably Fair Gaming Primitives for Algorand
          </p>

          <p className="mb-16 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            A plug-and-play module that adds verifiable randomness, secure escrow, and commit-reveal fairness to any
            blockchain game
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link
              href="/features"
              className="group relative px-8 py-6 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
            >
              Features
              <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/quickstart"
              className="group relative px-8 py-6 rounded-xl border-2 border-primary text-primary font-bold text-lg hover:bg-primary/5 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
            >
              Quick Start
              <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/demo"
              className="group relative px-8 py-6 rounded-xl bg-secondary text-secondary-foreground font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
            >
              Play Demo
              <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/docs"
              className="group relative px-8 py-6 rounded-xl border-2 border-secondary text-secondary font-bold text-lg hover:bg-secondary/5 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
            >
              Documentation
              <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
