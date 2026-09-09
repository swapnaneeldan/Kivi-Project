/**
 * Keeps one canonical entry per visible title. Later entries win so a newly
 * completed capture can replace an older copy of the same artifact.
 */
export function deduplicateByTitle<T extends { title: string }>(list: T[]): T[] {
  return Array.from(new Map(list.map((item) => [item.title, item])).values());
}
