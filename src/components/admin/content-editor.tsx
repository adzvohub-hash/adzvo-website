import { useId, useRef, useState, type FormEvent } from "react";
import { Save, Upload, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MediaField, MediaPreview } from "./media-field";
import { servicePages } from "@/lib/services";
import { projectLocations } from "@/lib/projects";
import { validMediaUrl } from "@/lib/admin-preview";
import { uploadMedia, deleteMedia } from "@/lib/api";
import type { Project, Insight } from "@/lib/api";

export const selectClass = "h-10 w-full rounded-md border border-input bg-card px-3 text-sm";

export function TextField({ label, value, onChange, required = false, multiline = false }: {
  label: string; value: string; onChange: (value: string) => void; required?: boolean; multiline?: boolean;
}) {
  const id = useId();
  return <div className="grid gap-2 text-sm font-medium">
    <label htmlFor={id}>{label}</label>
    {multiline
      ? <Textarea id={id} required={required} value={value} onChange={(e) => onChange(e.target.value)} rows={4} />
      : <Input id={id} required={required} value={value} onChange={(e) => onChange(e.target.value)} />}
  </div>;
}

// ─── PDF upload field ─────────────────────────────────────────────────────────

function PdfField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const filename = value ? value.split("/").pop() ?? value : null;

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") { setError("Choose a PDF file."); return; }
    setError(""); setUploading(true);
    try {
      if (value) await deleteMedia(value).catch(() => {});
      const url = await uploadMedia(file, "case-studies" as "images");
      onChange(url);
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return <div className="space-y-2">
    <p className="text-sm font-medium">{label}</p>
    <div className="flex flex-wrap items-center gap-3">
      <input ref={input} type="file" accept="application/pdf" className="hidden"
        aria-label={`Upload ${label}`} onChange={handleFile} />
      <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => input.current?.click()}>
        {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
        {uploading ? "Uploading…" : "Upload PDF"}
      </Button>
      {filename && (
        <span className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
          <FileText className="size-3" />{filename}
          <button type="button" onClick={() => onChange("")} className="ml-1 hover:text-destructive"><X className="size-3" /></button>
        </span>
      )}
    </div>
    <Input value={value} onChange={(e) => { onChange(e.target.value); setError(""); }}
      placeholder="https://… or upload above" className="text-xs" />
    {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
  </div>;
}

// ─── Project editor ───────────────────────────────────────────────────────────

type ProjectDraft = Omit<Project, "created_at" | "updated_at">;

export function ProjectEditor({ item, isNew, onClose, onSave }: {
  item: ProjectDraft; isNew: boolean; onClose: () => void; onSave: (item: ProjectDraft) => Promise<void>;
}) {
  const [draft, setDraft] = useState({ ...item });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.client.trim() || !draft.description.trim() ||
        !validMediaUrl(draft.image_url)) {
      setError("Complete the required fields and check the image link."); return;
    }
    setSaving(true);
    try {
      await onSave({ ...draft, title: draft.title.trim(), client: draft.client.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent className="max-h-[90svh] max-w-2xl overflow-y-auto rounded-lg">
      <DialogHeader>
        <DialogTitle>{isNew ? "Add project" : "Edit project"}</DialogTitle>
        <DialogDescription>Changes are saved to the database.</DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-5">
        <TextField label="Project title" required value={draft.title} onChange={(title) => setDraft({ ...draft, title })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Client" required value={draft.client} onChange={(client) => setDraft({ ...draft, client })} />
          <label className="grid gap-2 text-sm font-medium">Location
            <select className={selectClass} value={draft.location} onChange={(e) => {
              const loc = projectLocations.find((l) => l === e.target.value);
              if (loc) setDraft({ ...draft, location: loc });
            }}>{projectLocations.map((l) => <option key={l}>{l}</option>)}</select>
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium">Service category
          <select className={selectClass} value={draft.service} onChange={(e) => {
            const svc = servicePages.find((s) => s.slug === e.target.value);
            if (svc) setDraft({ ...draft, service: svc.slug });
          }}>{servicePages.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}</select>
        </label>
        <TextField label="Project description" required multiline value={draft.description} onChange={(description) => setDraft({ ...draft, description })} />
        <MediaField label="Project image URL" value={draft.image_url} onChange={(image_url) => setDraft({ ...draft, image_url })} />
        <MediaPreview src={validMediaUrl(draft.image_url) ? draft.image_url : ""} />
        <PdfField label="Case study PDF (optional)" value={draft.case_study_url} onChange={(case_study_url) => setDraft({ ...draft, case_study_url })} />
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end gap-2 border-t pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}><Save />{saving ? "Saving…" : "Save"}</Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>;
}

// ─── Insight editor ───────────────────────────────────────────────────────────

type InsightDraft = Omit<Insight, "created_at" | "updated_at">;

export function InsightEditor({ item, isNew, onClose, onSave }: {
  item: InsightDraft; isNew: boolean; onClose: () => void; onSave: (item: InsightDraft) => Promise<void>;
}) {
  const [draft, setDraft] = useState({ ...item, images: [item.images[0] ?? "", item.images[1] ?? "", item.images[2] ?? ""] });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (![draft.title, draft.tag, draft.excerpt, draft.body].every((v) => v.trim()) ||
        !draft.images.every(validMediaUrl)) {
      setError("Complete the required fields and check the image links."); return;
    }
    setSaving(true);
    try {
      await onSave({ ...draft, title: draft.title.trim(), images: draft.images.filter(Boolean) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent className="max-h-[90svh] max-w-2xl overflow-y-auto rounded-lg">
      <DialogHeader>
        <DialogTitle>{isNew ? "Add insight" : "Edit insight"}</DialogTitle>
        <DialogDescription>Changes are saved to the database.</DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-5">
        <TextField label="Article title" required value={draft.title} onChange={(title) => setDraft({ ...draft, title })} />
        <TextField label="Category" required value={draft.tag} onChange={(tag) => setDraft({ ...draft, tag })} />
        <TextField label="Excerpt" required multiline value={draft.excerpt} onChange={(excerpt) => setDraft({ ...draft, excerpt })} />
        <TextField label="Article body" required multiline value={draft.body} onChange={(body) => setDraft({ ...draft, body })} />
        {draft.images.map((img, i) => (
          <MediaField key={i} label={`Carousel image ${i + 1} URL`} value={img}
            onChange={(value) => setDraft({ ...draft, images: draft.images.map((cur, j) => j === i ? value : cur) })} />
        ))}
        <MediaPreview src={validMediaUrl(draft.images[0] ?? "") ? draft.images[0] ?? "" : ""} />
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end gap-2 border-t pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}><Save />{saving ? "Saving…" : "Save"}</Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>;
}
