import { PortfolioCreator } from "@/components/portfolio-creator"

// Single-page entry point. The whole experience lives inside <PortfolioCreator />.
export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950">
      <PortfolioCreator />
    </main>
  )
}
