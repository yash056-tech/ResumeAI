import React, { useState } from 'react';
import {
  Mail, Lock, User, Globe, GraduationCap, Briefcase,
  Building2, ArrowRight, ShieldCheck, Zap,
  X, Sparkles
} from 'lucide-react';
import { DEMO_USERS, type UserPersona, type UserProfile, type UserTier } from './useAuth';
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
    tier: UserTier
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

  // Handle Free Registration Submit
  const handleFreeRegistration = (e: React.FormEvent) => {
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

    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });

    // Register user with Free All-Access tier
    onRegister(name, email, persona, country, 'Free All-Access');

    // Automatically email full registration details to ya09shu@gmail.com
    notifyAdminOnRegistration({
      name,
      email,
      persona,
      country,
      tier: '100% Free Lifetime All-Access',
      currency: pricing.currency,
      price: 'FREE ($0 / ₹0)',
      paymentMethod: 'Complimentary Free Access (No Payment Required)',
    });

    toast.success(`Welcome to ResumeAI, ${name}! All services unlocked for free.`);
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

    // Notify admin on client login as well
    notifyAdminOnRegistration({
      name: signInEmail.split('@')[0],
      email: signInEmail,
      persona: 'Returning Client / Candidate',
      country: pricing.country,
      tier: '100% Free Lifetime All-Access',
      currency: pricing.currency,
      price: 'FREE ($0 / ₹0)',
      paymentMethod: 'Account Sign In (Free)',
    });

    toast.success('Signed in successfully! Full access unlocked.');
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
          <h2>ResumeAI <span className={styles.proTag}>100% FREE ACCESS</span></h2>
          <p className={styles.tagline}>
            Free ATS-Friendly Resume Studio · Unrejectable Ivy League & Silicon Valley Templates
          </p>

          {/* Action Context Alert if triggered by clicking a button */}
          {actionMessage && (
            <div className={styles.actionAlert}>
              <Sparkles size={14} style={{ color: 'var(--accent3)' }} />
              <span>Register or sign in below for free to <strong>{actionMessage}</strong>.</span>
            </div>
          )}
        </div>

        {/* Tab Switcher */}
        <div className={styles.tabBar}>
          <button
            className={`${styles.tabBtn} ${tab === 'register' ? styles.tabActive : ''}`}
            onClick={() => setTab('register')}
          >
            Create Free Account
          </button>
          <button
            className={`${styles.tabBtn} ${tab === 'signin' ? styles.tabActive : ''}`}
            onClick={() => setTab('signin')}
          >
            Client Sign In
          </button>
        </div>

        {/* ── REGISTRATION FLOW (NO PAYMENT - 100% FREE) ── */}
        {tab === 'register' && (
          <div className={styles.regContainer}>
            <form onSubmit={handleFreeRegistration} className={styles.form}>
              <div className={styles.stepIndicator}>
                <span className={styles.stepBadge}>Free Client Registration</span>
                <span>All services are completely free — enter details to personalize your workspace</span>
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
                        {c.flag} {c.country}
                      </option>
                    ))}
                  </select>
                </div>
                <span className={styles.countryNote}>
                  📍 Resident of: <strong>{pricing.flag} {pricing.country}</strong> · Workspace calibrated for your region.
                </span>
              </div>

              {/* 100% Free Access Guarantee Banner (No Payment) */}
              <div className={styles.freeAccessBanner}>
                <Sparkles size={20} style={{ color: '#34d399', flexShrink: 0 }} />
                <div>
                  <strong>🎉 100% Free All-Access — No Payment or Card Required</strong>
                  <span>Unlimited ATS resume generation, enterprise humanizing, and forensic AI detection for all users.</span>
                </div>
              </div>

              <button type="submit" className={styles.proceedBtn}>
                <Zap size={16} /> Complete Free Registration & Access Services <ArrowRight size={16} />
              </button>

              <div className={styles.freeGuarantee}>
                <ShieldCheck size={14} style={{ color: 'var(--accent3)' }} />
                <span>Zero hidden charges · All 3 AI Subsystems completely free forever</span>
              </div>
            </form>
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
                      toast.success(`Welcome back, ${u.name}! Full access active.`);
                      if (onClose) onClose();
                    }}
                  >
                    <img src={u.avatar} alt={u.name} className={styles.demoAvatar} />
                    <div className={styles.demoInfo}>
                      <strong>{u.name}</strong>
                      <span>{u.role}</span>
                      <span className={styles.demoBadge}>
                        {u.country === 'India' ? '🇮🇳 India' : (u.country === 'United Kingdom' ? '🇬🇧 UK' : '🇺🇸 USA')} · Free All-Access
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
