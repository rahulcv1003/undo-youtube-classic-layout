import bundled from "../sites/youtube/selectors.json" with { type: "json" };
import { isSelectorData, newerOrEqual, type SelectorData } from "./schema";
export const SIX_HOURS = 6 * 60 * 60 * 1000;
export const MAX_SELECTOR_BYTES = 32 * 1024;
export interface SelectorCache {
  fetchedAt: number;
  data: SelectorData;
}
if (!isSelectorData(bundled)) throw new Error("Invalid bundled selectors");
export const bundledSelectors: SelectorData = bundled;
export function chooseSelectors(cache: unknown): SelectorData {
  if (
    cache &&
    typeof cache === "object" &&
    "data" in cache &&
    isSelectorData(cache.data) &&
    newerOrEqual(cache.data.dataVersion, bundledSelectors.dataVersion)
  )
    return cache.data;
  return bundledSelectors;
}
export async function readSelectors(): Promise<SelectorData> {
  return chooseSelectors(
    (await chrome.storage.local.get("selectorCache")).selectorCache,
  );
}
export async function fetchSelectors(
  url: string,
  current: SelectorData,
  fetcher: typeof fetch = fetch,
): Promise<SelectorData | null> {
  try {
    const target = new URL(url);
    if (target.protocol !== "https:" || target.username || target.password)
      return null;
    const response = await fetcher(url, {
      credentials: "omit",
      cache: "no-store",
      redirect: "error",
      referrerPolicy: "no-referrer",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok || !response.body) return null;
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let length = 0;
    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        length += value.length;
        if (length > MAX_SELECTOR_BYTES) {
          await reader.cancel();
          return null;
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    const data: unknown = JSON.parse(new TextDecoder().decode(bytes));
    return isSelectorData(data) &&
      newerOrEqual(data.dataVersion, current.dataVersion)
      ? data
      : null;
  } catch {
    return null;
  }
}
