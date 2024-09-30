'use client';

import cn from '@/hooks/class-names';
import { useIsMounted } from '@/hooks/use-is-mounted';
import { useWindowScroll } from '@/hooks/use-window-scroll';
import HamburgerButton from '@/layouts/hamburger-button';
import HeaderMenuRight from '@/layouts/header-menu-right';
import Link from 'next/link';
import SearchWidget from '../components/search/search';
import Sidebar from './sidebar';

export default function Header() {
  const isMounted = useIsMounted();
  const windowScroll = useWindowScroll();

  // const { data: currencyExchanges } = useCurrencyExchange({ page: 1, limit: 20 });

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
      </div>

      <HeaderMenuRight />
    </header>
  );
}
