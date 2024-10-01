import Button from '@/components/Formik/Button';
import { BsCheck2Circle, BsExclamationTriangle } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';
import { MdDoNotDisturb } from 'react-icons/md';
import { ActionIcon, Modal } from 'rizzui';

export default function ConvertToAddOnModal({
  modalState = false,
  convertId,
  convertHandler,
  setModalState,
  isSubmitting,
  setIsSubmitting,
}: {
  modalState?: boolean;
  convertId: string | null;
  convertHandler: (id: string) => void;
  setModalState: (state: boolean) => void;
  isSubmitting?: boolean;
  setIsSubmitting: (state: boolean) => void;
}) {
  const handleConvert = () => {
    setIsSubmitting(true);
    if (convertId) {
      convertHandler(convertId);
      setModalState(false);
    }
  };

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(false)}>
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-danger">
            <BsExclamationTriangle className="text-xl" /> Covert To Add-On Confirmation
          </h3>

          <ActionIcon size="sm" variant="text" onClick={() => setModalState(false)}>
            <IoCloseOutline className="text-2xl text-danger" />
          </ActionIcon>
        </div>
        <p className="text-base font-medium">Do you want to covert to add-on it ?</p>
        <div className="mt-10 flex justify-end gap-2">
          <Button color="danger" onClick={() => setModalState(false)} text="Not Now" postIcon={<MdDoNotDisturb className="text-base" />} />
          <Button
            color="primary"
            onClick={handleConvert}
            text="Yes, Confirm"
            postIcon={<BsCheck2Circle className="text-base" />}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </Modal>
  );
}
