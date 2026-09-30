export interface Question {
  id: number;
  question: string;
  image?: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D' | 'E';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
  category: string;
  explanation: string;
  points?: number;
}

export interface ExamInfo {
  school: string;
  subject: string;
  grade: string;
  academicYear: string;
  author: string;
  curriculumHead: string;
  packet: string;
  totalQuestions: number;
  dimensions: string[];
  gapuraValues: string[];
  defaultPointsPerQuestion: number;
}

export const EXAM_INFO: ExamInfo = {
  school: "SMK Pertiwi Ciasem",
  subject: "Koding dan Kecerdasan Artifisial",
  grade: "X / E",
  academicYear: "2026/2027",
  author: "Ilham Rizky Ramadhan, S.Tr.T.",
  curriculumHead: "Firman Damayanto, S.Pd., Gr.",
  packet: "Paket 3: Algoritma Pemrograman",
  totalQuestions: 50,
  dimensions: [
    "Kolaborasi",
    "Komunikasi",
    "Kreativitas",
    "Kemandirian",
    "Penalaran Kritis"
  ],
  gapuraValues: ["Bageur", "Singer", "Pinter", "Bener"],
  defaultPointsPerQuestion: 2
};

export const EXAM_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Algoritma adalah...",
    options: [
      { key: "A", text: "Nama bahasa pemrograman" },
      { key: "B", text: "Urutan langkah logis dan sistematis untuk menyelesaikan masalah" },
      { key: "C", text: "Jenis perangkat keras komputer" },
      { key: "D", text: "Nama software pengolah kata" },
      { key: "E", text: "Virus komputer" }
    ],
    correctAnswer: "B",
    category: "Konsep Algoritma",
    explanation: "Algoritma didefinisikan sebagai urutan instruksi langkah demi langkah yang logis dan terstruktur untuk menyelesaikan suatu masalah tertentu."
  },
  {
    id: 2,
    question: "Simbol flowchart yang berbentuk oval (terminator) digunakan untuk...",
    options: [
      { key: "A", text: "Proses" },
      { key: "B", text: "Keputusan (decision)" },
      { key: "C", text: "Awal atau akhir algoritma" },
      { key: "D", text: "Input/Output" },
      { key: "E", text: "Penghubung" }
    ],
    correctAnswer: "C",
    category: "Flowchart",
    explanation: "Simbol terminator (oval/rounded rectangle) berfungsi menandai titik mulai (Start) atau akhir (End) dari suatu bagan alir (flowchart)."
  },
  {
    id: 3,
    question: "Simbol jajar genjang (parallelogram) dalam flowchart digunakan untuk...",
    options: [
      { key: "A", text: "Proses perhitungan" },
      { key: "B", text: "Keputusan ya/tidak" },
      { key: "C", text: "Input atau Output data" },
      { key: "D", text: "Awal program" },
      { key: "E", text: "Pengulangan" }
    ],
    correctAnswer: "C",
    category: "Flowchart",
    explanation: "Simbol jajaran genjang dalam flowchart secara standar digunakan untuk operasi pemasukan data (Input) atau penulisan data/hasil (Output)."
  },
  {
    id: 4,
    question: "Simbol belah ketupat (diamond) dalam flowchart merepresentasikan...",
    options: [
      { key: "A", text: "Proses" },
      { key: "B", text: "Input/Output" },
      { key: "C", text: "Keputusan (percabangan)" },
      { key: "D", text: "Awal/akhir" },
      { key: "E", text: "Konektor" }
    ],
    correctAnswer: "C",
    category: "Flowchart",
    explanation: "Simbol belah ketupat (decision) digunakan untuk pengujian kondisi percabangan yang menghasilkan nilai Boolean (Ya/Tidak, True/False)."
  },
  {
    id: 5,
    question: "Pseudocode adalah...",
    options: [
      { key: "A", text: "Kode program yang sudah bisa dijalankan langsung" },
      { key: "B", text: "Cara menulis algoritma menggunakan bahasa yang mirip bahasa pemrograman tetapi lebih mudah dipahami manusia" },
      { key: "C", text: "Nama software pembuat flowchart" },
      { key: "D", text: "Jenis error dalam program" },
      { key: "E", text: "Bahasa pemrograman tingkat rendah" }
    ],
    correctAnswer: "B",
    category: "Pseudocode",
    explanation: "Pseudocode adalah notasi deskriptif yang menyerupai bahasa pemrograman tingkat tinggi tanpa terikat pada sintaks kaku, sehingga mudah dipahami manusia."
  },
  {
    id: 6,
    question: "Struktur kontrol yang menjalankan perintah secara berurutan dari atas ke bawah disebut...",
    options: [
      { key: "A", text: "Selection" },
      { key: "B", text: "Iteration" },
      { key: "C", text: "Sequence" },
      { key: "D", text: "Recursion" },
      { key: "E", text: "Branching" }
    ],
    correctAnswer: "C",
    category: "Struktur Kontrol",
    explanation: "Struktur runtunan (Sequence) menjalankan setiap instruksi secara baris demi baris, dari baris pertama hingga terakhir tanpa lompatan."
  },
  {
    id: 7,
    question: "Struktur kontrol yang digunakan untuk memilih salah satu dari beberapa pilihan berdasarkan kondisi disebut...",
    options: [
      { key: "A", text: "Sequence" },
      { key: "B", text: "Selection (Percabangan)" },
      { key: "C", text: "Iteration" },
      { key: "D", text: "Looping" },
      { key: "E", text: "Function" }
    ],
    correctAnswer: "B",
    category: "Struktur Kontrol",
    explanation: "Selection (percabangan seperti IF atau SWITCH) menentukan blok kode mana yang akan dieksekusi berdasarkan evaluasi kondisi logika."
  },
  {
    id: 8,
    question: "Struktur kontrol yang mengulang suatu perintah selama kondisi terpenuhi disebut...",
    options: [
      { key: "A", text: "Sequence" },
      { key: "B", text: "Selection" },
      { key: "C", text: "Iteration (Perulangan)" },
      { key: "D", text: "Abstraction" },
      { key: "E", text: "Decomposition" }
    ],
    correctAnswer: "C",
    category: "Struktur Kontrol",
    explanation: "Iteration (perulangan/looping) mengulang sekumpulan instruksi selama syarat kondisi perulangan bernilai benar (True)."
  },
  {
    id: 9,
    question: "Contoh struktur sequence yang benar adalah...",
    options: [
      { key: "A", text: "Jika nilai ≥ 75 maka lulus, jika tidak maka tidak lulus" },
      { key: "B", text: "Baca nama → Tampilkan \"Halo\" + nama → Selesai" },
      { key: "C", text: "Ulangi 5 kali: cetak \"Hello\"" },
      { key: "D", text: "Selama saldo > 0, kurangi 1000" },
      { key: "E", text: "Jika hujan bawa payung, jika tidak bawa topi" }
    ],
    correctAnswer: "B",
    category: "Struktur Kontrol",
    explanation: "Baca nama → Tampilkan 'Halo' + nama → Selesai adalah urutan berurutan langsung (runtunan murni) tanpa cabang atau pengulangan."
  },
  {
    id: 10,
    question: "Contoh struktur selection (percabangan) adalah...",
    options: [
      { key: "A", text: "Cetak angka 1 sampai 10" },
      { key: "B", text: "Jika umur ≥ 17 maka boleh membuat KTP, jika tidak maka belum boleh" },
      { key: "C", text: "Baca data lalu simpan" },
      { key: "D", text: "Hitung total = harga × jumlah" },
      { key: "E", text: "Tampilkan \"Selamat datang\"" }
    ],
    correctAnswer: "B",
    category: "Struktur Kontrol",
    explanation: "Pilihan B menggunakan klausul 'Jika... maka... jika tidak...' yang merupakan ciri khas percabangan (if-else)."
  },
  {
    id: 11,
    question: "Contoh struktur iteration (perulangan) adalah...",
    options: [
      { key: "A", text: "Jika nilai > 80 maka predikat A" },
      { key: "B", text: "Baca nama siswa" },
      { key: "C", text: "Ulangi sampai 10 kali: cetak nomor antrian" },
      { key: "D", text: "Hitung luas = panjang × lebar" },
      { key: "E", text: "Tampilkan hasil perhitungan" }
    ],
    correctAnswer: "C",
    category: "Struktur Kontrol",
    explanation: "'Ulangi sampai 10 kali' merepresentasikan instruksi pengulangan (looping) dengan batas pencacah tertentu."
  },
  {
    id: 12,
    question: "Variabel dalam pemrograman digunakan untuk...",
    options: [
      { key: "A", text: "Menyimpan data yang nilainya dapat berubah selama program berjalan" },
      { key: "B", text: "Menyimpan data yang nilainya tetap selamanya" },
      { key: "C", text: "Menampilkan gambar" },
      { key: "D", text: "Menghubungkan ke internet" },
      { key: "E", text: "Mematikan komputer" }
    ],
    correctAnswer: "A",
    category: "Variabel & Tipe Data",
    explanation: "Variabel adalah lokasi memori yang diberi nama untuk menampung nilai/data yang nilainya dapat diubah selama jalannya program."
  },
  {
    id: 13,
    question: "Tipe data yang tepat untuk menyimpan nama siswa adalah...",
    options: [
      { key: "A", text: "Integer" },
      { key: "B", text: "Float / Real" },
      { key: "C", text: "Boolean" },
      { key: "D", text: "String" },
      { key: "E", text: "Character saja" }
    ],
    correctAnswer: "D",
    category: "Variabel & Tipe Data",
    explanation: "Nama siswa terdiri dari deretan karakter alfabet, sehingga tipe data yang tepat adalah String (kumpulan karakter/teks)."
  },
  {
    id: 14,
    question: "Tipe data yang tepat untuk menyimpan umur seseorang adalah...",
    options: [
      { key: "A", text: "String" },
      { key: "B", text: "Integer" },
      { key: "C", text: "Boolean" },
      { key: "D", text: "Float" },
      { key: "E", text: "Array" }
    ],
    correctAnswer: "B",
    category: "Variabel & Tipe Data",
    explanation: "Umur seseorang biasanya dinyatakan dalam bilangan bulat positif (tanpa pecahan), sehingga tipe data Integer paling efisien dan tepat."
  },
  {
    id: 15,
    question: "Tipe data Boolean hanya dapat menyimpan nilai...",
    options: [
      { key: "A", text: "Angka 0 sampai 100" },
      { key: "B", text: "True atau False" },
      { key: "C", text: "Teks panjang" },
      { key: "D", text: "Bilangan desimal" },
      { key: "E", text: "Karakter tunggal" }
    ],
    correctAnswer: "B",
    category: "Variabel & Tipe Data",
    explanation: "Tipe data Boolean merepresentasikan logika biner, yang hanya memiliki dua kemungkinan nilai: True (benar/1) atau False (salah/0)."
  },
  {
    id: 16,
    question: "Operator perbandingan yang digunakan untuk menyatakan \"sama dengan\" adalah...",
    options: [
      { key: "A", text: "=" },
      { key: "B", text: "==" },
      { key: "C", text: "!=" },
      { key: "D", text: "<>" },
      { key: "E", text: ":=" }
    ],
    correctAnswer: "B",
    category: "Operator & Logika",
    explanation: "Dalam mayoritas bahasa pemrograman modern (C, C++, Java, Python, JavaScript), simbol '==' digunakan untuk membandingkan kesamaan, sedangkan '=' adalah operator assignment."
  },
  {
    id: 17,
    question: "Operator logika yang menyatakan \"dan\" adalah...",
    options: [
      { key: "A", text: "OR" },
      { key: "B", text: "NOT" },
      { key: "C", text: "AND" },
      { key: "D", text: "XOR" },
      { key: "E", text: "NOR" }
    ],
    correctAnswer: "C",
    category: "Operator & Logika",
    explanation: "Operator logika konjungsi yang menyatakan hubungan 'dan' adalah AND, yang hanya bernilai benar jika kedua kondisi bernilai benar."
  },
  {
    id: 18,
    question: "Hasil dari operasi 10 > 5 AND 3 < 2 adalah...",
    options: [
      { key: "A", text: "True" },
      { key: "B", text: "False" },
      { key: "C", text: "10" },
      { key: "D", text: "5" },
      { key: "E", text: "Error" }
    ],
    correctAnswer: "B",
    category: "Operator & Logika",
    explanation: "10 > 5 bernilai True, sedangkan 3 < 2 bernilai False. Operasi True AND False menghasilkan nilai False."
  },
  {
    id: 19,
    question: "Hasil dari operasi 7 >= 7 adalah...",
    options: [
      { key: "A", text: "False" },
      { key: "B", text: "True" },
      { key: "C", text: "7" },
      { key: "D", text: "Error" },
      { key: "E", text: "Null" }
    ],
    correctAnswer: "B",
    category: "Operator & Logika",
    explanation: "Operator '>=' berarti 'lebih besar dari atau sama dengan'. Karena 7 sama dengan 7, maka hasilnya adalah True."
  },
  {
    id: 20,
    question: "Perulangan yang jumlah pengulangannya sudah diketahui sejak awal biasanya menggunakan...",
    options: [
      { key: "A", text: "While" },
      { key: "B", text: "For" },
      { key: "C", text: "Do-While" },
      { key: "D", text: "If-Else" },
      { key: "E", text: "Switch" }
    ],
    correctAnswer: "B",
    category: "Perulangan",
    explanation: "Perulangan 'For' (counted loop) digunakan jika banyaknya iterasi sudah dipastikan sebelum proses perulangan dimulai."
  },
  {
    id: 21,
    question: "Perulangan yang terus berjalan selama kondisi masih benar dan jumlahnya belum diketahui pasti biasanya menggunakan...",
    options: [
      { key: "A", text: "For" },
      { key: "B", text: "While" },
      { key: "C", text: "Switch" },
      { key: "D", text: "If" },
      { key: "E", text: "Sequence" }
    ],
    correctAnswer: "B",
    category: "Perulangan",
    explanation: "Perulangan 'While' (uncounted loop) bekerja berdasarkan kondisi pengujian logika, terus berulang selama kondisi bernilai True."
  },
  {
    id: 22,
    question: "Manakah yang merupakan contoh penulisan pseudocode yang baik?",
    options: [
      { key: "A", text: "Mulai → Baca nilai → Jika nilai ≥ 75 maka \"Lulus\" else \"Tidak Lulus\" → Selesai" },
      { key: "B", text: "Coding langsung tanpa perencanaan" },
      { key: "C", text: "Gambar saja tanpa langkah" },
      { key: "D", text: "Tulis dalam bahasa sehari-hari tanpa struktur" },
      { key: "E", text: "Langsung compile program" }
    ],
    correctAnswer: "A",
    category: "Pseudocode",
    explanation: "Penulisan pseudocode yang baik memiliki titik awal, pembacaan masukan terstruktur, percabangan jelas, dan titik akhir."
  },
  {
    id: 23,
    question: "Algoritma untuk mencari bilangan terbesar di antara dua bilangan A dan B adalah contoh penerapan...",
    options: [
      { key: "A", text: "Sequence saja" },
      { key: "B", text: "Selection" },
      { key: "C", text: "Iteration" },
      { key: "D", text: "Recursion" },
      { key: "E", text: "Sorting" }
    ],
    correctAnswer: "B",
    category: "Struktur Kontrol",
    explanation: "Mencari bilangan terbesar antara dua nilai membutuhkan percabangan: 'Jika A > B maka cetak A, jika tidak cetak B'."
  },
  {
    id: 24,
    question: "Algoritma untuk mencetak angka 1 sampai 100 adalah contoh penerapan...",
    options: [
      { key: "A", text: "Selection" },
      { key: "B", text: "Sequence" },
      { key: "C", text: "Iteration" },
      { key: "D", text: "Abstraction" },
      { key: "E", text: "Decomposition" }
    ],
    correctAnswer: "C",
    category: "Perulangan",
    explanation: "Mencetak serangkaian angka 1 sampai 100 dilakukan secara berulang menggunakan struktur perulangan (iteration)."
  },
  {
    id: 25,
    question: "Perbedaan utama antara algoritma dan program adalah...",
    options: [
      { key: "A", text: "Algoritma sudah bisa dijalankan komputer, program belum" },
      { key: "B", text: "Algoritma bersifat logis dan bahasa-agnostik, program ditulis dalam bahasa pemrograman tertentu" },
      { key: "C", text: "Program lebih mudah dipahami manusia" },
      { key: "D", text: "Algoritma harus selalu dalam bentuk flowchart" },
      { key: "E", text: "Tidak ada perbedaan" }
    ],
    correctAnswer: "B",
    category: "Konsep Dasar",
    explanation: "Algoritma adalah rancangan ide/logika penyelesaian yang independen terhadap bahasa, sedangkan program adalah implementasi konkretnya pada komputer."
  },
  {
    id: 26,
    question: "Manakah urutan yang benar dalam membuat program?",
    options: [
      { key: "A", text: "Coding → Testing → Desain algoritma → Analisis masalah" },
      { key: "B", text: "Analisis masalah → Desain algoritma → Coding → Testing" },
      { key: "C", text: "Testing → Coding → Analisis → Desain" },
      { key: "D", text: "Coding langsung tanpa analisis" },
      { key: "E", text: "Desain → Testing → Coding" }
    ],
    correctAnswer: "B",
    category: "Software Engineering",
    explanation: "Siklus pengembangan software berawal dari analisis kebutuhan/masalah, perancangan algoritma, penulisan kode (coding), lalu pengujian (testing)."
  },
  {
    id: 27,
    question: "Debugging adalah proses...",
    options: [
      { key: "A", text: "Menulis kode program" },
      { key: "B", text: "Mencari dan memperbaiki kesalahan dalam program" },
      { key: "C", text: "Mengompilasi program" },
      { key: "D", text: "Menjalankan program" },
      { key: "E", text: "Mendesain flowchart" }
    ],
    correctAnswer: "B",
    category: "Software Engineering",
    explanation: "Debugging berasal dari kata 'bug', merupakan tahap mengidentifikasi penyebab error dan memperbaikinya agar program berjalan benar."
  },
  {
    id: 28,
    question: "Syntax error terjadi karena...",
    options: [
      { key: "A", text: "Logika program salah" },
      { key: "B", text: "Kesalahan penulisan aturan bahasa pemrograman" },
      { key: "C", text: "Hasil perhitungan tidak tepat" },
      { key: "D", text: "Program terlalu panjang" },
      { key: "E", text: "Variabel tidak digunakan" }
    ],
    correctAnswer: "B",
    category: "Error & Debugging",
    explanation: "Syntax error muncul jika ada pelanggaran tata bahasa pemrograman, seperti salah ketik kata kunci atau lupa titik koma."
  },
  {
    id: 29,
    question: "Logical error terjadi karena...",
    options: [
      { key: "A", text: "Salah tulis tanda baca" },
      { key: "B", text: "Alur logika atau rumus dalam program salah meskipun sintaks benar" },
      { key: "C", text: "Komputer rusak" },
      { key: "D", text: "Bahasa pemrograman tidak didukung" },
      { key: "E", text: "Memory penuh" }
    ],
    correctAnswer: "B",
    category: "Error & Debugging",
    explanation: "Pada logical error, program tetap berhasil dicompile dan jalan, namun menghasilkan output yang salah karena rumus/alur pikir programmer keliru."
  },
  {
    id: 30,
    question: "Manakah yang termasuk struktur percabangan bersarang (nested if)?",
    options: [
      { key: "A", text: "If kondisi1 then ... else ..." },
      { key: "B", text: "If kondisi1 then [ If kondisi2 then ... else ... ]" },
      { key: "C", text: "For i = 1 to 10" },
      { key: "D", text: "While kondisi" },
      { key: "E", text: "Sequence biasa" }
    ],
    correctAnswer: "B",
    category: "Struktur Kontrol",
    explanation: "Nested IF adalah kondisi percabangan di mana terdapat pernyataan IF di dalam blok percabangan IF lainnya."
  },
  {
    id: 31,
    question: "Algoritma yang membandingkan efisiensi waktu atau jumlah langkah disebut...",
    options: [
      { key: "A", text: "Algoritma rekursif" },
      { key: "B", text: "Analisis kompleksitas algoritma" },
      { key: "C", text: "Algoritma greedy" },
      { key: "D", text: "Algoritma brute force" },
      { key: "E", text: "Algoritma sorting" }
    ],
    correctAnswer: "B",
    category: "Kompleksitas Algoritma",
    explanation: "Analisis kompleksitas (seperti notasi Big-O) mempelajari pertumbuhan waktu eksekusi (time complexity) dan memori (space complexity)."
  },
  {
    id: 32,
    question: "Contoh algoritma pencarian sederhana adalah...",
    options: [
      { key: "A", text: "Bubble Sort" },
      { key: "B", text: "Linear Search (Pencarian berurutan)" },
      { key: "C", text: "Binary Tree" },
      { key: "D", text: "Dijkstra" },
      { key: "E", text: "Kruskal" }
    ],
    correctAnswer: "B",
    category: "Algoritma Pencarian",
    explanation: "Linear Search memeriksa setiap elemen array satu per satu dari awal sampai data yang dicari ditemukan."
  },
  {
    id: 33,
    question: "Dalam flowchart, panah (flowline) berfungsi untuk...",
    options: [
      { key: "A", text: "Menyimpan data" },
      { key: "B", text: "Menunjukkan arah aliran proses" },
      { key: "C", text: "Menampilkan output" },
      { key: "D", text: "Membuat keputusan" },
      { key: "E", text: "Mengakhiri program" }
    ],
    correctAnswer: "B",
    category: "Flowchart",
    explanation: "Garis alir dengan mata panah (flowline) mengarahkan pembaca mengenai urutan langkah pemrosesan berikutnya."
  },
  {
    id: 34,
    question: "Manakah pernyataan yang benar tentang pseudocode?",
    options: [
      { key: "A", text: "Harus bisa langsung dijalankan oleh komputer" },
      { key: "B", text: "Fokus pada logika, bukan sintaks bahasa tertentu" },
      { key: "C", text: "Hanya boleh menggunakan bahasa Inggris" },
      { key: "D", text: "Tidak boleh ada perulangan" },
      { key: "E", text: "Harus berbentuk gambar" }
    ],
    correctAnswer: "B",
    category: "Pseudocode",
    explanation: "Pseudocode dirancang agar programmer dapat merancang dan mengkomunikasikan solusi logika pemecahan masalah tanpa terikat dialek bahasa tertentu."
  },
  {
    id: 35,
    question: "Struktur algoritma: [Baca N → Jumlah ← 0 → Untuk i ← 1 sampai N lakukan: Jumlah ← Jumlah + i → Tampilkan Jumlah] merupakan contoh algoritma untuk...",
    options: [
      { key: "A", text: "Mencari bilangan prima" },
      { key: "B", text: "Menghitung jumlah bilangan dari 1 sampai N" },
      { key: "C", text: "Mencari bilangan terbesar" },
      { key: "D", text: "Mengurutkan data" },
      { key: "E", text: "Mencari rata-rata saja" }
    ],
    correctAnswer: "B",
    category: "Analisis Algoritma",
    explanation: "Variabel Jumlah diakumulasikan dengan nilai i yang berjalan dari 1 sampai N (1 + 2 + ... + N), sehingga menghitung jumlah deret bilangan 1 sampai N."
  },
  {
    id: 36,
    question: "Jika kondisi dalam perulangan While tidak pernah menjadi False, maka yang terjadi adalah...",
    options: [
      { key: "A", text: "Program selesai dengan cepat" },
      { key: "B", text: "Infinite loop (perulangan tak terbatas)" },
      { key: "C", text: "Syntax error" },
      { key: "D", text: "Program langsung berhenti" },
      { key: "E", text: "Hasil selalu benar" }
    ],
    correctAnswer: "B",
    category: "Perulangan",
    explanation: "Jika kondisi penguji pada While selalu benar (True), perulangan tidak akan pernah mencapai titik henti, menimbulkan infinite loop yang bisa membuat program hang."
  },
  {
    id: 37,
    question: "Operator penugasan yang paling umum digunakan untuk memberi nilai pada variabel adalah...",
    options: [
      { key: "A", text: "==" },
      { key: "B", text: "=" },
      { key: "C", text: "===" },
      { key: "D", text: ":=" },
      { key: "E", text: "!=" }
    ],
    correctAnswer: "B",
    category: "Operator & Logika",
    explanation: "Tanda sama dengan tunggal '=' merupakan operator penugasan (assignment operator) untuk memasukkan nilai dari ruas kanan ke variabel di ruas kiri."
  },
  {
    id: 38,
    question: "Manakah yang merupakan contoh algoritma yang baik?",
    options: [
      { key: "A", text: "Langkahnya tidak jelas dan bisa ditafsirkan berbeda-beda" },
      { key: "B", text: "Memiliki langkah yang jelas, berhingga, dan menghasilkan output yang benar" },
      { key: "C", text: "Tidak memiliki akhir" },
      { key: "D", text: "Hanya bisa dipahami oleh pembuatnya" },
      { key: "E", text: "Mengandung banyak langkah yang tidak perlu" }
    ],
    correctAnswer: "B",
    category: "Konsep Dasar",
    explanation: "Syarat algoritma baik menurut Donald Knuth mencakup Finiteness (berhingga), Definiteness (jelas/pasti), Input, Output, dan Effectiveness."
  },
  {
    id: 39,
    question: "Dalam pemrograman, komentar (comment) digunakan untuk...",
    options: [
      { key: "A", text: "Menjalankan perintah" },
      { key: "B", text: "Memberi keterangan agar kode lebih mudah dipahami manusia" },
      { key: "C", text: "Menghitung hasil" },
      { key: "D", text: "Menampilkan output" },
      { key: "E", text: "Membuat variabel baru" }
    ],
    correctAnswer: "B",
    category: "Pemrograman Dasar",
    explanation: "Komentar diabaikan oleh compiler/interpreter komputer dan berfungsi semata-mata sebagai dokumentasi internal bagi pembaca kode manusia."
  },
  {
    id: 40,
    question: "Struktur Switch-Case biasanya digunakan untuk...",
    options: [
      { key: "A", text: "Perulangan" },
      { key: "B", text: "Percabangan dengan banyak pilihan berdasarkan nilai tertentu" },
      { key: "C", text: "Sequence saja" },
      { key: "D", text: "Deklarasi variabel" },
      { key: "E", text: "Input data" }
    ],
    correctAnswer: "B",
    category: "Struktur Kontrol",
    explanation: "Switch-Case merupakan struktur seleksi multi-arah yang efisien untuk mencocokkan satu variabel dengan banyak kemungkinan nilai diskrit."
  },
  {
    id: 41,
    question: "Algoritma untuk menentukan bilangan genap atau ganjil menggunakan struktur...",
    options: [
      { key: "A", text: "Sequence saja" },
      { key: "B", text: "Selection (if bilangan mod 2 = 0 maka genap)" },
      { key: "C", text: "Iteration" },
      { key: "D", text: "Recursion" },
      { key: "E", text: "Sorting" }
    ],
    correctAnswer: "B",
    category: "Struktur Kontrol",
    explanation: "Menentukan ganjil/genap memerlukan percabangan logika if berdasarkan sisa pembagian 2 (modulus 2)."
  },
  {
    id: 42,
    question: "Manakah yang termasuk algoritma pengurutan (sorting)?",
    options: [
      { key: "A", text: "Linear Search" },
      { key: "B", text: "Binary Search" },
      { key: "C", text: "Bubble Sort" },
      { key: "D", text: "Sequential Search" },
      { key: "E", text: "Hashing" }
    ],
    correctAnswer: "C",
    category: "Sorting & Searching",
    explanation: "Bubble Sort adalah salah satu algoritma pengurutan (sorting) data yang menukar elemen bersebelahan jika posisinya salah urut."
  },
  {
    id: 43,
    question: "Keuntungan menuliskan algoritma dalam bentuk pseudocode sebelum coding adalah...",
    options: [
      { key: "A", text: "Langsung bisa dijalankan" },
      { key: "B", text: "Memudahkan fokus pada logika tanpa terhambat sintaks bahasa" },
      { key: "C", text: "Membuat program lebih lambat" },
      { key: "D", text: "Tidak perlu testing" },
      { key: "E", text: "Menggantikan dokumentasi" }
    ],
    correctAnswer: "B",
    category: "Pseudocode",
    explanation: "Pseudocode memungkinkan perancang berkonsentrasi memecahkan inti logika masalah tanpa pusing dengan detail teknis kompilator."
  },
  {
    id: 44,
    question: "Hasil dari ekspresi: 5 + 3 * 2 adalah...",
    options: [
      { key: "A", text: "16" },
      { key: "B", text: "11" },
      { key: "C", text: "13" },
      { key: "D", text: "10" },
      { key: "E", text: "8" }
    ],
    correctAnswer: "B",
    category: "Operator & Logika",
    explanation: "Operator perkalian (*) memiliki presedensi lebih tinggi daripada penjumlahan (+). Maka 3 * 2 dihitung terlebih dahulu = 6, lalu 5 + 6 = 11."
  },
  {
    id: 45,
    question: "Operator modulus (%) digunakan untuk...",
    options: [
      { key: "A", text: "Pembagian" },
      { key: "B", text: "Sisa hasil bagi" },
      { key: "C", text: "Pangkat" },
      { key: "D", text: "Perkalian" },
      { key: "E", text: "Penjumlahan" }
    ],
    correctAnswer: "B",
    category: "Operator & Logika",
    explanation: "Operator modulus (sering disimbolkan % atau mod) menghasilkan sisa pembagian antara dua bilangan bulat (misal 7 % 3 = 1)."
  },
  {
    id: 46,
    question: "Contoh penerapan algoritma dalam kehidupan sehari-hari adalah...",
    options: [
      { key: "A", text: "Menonton televisi tanpa tujuan" },
      { key: "B", text: "Langkah-langkah membuat akun email secara berurutan" },
      { key: "C", text: "Berbicara tanpa topik" },
      { key: "D", text: "Berjalan tanpa arah" },
      { key: "E", text: "Menghafal tanpa memahami" }
    ],
    correctAnswer: "B",
    category: "Konsep Dasar",
    explanation: "Membuat akun email memerlukan urutan langkah terstruktur: membuka situs, mengisi formulir pendaftaran, verifikasi, hingga akun selesai dibuat."
  },
  {
    id: 47,
    question: "Manakah yang merupakan perbedaan antara For dan While?",
    options: [
      { key: "A", text: "For untuk kondisi, While untuk jumlah pasti" },
      { key: "B", text: "For biasanya untuk jumlah pengulangan yang sudah diketahui, While untuk kondisi yang belum pasti" },
      { key: "C", text: "Tidak ada perbedaan" },
      { key: "D", text: "While lebih cepat" },
      { key: "E", text: "For tidak bisa digunakan untuk perulangan" }
    ],
    correctAnswer: "B",
    category: "Perulangan",
    explanation: "Perulangan For umumnya terukur (counted loop), sedangkan While bergantung pada kondisi dinamis (conditional uncounted loop)."
  },
  {
    id: 48,
    question: "Algoritma yang memanggil dirinya sendiri disebut...",
    options: [
      { key: "A", text: "Iteratif" },
      { key: "B", text: "Rekursif" },
      { key: "C", text: "Sequensial" },
      { key: "D", text: "Paralel" },
      { key: "E", text: "Distributed" }
    ],
    correctAnswer: "B",
    category: "Konsep Lanjutan",
    explanation: "Fungsi rekursif (recursion) adalah teknik pemrograman di mana suatu fungsi/metode memanggil dirinya sendiri untuk menyelesaikan sub-masalah yang lebih kecil."
  },
  {
    id: 49,
    question: "Tujuan utama mempelajari algoritma sebelum pemrograman adalah...",
    options: [
      { key: "A", text: "Agar bisa menghafal sintaks" },
      { key: "B", text: "Melatih kemampuan berpikir logis dan sistematis dalam menyelesaikan masalah" },
      { key: "C", text: "Agar langsung bisa membuat aplikasi kompleks" },
      { key: "D", text: "Menggantikan kebutuhan testing" },
      { key: "E", text: "Hanya untuk lomba" }
    ],
    correctAnswer: "B",
    category: "Konsep Dasar",
    explanation: "Algoritma melatih 'computational thinking' (kemampuan berpikir logis, runtut, terstruktur) yang menjadi pondasi utama sebelum menuangkannya ke kode."
  },
  {
    id: 50,
    question: "Kesimpulan yang paling tepat tentang Algoritma dan Pemrograman adalah...",
    options: [
      { key: "A", text: "Algoritma tidak penting jika sudah bisa coding" },
      { key: "B", text: "Algoritma adalah fondasi berpikir, sedangkan pemrograman adalah cara menuliskannya agar dapat dijalankan komputer" },
      { key: "C", text: "Pemrograman selalu lebih sulit dari algoritma" },
      { key: "D", text: "Keduanya hanya untuk ahli komputer" },
      { key: "E", text: "Tidak ada hubungan antara keduanya" }
    ],
    correctAnswer: "B",
    category: "Konsep Dasar",
    explanation: "Algoritma merupakan cetak biru logika berpikir (arsitektur solusi), sedangkan pemrograman adalah media implementasi agar komputer dapat merealisasikannya."
  }
];
