'use client';

import LocalSwitcherSelector from '@/components/Locale/LocalSwitcherSelector';
import { routes } from '@/config/routes';
import useCurrencyExchange from '@/hooks/use-currency-exchange';
import Link from 'next/link';
import { useState } from 'react';
import { AiOutlineGlobal } from 'react-icons/ai';
import { IoHomeOutline } from 'react-icons/io5';

export default function HomeAndLocalButton() {
  const [modalState, setModalState] = useState<boolean>(false);
  const { data: currencyExchanges } = useCurrencyExchange({ page: 1, limit: 20 });
  return (
    <div className="flex items-center">
      <Link className="inline-block p-5" href={routes.publicRoutes.home}>
        <IoHomeOutline className="text-lg text-danger" />
      </Link>
      <div className="">
        <AiOutlineGlobal onClick={() => setModalState(true)} className="cursor-pointer text-xl text-danger" />
      </div>
      <LocalSwitcherSelector currencyExchanges={currencyExchanges} modalState={modalState} setModalState={setModalState} />
    </div>
  );
}
