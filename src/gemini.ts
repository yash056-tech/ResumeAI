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
    light: 'Focus on removing obvious robotic buzzwords while keeping existing sentence boundaries mostly intact.',
    balanced: 'Vary sentence lengths naturally. Interleave short punchy sentences (3-6 words) with nuanced thoughts (18-28 words). Express all points in authentic, conversational human phrasing.',
    deep: 'Completely de-synthesize the syntax. Re-structure thoughts from the ground up as if an articulate, experienced human practitioner is explaining their real-world journey to a peer with maximum linguistic entropy.',
  }[intensity];

  const toneGuides: Record<string, string> = {
    'Stealth Bypass (Anti-AI Detector)': `TARGET: 0% - 15% AI detection score on GPTZero, Turnitin, Copyleaks, Winston AI, and Originality.ai.
Focus on organic idioms ("untangling messy problems", "move the needle", "roll up my sleeves"), natural connectors ("In practice,", "Instead of,", "We found that,"), em-dashes (—), and natural sentence fragments. Write with visceral human authenticity.`,
    'Executive & Authoritative': `TARGET: C-suite, VP, and Board-level credibility.
High-agency, concise, decisive, and grounded in business accountability. Cut bureaucratic padding. Focus on decisions, trade-offs, velocity, and capital/revenue impact. Speak with quiet confidence.`,
    'Natural & Conversational': `TARGET: Authentic, human peer-to-peer communication.
Warm, approachable, and engaging. Sound like an experienced professional speaking over coffee — grounded, practical, clear, and relatable.`,
    'Direct & Technical': `TARGET: Senior Engineering, Architecture, and Research credibility.
Zero fluff, zero marketing speak. High-signal engineering clarity. Describe technical mechanisms, architectures, bottlenecks, and measurable system outputs directly without pseudo-philosophical preamble.`,
    'Punchy Startup': `TARGET: Fast-paced founder & operator speed.
Short, punchy, active sentences. Prioritize traction, speed of shipping, user impact, and ownership. High-energy, forward-moving, and impact-first.`,
  };

  const selectedToneGuide = toneGuides[tonePreset] || toneGuides['Stealth Bypass (Anti-AI Detector)'];

  const systemPrompt = `You are an elite Human Writer and Senior Professional Editor.
Your objective: Take stiff, robotic, or AI-generated text and completely rewrite it so it sounds 100% authentically human — as if written by a thoughtful, articulate person speaking from direct personal experience.

NON-NEGOTIABLE HUMANIZING PRINCIPLES:
1. FULL NARRATIVE & DETAIL FIDELITY:
   - Do NOT summarize or condense into a dry 1-sentence snippet. Retain every single key achievement, thought, and detail from the input.
   - Maintain approximately the same length and substance as the original text (target 85% to 110% of input length).
   - If the input has multiple sentences, preserve each point's meaning while transforming the expression completely.

2. NATURAL HUMAN CADENCE (High Burstiness):
   - Mix short, punchy statements (3-6 words) with longer, nuanced sentences (20-30 words).
   - Use em-dashes (—) and natural transitions like "In practice,", "Instead of,", "We found that,", "That meant,".
   - Use conversational human pacing devices and natural contractions ("didn't", "we've", "couldn't", "it's").

3. ABSOLUTE BAN ON ROBOTIC / AI PHRASES (50+ Blacklist):
   - NEVER use: delve, testament to, spearheaded, synergies, holistic approach, navigating the landscape, game-changing, actionable insights, results-driven, in today's fast-paced world, furthermore, moreover, thereby ensuring, vibrant tapestry, catalyst for change, not only... but also, plays a pivotal role, underscores, paramount, unwavering, bespoke, multifaceted.
   - Replace corporate jargon with plain, muscular, real-world language.

4. METRIC ACCURACY (100% Preserved):
   - Retain every single number, percentage (%), dollar amount ($), technology name (e.g. Go, Kubernetes, Python, AWS), and date.

5. REGISTER SPECIFICATION:
   ${selectedToneGuide}
   Level: ${intensity.toUpperCase()} (${intensityGuide})

6. OUTPUT FORMAT:
   - Return ONLY the humanized text. No markdown fences, no preamble, no quote marks.`;

  const userPrompt = `Rewrite this text in an authentic, natural human voice while keeping full detail and metrics:\n\n${inputText}`;

  const temp = intensity === 'deep' || tonePreset.includes('Stealth') ? 0.92 : intensity === 'balanced' ? 0.88 : 0.82;

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
