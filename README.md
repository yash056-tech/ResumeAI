# ResumeAI — Enterprise Career Tech & Content Intelligence Platform

An enterprise-grade, multi-modal career technology and content intelligence AI platform powered by Google Gemini API.

🌐 **Live Production Deployment**: [https://resumeai-pro-nu.vercel.app](https://resumeai-pro-nu.vercel.app)

---

## 🌟 Core Subsystems

### 1. ATS-Optimized Resume Studio (Subsystem 1)
- **ACR Standardized Output**: Structures bullet points using the **Action-Context-Result (ACR)** framework with quantifiable metrics.
- **Job Description Keyword Alignment**: Real-time extraction of hard skills, technologies, and competencies without unnatural keyword stuffing.
- **ATS Compliant Layouts**: Markdown-structured parseable format compatible with Workday, Taleo, Greenhouse, and Lever.
- **Real-Time Scoring Dial**: Dynamic 0–100 ATS compatibility health meter.

### 2. Enterprise AI Humanizer (Subsystem 2)
- **Banned AI Trope Stripper**: Detects and eliminates repetitive corporate clichés (`results-driven`, `testament to`, `delve`, `navigating the landscape`, `spearheaded`, `synergy`).
- **Burstiness & Rhythm Optimization**: Varies sentence cadence and structure to restore authentic human tone.
- **Integrity Preservation**: Strictly preserves technical terminology, metrics, technologies, dates, and titles.
- **4 Professional Register Presets**:
  - *Executive & C-Suite* (Authoritative, board-ready)
  - *Natural & Human* (Warm, collaborative)
  - *Direct & Technical* (High-signal engineering focus)
  - *Punchy High-Agency* (Fast-paced founder & operator)

### 3. Forensic AI Content Detector (Subsystem 3)
- **Antigravity Detection Engine**: Analyzes text across dual linguistic vectors:
  - *Burstiness*: Evaluates sentence length and complexity variance.
  - *Perplexity*: Measures statistical predictability of vocabulary choice.
- **Sentence-Level AI Risk Heatmap**: Granular diagnostics highlighting specific phrases triggering detection heuristics.

---

## 💳 Localized Global Currency & Registration Gate

- **Interactive Preview Mode**: Visitors can explore all subsystems, test templates, and customize inputs freely.
- **Action-Triggered Pop-up Gate**: Registration is requested upon clicking *Generate*, *Humanize*, or *Scan*.
- **Localized Regional Pricing**:
  - 🇮🇳 **India**: `₹599/mo` (`₹399/mo` Student Subsidy) with Instant UPI (GPay, PhonePe, Paytm, BHIM) + RuPay.
  - 🇺🇸 **USA**: `$19/mo` (`$12/mo` Student Subsidy) via Stripe / Apple Pay.
  - 🇬🇧 **UK**: `£15/mo` (`£9/mo` Student Subsidy) via UK Cards.
  - 🇨🇦 **Canada**: `CA$25/mo` (`CA$15/mo` Student Subsidy).
  - 🇦🇺 **Australia**: `AU$28/mo` (`AU$18/mo` Student Subsidy).
  - 🇩🇪 **Europe**: `€17/mo` (`€10/mo` Student Subsidy).
  - 🇦🇪 **UAE**: `69 AED/mo` (`39 AED/mo` Student Subsidy).
  - 🇸🇬 **Singapore**: `SG$25/mo` (`SG$15/mo` Student Subsidy).
- **Admin Real-time Email Dispatch**: Automatically notifies the platform administrator (`ya09shu@gmail.com`) with customer name, email, persona, resident country, selected plan, and payment method upon registration.

---

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Modern CSS Modules, Dark Glassmorphism, CSS Variables
- **AI Engine**: Google Gemini API (`gemini-3.5-flash-lite`, `gemini-3.1-flash-lite`)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast, Canvas Confetti
- **Deployment**: Vercel Serverless Edge

---

## 🛠️ Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yash056-tech/ResumeAI.git
   cd ResumeAI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📄 License
MIT License. Built for modern professionals and job seekers worldwide.
