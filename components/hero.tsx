"use client"

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:py-32 lg:py-40">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-20 animate-pulse" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">Algorand Gaming</span>
        </div>

        <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
          Fair Play Kit
        </h1>

        <p className="mb-8 text-xl text-muted-foreground text-balance">Provably Fair Gaming Primitives for Algorand</p>

        <p className="mb-12 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
          A plug-and-play module that adds verifiable randomness, secure escrow, and commit-reveal fairness to any
          blockchain game
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl">
            View Documentation
          </button>
          <button className="px-8 py-3 rounded-lg border border-primary/50 text-primary font-semibold hover:bg-primary/10 transition-colors">
            Try Demo
          </button>
        </div>
      </div>
    </section>
  )
}
