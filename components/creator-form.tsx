"use client"

import type React from "react"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Briefcase, Code2, FileText, Mail, Sparkles, Trash2, Upload, User } from "lucide-react"
import { TemplateSelector } from "./template-selector"
import { type PortfolioFormValues, portfolioSchema, validateFile } from "@/lib/schema"
import type { PortfolioData, TemplateId, UploadedFile } from "@/lib/types"

// ---------------------------------------------------------------------------
// THE CREATOR FORM
// Sectioned form covering profile data, document uploads, and template choice.
//
// Validation is powered by React Hook Form + Zod (zodResolver). RHF owns the
// validated text fields; files and the selected template live in the parent
// (PortfolioData) so they survive switching to the preview and back.
// ---------------------------------------------------------------------------

interface CreatorFormProps {
  data: PortfolioData
  onChange: (patch: Partial<PortfolioData>) => void
  onGenerate: () => void
}

/** A small labelled section wrapper used to group related fields. */
function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-5">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-indigo-300">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  )
}

/** Inline red error message rendered below an invalid field. */
function ErrorText({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  )
}

/** Shared input styling. Adds a red ring when the field has an error. */
function inputClass(hasError: boolean) {
  return `w-full rounded-lg border bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:ring-2 ${
    hasError
      ? "border-red-500/70 focus:border-red-400 focus:ring-red-500/30"
      : "border-slate-700 focus:border-indigo-400 focus:ring-indigo-500/30"
  }`
}

export function CreatorForm({ data, onChange, onGenerate }: CreatorFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  // ----- React Hook Form setup -----
  // `mode: "onChange"` re-validates on every keystroke so the Generate button
  // can be enabled/disabled live. defaultValues are hydrated from the parent
  // data object, which is how the form is repopulated after clicking "Edit".
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    mode: "onChange",
    defaultValues: {
      name: data.fullName,
      email: data.email,
      githubUrl: data.github,
      bio: data.bio,
      title: data.title,
      skills: data.skills,
      linkedin: data.linkedin,
    },
  })

  // Live character count for the bio field.
  const bioValue = watch("bio") ?? ""

  // Validate each selected file (size + extension) before storing it.
  function handleFiles(fileList: FileList | null) {
    if (!fileList) return
    setFileError(null)

    const accepted: UploadedFile[] = []
    for (const file of Array.from(fileList)) {
      const error = validateFile(file)
      if (error) {
        setFileError(error)
        continue // skip invalid files, keep validating the rest
      }
      accepted.push({ id: crypto.randomUUID(), name: file.name, file })
    }

    if (accepted.length) onChange({ files: [...data.files, ...accepted] })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function removeFile(id: string) {
    onChange({ files: data.files.filter((f) => f.id !== id) })
  }

  // On a valid submit, push all validated values up to the parent state, then
  // switch to the preview. (Files + template are already synced via onChange.)
  function onSubmit(values: PortfolioFormValues) {
    onChange({
      fullName: values.name,
      email: values.email,
      github: values.githubUrl,
      bio: values.bio,
      title: values.title ?? "",
      skills: values.skills ?? "",
      linkedin: values.linkedin ?? "",
    })
    onGenerate()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* ---------------- Profile Data ---------------- */}
      <Section icon={<User className="h-4 w-4" />} title="Profile Data">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">Full Name</label>
            <input className={inputClass(!!errors.name)} placeholder="Ada Lovelace" {...register("name")} />
            <ErrorText message={errors.name?.message} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">Title</label>
            <input className={inputClass(false)} placeholder="Frontend Developer" {...register("title")} />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-300">
            <Mail className="h-3.5 w-3.5" /> Email
          </label>
          <input
            type="email"
            className={inputClass(!!errors.email)}
            placeholder="ada@example.com"
            {...register("email")}
          />
          <ErrorText message={errors.email?.message} />
        </div>

        <div className="mt-4">
          <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-300">
            <span>About Me</span>
            <span className={bioValue.length > 300 ? "text-red-400" : "text-slate-500"}>{bioValue.length}/300</span>
          </label>
          <textarea
            rows={4}
            className={`${inputClass(!!errors.bio)} resize-none`}
            placeholder="A short bio (50-300 characters) about who you are and what you build..."
            {...register("bio")}
          />
          <ErrorText message={errors.bio?.message} />
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            Skills <span className="text-slate-500">(comma-separated)</span>
          </label>
          <input
            className={inputClass(false)}
            placeholder="React, TypeScript, Node.js, Figma"
            {...register("skills")}
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-300">
              <Code2 className="h-3.5 w-3.5" /> GitHub URL
            </label>
            <input
              className={inputClass(!!errors.githubUrl)}
              placeholder="https://github.com/username"
              {...register("githubUrl")}
            />
            <ErrorText message={errors.githubUrl?.message} />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-300">
              <Briefcase className="h-3.5 w-3.5" /> LinkedIn URL <span className="text-slate-500">(optional)</span>
            </label>
            <input
              className={inputClass(!!errors.linkedin)}
              placeholder="https://linkedin.com/in/username"
              {...register("linkedin")}
            />
            <ErrorText message={errors.linkedin?.message} />
          </div>
        </div>
      </Section>

      {/* ---------------- Document Uploads ---------------- */}
      <Section icon={<Upload className="h-4 w-4" />} title="Document Uploads">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          aria-label="Upload documents"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-600 bg-slate-900/40 px-4 py-6 text-sm text-slate-400 transition hover:border-indigo-400 hover:text-indigo-300"
        >
          <Upload className="h-4 w-4" />
          Upload Resume / screenshots (PDF, JPG, PNG &middot; max 2MB each)
        </button>

        {/* File validation error */}
        <ErrorText message={fileError ?? undefined} />

        {/* Uploaded file list with delete icons */}
        {data.files.length > 0 && (
          <ul className="mt-4 space-y-2">
            {data.files.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2"
              >
                <span className="flex min-w-0 items-center gap-2 text-sm text-slate-200">
                  <FileText className="h-4 w-4 shrink-0 text-indigo-400" />
                  <span className="truncate">{f.name}</span>
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(f.id)}
                  aria-label={`Remove ${f.name}`}
                  className="shrink-0 rounded-md p-1.5 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* ---------------- Visual Template Selector ---------------- */}
      <Section icon={<Sparkles className="h-4 w-4" />} title="Choose Your Portfolio Layout">
        <TemplateSelector selected={data.template} onSelect={(id: TemplateId) => onChange({ template: id })} />
      </Section>

      {/* ---------------- Generate (disabled until the form is valid) ---------------- */}
      <button
        type="submit"
        disabled={!isValid}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-500"
      >
        <Sparkles className="h-4 w-4" />
        {isValid ? "Generate Portfolio" : "Complete required fields to continue"}
      </button>
    </form>
  )
}
