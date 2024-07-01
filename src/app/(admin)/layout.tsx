'use client';

import { useIsMounted } from '@/hooks/use-is-mounted';
import HydrogenLayout from '@/layouts/layout';

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span>
          <img src="/images/logo.png" className="mx-auto w-28 animate-bounce" alt="logo" />
        </span>
      </div>
    );
  }

  return <HydrogenLayout>{children}</HydrogenLayout>;
}
