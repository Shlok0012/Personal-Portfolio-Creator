"use client"

import type { PortfolioData } from "@/lib/types"
import { ModernMinimal } from "./templates/modern-minimal"
import { ProfessionalSidebar } from "./templates/professional-sidebar"
import { CreativeGradient } from "./templates/creative-gradient"

// ---------------------------------------------------------------------------
// THE PORTFOLIO PREVIEW (dispatcher)
// Picks exactly one of the three template components based on data.template,
// so only the selected template is ever rendered in the preview area.
// ---------------------------------------------------------------------------

interface PortfolioPreviewProps {
  data: PortfolioData
}

export function PortfolioPreview({ data }: PortfolioPreviewProps) {
  switch (data.template) {
    case "professional-sidebar":
      return <ProfessionalSidebar data={data} />
    case "creative-gradient":
      return <CreativeGradient data={data} />
    case "modern-minimal":
    default:
      return <ModernMinimal data={data} />
  }
}
