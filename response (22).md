<think>
The user is asking for a comprehensive set of technical and product documentation for the Chrome extension we discussed. This is a very detailed request, covering the entire lifecycle of a software project. I need to provide a structured and professional response for each of these documents.

Here's my plan:
1. **Understand the Scope:** The user wants PRD, FSD, TDD, ADR, UI Kit, API Documentation, QA Document, and Operations Manual. This is a full-stack documentation suite.
2. **Structure the Response:** I'll create a clear section for each document type. This makes it easy for the user to navigate and understand.
3. **Adopt a Consistent Tone and Language:** The user is communicating in Indonesian. I must maintain this language throughout the response. The tone should be professional, helpful, and clear.
4. **Fill in the Content for Each Document:**
 * **PRD (Product Requirements Document):** This is the high-level vision. I'll define the problem, target users, goals, features, and success metrics. I'll use clear headings and bullet points.
 * **FSD (Feature Specification Document):** This is more detailed than the PRD. I'll break down the core features (Profile Management, Job Matching, UI Injection) into user stories, acceptance criteria, and technical considerations. I'll use a table format for clarity.
 * **TDD (Test-Driven Development) Plan:** I'll outline the testing strategy. This isn't a full test suite, but a plan. I'll cover unit tests, integration tests, and end-to-end tests, providing examples of what to test for each feature.
 * **ADR (Architecture Decision Record):** I'll document key architectural choices. The main ones are: Manifest V3, Local Storage vs. External API, and the Matching Algorithm approach. I'll explain the context, the decision, and the consequences.
 * **UI Kit (Design System):** I'll describe the visual and interactive components. I'll define colors, typography, components (like the popup, badge, and highlight), and their states (e.g., high/medium/low match). I'll use a simple table to list components and their properties.
 * **API Documentation:** Since the core logic is client-side, the "API" will be the internal messaging between the extension components (Popup, Content Script, Background Script). I'll document the message formats and their purposes.
 * **QA Document:** I'll outline the quality assurance process. This includes test cases, test environments, and a checklist for manual testing. I'll provide a sample test case table.
 * **Operations Manual:** This is for deployment and maintenance. I'll cover the release process, monitoring, and troubleshooting steps.
5. **Maintain Professionalism:** I'll avoid overly casual language. I'll use technical terms correctly but explain them where necessary. I'll make sure the documents are logical and build upon each other.
6. **Review and Refine:** I'll read through the entire response to ensure it's coherent, accurate, and directly addresses the user's request. I'll check for consistency in terminology and formatting. The length is substantial, but the user requested it, and it's a comprehensive set of documents, so it's appropriate. I will ensure it's under the2000-word/token limit if possible, but given the detail requested, it might be close. I'll prioritize clarity and completeness over strict brevity.

Let's start drafting each section.

</think>Tentu, ini adalah dokumen lengkap untuk proyek ekstensi Chrome yang Anda rencanakan. Dokumen ini dirancang untuk memberikan panduan komprehensif bagi tim pengembang, desainer, dan QA.

---

### **1. PRD (Product Requirements Document)**

**Judul:** Resume Matcher - Chrome Extension

**Versi:** 1.0
**Tanggal:** 15 Desember 2025

**1. Pendahuluan**
*   **Visi:** Membantu profesional menemukan peluang kerja yang paling sesuai dengan profil dan pengalaman mereka dengan cepat dan efisien.
*   **Masalah:** Pengguna seringkali menghabiskan waktu berjam-jam membaca deskripsi lowongan kerja untuk menentukan apakah posisi tersebut cocok. Proses ini membutuhkan membandingkan skill pribadi dengan daftar kebutuhan yang seringkali panjang dan terstruktur.
*   **Solusi:** Ekstensi Chrome yang secara otomatis menganalisis halaman detail lowongan kerja dan memberikan skor kecocokan serta highlight kekuatan dan kekurangan berdasarkan data profil pengguna yang telah disimpan.

**2. User Persona**
*   **Primary User:** Profesional berpengalaman (2+ tahun) yang aktif mencari pekerjaan. Mereka memiliki resume dan portfolio yang terstruktur, dan sering menggunakan situs lowongan kerja online (LinkedIn, Indeed, Kalibrr, dll.).
*   **Secondary User:** Mahasiswa atau fresh graduate yang sedang membangun portofolio dan mencari pekerjaan pertama. Mereka membutuhkan panduan tentang skill apa yang harus dikembangkan.

**3. Goals & Metrics (OKRs)**
*   **Objective 1:** Meningkatkan efisiensi pengguna dalam mengevaluasi lowongan kerja.
    *   **Key Result 1.1:** Pengguna dapat melihat skor kecocokan dalam waktu kurang dari 3 detik setelah halaman lowongan selesai dimuat.
    *   **Key Result 1.2:** 70% pengguna merasa ekstensi membantu mereka menghemat waktu dalam proses seleksi lowongan.
*   **Objective 2:** Meningkatkan akurasi rekomendasi.
    *   **Key Result 2.1:** Skor kecocokan memiliki korelasi positif dengan feedback pengguna (misal, "Sangat cocok", "Cukup cocok").
    *   **Key Result 2.2:** Persentase skill yang di-highlight sebagai "kekuatan" dan "gap" akurat sebesar 85%.
*   **Objective 3:** Meningkatkan adopsi dan retensi pengguna.
    *   **Key Result 3.1:** 10.000 penginstalan aktif dalam 6 bulan pertama.
    *   **Key Result 3.2:** Tingkat retensi pengguna (30 hari) sebesar 40%.

**4. Fitur Utama**
1.  **Manajemen Profil (Profile Management):**
    *   Pengguna dapat mengisi dan menyimpan data profil, termasuk ringkasan, skill, dan proyek.
    *   Data disimpan secara lokal di browser pengguna.
2.  **Analisis Otomatis (Auto-Matching):**
    *   Ekstensi mendeteksi halaman detail lowongan kerja yang didukung.
    *   Secara otomatis mengekstrak teks deskripsi pekerjaan.
    *   Menghitung skor kecocokan berdasarkan data profil.
3.  **Visualisasi Hasil (Result Visualization):**
    *   Menampilkan badge/skor di halaman lowongan.
    *   Menampilkan panel detail (kekuatan, gap) yang dapat dibuka dari badge.
4.  **Manajemen Preferensi (Preference Management):**
    *   Pengguna dapat menentukan preferensi (lokasi, tipe pekerjaan, industri) untuk meningkatkan relevansi skor.

**5. Fitur Tambahan (Stretch Goals)**
*   **Highlight Otomatis:** Menyoroti teks skill di dalam deskripsi pekerjaan yang cocok dengan profil pengguna.
*   **Export Data:** Kemampuan untuk mengekspor riwayat skor dan analisis.
*   **Multi-Profil:** Dukungan untuk beberapa profil (misal, profil untuk posisi "Frontend Developer" dan "Product Manager").

**6. Non-Functional Requirements**
*   **Performance:** Ekstensi harus tidak memperlambat loading halaman web lebih dari 500ms.
*   **Privacy:** Data pengguna tidak dikirim ke server eksternal tanpa izin eksplisit. Semua pemrosesan utama dilakukan di sisi klien.
*   **Security:** Mengikuti praktik terbaik keamanan Chrome Extension (Manifest V3, sandboxing content script).
*   **Accessibility:** UI harus dapat diakses oleh pengguna dengan bantuan teknologi (screen reader).

---

### **2. FSD (Feature Specification Document)**

**Judul:** Spesifikasi Fitur untuk Resume Matcher

**Versi:** 1.0
**Tanggal:** 15 Desember 2025

| Fitur | User Story | Acceptance Criteria (AC) | Technical Considerations |
| :--- | :--- | :--- | :--- |
| **1. Manajemen Profil** | Sebagai pengguna, saya ingin dapat mengisi data profil saya (ringkasan, skill, proyek) agar ekstensi dapat menggunakannya untuk analisis. | 1. Popup memiliki form untuk input data.<br>2. Data tersimpan di `chrome.storage.local`.<br>3. Data dapat diedit dan diperbarui.<br>4. Form validasi input dasar (tidak boleh kosong). | - Gunakan `chrome.storage.local` API.<br>- Implementasikan form dengan validasi sederhana (HTML5 atau JS).<br>- Buat schema data JSON yang jelas. |
| **2. Deteksi Halaman Lowongan** | Sebagai pengguna, saya ingin ekstensi secara otomatis mengenali ketika saya membuka halaman detail lowongan kerja. | 1. Ekstensi aktif hanya pada URL yang cocok dengan pola (misal: `linkedin.com/jobs/view/`, `indeed.com/viewjob/`).<br>2. Content script di-inject hanya pada halaman yang cocok. | - Tentukan pola URL di `manifest.json` (`matches`).<br>- Content script menggunakan `document.readyState` atau `MutationObserver` untuk mendeteksi perubahan konten. |
| **3. Ekstraksi Deskripsi Pekerjaan** | Sebagai pengguna, saya ingin ekstensi mengekstrak teks deskripsi pekerjaan dari halaman. | 1. Content script menemukan elemen DOM yang berisi deskripsi (misal: `div.job-description`).<br>2. Teks diekstrak dan dikirim ke background script.<br>3. Jika elemen tidak ditemukan, ekstensi tidak melakukan apa-apa atau menampilkan pesan "Deskripsi tidak ditemukan". | - Gunakan selector CSS spesifik untuk setiap situs yang didukung (misal: `.job-description`, `#job-desc`).<br>- Normalisasi teks (lowercase, hapus tag HTML). |
| **4. Perhitungan Skor Kecocokan** | Sebagai pengguna, saya ingin ekstensi menghitung skor kecocokan berdasarkan data profil dan deskripsi pekerjaan. | 1. Background script menerima data profil dan deskripsi.<br>2. Lakukan perhitungan (keyword overlap, semantic similarity).<br>3. Hasilnya adalah skor numerik (0-100) dan daftar kekuatan/gap.<br>4. Skor dikirim kembali ke content script. | - Implementasikan algoritma sederhana (keyword matching) untuk versi 1.0.<br>- Untuk versi lanjutan, pertimbangkan TF-IDF atau API embedding (LLM).<br>- Gunakan `chrome.runtime.sendMessage` untuk komunikasi. |
| **5. Visualisasi Hasil (Badge)** | Sebagai pengguna, saya ingin melihat skor kecocokan secara instan di halaman lowongan. | 1. Content script menerima skor dari background script.<br>2. Tampilkan badge di sudut halaman (misal: top-right).<br>3. Badge menampilkan skor dan warna berdasarkan rentang (Hijau: >70, Kuning: 40-70, Merah: <40).<br>4. Badge dapat diklik untuk membuka panel detail. | - Gunakan CSS untuk styling badge.<br>- Implementasikan event listener untuk klik badge.<br>- Gunakan `chrome.action` atau inject CSS/HTML ke halaman. |
| **6. Panel Detail Hasil** | Sebagai pengguna, saya ingin melihat detail mengenai kekuatan dan gap saya dibandingkan dengan lowongan kerja. | 1. Popup atau modal terbuka saat badge diklik.<br>2. Panel menampilkan: <br>   - Skor total.<br>   - Daftar 3 skill/proyek terkuat.<br>   - Daftar 3 skill yang dibutuhkan namun tidak dimiliki.<br>3. Panel dapat ditutup. | - Buat komponen UI untuk panel detail.<br>- Tampilkan data yang diterima dari background script.<br>- Implementasikan logika untuk memilih top N item. |

---

### **3. TDD (Test-Driven Development) Plan**

**Judul:** Rencana Pengujian untuk Resume Matcher

**Versi:** 1.0
**Tanggal:** 15 Desember 2025

**1. Pendekatan**
*   **Unit Testing:** Menguji fungsi-fungsi independen (misal: fungsi perhitungan skor, validasi input).
*   **Integration Testing:** Menguji interaksi antar komponen (misal: content script mengirim pesan ke background script).
*   **End-to-End (E2E) Testing:** Menguji alur kerja pengguna dari awal hingga akhir di browser nyata.

**2. Test Cases (Contoh)**

| Komponen | Jenis Test | Deskripsi Test Case | Expected Result |
| :--- | :--- | :--- | :--- |
| **Profile Management** | Unit Test | `saveProfile(profileData)` dengan data valid. | Data disimpan di `chrome.storage.local` tanpa error. |
| | Unit Test | `saveProfile(profileData)` dengan data kosong. | Menampilkan error validasi. |
| | E2E Test | Pengguna mengisi form di popup dan menyimpan. | Data tersimpan dan dapat dibaca kembali saat popup dibuka ulang. |
| **Job Description Extraction** | Integration Test | Content script dijalankan di halaman LinkedIn dengan deskripsi yang jelas. | `extractJobDescription()` mengembalikan teks deskripsi yang benar. |
| | Integration Test | Content script dijalankan di halaman yang bukan lowongan. | `extractJobDescription()` mengembalikan `null` atau string kosong. |
| **Matching Algorithm** | Unit Test | `calculateScore(userSkills, jobSkills)` dengan skill yang sama persis. | Skor 100. |
| | Unit Test | `calculateScore(userSkills, jobSkills)` dengan skill yang tidak ada yang sama. | Skor 0. |
| | Unit Test | `calculateScore(userSkills, jobSkills)` dengan skill yang sebagian sama. | Skor dihitung berdasarkan proporsi skill yang cocok. |
| **UI Injection (Badge)** | E2E Test | Pengguna membuka halaman lowongan yang valid. | Badge muncul di halaman setelah beberapa detik. |
| | E2E Test | Pengguna mengklik badge. | Panel detail muncul di layar. |
| | E2E Test | Pengguna menutup panel detail. | Panel tertutup dan kembali ke halaman utama. |

**3. Alat Pengujian**
*   **Unit/Integration:** Jest atau Mocha untuk JavaScript.
*   **E2E:** Playwright atau Cypress untuk simulasi interaksi browser.

---

### **4. ADR (Architecture Decision Record)**

**Judul:** Catatan Keputusan Arsitektur untuk Resume Matcher

**Versi:** 1.0
**Tanggal:** 15 Desember 2025

**1. Keputusan: Menggunakan Chrome Extension Manifest V3**
*   **Konteks:** Chrome secara bertahap mempromosikan Manifest V3 sebagai standar baru untuk ekstensi.
*   **Alternatif:** Manifest V2 (yang masih didukung, tetapi akan di-deprecate).
*   **Keputusan:** Menggunakan Manifest V3.
*   **Alasan:**
    *   **Keamanan:** Service Worker (Background Script) lebih aman dan efisien daripada `background.html` di V2.
    *   **Kinerja:** Service Worker tidak memblokir UI utama browser.
    *   **Masa Depan:** Mendukung fitur terbaru Chrome dan kebijakan ekstensi masa depan.
*   **Konsekuensi:**
    *   Perlu menyesuaikan kode dari V2 ke V3 (misal, `chrome.runtime.getBackgroundPage()` tidak lagi digunakan).
    *   Harus menggunakan `chrome.action` atau `chrome.browserAction` untuk UI di toolbar.

**2. Keputusan: Penyimpanan Data Lokal (`chrome.storage.local`)**
*   **Konteks:** Memutuskan di mana menyimpan data profil pengguna.
*   **Alternatif:** Mengirim data ke server eksternal (API) untuk pemrosesan.
*   **Keputusan:** Menggunakan `chrome.storage.local` untuk penyimpanan data utama.
*   **Alasan:**
    *   **Privasi:** Data tetap berada di perangkat pengguna, sesuai dengan janji privasi.
    *   **Kecepatan:** Akses data lokal jauh lebih cepat daripada memanggil API jarak jauh.
    *   **Sederhana:** Mengurangi kompleksitas arsitektur (tidak perlu server backend).
*   **Konsekuensi:**
    *   Data tidak sinkron antar perangkat (kecuali pengguna login ke Chrome).
    *   Kapasitas penyimpanan terbatas (sekitar 5MB per extension), tetapi cukup untuk data profil.

**3. Keputusan: Algoritma Pencocokan Sederhana (Keyword Matching) untuk Versi 1.0**
*   **Konteks:** Memilih metode untuk menghitung skor kecocokan.
*   **Alternatif:** Menggunakan model machine learning (TF-IDF, embeddings) yang lebih canggih.
*   **Keputusan:** Menggunakan pendekatan keyword matching sederhana untuk versi pertama.
*   **Alasan:**
    *   **Implementasi Cepat:** Lebih mudah dan cepat untuk dikembangkan dan diuji.
    *   **Transparansi:** Logika mudah dipahami dan dijelaskan kepada pengguna.
    *   **Ketergantungan Rendah:** Tidak memerlukan akses ke API eksternal atau model ML yang berat.
*   **Konsekuensi:**
    *   Akurasi mungkin lebih rendah dibandingkan metode ML, terutama untuk deskripsi yang kompleks atau ambigu.
    *   Perlu peningkatan di versi berikutnya untuk meningkatkan akurasi.

---

### **5. UI Kit (Design System)**

**Judul:** Sistem Desain untuk Resume Matcher

**Versi:** 1.0
**Tanggal:** 15 Desember 2025

**1. Color Palette**
*   **Primary:** `#4285F4` (Google Blue) - untuk elemen utama.
*   **Success (High Match):** `#34A853` (Google Green)
*   **Warning (Medium Match):** `#FBBC05` (Google Yellow)
*   **Error (Low Match):** `#EA4335` (Google Red)
*   **Background:** `#FFFFFF` (White)
*   **Text:** `#202124` (Dark Gray), `#5F6368` (Medium Gray)

**2. Typography**
*   **Font:** Roboto (font standar Chrome/Android, terlihat modern dan jelas).
*   **Headings:** `font-weight: 500`
*   **Body:** `font-weight: 400`

**3. Components**

| Komponen | Variasi | Deskripsi & Properti |
| :--- | :--- | :--- |
| **Badge** | High (Skor >70) | - Warna latar belakang: `#34A853`<br>- Warna teks: `#FFFFFF`<br>- Bentuk: Rounded Rectangle<br>- Isi: "Match: 85%" |
| | Medium (Skor 40-70) | - Warna latar belakang: `#FBBC05`<br>- Warna teks: `#202124` |
| | Low (Skor <40) | - Warna latar belakang: `#EA4335`<br>- Warna teks: `#FFFFFF` |
| **Popup/Modal** | - | - Latar belakang putih dengan bayangan lembut.<br>- Header dengan judul "Resume Matcher".<br>- Isi terbagi menjadi tab: "Profil Saya" dan "Riwayat". |
| **Form Input** | - | - Label teks di atas input field.<br>- Placeholder teks abu-abu.<br>- Border abu-abu, berubah menjadi warna primer saat fokus. |
| **Button** | Primary | - Warna latar belakang: `#4285F4`<br>- Warna teks: `#FFFFFF`<br>- Rounded corners |
| | Secondary | - Warna latar belakang: `#F1F3F4` (Light Gray)<br>- Warna teks: `#202124` |

**4. States**
*   **Hover:** Elemen interaktif (badge, button) sedikit gelap saat mouse di atasnya.
*   **Active/Pressed:** Elemen (button) sedikit lebih gelap saat diklik.
*   **Disabled:** Elemen (button) abu-abu dan tidak responsif saat diklik.

---

### **6. API Documentation (Internal Messaging)**

**Judul:** Dokumentasi Pesan Internal Ekstensi

**Versi:** 1.0
**Tanggal:** 15 Desember 2025

Komunikasi antar komponen ekstensi dilakukan melalui `chrome.runtime.sendMessage` dan `chrome.runtime.onMessage`.

**1. Pesan dari Content Script ke Background Script**
*   **Tujuan:** Mengirim teks deskripsi pekerjaan untuk dihitung skor.
*   **`type`:** `EXTRACT_JOB_DESCRIPTION`
*   **Payload:**
    ```json
    {
      "jobDescriptionText": "We are looking for a Senior Frontend Developer..."
    }
    ```
*   **Response dari Background:**
    ```json
    {
      "type": "JOB_DESCRIPTION_SCORE",
      "payload": {
        "score": 85,
        "strengths": ["React", "TypeScript"],
        "gaps": ["GraphQL"]
      }
    }
    ```

**2. Pesan dari Background Script ke Content Script**
*   **Tujuan:** Memberikan hasil skor ke Content Script untuk ditampilkan.
*   **`type`:** `JOB_DESCRIPTION_SCORE`
*   **Payload:** (Sama seperti di atas)

**3. Pesan dari Popup ke Background Script**
*   **Tujuan:** Menyimpan atau mengambil data profil pengguna.
*   **`type`:** `SAVE_PROFILE` atau `GET_PROFILE`
*   **Payload untuk `SAVE_PROFILE`:**
    ```json
    {
      "profileData": {
        "summary": "...",
        "skills": ["..."],
        "projects": [...]
      }
    }
    ```
*   **Response untuk `GET_PROFILE`:**
    ```json
    {
      "type": "PROFILE_DATA",
      "payload": {
        "profileData": { ... }
      }
    }
    ```

---

### **7. QA Document**

**Judul:** Dokumen Pengujian Kualitas (QA) untuk Resume Matcher

**Versi:** 1.0
**Tanggal:** 15 Desember 2025

**1. Lingkungan Pengujian**
*   **Browser:** Google Chrome (versi terbaru).
*   **OS:** Windows 10/11, macOS, dan Linux.
*   **Situs Uji:** Halaman lowongan di LinkedIn, Indeed, dan Kalibrr.

**2. Checklist Pengujian Manual**

| Area Pengujian | Item Checklist | Status (Pass/Fail) |
| :--- | :--- | :--- |
| **Instalasi** | Ekstensi dapat diinstal dari Chrome Web Store. | |
| | Ikon ekstensi muncul di toolbar. | |
| **Manajemen Profil** | Popup terbuka saat ikon diklik. | |
| | Form input bekerja dengan benar (simpan, edit, hapus). | |
| | Data tersimpan dan persisten setelah browser ditutup. | |
| **Deteksi & Ekstraksi** | Ekstensi tidak aktif di halaman non-lowongan. | |
| | Ekstensi aktif di halaman lowongan yang didukung. | |
| | Teks deskripsi diekstrak dengan benar dari halaman. | |
| **Matching & UI** | Badge muncul setelah halaman selesai dimuat. | |
| | Warna badge sesuai dengan skor (Hijau, Kuning, Merah). | |
| | Panel detail terbuka saat badge diklik. | |
| | Panel menampilkan skor, kekuatan, dan gap yang benar. | |
| | Panel dapat ditutup dengan tombol 'X' atau klik di luar area. | |
| **Error Handling** | Jika deskripsi tidak ditemukan, badge tidak muncul atau menampilkan pesan "Deskripsi tidak ditemukan". | |
| | Jika terjadi kesalahan (misal, storage full), popup menampilkan pesan error yang jelas. | |
| **Performance** | Ekstensi tidak menyebabkan browser macet atau lambat. | |
| | Loading halaman web tidak terlambat secara signifikan. | |

**3. Test Cases (Contoh)**

| ID | Deskripsi | Langkah | Expected Result | Actual Result | Status |
| :-- | :--- | :--- | :--- | :--- | :--- |
| TC-001 | Simpan Profil Baru | 1. Buka popup.<br>2. Isi form profil.<br>3. Klik 'Simpan'. | Data tersimpan dan popup menutup. | | |
| TC-010 | Tampilkan Skor pada Lowongan Cocok | 1. Buka halaman lowongan yang cocok dengan profil.<br>2. Tunggu ekstensi memproses. | Badge dengan skor tinggi (hijau) muncul. | | |
| TC-015 | Tampilkan Pesan 'Deskripsi Tidak Ditemukan' | 1. Buka halaman web yang bukan lowongan.<br>2. Refresh halaman. | Tidak ada badge yang muncul. | | |

---

### **8. Operations Manual**

**Judul:** Manual Operasional untuk Resume Matcher

**Versi:** 1.0
**Tanggal:** 15 Desember 2025

**1. Proses Rilis (Deployment)**
1.  **Build:** Jalankan proses build untuk menghasilkan file ekstensi (`.zip` atau folder).
2.  **Upload:** Unggah file build ke Chrome Developer Dashboard.
3.  **Publish:** Publikasikan versi baru ke Chrome Web Store. Pastikan deskripsi, screenshot, dan privacy policy telah diperbarui.
4.  **Monitoring:** Periksa dashboard Chrome Web Store untuk melihat metrik penginstalan, error, dan review.

**2. Monitoring & Logging**
*   **Chrome Extension Dashboard:** Gunakan dashboard bawaan Chrome untuk memantau penginstalan, rating, dan crash report.
*   **Logging:** Tambahkan logging sederhana di background script untuk melacak error (misal, gagal menyimpan data, gagal ekstraksi deskripsi). Log ini dapat dikirim ke layanan logging eksternal jika diperlukan.
*   **Metrik Kunci:** Pantau metrik yang telah ditentukan di PRD (penginstalan, retensi, skor kecocokan).

**3. Pemeliharaan & Pembaruan**
*   **Bug Fixing:** Jika terdeteksi bug, buat versi patch (misal 1.0.1) dan publikasikan secepat mungkin.
*   **Fitur Baru:** Untuk fitur besar, ikuti siklus development yang lebih panjang (misal, dari 1.1.0).
*   **Dukungan Browser:** Pastikan ekstensi kompatibel dengan versi Chrome terbaru. Periksa perubahan API Chrome secara berkala.

**4. Troubleshooting (Panduan Perbaikan Masalah Umum)**
*   **Masalah:** Ekstensi tidak terinstal / tidak muncul di toolbar.
    *   **Solusi:** Pastikan ekstensi diaktifkan di `chrome://extensions/`. Coba uninstall dan instal ulang.
*   **Masalah:** Data profil tidak tersimpan.
    *   **Solusi:** Periksa izin penyimpanan di `chrome://settings/content/cookies`. Coba hapus cache dan data situs untuk `chrome-extension://[ID-EXTENSION]`.
*   **Masalah:** Skor tidak muncul di halaman lowongan.
    *   **Solusi:** Pastikan Anda berada di halaman lowongan yang didukung. Periksa log console (F12) untuk error. Jika perlu, hubungi tim pengembang.

**5. Privacy Policy & Terms of Service**
*   Pastikan ada dokumen Privacy Policy yang jelas di Chrome Web Store, menjelaskan bahwa data disimpan secara lokal dan tidak dikirim ke pihak ketiga tanpa izin.

Semoga dokumen-dokumen ini membantu Anda memulai proyek dengan landasan yang kuat! Jika ada bagian yang ingin Anda bahas lebih dalam, silakan tanyakan.