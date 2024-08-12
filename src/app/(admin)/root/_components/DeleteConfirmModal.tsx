import Button from '@/components/Formik/Button';
import { BsCheck2Circle, BsExclamationTriangle } from 'react-icons/bs';
import { HiMiniXCircle } from 'react-icons/hi2';
import { MdDoNotDisturb } from 'react-icons/md';
import { ActionIcon, Modal } from 'rizzui';

export default function DeleteConfirmModal({
  modalState = false,
  deleteId,
  deleteHandler,
  setModalState,
  isSubmitting,
  setIsSubmitting,
  isBranch = false,
}: {
  modalState?: boolean;
  deleteId: string | null;
  deleteHandler: (id: string) => void;
  setModalState: (state: boolean) => void;
  isSubmitting?: boolean;
  isBranch?: boolean;
  setIsSubmitting: (state: boolean) => void;
}) {
  const handleDelete = () => {
    setIsSubmitting(true);
    if (deleteId) {
      deleteHandler(deleteId);
      setModalState(false);
    }
  };

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(false)}>
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-danger">
            <BsExclamationTriangle className="text-xl" /> Delete Confirmation
          </h3>

          <ActionIcon size="sm" variant="text" onClick={() => setModalState(false)}>
            <HiMiniXCircle className="text-2xl text-danger" />
          </ActionIcon>
        </div>
        <p className="text-base font-medium">Do you want to delete it ?</p>
        {isBranch && (
          <div className="my-3">
            <div
              className="mb-4 flex items-center rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-gray-800 dark:text-red-400"
              role="alert"
            >
              <svg
                className="me-3 inline h-4 w-4 flex-shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Info</span>
              <div>
                <span className="font-medium">Warning!</span> Deleting this branch will also remove the associated Super Admin and stamp.
              </div>
            </div>
          </div>
        )}
        <div className="mt-10 flex justify-end gap-2">
          <Button color="danger" onClick={() => setModalState(false)} text="Not Now" postIcon={<MdDoNotDisturb className="text-base" />} />
          <Button
            color="primary"
            onClick={handleDelete}
            text="Yes, Confirm"
            postIcon={<BsCheck2Circle className="text-base" />}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </Modal>
  );
}
