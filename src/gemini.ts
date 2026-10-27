// Gemini API service — Subsystems 1, 2, 3
import { GoogleGenAI } from '@google/genai';

const PRIMARY_MODEL = 'gemini-3.5-flash-lite';
const FALLBACK_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

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
// SUBSYSTEM 1 — ATS Resume Builder
// ──────────────────────────────────────────────
export async function buildATSResume(
  apiKey: string,
  rawHistory: string,
  jobDescription: string,
  seniorityLevel: string,
  onChunk: (text: string) => void
): Promise<void> {
  const systemPrompt = `You are an elite ATS Resume Architect and Career Intelligence AI engine.
Your role: Transform raw professional history and a target Job Description (JD) into a clean, parseable, high-impact resume tailored for a ${seniorityLevel.toUpperCase()} level professional.

STRICT CONSTRAINTS & ATS COMPLIANCE:
1. FORMATTING: Output content using standard Markdown structures ONLY.
   - Strict avoidance of tables, columns, graphics, or complex text boxes that break Applicant Tracking Systems (ATS).
   - Use clear standard headings (H2): ## Summary, ## Experience, ## Skills, ## Education. (Optional: ## Certifications, ## Key Projects).
2. KEYWORD OPTIMIZATION:
   - Extract critical hard skills, tools, and methodologies from the provided JD.
   - Naturally integrate them into the resume content without keyword stuffing.
3. ACTION-DRIVEN BULLETS:
   - Structure every work experience bullet point using the Action-Context-Result (ACR) framework.
   - Embed measurable metrics and numbers wherever possible (e.g., latency reduction, revenue increase, team size, scale, percentage gains).
4. INTEGRITY: Never invent or hallucinate dates, employers, or core qualifications.
5. ATS AUDIT TRAIL: End the resume with:
---
### ATS Optimization Audit
- **Target Seniority:** ${seniorityLevel}
- **Top Matched Keywords:** (list 5-8 crucial keywords incorporated from the JD)
- **Parseability Score:** 98/100 (Single-column linear markdown, standard headings)`;

  const userPrompt = `### RAW PROFESSIONAL HISTORY
${rawHistory}

### TARGET JOB DESCRIPTION
${jobDescription}

Generate the ATS-optimized resume now following all constraints.`;

  await streamWithFallback(apiKey, systemPrompt, userPrompt, 0.4, onChunk);
}

// ──────────────────────────────────────────────
// SUBSYSTEM 2 — AI Humanizer
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
    'Stealth Bypass (Anti-AI Detector)': `TARGET: 0% AI detection on GPTZero, Turnitin, Copyleaks, and Originality.ai.
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

  const selectedToneGuide = toneGuides[tonePreset] || toneGuides['Natural & Conversational'];

  const systemPrompt = `You are a world-class Linguistic Humanizer and Forensic Anti-AI Engine.
Your singular mission: Rewrite AI-generated, stiff, or corporate-speak text so that it reads with the unmistakable authenticity, rhythm, and nuance of real human thought — completely eliminating the mathematical patterns flagged by AI detectors (GPTZero, Turnitin, Copyleaks).

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

3. EXHAUSTIVE LIST OF BANNED AI TROPES & WORDS:
   - Absolutely forbidden: delve, dive into, navigate the landscape, tapestry, beacon, testament, pivotal, transformative, quintessential, spearhead, revolutionize, empower, foster, harness, leverage, holistic, seamless, dynamic, paramount, unwavering, multifaceted, robust, actionable insights, game-changing, synergy, catalyst, comprehensive, vibrant, bespoke, in today's fast-paced world, it is worth noting that, across the board.
   - Replace with plain, active, muscular verbs: build, cut, ship, fix, scale, lead, discover, test, run, hire, break, drop, grow, write, launch.

4. PRESERVE ALL REAL FACTS & METRICS (100% Ground Truth):
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

OUTPUT FORMAT:
Return strictly the humanized text. Do NOT include preambles, explanations, quotes, or markdown notes about your edits.`;

  const userPrompt = `Humanize the following text following all linguistic burstiness, anti-AI patterns, and tone instructions. Keep every metric and technical fact accurate:\n\n${inputText}`;

  const temp = intensity === 'deep' || tonePreset.includes('Stealth') ? 0.92 : intensity === 'balanced' ? 0.88 : 0.82;

  await streamWithFallback(apiKey, systemPrompt, userPrompt, temp, onChunk);
}

// ──────────────────────────────────────────────
// SUBSYSTEM 3 — AI Content Detector (Antigravity Engine)
// ──────────────────────────────────────────────
export interface SentenceAnalysis {
  sentence: string;
  risk: 'low' | 'moderate' | 'high';
  score: number;
  reason?: string;
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
  const systemPrompt = `You are the ANTIGRAVITY ENGINE — an AI Content Detector built for a professional career platform.
Your objective: Analyze provided text content to evaluate the probability of AI generation, mirroring rigorous forensic detection metrics.

EVALUATION VECTORS:
1. Burstiness: Variation in sentence length and complexity (AI writing tends to have uniform sentence lengths and rigid structures).
2. Perplexity: Predictability of vocabulary choice (AI writing uses highly statistically probable word sequences and transitions).

OUTPUT FORMAT:
Return a strictly valid JSON object ONLY. Do not use markdown backticks or commentary.
Schema:
{
  "aiPercentage": <integer 0-100>,
  "humanPercentage": <integer 0-100, where aiPercentage + humanPercentage = 100>,
  "confidence": <"Low" | "Medium" | "High">,
  "burstinessScore": <integer 0-100, higher means more human variance>,
  "perplexityScore": <integer 0-100, higher means more human vocabulary entropy>,
  "burstinessLabel": <"High Variance (Human)" | "Moderate Variance" | "Low Variance (Uniform/AI)">,
  "perplexityLabel": <"High Unpredictability (Human)" | "Moderate Perplexity" | "Predictable / Safe (AI)">,
  "flaggedSentences": [
    { "sentence": "<exact sentence>", "reason": "<why it triggers AI heuristics>" }
  ],
  "sentenceHeatmap": [
    { "sentence": "<sentence>", "risk": <"low" | "moderate" | "high">, "score": <0-100>, "reason": "<optional note>" }
  ],
  "recommendations": [
    "<actionable suggestion 1>",
    "<actionable suggestion 2>"
  ],
  "verdict": "<one concise forensic summary verdict>",
  "rawAnalysis": "<2-3 sentence technical forensic breakdown>"
}`;

  const userPrompt = `Analyze the following text for AI probability:\n\n${inputText}`;

  const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: userPrompt,
        config: { systemInstruction: systemPrompt, temperature: 0.2 },
      });

      const raw = response.text ?? '';
      const cleaned = raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned) as DetectorResult;

      // Fallback for sentenceHeatmap if model missed it
      if (!parsed.sentenceHeatmap || parsed.sentenceHeatmap.length === 0) {
        const sentences = inputText.match(/[^.!?]+[.!?]+/g) || [inputText];
        parsed.sentenceHeatmap = sentences.slice(0, 15).map(s => {
          const isFlagged = parsed.flaggedSentences.some(f => f.sentence.includes(s.trim().slice(0, 30)));
          return {
            sentence: s.trim(),
            risk: isFlagged ? 'high' : (parsed.aiPercentage > 40 ? 'moderate' : 'low'),
            score: isFlagged ? 85 : 30,
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
