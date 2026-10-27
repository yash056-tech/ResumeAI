import { useState, useRef, useEffect } from 'react';
import {
  X, Check, ExternalLink, Sparkles, Eye, EyeOff, ShieldCheck,
  Zap, Cpu
} from 'lucide-react';
import {
  AI_PROVIDERS,
  type AIProvider,
  getProviderApiKey,
  setProviderApiKey,
  getActiveProvider,
  setActiveProvider,
  getActiveModel,
  setActiveModel
} from './aiEngine';
import toast from 'react-hot-toast';
import styles from './MultiAiModal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProviderChanged?: (provider: AIProvider, model: string) => void;
}

export default function MultiAiModal({ isOpen, onClose, onProviderChanged }: Props) {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(() => getActiveProvider());
  const [keys, setKeys] = useState<Record<AIProvider, string>>({
    gemini: getProviderApiKey('gemini'),
    groq: getProviderApiKey('groq'),
    anthropic: getProviderApiKey('anthropic'),
    openai: getProviderApiKey('openai'),
    openrouter: getProviderApiKey('openrouter'),
  });
  const [models, setModels] = useState<Record<AIProvider, string>>({
    gemini: getActiveModel('gemini'),
    groq: getActiveModel('groq'),
    anthropic: getActiveModel('anthropic'),
    openai: getActiveModel('openai'),
    openrouter: getActiveModel('openrouter'),
  });
  const [showKey, setShowKey] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedProvider(getActiveProvider());
      setKeys({
        gemini: getProviderApiKey('gemini'),
        groq: getProviderApiKey('groq'),
        anthropic: getProviderApiKey('anthropic'),
        openai: getProviderApiKey('openai'),
        openrouter: getProviderApiKey('openrouter'),
      });
      setModels({
        gemini: getActiveModel('gemini'),
        groq: getActiveModel('groq'),
        anthropic: getActiveModel('anthropic'),
        openai: getActiveModel('openai'),
        openrouter: getActiveModel('openrouter'),
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentMeta = AI_PROVIDERS[selectedProvider];
  const isCurrentActive = getActiveProvider() === selectedProvider;

  const handleKeyChange = (newKey: string) => {
    setKeys(prev => ({ ...prev, [selectedProvider]: newKey }));
  };

  const handleModelChange = (modelId: string) => {
    setModels(prev => ({ ...prev, [selectedProvider]: modelId }));
    setActiveModel(selectedProvider, modelId);
    toast.success(`Selected model: ${modelId}`);
    if (onProviderChanged) onProviderChanged(selectedProvider, modelId);
  };

  const handleSaveAndActivate = () => {
    // Save current key
    const keyToSave = keys[selectedProvider];
    setProviderApiKey(selectedProvider, keyToSave);

    // Save model
    const modelToSave = models[selectedProvider];
    setActiveModel(selectedProvider, modelToSave);

    // Set as active provider
    setActiveProvider(selectedProvider);

    toast.success(`Active AI Engine set to ${currentMeta.name}!`);
    if (onProviderChanged) onProviderChanged(selectedProvider, modelToSave);
    onClose();
  };

  const providersList = Object.values(AI_PROVIDERS);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.titleGroup}>
            <div className={styles.iconCircle}><Cpu size={22} /></div>
            <div>
              <h2 className={styles.title}>Multi-AI Engine Architecture</h2>
              <p className={styles.subtitle}>
                Connect other world-class AI models (Claude 3.5, Llama 3.3 via Groq, GPT-4o, or OpenRouter) for maximum human nuance and speed.
              </p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <div className={styles.bodyGrid}>
          {/* Left Provider Tabs */}
          <div className={styles.providerList}>
            {providersList.map(prov => {
              const hasKeyConfigured = Boolean(keys[prov.id]?.trim());
              const isSelected = selectedProvider === prov.id;
              const isActive = getActiveProvider() === prov.id;

              return (
                <button
                  key={prov.id}
                  className={`${styles.providerItem} ${isSelected ? styles.selectedItem : ''}`}
                  onClick={() => {
                    setSelectedProvider(prov.id);
                    setShowKey(false);
                  }}
                >
                  <span className={styles.provIcon}>{prov.icon}</span>
                  <div className={styles.provText}>
                    <div className={styles.provNameRow}>
                      <span className={styles.provName}>{prov.name}</span>
                      {isActive && <span className={styles.activePill}>ACTIVE</span>}
                    </div>
                    <span className={styles.provBadge}>{prov.badge}</span>
                  </div>
                  {hasKeyConfigured && (
                    <span className={styles.keyCheck} title="Key configured">
                      <Check size={13} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Provider Configuration Panel */}
          <div className={styles.configPane}>
            <div className={styles.paneTop}>
              <div className={styles.provHeader}>
                <span className={styles.largeIcon}>{currentMeta.icon}</span>
                <div>
                  <h3 className={styles.paneTitle}>{currentMeta.name}</h3>
                  <p className={styles.paneDesc}>{currentMeta.description}</p>
                </div>
              </div>

              {/* Model Selector */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <Zap size={13} /> Model Selection:
                </label>
                <div className={styles.modelOptions}>
                  {currentMeta.models.map(m => {
                    const isModelActive = models[selectedProvider] === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        className={`${styles.modelBtn} ${isModelActive ? styles.activeModelBtn : ''}`}
                        onClick={() => handleModelChange(m.id)}
                      >
                        <div className={styles.modelNameRow}>
                          <span className={styles.modelName}>{m.name}</span>
                          {isModelActive && <Check size={12} color="var(--accent3)" />}
                        </div>
                        <span className={styles.modelDesc}>{m.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* API Key Input */}
              <div className={styles.fieldGroup}>
                <div className={styles.keyLabelRow}>
                  <label className={styles.label}>
                    API Key for {currentMeta.name}:
                  </label>
                  <a
                    href={currentMeta.keyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.keyLink}
                  >
                    <span>Get Key</span>
                    <ExternalLink size={11} />
                  </a>
                </div>

                <div className={styles.inputWrapper}>
                  <input
                    ref={inputRef}
                    type={showKey ? 'text' : 'password'}
                    placeholder={currentMeta.placeholder}
                    value={keys[selectedProvider] || ''}
                    onChange={e => handleKeyChange(e.target.value)}
                    className={styles.keyInput}
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowKey(!showKey)}
                    title={showKey ? 'Hide key' : 'Show key'}
                  >
                    {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {selectedProvider === 'gemini' && (
                  <p className={styles.helperText}>
                    ✨ Google Gemini is automatically pre-configured on ResumeAI with a built-in free tier. Adding your own key gives you higher quota limits.
                  </p>
                )}
                {selectedProvider === 'groq' && (
                  <p className={styles.helperText}>
                    ⚡ Groq offers <strong>free API tier</strong> with Llama 3.3 70B generating 500+ tokens/second with exceptional natural human phrasing.
                  </p>
                )}
                {selectedProvider === 'anthropic' && (
                  <p className={styles.helperText}>
                    🧠 Claude 3.5 Sonnet requires an Anthropic API key with browser CORS access allowed.
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className={styles.paneFooter}>
              <div className={styles.securityNote}>
                <ShieldCheck size={14} color="var(--accent3)" />
                <span>Keys are stored strictly in your browser's local storage.</span>
              </div>

              <div className={styles.actionButtons}>
                <button
                  type="button"
                  className={styles.activateBtn}
                  onClick={handleSaveAndActivate}
                >
                  <Sparkles size={14} />
                  {isCurrentActive ? 'Save Settings' : `Set ${currentMeta.name} as Active`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
