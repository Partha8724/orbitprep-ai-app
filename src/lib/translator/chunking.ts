export const MAX_TRANSLATION_CHARACTERS = 60000;
export const TRANSLATION_CHUNK_SIZE = 3500;

export function splitTextIntoChunks(text: string, maxChunkSize = TRANSLATION_CHUNK_SIZE) {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\n{4,}/g, "\n\n\n").trim();
  if (!normalized) return [];

  const paragraphs = normalized.split(/\n{2,}/);
  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;

    if (candidate.length <= maxChunkSize) {
      current = candidate;
      continue;
    }

    if (current) {
      chunks.push(current);
      current = "";
    }

    if (paragraph.length <= maxChunkSize) {
      current = paragraph;
      continue;
    }

    for (let index = 0; index < paragraph.length; index += maxChunkSize) {
      chunks.push(paragraph.slice(index, index + maxChunkSize));
    }
  }

  if (current) chunks.push(current);

  return chunks;
}
