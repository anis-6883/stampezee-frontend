import Link from 'next/link';
import { IoCloseOutline } from 'react-icons/io5';
import { ActionIcon, Modal } from 'rizzui';

export default function ContactDetailsModal({
  modalState = false,
  setModalState,
  message = '',
}: {
  modalState?: boolean;
  message: string;
  setModalState: (state: boolean) => void;
}) {
  return (
    <Modal isOpen={modalState} onClose={() => setModalState(false)} customSize="740px">
      <div className="m-auto px-8 pb-8 pt-3">
        <div className="mb-5 flex items-center justify-end">
          <ActionIcon size="sm" variant="text" onClick={() => setModalState(false)}>
            <IoCloseOutline className="text-2xl text-danger" />
          </ActionIcon>
        </div>
        <div>
          <Link href="/" className="flex items-center justify-center rtl:space-x-reverse">
            <img src="/images/logo.png" className="h-[80px]" alt="stamp-ezee Logo" />
            <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white"></span>
          </Link>
        </div>

        <h2 className="my-5 text-center text-lg font-semibold text-danger">{`Contact Message!`}</h2>
        <div className="w-full rounded-2xl border border-red-500 p-4 text-justify">{message}</div>
      </div>
    </Modal>
  );
}
