export const MAX_QUOTE_FILES = 3;
export const MAX_QUOTE_FILE_BYTES = 3 * 1024 * 1024;
export const QUOTE_FILE_ACCEPT = ".pdf,.png,.jpg,.jpeg,.docx,.xlsx,.csv,.txt,.mol,.sdf";
const extensions = new Set(QUOTE_FILE_ACCEPT.split(","));

export function validateQuoteFiles(files: Array<{ name: string; size: number }>): string | null {
  if (files.length > MAX_QUOTE_FILES) return "Choose up to 3 files.";
  let total = 0;
  for (const file of files) {
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!extensions.has(extension)) return "Use PDF, PNG, JPG, DOCX, XLSX, CSV, TXT, MOL, or SDF files.";
    if (!file.name || file.name.length > 180 || /[\\/\x00-\x1f\x7f]/.test(file.name)) return "Please rename the file using a simple filename.";
    if (!Number.isSafeInteger(file.size) || file.size < 1) return "Empty files cannot be uploaded.";
    total += file.size;
  }
  return total > MAX_QUOTE_FILE_BYTES ? "Keep the combined file size below 3 MB." : null;
}
