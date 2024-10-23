import LocalSwitcherSelector from '@/components/Locale/LocalSwitcherSelector';
import { ROLE } from '@/config/constants';
import { routes } from '@/config/routes';
import { RootState } from '@/features/store';
import ProfileMenu from '@/layouts/profile-menu';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { AiOutlineGlobal } from 'react-icons/ai';
import { IoHomeOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';

export default function HeaderMenuRight() {
  const t = useTranslations('AppLayout');
  const [modalState, setModalState] = useState<boolean>(false);
  const { role } = useSelector((state: RootState) => state.authSlice);
  const { currencyExchangeRates: currencyExchanges } = useSelector((state: RootState) => state.currencyExchangeSlice);
  return (
    <div
      className={`ms-auto grid shrink-0 ${role === ROLE.SUPER_ADMIN ? 'grid-cols-2' : 'grid-cols-3'} items-center gap-x-0 text-gray-700 `}
    >
      <div className="text-base font-semibold text-danger">
        <Link className="flex items-center gap-x-2 " href={routes.publicRoutes.home}>
          <IoHomeOutline className="text-lg text-danger" />
          {role === ROLE.SUPER_ADMIN ? 'Go To Home' : t('goToHome')}
        </Link>
      </div>
      <ProfileMenu />
      {role === ROLE.RETAILER && (
        <div className="">
          <AiOutlineGlobal
            onClick={() => setModalState(true)}
            className="h-9 w-9 cursor-pointer rounded-full p-1 ring-2 ring-[#F5F5F5] ring-offset-2 ring-offset-background"
          />
        </div>
      )}
      <LocalSwitcherSelector currencyExchanges={currencyExchanges} modalState={modalState} setModalState={setModalState} />
    </div>
  );
}
