export interface CountryPricing {
  country: string;
  flag: string;
  currency: string;
  symbol: string;
  freePrice: string;
  proMonthly: string;
  proAnnual: string;
  proStudent: string;
  enterpriseMonthly: string;
  enterpriseAnnual: string;
  paymentMethodDesc: string;
  isUPIAvailable: boolean;
}

export const COUNTRY_PRICING_MAP: Record<string, CountryPricing> = {
  India: {
    country: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    symbol: '₹',
    freePrice: '₹0',
    proMonthly: '₹599',
    proAnnual: '₹499',
    proStudent: '₹399',
    enterpriseMonthly: '₹1,499',
    enterpriseAnnual: '₹1,199',
    paymentMethodDesc: 'Instant UPI (Google Pay, PhonePe, Paytm, BHIM) + RuPay / Cards',
    isUPIAvailable: true,
  },
  'United States': {
    country: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    symbol: '$',
    freePrice: '$0',
    proMonthly: '$19',
    proAnnual: '$14',
    proStudent: '$12',
    enterpriseMonthly: '$49',
    enterpriseAnnual: '$37',
    paymentMethodDesc: 'Visa, Mastercard, Amex, Apple Pay & Google Pay via Stripe',
    isUPIAvailable: false,
  },
  'United Kingdom': {
    country: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    symbol: '£',
    freePrice: '£0',
    proMonthly: '£15',
    proAnnual: '£11',
    proStudent: '£9',
    enterpriseMonthly: '£39',
    enterpriseAnnual: '£29',
    paymentMethodDesc: 'UK Debit / Credit Cards, Apple Pay & Google Pay',
    isUPIAvailable: false,
  },
  Canada: {
    country: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    symbol: 'CA$',
    freePrice: 'CA$0',
    proMonthly: 'CA$25',
    proAnnual: 'CA$19',
    proStudent: 'CA$15',
    enterpriseMonthly: 'CA$65',
    enterpriseAnnual: 'CA$49',
    paymentMethodDesc: 'Canadian Cards & Apple Pay via Stripe',
    isUPIAvailable: false,
  },
  Australia: {
    country: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    symbol: 'AU$',
    freePrice: 'AU$0',
    proMonthly: 'AU$28',
    proAnnual: 'AU$21',
    proStudent: 'AU$18',
    enterpriseMonthly: 'AU$75',
    enterpriseAnnual: 'AU$55',
    paymentMethodDesc: 'Australian Cards & Apple Pay via Stripe',
    isUPIAvailable: false,
  },
  Germany: {
    country: 'Germany',
    flag: '🇩🇪',
    currency: 'EUR',
    symbol: '€',
    freePrice: '€0',
    proMonthly: '€17',
    proAnnual: '€13',
    proStudent: '€10',
    enterpriseMonthly: '€45',
    enterpriseAnnual: '€34',
    paymentMethodDesc: 'European Cards & SEPA via Stripe',
    isUPIAvailable: false,
  },
  'United Arab Emirates': {
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'AED',
    symbol: 'AED ',
    freePrice: '0 AED',
    proMonthly: '69 AED',
    proAnnual: '52 AED',
    proStudent: '39 AED',
    enterpriseMonthly: '179 AED',
    enterpriseAnnual: '135 AED',
    paymentMethodDesc: 'Regional Debit / Credit Cards & Apple Pay',
    isUPIAvailable: false,
  },
  Singapore: {
    country: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    symbol: 'SG$',
    freePrice: 'SG$0',
    proMonthly: 'SG$25',
    proAnnual: 'SG$19',
    proStudent: 'SG$15',
    enterpriseMonthly: 'SG$65',
    enterpriseAnnual: 'SG$49',
    paymentMethodDesc: 'Singapore Cards, PayNow & Apple Pay',
    isUPIAvailable: false,
  },
  'Other Global': {
    country: 'Other Global',
    flag: '🌍',
    currency: 'USD',
    symbol: '$',
    freePrice: '$0',
    proMonthly: '$19',
    proAnnual: '$14',
    proStudent: '$12',
    enterpriseMonthly: '$49',
    enterpriseAnnual: '$37',
    paymentMethodDesc: 'International Credit / Debit Cards via Stripe',
    isUPIAvailable: false,
  },
};

export function getPricingForCountry(countryName: string): CountryPricing {
  return COUNTRY_PRICING_MAP[countryName] || COUNTRY_PRICING_MAP['Other Global'];
}

export const SUPPORTED_COUNTRIES = Object.values(COUNTRY_PRICING_MAP);

