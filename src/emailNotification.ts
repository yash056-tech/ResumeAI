/**
 * Service to automatically email new client registration details to ya09shu@gmail.com
 */

export interface RegistrationNotificationData {
  name: string;
  email: string;
  persona: string;
  country: string;
  tier: string;
  currency: string;
  price: string;
  paymentMethod: string;
  registeredAt?: string;
}

const ADMIN_EMAIL = 'ya09shu@gmail.com';

export async function notifyAdminOnRegistration(data: RegistrationNotificationData): Promise<boolean> {
  const registeredAt = data.registeredAt || new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Asia/Kolkata',
  }) + ' (IST)';

  const payload = {
    _subject: `🚀 New ResumeAI Registration: ${data.name} [${data.persona}] - ${data.country}`,
    _template: 'table',
    _captcha: 'false',
    client_full_name: data.name,
    client_email: data.email,
    professional_status: data.persona,
    resident_country: data.country,
    selected_plan: data.tier,
    billing_currency: data.currency,
    subscription_rate: data.price,
    payment_method: data.paymentMethod,
    registered_at: registeredAt,
    portal: 'ResumeAI Career Platform',
  };

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log('✅ Registration notification successfully dispatched to', ADMIN_EMAIL);
      return true;
    }
  } catch (error) {
    console.warn('Primary email dispatch failed, attempting secondary webhook:', error);
  }

  // Backup fallback endpoint
  try {
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: 'RESUMEAI_ADMIN_DISPATCH',
        to: ADMIN_EMAIL,
        subject: `New ResumeAI Registration: ${data.name}`,
        ...payload,
      }),
    });
  } catch {
    // Non-blocking fallback
  }

  return false;
}
