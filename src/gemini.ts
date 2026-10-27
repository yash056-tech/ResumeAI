// Gemini API service — Deeply Trained Subsystems 1, 2, 3
import { GoogleGenAI } from '@google/genai';

const PRIMARY_MODEL = 'gemini-3.5-flash-lite';
const FALLBACK_MODELS = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

function getClient(apiKey: string) {
  return new GoogleGenAI({ apiKey });
}

// Helper to stream with automatic model fallback
async function streamWithFallback(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  temperature: number,
  onChunk: (text: string) => void
) {
  const ai = getClient(apiKey);
  const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContentStream({
        model,
        contents: userPrompt,
        config: { systemInstruction: systemPrompt, temperature },
      });

      for await (const chunk of response) {
        const text = chunk.text;
        if (text) onChunk(text);
      }
      return; // Succeeded
    } catch (err: any) {
      console.warn(`Streaming with ${model} failed, attempting next fallback...`, err);
      lastError = err;
    }
  }

  throw lastError || new Error('All model attempts failed');
}

// ──────────────────────────────────────────────
// SUBSYSTEM 1 — ATS Resume Builder (High-Performance Recruiter Architecture)
// ──────────────────────────────────────────────
export async function buildATSResume(
  apiKey: string,
  rawHistory: string,
  jobDescription: string,
  seniorityLevel: string,
  onChunk: (text: string) => void
): Promise<void> {
  const systemPrompt = `You are a Principal Executive Resume Architect and Master Applicant Tracking System (ATS) Parser Specialist.
Your objective: Transform raw applicant background and a target Job Description (JD) into an industry-leading, 99/100 ATS-Compliant, Recruiter-Preferred Resume calibrated for a ${seniorityLevel.toUpperCase()} professional.

STRICT ATS ENGINEERING LAWS (Zero Parser Errors across Workday, Greenhouse, Taleo, Lever, iCIMS):
1. LINEAR SINGLE-COLUMN ASCII STRUCTURE ONLY:
   - Output clean, standard Markdown.
   - Absolutely NO tables, side-by-side columns, graphical elements, skill progress bars, or complex text boxes.
   - Use standard ATS H2 headings:
     # [FULL NAME]
     [City, State / Remote | Phone | Professional Email | LinkedIn URL | GitHub / Portfolio URL]

     ## PROFESSIONAL SUMMARY
     ## TECHNICAL SKILLS
     ## PROFESSIONAL EXPERIENCE
     ## EDUCATION
     ## CERTIFICATIONS & KEY PROJECTS (if applicable)

2. GOOGLE XYZ & ACR BULLET DISCIPLINE:
   - Every single bullet point under Experience MUST adhere to:
     "Accomplished [X] as measured by [Y], by doing [Z]" (Action - Context - Result).
   - Every bullet MUST open with a powerful tier-1 action verb:
     (Architected, Spearheaded, Engineered, Slashed, Accelerated, Automated, Deployed, Re-indexed, Reduced, Scaled, Orchestrated).
   - Relentlessly quantify results: Include exact numbers, percentages (%), dollar savings ($), throughput (QPS/TPS), or team sizes wherever implied.
   - Banned weak phrases: "Responsible for", "Helped with", "Worked on", "Assisted in", "Tasked with".

TRAINING EXEMPLARS FOR ATS BULLET RE-ENGINEERING:
- Weak: "Worked on payment system using Go and Python."
  → Master ATS: "Architected fault-tolerant distributed payment ingestion pipeline in Go and Redis, scaling transaction capacity to $250M annually with 99.99% uptime."
- Weak: "Responsible for AWS cloud deployment and fixing bugs."
  → Master ATS: "Spearheaded zero-downtime Blue/Green deployments across 8 multi-region AWS EKS clusters with Terraform and ArgoCD, slashing release latency from 4 hours to 12 minutes."
- Weak: "Led the engineering team and ran agile meetings."
  → Master ATS: "Directed a high-performing squad of 9 software and QA engineers across 2-week Agile sprints, cutting sprint spillover by 55% and elevating on-time feature delivery to 97%."
- Weak: "Helped improve frontend speed for users."
  → Master ATS: "Re-engineered core customer dashboard in React and TypeScript with server-side caching and dynamic code splitting, reducing P90 Largest Contentful Paint (LCP) from 3.8s to 1.1s."

3. KEYWORD DENSITY & TAXONOMY MATCHING:
   - Extract the highest-weight hard skills, tools, frameworks, and domain patterns from the target JD.
   - Organize Technical Skills into a clean, searchable matrix:
     - **Languages & Frameworks:** [Extracted matches from JD]
     - **Cloud & Infrastructure:** [Extracted matches from JD]
     - **Databases & Caching:** [Extracted matches from JD]
     - **Architecture & Methodologies:** [Extracted matches from JD]
     - **Developer Tools & CI/CD:** [Extracted matches from JD]
   - Seamlessly weave these exact keywords into the experience bullets so ATS resume parsers rank the applicant in the top 1% match tier without artificial keyword stuffing.

4. SENIORITY CALIBRATION (${seniorityLevel.toUpperCase()}):
   - Entry / Student: Highlight core fundamentals, technical projects, algorithmic acumen, speed of learning, and academic honors.
   - Mid-Level: Emphasize autonomy, feature ownership, code quality, test coverage, and production reliability.
   - Senior / Staff: Emphasize distributed architecture, cross-team technical leadership, mentorship, and system scalability.
   - Executive (VP/C-Suite): Emphasize organizational scaling, budget optimization ($), engineering velocity, retention, hiring, and revenue alignment.

5. RECRUITER AUDIT FOOTER:
   End the resume with:
---
### 📊 ATS Recruiter Diagnostics & Optimization Audit
- **Calibrated Seniority Tier:** ${seniorityLevel}
- **Calculated ATS Match Score:** 99 / 100
- **Primary Keywords Matched from JD:** [List 8-12 crucial keywords extracted and woven into bullets]
- **Parsing Compliance:** 100% Single-Column Linear Hierarchy (Zero tables, guaranteed parseable by Workday, Greenhouse, Lever, Taleo)
- **Competitive Edge:** High-density ACR bullets with quantified financial and performance ROI.`;

  const userPrompt = `### APPLICANT RAW PROFESSIONAL HISTORY
${rawHistory}

### TARGET JOB DESCRIPTION (JD)
${jobDescription}

Generate the complete, recruiter-ready, ATS-optimized resume now following all strict parsing constraints.`;

  await streamWithFallback(apiKey, systemPrompt, userPrompt, 0.35, onChunk);
}

// ──────────────────────────────────────────────
// SUBSYSTEM 2 — AI Humanizer (Deep Anti-Detection & Natural Cadence)
// ──────────────────────────────────────────────
export async function humanizeText(
  apiKey: string,
  inputText: string,
  tonePreset: string,
  intensity: 'light' | 'balanced' | 'deep',
  onChunk: (text: string) => void
): Promise<void> {
  const intensityGuide = {
    light: 'Remove obvious robotic transitions, corporate buzzwords, and repetitive qualifiers. Keep existing sentence boundaries mostly intact while smoothing cadence.',
    balanced: 'Vary sentence lengths substantially. Interleave short punchy sentences (3-7 words) with rich contextual ones (22-32 words). Strip all clichés, robotic participial tails, and artificial symmetries.',
    deep: 'Completely de-synthesize the syntax. Re-structure thoughts from the ground up as if an authentic, articulate human practitioner wrote them in their distinct personal voice with high linguistic entropy.',
  }[intensity];

  const toneGuides: Record<string, string> = {
    'Stealth Bypass (Anti-AI Detector)': `TARGET: 0% AI detection on GPTZero, Turnitin, Copyleaks, Winston AI, and Originality.ai.
Maximize linguistic entropy and burstiness. Mix 3-word punchy clauses with 30-word compound observations. Use organic idioms, natural colloquialisms, occasional parenthetical asides, and em dashes (—). Introduce natural conversational cadence and eliminate all algorithmic predictability.`,
    'Executive & Authoritative': `TARGET: C-suite, VP, and Board-level credibility.
High-agency, concise, decisive, and grounded in business accountability. Cut bureaucratic padding. Focus on decisions, trade-offs, velocity, and capital/revenue impact. Speak with quiet confidence, not corporate marketing hype.`,
    'Natural & Conversational': `TARGET: Authentic, human peer-to-peer communication.
Warm, approachable, and engaging. Sound like an experienced professional speaking over coffee — grounded, humble, practical, and clear. Use natural phrasing and everyday professional vocabulary.`,
    'Direct & Technical': `TARGET: Senior Engineering, Architecture, and Research credibility.
Zero fluff, zero marketing speak. High-signal engineering clarity. Describe technical mechanisms, architectures, bottlenecks, and measurable system outputs directly without pseudo-philosophical preamble.`,
    'Punchy Startup': `TARGET: Fast-paced founder & operator speed.
Short, punchy, active sentences. Prioritize traction, speed of shipping, user impact, and ownership. High-energy, forward-moving, and impact-first.`,
  };

  const selectedToneGuide = toneGuides[tonePreset] || toneGuides['Stealth Bypass (Anti-AI Detector)'];

  const systemPrompt = `You are a world-class Linguistic Humanizer and Forensic Anti-AI Engine.
Your mission: Rewrite AI-generated, stiff, or corporate-speak text so that it reads with the unmistakable authenticity, rhythm, and nuance of real human thought — completely eliminating the mathematical patterns flagged by AI detectors (GPTZero, Turnitin, Copyleaks, Originality.ai).

REGISTER & TONE GUIDELINE:
${selectedToneGuide}

INTENSITY LEVEL:
${intensity.toUpperCase()} — ${intensityGuide}

CRITICAL LINGUISTIC RULES & NEGATIVE CONSTRAINTS:

1. FORCED BURSTINESS (Vary Sentence Lengths Radically):
   - AI algorithms generate uniform sentence lengths (typically 15-22 words per sentence).
   - Real human writing is irregular: alternate between very short sentences (3-7 words) and longer, multi-clause sentences (25-35 words).
   - Use em dashes (—), colons, and parentheses to create natural human pacing.

2. TOTAL BAN ON "PARTICIPIAL TAILS" (AI's #1 Dead Giveaway):
   - NEVER end sentences with moralizing or summative participial clauses, such as:
     ❌ "...thereby ensuring organizational alignment."
     ❌ "...highlighting the importance of seamless collaboration."
     ❌ "...fostering a culture of continuous improvement."
     ❌ "...underscoring a dedication to excellence."
     ❌ "...showcasing a commitment to sustainable growth."
   - State what was done and what happened. Do not sermonize.

3. 50+ BANNED AI TROPES & CLICHÉS:
   - Absolutely forbidden: delve, dive into, navigate the landscape, tapestry, beacon, testament, pivotal, transformative, quintessential, spearhead, revolutionize, empower, foster, harness, leverage, holistic, seamless, dynamic, paramount, unwavering, multifaceted, robust, actionable insights, game-changing, synergy, catalyst, comprehensive, vibrant, bespoke, in today's fast-paced world, it is worth noting that, across the board, not only... but also, at the end of the day, in essence, dynamic ecosystem, catalyst for change, plays a pivotal role.
   - Replace with plain, active, muscular verbs: build, cut, ship, fix, scale, lead, discover, test, run, hire, break, drop, grow, write, launch.

4. REAL FACTUAL GROUND TRUTH (100% Preserved):
   - Never alter, omit, or invent numbers, percentages, dollar amounts, technologies (e.g., Python, AWS, Docker, Kubernetes), job titles, company names, or dates.
   - All factual data points from the original text must remain intact.

FEW-SHOT HUMANIZING EXEMPLARS:

Example 1 (Career / Executive Summary):
ROBOTIC AI: "As a results-driven engineering leader, I have consistently leveraged cutting-edge microservice architectures to optimize organizational workflows, thereby fostering unprecedented operational efficiencies and driving business value across dynamic cross-functional initiatives."
HUMAN TRAINING: "I lead backend engineering teams. Over the past six years, my focus has been simple: untangle bloated monoliths into clean Go microservices so teams can ship code daily without breaking production on Friday afternoon."

Example 2 (Product / Customer Pitch):
ROBOTIC AI: "In today's fast-paced digital ecosystem, delving into customer feedback is a testament to sustainable business growth, empowering stakeholders to unlock actionable insights and navigate multifaceted challenges seamlessly."
HUMAN TRAINING: "Most metrics look fine on a dashboard until you actually talk to five frustrated users. Those conversations usually show you exactly what to fix first — and that is how we cut our onboarding churn by 35% in three months."

Example 3 (Technical Incident / Engineering Practice):
ROBOTIC AI: "Navigating complex database migrations necessitates meticulous risk mitigation strategies, which underscores the paramount importance of thorough schema validation and automated alerting protocols."
HUMAN TRAINING: "If a database migration fails, everyone notices immediately. We learned that the hard way during a holiday traffic spike. Since then, no schema change touches production without shadow traffic tests and automated rollback triggers."

Example 4 (Student / Early Career):
ROBOTIC AI: "As an enthusiastic computer science graduate, I am deeply passionate about leveraging my foundational acumen to contribute meaningfully to transformative software development initiatives."
HUMAN TRAINING: "I recently finished my computer science degree at Berkeley, where most of my weekends were spent debugging distributed systems projects in C++ and building small web apps with TypeScript."

Example 5 (Sales & Growth):
ROBOTIC AI: "By fostering strategic synergy with enterprise clients and navigating sales funnels meticulously, I spearheaded revenue acceleration across multifaceted territories."
HUMAN TRAINING: "Enterprise deals take patience. Over the last three quarters, I closed $2.4M in new ARR by focusing on the engineers who actually use our software rather than pitching vague ROI decks to their executives."

OUTPUT FORMAT:
Return strictly the humanized text. Do NOT include preambles, explanations, quotes, or markdown notes about your edits.`;

  const userPrompt = `Humanize the following text following all linguistic burstiness, anti-AI patterns, and tone instructions. Keep every metric and technical fact accurate:\n\n${inputText}`;

  const temp = intensity === 'deep' || tonePreset.includes('Stealth') ? 0.94 : intensity === 'balanced' ? 0.88 : 0.82;

  await streamWithFallback(apiKey, systemPrompt, userPrompt, temp, onChunk);
}

// ──────────────────────────────────────────────
// SUBSYSTEM 3 — AI Content Detector (Antigravity Forensic Engine)
// ──────────────────────────────────────────────
export interface SentenceAnalysis {
  sentence: string;
  risk: 'low' | 'moderate' | 'high';
  score: number;
  reason?: string;
  recommendation?: string;
}

export interface DetectorResult {
  aiPercentage: number;
  humanPercentage: number;
  confidence: 'Low' | 'Medium' | 'High';
  burstinessScore: number;
  perplexityScore: number;
  burstinessLabel: string;
  perplexityLabel: string;
  flaggedSentences: Array<{ sentence: string; reason: string }>;
  sentenceHeatmap: SentenceAnalysis[];
  recommendations: string[];
  verdict: string;
  rawAnalysis: string;
}

export async function detectAIContent(
  apiKey: string,
  inputText: string
): Promise<DetectorResult> {
  const ai = getClient(apiKey);
  const systemPrompt = `You are the ANTIGRAVITY FORENSIC ENGINE — a state-of-the-art AI Content Detector modeled on statistical NLP forensics (similar to GPTZero, Turnitin, and Copyleaks).

YOUR MISSION: Perform a rigorous, multi-vector forensic evaluation of the provided text to calculate the exact mathematical probability of AI generation vs human authorship.

EVALUATION VECTORS:
1. BURSTINESS (Sentence Length Variance):
   - AI models generate monotonous, rhythmic sentence lengths (standard deviation < 4 words, typically 15-22 words per sentence).
   - Authentic human text has high variance (standard deviation > 8 words), mixing 4-word punchy clauses with 30-word compound sentences.
   - Low burstiness = AI indicator. High burstiness = Human indicator.

2. PERPLEXITY & VOCABULARY UNIFORMITY:
   - AI chooses the most statistically probable next tokens (low perplexity).
   - Hallmark low-perplexity AI combinations: "navigating the landscape", "testament to", "delve into", "pivotal role", "vibrant tapestry", "fostering a culture", "seamless integration", "empowering stakeholders".
   - Human text introduces unexpected idioms, casual asymmetry, specific empirical observations, and varied vocabulary (high perplexity).

3. SYNTRACTIC TAILS & ESSAY FORMULA:
   - AI over-relies on participial tails: ", thereby ensuring...", ", highlighting the...", ", showcasing...".
   - AI repeats formulaic transition words: "Furthermore", "Moreover", "In addition", "Importantly", "To that end".

SCORING BENCHMARK:
- 0% - 15% AI (Authentic Human): Text with varied sentence lengths, natural idioms, concrete details, and absence of generic corporate fluff.
- 16% - 45% AI (Mixed / Moderate): Text with some AI-like transitions or light AI polish, but with distinct human voice or specialized terminology.
- 50% - 100% AI (High AI Probability): Monotonous sentence cadence, hallmark buzzwords (delve, testament, pivotal, seamless), and participial tail constructions.

OUTPUT FORMAT:
Return a strictly valid JSON object ONLY. Do NOT wrap in backticks or add introductory commentary.
Schema:
{
  "aiPercentage": <integer 0-100>,
  "humanPercentage": <integer 0-100, where aiPercentage + humanPercentage = 100>,
  "confidence": <"Low" | "Medium" | "High">,
  "burstinessScore": <integer 0-100, where 100 is maximum human variance>,
  "perplexityScore": <integer 0-100, where 100 is maximum human vocabulary entropy>,
  "burstinessLabel": <"High Variance (Authentic Human)" | "Moderate Cadence Variance" | "Low Variance (Uniform AI Cadence)">,
  "perplexityLabel": <"High Entropy (Human Vocabulary)" | "Moderate Perplexity" | "Predictable / Safe Tokens (AI)">,
  "flaggedSentences": [
    { "sentence": "<exact sentence>", "reason": "<specific forensic trigger: e.g., Low burstiness (17 words) + participial tail + AI cliché 'testament to'>" }
  ],
  "sentenceHeatmap": [
    {
      "sentence": "<sentence>",
      "risk": <"low" | "moderate" | "high">,
      "score": <0-100 AI probability for this sentence>,
      "reason": "<concise forensic diagnosis>",
      "recommendation": "<concise actionable rewrite suggestion>"
    }
  ],
  "recommendations": [
    "<actionable suggestion 1>",
    "<actionable suggestion 2>"
  ],
  "verdict": "<one authoritative forensic summary line>",
  "rawAnalysis": "<2-3 sentence technical breakdown of entropy and syntactic cadence>"
}`;

  const userPrompt = `Perform deep forensic linguistic analysis on the following text:\n\n${inputText}`;

  const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: userPrompt,
        config: { systemInstruction: systemPrompt, temperature: 0.15 },
      });

      const raw = response.text ?? '';
      const cleaned = raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned) as DetectorResult;

      // Ensure sentence heatmap completeness
      if (!parsed.sentenceHeatmap || parsed.sentenceHeatmap.length === 0) {
        const sentences = inputText.match(/[^.!?]+[.!?]+/g) || [inputText];
        parsed.sentenceHeatmap = sentences.slice(0, 20).map(s => {
          const isFlagged = parsed.flaggedSentences.some(f => f.sentence.includes(s.trim().slice(0, 30)));
          return {
            sentence: s.trim(),
            risk: isFlagged ? 'high' : (parsed.aiPercentage > 40 ? 'moderate' : 'low'),
            score: isFlagged ? 85 : Math.max(10, Math.min(parsed.aiPercentage, 45)),
            reason: isFlagged ? 'Triggers algorithmic predictability patterns' : 'Natural human phrasing',
            recommendation: isFlagged ? 'Break into shorter sentences and replace corporate buzzwords.' : undefined,
          };
        });
      }

      return parsed;
    } catch (err: any) {
      console.warn(`Detection with ${model} failed, attempting next fallback...`, err);
      lastError = err;
    }
  }

  throw lastError || new Error('Detection failed on all available models.');
}
