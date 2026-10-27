import mammoth from 'mammoth';
import { GoogleGenAI } from '@google/genai';

export interface ExtractedFileContent {
  text: string;
  fileName: string;
  fileSize: string;
  fileType: string;
}

/**
 * Format bytes into human-readable size
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Convert a File object to a Base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Fallback PDF text scraper for offline/instant client extraction
 */
function extractAsciiFromBinary(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let text = '';
  let inParentheses = false;
  let currentWord = '';

  for (let i = 0; i < bytes.length; i++) {
    const char = String.fromCharCode(bytes[i]);
    // Extract PDF text object literals (Tj / TJ syntax)
    if (char === '(') {
      inParentheses = true;
      currentWord = '';
    } else if (char === ')' && inParentheses) {
      inParentheses = false;
      if (currentWord.trim().length > 0) {
        text += currentWord + ' ';
      }
    } else if (inParentheses) {
      // printable ASCII characters
      if (bytes[i] >= 32 && bytes[i] <= 126) {
        currentWord += char;
      }
    }
  }

  // If Tj extraction found meaningful words, clean and return
  if (text.trim().length > 80) {
    return text.replace(/\\r/g, '\n').replace(/\\n/g, '\n').replace(/\s{2,}/g, ' ').trim();
  }

  // Fallback: extract continuous ASCII chunks
  let chunk = '';
  const chunks: string[] = [];
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    if ((b >= 32 && b <= 126) || b === 10 || b === 13) {
      chunk += String.fromCharCode(b);
    } else {
      if (chunk.length >= 4 && /[a-zA-Z]{2,}/.test(chunk)) {
        chunks.push(chunk);
      }
      chunk = '';
    }
  }
  return chunks.join(' ').replace(/\s{2,}/g, ' ').trim();
}

/**
 * Extract readable text from ANY uploaded file type:
 * - Word documents (.docx)
 * - Plain text (.txt, .md, .rtf, .json, .csv, .xml, .html)
 * - PDF documents (.pdf)
 * - Images (.png, .jpg, .jpeg, .webp) via Multimodal AI
 * - Code files (.py, .ts, .js, .cpp, .java, etc.)
 */
export async function extractTextFromFile(
  file: File,
  apiKey?: string
): Promise<ExtractedFileContent> {
  const fileName = file.name;
  const fileSize = formatFileSize(file.size);
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const mimeType = file.type || '';

  // 1. Plain text / Markdown / Code / JSON / CSV
  const textExtensions = ['txt', 'md', 'markdown', 'json', 'csv', 'rtf', 'xml', 'html', 'yaml', 'yml', 'log', 'ts', 'js', 'py', 'java', 'cpp'];
  if (textExtensions.includes(ext) || mimeType.startsWith('text/')) {
    const text = await file.text();
    return { text: text.trim(), fileName, fileSize, fileType: ext.toUpperCase() };
  }

  // 2. Microsoft Word Document (.docx)
  if (ext === 'docx' || mimeType.includes('wordprocessingml')) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return { text: result.value.trim(), fileName, fileSize, fileType: 'DOCX' };
  }

  // 3. Images (.png, .jpg, .jpeg, .webp) or PDFs via Gemini Multimodal Vision if API Key available
  const isImage = mimeType.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp'].includes(ext);
  const isPdf = ext === 'pdf' || mimeType === 'application/pdf';

  if ((isImage || isPdf) && apiKey && apiKey.trim().length > 0) {
    try {
      const base64Data = await fileToBase64(file);
      const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
      const targetMime = mimeType || (isPdf ? 'application/pdf' : 'image/jpeg');

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: targetMime,
                  data: base64Data,
                },
              },
              {
                text: 'Extract all readable text, work history, skills, headings, bullet points, metrics, and content from this uploaded document exactly as written. Output only the extracted plain text without any introductory commentary or markdown fences.',
              },
            ],
          },
        ],
      });

      const extracted = response.text?.trim() || '';
      if (extracted.length > 0) {
        return { text: extracted, fileName, fileSize, fileType: ext.toUpperCase() };
      }
    } catch (aiErr) {
      console.warn('AI OCR extraction failed, falling back to local binary parser:', aiErr);
    }
  }

  // 4. PDF fallback via local binary parsing
  if (isPdf) {
    const arrayBuffer = await file.arrayBuffer();
    const text = extractAsciiFromBinary(arrayBuffer);
    if (text.length > 30) {
      return { text, fileName, fileSize, fileType: 'PDF' };
    }
  }

  // 5. Generic fallback for any other file type
  try {
    const text = await file.text();
    if (text && text.trim().length > 0) {
      return { text: text.trim(), fileName, fileSize, fileType: ext.toUpperCase() || 'FILE' };
    }
  } catch {
    // If text decode fails, attempt binary ASCII extraction
    const arrayBuffer = await file.arrayBuffer();
    const text = extractAsciiFromBinary(arrayBuffer);
    return { text: text || `[Uploaded file: ${fileName} (${fileSize})]`, fileName, fileSize, fileType: ext.toUpperCase() || 'FILE' };
  }

  return { text: '', fileName, fileSize, fileType: ext.toUpperCase() || 'FILE' };
}
