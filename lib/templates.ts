import type { TemplateId } from "./types"

// ---------------------------------------------------------------------------
// Template registry.
// Each template describes the metadata shown in the selector grid plus the
// accent colors used by both the live preview and the exported HTML file.
// Centralizing this means adding a 4th template later is trivial.
// ---------------------------------------------------------------------------

export interface TemplateMeta {
  id: TemplateId
  name: string
  description: string
  /** Tailwind utility classes used to draw the small swatch in the selector. */
  swatch: string
  /** Hex accent color reused inside the exported standalone HTML. */
  accentHex: string
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Minimalist, deep slate background with neon indigo accents.",
    swatch: "bg-slate-900 ring-indigo-400",
    accentHex: "#818cf8",
  },
  {
    id: "professional-sidebar",
    name: "Professional Sidebar",
    description: "Clean left-hand sidebar layout with emerald green accents.",
    swatch: "bg-slate-800 ring-emerald-400",
    accentHex: "#34d399",
  },
  {
    id: "creative-gradient",
    name: "Creative Gradient",
    description: "Centered bold layout, gradient headings, sunset amber accents.",
    swatch: "bg-amber-950 ring-amber-400",
    accentHex: "#fbbf24",
  },
]

/** Convenience lookup so components can grab a single template by id. */
export function getTemplate(id: TemplateId): TemplateMeta {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
}
