'use client';

import LocalSwitcherSelector from '@/components/Locale/LocalSwitcherSelector';
import { routes } from '@/config/routes';
import useCurrencyExchange from '@/hooks/use-currency-exchange';
import Link from 'next/link';
import { useState } from 'react';
import { AiOutlineGlobal } from 'react-icons/ai';
import { IoHomeOutline } from 'react-icons/io5';
import { Tooltip } from 'rizzui';

export default function HomeAndLocalButton() {
  const [modalState, setModalState] = useState<boolean>(false);
  const { data: currencyExchanges } = useCurrencyExchange({ page: 1, limit: 20 });
  return (
    <div className="flex items-center">
      <Link className="inline-block p-5" href={routes.publicRoutes.home}>
        <Tooltip color="danger" className="bg-danger text-white" size="sm" placement="top" content="Home" arrowClassName="fill-danger">
          <span>
            <IoHomeOutline className="text-lg text-danger" />
          </span>
        </Tooltip>
      </Link>
      <Tooltip color="danger" className="bg-danger text-white" size="sm" placement="top" content="Global" arrowClassName="fill-danger">
        <span>
          <AiOutlineGlobal onClick={() => setModalState(true)} className="cursor-pointer text-xl text-danger" />
        </span>
      </Tooltip>
      <LocalSwitcherSelector currencyExchanges={currencyExchanges} modalState={modalState} setModalState={setModalState} />
    </div>
  );
}
