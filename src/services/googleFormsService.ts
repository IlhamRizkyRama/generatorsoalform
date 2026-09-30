import { Question, ExamInfo } from '../data/examQuestions';

export interface FormCreationConfig {
  title: string;
  documentTitle: string;
  description: string;
  classes: string[];
  includeToken: boolean;
  tokenCode: string;
  pointsPerQuestion: number;
  shuffleOptions: boolean;
  makeQuiz: boolean;
}

export interface CreatedFormResult {
  formId: string;
  responderUri: string;
  editUri: string;
  title: string;
  createdAt: string;
  totalQuestions: number;
  totalPoints: number;
}

/**
 * Google Forms API constraint:
 * Question titles, form titles, and choice option values STRICTLY CANNOT contain newlines.
 * This helper cleans and guarantees single-line strings.
 */
export function cleanSingleLine(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function createExamGoogleForm(
  accessToken: string,
  config: FormCreationConfig,
  questions: Question[],
  onProgress?: (step: string, percent: number) => void
): Promise<CreatedFormResult> {
  onProgress?.('Membuat berkas formulir Google Forms baru...', 10);

  const cleanFormTitle = cleanSingleLine(config.title) || 'ASTS Ujian Sekolah';
  const cleanDocTitle = cleanSingleLine(config.documentTitle) || cleanFormTitle;

  // Step 1: Create the form
  const createRes = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      info: {
        title: cleanFormTitle,
        documentTitle: cleanDocTitle,
      },
    }),
  });

  if (!createRes.ok) {
    const errData = await createRes.json().catch(() => ({}));
    const message = errData?.error?.message || `Gagal membuat form (HTTP ${createRes.status})`;
    throw new Error(message);
  }

  const formData = await createRes.json();
  const formId = formData.formId;
  const responderUri = formData.responderUri || `https://docs.google.com/forms/d/e/${formId}/viewform`;
  const editUri = `https://docs.google.com/forms/d/${formId}/edit`;

  onProgress?.('Mengatur konfigurasi Kuis & Deskripsi Ujian...', 25);

  // Step 2: Set Quiz Settings, Form Info, and Identity Questions
  const initialRequests: any[] = [];

  // Update description (multiline is allowed in description)
  const normalizedDescription = (config.description || '').replace(/\r\n/g, '\n');
  initialRequests.push({
    updateFormInfo: {
      info: {
        description: normalizedDescription,
      },
      updateMask: 'description',
    },
  });

  // Enable quiz if requested
  if (config.makeQuiz) {
    initialRequests.push({
      updateSettings: {
        settings: {
          quizSettings: {
            isQuiz: true,
          },
        },
        updateMask: 'quizSettings.isQuiz',
      },
    });
  }

  let itemIndex = 0;

  // Question 1: Nama Lengkap
  initialRequests.push({
    createItem: {
      item: {
        title: 'Nama Lengkap Siswa',
        description: 'Tuliskan nama lengkap sesuai dengan daftar hadir sekolah (huruf kapital di awal kata).',
        questionItem: {
          question: {
            required: true,
            textQuestion: {
              paragraph: false,
            },
          },
        },
      },
      location: {
        index: itemIndex++,
      },
    },
  });

  // Question 2: Kelas
  if (config.classes && config.classes.length > 0) {
    initialRequests.push({
      createItem: {
        item: {
          title: 'Kelas / Rombel',
          description: 'Pilih kelas Anda saat ini.',
          questionItem: {
            question: {
              required: true,
              choiceQuestion: {
                type: 'DROP_DOWN',
                options: config.classes.map((cls) => ({ value: cleanSingleLine(cls) })),
              },
            },
          },
        },
        location: {
          index: itemIndex++,
        },
      },
    });
  } else {
    initialRequests.push({
      createItem: {
        item: {
          title: 'Kelas / Rombel',
          questionItem: {
            question: {
              required: true,
              textQuestion: {
                paragraph: false,
              },
            },
          },
        },
        location: {
          index: itemIndex++,
        },
      },
    });
  }

  // Question 3: Nomor Absen
  initialRequests.push({
    createItem: {
      item: {
        title: 'Nomor Absen / NISN',
        description: 'Masukkan nomor absen atau NISN Anda.',
        questionItem: {
          question: {
            required: true,
            textQuestion: {
              paragraph: false,
            },
          },
        },
      },
      location: {
        index: itemIndex++,
      },
    },
  });

  // Optional Token field
  if (config.includeToken && config.tokenCode) {
    initialRequests.push({
      createItem: {
        item: {
          title: 'Token Ujian ASTS',
          description: `Masukkan token ujian resmi yang diberikan pengawas (Contoh: ${cleanSingleLine(config.tokenCode)})`,
          questionItem: {
            question: {
              required: true,
              textQuestion: {
                paragraph: false,
              },
            },
          },
        },
        location: {
          index: itemIndex++,
        },
      },
    });
  }

  // Section divider before questions
  initialRequests.push({
    createItem: {
      item: {
        title: 'BAGIAN 2: SOAL ASESMEN SUMATIF (50 BUTIR)',
        description:
          'Petunjuk:\n1. Pilihlah salah satu jawaban (A, B, C, D, atau E) yang paling tepat!\n2. Masing-masing soal bernilai ' +
          config.pointsPerQuestion +
          ' poin.\n3. Periksa kembali jawaban Anda sebelum menekan tombol Kirim.',
        pageBreakItem: {},
      },
      location: {
        index: itemIndex++,
      },
    },
  });

  const updateRes1 = await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: initialRequests,
    }),
  });

  if (!updateRes1.ok) {
    const errData = await updateRes1.json().catch(() => ({}));
    const message = errData?.error?.message || `Gagal menginisialisasi form (HTTP ${updateRes1.status})`;
    throw new Error(message);
  }

  // Step 3: Add questions in batches of 15 to stay within limits and provide smooth progress
  const BATCH_SIZE = 15;
  const totalQuestions = questions.length;
  let processed = 0;

  while (processed < totalQuestions) {
    const batch = questions.slice(processed, processed + BATCH_SIZE);
    const batchRequests: any[] = [];

    for (const q of batch) {
      // Clean and sanitize question title and options to ensure no newlines exist
      const rawQuestion = q.question || '';
      let itemTitle = cleanSingleLine(`${q.id}. ${rawQuestion}`);
      let itemDescription = '';

      if (rawQuestion.includes('\n')) {
        const lines = rawQuestion.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        if (lines.length > 1) {
          itemTitle = cleanSingleLine(`${q.id}. ${lines[0]}`);
          itemDescription = lines.slice(1).join('\n');
        }
      }

      // Build options with clean single-line values
      const cleanOptions = q.options.map((opt) => ({
        key: opt.key,
        value: cleanSingleLine(`${opt.key}. ${cleanSingleLine(opt.text)}`),
      }));

      // Find the correct answer value (strictly matching the clean option value)
      const correctOpt = cleanOptions.find((opt) => opt.key === q.correctAnswer);
      const correctValue = correctOpt ? correctOpt.value : '';

      const questionObj: any = {
        required: true,
        choiceQuestion: {
          type: 'RADIO',
          options: cleanOptions.map((opt) => ({
            value: opt.value,
          })),
          shuffle: config.shuffleOptions,
        },
      };

      if (config.makeQuiz && correctValue) {
        questionObj.grading = {
          pointValue: config.pointsPerQuestion,
          correctAnswers: {
            answers: [{ value: correctValue }],
          },
        };
      }

      const itemPayload: any = {
        title: itemTitle,
        questionItem: {
          question: questionObj,
        },
      };

      if (itemDescription) {
        itemPayload.description = itemDescription;
      }

      batchRequests.push({
        createItem: {
          item: itemPayload,
          location: {
            index: itemIndex++,
          },
        },
      });
    }

    const startNum = processed + 1;
    const endNum = Math.min(processed + batch.length, totalQuestions);
    const progressPercent = 30 + Math.round((endNum / totalQuestions) * 65);
    onProgress?.(`Mengunggah Butir Soal ${startNum} - ${endNum} beserta Kunci Jawaban...`, progressPercent);

    const batchRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: batchRequests,
      }),
    });

    if (!batchRes.ok) {
      const errData = await batchRes.json().catch(() => ({}));
      const message = errData?.error?.message || `Gagal mengunggah soal batch ${startNum}-${endNum}`;
      throw new Error(message);
    }

    processed += batch.length;
  }

  onProgress?.('Berhasil membuat Google Form ASTS!', 100);

  return {
    formId,
    responderUri,
    editUri,
    title: cleanFormTitle,
    createdAt: new Date().toISOString(),
    totalQuestions: questions.length,
    totalPoints: questions.length * config.pointsPerQuestion,
  };
}

export async function fetchFormDetails(accessToken: string, formId: string) {
  const res = await fetch(`https://forms.googleapis.com/v1/forms/${formId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    throw new Error('Gagal mengambil data form dari Google Forms API');
  }
  return await res.json();
}

export async function fetchFormResponses(accessToken: string, formId: string) {
  const res = await fetch(`https://forms.googleapis.com/v1/forms/${formId}/responses`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    return { responses: [] };
  }
  return await res.json();
}
