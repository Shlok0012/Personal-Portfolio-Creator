"use client"

import { type PortfolioData, parseSkills } from "@/lib/types"
import { FileLink, Socials, useFileLinks } from "./shared"

// ---------------------------------------------------------------------------
// TEMPLATE 1: ModernMinimal
// Structure: a centered, single-column layout with VAST negative space, thin
// hairline borders, monochrome tones, and a minimalist grid as the focal point.
// Receives the whole portfolio `data` object as a prop.
// ---------------------------------------------------------------------------

export function ModernMinimal({ data }: { data: PortfolioData }) {
  const skills = parseSkills(data.skills)
  const fileLinks = useFileLinks(data.files)

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-slate-300">
      {/* Centered hero with generous whitespace */}
      <div className="mx-auto max-w-2xl px-6 py-20 text-center sm:py-28">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Portfolio</p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white text-balance sm:text-6xl">
          {data.fullName || "Your Name"}
        </h1>
        <p className="mt-4 text-lg font-light text-slate-400">{data.title || "Your Title"}</p>
        <Socials
          email={data.email}
          github={data.github}
          linkedin={data.linkedin}
          className="mt-6 justify-center text-slate-300"
        />

        {data.bio && (
          <p className="mx-auto mt-10 max-w-xl text-balance font-light leading-relaxed text-slate-400">{data.bio}</p>
        )}
      </div>

      {/* Thin divider */}
      <div className="border-t border-slate-800" />

      <div className="mx-auto max-w-3xl px-6 py-16">
        {skills.length > 0 && (
          <div className="mb-16 text-center">
            <h2 className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Skills</h2>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {skills.map((s) => (
                <span key={s} className="text-sm font-light text-slate-300">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Minimalist project / attachment grid — the structural focal point */}
        {fileLinks.length > 0 && (
          <div>
            <h2 className="mb-6 text-center text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
              Selected Work
            </h2>
            <div className="grid gap-px overflow-hidden rounded-lg border border-slate-800 bg-slate-800 sm:grid-cols-2">
              {fileLinks.map((f) => (
                <div key={f.url} className="bg-slate-950 p-6 transition-colors hover:bg-slate-900">
                  <FileLink {...f} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
