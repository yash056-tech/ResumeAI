import { useState, useRef } from 'react';
import {
  Wand2, Copy, RotateCcw, ArrowRight, ShieldCheck, Sparkles,
  Sliders, Gauge, Send, AlertCircle
} from 'lucide-react';
import { humanizeText } from './gemini';
import toast from 'react-hot-toast';
import styles from './Humanizer.module.css';

interface Props {
  apiKey: string;
  initialText?: string;
  onSendToDetector?: (text: string) => void;
  onRequireAuth?: (proceedCallback: () => void, actionName?: string) => boolean;
}

const TONES = [
  { id: 'Executive & Authoritative', label: 'Executive & C-Suite', desc: 'Authoritative, decisive, and credible for board & senior hiring.' },
  { id: 'Natural & Conversational', label: 'Natural & Human', desc: 'Warm, authentic, collaborative professional voice.' },
  { id: 'Direct & Technical', label: 'Direct & Technical', desc: 'Zero fluff, crisp, high-signal engineering and architecture focus.' },
  { id: 'Punchy Startup', label: 'Punchy High-Agency', desc: 'Fast-paced, impact-first, concise founder & operator register.' },
];

const BANNED_TROPES = [
  'results-driven', 'testament to', 'delve', 'navigating the landscape',
  'in today\'s fast-paced world', 'spearheaded', 'synergy', 'holistic',
  'game-changing', 'passionate about', 'actionable insights', 'furthermore',
  'moreover', 'beacon of', 'it is worth noting'
];

export default function Humanizer({ apiKey, initialText = '', onSendToDetector, onRequireAuth }: Props) {
  const [input, setInput] = useState(initialText);
  const [output, setOutput] = useState('');
  const [selectedTone, setSelectedTone] = useState(TONES[0].id);
  const [intensity, setIntensity] = useState<'light' | 'balanced' | 'deep'>('balanced');
  const [loading, setLoading] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const sampleStiffText = `As a results-driven professional with a proven track record of leveraging synergies across dynamic cross-functional teams, I have consistently spearheaded innovative initiatives that have delivered actionable insights and game-changing outcomes. With a holistic approach to navigating the landscape of modern enterprise challenges, I am passionate about delving into complex problems and transforming them into scalable solutions. It is a testament to my dedication that I have successfully managed 14 microservices in Go and Kubernetes, reducing latency by 45% while simultaneously optimizing workflows to drive organizational efficiency.`;

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
            <button
              className={styles.exBtn}
              onClick={() => setInput(sampleStiffText)}
            >
              Load AI Cliché Sample
            </button>
          </div>

          <textarea
            className={styles.textarea}
            rows={14}
            placeholder="Paste your AI-generated draft, robotic cover letter, or corporate-speak resume bullet here..."
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
        </div>
      </div>
    </div>
  );
}
