import { useEffect, useRef, useState } from "react";
import { Upload, ImageOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validMediaUrl } from "@/lib/admin-preview";
import { uploadMedia, deleteMedia } from "@/lib/api";

/** Guess whether a URL points to a video based on its extension. */
function looksLikeVideo(src: string) {
  return /\.(mp4|webm|ogg|ogv|mov|avi|mkv|3gp|wmv)(\?.*)?$/i.test(src);
}

export function MediaPreview({ src, video = false }: { src: string; video?: boolean }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  // Determine render mode: explicit prop wins; fall back to extension sniff
  const renderAsVideo = video || looksLikeVideo(src);

  return <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
    {!src || failed
      ? <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <ImageOff className="size-6" />
          <span className="text-xs">{failed ? "Media unavailable" : "No media selected"}</span>
        </div>
      : renderAsVideo
        ? <video key={src} src={src} controls muted playsInline preload="metadata" onError={() => setFailed(true)} className="h-full w-full object-cover" />
        : <img src={src} alt="Media preview" onError={() => setFailed(true)} className="h-full w-full object-contain" />}
  </div>;
}

export function MediaField({ label, value, onChange, video = false }: {
  label: string; value: string; onChange: (value: string) => void; video?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (video ? !isVideo : !isImage) {
      setError(`Choose a ${video ? "video" : "image"} file.`); return;
    }
    setError(""); setUploading(true);
    try {
      // Delete the old R2 file before uploading the replacement
      if (value) await deleteMedia(value).catch(() => { /* ignore if old file already gone */ });
      const url = await uploadMedia(file, video ? "videos" : "images");
      onChange(url);
    } catch {
      setError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return <div className="space-y-2">
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <Input value={value} onChange={(e) => { onChange(e.target.value); setError(""); }} placeholder="https://…" />
    </label>
    <div className="flex flex-wrap items-center gap-3">
      <input ref={input} type="file"
        accept={video
          ? "video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo,video/x-matroska,video/3gpp,video/x-ms-wmv,video/*"
          : "image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml,image/tiff,image/bmp,image/heic,image/heif,image/x-icon,image/*"}
        className="hidden"
        aria-label={`Upload ${label}`} onChange={handleFile} />
      <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => input.current?.click()}>
        {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
        {uploading ? "Uploading…" : `Upload ${video ? "video" : "image"}`}
      </Button>
      {value && <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>Clear</Button>}
    </div>
    {(error || !validMediaUrl(value)) && (
      <p role="alert" className="text-xs text-destructive">
        {error || "Use an HTTPS URL or upload a file."}
      </p>
    )}
  </div>;
}
