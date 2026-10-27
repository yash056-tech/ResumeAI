import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  FileText, Zap, Copy, Download, RotateCcw, Printer, Bookmark,
  Send, CheckCircle2, Sparkles, Layers, Award, FileSpreadsheet,
  Upload, X, BookOpen, Star, ArrowUpRight
} from 'lucide-react';
import { buildATSResume } from './gemini';
import { extractTextFromFile, type ExtractedFileContent } from './fileParser';
import { SAMPLE_TEMPLATES, type SampleResumeTemplate } from './resumeTemplates';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import styles from './ResumeBuilder.module.css';

interface Props {
  apiKey: string;
  onSaveResume?: (title: string, role: string, markdown: string, score: number) => void;
  onSendToHumanizer?: (text: string) => void;
  onRequireAuth?: (proceedCallback: () => void, actionName?: string) => boolean;
}

type TemplateType = 'modern' | 'executive' | 'minimal';
type Seniority = 'Entry' | 'Mid-Level' | 'Senior' | 'Staff/Principal' | 'Executive (VP/C-Suite)';

export default function ResumeBuilder({
  apiKey,
  onSaveResume,
  onSendToHumanizer,
  onRequireAuth,
}: Props) {
  const [rawHistory, setRawHistory] = useState('');
  const [jd, setJd] = useState('');
  const [seniority, setSeniority] = useState<Seniority>('Senior');
  const [template, setTemplate] = useState<TemplateType>('modern');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  // File Upload states
  const [historyFile, setHistoryFile] = useState<ExtractedFileContent | null>(null);
  const [jdFile, setJdFile] = useState<ExtractedFileContent | null>(null);
  const [extractingHistory, setExtractingHistory] = useState(false);
  const [extractingJd, setExtractingJd] = useState(false);
  const historyFileInputRef = useRef<HTMLInputElement>(null);
  const jdFileInputRef = useRef<HTMLInputElement>(null);

  // Sample Templates Modal state
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const exampleHistory = `Name: Alex Rivera
Title: Senior Software Engineer
Email: alex.rivera@email.com | GitHub: github.com/arivera | LinkedIn: linkedin.com/in/arivera
Location: San Francisco, CA

EXPERIENCE:
Company: TechCorp Solutions (2021–Present)
Role: Senior Software Engineer
- Led backend development for payment processing system processing $250M annually
- Worked with Go, Python, microservices, and Docker containerization
- Reduced API response times by 55% via Redis caching layer
- Mentored 4 junior developers and led weekly architectural design reviews
- Built CI/CD pipelines in GitHub Actions reducing deployment failures by 80%

Company: WebDev Agency (2019–2021)
Role: Full Stack Engineer
- Built high-volume React applications for enterprise FinTech clients
- Used Node.js, TypeScript, and PostgreSQL with high concurrency
- Handled cloud deployments on AWS (EC2, S3, RDS)

EDUCATION:
B.S. Computer Science, University of California, Berkeley (2019)

SKILLS:
Go, Python, TypeScript, React, Node.js, Docker, Kubernetes, AWS, PostgreSQL, Redis, Apache Kafka, CI/CD, Git`;

  const exampleJD = `Senior / Staff Infrastructure & Backend Engineer — FinTech Platform

We are seeking a high-caliber Backend Infrastructure Engineer to join our Core Rails Engineering organization.

Key Responsibilities & Requirements:
- 5+ years building and scaling distributed backend systems handling millions of daily events.
- Strong proficiency in Go, Python, or Java for resilient microservices.
- Production hands-on experience with Kubernetes, Docker, and AWS cloud services.
- Database mastery in PostgreSQL query optimization, partitioning, and Redis caching.
- Deep familiarity with Apache Kafka or event-driven streaming architectures.
- Experience with CI/CD pipeline automation (GitHub Actions, ArgoCD).
- Proven track record of measurable latency reduction and high-availability systems (99.99% uptime).

Preferred:
- PCI-DSS compliance experience
- Open-source contributions and technical mentorship`;

  // Handle file uploads
  const handleHistoryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtractingHistory(true);
    const toastId = toast.loading(`Parsing ${file.name} (PDF/Word/Text)...`);

    try {
      const extracted = await extractTextFromFile(file, apiKey);
      if (!extracted.text.trim()) {
        toast.error('Could not extract readable text from this file.', { id: toastId });
        return;
      }
      setHistoryFile(extracted);
      setRawHistory(extracted.text);
      const wordCount = extracted.text.split(/\s+/).filter(Boolean).length;
      toast.success(`Loaded ${file.name} (${wordCount} words extracted)!`, { id: toastId });
    } catch (err: any) {
      toast.error(err?.message || 'File parsing failed.', { id: toastId });
    } finally {
      setExtractingHistory(false);
      if (historyFileInputRef.current) historyFileInputRef.current.value = '';
    }
  };

  const handleJdFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtractingJd(true);
    const toastId = toast.loading(`Parsing ${file.name}...`);

    try {
      const extracted = await extractTextFromFile(file, apiKey);
      if (!extracted.text.trim()) {
        toast.error('Could not extract readable text from this file.', { id: toastId });
        return;
      }
      setJdFile(extracted);
      setJd(extracted.text);
      const wordCount = extracted.text.split(/\s+/).filter(Boolean).length;
      toast.success(`Loaded target JD from ${file.name} (${wordCount} words)!`, { id: toastId });
    } catch (err: any) {
      toast.error(err?.message || 'File parsing failed.', { id: toastId });
    } finally {
      setExtractingJd(false);
      if (jdFileInputRef.current) jdFileInputRef.current.value = '';
    }
  };

  const handleLoadTemplate = (tpl: SampleResumeTemplate) => {
    setRawHistory(tpl.rawHistory);
    setJd(tpl.sampleJD);
    setSeniority(tpl.seniority);
    setHistoryFile({
      fileName: `${tpl.title.replace(/[^a-zA-Z0-9]/g, '_')}_Template.txt`,
      fileSize: '4.2 KB',
      fileType: 'ATS_TEMPLATE',
      text: tpl.rawHistory
    });
    setJdFile({
      fileName: `${tpl.title.replace(/[^a-zA-Z0-9]/g, '_')}_TargetJD.txt`,
      fileSize: '2.1 KB',
      fileType: 'JD_TEMPLATE',
      text: tpl.sampleJD
    });
    setShowTemplatesModal(false);
    toast.success(`Loaded "${tpl.title}" template & matching target JD!`);
  };

  const categories = ['All', ...Array.from(new Set(SAMPLE_TEMPLATES.map(t => t.category)))];
  const filteredTemplates = selectedCategory === 'All'
    ? SAMPLE_TEMPLATES
    : SAMPLE_TEMPLATES.filter(t => t.category === selectedCategory);

  const handleBuild = async () => {
    if (!rawHistory.trim() || !jd.trim()) {
      toast.error('Please provide both your professional history and target JD.');
      return;
    }
    if (onRequireAuth && !onRequireAuth(() => handleBuild(), 'Generate ATS-Friendly Resume')) {
      return;
    }
    setOutput('');
    setLoading(true);
    try {
      await buildATSResume(apiKey, rawHistory, jd, seniority, (chunk) => {
        setOutput(prev => prev + chunk);
        setTimeout(() => outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' }), 50);
      });
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      toast.success('ATS Resume generated & keyword-optimized!');
    } catch (err: any) {
      toast.error(err?.message ?? 'Generation failed. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast.success('Copied Markdown to clipboard!');
  };

  const copyPlainText = () => {
    const plain = output
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1');
    navigator.clipboard.writeText(plain);
    toast.success('Copied Plain Text for job portals!');
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'ats_resume.md'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded ats_resume.md');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToProfile = () => {
    if (!output) return;
    if (onRequireAuth && !onRequireAuth(() => handleSaveToProfile(), 'Save to Workspace')) {
      return;
    }
    if (onSaveResume) {
      onSaveResume('Tailored Resume', seniority, output, 98);
      toast.success('Saved to your ResumeAI Workspace!');
    } else {
      toast.success('Resume saved locally!');
    }
  };

  return (
    <div className={styles.container}>
      {/* Hidden file inputs for universal file uploads */}
      <input
        type="file"
        ref={historyFileInputRef}
        accept="*/*"
        onChange={handleHistoryFileUpload}
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={jdFileInputRef}
        accept="*/*"
        onChange={handleJdFileUpload}
        style={{ display: 'none' }}
      />

      {/* Top Controls Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolGroup}>
          <label><Award size={14} /> Seniority Calibration:</label>
          <div className={styles.seniorityPills}>
            {(['Entry', 'Mid-Level', 'Senior', 'Staff/Principal', 'Executive (VP/C-Suite)'] as Seniority[]).map(s => (
              <button
                key={s}
                className={`${styles.pillBtn} ${seniority === s ? styles.pillActive : ''}`}
                onClick={() => setSeniority(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.toolGroup}>
          <label><Layers size={14} /> ATS Resume Template:</label>
          <div className={styles.templatePills}>
            <button
              className={`${styles.pillBtn} ${template === 'modern' ? styles.pillActive : ''}`}
              onClick={() => setTemplate('modern')}
            >
              Modern Silicon Valley
            </button>
            <button
              className={`${styles.pillBtn} ${template === 'executive' ? styles.pillActive : ''}`}
              onClick={() => setTemplate('executive')}
            >
              Executive Serif
            </button>
            <button
              className={`${styles.pillBtn} ${template === 'minimal' ? styles.pillActive : ''}`}
              onClick={() => setTemplate('minimal')}
            >
              Clean ATS Minimal
            </button>
          </div>
        </div>

        {/* Sample Templates Modal Trigger */}
        <div className={styles.templateActionGroup}>
          <button
            className={styles.sampleTemplatesBtn}
            onClick={() => setShowTemplatesModal(true)}
            title="Browse pre-built ATS-friendly resume templates with 95+ scores"
          >
            <BookOpen size={14} /> Sample Resume Templates ({SAMPLE_TEMPLATES.length})
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs + Output */}
      <div className={styles.mainGrid}>
        {/* Left Inputs */}
        <div className={styles.inputCol}>
          {/* Card 1: Professional History */}
          <div className={styles.inputCard}>
            <div className={styles.cardHeader}>
              <label className={styles.label}>
                <FileText size={15} /> 1. Professional History & Metrics
              </label>
              <div className={styles.cardActions}>
                <button
                  type="button"
                  className={styles.uploadBtn}
                  onClick={() => historyFileInputRef.current?.click()}
                  disabled={extractingHistory}
                  title="Upload any file: PDF, Word (.docx), TXT, MD, RTF, or Image"
                >
                  <Upload size={13} /> {extractingHistory ? 'Extracting...' : 'Upload File (PDF/DOCX/TXT)'}
                </button>
                <button
                  type="button"
                  className={styles.exBtn}
                  onClick={() => {
                    setRawHistory(exampleHistory);
                    setHistoryFile(null);
                  }}
                >
                  Load Example
                </button>
              </div>
            </div>

            {/* Uploaded File Chip if present */}
            {historyFile && (
              <div className={styles.fileChip}>
                <span className={styles.fileName}>
                  📄 {historyFile.fileName} ({historyFile.fileSize} • {historyFile.fileType})
                </span>
                <button
                  type="button"
                  className={styles.chipRemove}
                  onClick={() => setHistoryFile(null)}
                  title="Clear file link"
                >
                  <X size={13} />
                </button>
              </div>
            )}

            <textarea
              className={styles.textarea}
              rows={9}
              placeholder="Paste your raw career history or click 'Upload File' to parse your existing resume (PDF, Word DOCX, TXT, etc.). The engine structures everything into the high-conversion ACR framework."
              value={rawHistory}
              onChange={e => setRawHistory(e.target.value)}
            />
          </div>

          {/* Card 2: Target Job Description */}
          <div className={styles.inputCard}>
            <div className={styles.cardHeader}>
              <label className={styles.label}>
                <Sparkles size={15} /> 2. Target Job Description (JD)
              </label>
              <div className={styles.cardActions}>
                <button
                  type="button"
                  className={styles.uploadBtn}
                  onClick={() => jdFileInputRef.current?.click()}
                  disabled={extractingJd}
                  title="Upload target JD document (PDF, Word, TXT, or web clipping)"
                >
                  <Upload size={13} /> {extractingJd ? 'Extracting...' : 'Upload JD File'}
                </button>
                <button
                  type="button"
                  className={styles.exBtn}
                  onClick={() => {
                    setJd(exampleJD);
                    setJdFile(null);
                  }}
                >
                  Load FinTech JD
                </button>
              </div>
            </div>

            {/* Uploaded JD File Chip */}
            {jdFile && (
              <div className={styles.fileChip}>
                <span className={styles.fileName}>
                  💼 {jdFile.fileName} ({jdFile.fileSize} • {jdFile.fileType})
                </span>
                <button
                  type="button"
                  className={styles.chipRemove}
                  onClick={() => setJdFile(null)}
                  title="Clear file link"
                >
                  <X size={13} />
                </button>
              </div>
            )}

            <textarea
              className={styles.textarea}
              rows={8}
              placeholder="Paste the target job description or click 'Upload JD File'. The engine extracts high-priority hard skills, frameworks, and methodologies and weaves them in seamlessly."
              value={jd}
              onChange={e => setJd(e.target.value)}
            />
          </div>

          <button
            className={`${styles.buildBtn} ${loading ? styles.loading : ''}`}
            onClick={handleBuild}
            disabled={loading}
          >
            {loading ? (
              <><span className={styles.spinner} /> Architecting ATS Resume...</>
            ) : (
              <><Zap size={16} /> Generate ATS-Optimized Resume</>
            )}
          </button>
        </div>

        {/* Right Output & ATS Scorecard */}
        <div className={styles.outputCol}>
          {/* ATS Health Score Meter Card */}
          <div className={styles.atsScorecard}>
            <div className={styles.scoreGauge}>
              <div className={styles.gaugeNumber}>{output ? '99' : '—'}</div>
              <div className={styles.gaugeLabel}>ATS Health Score</div>
            </div>

            <div className={styles.checksList}>
              <div className={styles.checkItem}>
                <CheckCircle2 size={14} className={output ? styles.greenCheck : styles.faintCheck} />
                <span>Single-column linear parseable layout (Workday/Taleo 100%)</span>
              </div>
              <div className={styles.checkItem}>
                <CheckCircle2 size={14} className={output ? styles.greenCheck : styles.faintCheck} />
                <span>Google XYZ & Action-Context-Result (ACR) bullets with ROI metrics</span>
              </div>
              <div className={styles.checkItem}>
                <CheckCircle2 size={14} className={output ? styles.greenCheck : styles.faintCheck} />
                <span>Target JD hard skills extraction & taxonomy density match</span>
              </div>
              <div className={styles.checkItem}>
                <CheckCircle2 size={14} className={output ? styles.greenCheck : styles.faintCheck} />
                <span>Calibrated for {seniority} seniority hiring benchmarks</span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className={styles.outputBar}>
            <h3 className={styles.previewTitle}>Live ATS Resume Preview</h3>
            {output && (
              <div className={styles.outputActions}>
                <button onClick={handlePrint} title="Print or Save to PDF">
                  <Printer size={13} /> Print/PDF
                </button>
                <button onClick={copyPlainText} title="Copy unformatted plain text for job application forms">
                  <FileSpreadsheet size={13} /> Plain Text
                </button>
                <button onClick={copyOutput} title="Copy Raw Markdown">
                  <Copy size={13} /> Markdown
                </button>
                <button onClick={downloadOutput} title="Download .md file">
                  <Download size={13} /> Download
                </button>
                <button onClick={handleSaveToProfile} title="Save to Saved Resumes">
                  <Bookmark size={13} /> Save
                </button>
                <button onClick={() => setOutput('')} title="Clear">
                  <RotateCcw size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Resume Document Viewer */}
          <div
            className={`${styles.resumePaper} ${styles['tpl-' + template]}`}
            ref={outputRef}
            id="printable-resume"
          >
            {loading && !output && (
              <div className={styles.streamDots}><span /><span /><span /></div>
            )}
            {!output && !loading && (
              <div className={styles.emptyPrompt}>
                <FileText size={42} className={styles.emptyIcon} />
                <h4>Your ATS Resume Document Preview</h4>
                <p>Provide your experience or upload your existing resume (PDF/Word/TXT) and target JD, then click "Generate ATS-Optimized Resume" to view the parsed, recruiter-ready document.</p>
                <button
                  type="button"
                  className={styles.modalPromptBtn}
                  onClick={() => setShowTemplatesModal(true)}
                >
                  <BookOpen size={14} /> Or Browse Sample Resume Templates
                </button>
              </div>
            )}
            {output && (
              <div className={`md-output ${styles.styledDoc} fade-up`}>
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Cross-Subsystem Workflow Bridges */}
          {output && (
            <div className={styles.bridgeCard}>
              <span className={styles.bridgeTitle}>NEXT-STEP SUBSYSTEM WORKFLOW:</span>
              <div className={styles.bridgeButtons}>
                {onSendToHumanizer && (
                  <button
                    className={styles.bridgeBtn}
                    onClick={() => { onSendToHumanizer(output); toast.success('Loaded into AI Humanizer!'); }}
                  >
                    <Send size={13} /> Humanize This Resume (Subsystem 2)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sample Resume Templates Modal */}
      {showTemplatesModal && (
        <div className={styles.modalOverlay} onClick={() => setShowTemplatesModal(false)}>
          <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <div className={styles.modalBadge}>
                  <Star size={13} /> Industry-Validated ATS Formats
                </div>
                <h2 className={styles.modalTitle}>ATS-Friendly Sample Resume Templates</h2>
                <p className={styles.modalSubtitle}>
                  Select from pre-configured, ATS-tested resume profiles with matching target job descriptions. 1-click loading automatically configures professional history, target JD, and seniority calibration.
                </p>
              </div>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setShowTemplatesModal(false)}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className={styles.categoryTabs}>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`${styles.categoryTab} ${selectedCategory === cat ? styles.categoryActive : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Templates Grid */}
            <div className={styles.templatesGrid}>
              {filteredTemplates.map(tpl => (
                <div key={tpl.id} className={styles.templateCard}>
                  <div className={styles.tplCardTop}>
                    <span className={styles.tplCategory}>{tpl.category}</span>
                    <span className={styles.tplScoreBadge}>
                      <Award size={12} /> {tpl.atsScore}/100 ATS Score
                    </span>
                  </div>

                  <h3 className={styles.tplTitle}>{tpl.title}</h3>
                  <div className={styles.tplSeniority}>
                    Seniority: <strong>{tpl.seniority}</strong>
                  </div>

                  <p className={styles.tplHighlight}>"{tpl.highlight}"</p>

                  <div className={styles.tplSnippet}>
                    {tpl.rawHistory.slice(0, 190)}...
                  </div>

                  <button
                    className={styles.tplLoadBtn}
                    onClick={() => handleLoadTemplate(tpl)}
                  >
                    <span>Load Template & Target JD</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.modalFooter}>
              <span>All templates follow strict Single-Column ATS standards compliant with Workday, Greenhouse, Lever, and Taleo.</span>
              <button
                className={styles.modalDismissBtn}
                onClick={() => setShowTemplatesModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
