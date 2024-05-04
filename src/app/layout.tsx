import AuthProvider from './providers/auth-provider';
import { lexendDeca, poppins } from '@/app/fonts';
import '@/app/globals.css';
import GlobalDrawer from '@/components/drawer-views/container';
import GlobalModal from '@/components/modal-views/container';
import { siteConfig } from '@/config/site.config';
import ReduxProvider from './providers/redux-provider';
import cn from '@/hooks/class-names';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';
import { cookies } from 'next/headers';

const NextProgress = dynamic(() => import('@/components/next-progress'), {
  ssr: false,
});

export const metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const tokenExist = cookies().get('act')?.value ? true : false;

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning={true}>
      <body className={cn(poppins.variable, lexendDeca.variable, 'font-inter')} suppressHydrationWarning={true}>
        <ReduxProvider>
          <AuthProvider tokenExist={tokenExist}>
            <NextProgress />
            {children}
            <Toaster />
            <GlobalModal />
            <GlobalDrawer />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
