'use client';

import { ROLE } from '@/config/constants';
import { RootState } from '@/features/store';
import { useTranslations } from 'next-intl';
import { FcLock, FcUnlock } from 'react-icons/fc';
import { useSelector } from 'react-redux';
import { Switch } from 'rizzui';

export default function StatusIndicator() {
  const t = useTranslations('StatusIndicator');
  const { role } = useSelector((state: RootState) => state.authSlice);
  return (
    <div className="flex w-auto items-center justify-center gap-x-3 rounded-md border border-solid px-3">
      <span className="font-bold">{role === ROLE.SUPER_ADMIN ? 'Status' : t('status')}: </span>
      <div className="flex items-center justify-center space-x-2 pr-3">
        <span className="select-none font-medium">{role === ROLE.SUPER_ADMIN ? 'Active' : t('active')}</span>
        <Switch
          checked={true}
          switchClassName="cursor-auto bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-blue-500/50 hover:bg-gradient-to-br focus:ring-blue-300"
          switchKnobClassName="bg-light"
          variant="flat"
          labelClassName="select-none"
          onIcon={<FcUnlock />}
        />
      </div>
      <div className="flex items-center justify-end space-x-2">
        <span className="select-none font-medium">{role === ROLE.SUPER_ADMIN ? 'Inactive' : t('inactive')}</span>

        <Switch
          checked={false}
          switchClassName="cursor-auto bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-blue-500/50 hover:bg-gradient-to-br focus:ring-blue-300"
          switchKnobClassName={status ? 'bg-light' : 'bg-red-500'}
          variant="flat"
          labelClassName="select-none"
          offIcon={<FcLock />}
        />
      </div>
    </div>
  );
}
