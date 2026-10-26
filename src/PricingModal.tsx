import React, { useState } from 'react';
import { Check, Zap, Sparkles, Shield, X, CreditCard, Award, Globe, QrCode } from 'lucide-react';
import { SUPPORTED_COUNTRIES, getPricingForCountry } from './currency';
import { notifyAdminOnRegistration } from './emailNotification';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import styles from './PricingModal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentTier: string;
  userCountry?: string;
  userPersona?: string;
  onUpgrade: (tier: 'Free Starter' | 'Pro Career' | 'Enterprise Talent') => void;
}

export default function PricingModal({
  isOpen,
  onClose,
  currentTier,
  userCountry = 'India',
  userPersona = 'Working Professional',
  onUpgrade,
}: Props) {
  const [country, setCountry] = useState<string>(userCountry);
  const [annual, setAnnual] = useState(true);
  const [selectedTier, setSelectedTier] = useState<'Free Starter' | 'Pro Career' | 'Enterprise Talent' | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('upi');
  const [upiId, setUpiId] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  if (!isOpen) return null;

  const pricing = getPricingForCountry(country);
  const isStudent = userPersona === 'Student';

  const handleSelectPlan = (tier: 'Free Starter' | 'Pro Career' | 'Enterprise Talent') => {
    if (tier === currentTier) {
      toast('You are already subscribed to this tier.');
      return;
    }
    if (tier === 'Free Starter') {
      onUpgrade(tier);
      toast.success('Switched to Free Starter plan');
      onClose();
      return;
    }
    setSelectedTier(tier);
    setIsCheckingOut(true);
    setPaymentMethod(pricing.isUPIAvailable ? 'upi' : 'card');
  };

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'CAREER50' || promoCode.toUpperCase() === 'LAUNCH' || promoCode.toUpperCase() === 'RESUME50') {
      setPromoApplied(true);
      toast.success('50% VIP discount applied!');
    } else {
      toast.error('Invalid promo code. Try "CAREER50"');
    }
  };

  const handleCompleteCheckout = () => {
    if (!selectedTier) return;
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    onUpgrade(selectedTier);

    // Notify admin on upgrade
    notifyAdminOnRegistration({
      name: 'Client Subscription Upgrade',
      email: 'Upgraded in Workspace',
      persona: userPersona,
      country,
      tier: selectedTier,
      currency: pricing.currency,
      price: selectedTier === 'Enterprise Talent'
        ? (annual ? `${pricing.enterpriseAnnual}/mo` : `${pricing.enterpriseMonthly}/mo`)
        : (annual ? `${pricing.proAnnual}/mo` : (isStudent ? `${pricing.proStudent}/mo` : `${pricing.proMonthly}/mo`)),
      paymentMethod: pricing.isUPIAvailable ? (paymentMethod === 'upi' ? `UPI (${upiId || 'Direct QR'})` : 'Card / RuPay') : 'Card / Stripe',
    });

    toast.success(`Welcome to ${selectedTier}! All Pro features unlocked.`);
    setIsCheckingOut(false);
    onClose();
  };

  // Compute displayed prices
  const proDisplayPrice = annual
    ? pricing.proAnnual
    : (isStudent ? pricing.proStudent : pricing.proMonthly);

  const enterpriseDisplayPrice = annual
    ? pricing.enterpriseAnnual
    : pricing.enterpriseMonthly;

  const plans = [
    {
      name: 'Free Starter',
      price: pricing.freePrice,
      period: 'forever',
      description: 'Ideal for trying out the platform and single resume building.',
      badge: 'Basic Tier',
      features: [
        '3 ATS Resume generations / month',
        'Standard Markdown resume export',
        'Basic AI Humanizer (Single tone)',
        'Basic AI Detection scan',
        'Community Support',
      ],
      tier: 'Free Starter' as const,
      popular: false,
      color: '#8892b0',
    },
    {
      name: 'Pro Career',
      price: proDisplayPrice,
      period: 'per month',
      description: pricing.isUPIAvailable
        ? 'Optimized for Indian job seekers & tech applicants with domestic PPP rate.'
        : `Tailored for ${pricing.country} applicants with local currency billing.`,
      badge: `Popular in ${pricing.country}`,
      features: [
        'Unlimited ATS Resume Generations',
        'Real-time ATS Health Score Gauge (0-100)',
        'Multi-Template Switcher (Executive, Tech, Minimal)',
        'Sentence-Level AI Heatmap & Diagnostics',
        'All 4 Enterprise Humanizer Presets',
        'Real-time JD Keyword Gap Analysis',
        'Direct ATS-to-Humanizer Workflow Bridge',
        'Clean ATS PDF & Word Exports',
        '50 Priority AI Credits / month',
      ],
      tier: 'Pro Career' as const,
      popular: true,
      color: '#6378ff',
    },
    {
      name: 'Enterprise Talent',
      price: enterpriseDisplayPrice,
      period: 'per month',
      description: 'For executive job transitions, career coaches, and recruitment leadership.',
      badge: 'Maximum Power',
      features: [
        'Everything in Pro Career',
        'Unlimited AI Credits & Turbo Speed',
        'Executive C-Suite ACR Framing',
        'Deep Forensic Linguistic Auditing',
        'Personal Voice Style Cloning',
        'Multi-Candidate Resume Batching',
        '1-on-1 Recruiter Screening Simulation',
        'Dedicated Priority 24/7 Support',
      ],
      tier: 'Enterprise Talent' as const,
      popular: false,
      color: '#a78bfa',
    },
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>

        {!isCheckingOut ? (
          <>
            <div className={styles.header}>
              <div className={styles.pill}><Sparkles size={13} /> Transparent Global Pricing</div>
              <h2>Accelerate Your Career with ResumeAI Pro</h2>
              <p className={styles.subtitle}>
                Get 3.8x more interviews with our ATS-optimized resume builder and authentic humanizer engine.
              </p>

              {/* Localized Currency / Country Selector */}
              <div className={styles.currencyToggleWrap}>
                <div className={styles.currencySelector}>
                  <Globe size={14} className={styles.globeIcon} />
                  <span>Country & Currency:</span>
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className={styles.countrySelect}
                  >
                    {SUPPORTED_COUNTRIES.map(c => (
                      <option key={c.country} value={c.country}>
                        {c.flag} {c.country} ({c.symbol} {c.currency})
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.billingToggle}>
                  <span className={!annual ? styles.activeBill : ''}>Monthly</span>
                  <button
                    className={`${styles.toggleSwitch} ${annual ? styles.toggleActive : ''}`}
                    onClick={() => setAnnual(a => !a)}
                  >
                    <span className={styles.toggleKnob} />
                  </button>
                  <span className={annual ? styles.activeBill : ''}>
                    Annual <span className={styles.saveBadge}>Save 25%</span>
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.plansGrid}>
              {plans.map(p => {
                const isCurrent = currentTier === p.tier;
                return (
                  <div
                    key={p.name}
                    className={`${styles.planCard} ${p.popular ? styles.popularCard : ''}`}
                    style={{ '--plan-color': p.color } as React.CSSProperties}
                  >
                    {p.popular && <div className={styles.popularBadge}><Award size={13} /> {p.badge}</div>}
                    <div className={styles.cardHeader}>
                      <h3>{p.name}</h3>
                      <p className={styles.cardDesc}>{p.description}</p>
                    </div>

                    <div className={styles.priceRow}>
                      <span className={styles.price}>{p.price}</span>
                      <span className={styles.period}>/{p.period}</span>
                    </div>

                    <button
                      className={`${styles.planBtn} ${p.popular ? styles.popularBtn : ''}`}
                      disabled={isCurrent}
                      onClick={() => handleSelectPlan(p.tier)}
                    >
                      {isCurrent ? 'Current Plan' : `Upgrade to ${p.name}`}
                    </button>

                    <div className={styles.divider} />

                    <div className={styles.featureList}>
                      <span className={styles.featuresHeading}>INCLUDED IN THIS PLAN:</span>
                      {p.features.map((f, i) => (
                        <div key={i} className={styles.featureItem}>
                          <Check size={14} className={styles.checkIcon} />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.footerNote}>
              <Shield size={14} /> 30-Day Money-Back Guarantee · Cancel anytime in 1 click · Billed in {pricing.symbol} {pricing.currency} via {pricing.paymentMethodDesc}
            </div>
          </>
        ) : (
          /* Checkout View with UPI & Card Localized Options */
          <div className={styles.checkoutView}>
            <div className={styles.checkoutHeader}>
              <button className={styles.backBtn} onClick={() => setIsCheckingOut(false)}>
                ← Back to plans
              </button>
              <h2>Confirm Subscription</h2>
              <p>Upgrading to <strong>{selectedTier}</strong> ({annual ? 'Annual billing' : 'Monthly billing'}) in <strong>{pricing.symbol} {pricing.currency}</strong></p>
            </div>

            <div className={styles.checkoutBody}>
              <div className={styles.orderSummary}>
                <h3>Order Summary</h3>
                <div className={styles.summaryRow}>
                  <span>Plan</span>
                  <strong>{selectedTier}</strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>Billing Cycle</span>
                  <span>{annual ? 'Yearly (25% discount)' : 'Monthly'}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Rate</span>
                  <span>
                    {selectedTier === 'Enterprise Talent'
                      ? (annual ? `${pricing.enterpriseAnnual}/mo` : `${pricing.enterpriseMonthly}/mo`)
                      : (annual ? `${pricing.proAnnual}/mo` : (isStudent ? `${pricing.proStudent}/mo` : `${pricing.proMonthly}/mo`))
                    }
                  </span>
                </div>
                {promoApplied && (
                  <div className={styles.summaryRow} style={{ color: 'var(--accent3)' }}>
                    <span>Promo Code (CAREER50)</span>
                    <span>-50% Off First Month</span>
                  </div>
                )}
                <div className={styles.totalRow}>
                  <span>Total Due Today:</span>
                  <span className={styles.totalPrice}>
                    {selectedTier === 'Enterprise Talent'
                      ? (annual ? `${pricing.enterpriseAnnual} (billed yearly)` : `${pricing.enterpriseMonthly}`)
                      : (annual ? `${pricing.proAnnual} (billed yearly)` : (isStudent ? `${pricing.proStudent}` : `${pricing.proMonthly}`))
                    }
                  </span>
                </div>

                <div className={styles.promoBox}>
                  <input
                    type="text"
                    placeholder="Promo code (try 'CAREER50')"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                  />
                  <button onClick={handleApplyPromo}>Apply</button>
                </div>
              </div>

              <div className={styles.paymentForm}>
                <h3>Payment Method ({pricing.currency})</h3>

                {pricing.isUPIAvailable ? (
                  <div className={styles.methodToggle}>
                    <button
                      className={`${styles.methodBtn} ${paymentMethod === 'upi' ? styles.activeMethod : ''}`}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <QrCode size={15} /> Instant UPI (GPay / PhonePe / Paytm)
                    </button>
                    <button
                      className={`${styles.methodBtn} ${paymentMethod === 'card' ? styles.activeMethod : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <CreditCard size={15} /> RuPay / Card / NetBanking
                    </button>
                  </div>
                ) : (
                  <div className={styles.methodToggle}>
                    <button
                      className={`${styles.methodBtn} ${styles.activeMethod}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <CreditCard size={15} /> Credit / Debit Card & Apple Pay ({pricing.currency})
                    </button>
                  </div>
                )}

                {paymentMethod === 'upi' && pricing.isUPIAvailable ? (
                  <div className={styles.upiBox}>
                    <div className={styles.fieldGroup}>
                      <label>Enter UPI ID (VPA)</label>
                      <input
                        type="text"
                        placeholder="yourname@okaxis or yourname@paytm"
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                      />
                    </div>
                    <div className={styles.qrMock}>
                      <QrCode size={38} className={styles.qrIcon} />
                      <div>
                        <strong>Scan to Pay via Any UPI App</strong>
                        <span>Supports Google Pay, PhonePe, Paytm, BHIM, Cred</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.fieldGroup}>
                      <label>Cardholder Name</label>
                      <input type="text" defaultValue="Alex Rivera" />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label>Card Information</label>
                      <div className={styles.cardInputWrapper}>
                        <CreditCard size={16} className={styles.cardIcon} />
                        <input type="text" defaultValue="4242 •••• •••• 4242" />
                        <span className={styles.exp}>12/28</span>
                        <span className={styles.cvc}>CVC 888</span>
                      </div>
                    </div>
                  </>
                )}

                <button className={styles.payBtn} onClick={handleCompleteCheckout}>
                  <Zap size={16} /> Complete Upgrade & Activate
                </button>
                <div className={styles.secureBadge}>
                  <Shield size={13} /> 256-bit TLS Encryption · Instant Activation in {pricing.country}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
