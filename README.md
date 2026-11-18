# Wrecz — AI-Powered Nike Product Recommendation System

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.5--Flash-4285F4?logo=google&logoColor=white)](https://aistudio.google.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

An intelligent, production-ready e-commerce recommendation system built for the **AI Engineer Assessment**. Powered by Google Gemini and real-world Nike product data, **Wrecz** translates natural language shopping preferences into precise, budget-compliant product recommendations and updates the catalog grid in real-time.

---

## 🚀 Key Features

* **Real Nike Product Catalog (112 Items):** Curated e-commerce catalog across 7 categories (*Footwear, Hoodies & Jackets, Tops & T-Shirts, Shorts, Pants & Tights, Jerseys, Accessories*) with authentic Nike CDN images, pricing, ratings, sizes, and detailed descriptions.
* **Natural Language Intent & Semantic Search:** Users can express intent freely (e.g., *"running shoes under $100"*, *"sweat-wicking gym shorts"*, *"warm hoodie for winter"*, *"women's soccer jersey"*).
* **Strict Constraint Enforcement:** Strict price ceilings (e.g., *"under $80"*) and demographic filtering (*Men, Women, Kids, Unisex*) enforced by the AI system prompt.
* **Dual Recommendation Surface:**
  * **Interactive AI Stylist Drawer:** Conversational UI with quick-prompt chips, real-time thinking states, and product preview cards.
  * **Main Store Grid Synchronization:** One-click *"Filter store grid with these picks"* action that directly filters the catalog and displays an active recommendation banner.
* **Zero API Key Leakage (Serverless Proxy):** The browser never accesses the AI API directly. All requests pass through a serverless backend (`/api/recommend`), keeping secrets secure.
* **Fail-Safe Offline Heuristic:** If the AI API encounters network disruption or exhausted quota, the app automatically falls back to an internal heuristic search, ensuring the interface never crashes or displays a broken screen.
* **Token-Efficient Prompt Engineering:** Compact catalog projections keep request latency under ~1 second and minimize token consumption.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript 5.7, Vite 8 |
| **Styling** | Tailwind CSS v4 (with `@tailwindcss/vite`) |
| **AI Model & SDK** | Google Gemini (`gemini-3.5-flash-lite` with fallback to `gemini-3.5-flash`), `@google/genai` |
| **API Backend** | Vercel Serverless Function (`api/recommend.ts`) + Vite Dev Middleware |
| **Data** | Structured JSON Catalog (`src/data/products.json`) |
| **Deployment** | Vercel |

---

## 📋 Assessment Evaluation Criteria Matrix

| Criterion | Implementation in Wrecz | Status |
| :--- | :--- | :---: |
| **Basic Frontend Development with React** | Modern React 19 app with responsive grid, brutalist typography, modal quick-views, category filters, and smooth animations. | ✅ Complete |
| **Ability to Integrate an AI API** | Integrated Google Gemini via official `@google/genai` SDK with strict JSON mode output. | ✅ Complete |
| **Pass User Input & Filter Products** | User prompt passed to Gemini backend; returned IDs filter both the drawer and the main store catalog. | ✅ Complete |
| **Clean & Maintainable Code** | Fully typed with TypeScript (0 errors), modular components, zero unnecessary runtime bloat. | ✅ Complete |
| **Security & Best Practices** | Environment variable isolation (`.env.local`), input length capping (DoS defense), `.env.example` provided. | ✅ Complete |
| **Vercel Deployment Ready** | Configured for zero-config Vercel Serverless Functions and instant preview. | ✅ Complete |

---

## 🏁 Quick Start & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd wrecz-ai-recommender
npm install
```

### 2. Configure Environment Variables
Copy the example environment template:
```bash
cp .env.example .env.local
```
Open `.env.local` and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> Obtain a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:8443` (or the port output in your terminal). Click **"Ask Wrecz"** at the bottom to test recommendations!

### 4. Build for Production
```bash
npm run build
```

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```
2. Import the repository in [Vercel](https://vercel.com/new).
3. Under **Environment Variables**, add:
   * **Key:** `GEMINI_API_KEY`
   * **Value:** *(your Gemini API key)*
4. Click **Deploy**. Vercel will build the Vite frontend and host `/api/recommend` as an edge-ready serverless function.

---

## 📂 Project Structure

```text
├── api/
│   └── recommend.ts          # Serverless AI recommendation handler (Gemini + JSON Mode)
├── public/                   # Static assets & SVG icons
├── src/
│   ├── components/
│   │   ├── Header.tsx        # Navigation header & cart badge
│   │   ├── ProductCard.tsx   # Individual catalog card with image & pricing
│   │   ├── ProductModal.tsx  # Quick-view modal with gallery, sizing & specs
│   │   └── Wrecz.tsx         # AI Stylist chat drawer & recommendation triggers
│   ├── data/
│   │   └── products.json     # 112 cleaned Nike products with tags & metadata
│   ├── lib/
│   │   └── products.ts       # Type definitions, formatters & fallback recommender
│   ├── App.tsx               # Primary application page & catalog grid filter state
│   ├── index.css             # Tailwind CSS v4 styling rules
│   └── main.tsx              # React application entry point
├── .env.example              # Public environment template (safe for git)
├── ARCHITECTURE.md           # System design & AI pipeline documentation
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite configuration with local API proxy
```

---

## 📄 License
MIT License. Built for assessment purposes.
