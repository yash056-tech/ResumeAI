import React, { useState, useRef } from 'react';
import {
  ScanSearch, AlertTriangle, CheckCircle2, Send,
  Activity, Upload, X
} from 'lucide-react';
import { detectAIContent, type DetectorResult, type SentenceAnalysis } from './gemini';
import { extractTextFromFile, type ExtractedFileContent } from './fileParser';
import toast from 'react-hot-toast';
import styles from './Detector.module.css';

interface Props {
  apiKey: string;
  initialText?: string;
  onSendToHumanizer?: (text: string) => void;
  onRequireAuth?: (proceedCallback: () => void, actionName?: string) => boolean;
}

const EXAMPLE_AI = `In today's fast-paced and ever-evolving business landscape, leveraging cutting-edge technologies has become increasingly paramount. Organizations that embrace digital transformation are better positioned to navigate the complexities of modern enterprise challenges. Furthermore, it is worth noting that companies which invest in robust data infrastructure can unlock actionable insights that drive strategic decision-making. By fostering a culture of innovation and collaboration, businesses can achieve sustainable growth and maintain a competitive advantage. Moreover, the seamless integration of artificial intelligence and machine learning capabilities empowers cross-functional teams to automate repetitive tasks, thereby freeing up valuable human capital for strategic growth initiatives.`;

const EXAMPLE_HUMAN = `Three years ago, I accidentally brought down our production database on a Friday afternoon — five minutes before catching a flight out of SFO. The SQL migration looked totally benign in staging. It always does. We had a cascade delete lacking a strict WHERE filter, and I was already mentally at the airport gate. That incident fundamentally changed how I review infrastructure code. Today, every destructive query requires a dry-run SELECT with row counts first. No exceptions, even on localhost. I've probably annoyed half the platform team with my verification checklists, but we haven't suffered an unmanaged outage since.`;

export default function Detector({ apiKey, initialText = '', onSendToHumanizer, onRequireAuth }: Props) {
  const [input, setInput] = useState(initialText);
  const [result, setResult] = useState<DetectorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSentence, setSelectedSentence] = useState<SentenceAnalysis | null>(null);

  // File upload state
  const [uploadedFile, setUploadedFile] = useState<ExtractedFileContent | null>(null);
  const [extractingFile, setExtractingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDetect = async () => {
    const wordCount = input.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 25) {
      toast.error('Please enter at least 25 words for forensic linguistic analysis.');
      return;
    }
    if (onRequireAuth && !onRequireAuth(() => handleDetect(), 'Run Forensic AI Detection Scan')) {
      return;
    }
    setResult(null);
    setSelectedSentence(null);
    setLoading(true);
    try {
      const res = await detectAIContent(apiKey, input);
      setResult(res);
      toast.success('Forensic linguistic scan complete!');
    } catch (err: any) {
      toast.error(err?.message ?? 'Detection failed.');
    } finally {
      setLoading(false);
    }
  };

  const aiPct = result?.aiPercentage ?? 0;
  const humanPct = result?.humanPercentage ?? 100;
  const riskColor = aiPct >= 65 ? 'var(--accent-red)' : aiPct >= 35 ? 'var(--accent-yellow)' : 'var(--accent3)';
  const riskLabel = aiPct >= 65 ? 'High AI Probability' : aiPct >= 35 ? 'Mixed / Moderate Risk' : 'Authentic Human Content';
  const RiskIcon = aiPct >= 35 ? AlertTriangle : CheckCircle2;

  return (
    <div className={styles.container}>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="*/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* Input Section */}
      <div className={styles.inputCard}>
        <div className={styles.header}>
          <div className={styles.labelGroup}>
            <label className={styles.label}>Content for Forensic AI Analysis</label>
            <span className={styles.infoBadge}>
              <Activity size={12} /> Evaluates Perplexity & Burstiness Vectors
            </span>
          </div>

          <div className={styles.exBtns}>
            <button
              type="button"
              className={`${styles.exBtn} ${styles.uploadBtn}`}
              onClick={() => fileInputRef.current?.click()}
              disabled={extractingFile}
              title="Upload document: PDF, Word DOCX, TXT, MD, RTF"
            >
              <Upload size={12} /> {extractingFile ? 'Extracting...' : 'Upload File (PDF/DOCX/TXT)'}
            </button>
            <button
              className={styles.exBtn}
              onClick={() => {
                setInput(EXAMPLE_AI);
                setUploadedFile(null);
              }}
            >
              Load AI Sample
            </button>
            <button
              className={`${styles.exBtn} ${styles.greenBtn}`}
              onClick={() => {
                setInput(EXAMPLE_HUMAN);
                setUploadedFile(null);
              }}
            >
              Load Human Sample
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
          rows={9}
          placeholder="Paste cover letter, article, LinkedIn bio, or resume bullet text — or click 'Upload File' to scan any document directly..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />

        <div className={styles.belowInput}>
          <span className={styles.wordCount}>
            {input.split(/\s+/).filter(Boolean).length} words
            {input.split(/\s+/).filter(Boolean).length < 25 && ' (recommended ≥25 for statistical validity)'}
          </span>

          <button
            className={`${styles.detectBtn} ${loading ? styles.loading : ''}`}
            onClick={handleDetect}
            disabled={loading}
          >
            {loading ? (
              <><span className={styles.spinner} /> Analyzing Linguistic Entropy...</>
            ) : (
              <><ScanSearch size={16} /> Run Antigravity AI Detection</>
            )}
          </button>
        </div>
      </div>

      {/* Loading Animation */}
      {loading && !result && (
        <div className={styles.loadingCard}>
          <div className={styles.scanLine} />
          <div className={styles.loadingContent}>
            <span className={styles.spinner} />
            <p>Scanning token predictability distributions, sentence variance (Burstiness), and vocabulary entropy (Perplexity)...</p>
          </div>
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className={`${styles.resultsGrid} fade-up`}>
          {/* Main Score & Donut Card */}
          <div className={styles.scoreCard} style={{ '--risk-color': riskColor } as React.CSSProperties}>
            <div className={styles.scoreLeft}>
              <div
                className={styles.riskBadge}
                style={{ background: riskColor + '1a', border: `1px solid ${riskColor}55`, color: riskColor }}
              >
                <RiskIcon size={14} /> {riskLabel}
              </div>
              <div className={styles.bigScore}>{aiPct}%</div>
              <div className={styles.bigLabel}>Estimated AI Probability</div>
              <div className={styles.confidence}>Confidence Level: <strong>{result.confidence}</strong></div>
            </div>

            <div className={styles.scoreRight}>
              <div className={styles.donutWrapper}>
                <svg viewBox="0 0 120 120" className={styles.donut}>
                  <circle cx="60" cy="60" r="48" fill="none" strokeWidth="12" stroke="rgba(255,255,255,0.06)" />
                  {/* Human Arc */}
                  <circle
                    cx="60" cy="60" r="48" fill="none" strokeWidth="12"
                    stroke="var(--accent3)"
                    strokeDasharray={`${(humanPct / 100) * 301} 301`}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                  {/* AI Arc */}
                  <circle
                    cx="60" cy="60" r="48" fill="none" strokeWidth="12"
                    stroke={riskColor}
                    strokeDasharray={`${(aiPct / 100) * 301} 301`}
                    strokeLinecap="round"
                    transform={`rotate(${(humanPct / 100) * 360 - 90} 60 60)`}
                    style={{ opacity: aiPct > 0 ? 1 : 0 }}
                  />
                  <text x="60" y="55" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="800">{aiPct}%</text>
                  <text x="60" y="73" textAnchor="middle" fill="var(--text-muted)" fontSize="9">AI PROB</text>
                </svg>
              </div>

              <div className={styles.legend}>
                <span><span className={styles.dot} style={{ background: riskColor }} /> {aiPct}% AI</span>
                <span><span className={styles.dot} style={{ background: 'var(--accent3)' }} /> {humanPct}% Human</span>
              </div>
            </div>
          </div>

          {/* Metric Meters */}
          <div className={styles.metricsCol}>
            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricTitle}>Burstiness (Sentence Variance)</span>
                <span className={styles.metricScore}>{result.burstinessScore}/100</span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${result.burstinessScore}%`,
                    background: result.burstinessScore > 50 ? 'var(--accent3)' : 'var(--accent-red)'
                  }}
                />
              </div>
              <p className={styles.metricSub}>{result.burstinessLabel} — AI writes in monotonous sentence lengths; human text has high cadence peaks and valleys.</p>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricTitle}>Perplexity (Vocabulary Entropy)</span>
                <span className={styles.metricScore}>{result.perplexityScore}/100</span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${result.perplexityScore}%`,
                    background: result.perplexityScore > 50 ? 'var(--accent3)' : 'var(--accent-red)'
                  }}
                />
              </div>
              <p className={styles.metricSub}>{result.perplexityLabel} — Evaluates probability of word pairings. AI chooses statistically safe paths.</p>
            </div>
          </div>

          {/* Sentence Heatmap Interactive Viewer */}
          <div className={styles.heatmapCard}>
            <div className={styles.heatmapHeader}>
              <h4>Interactive Sentence Heatmap</h4>
              <span className={styles.heatmapLegend}>
                <span className={styles.legendItem}><span className={styles.greenDot} /> Human</span>
                <span className={styles.legendItem}><span className={styles.yellowDot} /> Moderate</span>
                <span className={styles.legendItem}><span className={styles.redDot} /> AI Flagged</span>
              </span>
            </div>

            <div className={styles.heatmapBody}>
              {result.sentenceHeatmap?.map((item, idx) => {
                const isSelected = selectedSentence?.sentence === item.sentence;
                return (
                  <span
                    key={idx}
                    className={`${styles.heatmapSentence} ${styles['risk-' + item.risk]} ${isSelected ? styles.selectedSentence : ''}`}
                    onClick={() => setSelectedSentence(item)}
                    title={`Click to inspect (${item.risk} risk)`}
                  >
                    {item.sentence}{' '}
                  </span>
                );
              })}
            </div>

            {selectedSentence && (
              <div className={styles.inspectSentenceBox}>
                <div className={styles.inspectHeader}>
                  <strong>Sentence Inspector:</strong>
                  <span className={`${styles.riskBadgeSmall} ${styles['badge-' + selectedSentence.risk]}`}>
                    {selectedSentence.risk.toUpperCase()} AI RISK
                  </span>
                </div>
                <p className={styles.inspectText}>"{selectedSentence.sentence}"</p>
                {selectedSentence.reason && (
                  <p className={styles.inspectReason}><strong>Trigger Reason:</strong> {selectedSentence.reason}</p>
                )}
              </div>
            )}
          </div>

          {/* Forensic Narrative Verdict */}
          <div className={styles.verdictCard}>
            <h4>Forensic Analysis Summary</h4>
            <p>{result.rawAnalysis}</p>
            {result.recommendations?.length > 0 && (
              <div className={styles.recSection}>
                <strong>Mitigation Recommendations:</strong>
                <ul>
                  {result.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
          </div>

          {/* Bridge: Send to Humanizer */}
          {aiPct > 20 && onSendToHumanizer && (
            <div className={styles.remediationCard}>
              <div className={styles.remediationText}>
                <strong>Score is elevated ({aiPct}% AI)?</strong>
                <p>Transfer this content into Subsystem 2 (AI Humanizer) to strip tropes and break repetitive cadence in 1 click.</p>
              </div>
              <button
                className={styles.remediateBtn}
                onClick={() => {
                  onSendToHumanizer(input);
                  toast.success('Transferred text to AI Humanizer!');
                }}
              >
                <Send size={14} /> Humanize This Content Now
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
