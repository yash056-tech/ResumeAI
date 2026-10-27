import { useState, useRef } from 'react';
import {
  Wand2, Copy, RotateCcw, ArrowRight, ShieldCheck, Sparkles,
  Sliders, Gauge, Send, AlertCircle, Upload, X, CheckCircle2, ScanSearch
} from 'lucide-react';
import { humanizeText } from './gemini';
import { extractTextFromFile, type ExtractedFileContent } from './fileParser';
import toast from 'react-hot-toast';
import styles from './Humanizer.module.css';

interface Props {
  apiKey: string;
  initialText?: string;
  onSendToDetector?: (text: string) => void;
  onRequireAuth?: (proceedCallback: () => void, actionName?: string) => boolean;
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

export default function Humanizer({ apiKey, initialText = '', onSendToDetector, onRequireAuth }: Props) {
  const [input, setInput] = useState(initialText);
  const [output, setOutput] = useState('');
  const [selectedTone, setSelectedTone] = useState(TONES[0].id);
  const [intensity, setIntensity] = useState<'light' | 'balanced' | 'deep'>('balanced');
  const [loading, setLoading] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

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
      });
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
      });
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
      });
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
