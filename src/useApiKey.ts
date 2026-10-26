import { useState } from 'react';

const STORAGE_KEY = 'resumeai_gemini_api_key';
const LEGACY_STORAGE_KEY = 'careerai_gemini_api_key';
const DEFAULT_KEY = (import.meta.env.VITE_GEMINI_API_KEY as string) || '';

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (saved && saved.trim()) return saved.trim();
    if (DEFAULT_KEY) {
      localStorage.setItem(STORAGE_KEY, DEFAULT_KEY);
      return DEFAULT_KEY;
    }
    return '';
  });

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem(STORAGE_KEY, key);
  };

  const clearApiKey = () => {
    setApiKeyState('');
    localStorage.removeItem(STORAGE_KEY);
  };

  return { apiKey, setApiKey, clearApiKey, hasKey: Boolean(apiKey && apiKey.trim().length > 0) };
}
