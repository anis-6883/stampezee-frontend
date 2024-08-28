// Locale config
export type Locale = (typeof locales)[number];

export const locales = ['en', 'ar'] as const;
export const defaultLocale: Locale = 'en';

// currency config
export type Currency = (typeof currencies)[number];

export const currencies = ['USD', 'CAD'] as const;
export const defaultCurrency: Currency = 'USD';
