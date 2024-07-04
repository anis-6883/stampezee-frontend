'use client';

import React, { useEffect } from 'react';
import { FcLock, FcUnlock } from 'react-icons/fc';
import { Switch } from 'rizzui';

export default function SwitchButton({ updateStatus, id, status }: { updateStatus: any; id: string; status: boolean }) {
  const [checked, setChecked] = React.useState<boolean>(true);

  const handleUpdateStatus = () => {
    setChecked((prev) => !prev);
    updateStatus({ branchId: id, data: { status: !checked } });
  };

  useEffect(() => {
    setChecked(status);
  }, [status]);

  return (
    <Switch
      onChange={handleUpdateStatus}
      checked={checked}
      switchClassName="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-blue-500/50 hover:bg-gradient-to-br focus:ring-blue-300"
      switchKnobClassName="bg-light"
      variant="flat"
      labelClassName="select-none"
      onIcon={<FcUnlock />}
      offIcon={<FcLock />}
    />
  );
}
