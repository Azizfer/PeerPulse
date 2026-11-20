"use client"

import { useEffect, useRef, useState } from "react"
import { Bookmark, Download, FileText, FolderOpen, Search, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CustomSelect } from "@/components/ui/custom-select"

type Resource = { id: string; name: string; subject: string; bytes: number; url: string; saved: boolean }
const subjects = ["General", "Mathematics", "Computer Science", "Chemistry", "Physics", "Biology", "Languages", "History"]
export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [query, setQuery] = useState("")
  const [subject, setSubject] = useState("all")
  const [uploadSubject, setUploadSubject] = useState("General")
  const [savedOnly, setSavedOnly] = useState(false)
  const [error, setError] = useState("")
  const input = useRef<HTMLInputElement>(null)
  const urls = useRef<string[]>([])
  useEffect(() => () => { urls.current.forEach(url => URL.revokeObjectURL(url)) }, [])
  const visible = resources.filter(item => (!savedOnly || item.saved) && (subject === "all" || item.subject === subject) && item.name.toLowerCase().includes(query.trim().toLowerCase()))
  return (
    <div className="min-h-screen bg-paper"><main className="container-page max-w-5xl py-10 sm:py-14">
      <header className="mb-8"><p className="eyebrow">Your study library</p><h1 className="mt-2 font-display text-[36px] font-extrabold tracking-tight text-ink">Resources</h1><p className="mt-3 text-sm leading-7 text-ink-soft">Keep notes, exercises, and past papers organized by subject.</p></header>
      <section className="mb-6 rounded-3xl border border-line bg-surface p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div><h2 className="text-sm font-semibold text-ink">Add study material</h2><p className="mt-1 text-xs leading-6 text-ink-soft">Choose its subject, then add a file up to 10 MB.</p></div>
          <div className="flex flex-wrap items-center gap-2"><CustomSelect className="w-48" value={uploadSubject} onChange={setUploadSubject} options={subjects.map(value => ({ value, label: value }))} /><Button variant="accent" onClick={() => input.current?.click()}><Upload className="size-3.5" /> Add files</Button></div>
        </div>
        <input ref={input} type="file" multiple className="hidden" aria-label="Add study resources" accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp" onChange={event => {
          const files = Array.from(event.target.files || []); event.target.value = ""
          if (files.some(file => file.size > 10 * 1024 * 1024)) { setError("Each file must be smaller than 10 MB."); return }
          setError("")
          const additions = files.map(file => { const url = URL.createObjectURL(file); urls.current.push(url); return { id: crypto.randomUUID(), name: file.name, subject: uploadSubject, bytes: file.size, url, saved: false } })
          setResources(previous => [...additions, ...previous]); setSubject("all"); setSavedOnly(false)
        }} />
        {error && <p role="alert" className="mt-3 text-xs text-rose-deep">{error}</p>}
      </section>
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-[180px] flex-1"><Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-mute" /><Input className="pl-9 text-sm" placeholder="Search your materials" aria-label="Search resources" value={query} onChange={event => setQuery(event.target.value)} /></div>
        <CustomSelect className="w-48" value={subject} onChange={setSubject} options={[{ value: "all", label: "All subjects" }, ...subjects.map(value => ({ value, label: value }))]} />
        <Button variant={savedOnly ? "subtle" : "secondary"} aria-pressed={savedOnly} onClick={() => setSavedOnly(value => !value)}><Bookmark className="size-3.5" /> Saved</Button>
      </div>
      <p className="mb-4 text-xs text-ink-mute">{visible.length} {visible.length === 1 ? "resource" : "resources"}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visible.map(item => <article key={item.id} className="min-w-0 rounded-2xl border border-line bg-surface p-5 shadow-soft">
        <div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-xl bg-surface-sunken text-pulse-dark"><FileText className="size-4" /></span><div className="flex"><Button variant="ghost" size="icon-sm" aria-label={item.saved ? "Unsave resource" : "Save resource"} aria-pressed={item.saved} onClick={() => setResources(previous => previous.map(resource => resource.id === item.id ? { ...resource, saved: !resource.saved } : resource))}><Bookmark className={`size-3.5 ${item.saved ? "fill-pulse-soft text-pulse-dark" : ""}`} /></Button><Button variant="ghost" size="icon-sm" aria-label={`Remove ${item.name}`} onClick={() => setResources(previous => previous.filter(resource => resource.id !== item.id))}><X className="size-3.5" /></Button></div></div>
        <h2 className="mt-4 break-all text-sm font-semibold leading-6 text-ink">{item.name}</h2><p className="mt-1 text-xs text-ink-mute">{item.subject} · {(item.bytes / 1024 / 1024).toFixed(1)} MB</p><Button asChild variant="secondary" size="sm" className="mt-5 w-full"><a href={item.url} download={item.name}><Download className="size-3.5" /> Download</a></Button>
      </article>)}</div>
      {!visible.length && <div className="rounded-3xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center"><FolderOpen className="mx-auto size-6 text-pulse-dark" strokeWidth={1.6} /><h2 className="mt-4 text-base font-semibold text-ink">{resources.length ? "No matching materials" : "Your library starts here"}</h2><p className="mt-2 text-sm text-ink-soft">{resources.length ? "Try another subject or search." : "Add your first set of notes, an exercise sheet, or a past paper."}</p></div>}
      <p className="mt-5 text-[11px] leading-5 text-ink-mute">Local library preview · files stay in this page. Community sharing and permanent storage are not connected.</p>
    </main></div>
  )
}
