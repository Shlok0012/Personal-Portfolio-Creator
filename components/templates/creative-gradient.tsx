"use client"

import { type PortfolioData, parseSkills } from "@/lib/types"
import { FileLink, Socials, useFileLinks } from "./shared"

// ---------------------------------------------------------------------------
// TEMPLATE 3: CreativeGradient
// Structure: a bold ASYMMETRIC SPLIT hero (wide gradient panel + narrower info
// column), smooth gradient background, rounded pill skill badges, and cards
// with hover lift animations.
// ---------------------------------------------------------------------------

export function CreativeGradient({ data }: { data: PortfolioData }) {
  const skills = parseSkills(data.skills)
  const fileLinks = useFileLinks(data.files)

  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/60 text-amber-50">
      {/* Asymmetric split hero: ~60/40 columns on desktop */}
      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-5">
        {/* Wide gradient hero panel */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-8 sm:p-10 lg:col-span-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-stone-900/70">Creative Portfolio</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-stone-900 text-balance sm:text-5xl">
            {data.fullName || "Your Name"}
          </h1>
          <p className="mt-3 text-lg font-semibold text-stone-900/80">{data.title || "Your Title"}</p>
          {data.bio && <p className="mt-6 max-w-md leading-relaxed text-stone-900/75 text-pretty">{data.bio}</p>}
        </div>

        {/* Narrower info column */}
        <div className="flex flex-col gap-5 lg:col-span-2">
          <div className="rounded-2xl border border-amber-400/20 bg-white/5 p-6">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-amber-400">Connect</h2>
            <Socials email={data.email} github={data.github} linkedin={data.linkedin} className="text-amber-300" />
          </div>

          {skills.length > 0 && (
            <div className="rounded-2xl border border-amber-400/20 bg-white/5 p-6">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-amber-400">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-gradient-to-r from-amber-400/20 to-rose-400/20 px-3 py-1 text-sm font-medium text-amber-200 ring-1 ring-amber-400/30"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Attachment cards with hover-lift animation */}
      {fileLinks.length > 0 && (
        <div className="px-6 pb-8 sm:px-8">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-amber-400">Downloadable Attachments</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {fileLinks.map((f) => (
              <div
                key={f.url}
                className="rounded-xl border border-amber-400/20 bg-white/5 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/50 hover:bg-white/10 hover:shadow-lg hover:shadow-amber-500/10"
              >
                <FileLink {...f} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
