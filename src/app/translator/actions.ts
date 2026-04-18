"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { splitTextIntoChunks, MAX_TRANSLATION_CHARACTERS } from "@/lib/translator/chunking";
import { isSupportedLanguage } from "@/lib/translator/languages";
import { translateStudyChunk } from "@/lib/translator/engine";

function cleanTitle(value: FormDataEntryValue | null, fallback: string) {
  const title = typeof value === "string" ? value.trim() : "";
  return title || fallback;
}

function redirectToTranslatorError(message: string): never {
  redirect(`/translator?error=${encodeURIComponent(message)}`);
}

async function readUploadedText(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) return "";

  const isTextFile = file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt");
  if (!isTextFile) {
    throw new Error("Only .txt files are supported in this MVP. Paste text for other formats.");
  }

  return file.text();
}

export async function createTranslationAction(formData: FormData) {
  const profile = await requireProfile();

  const sourceLanguage = String(formData.get("sourceLanguage") || "").trim();
  const targetLanguage = String(formData.get("targetLanguage") || "").trim();
  const pastedText = String(formData.get("sourceText") || "").trim();

  if (!isSupportedLanguage(sourceLanguage) || !isSupportedLanguage(targetLanguage)) {
    redirectToTranslatorError("Choose a supported language pair.");
  }

  if (sourceLanguage === targetLanguage) {
    redirectToTranslatorError("Source and target languages must be different.");
  }

  let fileText = "";
  try {
    fileText = (await readUploadedText(formData.get("document"))).trim();
  } catch (error) {
    redirectToTranslatorError(error instanceof Error ? error.message : "Unsupported file.");
  }

  const originalText = fileText || pastedText;
  if (!originalText) {
    redirectToTranslatorError("Paste text or upload a TXT file.");
  }

  if (originalText.length > MAX_TRANSLATION_CHARACTERS) {
    redirectToTranslatorError(`Please keep the first version under ${MAX_TRANSLATION_CHARACTERS} characters.`);
  }

  const chunks = splitTextIntoChunks(originalText);
  if (chunks.length === 0) {
    redirectToTranslatorError("The document does not contain readable text.");
  }

  const uploadedFile = formData.get("document");
  const fileName = uploadedFile instanceof File && uploadedFile.size > 0 ? uploadedFile.name : "";
  const title = cleanTitle(formData.get("title"), fileName || "Study material translation");
  const supabase = await createSupabaseServerClient();

  const { data: job, error: jobError } = await supabase
    .from("translation_jobs")
    .insert({
      user_id: profile.id,
      title,
      source_language: sourceLanguage,
      target_language: targetLanguage,
      original_text: originalText,
      status: "processing",
    })
    .select("id")
    .single();

  if (jobError || !job) {
    redirectToTranslatorError("We could not save this translation job. Please try again.");
  }

  const chunkRows = chunks.map((chunk, index) => ({
    job_id: job.id,
    chunk_index: index,
    source_text: chunk,
    status: "pending",
  }));

  const { error: chunksError } = await supabase.from("translation_chunks").insert(chunkRows);
  if (chunksError) {
    const message = "We could not prepare this document for translation. Please try again.";
    await supabase.from("translation_jobs").update({ status: "failed", error_message: chunksError.message }).eq("id", job.id);
    revalidatePath("/translator/history");
    redirectToTranslatorError(message);
  }

  const translatedChunks: string[] = [];

  for (let index = 0; index < chunks.length; index += 1) {
    await supabase
      .from("translation_chunks")
      .update({ status: "processing" })
      .eq("job_id", job.id)
      .eq("chunk_index", index);

    try {
      const translatedText = await translateStudyChunk({
        sourceLanguage,
        targetLanguage,
        text: chunks[index],
      });

      translatedChunks.push(translatedText);
      await supabase
        .from("translation_chunks")
        .update({ translated_text: translatedText, status: "completed" })
        .eq("job_id", job.id)
        .eq("chunk_index", index);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Translation failed";
      await supabase
        .from("translation_chunks")
        .update({ status: "failed", error_message: message })
        .eq("job_id", job.id)
        .eq("chunk_index", index);
      await supabase
        .from("translation_jobs")
        .update({ status: "failed", error_message: message })
        .eq("id", job.id);
      revalidatePath("/translator/history");
      redirectToTranslatorError(message);
    }
  }

  const { error: completeError } = await supabase
    .from("translation_jobs")
    .update({
      translated_text: translatedChunks.join("\n\n"),
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", job.id);

  if (completeError) {
    const message = "The translation finished, but we could not save the final reader. Please try again.";
    await supabase.from("translation_jobs").update({ status: "failed", error_message: completeError.message }).eq("id", job.id);
    revalidatePath("/translator/history");
    redirectToTranslatorError(message);
  }

  revalidatePath("/translator/history");
  revalidatePath("/dashboard");
  redirect(`/translator/${job.id}`);
}
