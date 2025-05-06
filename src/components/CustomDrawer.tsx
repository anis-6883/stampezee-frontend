import { ReactNode } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { ActionIcon, Drawer, Title } from 'rizzui';

export default function CustomDrawer({
  drawerState,
  handleCloseDrawer,
  title,
  children,
  className,
  customSize = 409,
}: {
  title: string;
  drawerState: boolean;
  children: ReactNode;
  handleCloseDrawer: () => void;
  className?: string;
  customSize?: number;
}) {
  return (
    <Drawer customSize={customSize} isOpen={drawerState} onClose={handleCloseDrawer}>
      <div className={`flex min-h-full flex-col overflow-hidden ${className} py-4`}>
        <header className="flex items-center justify-between">
          <Title className="text-black" as="h4">
            {title}
          </Title>
          <ActionIcon size="sm" variant="text" onClick={handleCloseDrawer}>
            <IoCloseOutline className="text-2xl" />
          </ActionIcon>
        </header>
        {children}
      </div>
    </Drawer>
  );
}
