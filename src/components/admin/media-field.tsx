import { useEffect, useRef, useState } from "react";
import { Upload, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validMediaUrl } from "@/lib/admin-preview";

export function MediaPreview({ src, video = false }: { src: string; video?: boolean }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
    {!src || failed ? <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground"><ImageOff className="size-6" /><span className="text-xs">{failed ? "Media unavailable" : "No media selected"}</span></div>
      : video ? <video key={src} src={src} controls muted playsInline preload="metadata" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      : <img src={src} alt="Media preview" onError={() => setFailed(true)} className="h-full w-full object-cover" />}
  </div>;
}

export function MediaField({ label, value, onChange, video = false }: { label: string; value: string; onChange: (value: string) => void; video?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  return <div className="space-y-2">
    <label className="grid gap-2 text-sm font-medium">{label}<Input value={value} onChange={(event) => { onChange(event.target.value); setError(""); }} placeholder="https://…" /></label>
    <div className="flex flex-wrap items-center gap-3">
      <input ref={input} type="file" accept={video ? "video/*" : "image/*"} className="hidden" aria-label={`Upload ${label}`} onChange={(event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith(video ? "video/" : "image/")) { setError("Choose a matching media file."); return; }
        // Keep preview URLs alive across editor/tab unmounts; the browser releases
        // document-owned URLs on refresh, when all temporary content resets.
        const url = URL.createObjectURL(file); onChange(url); setError(""); event.target.value = "";
      }} />
      <Button type="button" variant="outline" size="sm" onClick={() => input.current?.click()}><Upload />Upload {video ? "video" : "image"}</Button>
      {value && <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>Clear</Button>}
    </div>
    {(error || !validMediaUrl(value)) && <p role="alert" className="text-xs text-destructive">{error || "Use an HTTPS URL or a local file."}</p>}
  </div>;
}