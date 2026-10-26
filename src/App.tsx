import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import {
  FileText, Wand2, ScanSearch, Key, Zap, CheckCircle2,
  Sparkles, LogOut, ChevronDown, Award, Shield,
  Globe, ArrowRight
} from 'lucide-react';
import { useApiKey } from './useApiKey';
import { useAuth } from './useAuth';
import AuthGate from './AuthGate';
import ApiKeyModal from './ApiKeyModal';
import PricingModal from './PricingModal';
import ResumeBuilder from './ResumeBuilder';
import Humanizer from './Humanizer';
import Detector from './Detector';
import styles from './App.module.css';

type Tab = 'resume' | 'humanizer' | 'detector';

const TABS = [
  {
    id: 'resume' as Tab,
    icon: FileText,
    label: 'ATS Resume Studio',
    badge: 'Subsystem 1',
    color: '#6378ff',
    desc: 'Transform raw career history into a keyword-optimized, parseable, ACR-structured resume tailored to your target JD.',
    highlight: '98.4% ATS Compatibility',
  },
  {
    id: 'humanizer' as Tab,
    icon: Wand2,
    label: 'Enterprise AI Humanizer',
    badge: 'Subsystem 2',
    color: '#a78bfa',
    desc: 'Strip robotic phrasing, vary sentence rhythm, and restore authentic human voice while preserving technical metrics.',
    highlight: 'Zero AI Hallucination',
  },
  {
    id: 'detector' as Tab,
    icon: ScanSearch,
    label: 'AI Content Detector',
    badge: 'Subsystem 3',
    color: '#f59e0b',
    desc: 'Antigravity forensic detection engine scoring burstiness, perplexity, and linguistic heuristics in any text.',
    highlight: 'Sentence-by-Sentence Audit',
  },
];

export default function App() {
  const { apiKey, setApiKey, hasKey } = useApiKey();
  const {
    user,
    isAuthenticated,
    loginWithDemo,
    loginWithCredentials,
    registerUser,
    logout,
    upgradeTier,
    addSavedResume,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>('resume');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Auth Modal State (Pop-up triggered when visitor clicks an action or header button)
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authActionMessage, setAuthActionMessage] = useState<string | undefined>(undefined);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Cross-subsystem transfer states
  const [humanizerInput, setHumanizerInput] = useState('');
  const [detectorInput, setDetectorInput] = useState('');

  const handleKeySave = (key: string) => {
    setApiKey(key);
    setShowKeyModal(false);
  };

  const handleSendToHumanizer = (text: string) => {
    setHumanizerInput(text);
    setActiveTab('humanizer');
  };

  const handleSendToDetector = (text: string) => {
    setDetectorInput(text);
    setActiveTab('detector');
  };

  /**
   * Protected Action Gate:
   * Allows visitors to look, browse, type, and experiment freely.
   * Prompts the registration pop-up ONLY when clicking final generate / save / analyze actions.
   */
  const requireAuth = (callback: () => void, actionName?: string): boolean => {
    if (!isAuthenticated || !user) {
      setPendingAction(() => callback);
      setAuthActionMessage(actionName);
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (pendingAction) {
      const act = pendingAction;
      setPendingAction(null);
      setTimeout(() => act(), 150);
    }
  };

  const activeTabInfo = TABS.find(t => t.id === activeTab)!;
  const ActiveIcon = activeTabInfo.icon;

  return (
    <div className={styles.app}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg3)',
            color: 'var(--text)',
            border: '1px solid var(--border-hover)',
            borderRadius: '10px'
          },
          success: { iconTheme: { primary: 'var(--accent3)', secondary: 'var(--bg3)' } },
          error: { iconTheme: { primary: 'var(--accent-red)', secondary: 'var(--bg3)' } },
        }}
      />

      {/* ── REGISTRATION / SIGN IN POP-UP MODAL ── */}
      {/* Pops up only when user clicks an action or clicks Sign In/Register */}
      {showAuthModal && (
        <AuthGate
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          actionMessage={authActionMessage}
          onRegister={(name, email, persona, country, tier) => {
            registerUser(name, email, persona, country, tier);
            handleAuthSuccess();
          }}
          onLogin={(email) => {
            loginWithCredentials(email);
            handleAuthSuccess();
          }}
          onLoginDemo={(demoUser) => {
            loginWithDemo(demoUser);
            handleAuthSuccess();
          }}
        />
      )}

      {/* ── API Key Configuration Modal ── */}
      {showKeyModal && (
        <ApiKeyModal onSave={handleKeySave} currentKey={apiKey} />
      )}

      {/* ── Pricing Matrix Modal ── */}
      {showPricingModal && (
        <PricingModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
          currentTier={user?.tier || 'Free Starter'}
          userCountry={user?.country || 'India'}
          userPersona={user?.persona || 'Working Professional'}
          onUpgrade={upgradeTier}
        />
      )}

      {/* ── Modern Commercial Header ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          {/* Brand Logo with Custom Emblem & Name */}
          <div className={styles.logo} onClick={() => setActiveTab('resume')} style={{ cursor: 'pointer' }}>
            <div className={styles.logoIcon}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L3 8.5V17C3 24.2 8.6 30.8 16 32C23.4 30.8 29 24.2 29 17V8.5L16 2Z" fill="url(#tf-logo-grad)" opacity="0.95" />
                <path d="M16 6.5L7 11.5V17C7 22.1 10.8 26.8 16 27.8C21.2 26.8 25 22.1 25 17V11.5L16 6.5Z" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 16.5L15 19.5L20.5 13.5" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="tf-logo-grad" x1="3" y1="2" x2="29" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6378ff" />
                    <stop offset="0.5" stopColor="#8b5cf6" />
                    <stop offset="1" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <div className={styles.logoTitleRow}>
                <span className={styles.logoName}>ResumeAI</span>
                <span className={styles.proTag}>PRO</span>
              </div>
              <div className={styles.logoSub}>ATS Resume · AI Humanizer · Content Detector</div>
            </div>
          </div>

          {/* Navigation Tabs (Strictly 3 Core Subsystems) */}
          <nav className={styles.nav}>
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`${styles.navBtn} ${activeTab === tab.id ? styles.navActive : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ '--tab-color': tab.color } as React.CSSProperties}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Commercial Header Actions */}
          <div className={styles.headerActions}>
            {/* View Localized Plans */}
            <button
              className={styles.viewPlansBtn}
              onClick={() => setShowPricingModal(true)}
              title="View Localized Pricing & Currency Plans"
            >
              <Award size={13} style={{ color: 'var(--accent2)' }} />
              <span>Plans & Pricing</span>
            </button>

            {/* API Key Status Button */}
            <button
              className={styles.keyBtn}
              onClick={() => setShowKeyModal(true)}
              title="Gemini API Key Settings"
            >
              <Key size={14} />
              {hasKey ? <span className={styles.keyDot} /> : <span>Key</span>}
            </button>

            {/* Authenticated User Status OR Guest Sign In Button */}
            {isAuthenticated && user ? (
              <>
                {/* Credits Meter */}
                <button
                  className={styles.creditsBtn}
                  onClick={() => setShowPricingModal(true)}
                  title="AI Usage Credits"
                >
                  <Zap size={13} className={styles.zapIcon} />
                  <span>{user.creditsRemaining}/{user.maxCredits} Credits</span>
                </button>

                {/* Plan Badge / Upgrade Button */}
                <button
                  className={styles.upgradeBtn}
                  onClick={() => setShowPricingModal(true)}
                >
                  <Sparkles size={13} />
                  <span>{user.tier}</span>
                </button>

                {/* User Profile Hub */}
                <div className={styles.userProfileWrap}>
                  <button
                    className={styles.avatarBtn}
                    onClick={() => setShowUserMenu(m => !m)}
                  >
                    <img src={user.avatar} alt={user.name} className={styles.avatarImg} />
                    <ChevronDown size={14} className={styles.caret} />
                  </button>

                  {showUserMenu && (
                    <div className={styles.userDropdown}>
                      <div className={styles.userDropdownHeader}>
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                        <div className={styles.userMetaBadges}>
                          <span className={styles.metaPersona}>{user.persona}</span>
                          <span className={styles.metaCountry}>
                            {user.country} ({user.currencySymbol} {user.currency})
                          </span>
                        </div>
                        <span className={styles.tierPill}>{user.tier}</span>
                      </div>

                      <div className={styles.userDropdownLinks}>
                        <button onClick={() => { setShowPricingModal(true); setShowUserMenu(false); }}>
                          <Award size={14} /> Localized Plans ({user.currency})
                        </button>
                        <button onClick={() => { setShowKeyModal(true); setShowUserMenu(false); }}>
                          <Key size={14} /> Gemini API Key
                        </button>
                        <button className={styles.logoutBtn} onClick={() => { logout(); setShowUserMenu(false); }}>
                          <LogOut size={14} /> Sign Out (Switch User)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* High-Converting Guest CTA to Sign In or Register */
              <button
                className={styles.signInBtn}
                onClick={() => {
                  setAuthActionMessage('Get Started with ResumeAI');
                  setShowAuthModal(true);
                }}
              >
                <Sparkles size={13} />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Subsystem Hero Banner (Polished & Attractive) ── */}
      <div className={styles.heroBanner} style={{ '--tab-color': activeTabInfo.color } as React.CSSProperties}>
        <div className={styles.heroBannerInner}>
          <div className={styles.heroBadge}>
            <ActiveIcon size={13} /> {activeTabInfo.badge} · {activeTabInfo.highlight}
          </div>
          <h1 className={styles.heroTitle}>{activeTabInfo.label}</h1>
          <p className={styles.heroDesc}>{activeTabInfo.desc}</p>

          {/* Attractive feature pills row */}
          <div className={styles.heroPillsRow}>
            <div className={styles.heroPillItem}>
              <span className={styles.heroPillDot} />
              <span>Engine: <strong>Gemini 3.5 Flash Turbo</strong></span>
            </div>
            <div className={styles.heroPillItem}>
              <Shield size={12} style={{ color: 'var(--accent3)' }} />
              <span>ATS Compliance: <strong>ACR Metrics Standard</strong></span>
            </div>
            <div className={styles.heroPillItem}>
              <Globe size={12} style={{ color: 'var(--accent2)' }} />
              <span>Multi-Currency: <strong>8+ Regional Currencies & UPI</strong></span>
            </div>
          </div>
        </div>
        <div className={styles.heroBg} />
      </div>

      {/* ── Mobile Horizontal Scroll Tabs ── */}
      <div className={styles.mobileTabs}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`${styles.mobilePill} ${activeTab === tab.id ? styles.mobilePillActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ '--tab-color': tab.color } as React.CSSProperties}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Main Application Workspace ── */}
      <main className={styles.main}>
        {/* Active Session Notification */}
        {isAuthenticated && user ? (
          <div className={styles.activeBanner}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} />
              <span>
                <strong>Client Session Active:</strong> Logged in as <strong>{user.name}</strong> ({user.persona}) · Region: <strong>{user.country} ({user.currency})</strong> · Model: <code>gemini-3.5-flash-lite</code>.
              </span>
            </div>
            <button className={styles.bannerUpgrade} onClick={() => setShowPricingModal(true)}>
              Manage Plans ({user.currency}) →
            </button>
          </div>
        ) : (
          <div className={styles.guestBanner}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Sparkles size={16} style={{ color: 'var(--accent2)' }} />
              <span>
                <strong>Interactive Preview Mode:</strong> Explore the three subsystems below. Fill in your details or test templates — you will be prompted to create your free account only upon clicking <strong>Generate</strong>.
              </span>
            </div>
            <button
              className={styles.guestBannerBtn}
              onClick={() => {
                setAuthActionMessage('Unlock Unlimited AI Generations');
                setShowAuthModal(true);
              }}
            >
              Register / Sign In <ArrowRight size={13} />
            </button>
          </div>
        )}

        <div className={styles.contentCard}>
          {activeTab === 'resume' && (
            <ResumeBuilder
              apiKey={apiKey}
              onSaveResume={(title, role, markdown, score) =>
                addSavedResume({ title, targetRole: role, markdown, atsScore: score })
              }
              onSendToHumanizer={handleSendToHumanizer}
              onRequireAuth={requireAuth}
            />
          )}

          {activeTab === 'humanizer' && (
            <Humanizer
              apiKey={apiKey}
              initialText={humanizerInput}
              onSendToDetector={handleSendToDetector}
              onRequireAuth={requireAuth}
            />
          )}

          {activeTab === 'detector' && (
            <Detector
              apiKey={apiKey}
              initialText={detectorInput}
              onSendToHumanizer={handleSendToHumanizer}
              onRequireAuth={requireAuth}
            />
          )}
        </div>
      </main>

      {/* ── Commercial Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLeft}>
            <span>Built with <Zap size={12} style={{ color: 'var(--accent2)', verticalAlign: 'middle' }} /> Gemini API · <strong>ResumeAI Platform</strong></span>
            <span className={styles.footerModel}>gemini-3.5-flash-lite</span>
          </div>

          <div className={styles.footerLinks}>
            <button onClick={() => setShowPricingModal(true)}>
              Pricing ({user?.currency || 'Global'})
            </button>
            <span>•</span>
            <button onClick={() => setShowKeyModal(true)}>API Gateway</button>
            <span>•</span>
            {isAuthenticated ? (
              <button onClick={logout}>Sign Out</button>
            ) : (
              <button onClick={() => { setAuthActionMessage('Sign In to Account'); setShowAuthModal(true); }}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
