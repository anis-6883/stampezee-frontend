'use client';

import React, { useEffect } from 'react';
import { FcLock, FcUnlock } from 'react-icons/fc';
import { Switch } from 'rizzui';

export default function SwitchButton({ updateStatus, id, status }: { updateStatus: any; id: string; status: boolean }) {
  console.log('status', status);
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

    // <label className="mb-5 inline-flex cursor-pointer items-center">
    //   <input type="checkbox" value="" className="peer sr-only" checked={checked} onChange={handleUpdateStatus} />
    //   <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full"></div>
    //   <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Toggle me</span>
    // </label>
  );
}
