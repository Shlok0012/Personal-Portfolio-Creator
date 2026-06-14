"use client"

import { useMemo } from "react"
import { Briefcase, Code2, Download, FileText, Mail } from "lucide-react"
import type { UploadedFile } from "@/lib/types"

// ---------------------------------------------------------------------------
// Shared building blocks reused by all three template components.
// Keeping these here avoids duplicating the socials/file-link markup in every
// template while still letting each template control its own colors via props.
// ---------------------------------------------------------------------------

export interface FileLinkData {
  name: string
  url: string
}

/**
 * Turn the stored File objects into temporary in-browser object URLs so the
 * uploaded documents are actually downloadable from the live preview.
 * useMemo keeps the URLs stable for the same file list across re-renders.
 */
export function useFileLinks(files: UploadedFile[]): FileLinkData[] {
  return useMemo(() => files.map((f) => ({ name: f.name, url: URL.createObjectURL(f.file) })), [files])
}

/** Row of social / contact links. `className` carries the template accent color. */
export function Socials({
  email,
  github,
  linkedin,
  className = "",
}: {
  email: string
  github: string
  linkedin: string
  className?: string
}) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {email && (
        <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline">
          <Mail className="h-4 w-4" /> Email
        </a>
      )}
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
        >
          <Code2 className="h-4 w-4" /> GitHub
        </a>
      )}
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
        >
          <Briefcase className="h-4 w-4" /> LinkedIn
        </a>
      )}
    </div>
  )
}

/** A single downloadable attachment link with a file icon. */
export function FileLink({ name, url }: FileLinkData) {
  return (
    <a href={url} download={name} className="inline-flex items-center gap-2 text-sm font-medium hover:underline">
      <FileText className="h-4 w-4 shrink-0" /> {name}
      <Download className="h-3.5 w-3.5 opacity-60" />
    </a>
  )
}
