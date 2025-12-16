<p align="center">
  <img src="jobfusion/icons/icon128.png" alt="Resonance Logo" width="80" height="80">
</p>

<h1 align="center">Resonance</h1>

<p align="center">
  <em>"A job that 'resonates' with you is one that touches the heart.<br>It echoes a perfect alignment with your capabilities, values, and ambitions."</em>
</p>

<p align="center">
  <strong>Where your skills and passions resonate.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Chrome%20Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Chrome Extension">
  <img src="https://img.shields.io/badge/Manifest-V3-00C853?style=for-the-badge" alt="Manifest V3">
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License">
</p>

---

## ✨ What is Resonance?

**Resonance** is a Chrome Extension that acts as your **Career Guardian** — automatically analyzing job postings against your profile to give you instant matching scores, highlight your strengths, identify skill gaps, and detect workplace red flags.

### 🎯 Core Features

| Feature | Description |
|---------|-------------|
| **Profile Vault** | Store your skills, experience summary, and job preferences securely in your browser |
| **Instant Scoring** | Get automatic match percentages when viewing job postings on LinkedIn, Indeed, and more |
| **Skill Matching** | See which of your skills align with the job requirements |
| **Gap Analysis** | Identify skills mentioned in the job that you might want to highlight or develop |
| **Red Flag Detection** | Automatically detect toxic workplace indicators like "we are a family" or "rockstar needed" |
| **History Tracking** | Keep a log of all jobs you've analyzed with their scores |
| **Intelligence Sources** | Browse 86+ curated job platforms with salary ranges and difficulty ratings |

---

## 🚀 Quick Start

### Installation

1. **Clone this repository**
   ```bash
   git clone https://github.com/steph1902/project-resonance.git
   ```

2. **Open Chrome Extensions**
   ```
   Navigate to: chrome://extensions/
   ```

3. **Enable Developer Mode**
   Toggle the switch in the top-right corner

4. **Load the Extension**
   - Click **"Load unpacked"**
   - Select the `jobfusion/` folder from the cloned repository

5. **Start Resonating!**
   Click the 🎯 icon in your toolbar to set up your profile

---

## 🎨 Design Philosophy

Resonance uses a **warm, inviting aesthetic** with a cream/beige color palette — intentionally moving away from the typical cold, dark interfaces. The design reflects the human-centered nature of job searching.

| Element | Color | Hex |
|---------|-------|-----|
| Primary | Terracotta | `#c47d5c` |
| Background | Cream | `#faf8f5` |
| Surface | White | `#ffffff` |
| Text | Warm Gray | `#3d3630` |
| Success | Sage Green | `#6b9b6b` |

---

## 🧠 How the Matching Algorithm Works

```
Final Score = (Skill Match × 40%) + (Preference Match × 40%) - Red Flag Penalty
```

### Breakdown

| Component | Weight | What it checks |
|-----------|--------|----------------|
| **Skill Match** | 40% | How many of your skills appear in the job description |
| **Preference Match** | 40% | Remote work availability, salary mentions, English environment |
| **Red Flags** | -10 pts each | "We are a family", "Rockstar/Ninja", "24/7 availability", etc. |

---

## 📁 Project Structure

```
project-resonance/
│
├── 📂 jobfusion/                 # Chrome Extension
│   ├── manifest.json             # Extension configuration (Manifest V3)
│   ├── background.js             # Service worker with matching algorithm
│   ├── content.js                # Injected into job pages
│   ├── content.css               # Widget styling
│   ├── popup.html/js/css         # Extension popup UI
│   ├── index.html                # Intelligence Sources dashboard
│   ├── app.js                    # Dashboard logic
│   ├── data.js                   # 86 curated job boards
│   ├── styles.css                # Warm theme styles
│   └── icons/                    # Extension icons
│
├── 📄 resonance.md               # Product Requirements Document
├── 📄 coding_rules.md            # Development Standards
├── 📄 LICENSE                    # MIT License
└── 📄 README.md                  # You are here
```

---

## 🌐 Supported Job Sites

Resonance currently injects into:

- ✅ LinkedIn Jobs
- ✅ Indeed
- ✅ We Work Remotely
- ✅ RemoteOK

*More sites can be easily added by updating `manifest.json` and adding selectors in `content.js`.*

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Platform | Chrome Extension (Manifest V3) |
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| Storage | `chrome.storage.local`, `localStorage` |
| Fonts | [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts |
| Icons | SVG (inline) |
| Build | None required — load directly into Chrome |

---

## 🤝 Contributing

Contributions are welcome! Here are some ways you can help:

- 🐛 **Report bugs** by opening an issue
- 💡 **Suggest features** for future development
- 🔧 **Add support** for more job sites
- 🎨 **Improve the UI/UX**

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <em>Built with ❤️ for job seekers everywhere</em>
</p>

<p align="center">
  <a href="https://github.com/steph1902/project-resonance">⭐ Star this repo</a> if Resonance helps you find your dream job!
</p>
