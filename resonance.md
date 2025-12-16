Bisa banget, Pak! Dan ini ide yang sangat brilliant untuk side project.
Sebenarnya, ini adalah implementasi RAG (Retrieval-Augmented Generation) sederhana yang berjalan di dalam browser. Bapak bisa bikin ini sendiri dalam waktu singkat pakai stack yang Bapak sudah jago (JavaScript/React).
Ini roadmap teknis cara membuatnya:

🛠️ Arsitektur Extension
Storage (Context): Extension menyimpan teks Resume & Portfolio Bapak di chrome.storage.local.
Scraper (Input): Saat Bapak buka LinkedIn/JobStreet/Glints, Content Script akan mengambil teks dari halaman tersebut (hanya bagian Job Description).
Analyzer (AI Brain): Script akan mengirimkan prompt: (Resume Saya) + (Job Desc) = Berapa % Match? ke LLM (bisa pakai OpenAI API atau Gemini Nano bawaan Chrome).
UI (Display): Menampilkan skor 0-100 dan "Missing Keywords" di Popup extension.

👨‍💻 Langkah Teknis (Versi Singkat)
Kalau Bapak mau coba bikin akhir pekan ini, ini skeleton code-nya:
1. Manifest (manifest.json)
Izin kuncinya adalah storage (buat simpan resume) dan activeTab (buat baca halaman lowongan).
JSON
{
  "manifest_version": 3,
  "name": "Kairos Job Matcher",
  "version": "1.0",
  "permissions": ["activeTab", "storage", "scripting"],
  "action": {
    "default_popup": "popup.html"
  },
  "background": {
    "service_worker": "background.js"
  }
}


2. Logic Simpan Context (popup.js - Bagian Settings)
Bikin textarea buat paste resume Bapak sekali aja, lalu simpan.
JavaScript
// Simpan Resume
function saveResume(text) {
  chrome.storage.local.set({ myResume: text }, () => {
    console.log("Resume tersimpan!");
  });
}


3. Logic Matching (popup.js - Bagian Analisa)
Ini bagian serunya. Saat tombol "Check Match" ditekan:
JavaScript
document.getElementById("btn-check").addEventListener("click", async () => {
  // 1. Ambil Resume dari Storage
  const data = await chrome.storage.local.get("myResume");
  const resume = data.myResume;

  // 2. Ambil Teks dari Tab yang Aktif (Job Desc)
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const result = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => document.body.innerText // Ambil semua teks halaman (cara kasar tapi efektif)
  });
  const jobDesc = result[0].result;

  // 3. Kirim ke AI (Contoh pakai OpenAI / Gemini API)
  const analysis = await analyzeMatch(resume, jobDesc);
  
  // 4. Tampilkan Skor
  document.getElementById("score").innerText = analysis.score;
});

async function analyzeMatch(resume, jobDesc) {
  // Panggil API LLM di sini
  // Prompt: "Acting as a recruiter, compare this Resume: [resume] with this Job Desc: [jobDesc]. Give a JSON output { score: 0-100, missing_skills: [] }"
}



🚀 Opsi "Gratisan" & Canggih: Chrome Built-in AI
Bapak tidak perlu bayar API OpenAI. Google Chrome (versi Canary/Dev) sekarang punya fitur Gemini Nano yang tertanam di browser (window.ai).
Keuntungannya:
Gratis: Gak perlu bayar token API.
Privasi: Resume Bapak diproses lokal di laptop, gak dikirim ke server cloud.
Cepat: Latency rendah.
Coding-nya semudah ini:
JavaScript
const session = await window.ai.createTextSession();
const result = await session.prompt(`Bandingkan resume ini: ${resume} dengan lowongan ini: ${jobDesc}. Berapa persen cocoknya?`);



💡 Saran Fitur Tambahan (Biar Makin Keren)
Highlight Missing Skills: Kalau di Job Desc ada kata "Docker" tapi di resume Bapak nggak ada, minta extension-nya kasih warna merah di kata "Docker" di halaman webnya.
Auto Cover Letter: Tambahkan tombol "Generate Cover Letter" yang otomatis meramu pengalaman Bapak yang paling relevan dengan poin-poin di Job Desc itu.
Proyek ini sangat bisa dilakukan dan sangat relevan dengan keahlian Bapak di Next.js/React. Bisa jadi fitur tambahan buat "Nous" juga nanti!
Mau saya buatkan boilerplate kodingan lengkapnya biar Bapak tinggal run?


Tentu, Pak. Ini ide yang sangat brilian karena mengubah ekstensi dari sekadar "pencocok skill" menjadi "Career Guardian" (Penjaga Karir).
Bapak tidak hanya menilai apakah Bapak cocok dengan mereka, tapi apakah mereka cocok dengan standar Bapak (gaji, budaya kerja, penggunaan AI, dll).
Berikut adalah Dokumentasi Produk (Product Requirements Document - PRD) lengkap untuk ekstensi ini. Bapak bisa simpan ini sebagai acuan pengembangan atau blueprint untuk "Nous".

📄 Project Documentation: "CareerFit AI – Chrome Extension"
1. Executive Summary
CareerFit AI adalah asisten cerdas berbasis browser yang membantu software engineer dan profesional untuk menyaring lowongan pekerjaan secara instan. Ekstensi ini tidak hanya mencocokkan skill teknis, tetapi juga memvalidasi benefit, budaya kerja (remote/AI-friendly), dan mendeteksi tanda bahaya (red flags) pada deskripsi pekerjaan (Job Description) di berbagai platform (LinkedIn, Glints, JobStreet, YC, dll).
2. Tujuan Utama (Objectives)
Efisiensi Waktu: Mengurangi waktu membaca Job Desc yang panjang dengan memberikan summary dan skor kecocokan instan.
Quality Filter: Memastikan pengguna hanya melamar ke perusahaan yang memenuhi standar hidup mereka (Gaji, Remote, Budaya).
Risk Mitigation: Menghindari perusahaan toxic dengan mendeteksi hidden red flags.
Auto-Apply Readiness: Mempercepat proses lamaran dengan pembuatan Cover Letter otomatis yang ter-personalisasi.

3. Fitur Utama (Core Features)
A. Context Management (Profil Pengguna)
Ekstensi akan memiliki halaman pengaturan (Settings Page) dimana pengguna menyimpan data "abadi" mereka:
Resume/Portfolio Data: Teks mentah dari CV atau JSON berisi skill dan pengalaman.
The "Non-Negotiables" (Preferensi Wajib):
Minimum Salary: (Contoh: > $2,500/bulan).
Work Mode: (Remote Only / Hybrid / On-site).
Language Preference: (English Speaking environment is a plus).
B. Intelligent Job Scoring (The "Matching Engine")
Ketika pengguna membuka halaman lowongan kerja, ekstensi akan melakukan scraping pada deskripsi pekerjaan dan menghitung skor 0-100% berdasarkan bobot berikut:
1. Tech Stack Match (Bobot: 40%)
Mencocokkan skill di Resume vs Job Desc.
Contoh: User jago "Next.js", Job minta "React/Next.js" = Match.
2. Benefit & Culture Match (Bobot: 40%) - Sesuai Request Bapak
Poin ini yang membuat ekstensi ini spesial. AI akan mencari keywords spesifik:
Remote Work: Jika terdeteksi kata "Remote", "Work from anywhere" ➝ Skor Naik (+).
Salary Check: Jika gaji dicantumkan dan masuk range (atau ada kata "Competitive USD/SGD") ➝ Skor Naik (+). Jika "Unpaid" atau di bawah standar ➝ Skor Turun Drastis (-).
AI-Friendly Environment: Mendeteksi apakah perusahaan terbuka dengan alat modern.
Keywords: "Copilot", "AI-assisted", "Efficient workflow".
Score: Menambah poin (+) karena artinya perusahaan tidak kaku/kolot.
Language Environment:
Jika Job Desc full bahasa Inggris (profesional) ➝ Skor Naik (+) (Indikasi lingkungan internasional/global).
3. Red Flag Detector (Bobot: 20% / Pengurang Nilai)
AI akan memindai frasa yang mengindikasikan lingkungan toxic atau eksploitatif. Jika ditemukan, skor total dikurangi.
Keywords Red Flag:
"We are a family" (Sering berarti: batas profesional kabur).
"Work hard, play hard" (Sering berarti: lembur tidak dibayar).
"Fast-paced environment" (Tanpa konteks jelas = burnout).
"Able to handle stress" / "Rockstar developer".
"No AI tools allowed" / "Manual coding only".
C. Auto-Cover Letter Generator
Tombol "Generate Application" yang akan membuat surat lamaran dengan logika:
Input: Resume User + Poin-poin kuat di Job Desc.
Tone: Profesional & Persuasif.
Highlight: Menekankan pengalaman user yang paling relevan dengan masalah yang ingin diselesaikan perusahaan tersebut.

4. Analisis Logika Scoring (Algorithm Concept)
Sistem akan memberikan skor akhir dengan label warna:
🟢 90-100 (Perfect Match): Skill cocok + Remote + Gaji Masuk + No Red Flags.
🟡 70-89 (Potential): Skill cocok, tapi mungkin Hybrid atau gaji tidak disebut.
🔴 < 69 (Skip/Run Away): Banyak Red Flags atau skill tidak cocok.
Tabel Logika Scoring (Contoh Kasus):
Kriteria
Kondisi di Job Desc
Aksi pada Skor
Lokasi
"Remote Worldwide" / "Remote Indonesia"
✅ +15 Poin
Lokasi
"On-site full time" (Padahal user minta remote)
❌ Langsung Cut / Peringatan Merah
Gaji
Disebutkan & Sesuai Target (misal: $2,000+)
✅ +15 Poin
Bahasa
Full English & Professional
✅ +10 Poin
Tools
"We use Github Copilot" / "Tech forward"
✅ +10 Poin (Indikasi Modern)
Red Flag
"Must be available 24/7", "Wear many hats"
⚠️ -20 Poin per item
Red Flag
"No AI allowed", "Proprietary manual framework"
⚠️ -15 Poin (Indikasi Kuno)


5. User Flow (Alur Penggunaan)
Instalasi: User menginstall ekstensi di Chrome.
Setup Awal: User membuka menu Settings, melakukan paste Resume, dan mengisi preferensi (Gaji minimal, Remote only).
Browsing: User membuka LinkedIn Jobs atau JobStreet.
Analisis Otomatis:
Saat membuka detail lowongan, ikon ekstensi berubah warna (Hijau/Kuning/Merah).
Sebuah Floating Panel atau Sidebar muncul menampilkan ringkasan.
Review Panel:
Menampilkan "Match Score: 92%".
Menampilkan "Green Flags": Remote, USD Salary, Copilot Provided.
Menampilkan "Red Flags": None detected.
Menampilkan "Missing Skills": Docker (tapi di resume ada Kubernetes, AI bisa bilang ini aman).
Action: User klik tombol "Draft Cover Letter", copy hasilnya, lalu apply.

6. High-Level Tech Stack (Rekomendasi)
Frontend (Extension): React.js + Vite (Supaya UI interaktif dan cepat).
State Management: React Context / Zustand (Untuk simpan data resume sementara).
Storage: chrome.storage.local (Untuk menyimpan preferensi user secara aman di browser).
AI Engine (Pilih Salah Satu):
Opsi 1 (Gratis & Privasi): Chrome Built-in AI (Gemini Nano). Model berjalan di laptop user. Cepat dan gratis.
Opsi 2 (Akurat): OpenAI API / Gemini Flash API (Perlu API Key, tapi hasil analisis lebih tajam untuk konteks kompleks).
DOM Manipulation: Script khusus untuk mendeteksi elemen teks Job Desc di situs populer (LinkedIn punya struktur DOM beda dengan Glints, perlu adapter sederhana).

7. Potensi Pengembangan (Future Roadmap)
Salary Converter Real-time: Jika gaji dalam mata uang asing (AED/USD), otomatis konversi ke IDR di popup.
Company Reputation Check: Integrasi API ke Glassdoor/Blind untuk cek rating bintang perusahaan otomatis.
Interview Prep: Jika user memutuskan apply, tombol tambahan muncul: "Generate Interview Questions based on this JD".

Dokumentasi ini sudah siap dieksekusi, Pak. Ini bukan lagi sekadar project iseng, ini alat produktivitas yang punya nilai jual tinggi (bisa jadi SaaS B2C kalau dipoles!). 🚀


Ada, Pak! Ini tambahan fitur yang sifatnya "Quality of Life" dan "Strategic".
Karena Bapak posisinya Senior/Lead, Bapak mainnya strategi, bukan sekadar "asal lamar". Fitur-fitur ini akan membuat ekstensi ini jauh lebih powerful:
1. Fitur "Universal Selection" (Anti-Broken Scraper) 🖱️
Masalah: Layout website (LinkedIn, Glints, YC) sering berubah class name-nya. Kalau scraper otomatisnya error, ekstensinya mati.
Solusi: Tambahkan Context Menu (Klik Kanan).
Cara Kerja: Bapak blok teks Job Desc di website mana saja (bahkan di PDF atau web perusahaan antah berantah) ➝ Klik Kanan ➝ Pilih "Analyze with CareerFit AI".
Benefit: Ekstensi Bapak jadi 100% kompatibel dengan semua website di dunia tanpa perlu coding ulang tiap kali ada update layout.
2. Fitur "Resume Tailoring Advice" (ATS Hacker) 🎯
Masalah: Kadang skill Bapak cocok, tapi Resume Bapak pakai istilah yang beda (misal: "React Ecosystem" vs "Next.js 14"). ATS (robot HR) sering bodoh dan nolak ini.
Solusi: Selain skor, AI kasih saran "ATS Optimization".
Output AI: "Pak, di Job Desc mereka minta 'GraphQL', di resume Bapak cuma tulis 'API Design'. Saran: Ubah bullet point ke-2 menjadi 'Designed scalable APIs using GraphQL'."
Benefit: Memastikan resume Bapak lolos filter robot pertama.
3. Fitur "Salary Reality Check" (PPP Calculator) 💸
Masalah: Gaji $2,000 di Amerika itu "miskin", tapi di Indonesia itu "Raja". Kadang kita bingung nilai gaji kalau mata uang asing.
Solusi: Integrasi konsep Purchasing Power Parity (PPP) sederhana.
Cara Kerja: Kalau Job Desc bilang "$3,000/month (Remote)", AI akan kasih info tambahan: "Setara gaya hidup Rp 65 Juta di Jakarta. (High Value)".
Benefit: Bapak langsung tahu "rasa" duitnya seberapa banyak untuk hidup di Indo.
4. Fitur "Application Tracker" (Mini CRM) 🗂️
Masalah: "Eh, perusahaan ini udah gue lamar belum ya minggu lalu?"
Solusi: Tombol "Mark as Applied".
Cara Kerja: Saat diklik, ekstensi menyimpan URL, Nama PT, Tanggal, dan Status (Applied) di browser storage.
Fitur Ekstra: Bisa Export to CSV/Notion. Jadi Bapak punya database rapi lowongan mana aja yang udah ditembak.
5. Fitur "Company Background Check" (Red Flag Detector V2) 🕵️‍♂️
Masalah: Job Desc bagus, tapi ternyata perusahaannya mau bangkrut atau punya reputasi buruk.
Solusi: AI melakukan pencarian kilat (via Google Search Snippet API gratisan).
Output: Menampilkan ringkasan berita terakhir. "Warning: Perusahaan ini baru saja lay off 20% karyawan bulan lalu" atau "Funding: Baru dapat Series A $10M".

📝 Rekomendasi Urutan Pengerjaan
Kalau mau dikerjakan bertahap (MVP), urutannya begini Pak:
V1 (Basic): Simpan Resume + Auto Scrape LinkedIn + Scoring sederhana.
V1.5 (UX): Tambah fitur Klik Kanan (Universal) biar bisa dipake di mana aja.
V2 (Writer): Tambah Auto-Cover Letter Generator.
V3 (Strategic): Tambah Tracker & Resume Tailoring.
Gimana Pak? Fitur "Klik Kanan" sama "Salary Reality Check" kayaknya yang paling krusial buat kenyamanan Bapak sehari-hari.


Jelas ada, Pak! Kalau kita mau bikin ini jadi The Ultimate Career Tool buat level Senior/Lead kayak Bapak, fiturnya harus lebih strategis. Bukan cuma soal "diterima kerja", tapi "menguasai permainan".
Ini tambahan fitur level "God Mode":
1. Fitur "The Interview Cheat Sheet" (Contekan Wawancara) 🎤
Masalah: Bapak jago koding, tapi kadang lupa teori atau istilah teknis spesifik yang diminta di JD saat interview dadakan.
Solusi: Setelah analisa JD, ada tombol "Prep Me for Interview".
Output AI:
"Pak, di JD mereka mention 'High Scale Traffic'. Siap-siap ditanya soal: Caching Strategy (Redis), Load Balancing, dan Database Sharding."
"Mereka pakai Next.js App Router. Kemungkinan besar bakal tanya bedanya Server Component vs Client Component."
Value: Bapak masuk interview udah pegang "kunci jawaban" sesuai stack mereka.
2. Fitur "The Gap Closer" (Belajar Kilat) 📚
Masalah: Skor Bapak 90%, tapi ada 1 skill missing, misal: "GraphQL". Bapak sebenernya bisa pelajari itu cepet, tapi butuh arah.
Solusi: AI mendeteksi Missing Skill dan kasih "15-Minute Crash Course Plan".
Output AI:
"Bapak belum mencantumkan GraphQL. Untuk interview, pahami 3 konsep ini: Schema vs Resolver, Overfetching problem, dan cara integrate Apollo Client. Ini link dokumentasi resminya."
Value: Bapak bisa bilang pas interview: "Saya belum pernah pakai di production, tapi saya paham konsep A, B, C-nya." (Ini jawaban senior yang valid).
3. Fitur "Hiring Manager Hunter" (Jalur Belakang) 🕵️‍♂️
Masalah: Apply lewat portal sering tenggelam. Cara terbaik adalah DM langsung User/CTO-nya.
Solusi: Integrasi simpel ke LinkedIn Search.
Cara Kerja:
Ekstensi mendeteksi nama perusahaan (misal: "Gojek").
Ada tombol "Find Manager".
Ekstensi otomatis buka tab baru LinkedIn Search dengan query: Company: Gojek AND Title: (Engineering Manager OR CTO OR Head of Engineering).
Plus, AI bikinin draft DM: "Hi [Name], I saw your opening for Lead Dev. My background in scaling Next.js apps seems like a direct match..."
4. Fitur "Nous Integration" (RAG Feeder) 🧠
Ini khusus buat Bapak:
Masalah: Bapak lagi bangun "Nous" (Knowledge Base/Agent). Sayang kalau data market (tren teknologi di lowongan kerja) terbuang.
Solusi: Tombol "Save to Nous".
Cara Kerja:
Teks JD disimpan ke database Nous Bapak.
Lama-lama, Nous jadi pinter: "Pak, dari 50 lowongan yang Bapak simpan bulan ini, 80% minta TypeScript dan 40% mulai minta pengalaman AI Agent. Kita perlu update portfolio ke arah sana."
Value: Bapak punya data market intelligence sendiri.
5. Fitur "Burnout Protector" (Glassdoor Sentiment) 📉
Masalah: Gaji gede, stack keren, tapi ternyata rating karyawannya anjlok (banyak yang stres).
Solusi: Cek reputasi via API publik.
Cara Kerja: Tampilkan pop-up kecil: "Warning: Company Rating 2.1/5. Keluhan utama: No Work Life Balance & Management changes."

🔥 Rekomendasi Saya
Kalau Bapak mau mulai weekend ini, fokus ke MVP ini dulu aja, Pak:
Input: Resume Bapak (Text).
Process: Scraping JD + AI Scoring (Gaji, Remote, Stack).
Output: Skor 0-100 & "Missing Keywords".
Itu aja udah sangat membantu Bapak memfilter ratusan lowongan dalam hitungan detik. Nanti fitur Cheat Sheet dll bisa nyusul.
Gimana Pak? Jadi semangat pengen ngoding ekstensi ini gak? 😄


Here is the complete Product Requirement Document (PRD) in English, combining all the ideas we discussed (Basic to "God Mode"). You can save this as README.md or a Notion document to start your project.
📄 Product Requirement Document (PRD)
Project Name: CareerFit AI – The Senior Engineer’s Career Guardian
1. Executive Summary
CareerFit AI is a browser-based "Career Guardian" designed for senior professionals. Unlike standard job scrapers, it acts as a strategic assistant that not only matches technical skills but also validates company culture, salary standards, and "red flags" in real-time. It leverages local AI (or API) to analyze Job Descriptions (JDs) instantly, providing a matching score, tailored application materials, and strategic interview preparation.
2. User Persona
Target User: Senior Software Engineers / Tech Leads.
Pain Points: Wasting time on irrelevant JDs, facing "toxic" work cultures, salary mismatch, and the tedious process of tailoring resumes for ATS (Applicant Tracking Systems).
Goals: Find high-value roles (Remote/USD Salary), ensure culture fit (AI-friendly), and maximize interview success rates.
3. Core Features (The Foundation)
A. Context & Preference Management (The Brain)
A dedicated settings page where the user inputs their "Source of Truth":
Resume/Portfolio: Raw text or JSON input of skills and experience.
The "Non-Negotiables":
Minimum Salary: (e.g., > $2,500/month).
Work Mode: (Remote Only / Hybrid).
Tech Stack: (e.g., Must use Next.js/React).
Culture: (AI-Friendly, English speaking).
B. Universal Context Menu (The "Right-Click" Magic)
Problem: Job sites change layouts frequently, breaking auto-scrapers.
Solution: A right-click context menu option: "Analyze with CareerFit AI".
Function: Works on any website (LinkedIn, YC, Glints, PDF viewers). The user highlights the text -> Right Click -> Analyze.
C. Intelligent Scoring Engine
The AI analyzes the JD against the user's context and generates a 0-100% Fit Score based on:
Tech Match (40%): Does the user have the required stack?
Strategic Match (40%): Does the role meet the "Non-Negotiables" (Remote, Salary, English)?
Red Flag Detector (20% Penalty): Deducts points for toxic phrases (e.g., "We are a family", "Must handle high stress", "No AI tools").
4. Advanced Features (The "Strategic" Layer)
A. Salary Reality Check (PPP Calculator)
Feature: Automatically converts foreign currency salaries to local purchasing power context.
Output: "Offer is $3,000 USD. Equivalent to living like a King in Jakarta (~IDR 65M purchasing power)."
B. ATS & Resume Tailoring
Feature: Analyzes gaps between the User's Resume and the JD.
Output: "Your resume lists 'API Design', but this JD searches for 'GraphQL Schema'. Suggestion: Update bullet point #2 to include 'Designed scalable APIs using GraphQL'."
C. Auto-Cover Letter Generator
Feature: Generates a persuasive, highly personalized cover letter.
Logic: Maps the user's specific achievements to the company's pain points listed in the JD.
D. Application Tracker (Mini CRM)
Feature: One-click "Mark as Applied". Saves the URL, Company Name, and Date to local storage.
Export: Ability to export the list to CSV or Notion.
5. "God Mode" Features (The Senior Edge)
A. The Interview Cheat Sheet
Feature: Generates a prep-sheet immediately after analysis.
Output: "They use Next.js App Router. Be prepared to answer questions about Server vs Client Components and Hydration boundaries."
B. The Gap Closer (Crash Course)
Feature: Identifies a missing skill and provides a 15-minute learning plan.
Output: "Missing Skill: Docker. Key concepts to learn for the interview: Containerization basics, Dockerfile structure, and Docker Compose. [Link to Docs]."
C. Hiring Manager Hunter (LinkedIn Integration)
Feature: A shortcut button "Find Hiring Manager".
Action: Opens a LinkedIn search query for Company Name + (CTO OR Head of Engineering OR Engineering Manager) to facilitate direct networking.
D. Nous Integration (Knowledge Base Feeder)
Feature: "Save to Nous" button.
Action: Sends the structured data of the JD to the user's external RAG knowledge base ("Nous") to track market trends and demand over time.
6. Technical Stack & Architecture
Frontend: React.js + Vite (bundled as Chrome Extension).
Manifest Version: V3.
Storage: chrome.storage.local (Secure, local data persistence).
AI Engine Options:
Option A (Privacy/Free): Chrome Built-in AI (window.ai / Gemini Nano) - Runs locally.
Option B (Accuracy): OpenAI API / Gemini Flash API - Serverless calls for complex reasoning.
7. User Flow Example
Setup: User installs extension, pastes Resume, sets Min Salary $2,500.
Browse: User lands on a LinkedIn Job Post.
Analyze: User clicks the extension icon (or Right-click "Analyze").
Result:
Score: 92% (Green).
Green Flags: Remote, Salary listed ($3k), Modern Stack.
Red Flags: None.
Missing Keywords: "Redis".
Action:
User clicks "Generate Cheat Sheet" to prep for "Redis" questions.
User clicks "Draft Cover Letter" & "Tailor Resume".
User applies and clicks "Mark as Applied".
Status: Ready for Development.
Next Step: Initialize npm create vite@latest careerfit-ai --template react.
