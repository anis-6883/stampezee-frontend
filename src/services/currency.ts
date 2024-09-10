'use server';

import { Currency, defaultCurrency } from '@/config';
import { cookies } from 'next/headers';

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = 'NEXT_CURRENCY';

export async function getUserCurrency() {
  return cookies().get(COOKIE_NAME)?.value || defaultCurrency;
}

export async function setUserCurrency(currency: Currency) {
  cookies().set(COOKIE_NAME, currency);
}
