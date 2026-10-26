import React, { useState } from 'react';
import {
  Mail, Lock, User, Globe, GraduationCap, Briefcase,
  Building2, Check, ArrowRight, ShieldCheck, Zap, Award,
  X, Sparkles
} from 'lucide-react';
import { DEMO_USERS, type UserPersona, type UserProfile } from './useAuth';
import { SUPPORTED_COUNTRIES, getPricingForCountry } from './currency';
import { notifyAdminOnRegistration } from './emailNotification';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import styles from './AuthGate.module.css';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  actionMessage?: string;
  onRegister: (
    name: string,
    email: string,
    persona: UserPersona,
    country: string,
    tier: 'Free Starter' | 'Pro Career' | 'Enterprise Talent'
  ) => void;
  onLogin: (email: string) => void;
  onLoginDemo: (user: UserProfile) => void;
}

export default function AuthGate({
  isOpen = true,
  onClose,
  actionMessage,
  onRegister,
  onLogin,
  onLoginDemo
}: Props) {
  const [tab, setTab] = useState<'register' | 'signin'>('register');
  const [regStep, setRegStep] = useState<'details' | 'plans'>('details');

  // Registration Form State (Order strictly per specification)
  // 1. Full Name
  // 2. Email
  // 3. Password
  // 4. Current Professional Status (Student, Working Professional, Enterprise)
  // 5. Resident of (Country)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [persona, setPersona] = useState<UserPersona>('Working Professional');
  const [country, setCountry] = useState('India');

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  if (!isOpen) return null;

  const pricing = getPricingForCountry(country);
  const isStudent = persona === 'Student';
  const effectiveProPrice = isStudent ? pricing.proStudent : pricing.proMonthly;

  // Handle Step 1 -> Step 2 validation
  const handleProceedToPlans = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!password.trim()) {
      toast.error('Please enter a password');
      return;
    }
    setRegStep('plans');
  };

  // Handle Plan selection in Step 2
  const handleSelectPlan = (tier: 'Free Starter' | 'Pro Career' | 'Enterprise Talent') => {
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    onRegister(name, email, persona, country, tier);

    // Automatically email registration details to ya09shu@gmail.com
    notifyAdminOnRegistration({
      name,
      email,
      persona,
      country,
      tier,
      currency: pricing.currency,
      price: tier === 'Free Starter'
        ? pricing.freePrice
        : (tier === 'Pro Career' ? effectiveProPrice : pricing.enterpriseMonthly),
      paymentMethod: pricing.paymentMethodDesc,
    });

    toast.success(`Welcome to ResumeAI, ${name}! (${tier})`);
    if (onClose) onClose();
  };

  // Handle Sign In submit
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail.trim()) {
      toast.error('Please enter your email');
      return;
    }
    onLogin(signInEmail);
    toast.success('Signed in successfully!');
    if (onClose) onClose();
  };

  return (
    <div className={styles.gateOverlay} onClick={onClose}>
      <div className={styles.gateCard} onClick={e => e.stopPropagation()}>
        {/* Optional Close Button for non-blocking browse experience */}
        {onClose && (
          <button className={styles.closeBtn} onClick={onClose} title="Close & Browse Website">
            <X size={17} />
          </button>
        )}

        {/* Brand Header */}
        <div className={styles.brandHeader}>
          <div className={styles.logoBadge}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L3 8.5V17C3 24.2 8.6 30.8 16 32C23.4 30.8 29 24.2 29 17V8.5L16 2Z" fill="url(#gate-logo-grad)" opacity="0.95" />
              <path d="M16 6.5L7 11.5V17C7 22.1 10.8 26.8 16 27.8C21.2 26.8 25 22.1 25 17V11.5L16 6.5Z" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 16.5L15 19.5L20.5 13.5" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="gate-logo-grad" x1="3" y1="2" x2="29" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6378ff" />
                  <stop offset="0.5" stopColor="#8b5cf6" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2>ResumeAI <span className={styles.proTag}>PRO</span></h2>
          <p className={styles.tagline}>
            ATS Resume Studio · Enterprise AI Humanizer · Forensic Content Detector
          </p>

          {/* Action Context Alert if triggered by clicking a button */}
          {actionMessage && (
            <div className={styles.actionAlert}>
              <Sparkles size={14} style={{ color: 'var(--accent3)' }} />
              <span>Create your free account or sign in to <strong>{actionMessage}</strong>.</span>
            </div>
          )}
        </div>

        {/* Tab Switcher */}
        <div className={styles.tabBar}>
          <button
            className={`${styles.tabBtn} ${tab === 'register' ? styles.tabActive : ''}`}
            onClick={() => { setTab('register'); setRegStep('details'); }}
          >
            New Client Registration
          </button>
          <button
            className={`${styles.tabBtn} ${tab === 'signin' ? styles.tabActive : ''}`}
            onClick={() => setTab('signin')}
          >
            Existing Client Sign In
          </button>
        </div>

        {/* ── REGISTRATION FLOW ── */}
        {tab === 'register' && (
          <div className={styles.regContainer}>
            {regStep === 'details' ? (
              <form onSubmit={handleProceedToPlans} className={styles.form}>
                <div className={styles.stepIndicator}>
                  <span className={styles.stepBadge}>Step 1 of 2</span>
                  <span>Tell us about yourself to calibrate your currency and workspace</span>
                </div>

                {/* 1. Full Name */}
                <div className={styles.field}>
                  <label>Full Name *</label>
                  <div className={styles.inputWrap}>
                    <User size={15} className={styles.icon} />
                    <input
                      type="text"
                      placeholder="e.g. Aditya Verma / Sarah Jenkins"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* 2. Email */}
                <div className={styles.field}>
                  <label>Email *</label>
                  <div className={styles.inputWrap}>
                    <Mail size={15} className={styles.icon} />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* 3. Password */}
                <div className={styles.field}>
                  <label>Password *</label>
                  <div className={styles.inputWrap}>
                    <Lock size={15} className={styles.icon} />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* 4. Current Professional Status */}
                <div className={styles.field}>
                  <label>Current Professional Status *</label>
                  <div className={styles.personaGrid}>
                    <button
                      type="button"
                      className={`${styles.personaBtn} ${persona === 'Student' ? styles.personaActive : ''}`}
                      onClick={() => setPersona('Student')}
                    >
                      <GraduationCap size={18} />
                      <div className={styles.personaInfo}>
                        <strong>🎓 Student / Fresher</strong>
                        <span>College grad or entry-level</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`${styles.personaBtn} ${persona === 'Working Professional' ? styles.personaActive : ''}`}
                      onClick={() => setPersona('Working Professional')}
                    >
                      <Briefcase size={18} />
                      <div className={styles.personaInfo}>
                        <strong>💼 Working Professional</strong>
                        <span>Mid to senior career switcher</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`${styles.personaBtn} ${persona === 'Enterprise' ? styles.personaActive : ''}`}
                      onClick={() => setPersona('Enterprise')}
                    >
                      <Building2 size={18} />
                      <div className={styles.personaInfo}>
                        <strong>🏢 Enterprise / Team</strong>
                        <span>Hiring lead or recruitment</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 5. Resident of */}
                <div className={styles.field}>
                  <label>Resident of *</label>
                  <div className={styles.selectWrap}>
                    <Globe size={15} className={styles.icon} />
                    <select
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      className={styles.selectInput}
                    >
                      {SUPPORTED_COUNTRIES.map(c => (
                        <option key={c.country} value={c.country}>
                          {c.flag} {c.country} — {c.symbol} ({c.currency})
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className={styles.countryNote}>
                    📍 Resident of: <strong>{pricing.flag} {pricing.country}</strong>. Plans & Pro subscription will be billed in <strong>{pricing.symbol} {pricing.currency}</strong> ({pricing.paymentMethodDesc}).
                  </span>
                </div>

                <button type="submit" className={styles.proceedBtn}>
                  Continue to Localized Pro Subscription ({pricing.currency}) <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              /* Step 2: Show Localized Pro Subscription in their currency */
              <div className={styles.planSelectionStep}>
                <div className={styles.stepHeader}>
                  <button className={styles.backLink} onClick={() => setRegStep('details')}>
                    ← Back to personal details
                  </button>
                  <div className={styles.stepBadge}>Step 2 of 2</div>
                  <h3>Select Your Workspace Plan in {pricing.currency} ({pricing.symbol})</h3>
                  <p className={styles.pricingSub}>
                    Calibrated for <strong>{name}</strong> ({persona}) in <strong>{pricing.country} {pricing.flag}</strong>
                  </p>
                </div>

                {/* Student Subsidy Banner */}
                {isStudent && (
                  <div className={styles.studentBanner}>
                    <GraduationCap size={18} />
                    <div>
                      <strong>🎓 Student & Fresher Subsidy Enabled!</strong>
                      <span>Special academic discount for {pricing.country}: Pro subscription discounted to <strong>{pricing.proStudent}/month</strong> (Normally {pricing.proMonthly}/mo).</span>
                    </div>
                  </div>
                )}

                {/* Pro Subscription Focus Grid */}
                <div className={styles.plansGrid}>
                  {/* Free Starter */}
                  <div className={styles.planCard}>
                    <div className={styles.planTierName}>Free Starter</div>
                    <div className={styles.planPriceRow}>
                      <span className={styles.priceNum}>{pricing.freePrice}</span>
                      <span className={styles.pricePeriod}>/forever</span>
                    </div>
                    <p className={styles.planDesc}>Ideal for testing out single resume creation.</p>

                    <button
                      className={styles.selectFreeBtn}
                      onClick={() => handleSelectPlan('Free Starter')}
                    >
                      Start Free Starter ({pricing.freePrice})
                    </button>

                    <div className={styles.features}>
                      <div className={styles.fItem}><Check size={13} className={styles.chk} /> 3 ATS Resume Builds/mo</div>
                      <div className={styles.fItem}><Check size={13} className={styles.chk} /> Standard Markdown Export</div>
                      <div className={styles.fItem}><Check size={13} className={styles.chk} /> Basic AI Humanizer</div>
                      <div className={styles.fItem}><Check size={13} className={styles.chk} /> Basic Content Scanner</div>
                    </div>
                  </div>

                  {/* Pro Subscription (Highlighting in Local Currency) */}
                  <div className={`${styles.planCard} ${styles.proCard}`}>
                    <div className={styles.popularBadge}>
                      <Award size={12} /> PRO SUBSCRIPTION ({pricing.country.toUpperCase()})
                    </div>
                    <div className={styles.planTierName}>Pro Career</div>
                    <div className={styles.planPriceRow}>
                      <span className={styles.priceNum}>{effectiveProPrice}</span>
                      <span className={styles.pricePeriod}>/month</span>
                    </div>
                    <p className={styles.planDesc}>
                      {pricing.isUPIAvailable
                        ? 'Full Indian PPP rate with Instant UPI (GPay, PhonePe, Paytm) + RuPay.'
                        : `Complete career acceleration with local ${pricing.currency} billing.`}
                    </p>

                    <button
                      className={styles.selectProBtn}
                      onClick={() => handleSelectPlan('Pro Career')}
                    >
                      <Zap size={14} /> Activate Pro Subscription ({effectiveProPrice}/mo)
                    </button>

                    <div className={styles.features}>
                      <div className={styles.fItem}><Check size={13} className={styles.chk} /> <strong>Unlimited ATS Resumes</strong></div>
                      <div className={styles.fItem}><Check size={13} className={styles.chk} /> Real-Time 98/100 ATS Score Dial</div>
                      <div className={styles.fItem}><Check size={13} className={styles.chk} /> All 4 Enterprise Humanizer Presets</div>
                      <div className={styles.fItem}><Check size={13} className={styles.chk} /> Sentence-by-Sentence AI Heatmap</div>
                      <div className={styles.fItem}><Check size={13} className={styles.chk} /> Clean ATS PDF & Print Layout</div>
                      <div className={styles.fItem}><Check size={13} className={styles.chk} /> 50 AI Priority Credits / month</div>
                    </div>
                  </div>

                  {/* Enterprise Talent */}
                  <div className={styles.planCard}>
                    <div className={styles.planTierName}>Enterprise Talent</div>
                    <div className={styles.planPriceRow}>
                      <span className={styles.priceNum}>{pricing.enterpriseMonthly}</span>
                      <span className={styles.pricePeriod}>/month</span>
                    </div>
                    <p className={styles.planDesc}>For executive transitions, career coaching, and team hiring.</p>

                    <button
                      className={styles.selectEnterpriseBtn}
                      onClick={() => handleSelectPlan('Enterprise Talent')}
                    >
                      Select Enterprise ({pricing.enterpriseMonthly}/mo)
                    </button>

                    <div className={styles.features}>
                      <div className={styles.fItem}><Check size={13} className={styles.chk} /> <strong>Unlimited AI Credits & Turbo Speed</strong></div>
                      <div className={styles.fItem}><Check size={13} className={styles.chk} /> Executive C-Suite ACR Framing</div>
                      <div className={styles.fItem}><Check size={13} className={styles.chk} /> Personal Style & Voice Cloning</div>
                      <div className={styles.fItem}><Check size={13} className={styles.chk} /> Multi-Candidate Batch Scanning</div>
                      <div className={styles.fItem}><Check size={13} className={styles.chk} /> Priority 24/7 Dedicated Support</div>
                    </div>
                  </div>
                </div>

                <div className={styles.guaranteeNote}>
                  <ShieldCheck size={14} /> 30-Day Money-Back Guarantee · Cancel anytime · Payment via {pricing.paymentMethodDesc}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── EXISTING CLIENT SIGN IN ── */}
        {tab === 'signin' && (
          <div className={styles.signInContainer}>
            {/* Quick 1-Click Client Accounts */}
            <div className={styles.demoFastSection}>
              <span className={styles.demoLabel}>1-CLICK INSTANT VERIFIED CLIENT ACCOUNTS</span>
              <div className={styles.demoGrid}>
                {DEMO_USERS.map(u => (
                  <button
                    key={u.id}
                    className={styles.demoCard}
                    onClick={() => {
                      onLoginDemo(u);
                      toast.success(`Welcome back, ${u.name}!`);
                      if (onClose) onClose();
                    }}
                  >
                    <img src={u.avatar} alt={u.name} className={styles.demoAvatar} />
                    <div className={styles.demoInfo}>
                      <strong>{u.name}</strong>
                      <span>{u.role}</span>
                      <span className={styles.demoBadge}>
                        {u.country === 'India' ? '🇮🇳 India (₹)' : (u.country === 'United Kingdom' ? '🇬🇧 UK (£)' : '🇺🇸 USA ($)')} · {u.tier}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.orDivider}>
              <span>OR SIGN IN WITH CREDENTIALS</span>
            </div>

            <form onSubmit={handleSignInSubmit} className={styles.form}>
              <div className={styles.field}>
                <label>Client Email Address</label>
                <div className={styles.inputWrap}>
                  <Mail size={15} className={styles.icon} />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={signInEmail}
                    onChange={e => setSignInEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>Password</label>
                <div className={styles.inputWrap}>
                  <Lock size={15} className={styles.icon} />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={signInPassword}
                    onChange={e => setSignInPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className={styles.proceedBtn}>
                Sign In to ResumeAI Workspace <ArrowRight size={15} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
