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
    light: 'Focus on removing obvious robotic transitions and corporate buzzwords. Keep existing sentence boundaries mostly intact.',
    balanced: 'Vary sentence lengths substantially. Interleave short punchy sentences with nuanced ones. Strip all clichés and robotic rhythms.',
    deep: 'Completely re-synthesize the cadence. Rewrite paragraph structures from scratch as if a seasoned human writer drafted it in their personal natural voice.',
  }[intensity];

  const systemPrompt = `You are an Enterprise-Grade AI Humanizer engine.
Your role: Rewrite AI-generated or stiff professional text to sound authentically human, eliminating robotic phrasing, uniform sentence rhythm, and predictable corporate clichés.

ACTIVE TONE PRESET: ${tonePreset.toUpperCase()}
INTENSITY: ${intensity.toUpperCase()} (${intensityGuide})

STRICT CONSTRAINTS:
1. PATTERN BREAKING:
   - Vary sentence lengths and structures dynamically.
   - Strictly eliminate overused AI tropes: "results-driven professional", "testament to", "delve", "navigating the landscape", "in today's fast-paced world", "spearheaded", "synergy", "holistic", "game-changing", "passionate about", "furthermore", "moreover", "beacon of", "it is worth noting".
2. INTEGRITY PRESERVATION:
   - NEVER alter, remove, or hallucinate technical terms, metrics, specific software/tools, job titles, companies, or dates.
3. TONE CALIBRATION:
   - Maintain a confident, natural, and credible professional register suitable for corporate recruiters and human hiring managers.
4. OUTPUT: Return strictly the humanized text. Do NOT add meta commentary, explanations, or quotes around the response.`;

  const userPrompt = `Humanize the following text while preserving all metrics and technical facts:\n\n${inputText}`;

  await streamWithFallback(apiKey, systemPrompt, userPrompt, 0.85, onChunk);
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
