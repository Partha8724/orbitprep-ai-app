import { getLanguageLabel } from "@/lib/translator/languages";

type TranslateChunkInput = {
  sourceLanguage: string;
  targetLanguage: string;
  text: string;
};

export async function translateStudyChunk({ sourceLanguage, targetLanguage, text }: TranslateChunkInput) {
  const source = getLanguageLabel(sourceLanguage);
  const target = getLanguageLabel(targetLanguage);
  const normalizedText = text.trim();

  if (!normalizedText) {
    throw new Error("The document does not contain readable text.");
  }

  return [
    "Demo mode translation",
    "Free version  real translation coming soon",
    `${source} to ${target}`,
    "",
    normalizedText,
  ].join("\n");
}
