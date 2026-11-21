import { useEffect, useRef, useState } from "react";
import { Check, Loader2, RotateCcw, Upload, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ABOUT_IMAGE_SLOTS } from "@/lib/about-images";
import { R2_BASE, deleteMedia, saveServiceImages, uploadMedia } from "@/lib/api";

/**
 * Admin › About › Chapter background images.
 *
 * - Upload puts the new image in R2 straight away (so you can preview it).
 * - Save stores the new links; only after a successful save is each replaced
 *   R2 image deleted, so the live site never points at a missing file.
 * - Uploading again before saving deletes the unsaved upload, and "Undo"
 *   deletes it too — nothing is left behind in the bucket.
 * - "Use built-in image" clears the link; the site falls back to the image
 *   bundled with the code (and the old R2 file is deleted on save).
 */

const isR2 = (url: string) => Boolean(url) && url.startsWith(R2_BASE);

export function AboutImagesEditor({
  saved,
  onSaved,
  notify,
  fail,
}: {
  /** Every saved image link (service images + about images), keyed by slug. */
  saved: Record<string, string>;
  /** Called with the full, updated map after a successful save. */
  onSaved: (next: Record<string, string>) => void;
  notify: (msg: string) => void;
  fail: (msg: string) => void;
}) {
  const savedAbout = Object.fromEntries(ABOUT_IMAGE_SLOTS.map((s) => [s.key, saved[s.key] ?? ""]));
  const [drafts, setDrafts] = useState<Record<string, string>>(savedAbout);
  const [busy, setBusy] = useState<string | null>(null); // slot key being uploaded, or "save"
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // keep drafts in step when the saved links load or change
  const savedSig = JSON.stringify(savedAbout);
  useEffect(() => {
    setDrafts(JSON.parse(savedSig));
  }, [savedSig]);

  const changed = ABOUT_IMAGE_SLOTS.filter(
    (s) => (drafts[s.key] ?? "") !== (savedAbout[s.key] ?? ""),
  );

  /** Delete an upload that was never saved (keeps the bucket clean). */
  async function discardUnsaved(key: string) {
    const draft = drafts[key] ?? "";
    if (draft && draft !== savedAbout[key] && isR2(draft)) await deleteMedia(draft).catch(() => {});
  }

  async function handleFile(key: string, file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      fail("Choose an image file (JPG, PNG or WebP).");
      return;
    }
    setBusy(key);
    try {
      await discardUnsaved(key);
      const url = await uploadMedia(file, "images");
      setDrafts((d) => ({ ...d, [key]: url }));
      notify("Image uploaded — press Save changes to publish it.");
    } catch {
      fail("Upload failed. Check your connection and try again.");
    } finally {
      setBusy(null);
    }
  }

  async function chooseBuiltIn(key: string) {
    await discardUnsaved(key);
    setDrafts((d) => ({ ...d, [key]: "" }));
  }

  async function undo(key: string) {
    await discardUnsaved(key);
    setDrafts((d) => ({ ...d, [key]: savedAbout[key] ?? "" }));
  }

  async function save() {
    if (changed.length === 0) {
      notify("No changes to save.");
      return;
    }
    setBusy("save");
    try {
      // Send every saved link (so service images are never lost) with the about drafts on top.
      // Untouched empty slots aren't sent, so no blank rows are created.
      const next: Record<string, string> = { ...saved };
      for (const slot of ABOUT_IMAGE_SLOTS) {
        const draft = drafts[slot.key] ?? "";
        if (draft || savedAbout[slot.key]) next[slot.key] = draft;
      }
      await saveServiceImages(
        Object.entries(next).map(([slug, image_url]) => ({ slug, image_url })),
      );
      // Saved: now remove the replaced R2 files.
      await Promise.all(
        changed.map((s) => {
          const old = savedAbout[s.key] ?? "";
          return old && old !== drafts[s.key] && isR2(old)
            ? deleteMedia(old).catch(() => {})
            : Promise.resolve();
        }),
      );
      onSaved(next);
      notify(
        `Saved ${changed.length} image${changed.length > 1 ? "s" : ""}. Old images were removed from storage.`,
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
        <h2 className="text-lg font-semibold">Chapter background images</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          One photo behind each chapter of the About page (desktop). It's shown faded behind the 3D
          animation, so pick landscape photos with interest around the edges. Without an uploaded
          image, the built-in photo is used.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {ABOUT_IMAGE_SLOTS.map((slot, i) => {
          const draft = drafts[slot.key] ?? "";
          const isChanged = draft !== (savedAbout[slot.key] ?? "");
          const shown = draft || slot.fallback;
          return (
            <article
              key={slot.key}
              className={`space-y-4 rounded-lg border bg-card p-4 ${isChanged ? "border-electric/60" : ""}`}
            >
              <ImagePreview src={shown} />
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-semibold">
                    {String(i + 1)}. {slot.label}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${draft ? "bg-electric/10 text-electric" : "bg-muted text-muted-foreground"}`}
                  >
                    {isChanged ? "Unsaved" : draft ? "Custom (R2)" : "Built-in"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{slot.hint}</p>
              </div>
              <input
                ref={(el) => {
                  fileRefs.current[slot.key] = el;
                }}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/*"
                className="hidden"
                aria-label={`Upload ${slot.label} image`}
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
                  {busy === slot.key ? "Uploading…" : draft ? "Replace image" : "Upload image"}
                </Button>
                {draft && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={busy !== null}
                    onClick={() => void chooseBuiltIn(slot.key)}
                  >
                    <ImageOff />
                    Use built-in image
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

function ImagePreview({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <ImageOff className="size-6" />
          <span className="text-xs">Image unavailable</span>
        </div>
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
