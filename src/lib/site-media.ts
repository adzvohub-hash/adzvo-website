import { useEffect, useState } from "react";
import { getServiceImages } from "@/lib/api";

/**
 * Media links saved from the admin (stored with the service images), keyed by
 * slug — e.g. "about-brief", "video-branding-design". Fetched once per page
 * load and shared by every component that needs it. Empty links are left out,
 * so callers fall back to their built-in media.
 */
let cache: Promise<Map<string, string>> | null = null;

export function loadSiteMedia(): Promise<Map<string, string>> {
  cache ??= getServiceImages()
    .then(
      (rows) =>
        new Map(
          (Array.isArray(rows) ? rows : [])
            .filter((r) => r.image_url)
            .map((r) => [r.slug, r.image_url]),
        ),
    )
    .catch(() => {
      cache = null; // try again next time
      return new Map<string, string>();
    });
  return cache;
}

/**
 * The saved link for `key`, or `fallback` until/unless one is saved.
 * Call `onError` from the media element to drop back to the fallback if the saved file fails to load.
 */
export function useSiteMedia(key: string, fallback: string) {
  const [src, setSrc] = useState(fallback);
  useEffect(() => {
    let alive = true;
    setSrc(fallback);
    void loadSiteMedia().then((map) => {
      const url = map.get(key);
      if (alive && url) setSrc(url);
    });
    return () => {
      alive = false;
    };
  }, [key, fallback]);
  const onError = () => setSrc((cur) => (cur !== fallback ? fallback : cur));
  return { src, onError };
}
