"use client"

import { useState } from "react"
import { Loader2, Package, Pencil, Wand2 } from "lucide-react"
import { CreatorForm } from "./creator-form"
import { PortfolioPreview } from "./portfolio-preview"
import { downloadPortfolioZip } from "@/lib/export-portfolio"
import { EMPTY_PORTFOLIO, type PortfolioData } from "@/lib/types"

// ---------------------------------------------------------------------------
// TOP-LEVEL CONTAINER
// Owns the single PortfolioData state object and toggles between two views:
//   - "form"    : the creator form
//   - "preview" : the generated portfolio
// Because state lives here, all data and files are preserved when the user
// clicks Edit and returns to the form.
// ---------------------------------------------------------------------------

type View = "form" | "preview"

export function PortfolioCreator() {
  const [data, setData] = useState<PortfolioData>(EMPTY_PORTFOLIO)
  const [view, setView] = useState<View>("form")
  const [isExporting, setIsExporting] = useState(false)

  // Merge a partial update into the current data (controlled-form pattern).
  function updateData(patch: Partial<PortfolioData>) {
    setData((prev) => ({ ...prev, ...patch }))
  }

  // Handle the ZIP export, with a small loading state for good UX.
  async function handleExport() {
    try {
      setIsExporting(true)
      await downloadPortfolioZip(data)
    } catch (error) {
      console.log("[v0] Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
      {/* App header */}
      <header className="mb-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs font-medium text-indigo-300">
          <Wand2 className="h-3.5 w-3.5" /> Portfolio Creator
        </span>
        <h1 className="mt-4 text-3xl font-bold text-white text-balance sm:text-4xl">
          Build &amp; export your personal portfolio
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-400 text-pretty">
          Fill in your details, pick a template, and download a self-contained portfolio website that works offline.
        </p>
      </header>

      {/* ---------------- FORM VIEW ---------------- */}
      {view === "form" && (
        <div className="animate-in fade-in duration-500">
          <CreatorForm data={data} onChange={updateData} onGenerate={() => setView("preview")} />
        </div>
      )}

      {/* ---------------- PREVIEW VIEW ---------------- */}
      {view === "preview" && (
        // The `animate-in fade-in` classes provide the requested fade-in animation.
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
          {/* Action bar: Edit + Download */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setView("form")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
            >
              <Pencil className="h-4 w-4" /> Edit
            </button>

            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 active:scale-[0.99] disabled:opacity-60"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Packaging...
                </>
              ) : (
                <>
                  <Package className="h-4 w-4" /> Download Portfolio Package
                </>
              )}
            </button>
          </div>

          <PortfolioPreview data={data} />
        </div>
      )}
    </div>
  )
}
