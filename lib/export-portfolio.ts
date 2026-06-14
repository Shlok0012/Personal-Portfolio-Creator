import JSZip from "jszip"
import { saveAs } from "file-saver"
import { getTemplate } from "./templates"
import { type PortfolioData, parseSkills, type TemplateId } from "./types"

// ---------------------------------------------------------------------------
// EXPORT SYSTEM
// Turns the in-memory PortfolioData into a downloadable .zip containing:
//   1. index.html  -> a fully self-contained portfolio (HTML + inline CSS)
//   2. assets/...  -> the user's real uploaded files, cleanly renamed
// The links inside index.html point at ./assets/* so it works offline.
// ---------------------------------------------------------------------------

/** Small HTML-escape helper so user text can't break the generated markup. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/** Make a filesystem-friendly version of an uploaded file name. */
function cleanFileName(name: string, index: number): string {
  const dot = name.lastIndexOf(".")
  const ext = dot > -1 ? name.slice(dot) : ""
  const base = (dot > -1 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return `${String(index + 1).padStart(2, "0")}-${base || "file"}${ext}`
}

// ---------------------------------------------------------------------------
// Per-template CSS. Each block mirrors the look of the on-screen preview so the
// downloaded portfolio matches what the user designed.
// ---------------------------------------------------------------------------
function templateCss(template: TemplateId, accent: string): string {
  const base = `
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.6}
    a{color:${accent};text-decoration:none}
    a:hover{text-decoration:underline}
    h2{font-size:13px;text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;color:${accent}}
    .pill{display:inline-block;padding:6px 14px;border-radius:9999px;font-size:14px;margin:0 8px 8px 0}
    .files a{font-weight:600;display:inline-flex;gap:8px;align-items:center}
  `

  if (template === "professional-sidebar") {
    // Sticky left sidebar + scrolling main content on the right.
    return `${base}
      body{background:#0f172a;color:#e2e8f0}
      .layout{display:flex;min-height:100vh;flex-wrap:wrap}
      .sidebar{background:#1e293b;width:300px;flex-shrink:0;padding:48px 28px;border-right:4px solid ${accent};position:sticky;top:0;align-self:flex-start}
      .avatar{width:56px;height:56px;border-radius:9999px;background:rgba(52,211,153,.15);border:2px solid rgba(52,211,153,.4);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:${accent};margin-bottom:16px}
      .sidebar h1{font-size:26px;color:#fff;margin-bottom:4px}
      .role{color:${accent}}
      .block{border-top:1px solid #334155;margin-top:24px;padding-top:24px}
      .socials a{display:block;margin-bottom:8px;font-weight:600}
      .pill{background:rgba(52,211,153,.12);color:${accent};border:1px solid rgba(52,211,153,.3);font-size:12px}
      .main{flex:1;min-width:300px;padding:48px 40px}
      .main section{margin-bottom:40px}
      .files li{list-style:none;background:#1e293b;border:1px solid rgba(51,65,85,.6);padding:14px 16px;border-radius:10px;margin-bottom:10px}
    `
  }

  if (template === "creative-gradient") {
    // Asymmetric split hero + gradient panels + hover-lift cards.
    return `${base}
      body{background:linear-gradient(135deg,#1c1917,#1c1917,#451a03);color:#fef3c7;min-height:100vh}
      .cg{max-width:1000px;margin:0 auto;padding:32px 24px}
      .hero-grid{display:grid;grid-template-columns:3fr 2fr;gap:24px}
      .hero{background:linear-gradient(135deg,#fbbf24,#f97316,#fb7185);color:#1c1917;border-radius:20px;padding:40px}
      .hero .eyebrow{text-transform:uppercase;letter-spacing:2px;font-size:13px;font-weight:700;opacity:.7}
      .hero h1{font-size:48px;line-height:1.05;margin:12px 0;font-weight:800}
      .hero .role{font-size:18px;font-weight:700;opacity:.8}
      .hero p.bio{margin-top:20px;opacity:.78;max-width:28rem}
      .aside{display:flex;flex-direction:column;gap:20px}
      .card{background:rgba(255,255,255,.05);border:1px solid rgba(251,191,36,.2);border-radius:20px;padding:24px}
      .socials a{margin-right:16px;font-weight:600}
      .pill{background:rgba(251,191,36,.16);color:#fde68a;border:1px solid rgba(251,191,36,.35)}
      .files{margin-top:32px}
      .file-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
      .file-card{list-style:none;background:rgba(255,255,255,.05);border:1px solid rgba(251,191,36,.2);border-radius:14px;padding:16px;transition:transform .3s,box-shadow .3s,border-color .3s}
      .file-card:hover{transform:translateY(-4px);border-color:rgba(251,191,36,.5);box-shadow:0 10px 30px rgba(251,146,60,.15)}
      @media(max-width:640px){.hero-grid{grid-template-columns:1fr}.file-grid{grid-template-columns:1fr}.hero h1{font-size:36px}}
    `
  }

  // modern-minimal (default): centered, monochrome, vast negative space, grid focus.
  return `${base}
    body{background:#020617;color:#94a3b8}
    .hero{max-width:42rem;margin:0 auto;padding:96px 24px;text-align:center}
    .eyebrow{text-transform:uppercase;letter-spacing:6px;font-size:12px;color:#64748b}
    h1{font-size:56px;line-height:1.05;color:#fff;font-weight:600;margin:24px 0 12px;letter-spacing:-1px}
    .role{font-size:18px;font-weight:300;color:#94a3b8}
    .socials{margin-top:24px}
    .socials a{margin:0 12px;font-weight:500}
    .bio{max-width:36rem;margin:40px auto 0;font-weight:300;color:#94a3b8}
    .divider{border-top:1px solid #1e293b}
    .body{max-width:48rem;margin:0 auto;padding:64px 24px}
    .skills{text-align:center;margin-bottom:64px}
    .skill-row span{font-weight:300;color:#cbd5e1;margin:0 12px;display:inline-block}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#1e293b;border:1px solid #1e293b;border-radius:12px;overflow:hidden}
    .grid .cell{background:#020617;padding:24px}
    .grid .cell:hover{background:#0f172a}
    .center{text-align:center}
    @media(max-width:640px){.grid{grid-template-columns:1fr}h1{font-size:40px}}
  `
}

/** Build the row of social / contact links (shared across templates). */
function socialsHtml(data: PortfolioData): string {
  return [
    data.email ? `<a href="mailto:${esc(data.email)}">Email</a>` : "",
    data.github ? `<a href="${esc(data.github)}" target="_blank" rel="noopener">GitHub</a>` : "",
    data.linkedin ? `<a href="${esc(data.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : "",
  ]
    .filter(Boolean)
    .join("")
}

/**
 * Render the inner body markup. Each template produces a STRUCTURALLY distinct
 * layout that mirrors its on-screen React component.
 */
function bodyMarkup(data: PortfolioData, assetLinks: { label: string; href: string }[]): string {
  const skills = parseSkills(data.skills)
  const socials = socialsHtml(data)
  const name = esc(data.fullName || "Your Name")
  const role = esc(data.title || "Your Title")
  const fileLink = (f: { label: string; href: string }) =>
    `<a href="${esc(f.href)}" download>📄 ${esc(f.label)}</a>`

  // ----- Template 2: Professional Sidebar -----
  if (data.template === "professional-sidebar") {
    const initials =
      (data.fullName || "Your Name")
        .split(" ")
        .map((w) => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase() || "YN"
    const skillPills = skills.map((s) => `<span class="pill">${esc(s)}</span>`).join("")
    return `
      <div class="layout">
        <aside class="sidebar">
          <div class="avatar">${esc(initials)}</div>
          <h1>${name}</h1>
          <p class="role">${role}</p>
          ${socials ? `<div class="block"><h2>Links</h2><div class="socials">${socials}</div></div>` : ""}
          ${skills.length ? `<div class="block"><h2>Skills</h2><div>${skillPills}</div></div>` : ""}
        </aside>
        <main class="main">
          ${data.bio ? `<section><h2>About Me</h2><p>${esc(data.bio)}</p></section>` : ""}
          ${
            assetLinks.length
              ? `<section><h2>Downloadable Attachments</h2><ul class="files">${assetLinks
                  .map((f) => `<li>${fileLink(f)}</li>`)
                  .join("")}</ul></section>`
              : ""
          }
        </main>
      </div>
    `
  }

  // ----- Template 3: Creative Gradient (asymmetric split hero) -----
  if (data.template === "creative-gradient") {
    const skillPills = skills.map((s) => `<span class="pill">${esc(s)}</span>`).join("")
    return `
      <div class="cg">
        <div class="hero-grid">
          <div class="hero">
            <p class="eyebrow">Creative Portfolio</p>
            <h1>${name}</h1>
            <p class="role">${role}</p>
            ${data.bio ? `<p class="bio">${esc(data.bio)}</p>` : ""}
          </div>
          <div class="aside">
            ${socials ? `<div class="card"><h2>Connect</h2><div class="socials">${socials}</div></div>` : ""}
            ${skills.length ? `<div class="card"><h2>Skills</h2><div>${skillPills}</div></div>` : ""}
          </div>
        </div>
        ${
          assetLinks.length
            ? `<div class="files"><h2>Downloadable Attachments</h2><ul class="file-grid">${assetLinks
                .map((f) => `<li class="file-card">${fileLink(f)}</li>`)
                .join("")}</ul></div>`
            : ""
        }
      </div>
    `
  }

  // ----- Template 1: Modern Minimal (centered + project grid) -----
  const skillRow = skills.map((s) => `<span>${esc(s)}</span>`).join("")
  return `
    <header class="hero">
      <p class="eyebrow">Portfolio</p>
      <h1>${name}</h1>
      <p class="role">${role}</p>
      ${socials ? `<div class="socials">${socials}</div>` : ""}
      ${data.bio ? `<p class="bio">${esc(data.bio)}</p>` : ""}
    </header>
    <div class="divider"></div>
    <div class="body">
      ${skills.length ? `<div class="skills"><h2 class="center">Skills</h2><div class="skill-row">${skillRow}</div></div>` : ""}
      ${
        assetLinks.length
          ? `<div><h2 class="center">Selected Work</h2><div class="grid">${assetLinks
              .map((f) => `<div class="cell">${fileLink(f)}</div>`)
              .join("")}</div></div>`
          : ""
      }
    </div>
  `
}

/** Build the complete standalone index.html string. */
export function buildPortfolioHtml(data: PortfolioData, assetLinks: { label: string; href: string }[]): string {
  const meta = getTemplate(data.template)
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(data.fullName || "Portfolio")} — Portfolio</title>
<style>${templateCss(data.template, meta.accentHex)}</style>
</head>
<body>
${bodyMarkup(data, assetLinks)}
</body>
</html>`
}

/**
 * Main entry point used by the UI.
 * Bundles index.html + assets/ into a ZIP and triggers a browser download.
 */
export async function downloadPortfolioZip(data: PortfolioData): Promise<void> {
  const zip = new JSZip()
  const assets = zip.folder("assets")!

  // 1. Add each uploaded file to assets/ and record its clean relative link.
  const assetLinks = data.files.map((uploaded, index) => {
    const cleanName = cleanFileName(uploaded.name, index)
    assets.file(cleanName, uploaded.file)
    return { label: uploaded.name, href: `assets/${cleanName}` }
  })

  // 2. Generate the self-contained HTML that references those assets.
  zip.file("index.html", buildPortfolioHtml(data, assetLinks))

  // 3. Generate the blob and trigger the download with file-saver's saveAs().
  const blob = await zip.generateAsync({ type: "blob" })
  const fileName = `${(data.fullName || "portfolio").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-portfolio.zip`
  saveAs(blob, fileName)
}
