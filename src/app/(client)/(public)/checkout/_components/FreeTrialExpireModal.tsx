import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import Link from 'next/link';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { IoCloseOutline } from 'react-icons/io5';
import { ActionIcon, Modal } from 'rizzui';

export default function FreeTrialExpireModal({
  modalState = false,
  setModalState,
  allowTotalUser,
  allowTotalScan,
}: {
  allowTotalUser: number | null;
  allowTotalScan: number | null;
  modalState?: boolean;
  setModalState: (state: boolean) => void;
}) {
  return (
    <Modal isOpen={modalState} onClose={() => setModalState(false)}>
      <div className="mx-auto mt-10 max-w-full overflow-hidden rounded-lg border border-gray-200 shadow-lg">
        {/* Header */}
        <div className="bg-red-600 p-6 text-center text-white">
          <div className="flex items-center justify-end">
            <ActionIcon size="sm" variant="text" onClick={() => setModalState(false)}>
              <IoCloseOutline className="text-2xl font-bold text-white" />
            </ActionIcon>
          </div>
          <img
            src="/images/stampezee_header_logo.png" // replace with your actual logo path
            alt="StampEzee Logo"
            className="mx-auto mb-4 w-16"
          />
          <h1 className="text-2xl font-semibold">Stamp Start Milestone Achieved! 🎉</h1>
        </div>

        {/* Body */}
        <div className="bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-red-600">
            {`🎉 Woohoo! You’ve maxed out on your Stamp Start plan which includes up to  `}
            <span className="font-semibold">
              {allowTotalScan ? allowTotalScan : 'unlimited'} scans and {allowTotalUser ? allowTotalUser : 'unlimited'}
            </span>{' '}
            users. that’s a loyalty milestone! 🚦
          </h2>
          <p className="mb-4 text-gray-700">
            To keep the rewards flowing and customers coming back, upgrade now and unlock even more features.
          </p>

          <div className="mt-10 flex justify-center gap-2">
            <Link href={routes.privateRoutes.retailer.membershipPlan}>
              <Button text="Upgrade Now" color="danger" postIcon={<FaArrowTrendUp className="text-lg" />} />
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
