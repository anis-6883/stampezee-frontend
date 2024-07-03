import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import Link from 'next/link';
import { BsCheck2Circle } from 'react-icons/bs';
import { Modal } from 'rizzui';

export default function LoginAlert({
  modalState = false,
  setModalState,
}: {
  modalState?: boolean;
  setModalState: (state: boolean) => void;
}) {
  return (
    <Modal isOpen={modalState} onClose={() => setModalState(false)}>
      <div className="m-auto px-7 pb-8 pt-6">
        <p className="mt-5 text-center text-base font-medium">Before you proceed to checkout, please log in to your account!</p>
        <div className="mt-10 flex justify-center gap-2">
          <Link href={routes.publicRoutes.retailerLogin + '?callback=checkout'}>
            <Button color="danger" text="Go to Login Page" postIcon={<BsCheck2Circle className="text-base" />} />
          </Link>
        </div>
      </div>
    </Modal>
  );
}
