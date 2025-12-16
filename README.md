# Resonance

> *"A job that 'resonates' with you is one that touches the heart. It echoes a perfect alignment with your capabilities, values, and ambitions. This extension measures the depth of that resonance."*

**Where your skills and passions resonate.**

---

## What is Resonance?

Resonance is a Chrome Extension that acts as your **Career Guardian** — analyzing job postings against your profile to give instant matching scores.

### Features
- 🎯 **Profile Vault** — Store your skills, experience, and preferences
- 📊 **Job Scoring** — Automatic match analysis on job pages (LinkedIn, Indeed, etc.)
- 🚩 **Red Flag Detection** — Identify toxic workplace indicators
- 📈 **History Tracking** — Keep track of jobs you've analyzed
- 🔍 **Intelligence Sources** — Browse 86+ curated job platforms

---

## Installation

1. Clone this repository
2. Open `chrome://extensions/` in Chrome
3. Enable **Developer mode**
4. Click **Load unpacked** → select the `jobfusion/` folder
5. Click the 🎯 icon in your toolbar to get started

---

## Tech Stack

- **Platform:** Chrome Extension (Manifest V3)
- **Frontend:** HTML, CSS, Vanilla JavaScript (no frameworks)
- **Storage:** `chrome.storage.local` + `localStorage`
- **Theme:** Warm beige/cream palette

---

## Project Structure

```
project-resonance/
├── jobfusion/              # Chrome Extension
│   ├── manifest.json       # Extension config
│   ├── background.js       # Service worker (matching algorithm)
│   ├── content.js/css      # Injected into job pages
│   ├── popup.html/js/css   # Extension popup UI
│   ├── index.html          # Intelligence Sources page
│   ├── app.js              # Sources page logic
│   ├── data.js             # 86 job boards dataset
│   └── styles.css          # Warm theme styles
├── resonance.md            # Product Requirements
├── coding_rules.md         # Development Standards
└── README.md               # This file
```

---

## License

MIT
