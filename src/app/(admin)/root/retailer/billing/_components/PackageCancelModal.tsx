'use client';

import Button from '@/components/Formik/Button';
import { ROLE } from '@/config/constants';
import { RootState } from '@/features/store';
import { useTranslations } from 'next-intl';
import { BsCheck2Circle, BsExclamationTriangle } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';
import { MdDoNotDisturb } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { ActionIcon, Modal } from 'rizzui';

export default function PackageCancelModal({
  modalState = false,
  cancelSubscriptionId,
  cancelSubscriptionHandler,
  setModalState,
  isSubmitting,
  setIsSubmitting,
  isPlan = false,
}: {
  modalState?: boolean;
  cancelSubscriptionId: string | null;
  cancelSubscriptionHandler: (id: any) => void;
  setModalState: (state: boolean) => void;
  isSubmitting?: boolean;
  isPlan?: boolean;

  setIsSubmitting: (state: boolean) => void;
}) {
  const t = useTranslations('DeleteConfirmationModal');
  const { role } = useSelector((state: RootState) => state.authSlice);
  const handleCancel = () => {
    setIsSubmitting(true);
    if (cancelSubscriptionId) {
      cancelSubscriptionHandler({ enrollSubscriptionId: cancelSubscriptionId });
      setModalState(false);
    }
  };

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(false)}>
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-danger">
            <BsExclamationTriangle className="text-xl" /> {'Cancel Confirmation'}
          </h3>

          <ActionIcon size="sm" variant="text" onClick={() => setModalState(false)}>
            <IoCloseOutline className="text-2xl text-danger" />
          </ActionIcon>
        </div>
        <p className="text-base font-medium">Do you want to cancel it ?</p>
        {isPlan && (
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
              <span className="sr-only">{'Info'}</span>
              <div>
                <span className="font-medium">{'Warning!'}</span> <br />
                Associated add-ons will remain active until the end of the current billing cycle. Refunds, if eligible, will be processed as
                per our policy. Add-ons are non-refundable. If you re-purchase before the next billing, you will be given permission to
                restore previous add-ons!
              </div>
            </div>
          </div>
        )}
        <div className="mt-10 flex justify-end gap-2">
          <Button
            color="danger"
            className=""
            onClick={() => setModalState(false)}
            text={role === ROLE.SUPER_ADMIN ? 'Not Now' : t('notNow')}
            postIcon={<MdDoNotDisturb className="text-base" />}
          />
          <Button
            color="primary"
            onClick={handleCancel}
            text={role === ROLE.SUPER_ADMIN ? 'Yes, Confirm' : t('confirm')}
            postIcon={<BsCheck2Circle className="text-base" />}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </Modal>
  );
}
