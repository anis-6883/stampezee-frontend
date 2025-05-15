'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { ROLE } from '@/config/constants';
import { RootState } from '@/features/store';
import { useGetGeneralSettingsQuery } from '@/features/super-admin/general-settings/generalSettingsApi';
import cn from '@/hooks/class-names';
import { useIsMounted } from '@/hooks/use-is-mounted';
import { useWindowScroll } from '@/hooks/use-window-scroll';
import HamburgerButton from '@/layouts/hamburger-button';
import HeaderMenuRight from '@/layouts/header-menu-right';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import SearchWidget from '../components/search/search';
import Sidebar from './sidebar';

export default function Header() {
  const isMounted = useIsMounted();
  const windowScroll = useWindowScroll();
  const { data: session }: any = useSession();
  const { role, accessToken } = useSelector((state: RootState) => state.authSlice);
  const { data, isLoading } = useGetGeneralSettingsQuery(null, { skip: !accessToken || role !== ROLE.SUPER_ADMIN });

  return (
    <header
      className={cn(
        '2xl:py-5 sticky top-0 z-50 flex items-center bg-gray-0/80 px-4 py-4 backdrop-blur-xl dark:bg-gray-50/50 md:px-5 lg:px-6 3xl:px-8 4xl:px-10',
        ((isMounted && windowScroll.y) as number) > 2 ? 'card-shadow' : ''
      )}
    >
      <div className="flex w-full max-w-2xl items-center">
        <HamburgerButton view={<Sidebar className="2xl:w-full static w-full" />} />
        <Link href={'/'} aria-label="Site Logo" className="me-4 w-9 shrink-0 lg:me-5 xl:hidden">
          <img src="/images/logo.png" className="mx-auto w-10" alt="logo" />
        </Link>

        <SearchWidget />
        {role === ROLE.SUPER_ADMIN && (
          <div className="ml-5 flex w-auto items-center justify-center gap-x-3 rounded-md border border-solid px-3 py-2">
            {isLoading ? (
              <Skeleton className="h-5 w-40 rounded" />
            ) : (
              <span className="font-semibold">Timezone : {`${data?.data?.general?.timezone?.label}`} </span>
            )}
          </div>
        )}

        {role === ROLE.RETAILER && (
          <div className="ml-5 flex w-auto items-center justify-center gap-x-3 rounded-md border border-solid px-3 py-2">
            {isLoading ? (
              <Skeleton className="h-5 w-40 rounded" />
            ) : (
              <span className="font-semibold">Timezone : {`${session?.user?.timezone?.label}`} </span>
            )}
          </div>
        )}
      </div>

      <HeaderMenuRight />
    </header>
  );
}
