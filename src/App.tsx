import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import {
  FileText, Key, Zap, CheckCircle2,
  Sparkles, LogOut, ChevronDown, Shield,
  Globe, ArrowRight, Cpu, BookOpen, Sun, Moon
} from 'lucide-react';
import { useApiKey } from './useApiKey';
import { useAuth } from './useAuth';
import AuthGate from './AuthGate';
import MultiAiModal from './MultiAiModal';
import { getActiveProvider, AI_PROVIDERS, type AIProvider } from './aiEngine';
import ResumeBuilder from './ResumeBuilder';
import styles from './App.module.css';

export default function App() {
  const { apiKey } = useApiKey();
  const [activeProvider, setActiveProviderState] = useState<AIProvider>(() => getActiveProvider());
  const {
    user,
    isAuthenticated,
    loginWithDemo,
    loginWithCredentials,
    registerUser,
    logout,
    addSavedResume,
  } = useAuth();

  // Theme state: default to 'light' as requested ("make the theme light like text in dark and background as light but provide mode for light and dark mode")
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('resumeai_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('resumeai_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  };

  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [templatesTrigger, setTemplatesTrigger] = useState(0);

  // Auth Modal State (Pop-up triggered when visitor clicks an action or clicks Sign In/Register)
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authActionMessage, setAuthActionMessage] = useState<string | undefined>(undefined);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  /**
   * Protected Action Gate:
   * Allows visitors to look, browse, type, and experiment freely.
   * Prompts the registration pop-up ONLY when clicking final generate / save actions.
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

  const handleOpenTemplates = () => {
    setTemplatesTrigger(prev => prev + 1);
  };

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

      {/* ── REGISTRATION / SIGN IN POP-UP MODAL (100% FREE ACCESS) ── */}
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

      {/* ── Multi-AI Engine Configuration Modal ── */}
      {showKeyModal && (
        <MultiAiModal
          isOpen={showKeyModal}
          onClose={() => setShowKeyModal(false)}
          onProviderChanged={(prov) => {
            setActiveProviderState(prov);
          }}
        />
      )}

      {/* ── Modern Header ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          {/* Brand Logo with Custom Emblem & Name */}
          <div className={styles.logo} style={{ cursor: 'pointer' }}>
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
                <span className={styles.proTag}>100% FREE</span>
              </div>
              <div className={styles.logoSub}>Free ATS-Friendly Resume Builder · Unrejectable Templates</div>
            </div>
          </div>

          {/* Quick Header Navigation for Templates & Engine */}
          <div className={styles.headerActions}>
            {/* Theme Toggle: Light Mode & Dark Mode */}
            <button
              className={styles.themeToggleBtn}
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <>
                  <Moon size={14} className={styles.themeIconMoon} />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun size={14} className={styles.themeIconSun} />
                  <span>Light Mode</span>
                </>
              )}
            </button>

            {/* Direct Templates Gallery Trigger */}
            <button
              className={styles.templateHeaderBtn}
              onClick={handleOpenTemplates}
              title="Open Battle-Tested & Unrejectable ATS Templates (Harvard, Silicon Valley, Goldman Sachs)"
            >
              <BookOpen size={14} />
              <span>🏆 Unrejectable Templates (12)</span>
            </button>

            {/* Multi-AI Engine Selector Button */}
            <button
              className={styles.engineSelectBtn}
              onClick={() => setShowKeyModal(true)}
              title="Configure AI Engine (Claude 3.5, OpenAI GPT-4o, Groq Llama 3.3, Gemini)"
            >
              <Cpu size={14} className={styles.engineIcon} />
              <span className={styles.engineLabel}>
                {AI_PROVIDERS[activeProvider]?.icon || '🧠'} {AI_PROVIDERS[activeProvider]?.name || 'Anthropic Claude'}
              </span>
              <ChevronDown size={12} className={styles.engineChevron} />
            </button>

            {/* Authenticated User Status OR Guest Sign In Button */}
            {isAuthenticated && user ? (
              <>
                <div className={styles.freeBadge}>
                  <Sparkles size={13} className={styles.freeBadgeIcon} />
                  <span>Free Full Access</span>
                </div>

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
                            {user.country}
                          </span>
                        </div>
                        <span className={styles.tierPill}>100% Free All-Access</span>
                      </div>

                      <div className={styles.userDropdownLinks}>
                        <button onClick={() => { setShowKeyModal(true); setShowUserMenu(false); }}>
                          <Key size={14} /> AI Settings & Keys
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
              <button
                className={styles.signInBtn}
                onClick={() => {
                  setAuthActionMessage('Get Free Lifetime All-Access');
                  setShowAuthModal(true);
                }}
              >
                <Sparkles size={13} />
                <span>Free Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── ATS Resume Studio Hero Banner ── */}
      <div className={styles.heroBanner}>
        <div className={styles.heroBannerInner}>
          <div className={styles.heroBadge}>
            <FileText size={13} /> 100% Free · ACR Metrics Standard · Zero Paywall
          </div>
          <h1 className={styles.heroTitle}>Free ATS-Friendly Resume Studio</h1>
          <p className={styles.heroDesc}>
            Build battle-tested, unrejectable resumes guaranteed to pass Workday, Taleo, Greenhouse, and Lever ATS screeners with 99%+ parse rates. Tailor your background to any target job description or load proven Ivy League & Silicon Valley templates with 1 click.
          </p>

          {/* Feature pills row */}
          <div className={styles.heroPillsRow}>
            <div className={styles.heroPillItem}>
              <span className={styles.heroPillDot} />
              <span>Offering: <strong>100% Free Lifetime Services</strong></span>
            </div>
            <div className={styles.heroPillItem}>
              <Shield size={12} style={{ color: 'var(--accent3)' }} />
              <span>ATS Standard: <strong>ACR Metrics Standard (99%+ Pass)</strong></span>
            </div>
            <div className={styles.heroPillItem}>
              <BookOpen size={12} style={{ color: 'var(--accent2)' }} />
              <span>Templates: <strong>12 Unrejectable Formats</strong></span>
            </div>
            <div className={styles.heroPillItem}>
              <Globe size={12} style={{ color: 'var(--accent-cyan)' }} />
              <span>Global Support: <strong>All Countries Supported</strong></span>
            </div>
          </div>
        </div>
        <div className={styles.heroBg} />
      </div>

      {/* ── Main Application Workspace (Exclusively ATS Resume Builder) ── */}
      <main className={styles.main}>
        {/* Active Session Notification */}
        {isAuthenticated && user ? (
          <div className={styles.activeBanner}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} />
              <span>
                <strong>Client Session Active:</strong> Logged in as <strong>{user.name}</strong> ({user.persona}) · Region: <strong>{user.country}</strong> · 100% Free All-Access Active.
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.guestBanner}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Sparkles size={16} style={{ color: 'var(--accent2)' }} />
              <span>
                <strong>Interactive Preview Mode:</strong> All services are 100% free. Explore the unrejectable templates, type details, or parse documents — you will be prompted to create your free account only upon clicking <strong>Generate</strong>.
              </span>
            </div>
            <button
              className={styles.guestBannerBtn}
              onClick={() => {
                setAuthActionMessage('Get Free Lifetime All-Access');
                setShowAuthModal(true);
              }}
            >
              Free Register / Sign In <ArrowRight size={13} />
            </button>
          </div>
        )}

        <div className={styles.contentCard}>
          <ResumeBuilder
            apiKey={apiKey}
            onSaveResume={(title, role, markdown, score) =>
              addSavedResume({ title, targetRole: role, markdown, atsScore: score })
            }
            onRequireAuth={requireAuth}
            openTemplatesTrigger={templatesTrigger}
          />
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLeft}>
            <span>Built with <Zap size={12} style={{ color: 'var(--accent2)', verticalAlign: 'middle' }} /> AI Engine · <strong>ResumeAI Platform</strong></span>
            <span className={styles.footerModel}>100% Free ATS Resume Studio</span>
          </div>

          <div className={styles.footerLinks}>
            <button onClick={handleOpenTemplates}>Unrejectable Templates</button>
            <span>•</span>
            <button onClick={() => setShowKeyModal(true)}>AI Settings</button>
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
