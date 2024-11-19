import Button from '@/components/Formik/Button';
import Link from 'next/link';
import { BsCheck2Circle } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';
import { MdDoNotDisturb } from 'react-icons/md';
import { ActionIcon, Modal } from 'rizzui';

export default function UpgradeConfirmModal({
  modalState = false,
  setModalState,
  selectedCurrency,
  payableAmount,
  total,
  handleUpgradeConfirm,
  planChangeType,
}: {
  modalState?: boolean;
  payableAmount: number;
  total: number;
  selectedCurrency: string;
  planChangeType: string;
  setModalState: (state: boolean) => void;
  handleUpgradeConfirm: () => void;
}) {
  return (
    <Modal isOpen={modalState} onClose={() => setModalState(false)}>
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-5 flex items-center justify-end">
          <ActionIcon size="sm" variant="text" onClick={() => setModalState(false)}>
            <IoCloseOutline className="text-2xl text-danger" />
          </ActionIcon>
        </div>
        <div>
          <Link href="/" className="flex items-center justify-center rtl:space-x-reverse">
            <img src="images/logo.png" className="h-24" alt="stamp-ezee Logo" />
            <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white"></span>
          </Link>
        </div>

        <h2 className="my-5 text-center text-lg font-semibold text-danger">{`${planChangeType === 'downgrade' ? 'Downgrade' : 'Upgrade'} Confirmation!`}</h2>

        <span className="text-center text-base font-medium">
          Your {`${planChangeType === 'downgrade' ? 'downgrade' : 'upgrade'}`} includes an additional charge for retaining your previous
          add-on(s).
          <span className=" text-danger"> The total extra payable amount is {`${payableAmount} ${selectedCurrency}`}</span>. Confirm to
          proceed with your enhanced plan!
        </span>

        <h2 className="my-5 text-lg font-semibold text-danger">
          The total payable amount is{' '}
          {`${total} + ${payableAmount} = ${(Number(total) + Number(payableAmount)).toFixed(2)} ${selectedCurrency}`}
        </h2>
        <div className="mt-10 flex justify-end gap-2">
          <Button
            color="danger"
            onClick={() => setModalState(false)}
            text={'Not Now'}
            postIcon={<MdDoNotDisturb className="text-base" />}
          />
          <Button
            color="primary"
            onClick={handleUpgradeConfirm}
            text={'Yes, Confirm'}
            postIcon={<BsCheck2Circle className="text-base" />}
            isSubmitting={false}
          />
        </div>
      </div>
    </Modal>
  );
}
