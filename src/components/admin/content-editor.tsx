import { useId, useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MediaField, MediaPreview } from "./media-field";
import { servicePages } from "@/lib/services";
import { projectLocations } from "@/lib/projects";
import { validMediaUrl, type AdminPost, type AdminProject } from "@/lib/admin-preview";

export const selectClass = "h-10 w-full rounded-md border border-input bg-card px-3 text-sm";
export function TextField({ label, value, onChange, required = false, multiline = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; multiline?: boolean }) {
  const id = useId();
  return <div className="grid gap-2 text-sm font-medium"><label htmlFor={id}>{label}</label>{multiline ? <Textarea id={id} required={required} value={value} onChange={(event) => onChange(event.target.value)} rows={4} /> : <Input id={id} required={required} value={value} onChange={(event) => onChange(event.target.value)} />}</div>;
}

export function ProjectEditor({ item, onClose, onSave }: { item: AdminProject; onClose: () => void; onSave: (item: AdminProject) => void }) {
  const [draft, setDraft] = useState({ ...item });
  const [error, setError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.client.trim() || !draft.description.trim() || !validMediaUrl(draft.image) || !validMediaUrl(draft.caseStudyUrl)) { setError("Complete the required fields and check the media links."); return; }
    onSave({ ...draft, title: draft.title.trim(), client: draft.client.trim() });
  }
  return <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}><DialogContent className="max-h-[90svh] max-w-2xl overflow-y-auto rounded-lg">
    <DialogHeader><DialogTitle>{item.title ? "Edit project" : "Add project"}</DialogTitle><DialogDescription>Temporary project draft. Changes are not published.</DialogDescription></DialogHeader>
    <form onSubmit={submit} className="space-y-5">
      <TextField label="Project title" required value={draft.title} onChange={(title) => setDraft({ ...draft, title })} />
      <div className="grid gap-4 sm:grid-cols-2"><TextField label="Client" required value={draft.client} onChange={(client) => setDraft({ ...draft, client })} />
        <label className="grid gap-2 text-sm font-medium">Location<select className={selectClass} value={draft.location} onChange={(event) => {
          const location = projectLocations.find((location) => location === event.target.value);
          if (location) setDraft({ ...draft, location });
        }}>{projectLocations.map((location) => <option key={location}>{location}</option>)}</select></label></div>
      <label className="grid gap-2 text-sm font-medium">Service category<select className={selectClass} value={draft.service} onChange={(event) => {
        const service = servicePages.find((service) => service.slug === event.target.value);
        if (service) setDraft({ ...draft, service: service.slug });
      }}>{servicePages.map((service) => <option key={service.slug} value={service.slug}>{service.title}</option>)}</select></label>
      <TextField label="Project description" required multiline value={draft.description} onChange={(description) => setDraft({ ...draft, description })} />
      <MediaField label="Project image URL" value={draft.image} onChange={(image) => setDraft({ ...draft, image })} />
      <MediaPreview src={validMediaUrl(draft.image) ? draft.image : ""} />
      <TextField label="Case study PDF URL" value={draft.caseStudyUrl} onChange={(caseStudyUrl) => setDraft({ ...draft, caseStudyUrl })} />
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end gap-2 border-t pt-4"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit"><Save />Apply changes</Button></div>
    </form>
  </DialogContent></Dialog>;
}

export function InsightEditor({ item, onClose, onSave }: { item: AdminPost; onClose: () => void; onSave: (item: AdminPost) => void }) {
  const [draft, setDraft] = useState({ ...item, images: [item.images[0] ?? "", item.images[1] ?? "", item.images[2] ?? ""] });
  const [error, setError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    if (![draft.title, draft.tag, draft.excerpt, draft.body].every((value) => value.trim()) || !draft.images.every(validMediaUrl)) { setError("Complete the required fields and check the image links."); return; }
    onSave({ ...draft, title: draft.title.trim(), images: draft.images.filter(Boolean) });
  }
  return <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}><DialogContent className="max-h-[90svh] max-w-2xl overflow-y-auto rounded-lg">
    <DialogHeader><DialogTitle>{item.title ? "Edit insight" : "Add insight"}</DialogTitle><DialogDescription>Temporary article draft. Changes are not published.</DialogDescription></DialogHeader>
    <form onSubmit={submit} className="space-y-5">
      <TextField label="Article title" required value={draft.title} onChange={(title) => setDraft({ ...draft, title })} />
      <TextField label="Category" required value={draft.tag} onChange={(tag) => setDraft({ ...draft, tag })} />
      <TextField label="Excerpt" required multiline value={draft.excerpt} onChange={(excerpt) => setDraft({ ...draft, excerpt })} />
      <TextField label="Article body" required multiline value={draft.body} onChange={(body) => setDraft({ ...draft, body })} />
      {draft.images.map((image, index) => <MediaField key={index} label={`Carousel image ${index + 1} URL`} value={image} onChange={(value) => setDraft({ ...draft, images: draft.images.map((current, i) => i === index ? value : current) })} />)}
      <MediaPreview src={validMediaUrl(draft.images[0] ?? "") ? draft.images[0] ?? "" : ""} />
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end gap-2 border-t pt-4"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit"><Save />Apply changes</Button></div>
    </form>
  </DialogContent></Dialog>;
}