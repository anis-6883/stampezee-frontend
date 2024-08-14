import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { BsCheck2Circle, BsExclamationTriangle } from 'react-icons/bs';
import { HiMiniXCircle } from 'react-icons/hi2';
import { MdDoNotDisturb } from 'react-icons/md';
import { ActionIcon, Modal } from 'rizzui';

export default function StampPublishedModal({
  modalState = false,
  publishId,
  publishHandler,
  setModalState,
  isSubmitting,
  setIsSubmitting,
  values,
  stampId,
}: {
  modalState?: boolean;
  publishId?: string | null;
  publishHandler: any;
  setModalState: (state: boolean) => void;
  isSubmitting?: boolean;
  values?: any;
  stampId?: any;
  setIsSubmitting: (state: boolean) => void;
}) {
  const router = useRouter();
  const handlePublish = async () => {
    setIsSubmitting(true);
    if (publishId) {
      publishHandler(publishId);
      setModalState(false);
    } else {
      if (stampId) {
        const result = await publishHandler({ formData: values, id: stampId }).unwrap();
        router.push(routes.privateRoutes.retailer.stamp.home);
        toast.success(result.data.message ?? 'Stamp updated successfully!');
      } else {
        const result = await publishHandler(values).unwrap();
        router.push(routes.privateRoutes.retailer.stamp.home);
        toast.success(result.data.message || 'Stamp created successfully!');
      }

      setModalState(false);
    }
  };

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(false)}>
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-danger">
            <BsExclamationTriangle className="text-xl" /> Publish Confirmation
          </h3>

          <ActionIcon size="sm" variant="text" onClick={() => setModalState(false)}>
            <HiMiniXCircle className="text-2xl text-danger" />
          </ActionIcon>
        </div>
        <p className="text-base font-medium">
          Do you want to publish it ? Once published, this stamp <span className="text-danger">can{"'"}t be edited!</span>
        </p>
        <div className="mt-10 flex justify-end gap-2">
          <Button color="danger" onClick={() => setModalState(false)} text="Not Now" postIcon={<MdDoNotDisturb className="text-base" />} />
          <Button
            color="primary"
            onClick={handlePublish}
            text="Yes, Confirm"
            postIcon={<BsCheck2Circle className="text-base" />}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </Modal>
  );
}
