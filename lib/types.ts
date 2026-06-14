// ---------------------------------------------------------------------------
// Shared TypeScript types for the Personal Portfolio Creator.
// Keeping these in one place makes the data model easy to explain during a viva.
// ---------------------------------------------------------------------------

/** The three template identifiers the user can choose from. */
export type TemplateId = "modern-minimal" | "professional-sidebar" | "creative-gradient"

/**
 * A single uploaded document (resume, screenshot, etc.).
 * We keep the original `File` object so we can both preview it in the browser
 * AND write its real bytes into the exported ZIP package.
 */
export interface UploadedFile {
  id: string // unique id used as a React key and for deletion
  name: string // original file name (e.g. "resume.pdf")
  file: File // the actual binary file object from the <input type="file">
}

/**
 * The complete state of a user's portfolio.
 * This object is the "single source of truth" that flows between the
 * form, the preview, and the export system.
 */
export interface PortfolioData {
  fullName: string
  title: string
  email: string
  bio: string
  skills: string // raw comma-separated string from the input
  github: string
  linkedin: string
  files: UploadedFile[]
  template: TemplateId
}

/** A blank starting point used when the app first loads. */
export const EMPTY_PORTFOLIO: PortfolioData = {
  fullName: "",
  title: "",
  email: "",
  bio: "",
  skills: "",
  github: "",
  linkedin: "",
  files: [],
  template: "modern-minimal",
}

/** Helper: turn the comma-separated skills string into a clean array. */
export function parseSkills(skills: string): string[] {
  return skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}
