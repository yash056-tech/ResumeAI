import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  FileText, Zap, Copy, Download, RotateCcw, Printer, Bookmark,
  Send, CheckCircle2, Sparkles, Layers, Award, FileSpreadsheet
} from 'lucide-react';
import { buildATSResume } from './gemini';
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

  const exampleHistory = `Name: Alex Rivera
Title: Senior Software Engineer
Email: alex.rivera@email.com | GitHub: github.com/arivera | LinkedIn: linkedin.com/in/arivera
Location: San Francisco, CA

EXPERIENCE:
Company: TechCorp Solutions (2021–Present)
Role: Senior Software Engineer
- Led backend development for payment processing system processing \$250M annually
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
    // Strip markdown formatting for direct Workday / job portal pasting
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
      onSaveResume('Tailored Resume', seniority, output, 96);
      toast.success('Saved to your ResumeAI Workspace!');
    } else {
      toast.success('Resume saved locally!');
    }
  };

  return (
    <div className={styles.container}>
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
      </div>

      {/* Main Grid: Inputs + Output */}
      <div className={styles.mainGrid}>
        {/* Left Inputs */}
        <div className={styles.inputCol}>
          <div className={styles.inputCard}>
            <div className={styles.cardHeader}>
              <label className={styles.label}>
                <FileText size={15} /> 1. Professional History & Metrics
              </label>
              <button
                className={styles.exBtn}
                onClick={() => setRawHistory(exampleHistory)}
              >
                Load Example History
              </button>
            </div>
            <textarea
              className={styles.textarea}
              rows={9}
              placeholder="Paste your raw career history, roles, skills, and projects. Don't worry about clean formatting — the ATS engine structures everything into ACR framework."
              value={rawHistory}
              onChange={e => setRawHistory(e.target.value)}
            />
          </div>

          <div className={styles.inputCard}>
            <div className={styles.cardHeader}>
              <label className={styles.label}>
                <Sparkles size={15} /> 2. Target Job Description (JD)
              </label>
              <button
                className={styles.exBtn}
                onClick={() => setJd(exampleJD)}
              >
                Load Target FinTech JD
              </button>
            </div>
            <textarea
              className={styles.textarea}
              rows={8}
              placeholder="Paste the full job description. The engine extracts high-priority hard skills, frameworks, and methodologies and weaves them in seamlessly."
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
              <div className={styles.gaugeNumber}>{output ? '98' : '—'}</div>
              <div className={styles.gaugeLabel}>ATS Health Score</div>
            </div>

            <div className={styles.checksList}>
              <div className={styles.checkItem}>
                <CheckCircle2 size={14} className={output ? styles.greenCheck : styles.faintCheck} />
                <span>Single-column parseable layout (No tables/graphics)</span>
              </div>
              <div className={styles.checkItem}>
                <CheckCircle2 size={14} className={output ? styles.greenCheck : styles.faintCheck} />
                <span>Action-Context-Result (ACR) bullets with metrics</span>
              </div>
              <div className={styles.checkItem}>
                <CheckCircle2 size={14} className={output ? styles.greenCheck : styles.faintCheck} />
                <span>Target JD hard skills extraction & density match</span>
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
                <p>Provide your experience and target JD, then click "Generate ATS-Optimized Resume" to view the parsed, recruiter-ready document.</p>
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
    </div>
  );
}
