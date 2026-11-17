import 'server-only';

export interface ParsedReferenceDocument {
  filename: string;
  extension: string;
  text: string;
  wordCount: number;
  charCount: number;
  metaSummary: string;
}

const MAX_EXTRACTED_CHARS = 60000;

function normalizeExtractedText(raw: string): string {
  const cleaned = raw
    .replace(/\r\n/g, '\n')
    .replace(/\u0000/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim();

  if (cleaned.length > MAX_EXTRACTED_CHARS) {
    return `${cleaned.slice(0, MAX_EXTRACTED_CHARS)}\n\n[...Document truncated at ${MAX_EXTRACTED_CHARS} characters for optimal AI context processing...]`;
  }
  return cleaned;
}

function countWords(text: string): number {
  const matches = text.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

export async function parseReferenceFile(
  buffer: Buffer,
  filename: string,
  mimeType = ''
): Promise<ParsedReferenceDocument> {
  const lowerName = filename.toLowerCase();
  const ext = lowerName.includes('.') ? lowerName.split('.').pop() || 'txt' : 'txt';
  const normalizedExt = ext.trim();

  let extractedText = '';
  let metaSummary = '';

  if (normalizedExt === 'txt' || normalizedExt === 'md' || mimeType === 'text/plain' || mimeType === 'text/markdown') {
    extractedText = buffer.toString('utf8');
    metaSummary = normalizedExt === 'md' ? 'Markdown Document' : 'Plain Text Document';
  } else if (normalizedExt === 'csv' || mimeType === 'text/csv') {
    const XLSX = await import('xlsx');
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const parts: string[] = [];
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const csv = XLSX.utils.sheet_to_csv(sheet, { blankrows: false });
      if (csv.trim()) {
        parts.push(`### CSV Data (${sheetName})\n${csv.trim()}`);
      }
    }
    extractedText = parts.join('\n\n') || buffer.toString('utf8');
    metaSummary = 'CSV Data Table';
  } else if (
    normalizedExt === 'xlsx' ||
    normalizedExt === 'xls' ||
    mimeType.includes('spreadsheetml') ||
    mimeType.includes('ms-excel')
  ) {
    const XLSX = await import('xlsx');
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const parts: string[] = [];
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const csv = XLSX.utils.sheet_to_csv(sheet, { blankrows: false });
      if (csv.trim()) {
        parts.push(`### Spreadsheet Sheet: ${sheetName}\n${csv.trim()}`);
      }
    }
    extractedText = parts.join('\n\n');
    metaSummary = `Excel Workbook (${workbook.SheetNames.length} sheet${workbook.SheetNames.length === 1 ? '' : 's'})`;
  } else if (
    normalizedExt === 'docx' ||
    normalizedExt === 'doc' ||
    mimeType.includes('wordprocessingml') ||
    mimeType === 'application/msword'
  ) {
    try {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value || '';
      metaSummary = 'Microsoft Word Document (.docx)';
    } catch (docxErr) {
      // Fallback printable string extraction for legacy binary .doc files
      if (normalizedExt === 'doc') {
        const latinText = buffer
          .toString('utf8')
          .replace(/[^\x20-\x7E\u0600-\u06FF\n\r\t]/g, ' ')
          .replace(/\s{3,}/g, '\n');
        extractedText = latinText;
        metaSummary = 'Legacy Word Document (.doc)';
      } else {
        throw docxErr;
      }
    }
  } else if (normalizedExt === 'pdf' || mimeType === 'application/pdf') {
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    try {
      const textResult = await parser.getText();
      extractedText = textResult.text || '';
      const totalPages = typeof textResult.total === 'number' ? textResult.total : 1;
      metaSummary = `PDF Document (${totalPages} page${totalPages === 1 ? '' : 's'})`;
    } finally {
      await parser.destroy().catch(() => {});
    }
  } else {
    throw new Error(
      `Unsupported reference format ".${normalizedExt}". Please upload PDF (.pdf), Word (.docx/.doc), Excel (.xlsx/.xls/.csv), Markdown (.md), or Text (.txt).`
    );
  }

  const finalText = normalizeExtractedText(extractedText);
  if (!finalText) {
    throw new Error(
      `No readable text could be extracted from "${filename}". If it is a scanned image-only PDF or empty document, please provide a text-searchable document.`
    );
  }

  return {
    filename,
    extension: normalizedExt,
    text: finalText,
    wordCount: countWords(finalText),
    charCount: finalText.length,
    metaSummary,
  };
}
