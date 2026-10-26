export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, persona, country, tier, currency, price, paymentMethod } = req.body || {};
  const ADMIN_EMAIL = 'ya09shu@gmail.com';

  const payload = {
    _subject: `🚀 New ResumeAI Registration: ${name} [${persona}] - ${country}`,
    _template: 'table',
    _captcha: 'false',
    client_full_name: name,
    client_email: email,
    professional_status: persona,
    resident_country: country,
    selected_plan: tier,
    billing_currency: currency,
    subscription_rate: price,
    payment_method: paymentMethod,
    registered_at: new Date().toISOString(),
    platform: 'ResumeAI Production Serverless',
  };

  try {
    const dispatch = await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return res.status(200).json({ success: dispatch.ok });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Dispatch failed' });
  }
}
