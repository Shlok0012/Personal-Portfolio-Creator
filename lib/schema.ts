import { z } from "zod"

// ---------------------------------------------------------------------------
// VALIDATION SCHEMAS (Zod)
// All form + file validation rules live here, separate from UI and state, so
// they're easy to point at and explain during a project viva.
// ---------------------------------------------------------------------------

/**
 * Schema for the required, validated text fields of the form.
 * Optional-but-still-validated rules (like LinkedIn) are handled separately
 * so an empty value doesn't block the user.
 */
export const portfolioSchema = z.object({
  // Full name: required, at least 3 letters.
  name: z.string().trim().min(3, "Name must be at least 3 letters."),

  // Email: required and must look like a real email address.
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),

  // GitHub URL: required and must be a valid URL.
  githubUrl: z.string().trim().min(1, "GitHub URL is required.").url("Enter a valid URL (https://...)."),

  // Bio: required, between 50 and 300 characters.
  bio: z
    .string()
    .trim()
    .min(50, "Bio must be at least 50 characters.")
    .max(300, "Bio must be 300 characters or fewer."),

  // ----- Optional, but still validated when present -----

  // Title / role: optional free text.
  title: z.string().trim().optional(),

  // Skills: optional comma-separated free text.
  skills: z.string().trim().optional(),

  // LinkedIn URL: optional, but must be a valid URL if provided.
  linkedin: z
    .union([z.literal(""), z.string().trim().url("Enter a valid URL (https://...).")])
    .optional(),
})

/** The TypeScript type inferred directly from the schema. */
export type PortfolioFormValues = z.infer<typeof portfolioSchema>

/** A simple map of field name -> error message used to render inline errors. */
export type FieldErrors = Partial<Record<keyof PortfolioFormValues, string>>

/**
 * Validate the relevant slice of PortfolioData.
 * Returns a flat { field: message } map (empty object means "valid").
 */
export function validatePortfolio(values: PortfolioFormValues): FieldErrors {
  const result = portfolioSchema.safeParse(values)
  if (result.success) return {}

  const errors: FieldErrors = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof PortfolioFormValues
    // Keep only the first message per field for clean inline display.
    if (field && !errors[field]) errors[field] = issue.message
  }
  return errors
}

// ---------------------------------------------------------------------------
// FILE VALIDATION
// Enforced on the file <input>: max 2MB and only PDF / JPG / PNG allowed.
// ---------------------------------------------------------------------------

export const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB in bytes
export const ACCEPTED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"]
export const ACCEPTED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"]

/**
 * Validate a single file. Returns an error string, or null when the file is OK.
 */
export function validateFile(file: File): string | null {
  const lowerName = file.name.toLowerCase()
  const hasValidExt = ACCEPTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext))
  const hasValidMime = ACCEPTED_MIME_TYPES.includes(file.type)

  if (!hasValidExt && !hasValidMime) {
    return `"${file.name}" is not allowed. Use PDF, JPG, or PNG.`
  }
  if (file.size > MAX_FILE_SIZE) {
    return `"${file.name}" is too large (max 2MB).`
  }
  return null
}
