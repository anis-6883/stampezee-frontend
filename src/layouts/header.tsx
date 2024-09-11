'use client';

import LocalSwitcherSelector from '@/components/Locale/LocalSwitcherSelector';
import { ROLE } from '@/config/constants';
import { RootState } from '@/features/store';
import cn from '@/hooks/class-names';
import useCurrencyExchange from '@/hooks/use-currency-exchange';
import { useIsMounted } from '@/hooks/use-is-mounted';
import { useWindowScroll } from '@/hooks/use-window-scroll';
import HamburgerButton from '@/layouts/hamburger-button';
import HeaderMenuRight from '@/layouts/header-menu-right';
import Link from 'next/link';
import { useState } from 'react';
import { AiOutlineGlobal } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import SearchWidget from '../components/search/search';
import Sidebar from './sidebar';

export default function Header() {
  const isMounted = useIsMounted();
  const windowScroll = useWindowScroll();
  const [modalState, setModalState] = useState<boolean>(false);
  const { data: currencyExchanges } = useCurrencyExchange({ page: 1, limit: 20 });
  const { role } = useSelector((state: RootState) => state.authSlice);

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
        {role === ROLE.RETAILER && (
          <div className="mx-4">
            <AiOutlineGlobal
              onClick={() => setModalState(true)}
              className="h-9 w-9 cursor-pointer rounded-full p-1 ring-2 ring-danger ring-offset-2 ring-offset-background"
            />
          </div>
        )}
        <LocalSwitcherSelector currencyExchanges={currencyExchanges} modalState={modalState} setModalState={setModalState} />
      </div>

      <HeaderMenuRight />
    </header>
  );
}
