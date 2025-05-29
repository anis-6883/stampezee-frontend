'use client';

import Button from '@/components/Formik/Button';
import { RootState } from '@/features/store';
import { useTranslations } from 'next-intl';
import { BsCheck2Circle } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';
import { MdDoNotDisturb } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { ActionIcon, Modal } from 'rizzui';

export default function DeleteStampModal({
  modalState = false,
  deleteId,
  deleteHandler,
  setModalState,
  isSubmitting,
  setIsSubmitting,
}: {
  modalState?: boolean;
  deleteId: string | null;
  deleteHandler: any;
  setModalState: any;
  isSubmitting?: boolean;
  isBranch?: boolean;
  setIsSubmitting: any;
}) {
  //   const t = useTranslations('DeleteConfirmationModal');
  //   const { role } = useSelector((state: RootState) => state.authSlice);
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
          <h3 className="flex items-center gap-2 text-lg font-semibold text-danger">{'Delete Stamp Card?'} ⚠️</h3>

          <ActionIcon size="sm" variant="text" onClick={() => setModalState(false)}>
            <IoCloseOutline className="text-2xl text-danger" />
          </ActionIcon>
        </div>
        <p className="text-base font-medium">
          {'Are you sure you want to delete this stamp card?'}
          <span className="text-danger"> This action can not be undone.</span>
        </p>

        <div className="mt-10 flex justify-end gap-2">
          <Button color="danger" onClick={() => setModalState(false)} text={'Cancel'} postIcon={<MdDoNotDisturb className="text-base" />} />
          <Button
            color="primary"
            onClick={handleDelete}
            text={'Yes, Delete'}
            postIcon={<BsCheck2Circle className="text-base" />}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </Modal>
  );
}
