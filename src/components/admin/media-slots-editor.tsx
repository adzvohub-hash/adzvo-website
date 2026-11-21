import { useEffect, useRef, useState } from "react";
import { Check, Copy, ExternalLink, ImageOff, Loader2, RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MediaSlot } from "@/lib/about-images";
import { R2_BASE, deleteMedia, saveServiceImages, uploadMedia } from "@/lib/api";

/**
 * A set of replaceable images or videos (one per "slot"), stored in R2.
 *
 * - Upload puts the new file in R2 straight away so it can be previewed;
 *   the live site only changes when you press Save changes.
 * - After a successful save, each replaced R2 file is deleted, so the site
 *   never points at a missing file and the bucket holds no old copies.
 * - Uploading again before saving, or pressing Undo, deletes the unsaved upload.
 * - "Use original" clears the link; the site falls back to the built-in file.
 * - Files listed in `protectedUrls` (the built-in originals) are never deleted.
 */

const isR2 = (url: string) => Boolean(url) && url.startsWith(R2_BASE);

export function MediaSlotsEditor({
  kind,
  title,
  description,
  slots,
  saved,
  onSaved,
  notify,
  fail,
  protectedUrls = [],
}: {
  kind: "image" | "video";
  title: string;
  description: string;
  slots: MediaSlot[];
  /** Every saved link (all slugs), keyed by slug. */
  saved: Record<string, string>;
  /** Called with the full, updated map after a successful save. */
  onSaved: (next: Record<string, string>) => void;
  notify: (msg: string) => void;
  fail: (msg: string) => void;
  protectedUrls?: string[];
}) {
  const savedHere = Object.fromEntries(slots.map((s) => [s.key, saved[s.key] ?? ""]));
  const [drafts, setDrafts] = useState<Record<string, string>>(savedHere);
  const [busy, setBusy] = useState<string | null>(null); // slot key being uploaded, or "save"
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const noun = kind === "video" ? "video" : "image";

  // keep drafts in step when the saved links load or change
  const savedSig = JSON.stringify(savedHere);
  useEffect(() => {
    setDrafts(JSON.parse(savedSig));
  }, [savedSig]);

  const canDelete = (url: string) => isR2(url) && !protectedUrls.includes(url);
  const changed = slots.filter((s) => (drafts[s.key] ?? "") !== (savedHere[s.key] ?? ""));

  /** Delete an upload that was never saved (keeps the bucket clean). */
  async function discardUnsaved(key: string) {
    const draft = drafts[key] ?? "";
    if (draft && draft !== savedHere[key] && canDelete(draft))
      await deleteMedia(draft).catch(() => {});
  }

  async function handleFile(key: string, file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith(`${noun}/`)) {
      fail(
        kind === "video"
          ? "Choose a video file (MP4 or WebM)."
          : "Choose an image file (JPG, PNG or WebP).",
      );
      return;
    }
    setBusy(key);
    try {
      await discardUnsaved(key);
      const url = await uploadMedia(file, kind === "video" ? "videos" : "images");
      setDrafts((d) => ({ ...d, [key]: url }));
      notify(
        `${kind === "video" ? "Video" : "Image"} uploaded — press Save changes to publish it.`,
      );
    } catch {
      fail("Upload failed. Check your connection and try again.");
    } finally {
      setBusy(null);
    }
  }

  async function chooseOriginal(key: string) {
    await discardUnsaved(key);
    setDrafts((d) => ({ ...d, [key]: "" }));
  }

  async function undo(key: string) {
    await discardUnsaved(key);
    setDrafts((d) => ({ ...d, [key]: savedHere[key] ?? "" }));
  }

  async function save() {
    if (changed.length === 0) {
      notify("No changes to save.");
      return;
    }
    setBusy("save");
    try {
      // Send every saved link (so other images are never lost) with these drafts on top.
      // Untouched empty slots aren't sent, so no blank rows are created.
      const next: Record<string, string> = { ...saved };
      for (const slot of slots) {
        const draft = drafts[slot.key] ?? "";
        if (draft || savedHere[slot.key]) next[slot.key] = draft;
      }
      await saveServiceImages(
        Object.entries(next).map(([slug, image_url]) => ({ slug, image_url })),
      );
      // Saved: now remove the replaced R2 files.
      await Promise.all(
        changed.map((s) => {
          const old = savedHere[s.key] ?? "";
          return old && old !== drafts[s.key] && canDelete(old)
            ? deleteMedia(old).catch(() => {})
            : Promise.resolve();
        }),
      );
      onSaved(next);
      notify(
        `Saved ${changed.length} ${noun}${changed.length > 1 ? "s" : ""}. Replaced files were removed from storage.`,
      );
    } catch (err) {
      fail(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {slots.map((slot, i) => {
          const draft = drafts[slot.key] ?? "";
          const isChanged = draft !== (savedHere[slot.key] ?? "");
          const shown = draft || slot.fallback;
          return (
            <article
              key={slot.key}
              className={`space-y-4 rounded-lg border bg-card p-4 ${isChanged ? "border-electric/60" : ""}`}
            >
              <Preview src={shown} video={kind === "video"} />
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-semibold">
                    {String(i + 1)}. {slot.label}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${draft ? "bg-electric/10 text-electric" : "bg-muted text-muted-foreground"}`}
                  >
                    {isChanged ? "Unsaved" : draft ? "Custom" : "Original"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{slot.hint}</p>
              </div>
              <PathField
                label={kind === "video" ? "Video R2 path" : "Image R2 path"}
                url={shown}
                isR2={isR2(shown)}
                unsaved={isChanged}
              />
              <input
                ref={(el) => {
                  fileRefs.current[slot.key] = el;
                }}
                type="file"
                accept={
                  kind === "video"
                    ? "video/mp4,video/webm,video/quicktime,video/*"
                    : "image/jpeg,image/png,image/webp,image/avif,image/*"
                }
                className="hidden"
                aria-label={`Upload ${slot.label} ${noun}`}
                onChange={(e) => {
                  void handleFile(slot.key, e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={busy !== null}
                  onClick={() => fileRefs.current[slot.key]?.click()}
                >
                  {busy === slot.key ? <Loader2 className="animate-spin" /> : <Upload />}
                  {busy === slot.key ? "Uploading…" : draft ? `Replace ${noun}` : `Upload ${noun}`}
                </Button>
                {draft && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={busy !== null}
                    onClick={() => void chooseOriginal(slot.key)}
                  >
                    <ImageOff />
                    Use original
                  </Button>
                )}
                {isChanged && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={busy !== null}
                    onClick={() => void undo(slot.key)}
                  >
                    <RotateCcw />
                    Undo
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-4 border-t pt-5">
        {changed.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {changed.length} unsaved change{changed.length > 1 ? "s" : ""}
          </p>
        )}
        <Button
          type="button"
          onClick={() => void save()}
          disabled={busy !== null}
          className="bg-electric text-primary-foreground hover:bg-electric/90"
        >
          {busy === "save" ? <Loader2 className="animate-spin" /> : <Check />}
          {busy === "save" ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}

/** Read-only link to the file in use, so it can be checked against the R2 bucket. */
function PathField({
  label,
  url,
  isR2: inR2,
  unsaved,
}: {
  label: string;
  url: string;
  isR2: boolean;
  unsaved: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const key = inR2 ? url.slice(R2_BASE.length + 1) : "";
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — the field can still be selected and copied by hand */
    }
  }
  return (
    <div className="grid gap-2 text-sm font-medium">
      <span>
        {label}
        {unsaved && <span className="ml-2 text-xs font-normal text-electric">(not saved yet)</span>}
      </span>
      {inR2 ? (
        <>
          <div className="flex gap-2">
            <Input
              value={url}
              readOnly
              onFocus={(e) => e.currentTarget.select()}
              aria-label={label}
              className="min-w-0 flex-1 text-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={copied ? "Copied" : "Copy link"}
              title={copied ? "Copied" : "Copy link"}
              onClick={() => void copy()}
            >
              {copied ? <Check /> : <Copy />}
            </Button>
            <Button type="button" variant="outline" size="icon" asChild>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open in a new tab"
                title="Open in a new tab"
              >
                <ExternalLink />
              </a>
            </Button>
          </div>
          <p className="text-xs font-normal text-muted-foreground">
            File in the bucket: <code className="rounded bg-muted px-1 py-0.5">{key}</code>
          </p>
        </>
      ) : (
        <p className="rounded-md border border-dashed px-3 py-2 text-xs font-normal text-muted-foreground">
          Built-in image, bundled with the site code — not stored in R2.
        </p>
      )}
    </div>
  );
}

function Preview({ src, video }: { src: string; video: boolean }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
      {failed || !src ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <ImageOff className="size-6" />
          <span className="text-xs">{video ? "Video" : "Image"} unavailable</span>
        </div>
      ) : video ? (
        <video
          key={src}
          src={src}
          controls
          muted
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <img
          src={src}
          alt=""
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
