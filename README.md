# 🌿 FloraWise — AI Plant Identifier & Gardening Assistant

**FloraWise** is a full-stack botanical identification, plant pathology diagnostic, and smart care companion powered by Google Gemini models (`gemini-4-argon`, `gemini-3.8-flash`, and `gemini-3.1-flash-lite`).

Whether you are nursing a struggling houseplant, tending an edible outdoor vegetable garden, or curating an indoor jungle, FloraWise provides instant taxonomic classification, visual health inspection, tailor-made care blueprints, hydration schedules, and real-time consultation with an AI master horticulturist.

---

## ✨ Features

### 1. 🔍 Multimodal Botanical Identification & Health Diagnosis
- **Visual Specimen Analysis**: Upload photos, snap pictures via mobile/desktop webcam, or test instantly with curated botanical samples (*Monstera Deliciosa*, *Fiddle Leaf Fig*, *Sansevieria*, *Peace Lily*, *Tomato*, *English Lavender*).
- **Gemini 4 Argon Vision**: Inspects leaf venation, stem joints, chlorosis patterns, pests, and fungal blight with deep botanical vision.
- **Pathology & Health Triage**: Categorizes health status (*Healthy*, *Mild Stress*, *Disease Detected*, *Pest Infestation*, *Nutrient Deficiency*) and provides root cause analysis alongside a numbered recovery protocol.

### 2. 📋 Comprehensive Care Blueprints
Every identified plant receives an actionable, science-based care guide:
- **💧 Watering & Moisture**: Exact cadence, seasonal dormancy adjustments, the "finger soil test" rule, and early overwatering warnings.
- **☀️ Sunlight & Exposure**: Lux and category (Bright Indirect, Full Sun, Low Light), daily hours required, and window placement.
- **🪴 Soil Mix Formulation**: Custom substrate recipes (e.g. 40% organic potting soil, 30% perlite, 20% orchid bark, 10% worm castings) with ideal pH ranges and drainage criteria.
- **🌡️ Temperature & Humidity**: Precise ranges in both Celsius and Fahrenheit, target relative humidity, and cold-hardiness frost minimums.
- **⚡ Fertilization Regimen**: Target NPK ratios, active growth schedules, and winter feeding pauses.
- **🐱🐶 Pet & Child Safety**: Instant toxicology badges for **Cats**, **Dogs**, and **Children** with clinical mechanisms (e.g., insoluble calcium oxalate crystals, saponins).
- **✂️ Pruning & Propagation**: Step-by-step cutting instructions (node identification, water vs. sphagnum vs. soil).
- **🌱 Companion Plants & Lore**: Plants that share identical environmental needs and botanical history.

### 3. 💬 FloraBot: Multi-turn Horticultural Chatbot
- **Horticultural Role System Instruction**: Configured with a dedicated botanical doctor persona that emphasizes organic pest control (neem oil, beneficial nematodes, insecticidal soaps), root health, and companion planting.
- **Task-Based Model Routing**:
  - `gemini-4-argon` for complex reasoning, rare disease diagnostics, and fungal blight analysis.
  - `gemini-3.8-flash` for general plant care, repotting, and lighting questions.
  - `gemini-3.1-flash-lite` for lightning-fast quick tips and immediate Q&A.
- **Context Awareness**: Automatically attaches the current plant being inspected to chat messages so FloraBot provides contextual guidance without re-explaining.
- **Interactive UI**: Scrollable thread, code/markdown formatting, starter question chips, and 1-click reply copying.

### 4. 🪴 My Garden Collection & Hydration Tracker
- **Hydration Countdowns**: Computes watering countdowns in real time against species-specific watering intervals.
- **"Mark as Watered"**: 1-click hydration logging resets schedule timers with instant visual confirmation.
- **Local Persistence**: Saves your custom plant nicknames, room locations, and notes in `localStorage`.
- **Status Filters**: Quickly filter by *All Plants*, *Needs Water Today*, or *Healthy Specimens*.

### 5. 🩺 Plant Doctor Symptom Explorer
- Quick visual triage for common indoor and garden ailments:
  - Yellow lower foliage (*Chlorosis / Overwatering*)
  - Brown crispy leaf tips (*Low humidity / Tap water fluoride*)
  - Spider mites & fine webbing
  - Mealybugs & cottony wax clusters
  - Powdery mildew & fungal blight
  - Leggy, stretched stems (*Etiolation / Light starvation*)
- Provides immediate emergency first aid, underlying causes, and direct 1-click consultation with FloraBot.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons & UI**: [Lucide React](https://lucide.dev/)
- **Backend**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) via `tsx`
- **AI SDK**: Modern [`@google/genai`](https://www.npmjs.com/package/@google/genai) TypeScript SDK
- **Dev & Build Tooling**: [Vite 6+](https://vitejs.dev/) with Express middleware in development

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- A Google Gemini API key (set in your environment as `GEMINI_API_KEY`)

### Installation

1. **Clone or open the workspace**:
   ```bash
   cd /path/to/florawise
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` or ensure your environment exports:
   ```env
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

5. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

---

## 📡 API Reference

### `POST /api/identify`
Identifies a plant from an image and generates a structured care blueprint.
- **Request Body**:
  ```json
  {
    "imageBase64": "<base64-encoded-image-data>",
    "mimeType": "image/jpeg",
    "userNotes": "Leaves showing brown spots",
    "preferredModel": "gemini-4-argon"
  }
  ```
- **Response**: Structured JSON containing taxonomy, health diagnosis, care guide, pet safety, and propagation steps.

### `POST /api/chat`
Conducts multi-turn botanical Q&A with FloraBot.
- **Request Body**:
  ```json
  {
    "messages": [
      { "role": "user", "content": "How often should I mist my Boston Fern?" }
    ],
    "model": "gemini-3.8-flash",
    "taskType": "general",
    "plantContext": { ... }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "modelUsed": "gemini-3.8-flash",
    "reply": "..."
  }
  ```

---

## 🌿 License & Acknowledgments
Built with ❤️ using **Google AI Studio** and the **Gemini API**.
All botanical suggestions prioritize organic and pet-safe horticultural methodologies.
