"use client"

import { type PortfolioData, parseSkills } from "@/lib/types"
import { FileLink, Socials, useFileLinks } from "./shared"

// ---------------------------------------------------------------------------
// TEMPLATE 2: ProfessionalSidebar
// Structure: a fixed/sticky left-hand profile navigation sidebar (identity,
// skills, social links) on desktop, while the main body content (About,
// Skills detail, Documents) scrolls independently on the right. Emerald accents.
// ---------------------------------------------------------------------------

export function ProfessionalSidebar({ data }: { data: PortfolioData }) {
  const skills = parseSkills(data.skills)
  const fileLinks = useFileLinks(data.files)
  const initials =
    (data.fullName || "Your Name")
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "YN"

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
      <div className="flex flex-col sm:flex-row">
        {/* Sticky left sidebar (fixed-feel profile nav on desktop) */}
        <aside className="border-b border-emerald-500/40 bg-slate-800 p-8 sm:sticky sm:top-0 sm:h-fit sm:w-72 sm:shrink-0 sm:self-start sm:border-b-0 sm:border-r-4 sm:border-r-emerald-500">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-lg font-bold text-emerald-300 ring-2 ring-emerald-500/40">
            {initials}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white text-balance">{data.fullName || "Your Name"}</h1>
          <p className="mt-1 text-emerald-400">{data.title || "Your Title"}</p>

          <div className="mt-6 border-t border-slate-700 pt-6">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-400">Links</h2>
            <Socials email={data.email} github={data.github} linkedin={data.linkedin} className="flex-col gap-2 text-emerald-300" />
          </div>

          {skills.length > 0 && (
            <div className="mt-6 border-t border-slate-700 pt-6">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-400">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Scrolling main content on the right */}
        <main className="flex-1 p-8 text-slate-300 sm:p-10">
          {data.bio && (
            <section className="mb-10">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-400">About Me</h2>
              <p className="leading-relaxed text-pretty">{data.bio}</p>
            </section>
          )}

          {fileLinks.length > 0 && (
            <section>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-400">
                Downloadable Attachments
              </h2>
              <ul className="space-y-2 text-emerald-300">
                {fileLinks.map((f) => (
                  <li key={f.url} className="rounded-lg border border-slate-700/60 bg-slate-800 px-4 py-3">
                    <FileLink {...f} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
