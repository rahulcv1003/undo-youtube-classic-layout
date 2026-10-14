export function shouldShowRating(
  state: {
    installedAt?: number;
    restoredViews?: number;
    ratingPrompt?: string;
  },
  now = Date.now(),
): boolean {
  return (
    state.ratingPrompt === "pending" &&
    typeof state.installedAt === "number" &&
    now - state.installedAt >= 7 * 86400000 &&
    (state.restoredViews ?? 0) >= 20
  );
}
