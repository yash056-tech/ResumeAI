import { useState, useEffect } from 'react';
import { getPricingForCountry } from './currency';

export type UserPersona = 'Student' | 'Working Professional' | 'Enterprise';

export type UserTier = 'Free All-Access' | 'Pro Career' | 'Enterprise Talent' | 'Free Starter';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  persona: UserPersona;
  country: string;
  currency: string;
  currencySymbol: string;
  role: string;
  avatar: string;
  tier: UserTier;
  creditsRemaining: number;
  maxCredits: number;
  joinedDate: string;
}

export interface SavedResume {
  id: string;
  title: string;
  targetRole: string;
  createdAt: string;
  markdown: string;
  atsScore: number;
}

const AUTH_STORAGE_KEY = 'resumeai_auth_session_v4';
const RESUMES_STORAGE_KEY = 'resumeai_saved_resumes_v4';

// Clear legacy session keys from previous iterations so user always starts clean at the auth gate
try {
  localStorage.removeItem('careerai_user_session');
  localStorage.removeItem('talentforge_user_session');
  localStorage.removeItem('resumeai_auth_session_v3');
} catch { /* ignore */ }

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'usr_india',
    name: 'Aarav Patel',
    email: 'aarav.patel@gmail.com',
    persona: 'Working Professional',
    country: 'India',
    currency: 'INR',
    currencySymbol: '₹',
    role: 'Senior Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    tier: 'Free All-Access',
    creditsRemaining: 999,
    maxCredits: 999,
    joinedDate: 'Oct 2026',
  },
  {
    id: 'usr_student',
    name: 'Priya Sharma',
    email: 'priya.sharma@iitd.ac.in',
    persona: 'Student',
    country: 'India',
    currency: 'INR',
    currencySymbol: '₹',
    role: 'Computer Science Graduate',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    tier: 'Free All-Access',
    creditsRemaining: 999,
    maxCredits: 999,
    joinedDate: 'Oct 2026',
  },
  {
    id: 'usr_global',
    name: 'Michael Davis',
    email: 'm.davis@techcorp.io',
    persona: 'Working Professional',
    country: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    role: 'Principal Cloud Architect',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    tier: 'Free All-Access',
    creditsRemaining: 999,
    maxCredits: 999,
    joinedDate: 'Sep 2026',
  },
  {
    id: 'usr_uk',
    name: 'Oliver Smith',
    email: 'oliver.smith@londonfin.co.uk',
    persona: 'Working Professional',
    country: 'United Kingdom',
    currency: 'GBP',
    currencySymbol: '£',
    role: 'Fintech Solutions Lead',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    tier: 'Free All-Access',
    creditsRemaining: 999,
    maxCredits: 999,
    joinedDate: 'Oct 2026',
  },
];

const INITIAL_SAVED_RESUMES: SavedResume[] = [
  {
    id: 'res_01',
    title: 'Senior Software Engineer (Target: Top Tier Tech)',
    targetRole: 'Senior Backend Engineer',
    createdAt: '2 days ago',
    atsScore: 98,
    markdown: `## Summary
Results-driven Infrastructure & Distributed Systems Engineer with 6+ years architecting fault-tolerant microservices, high-throughput message pipelines, and cloud-native solutions processing millions of daily transactions.

## Experience
### Senior Software Engineer | Enterprise Cloud Solutions
*2022 - Present*
- Re-architected core settlement pipeline using Apache Kafka, Go, and PostgreSQL, slashing transaction latency by 64% and supporting peak throughput of 14,000 TPS.
- Engineered automated zero-downtime Blue/Green Kubernetes deployment pipelines via ArgoCD, increasing deployment cadence from bi-weekly to 18 deployments/day.
- Implemented cryptographic payload verification protocols adhering to international security standards across 42 external endpoints.

## Skills
- **Core Languages:** Go, Python, TypeScript, SQL, Java
- **Cloud & Orchestration:** AWS, Kubernetes, Docker, Terraform
- **Data & Message Queues:** PostgreSQL, Redis, Apache Kafka

## Education
### B.S. in Computer Science | First Class Honors`,
  },
];

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    // Strict Gate: Must be null on fresh load so user registers or signs in!
    return null;
  });

  const [savedResumes, setSavedResumes] = useState<SavedResume[]>(() => {
    const saved = localStorage.getItem(RESUMES_STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_SAVED_RESUMES;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(savedResumes));
  }, [savedResumes]);

  const loginWithDemo = (demoUser: UserProfile) => {
    setUser(demoUser);
  };

  const loginWithCredentials = (email: string) => {
    const existing = DEMO_USERS.find(d => d.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setUser(existing);
      return;
    }
    const namePart = email.split('@')[0];
    const defaultCountry = 'India';
    const pricing = getPricingForCountry(defaultCountry);

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
      email: email,
      persona: 'Working Professional',
      country: defaultCountry,
      currency: pricing.currency,
      currencySymbol: pricing.symbol,
      role: 'Career Candidate',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
      tier: 'Free All-Access',
      creditsRemaining: 999,
      maxCredits: 999,
      joinedDate: 'Today',
    };
    setUser(newUser);
  };

  const registerUser = (
    name: string,
    email: string,
    persona: UserPersona,
    country: string,
    tier: UserTier = 'Free All-Access'
  ): UserProfile => {
    const pricing = getPricingForCountry(country);
    const roleDefault = persona === 'Student'
      ? 'Student / New Graduate'
      : (persona === 'Enterprise' ? 'Hiring Lead / Executive' : 'Professional Specialist');

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name || email.split('@')[0],
      email: email,
      persona: persona,
      country: country,
      currency: pricing.currency,
      currencySymbol: pricing.symbol,
      role: roleDefault,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
      tier: tier,
      creditsRemaining: 999,
      maxCredits: 999,
      joinedDate: 'Today',
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const consumeCredit = () => {
    return true; // All services are 100% free with unlimited access
  };

  const upgradeTier = (tier: UserTier) => {
    if (!user) return;
    setUser({
      ...user,
      tier,
      creditsRemaining: 999,
      maxCredits: 999,
    });
  };

  const addSavedResume = (resume: Omit<SavedResume, 'id' | 'createdAt'>) => {
    const newRes: SavedResume = {
      ...resume,
      id: `res_${Date.now()}`,
      createdAt: 'Just now',
    };
    setSavedResumes(prev => [newRes, ...prev]);
    return newRes;
  };

  const deleteSavedResume = (id: string) => {
    setSavedResumes(prev => prev.filter(r => r.id !== id));
  };

  return {
    user,
    isAuthenticated: Boolean(user),
    loginWithDemo,
    loginWithCredentials,
    registerUser,
    logout,
    consumeCredit,
    upgradeTier,
    savedResumes,
    addSavedResume,
    deleteSavedResume,
  };
}
