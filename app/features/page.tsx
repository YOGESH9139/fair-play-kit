import { Navigation } from "@/components/navigation"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Features />
      <Footer />
    </main>
  )
}
