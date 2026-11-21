import { MediaSlotsEditor } from "./media-slots-editor";
import { ABOUT_IMAGE_SLOTS } from "@/lib/about-images";

/** Admin › About › one background photo per chapter (R2, built-in image as fallback). */
export function AboutImagesEditor(props: {
  saved: Record<string, string>;
  onSaved: (next: Record<string, string>) => void;
  notify: (msg: string) => void;
  fail: (msg: string) => void;
}) {
  return (
    <MediaSlotsEditor
      kind="image"
      title="Chapter background images"
      description="One photo behind each chapter of the About page (desktop). It's shown faded behind the 3D animation, so pick landscape photos with interest around the edges. Without an uploaded image, the original built-in photo is used."
      slots={ABOUT_IMAGE_SLOTS}
      {...props}
    />
  );
}
