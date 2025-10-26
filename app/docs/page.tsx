import { Navigation } from "@/components/navigation"
import { Documentation } from "@/components/documentation"
import { Footer } from "@/components/footer"

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Documentation />
      <Footer />
    </main>
  )
}
