export const TRANSLATION_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "as", label: "Assamese" },
  { code: "bn", label: "Bengali" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "kn", label: "Kannada" },
  { code: "ml", label: "Malayalam" },
  { code: "mr", label: "Marathi" },
] as const;

export type TranslationLanguageCode = (typeof TRANSLATION_LANGUAGES)[number]["code"];

export function getLanguageLabel(code: string) {
  return TRANSLATION_LANGUAGES.find((language) => language.code === code)?.label || code;
}

export function isSupportedLanguage(code: string): code is TranslationLanguageCode {
  return TRANSLATION_LANGUAGES.some((language) => language.code === code);
}
