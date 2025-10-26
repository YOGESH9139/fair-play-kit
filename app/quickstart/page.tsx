import { Navigation } from "@/components/navigation"
import { QuickStart } from "@/components/quick-start"
import { Footer } from "@/components/footer"

export default function QuickStartPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <QuickStart />
      <Footer />
    </main>
  )
}
