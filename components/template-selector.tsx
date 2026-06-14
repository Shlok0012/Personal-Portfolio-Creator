"use client"

import { Check } from "lucide-react"
import { TEMPLATES } from "@/lib/templates"
import type { TemplateId } from "@/lib/types"

// ---------------------------------------------------------------------------
// VISUAL TEMPLATE SELECTOR (image-style cards)
// Each card renders a miniature wireframe that mirrors the STRUCTURE of the
// real layout (centered minimal, asymmetric hero, left sidebar) rather than a
// plain color swatch. A real radio input keeps it accessible + keyboard-driven.
// ---------------------------------------------------------------------------

interface TemplateSelectorProps {
  selected: TemplateId
  onSelect: (id: TemplateId) => void
}

/**
 * Tiny structural wireframe previews built purely from Tailwind borders/blocks.
 * One per template id so the user can "see" the layout before choosing it.
 */
function Wireframe({ id }: { id: TemplateId }) {
  if (id === "modern-minimal") {
    // Centered, lots of negative space, thin monochrome lines + a project grid.
    return (
      <div className="flex h-24 flex-col items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-950 p-3">
        <div className="h-2 w-16 rounded-full bg-slate-500" />
        <div className="h-1 w-10 rounded-full bg-slate-700" />
        <div className="mt-1 grid w-full grid-cols-3 gap-1.5">
          <div className="h-5 rounded-sm border border-slate-700" />
          <div className="h-5 rounded-sm border border-slate-700" />
          <div className="h-5 rounded-sm border border-slate-700" />
        </div>
      </div>
    )
  }

  if (id === "creative-gradient") {
    // Asymmetric split hero: wide gradient block on the left, stacked bits right.
    return (
      <div className="flex h-24 gap-2 rounded-md border border-amber-900/50 bg-stone-900 p-3">
        <div className="flex flex-[3] flex-col justify-center gap-2 rounded-sm bg-gradient-to-br from-amber-400/80 to-rose-400/80 p-2">
          <div className="h-2 w-12 rounded-full bg-stone-900/40" />
          <div className="flex gap-1">
            <div className="h-2 w-6 rounded-full bg-stone-900/30" />
            <div className="h-2 w-5 rounded-full bg-stone-900/30" />
          </div>
        </div>
        <div className="flex flex-[2] flex-col gap-1.5">
          <div className="h-1.5 w-full rounded-full bg-amber-400/40" />
          <div className="h-1.5 w-3/4 rounded-full bg-amber-400/30" />
          <div className="mt-auto h-6 rounded-sm bg-white/5" />
        </div>
      </div>
    )
  }

  // professional-sidebar: fixed left sidebar + scrolling main column.
  return (
    <div className="flex h-24 gap-2 rounded-md border border-slate-700 bg-slate-900 p-3">
      <div className="flex w-1/3 flex-col gap-1.5 rounded-sm border-r-2 border-emerald-500 bg-slate-800 p-2">
        <div className="h-4 w-4 rounded-full bg-emerald-500/70" />
        <div className="h-1 w-full rounded-full bg-slate-600" />
        <div className="h-1 w-2/3 rounded-full bg-slate-700" />
        <div className="mt-auto flex gap-1">
          <div className="h-1.5 w-3 rounded-full bg-emerald-500/50" />
          <div className="h-1.5 w-3 rounded-full bg-emerald-500/50" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 py-1">
        <div className="h-1.5 w-2/3 rounded-full bg-slate-600" />
        <div className="h-1 w-full rounded-full bg-slate-700" />
        <div className="h-1 w-5/6 rounded-full bg-slate-700" />
        <div className="mt-auto h-6 rounded-sm bg-slate-800" />
      </div>
    </div>
  )
}

export function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <fieldset>
      <legend className="sr-only">Choose a portfolio layout</legend>
      <div className="grid gap-4 sm:grid-cols-3" role="radiogroup">
        {TEMPLATES.map((template) => {
          const isActive = template.id === selected
          return (
            <label
              key={template.id}
              className={`group relative flex cursor-pointer flex-col gap-3 rounded-xl border-2 p-3 text-left transition-all duration-200 ${
                isActive
                  ? "border-indigo-400 bg-slate-800/80 shadow-lg shadow-indigo-500/15"
                  : "border-slate-700 bg-slate-800/40 hover:border-slate-500 hover:bg-slate-800/70"
              }`}
            >
              {/* Real radio input (visually hidden but fully functional). */}
              <input
                type="radio"
                name="template"
                value={template.id}
                checked={isActive}
                onChange={() => onSelect(template.id)}
                className="sr-only"
              />

              {/* Active-state checkmark badge */}
              {isActive && (
                <span className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-white shadow-md ring-2 ring-slate-900">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
              )}

              {/* Structural wireframe preview */}
              <Wireframe id={template.id} />

              <div>
                <h3 className="text-sm font-semibold text-slate-100">{template.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400 text-pretty">{template.description}</p>
              </div>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
