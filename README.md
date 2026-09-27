# 📖 Something Special — 3D Interactive Chat & Memory Book

<div align="center">

[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

<p align="center">
  <strong>Transform raw WhatsApp chat archives into a tactile, realistic 3D digital book of memories.</strong>
</p>

*Conversations between two souls, bound in leather and gold leaf.*

</div>

---

## ✨ Features at a Glance

### 📚 Tactile 3D Book Architecture
- **Realistic Open-Book Spread**: Hardcover casing, outer spine, embossed gold foil accents, and tactile page crease with subtle lighting gradients.
- **Physical Page Turns**: Realistic page-turning sounds powered by the Web Audio API with intuitive edge click zones, navigation controls, and page scrubber.
- **Strict Zero-Scroll Pagination**: Proprietary height-budget algorithm that distributes chat bubbles seamlessly across physical book folios without any internal scrollbars.

### 🌐 Bilingual & Bengali Typography
- **Native Bengali Engine**: Seamlessly handles Bengali complex ligatures and scripts with dedicated Google typography (`Anek Bangla`, `Noto Sans Bengali`).
- **Literary Renaissance Headings**: Classical serif and display typefaces (`Cinzel`, `EB Garamond`) for chapter numbers, folios, and dedications.

### 🎨 Three Curated Bookbinding Themes
Switch instantly between aesthetic themes via the navigation bar:
- 🟫 **Vintage Leather**: Aged parchment paper with warm gold gilding and deep antique brown binding.
- 🌌 **Midnight Navy**: Starry indigo cover with crisp moonlight-tinted pages and luminous contrast.
- 🌿 **Botanical Sage**: Organic forest paper inspired by naturalist field journals with soft emerald hues.

### 📊 Conversation Intelligence & Analysis
- **Dramatis Personae**: Frontispiece dedication honoring the participants.
- **Milestone Metrics**: Total messages, words exchanged, and peak conversation days.
- **Balance Indicator**: Interactive talk-time distribution bar.
- **Most Cherished Emojis**: Frequency leaderboard of top shared reactions.

### 🔍 Deep Full-Text Search
- Instant bilingual search across both Bengali and English messages.
- Real-time highlight marking with jump-to-next/previous occurrence navigation.

### 🖼️ Profile & Media Engine
- **Custom Avatars**: Auto-detects custom photos placed in `public/` (e.g. `Arka.jpg`, `soumily.jpg`), with graceful fallback to monogrammed initial seals.
- **Media Card Badges**: Intelligently identifies WhatsApp attachments (photos, voice notes, stickers, documents, and videos).

---

## 🚀 Quick Start

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) installed.

### 2. Clone the Repository
```bash
git clone https://github.com/HariomArka/SomethingSpecial.git
cd SomethingSpecial
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 💌 Personalizing Your Memory Book

### 1. Adding Your WhatsApp Chat Export
1. In WhatsApp, open the chat with your special person.
2. Tap **More Options (⋮)** → **More** → **Export chat** → **Without media**.
3. Rename the exported `.txt` file to **`chat.txt`**.
4. Place it in the project's **`public/`** folder (`public/chat.txt`).

### 2. Adding Custom Profile Pictures
Place square photos in the **`public/`** directory matching the sender names:
- `public/Arka.jpg` (or `.jpeg`, `.png`)
- `public/soumily.jpg` (or `.jpeg`, `.png`)

---

## 🛠️ Project Structure

```text
chat/
├── public/
│   ├── chat.txt              # Raw WhatsApp export file
│   ├── Arka.jpg              # Profile picture for Sender A
│   └── soumily.jpg           # Profile picture for Sender B
├── src/
│   ├── components/
│   │   ├── BookCover.tsx      # Gilded hardcover with wax seal
│   │   ├── BookPreface.tsx    # Frontispiece dedication & metrics
│   │   ├── BookPageSpread.tsx # Two-page open book layout & thin spine
│   │   ├── ChatBubble.tsx     # Tactile chat card with avatar & media badges
│   │   ├── HeaderNav.tsx      # Persistent theme selector & search bar
│   │   ├── StatsModal.tsx     # Deep conversation analytics modal
│   │   └── SearchBar.tsx      # Bilingual search component
│   ├── utils/
│   │   ├── whatsappParser.ts  # Parses raw WhatsApp timestamps & participants
│   │   ├── pagination.ts      # Zero-scroll height budget estimator
│   │   ├── audio.ts           # Web Audio page turn sound synthesizer
│   │   └── themeConfig.ts     # Theme palettes & style tokens
│   ├── types/
│   │   └── chat.ts            # TypeScript interfaces
│   ├── App.tsx                # Main state machine & navigation controller
│   └── index.css              # Custom paper textures & 3D book depth
└── package.json
```

---

## 🏗️ Production Build

To build the optimized production assets:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📜 License

Distributed under the **MIT License**. Built with ❤️ to preserve cherished moments.
