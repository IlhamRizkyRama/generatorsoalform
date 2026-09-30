import mammoth from 'mammoth';
import { Question } from '../data/examQuestions';

export interface ParseResult {
  questions: Question[];
  warnings: string[];
  totalParsed: number;
}

/**
 * Clean HTML to preserve math superscripts, subscripts, and symbols
 */
function cleanHtmlText(html: string): string {
  return html
    .replace(/<sup>(.*?)<\/sup>/gi, '^($1)')
    .replace(/<sub>(.*?)<\/sub>/gi, '_($1)')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '') // remove remaining HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&plusmn;/g, '±')
    .replace(/&times;/g, '×')
    .replace(/&divide;/g, '÷')
    .replace(/&le;/g, '≤')
    .replace(/&ge;/g, '≥')
    .replace(/&ne;/g, '≠')
    .replace(/&radic;/g, '√')
    .replace(/&infin;/g, '∞')
    .replace(/&pi;/g, 'π');
}

/**
 * Parse an HTML document (from mammoth or pasted HTML) into structured questions
 */
export function parseHtmlToQuestions(htmlContent: string, startId: number = 1): ParseResult {
  const warnings: string[] = [];
  const questions: Question[] = [];

  // Temporary DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${htmlContent}</div>`, 'text/html');

  // Find all paragraphs, list items, and headings
  const elements = Array.from(doc.body.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, table'));

  interface RawItem {
    text: string;
    image?: string;
  }

  const rawBlocks: RawItem[] = [];

  for (const el of elements) {
    // Check if element has an embedded image
    const imgEl = el.querySelector('img');
    const imageSrc = imgEl ? imgEl.getAttribute('src') || undefined : undefined;

    const text = cleanHtmlText(el.innerHTML).trim();
    if (text || imageSrc) {
      rawBlocks.push({ text, image: imageSrc });
    }
  }

  // Combine into continuous text with [IMAGE:data] markers
  let currentQ: Partial<Question> | null = null;
  let currentOptions: { key: 'A' | 'B' | 'C' | 'D' | 'E'; text: string }[] = [];
  let nextId = startId;

  const questionRegex = /^(?:Soal\s*)?(\d+)[\.\)]\s*(.*)$/i;
  const optionRegex = /^([A-Ea-e])[\.\)]\s*(.*)$/;
  const answerKeyRegex = /(?:Kunci(?:\s*Jawaban)?|Jawaban|Ans|Key)\s*[:=]\s*([A-Ea-e])/i;
  const explanationRegex = /(?:Pembahasan|Penjelasan|Keterangan)\s*[:=]\s*(.*)/i;
  const categoryRegex = /(?:Kategori|Topik|Materi)\s*[:=]\s*(.*)/i;

  const finalizeCurrentQuestion = () => {
    if (currentQ && currentQ.question) {
      // Ensure at least options A-D or A-E
      const defaultKeys: ('A' | 'B' | 'C' | 'D' | 'E')[] = ['A', 'B', 'C', 'D', 'E'];
      while (currentOptions.length < 5) {
        const nextKey = defaultKeys[currentOptions.length];
        currentOptions.push({ key: nextKey, text: `Pilihan ${nextKey}` });
      }

      questions.push({
        id: currentQ.id || nextId++,
        question: currentQ.question.trim(),
        image: currentQ.image,
        options: currentOptions.slice(0, 5),
        correctAnswer: (currentQ.correctAnswer || 'A') as 'A' | 'B' | 'C' | 'D' | 'E',
        category: currentQ.category || 'Materi Umum',
        explanation: currentQ.explanation || 'Pembahasan belum tersedia.',
        points: currentQ.points || 2,
      });
    }
    currentQ = null;
    currentOptions = [];
  };

  for (const block of rawBlocks) {
    const lines = block.text.split('\n').map((l) => l.trim()).filter(Boolean);

    // If block only has an image, associate it with current question
    if (lines.length === 0 && block.image) {
      if (currentQ) {
        currentQ.image = block.image;
      }
      continue;
    }

    for (const line of lines) {
      // 1. Check for Question start
      const qMatch = line.match(questionRegex);
      if (qMatch) {
        finalizeCurrentQuestion();
        const parsedNum = parseInt(qMatch[1]);
        currentQ = {
          id: !isNaN(parsedNum) ? parsedNum : nextId++,
          question: qMatch[2] || '',
          image: block.image,
        };
        continue;
      }

      // 2. Check for Option A-E
      const optMatch = line.match(optionRegex);
      if (optMatch && currentQ) {
        const key = optMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D' | 'E';
        const optText = optMatch[2] || '';
        // If image in block and not yet attached to question, check if it belongs to option or question
        currentOptions.push({ key, text: optText });
        continue;
      }

      // 3. Check for Answer Key
      const keyMatch = line.match(answerKeyRegex);
      if (keyMatch && currentQ) {
        currentQ.correctAnswer = keyMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D' | 'E';
        continue;
      }

      // 4. Check for Explanation
      const expMatch = line.match(explanationRegex);
      if (expMatch && currentQ) {
        currentQ.explanation = expMatch[1];
        continue;
      }

      // 5. Check for Category
      const catMatch = line.match(categoryRegex);
      if (catMatch && currentQ) {
        currentQ.category = catMatch[1];
        continue;
      }

      // 6. Otherwise: multiline question content or unindexed option
      if (currentQ) {
        if (currentOptions.length === 0) {
          // Additional line to question text
          currentQ.question = (currentQ.question ? currentQ.question + ' ' : '') + line;
          if (block.image && !currentQ.image) {
            currentQ.image = block.image;
          }
        } else {
          // Additional line to previous option
          const lastIdx = currentOptions.length - 1;
          currentOptions[lastIdx].text += ' ' + line;
        }
      }
    }
  }

  finalizeCurrentQuestion();

  if (questions.length === 0) {
    warnings.push('Tidak dapat mengenali format nomor soal (misal: "1. Pertanyaan..."). Coba periksa format dokumen.');
  }

  return {
    questions,
    warnings,
    totalParsed: questions.length,
  };
}

/**
 * Import questions from a Word (.docx) file ArrayBuffer
 */
export async function parseDocxFile(fileBuffer: ArrayBuffer, startId: number = 1): Promise<ParseResult> {
  try {
    const result = await mammoth.convertToHtml({
      arrayBuffer: fileBuffer,
    });

    const parsed = parseHtmlToQuestions(result.value, startId);
    if (result.messages && result.messages.length > 0) {
      result.messages.forEach((msg) => {
        if (msg.type === 'warning') {
          parsed.warnings.push(msg.message);
        }
      });
    }

    return parsed;
  } catch (error: any) {
    console.error('Mammoth docx parse error:', error);
    throw new Error('Gagal membaca berkas .docx: ' + (error.message || 'Format berkas tidak valid.'));
  }
}

/**
 * Import questions from raw pasted text (e.g. from Google Docs or Word)
 */
export function parseRawText(text: string, startId: number = 1): ParseResult {
  const html = text
    .split(/\r?\n/)
    .map((line) => `<p>${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`)
    .join('');
  return parseHtmlToQuestions(html, startId);
}
