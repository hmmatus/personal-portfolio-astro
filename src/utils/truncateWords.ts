export const MAX_DESCRIPTION_WORDS = 500;

export function truncateWords(
  text: string,
  maxWords = MAX_DESCRIPTION_WORDS
): { displayText: string; isTruncated: boolean } {
  const words = text.trim().split(/\s+/).filter(Boolean);

  if (words.length <= maxWords) {
    return { displayText: text, isTruncated: false };
  }

  return {
    displayText: `${words.slice(0, maxWords).join(" ")}...`,
    isTruncated: true,
  };
}
