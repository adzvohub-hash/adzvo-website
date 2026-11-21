import { MediaSlotsEditor } from "./media-slots-editor";
import { BUILT_IN_SERVICE_VIDEOS, SERVICE_VIDEO_SLOTS } from "@/lib/service-videos";

/** Admin › Services › the looping video in each service page's closing band (R2, original video as fallback). */
export function ServiceVideosEditor(props: {
  saved: Record<string, string>;
  onSaved: (next: Record<string, string>) => void;
  notify: (msg: string) => void;
  fail: (msg: string) => void;
}) {
  return (
    <MediaSlotsEditor
      kind="video"
      title="Service page videos"
      description="The looping video in the “Start a Project” band at the end of each service page. Use a short 16:9 landscape clip (MP4 or WebM, ideally under 10 MB) — it plays muted on a loop. The original videos are kept as the fallback and are never deleted."
      slots={SERVICE_VIDEO_SLOTS}
      protectedUrls={BUILT_IN_SERVICE_VIDEOS}
      {...props}
    />
  );
}
