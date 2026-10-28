// Unified Multi-Provider AI Engine for ResumeAI
// Supports Google Gemini, OpenAI, Anthropic Claude, Groq (Llama 3.3), and OpenRouter
import { GoogleGenAI } from '@google/genai';

export type AIProvider = 'gemini' | 'openai' | 'anthropic' | 'groq' | 'openrouter';

export interface AIModelOption {
  id: string;
  name: string;
  desc: string;
}

export interface AIProviderMeta {
  id: AIProvider;
  name: string;
  badge: string;
  icon: string;
  description: string;
  storageKey: string;
  models: AIModelOption[];
  defaultModel: string;
  placeholder: string;
  keyUrl: string;
  recommended?: boolean;
}

export const AI_PROVIDERS: Record<AIProvider, AIProviderMeta> = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    badge: 'Built-in Free',
    icon: '🔮',
    description: 'High-speed multimodal reasoning with Gemini 3.5 Flash Lite & 3.8 Flash.',
    storageKey: 'resumeai_gemini_api_key',
    defaultModel: 'gemini-3.5-flash-lite',
    placeholder: 'AIzaSy...',
    keyUrl: 'https://aistudio.google.com/app/apikey',
    models: [
      { id: 'gemini-3.5-flash-lite', name: 'Gemini 3.5 Flash Lite', desc: 'Blazing fast, balanced reasoning (Default)' },
      { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash', desc: 'Next-gen flagship high-speed model' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Enterprise calibrated stable model' },
    ],
  },
  groq: {
    id: 'groq',
    name: 'Groq (Llama 3.3)',
    badge: 'Ultra Fast',
    icon: '⚡',
    description: 'LPUs delivering 500+ tok/s with Llama 3.3 70B. Exceptionally natural human cadence.',
    storageKey: 'resumeai_groq_api_key',
    defaultModel: 'llama-3.3-70b-versatile',
    placeholder: 'gsk_...',
    keyUrl: 'https://console.groq.com/keys',
    models: [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile', desc: 'Top-tier open intelligence, organic phrasing' },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', desc: 'Sub-second latency, lightweight' },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', desc: 'High-context sparse MoE architecture' },
    ],
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic Claude',
    badge: 'Highest Human Nuance',
    icon: '🧠',
    recommended: true,
    description: 'Claude 3.5 Sonnet is recognized worldwide as the most articulate, human-sounding LLM.',
    storageKey: 'resumeai_anthropic_api_key',
    defaultModel: 'claude-3-5-sonnet-20241022',
    placeholder: 'sk-ant-...',
    keyUrl: 'https://console.anthropic.com/settings/keys',
    models: [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', desc: 'Gold standard for authentic, human-level writing' },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', desc: 'Fast, responsive, high-intelligence editor' },
    ],
  },
  openai: {
    id: 'openai',
    name: 'OpenAI (GPT-4o)',
    badge: 'Industry Benchmark',
    icon: '🟢',
    recommended: true,
    description: 'GPT-4o delivers crisp logic, complex formatting, and executive ATS restructuring.',
    storageKey: 'resumeai_openai_api_key',
    defaultModel: 'gpt-4o',
    placeholder: 'sk-...',
    keyUrl: 'https://platform.openai.com/api-keys',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', desc: 'Flagship multimodal intelligence' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', desc: 'Fast, cost-efficient, sharp editing' },
    ],
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter (Universal)',
    badge: '100+ Models',
    icon: '🌐',
    description: 'Single API key connecting DeepSeek V3/R1, Claude 3.5, Mistral Large, and Llama 3.3.',
    storageKey: 'resumeai_openrouter_api_key',
    defaultModel: 'deepseek/deepseek-chat',
    placeholder: 'sk-or-...',
    keyUrl: 'https://openrouter.ai/keys',
    models: [
      { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3', desc: 'State-of-the-art cost/performance model' },
      { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1', desc: 'Breakthrough reasoning and de-AI synthesis' },
      { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B (OpenRouter)', desc: 'High-burstiness open weights model' },
      { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (OpenRouter)', desc: 'Supreme human nuance via OpenRouter' },
      { id: 'mistralai/mistral-large-2407', name: 'Mistral Large 2', desc: 'European multilingual powerhouse' },
    ],
  },
};

/**
 * Read stored API key for a given provider
 */
export function getProviderApiKey(provider: AIProvider): string {
  const meta = AI_PROVIDERS[provider];
  if (!meta) return '';

  const stored = localStorage.getItem(meta.storageKey);
  if (stored && stored.trim()) return stored.trim();

  // If Gemini, fall back to environment variable
  if (provider === 'gemini') {
    const envKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
    if (envKey.trim()) return envKey.trim();
  }

  return '';
}

/**
 * Save API key for a specific provider
 */
export function setProviderApiKey(provider: AIProvider, key: string): void {
  const meta = AI_PROVIDERS[provider];
  if (meta) {
    if (key.trim()) {
      localStorage.setItem(meta.storageKey, key.trim());
    } else {
      localStorage.removeItem(meta.storageKey);
    }
  }
}

/**
 * Get or set currently selected provider
 */
export function getActiveProvider(): AIProvider {
  const saved = localStorage.getItem('resumeai_active_provider') as AIProvider;
  if (saved && AI_PROVIDERS[saved]) {
    // If provider has a key configured or is gemini, use it
    if (getProviderApiKey(saved)) return saved;
  }
  return 'gemini';
}

export function setActiveProvider(provider: AIProvider): void {
  localStorage.setItem('resumeai_active_provider', provider);
}

/**
 * Get or set active model for a provider
 */
export function getActiveModel(provider: AIProvider): string {
  const saved = localStorage.getItem(`resumeai_model_${provider}`);
  if (saved) return saved;
  return AI_PROVIDERS[provider]?.defaultModel || 'gemini-3.5-flash-lite';
}

export function setActiveModel(provider: AIProvider, model: string): void {
  localStorage.setItem(`resumeai_model_${provider}`, model);
}

/**
 * Generic SSE stream reader for OpenAI-compatible endpoints (OpenAI, Groq, OpenRouter)
 */
async function streamOpenAICompatible(
  url: string,
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string,
  temperature: number,
  extraHeaders: Record<string, string> = {},
  onChunk: (text: string) => void
): Promise<void> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`,
      ...extraHeaders,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API error (${response.status}): ${errText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('Readable stream not supported');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data:')) continue;
      const dataStr = trimmed.slice(5).trim();
      if (dataStr === '[DONE]') return;

      try {
        const parsed = JSON.parse(dataStr);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) onChunk(delta);
      } catch {
        // partial json, ignore
      }
    }
  }
}

/**
 * Stream caller for Anthropic Claude
 */
async function streamAnthropic(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string,
  temperature: number,
  onChunk: (text: string) => void
): Promise<void> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey.trim(),
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      max_tokens: 4096,
      temperature,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic error (${response.status}): ${errText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('Readable stream not supported');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data:')) continue;
      const dataStr = trimmed.slice(5).trim();

      try {
        const parsed = JSON.parse(dataStr);
        if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
          onChunk(parsed.delta.text);
        }
      } catch {
        // partial json, ignore
      }
    }
  }
}

/**
 * Stream caller for Google Gemini
 */
async function streamGemini(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string,
  temperature: number,
  onChunk: (text: string) => void
): Promise<void> {
  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
  const response = await ai.models.generateContentStream({
    model,
    contents: userPrompt,
    config: { systemInstruction: systemPrompt, temperature },
  });

  for await (const chunk of response) {
    if (chunk.text) onChunk(chunk.text);
  }
}

/**
 * Unified Streaming Invocation with Automatic Fallback:
 * If the selected provider is missing a key or fails, it automatically falls back
 * to Google Gemini (which has a pre-configured built-in key).
 */
export async function streamUnifiedAI(
  provider: AIProvider,
  model: string,
  systemPrompt: string,
  userPrompt: string,
  temperature: number,
  onChunk: (text: string) => void
): Promise<{ usedProvider: AIProvider; usedModel: string }> {
  const key = getProviderApiKey(provider);

  // If selected provider has a valid key, attempt it
  if (key && provider !== 'gemini') {
    try {
      if (provider === 'openai') {
        await streamOpenAICompatible('https://api.openai.com/v1/chat/completions', key, model, systemPrompt, userPrompt, temperature, {}, onChunk);
        return { usedProvider: 'openai', usedModel: model };
      }
      if (provider === 'groq') {
        await streamOpenAICompatible('https://api.groq.com/openai/v1/chat/completions', key, model, systemPrompt, userPrompt, temperature, {}, onChunk);
        return { usedProvider: 'groq', usedModel: model };
      }
      if (provider === 'openrouter') {
        await streamOpenAICompatible(
          'https://openrouter.ai/api/v1/chat/completions',
          key,
          model,
          systemPrompt,
          userPrompt,
          temperature,
          { 'HTTP-Referer': 'https://resumeai-pro-nu.vercel.app', 'X-Title': 'ResumeAI' },
          onChunk
        );
        return { usedProvider: 'openrouter', usedModel: model };
      }
      if (provider === 'anthropic') {
        await streamAnthropic(key, model, systemPrompt, userPrompt, temperature, onChunk);
        return { usedProvider: 'anthropic', usedModel: model };
      }
    } catch (err) {
      console.warn(`Provider ${provider} failed, falling back to default Gemini engine...`, err);
    }
  }

  // Fallback to Google Gemini
  const geminiKey = getProviderApiKey('gemini');
  if (!geminiKey) {
    throw new Error('Please configure a valid API key (Gemini, Groq, OpenAI, Claude, or OpenRouter) in settings.');
  }

  const geminiModels = ['gemini-3.5-flash-lite', 'gemini-3.8-flash', 'gemini-2.5-flash'];
  let geminiError: any = null;

  for (const gModel of geminiModels) {
    try {
      await streamGemini(geminiKey, gModel, systemPrompt, userPrompt, temperature, onChunk);
      return { usedProvider: 'gemini', usedModel: gModel };
    } catch (err) {
      geminiError = err;
    }
  }

  throw geminiError || new Error('All AI providers and models failed.');
}
