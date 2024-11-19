'use client';

import { ROLE } from '@/config/constants';
import { RootState } from '@/features/store';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { FcLock, FcUnlock } from 'react-icons/fc';
import { useSelector } from 'react-redux';
import { Switch } from 'rizzui';

export default function SwitchButton({ updateStatus, id, status }: { updateStatus: any; id: string; status: boolean }) {
  const [checked, setChecked] = React.useState<boolean>(true);
  const { role } = useSelector((state: RootState) => state.authSlice);
  const t = useTranslations('SwitchButton');
  const tCommon = useTranslations('RetailerCommon');

  const handleUpdateStatus = async () => {
    setChecked((prev) => !prev);
    try {
      const result = await updateStatus({ branchId: id, data: { status: !checked } });
      if (result?.data?.status) {
        toast.success(role === ROLE.SUPER_ADMIN ? 'Status updated successfully!' : t('statusUpdatedSuccessfully'));
      } else {
        toast.error(role === ROLE.SUPER_ADMIN ? 'Something went wrong!' : tCommon('somethingWentWrong'));
      }
    } catch (err) {
      toast.error(role === ROLE.SUPER_ADMIN ? 'Something went wrong!' : tCommon('somethingWentWrong'));
    }
  };

  useEffect(() => {
    setChecked(status);
  }, [status]);

  return (
    <Switch
      onChange={handleUpdateStatus}
      checked={checked}
      switchClassName={`${status ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-blue-500/50 hover:bg-gradient-to-br focus:ring-blue-300' : 'bg-gradient-to-r from-red-500 via-red-600 to-red-700 shadow-red-500/50 hover:bg-gradient-to-br focus:ring-red-300'}`}
      switchKnobClassName={'bg-light'}
      variant="flat"
      labelClassName="select-none"
      onIcon={<FcUnlock />}
      offIcon={<FcLock />}
    />
  );
}
