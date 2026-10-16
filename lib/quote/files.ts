import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { validateQuoteFiles } from "./file-policy";

export type PreparedQuoteFile = { id: string; position: number; filename: string; size: number; data: string; digest: string };

export async function prepareQuoteFiles(form?: FormData): Promise<PreparedQuoteFile[]> {
  if (!form) return [];
  const values = form.getAll("files");
  if (values.some(value => !(value instanceof File))) throw new Error("Invalid file upload.");
  const files = values as File[];
  const error = validateQuoteFiles(files);
  if (error) throw new Error(error);
  return Promise.all(files.map(async (file, position) => {
    const bytes = Buffer.from(await file.arrayBuffer());
    return { id: randomUUID(), position, filename: file.name, size: bytes.length, data: bytes.toString("base64"), digest: createHash("sha256").update(bytes).digest("hex") };
  }));
}
