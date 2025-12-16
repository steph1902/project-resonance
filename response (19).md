<think>
We are asked: "kita bisa enggak sih buat google chrome extensions?" (Can we make a Google Chrome extension?) The user proposes:

1. Program save resume and portfolio projects as context.
2. When I open a job posting website (the job description detail page), the Chrome extension will give a matching score?

So basically they want to know if it's possible to create a Chrome extension that:

- Stores the user's resume and portfolio projects (like as a context, maybe the extension stores the data locally or in cloud).
- Then when visiting a job description page, the extension automatically analyzes the job description and compares it with the stored resume/projects, and provides a matching score.

This is definitely possible. Chrome extensions can read the page content (using content scripts), they can store data (using chrome.storage or local storage), and they can do some processing (like natural language processing) either locally (using a library) or by sending the data to a backend.

Given it's a general question "kita bisa enggak sih buat google chrome extensions?" (Can we make a Google Chrome extension?) the answer is yes, we can.

But we need to provide a helpful answer: explain that it's possible and outline the architecture and steps.

The user is speaking Indonesian, so I'll respond in Indonesian. But I need to respect the instruction to always communicate in the same language the user is using, unless they request otherwise. So I'll answer in Indonesian.

I should also follow the markdown and LaTeX rules. Possibly include code blocks for example.

But the question is not asking for code specifically, but just feasibility and maybe high-level approach.

Given it's a "general purpose assistant" and the user is asking "Can we...?" they may be looking for guidance on how to approach building it.

Thus answer: Yes, it's possible. Provide an overview: Chrome extension components, how to store data, read page content, compute matching (maybe using TF-IDF or embeddings via API). Mention potential challenges: parsing different job sites, handling user data privacy, etc.

Also note that the user said "program simpan resume dan portfolio projects sebagai context". That could be done by allowing user to upload a PDF or enter text, etc.

I'll provide a high-level architecture and steps.

Make sure not to reveal my identity. But that's not an issue.

I'll answer in Indonesian, friendly and informal.

Let's structure:

- Introduction: Yes, it's possible.
- Components:
 - Popup or options page: to let user input resume and projects (or upload).
 - Storage: chrome.storage.sync or chrome.storage.local.
 - Content script: injected into job posting pages.
 - Background script: maybe for processing, but can also do in content script.
 - Matching algorithm: Could be simple keyword matching, or use embeddings from an API like OpenAI, but then need backend. Alternatively do client-side NLP with libraries (e.g., natural.js). But simpler: cosine similarity after TF-IDF.
- How it works:
 - User saves data.
 - When visiting a job page, content script extracts job description text.
 - Compute similarity between job description and resume/projects.
 - Show a badge or popup with score.
- Considerations: Security, privacy, cross-origin, permissions needed.
- Implementation steps: Create manifest.json, write scripts, etc.
- Possibly include a small code snippet as example.

But the instructions say: "In those cases, you MUST use markdown code blocks to write code, specifying the language for syntax highlighting, for example ```bash or ```python". So if I provide code, use code blocks. I could provide a minimal example.

I'll include a simple manifest.json and content script example. But careful: the user might not have asked for code, but it's helpful.

Given the environment, they might be a developer looking to build it. I'll provide guidance.

I must also note that I should avoid long responses >2000 words unless necessary. This won't be that long.

Let's start.

I'll write in Indonesian.

Answer:

```markdownTentu saja bisa! Ekstensi Chrome dapat dibuat untuk menyimpan resume dan proyek portofolio sebagai konteks, lalu menampilkan skor kecocokan ketika kamu membuka halaman deskripsi lowongan kerja. Berikut penjelasan singkat tentang cara membangunnya.
```

Then go into details.

Make sure to mention that it requires some web development knowledge: HTML, CSS, JavaScript.

Outline:

1. Struktur Dasar Ekstensi Chrome:
 - manifest.json: file konfigurasi.
 - Popup (HTML, JS, CSS) untuk input data.
 - Background script (opsional).
 - Content script untuk membaca halaman lowongan kerja.
 - Storage: chrome.storage.local atau sync.

2. Penyimpanan Data Pengguna:
 - Gunakan `chrome.storage.local.set` untuk menyimpan teks resume dan proyek.
 - Atau izinkan pengguna mengunggah file PDF dan ekstrak teks (lebih kompleks).

3. Membaca Deskripsi Lowongan:
 - Content script diinjeksikan ke halaman dengan pola URL yang sesuai (misal *://*.linkedin.com/jobs/*).
 - Mengambil teks dari elemen yang berisi deskripsi (mungkin perlu penyesuaian untuk tiap situs).
 - Menggunakan selector atau teknik seperti membaca seluruh body.

4. Menghitung Skor Kecocokan:
 - Opsi sederhana: hitung overlap kata kunci (TF-IDF sederhana).
 - Opsi lebih canggih: gunakan API NLP seperti OpenAI Embeddings (perlu backend).
 - Contoh sederhana: ubah resume dan deskripsi menjadi vektor berdasarkan kata, hitung cosine similarity.

5. Menampilkan Hasil:
 - Bisa berupa badge di toolbar, atau popup kecil di halaman (misal dengan membuat elemen di sudut).
 - Bisa juga menampilkan di popup ekstensi.

6. Izin yang Diperlukan:
 - `storage`: untuk menyimpan data.
 - `activeTab` atau `host_permissions` untuk mengakses konten halaman.
 - Mungkin `scripting` jika menggunakan dynamic injection.

7. Contoh Kode Minimal:

I'll provide a simple manifest.json and content script.

But careful: the user is not asking for code, but showing a minimal example can be helpful. However, I must keep it within reason.

I can show:

manifest.json:
```json{
 "manifest_version":3,
 "name": "Job Matcher",
 "version": "1.0",
 "permissions": ["storage", "activeTab", "scripting"],
 "host_permissions": ["<all_urls>"],
 "action": {
 "default_popup": "popup.html"
 },
 "content_scripts": [
 {
 "matches": ["https://*.linkedin.com/jobs/*", "https://*.indeed.com/*", ...],
 "js": ["content.js"]
 }
 ]
}
```

popup.html: simple input and save button.

content.js: listen for DOM, extract text, load stored resume, compute simple matching.

But the code might be long. I can just outline.

I can provide pseudo-code.

I'll do:

```javascript// content.js// ambil teks dari halaman (contoh sederhana)
const desc = document.body.innerText;
// ambil resume dari storagechrome.storage.local.get('resumeText', (data) => {
 const resume = data.resumeText || '';
 const score = calculateMatch(resume, desc);
 // tampilkan di halaman const badge = document.createElement('div');
 badge.style = 'position: fixed; top:10px; right:10px; background: yellow; padding:5px; z-index:9999;';
 badge.innerText = `Kecocokan: ${Math.round(score*100)}%`;
 document.body.appendChild(badge);
});

function calculateMatch(text1, text2) {
 // sederhana: hitung Jaccard similarity atau cosine similarity // implementasi dasar}
```

But that's a lot. I'll keep it brief.

I also need to talk about challenges: site-specific DOM, parsing PDF resume.

Finally, conclude.

I'll answer in Indonesian.

Now, response formatting: I'll use sections with headings, code blocks where appropriate.

Remember to avoid revealing identity. This is fine.

I'll produce a helpful answer.
</think>Tentu saja bisa! Ekstensi Chrome dapat dibuat untuk menyimpan resume dan proyek portofolio sebagai konteks, lalu menampilkan skor kecocokan ketika kamu membuka halaman deskripsi lowongan kerja. Berikut penjelasan singkat tentang cara membangunnya.

## Gambaran Umum

Ekstensi Chrome terdiri dari beberapa komponen:

- **Manifest** (`manifest.json`) – file konfigurasi yang mendefinisikan izin, komponen, dan metadata.
- **Popup** (HTML, CSS, JS) – antarmuka kecil yang muncul ketika ikon ekstensi diklik, digunakan untuk memasukkan/mengelola data resume.
- **Content Script** – JavaScript yang diinjeksikan ke halaman web tertentu (misalnya halaman lowongan kerja) untuk membaca konten dan menampilkan hasil.
- **Background Script** (opsional) – untuk logika yang berjalan di belakang layar, seperti pengolahan teks yang berat atau komunikasi dengan API eksternal.
- **Storage** – menggunakan `chrome.storage.local` atau `chrome.storage.sync` untuk menyimpan data pengguna secara lokal atau disinkronkan.

## Langkah-langkah Implementasi

### 1. Menyimpan Resume dan Portofolio

Pengguna dapat memasukkan teks resume dan daftar proyek melalui popup ekstensi. Data tersebut disimpan di `chrome.storage.local`.

**Contoh popup.html sederhana:**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Job Matcher</title>
    <script src="popup.js"></script>
  </head>
  <body>
    <h3>Resume</h3>
    <textarea id="resume" rows="10" cols="50"></textarea>
    <h3>Proyek Portofolio</h3>
    <textarea id="projects" rows="5" cols="50"></textarea>
    <br>
    <button id="save">Simpan</button>
  </body>
</html>
```

**popup.js:**

```javascript
document.getElementById('save').addEventListener('click', () => {
  const resume = document.getElementById('resume').value;
  const projects = document.getElementById('projects').value;
  chrome.storage.local.set({ resume, projects }, () => {
    alert('Data disimpan!');
  });
});
```

### 2. Membaca Deskripsi Lowongan Kerja

Content script diinjeksikan ke halaman yang cocok dengan pola URL situs lowongan kerja (LinkedIn, Indeed, Glints, dll). Di dalam script, kamu perlu mengambil teks deskripsi pekerjaan. Karena setiap situs memiliki struktur HTML yang berbeda, mungkin diperlukan selektor khusus atau teknik seperti membaca elemen dengan kelas tertentu.

**Contoh content.js (sederhana):**

```javascript
// Ambil teks dari elemen yang mungkin berisi deskripsi
function extractJobDescription() {
  // Contoh untuk LinkedIn: coba ambil elemen dengan kelas .description__text
  const descElem = document.querySelector('.description__text');
  return descElem ? descElem.innerText : document.body.innerText;
}

const jobDesc = extractJobDescription();

// Muat data resume dari penyimpanan
chrome.storage.local.get(['resume', 'projects'], (data) => {
  const resumeText = data.resume || '';
  const projectsText = data.projects || '';
  const combinedContext = resumeText + ' ' + projectsText;
  const score = calculateMatch(combinedContext, jobDesc);
  displayScore(score);
});

function calculateMatch(text1, text2) {
  // Implementasi sederhana: Cosine Similarity dengan TF-IDF dasar
  // (gunakan pustaka seperti natural.js untuk kemudahan)
  // Contoh sangat sederhana: Jaccard similarity
  const words1 = new Set(text1.toLowerCase().split(/\W+/));
  const words2 = new Set(text2.toLowerCase().split(/\W+/));
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

function displayScore(score) {
  const badge = document.createElement('div');
  badge.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #4CAF50;
    color: white;
    padding

*You stopped this response*