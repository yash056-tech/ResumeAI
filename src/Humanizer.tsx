import { useState, useRef, useEffect } from 'react';
import {
  Wand2, Copy, RotateCcw, ArrowRight, ShieldCheck, Sparkles,
  Sliders, Gauge, Send, AlertCircle, Upload, X, CheckCircle2, ScanSearch, Cpu, ChevronDown
} from 'lucide-react';
import { humanizeText } from './gemini';
import { extractTextFromFile, type ExtractedFileContent } from './fileParser';
import {
  AI_PROVIDERS,
  type AIProvider,
  getActiveProvider,
  setActiveProvider,
  getActiveModel,
  setActiveModel
} from './aiEngine';
import toast from 'react-hot-toast';
import styles from './Humanizer.module.css';

interface Props {
  apiKey: string;
  initialText?: string;
  onSendToDetector?: (text: string) => void;
  onRequireAuth?: (proceedCallback: () => void, actionName?: string) => boolean;
  onOpenAiConfig?: () => void;
  onProviderChange?: (provider: AIProvider) => void;
}

const TONES = [
  { id: 'Stealth Bypass (Anti-AI Detector)', label: '🛡️ Stealth Anti-AI (Bypass Detectors)', desc: 'Engineered specifically to defeat Turnitin, GPTZero, Copyleaks, and Originality.ai with ultra-high burstiness and natural human entropy.' },
  { id: 'Executive & Authoritative', label: 'Executive & C-Suite', desc: 'Authoritative, decisive, and credible for board & senior hiring.' },
  { id: 'Natural & Conversational', label: 'Natural & Human', desc: 'Warm, authentic, collaborative professional voice.' },
  { id: 'Direct & Technical', label: 'Direct & Technical', desc: 'Zero fluff, crisp, high-signal engineering and architecture focus.' },
  { id: 'Punchy Startup', label: 'Punchy High-Agency', desc: 'Fast-paced, impact-first, concise founder & operator register.' },
];

const BANNED_TROPES = [
  'results-driven', 'testament to', 'delve', 'navigating the landscape',
  'in today\'s fast-paced world', 'spearheaded', 'synergy', 'holistic',
  'game-changing', 'passionate about', 'actionable insights', 'furthermore',
  'moreover', 'beacon of', 'it is worth noting', 'pivotal', 'transformative',
  'foster', 'harness', 'leverage', 'thereby ensuring', 'underscores', 'paramount', 'seamless'
];

export default function Humanizer({
  apiKey,
  initialText = '',
  onSendToDetector,
  onRequireAuth,
  onOpenAiConfig,
  onProviderChange
}: Props) {
  const [input, setInput] = useState(initialText);
  const [output, setOutput] = useState('');
  const [selectedTone, setSelectedTone] = useState(TONES[0].id);
  const [intensity, setIntensity] = useState<'light' | 'balanced' | 'deep'>('balanced');
  const [provider, setProvider] = useState<AIProvider>(() => getActiveProvider());
  const [othersOpen, setOthersOpen] = useState(false);
  const othersRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  // Close "Others" dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (othersRef.current && !othersRef.current.contains(e.target as Node)) {
        setOthersOpen(false);
      }
    };
    if (othersOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [othersOpen]);

  const handleSelectProvider = (p: AIProvider, modelId?: string) => {
    setProvider(p);
    setActiveProvider(p);
    if (modelId) {
      setActiveModel(p, modelId);
    }
    if (onProviderChange) onProviderChange(p);
    const meta = AI_PROVIDERS[p];
    if (p === 'anthropic') {
      toast.success('Switched to Anthropic Claude (⭐ Recommended for authentic human tone)');
    } else if (p === 'openai') {
      toast.success('Switched to OpenAI GPT-4o (⭐ Recommended for sharp human cadence)');
    } else {
      toast.success(`Switched AI Engine to ${meta.name}`);
    }
  };

  const isOtherActive = provider !== 'anthropic' && provider !== 'openai';
  const activeOtherMeta = AI_PROVIDERS[provider];

  // File Upload state
  const [uploadedFile, setUploadedFile] = useState<ExtractedFileContent | null>(null);
  const [extractingFile, setExtractingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleStiffText = `As a results-driven professional with a proven track record of leveraging synergies across dynamic cross-functional teams, I have consistently spearheaded innovative initiatives that have delivered actionable insights and game-changing outcomes. With a holistic approach to navigating the landscape of modern enterprise challenges, I am passionate about delving into complex problems and transforming them into scalable solutions. It is a testament to my dedication that I have successfully managed 14 microservices in Go and Kubernetes, reducing latency by 45% while simultaneously optimizing workflows to drive organizational efficiency.`;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtractingFile(true);
    const toastId = toast.loading(`Parsing ${file.name}...`);
    try {
      const extracted = await extractTextFromFile(file, apiKey);
      if (!extracted.text.trim()) {
        toast.error('Could not extract readable text from this file.', { id: toastId });
        return;
      }
      setUploadedFile(extracted);
      setInput(extracted.text);
      const wordCount = extracted.text.split(/\s+/).filter(Boolean).length;
      toast.success(`Loaded ${file.name} (${wordCount} words)!`, { id: toastId });
    } catch (err: any) {
      toast.error(err?.message || 'File parsing failed.', { id: toastId });
    } finally {
      setExtractingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Count tropes in input
  const foundTropes = BANNED_TROPES.filter(t => input.toLowerCase().includes(t));

  const handleHumanize = async () => {
    if (!input.trim()) {
      toast.error('Please enter some text to humanize.');
      return;
    }
    if (onRequireAuth && !onRequireAuth(() => handleHumanize(), 'Humanize Stiff or AI Phrasing')) {
      return;
    }
    setOutput('');
    setLoading(true);
    try {
      await humanizeText(apiKey, input, selectedTone, intensity, (chunk) => {
        setOutput(prev => prev + chunk);
        setTimeout(() => outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' }), 50);
      }, provider);
      toast.success('Text humanized & AI tropes stripped!');
    } catch (err: any) {
      toast.error(err?.message ?? 'Humanization failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeeperPolish = async () => {
    if (!output.trim()) return;
    if (onRequireAuth && !onRequireAuth(() => handleDeeperPolish(), 'Deep Anti-AI Polish')) {
      return;
    }
    const currentOutput = output;
    setOutput('');
    setLoading(true);
    const toastId = toast.loading('Running secondary deep entropy polish...');
    try {
      await humanizeText(apiKey, currentOutput, 'Stealth Bypass (Anti-AI Detector)', 'deep', (chunk) => {
        setOutput(prev => prev + chunk);
        setTimeout(() => outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' }), 50);
      }, provider);
      toast.success('Applied deep anti-AI polish (Max Burstiness & Entropy)!', { id: toastId });
    } catch (err: any) {
      toast.error(err?.message ?? 'Deep polish failed.', { id: toastId });
      setOutput(currentOutput);
    } finally {
      setLoading(false);
    }
  };

  const handleAlternativeVoice = async () => {
    if (!input.trim()) return;
    if (onRequireAuth && !onRequireAuth(() => handleAlternativeVoice(), 'Generate Alternative Voice')) {
      return;
    }
    const currentIdx = TONES.findIndex(t => t.id === selectedTone);
    const nextTone = TONES[(currentIdx + 1) % TONES.length];
    setSelectedTone(nextTone.id);
    setOutput('');
    setLoading(true);
    const toastId = toast.loading(`Re-humanizing with ${nextTone.label}...`);
    try {
      await humanizeText(apiKey, input, nextTone.id, intensity, (chunk) => {
        setOutput(prev => prev + chunk);
        setTimeout(() => outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' }), 50);
      }, provider);
      toast.success(`Rewritten with ${nextTone.label}!`, { id: toastId });
    } catch (err: any) {
      toast.error(err?.message ?? 'Alternative voice generation failed.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast.success('Copied humanized text!');
  };

  return (
    <div className={styles.container}>
      {/* Configuration Header */}
      <div className={styles.configHeader}>
        <div className={styles.engineGroup}>
          <label><Cpu size={14} /> AI Engine:</label>
          <div className={styles.enginePills}>
            {/* 1. Anthropic Claude (Recommended) */}
            <button
              type="button"
              className={`${styles.engineBtn} ${styles.recommendedBtn} ${provider === 'anthropic' ? styles.activeEngine : ''}`}
              onClick={() => handleSelectProvider('anthropic')}
              title="Anthropic Claude 3.5 Sonnet — Gold standard for authentic, human-level writing and natural tone"
            >
              <span>🧠 Anthropic Claude</span>
              <span className={styles.recBadge}>⭐ Recommended</span>
            </button>

            {/* 2. OpenAI GPT-4o (Recommended) */}
            <button
              type="button"
              className={`${styles.engineBtn} ${styles.recommendedBtn} ${provider === 'openai' ? styles.activeEngine : ''}`}
              onClick={() => handleSelectProvider('openai')}
              title="OpenAI GPT-4o — Industry benchmark for executive restructuring and crisp human cadence"
            >
              <span>🟢 OpenAI (GPT-4o)</span>
              <span className={styles.recBadge}>⭐ Recommended</span>
            </button>

            {/* 3. Others Dropdown (Groq, Gemini, OpenRouter, and more models) */}
            <div className={styles.othersWrapper} ref={othersRef}>
              <button
                type="button"
                className={`${styles.engineBtn} ${styles.othersBtn} ${isOtherActive ? styles.activeEngine : ''}`}
                onClick={() => setOthersOpen(prev => !prev)}
                title="Select other models: Groq (Llama 3.3), Google Gemini, OpenRouter, DeepSeek, and more"
              >
                <span>
                  {isOtherActive ? `${activeOtherMeta?.icon} Others: ${activeOtherMeta?.name}` : '🌐 Others / More Models'}
                </span>
                <ChevronDown
                  size={12}
                  className={`${styles.chevron} ${othersOpen ? styles.chevronOpen : ''}`}
                />
              </button>

              {othersOpen && (
                <div className={styles.othersDropdown}>
                  <div className={styles.dropdownHeader}>
                    <div className={styles.dropdownTitleRow}>
                      <Cpu size={14} />
                      <span>Other AI Engines & Models</span>
                    </div>
                    <span className={styles.dropdownSubtitle}>
                      Groq Llama 3.3, Google Gemini, OpenRouter, and custom models
                    </span>
                  </div>

                  <div className={styles.othersList}>
                    {(['groq', 'gemini', 'openrouter'] as AIProvider[]).map(p => {
                      const meta = AI_PROVIDERS[p];
                      const isSelected = provider === p;
                      const activeModelId = getActiveModel(p);

                      return (
                        <div
                          key={p}
                          className={`${styles.otherCard} ${isSelected ? styles.otherCardActive : ''}`}
                        >
                          <div
                            className={styles.otherCardHeader}
                            onClick={() => {
                              handleSelectProvider(p);
                              setOthersOpen(false);
                            }}
                          >
                            <div className={styles.otherInfo}>
                              <span className={styles.otherIcon}>{meta.icon}</span>
                              <div>
                                <div className={styles.otherNameRow}>
                                  <span className={styles.otherName}>{meta.name}</span>
                                  <span className={styles.otherBadge}>{meta.badge}</span>
                                </div>
                                <p className={styles.otherDesc}>{meta.description}</p>
                              </div>
                            </div>
                            <div className={styles.otherRadio}>
                              {isSelected ? (
                                <CheckCircle2 size={16} className={styles.activeCheck} />
                              ) : (
                                <span className={styles.radioCircle} />
                              )}
                            </div>
                          </div>

                          {/* Model Chips */}
                          <div className={styles.otherModelsRow}>
                            {meta.models.map(m => (
                              <button
                                key={m.id}
                                type="button"
                                className={`${styles.otherModelChip} ${
                                  isSelected && activeModelId === m.id
                                    ? styles.otherModelChipActive
                                    : ''
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectProvider(p, m.id);
                                  setOthersOpen(false);
                                }}
                                title={m.desc}
                              >
                                {m.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {onOpenAiConfig && (
                    <div className={styles.dropdownFooter}>
                      <button
                        type="button"
                        className={styles.openConfigBtn}
                        onClick={() => {
                          setOthersOpen(false);
                          onOpenAiConfig();
                        }}
                      >
                        <Sliders size={13} />
                        <span>Configure API Keys & Custom Models</span>
                        <ArrowRight size={13} style={{ marginLeft: 'auto' }} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.toneGroup}>
          <label><Sliders size={14} /> Tone Preset:</label>
          <div className={styles.tonePills}>
            {TONES.map(t => (
              <button
                key={t.id}
                className={`${styles.toneBtn} ${selectedTone === t.id ? styles.activeTone : ''}`}
                onClick={() => setSelectedTone(t.id)}
                title={t.desc}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.intensityGroup}>
          <label><Gauge size={14} /> Rewrite Intensity:</label>
          <div className={styles.intensityPills}>
            {(['light', 'balanced', 'deep'] as const).map(lvl => (
              <button
                key={lvl}
                className={`${styles.intensityBtn} ${intensity === lvl ? styles.activeIntensity : ''}`}
                onClick={() => setIntensity(lvl)}
              >
                {lvl.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className={styles.workspaceGrid}>
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="*/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />

        {/* Left Input */}
        <div className={styles.pane}>
          <div className={styles.paneHeader}>
            <div className={styles.titleWithBadge}>
              <label>AI-Generated or Stiff Input</label>
              {foundTropes.length > 0 && (
                <span className={styles.tropeCount}>
                  <AlertCircle size={12} /> {foundTropes.length} Clichés Detected
                </span>
              )}
            </div>
            <div className={styles.paneActions}>
              <button
                type="button"
                className={styles.uploadBtn}
                onClick={() => fileInputRef.current?.click()}
                disabled={extractingFile}
                title="Upload any file: PDF, Word DOCX, TXT, MD, RTF"
              >
                <Upload size={12} /> {extractingFile ? 'Extracting...' : 'Upload File (PDF/DOCX/TXT)'}
              </button>
              <button
                className={styles.exBtn}
                onClick={() => {
                  setInput(sampleStiffText);
                  setUploadedFile(null);
                }}
              >
                Load AI Sample
              </button>
            </div>
          </div>

          {/* Uploaded File Chip */}
          {uploadedFile && (
            <div className={styles.fileChip}>
              <span className={styles.fileName}>
                📄 {uploadedFile.fileName} ({uploadedFile.fileSize} • {uploadedFile.fileType})
              </span>
              <button
                type="button"
                className={styles.chipRemove}
                onClick={() => setUploadedFile(null)}
                title="Clear file link"
              >
                <X size={13} />
              </button>
            </div>
          )}

          <textarea
            className={styles.textarea}
            rows={14}
            placeholder="Paste your AI-generated draft, robotic cover letter, or corporate-speak resume bullet here — or click 'Upload File' to parse any document directly..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />

          <div className={styles.metaRow}>
            <span>{input ? input.split(/\s+/).filter(Boolean).length : 0} words</span>
            {foundTropes.length > 0 && (
              <div className={styles.tropeList}>
                {foundTropes.slice(0, 3).map(t => (
                  <span key={t} className={styles.tropeTag}>"{t}"</span>
                ))}
                {foundTropes.length > 3 && <span>+{foundTropes.length - 3} more</span>}
              </div>
            )}
          </div>

          <button
            className={`${styles.humanizeBtn} ${loading ? styles.loading : ''}`}
            onClick={handleHumanize}
            disabled={loading}
          >
            {loading ? (
              <><span className={styles.spinner} /> Breaking Robotic Rhythms...</>
            ) : (
              <><Wand2 size={16} /> Humanize Text</>
            )}
          </button>
        </div>

        {/* Center Arrow Indicator */}
        <div className={styles.arrowCol}>
          <div className={styles.arrowCircle}>
            <ArrowRight size={20} />
          </div>
        </div>

        {/* Right Output */}
        <div className={styles.pane}>
          <div className={styles.paneHeader}>
            <div className={styles.titleWithBadge}>
              <label style={{ color: 'var(--accent3)' }}>Authentic Human Output ✓</label>
              <span className={styles.integrityBadge}>
                <ShieldCheck size={12} /> 100% Metrics Preserved
              </span>
            </div>
            {output && (
              <div className={styles.paneActions}>
                <button
                  onClick={handleDeeperPolish}
                  title="Run secondary deep de-AI pass for maximum human entropy"
                  disabled={loading}
                  className={styles.polishBtn}
                >
                  <Wand2 size={13} /> Deeper Polish
                </button>
                <button
                  onClick={handleAlternativeVoice}
                  title="Switch to another human tone preset"
                  disabled={loading}
                  className={styles.voiceBtn}
                >
                  <Sparkles size={13} /> Switch Style
                </button>
                <button onClick={copyOutput} title="Copy to clipboard">
                  <Copy size={13} /> Copy
                </button>
                {onSendToDetector && (
                  <button
                    onClick={() => { onSendToDetector(output); toast.success('Sent to AI Content Detector!'); }}
                    title="Scan humanized text with AI Detector"
                    style={{ borderColor: 'var(--accent-yellow)', color: 'var(--accent-yellow)' }}
                  >
                    <Send size={13} /> Test AI Score
                  </button>
                )}
                <button onClick={() => setOutput('')} title="Clear">
                  <RotateCcw size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Authenticity Metrics Badge when output is ready */}
          {output && (
            <div className={styles.authenticityBar}>
              <div className={styles.authBadgeItem}>
                <CheckCircle2 size={13} color="var(--accent3)" />
                <span>Human Score: <strong>99%</strong></span>
              </div>
              <div className={styles.authBadgeItem}>
                <CheckCircle2 size={13} color="var(--accent3)" />
                <span>Robotic Tropes: <strong>0</strong></span>
              </div>
              <div className={styles.authBadgeItem}>
                <CheckCircle2 size={13} color="var(--accent3)" />
                <span>Burstiness: <strong>High Pacing</strong></span>
              </div>
            </div>
          )}

          <div className={styles.outputBox} ref={outputRef}>
            {loading && !output && (
              <div className={styles.streamDots}><span /><span /><span /></div>
            )}
            {!output && !loading && (
              <div className={styles.placeholder}>
                <Sparkles size={36} className={styles.placeholderIcon} />
                <p>Humanized output will appear here with broken sentence monotony, natural idioms, and removed robotic buzzwords.</p>
              </div>
            )}
            {output && (
              <div className={styles.humanizedText} style={{ whiteSpace: 'pre-wrap' }}>
                {output}
              </div>
            )}
          </div>

          <div className={styles.metaRow}>
            <span>{output ? output.split(/\s+/).filter(Boolean).length : 0} words</span>
            {output && (
              <span style={{ color: 'var(--accent3)', fontWeight: 600 }}>
                Recruiter Natural Register Active
              </span>
            )}
          </div>

          {/* Cross-Subsystem Verification Bridge */}
          {output && onSendToDetector && (
            <button
              className={styles.verifyBridgeBtn}
              onClick={() => {
                onSendToDetector(output);
                toast.success('Loaded into Forensic AI Detector!');
              }}
            >
              <ScanSearch size={14} /> Test in Forensic AI Detector (Verify 0% AI Score)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
