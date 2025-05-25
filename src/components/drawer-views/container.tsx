'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Drawer } from 'rizzui';
import { useDrawer } from './use-drawer';

export default function GlobalDrawer() {
  const { isOpen, view, placement, customSize, closeDrawer } = useDrawer();
  const pathname = usePathname();

  useEffect(() => {
    closeDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeDrawer}
      placement={placement}
      customSize={customSize}
      className="sxl:hidden"
      overlayClassName="dark:bg-opacity-40 dark:backdrop-blur-md"
      containerClassName="dark:bg-gray-100 min-w-32 max-w-[300px]"
    >
      <div
        onMouseLeave={() => {
          closeDrawer();
        }}
      >
        {view}
      </div>
    </Drawer>
  );
}
