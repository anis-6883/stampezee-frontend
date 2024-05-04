'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Modal } from 'rizzui';
import { useModal } from './use-modal';

export default function GlobalModal() {
  const { isOpen, view, closeModal, customSize } = useModal();
  const pathname = usePathname();
  useEffect(() => {
    closeModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      customSize={customSize}
      overlayClassName="dark:bg-opacity-40 dark:backdrop-blur-lg"
      containerClassName="dark:bg-gray-100"
    >
      <div className="px-3 py-2 ">
        <div className="ml-auto flex items-end justify-end">
          <button onClick={closeModal}>
            <IoMdClose color="red" size={20} />
          </button>
        </div>
        {view}
      </div>
    </Modal>
  );
}
