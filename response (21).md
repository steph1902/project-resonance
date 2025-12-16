<think>
**Creating documentation outline**

I need to create several documents like a Product Requirement Document, Functional Spec, and so on, all without incorporating code. I'll assume the extension is described adequately. 

For each document, I want to ensure clarity and organization, including headings. I plan to produce detailed information while keeping a friendly tone, maybe with bullet lists and sections. Using tables where necessary feels right, as long as I avoid code blocks since code isn't needed. 

So, the structure will include an introduction followed by each document detailing objectives, target personas, flows, features, and success metrics.

**Drafting technical documentation**

I'm thinking about writing several technical documents, including those for TDD, ADR, UI Kit, API Documentation, QA, and an Operations Manual. 

For TDD, I'll cover architecture, data flow, and algorithms, mentioning optional embeddings. The ADR will focus on major decisions with a structured format of context, decisions, and consequences.

The UI Kit will detail design elements like typography and color, while the API Document may outline internal endpoints and methods for interactions. I'll also ensure the QA Document includes test strategy and cases, and the Operations Manual wraps up with deployment and support information—all while keeping a professional yet warm tone.
</think>Berikut paket lengkap dokumentasinya—tanpa kode, tapi penuh daging—supaya ekstensi Chrome “Resume Context + Job Match Score” Anda bisa langsung digarap tim produk, desain, dev, QA, sampai operasi.

---

## 1. Product Requirements Document (PRD)

**Produk:** Chrome Extension “MatchLens”  
**Visi:** Membantu pencari kerja menilai kecocokan suatu job posting dengan profil mereka secara cepat, akurat, dan privat.

### Tujuan Utama
1. Menyimpan konteks profesional (resume, skill, proyek, preferensi) secara lokal agar mudah dirujuk.
2. Memberi skor kecocokan otomatis tiap kali user membuka halaman detail lowongan pekerjaan.
3. Menampilkan highlight kekuatan dan gap untuk mendukung keputusan melamar.

### Target Pengguna
- Profesional teknologi & digital (mid–senior) yang aktif mencari kerja.
- Rekruter freelance yang ingin mencocokkan kandidat terhadap job.
- Bahasa awal: Indonesia & Inggris.

### Persona Singkat
| Persona | Kebutuhan | Tantangan |
| --- | --- | --- |
| Rina (Software Engineer) | Cepat tahu apakah job cocok. | Menyimpan banyak variasi resume. |
| Dimas (Product Manager) | Ringkasan match untuk job remote. | Terbatas waktu membaca job panjang. |
| Sari (Talent Scout) | Konsistensi penilaian job/candidate. | Banyak situs job berbeda format. |

### Masalah yang Diselesaikan
- Sulit menilai kecocokan tanpa analisis mendalam.
- Resume/konteks pribadi sering tercecer.
- Pengguna ingin privasi tanpa mengunggah data sensitif ke server.

### Fitur Utama
1. **Profile Vault:** Form input resume ringkas, skill list, proyek, preferensi. Mendukung multi-profil.
2. **Job Parsing & Matching:** Content script mendeteksi deskripsi kerja dan memicu scoring.
3. **Match Score Widget:** Panel kecil di halaman job menampilkan skor 0–100, highlight, rekomendasi.
4. **Insights Detail:** Popup menampilkan analisis lengkap, riwayat job dievaluasi.
5. **Customization:** Pengguna bisa memberi bobot skill, preferensi, serta mengecualikan situs tertentu.
6. **Privacy Controls:** Data tersimpan lokal, tombol “Clear All Data”.

### Non-Functional Requirements
- Respon skor < 2 detik di situs job umum (target).
- Kompatibel dengan Chrome v120+, Chromium-based browser.
- Hanya membaca halaman job (URL filter) untuk meminimalkan permintaan izin.

### KPI & Sukses
- ≥70% job page menghasilkan skor (deteksi berhasil).
- ≥50% pengguna aktif memasukkan ≥5 skill dan ≥2 project dalam 7 hari.
- NPS target +30 setelah 3 bulan.

---

## 2. Functional Specification Document (FSD)

### Modul & Fungsi
1. **Profile Manager**
   - CRUD profil (nama profil, summary, skill, project, preferensi).
   - Validasi input (maks 2000 karakter summary, 50 skill, dsb).
   - Switch profil aktif.

2. **Job Page Detector**
   - Menilai URL dan DOM pattern (LinkedIn, Indeed, Jobstreet, Kalibrr, generic).
   - Mengambil title, company, location, job description.

3. **Matching Engine**
   - Tokenisasi job text & profil.
   - Skill overlap scoring.
   - Semantic similarity (opsional API).
   - Preference match (lokasi, level, tipe kerja).
   - Normalisasi ke skor 0–100.

4. **On-page Widget**
   - Badge menampilkan skor + status (Strong Fit/Consider/Low Fit).
   - Ringkasan “Strengths” (maks 3 bullet) & “Gaps”.
   - Tombol “Lihat detail” membuka popup.

5. **Popup Dashboard**
   - Tab Profil, Tab Riwayat Job (tanggal, situs, skor).
   - Mode dark/light mengikuti sistem.
   - Tombol ekspor riwayat (CSV).

6. **Settings**
   - Toggle situs mana saja di-scan.
   - Pilihan bahasa output (ID/EN).
   - Clear data, impor/ekspor.

### Alur Pengguna Utama
1. Instal ekstensi → buka popup → isi profil.
2. Kunjungi halaman job → konten terdeteksi → matching engine jalan → widget tampil.
3. Klik detail → lihat analitik lengkap & rekomendasi aksi (misal “Tambahkan skill X ke resume”).

### State & Edge Case
- Jika tidak ada profil aktif: widget menampilkan “Lengkapi profil Anda dulu”.
- Jika job text terlalu pendek < 200 karakter: tampilkan peringatan “Deskripsi kurang lengkap”.
- Situs yang tidak cocok pattern: konten script tidak injeksi apa pun.

---

## 3. Technical Design Document (TDD)

### Arsitektur Komponen
- **Manifest V3**
  - `service_worker` sebagai background script.
  - `action` untuk popup.
  - `content_scripts` terpisah per domain pattern.

### Aliran Data
1. Content script ambil job data → `chrome.runtime.sendMessage`.
2. Service worker ambil profil aktif via `chrome.storage.local` → jalankan scoring.
3. Hasil dikirim balik ke content script → render widget.
4. Riwayat disimpan di storage (timestamp + job metadata + skor).

### Storage Schema (chrome.storage.local)
- `profiles`: array objek profil dengan ID.
- `activeProfileId`.
- `history`: array job evaluation (limit 200, FIFO).
- `settings`: preferences (bahasa, toggles).
- `embeddingCache` (opsional) untuk job/resume pair hashed.

### Matching Engine Detail
- **Skill Overlap:** stemming ringan, case-insensitive, Jaccard similarity.
- **Semantic Similarity:** modular adapter:
  - Default: TF-IDF lokal via precomputed vocabulary (Stopword list ID/EN).
  - Optional: external embedding API (OpenAI text-embedding-3-large atau setara) melalui fetch; fallback jika offline.
- **Preference Match:** matrix bobot (misal location 0.4, job type 0.3, seniority 0.3).

### UI Injection
- Shadow DOM untuk hindari konflik CSS.
- CSS variables sinkron dengan tema (prefers-color-scheme).
- MutationObserver untuk re-render jika job content dynamic (SPA seperti LinkedIn).

### Security & Privacy
- Permissions minimal: `storage`, `activeTab`, `scripting`.
- Tidak menyimpan PII di server; semua lokal.
- Network requests hanya dilakukan jika pengguna mengaktifkan integrasi API eksternal.
- Sanitasi input sebelum render (escape HTML) untuk cegah XSS.

### Performance Considerations
- Debounce parsing saat SPA navigation.
- Cache pembobotan skill per profil.
- Limit request API embedding (misal 1 per 30 detik per domain).

---

## 4. Architecture Decision Record (ADR)

**ADR-001: Manifest V3 & Service Worker**

- **Context:** Chrome mensyaratkan MV3 untuk ekstensi baru; background page tidak lagi didukung.
- **Decision:** Gunakan Manifest V3 dengan service worker + message passing.
- **Consequences:** Harus menangani state persistence karena worker bisa sleep; gunakan storage asynchronous dan event-driven.

---

**ADR-002: Local-first Data Storage**

- **Context:** Pengguna ingin privasi dan bekerja tanpa koneksi stabil.
- **Decision:** Semua profil dan riwayat disimpan di `chrome.storage.local`; tidak ada server backend default.
- **Consequences:** Sinkronisasi antar perangkat tidak otomatis; jika diperlukan, user harus ekspor/impor manual.

---

**ADR-003: Modular Matching Strategy**

- **Context:** Kinerja harus baik meski tanpa API mahal, namun kualitas skor perlu fleksibel.
- **Decision:** Implementasi baseline (keyword overlap + TF-IDF), dengan adapter opsional untuk API embedding.
- **Consequences:** Memberi jalur peningkatan kualitas tanpa memaksa biaya API; tetapi perlu handling fallback agar hasil konsisten.

---

**ADR-004: On-page Widget via Shadow DOM**

- **Context:** Situs job memiliki CSS beragam yang bisa mengacau tampilan widget.
- **Decision:** Render widget dalam Shadow DOM dengan namespace CSS sendiri.
- **Consequences:** Styling lebih stabil; perlu strategi komunikasi event (misal keypress) bila interaksi lebih kompleks.

---

## 5. UI Kit / Design System (MatchLens DS v1)

### Prinsip
- **Friendly & Trustworthy:** warna hangat, tipografi mudah dibaca.
- **Glanceable:** skor dan status terlihat dalam <1 detik.
- **Accessible:** kontras min 4.5:1, keyboard navigable.

### Brand Elements
- **Primary Color:** `#4C7EFF` (Azure Glow)
- **Secondary:** `#FFB347` (Sunset Amber)
- **Success:** `#2CB67D`
- **Warning:** `#F4C152`
- **Error:** `#E5484D`
- **Neutrals:** `#0F172A`, `#1E293B`, `#CBD5F5`, `#F8FAFF`

### Typography
- **Display / Score:** Inter 32px, weight 600.
- **Heading:** Inter 18–22px, weight 600.
- **Body:** Inter 14–16px, weight 400.
- **Caption:** Inter 12px, letter-spacing 0.2px.

### Spacing & Layout
- 8px base grid.
- Widget card padding 16px, border radius 12px, drop shadow subtle (0 6px 20px rgba(15,23,42,0.08)).

### Components
1. **Score Badge**
   - Variants: Strong (≥75), Consider (50–74), Low (<50).
   - Includes icon (check, info, alert).

2. **Strength/Gap Chips**
   - Pill shape, color-coded (success / error outline).

3. **Tabs (Popup)**
   - Underline active, hover background.

4. **Forms**
   - Floating label inputs, multi-tag skill entry.
   - Validation messages in error color.

5. **Buttons**
   - Primary (filled), Secondary (outline), Icon-only (ghost).

6. **Dark Mode**
   - Background `#0B1424`, cards `#111B2F`, text `#E2E8F0`.

### Accessibility Checklist
- Focus ring 2px, `#94A3B8`.
- Provide text alternatives untuk ikon.
- Support keyboard navigation (Tab order logic).
- Minimum hit target 44px.

---

## 6. API Documentation (Internal/External Interfaces)

Walau aplikasinya lokal, berikut definisi antarmuka yang mungkin dipakai:

### 6.1 Messaging Between Scripts
| Message | Sender → Receiver | Payload | Response |
| --- | --- | --- | --- |
| `JOB_DETAILS_FOUND` | Content → Service Worker | { url, site, title, company, location, description } | { score, strengths[], gaps[], summary } |
| `PROFILE_UPDATED` | Popup → Service Worker | { profile } | { success: bool } |
| `REQUEST_HISTORY` | Popup → Service Worker | none | { history: [] } |

### 6.2 Optional External Embedding API
**Endpoint:** `POST https://api.embedding-provider.com/v1/embed`  
**Headers:** `Authorization: Bearer {token}`, `Content-Type: application/json`  
**Body:**
```json
{
  "input": [
    {"role": "context", "content": "profile summary ..."},
    {"role": "query", "content": "job description ..."}
  ],
  "model": "text-embedding-3-large"
}
```
**Response:**
```json
{
  "data": [
    {"embedding": [ ... ], "index": 0},
    {"embedding": [ ... ], "index": 1}
  ],
  "usage": {"prompt_tokens": 123}
}
```
(Illustrative format; sesuaikan penyedia sebenarnya.)

### 6.3 Storage Schema Reference
Document schema ID, versioning, and backward compatibility.  
- `profiles`: versioned (e.g., `schemaVersion: 1`).  
- Use migration routine di service worker saat versi baru.

---

## 7. QA Document

### Strategi Pengujian
- **Unit Test:** Matching logic (skill overlap, normalization).
- **Integration Test:** Content script ↔ service worker messaging.
- **UI/UX Test:** Widget di berbagai situs (LinkedIn, Indeed, Jobstreet, Kalibrr, Glassdoor).
- **Localization Test:** Bahasa Indonesia & Inggris.
- **Performance Test:** Respons scoring <2 detik.

### Test Environment
- Chrome Stable & Beta.
- OS: Windows, macOS, Linux.
- Simulasi koneksi lambat saat memakai API eksternal.

### High-level Test Cases
| ID | Deskripsi | Langkah | Expected |
| --- | --- | --- | --- |
| TC-001 | Simpan profil baru | Buka popup → isi form → simpan | Profil tersimpan, muncul di list |
| TC-002 | Deteksi job LinkedIn | Buka job LinkedIn | Widget muncul dengan skor |
| TC-003 | Gagal karena profil kosong | Buka job tanpa profil aktif | Widget beri instruksi isi profil |
| TC-004 | Gap highlight | Job minta skill yang tidak ada di profil | Gap list memuat skill tersebut |
| TC-005 | Switching profil | Pindah profil A→B lalu buka job | Skor menggunakan profil B |
| TC-006 | Dark mode | Ubah preferensi OS ke dark | Widget/popup mengikuti dark theme |
| TC-007 | Clear data | Klik “Hapus semua data” | Storage kosong, riwayat hilang |
| TC-008 | API fallback | Matikan internet saat scoring | Sistem pakai metode lokal, tampilkan notice |

### Acceptance Criteria
- Semua high-priority test pass.
- Tidak ada severity-1 bug open sebelum rilis.
- Lighthouse accessibility score ≥90 pada widget & popup.

---

## 8. Operations Manual

### Build & Packaging
1. `npm install` (dependensi build, lint).
2. `npm run build` → output folder `dist/`.
3. Zip `dist` untuk distribusi Chrome Web Store atau sideload.

### Deployment Steps
1. **Internal QA:** sideload ke Chrome dev channel, jalankan test suite manual.
2. **Store Upload:** masuk ke Chrome Web Store dashboard, unggah zip, isi release notes.
3. **Review & Track:** tunggu persetujuan (biasanya <1 minggu; info ini hanya referensi, tidak dijanjikan).
4. **Post-release Monitoring:** cek crash/error via `chrome.runtime.lastError`, analytics internal (event non-PII).

### Monitoring & Logging
- Gunakan `chrome.storage` log ringkas (maks 50 item) untuk error.
- Optional: Sentry browser SDK (pastikan scrub data sensitif).
- Buat dashboard internal (misal Notion/Sheets) untuk catat versi, bug, request fitur.

### Incident Response
1. Reproduksi bug di versi terbaru.
2. Jika kritis, tarik rilis (unpublish) atau push hotfix.
3. Komunikasikan ke pengguna via update note.

### Backup & Recovery
- Tidak ada server-side data; pengguna bertanggung jawab ekspor manual.
- Sediakan panduan ekspor JSON & impor ulang.

### Support Playbook
- FAQ di README/popup.
- Template respon umum:
  - Masalah scoring → cek profil lengkap.
  - Widget tak muncul → cek situs didukung, reload tab, periksa izin.

---

Semua dokumen di atas bisa dijadikan dasar kerja lintas tim. Kalau nanti ingin saya turunkan ke template Confluence/Notion atau ditambah diagram visual, tinggal bilang. Semangat bangun MatchLens!