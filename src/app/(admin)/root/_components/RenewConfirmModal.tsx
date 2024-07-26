import Button from '@/components/Formik/Button';
import { BsCheck2Circle, BsExclamationTriangle } from 'react-icons/bs';
import { HiMiniXCircle } from 'react-icons/hi2';
import { MdDoNotDisturb } from 'react-icons/md';
import { ActionIcon, Modal } from 'rizzui';

export default function RenewConfirmModal({
  modalState = false,
  renewId,
  renewHandler,
  setModalState,
  isSubmitting,
  setIsSubmitting,
}: {
  modalState?: boolean;
  renewId: string | null;
  renewHandler: (id: string) => void;
  setModalState: (state: boolean) => void;
  isSubmitting?: boolean;
  setIsSubmitting: (state: boolean) => void;
}) {
  const handleRenew = () => {
    setIsSubmitting(true);
    if (renewId) {
      renewHandler(renewId);
      setModalState(false);
    }
  };

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(false)}>
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-danger">
            <BsExclamationTriangle className="text-xl" /> renew Confirmation
          </h3>

          <ActionIcon size="sm" variant="text" onClick={() => setModalState(false)}>
            <HiMiniXCircle className="text-2xl text-danger" />
          </ActionIcon>
        </div>
        <p className="text-base font-medium">Do you want to renew it ?</p>
        <div className="mt-10 flex justify-end gap-2">
          <Button color="danger" onClick={() => setModalState(false)} text="Not Now" postIcon={<MdDoNotDisturb className="text-base" />} />
          <Button
            color="primary"
            onClick={handleRenew}
            text="Yes, Confirm"
            postIcon={<BsCheck2Circle className="text-base" />}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </Modal>
  );
}
