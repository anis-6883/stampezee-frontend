import { poppins } from '@/app/fonts';
import '@/app/globals.css';
import GlobalDrawer from '@/components/drawer-views/container';
import GlobalModal from '@/components/modal-views/container';
import NextProgress from '@/components/next-progress';
import { siteConfig } from '@/config/site.config';
import { getServerSession } from 'next-auth';
import { Toaster } from 'react-hot-toast';
import { authOptions } from './api/auth/[...nextauth]/auth-options';
import AuthProvider from './providers/auth-provider';
import ReduxProvider from './providers/redux-provider';

import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

export const metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} dir="ltr" suppressHydrationWarning={true} className={poppins.className}>
      <body suppressHydrationWarning={true}>
        <NextIntlClientProvider messages={messages}>
          <ReduxProvider>
            <AuthProvider session={session}>
              <NextProgress />
              {children}
              <Toaster />
              <GlobalModal />
              <GlobalDrawer />
            </AuthProvider>
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
