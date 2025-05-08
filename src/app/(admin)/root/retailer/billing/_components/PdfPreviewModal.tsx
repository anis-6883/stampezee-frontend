import { Skeleton } from '@/components/ui/skeleton';
import { IoCloseOutline } from 'react-icons/io5';
import { ActionIcon, Modal } from 'rizzui';

export default function PdfPreviewModal({
  modalState = false,
  setModalState,
  pdfUrl,
  loading = false,
}: {
  modalState?: boolean;
  setModalState: (state: boolean) => void;
  pdfUrl: string;
  loading: boolean;
}) {
  return (
    <Modal isOpen={modalState} onClose={() => setModalState(false)} customSize="700px">
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className=" text-xl font-bold text-black">{`Invoice Preview`}</h2>
          <ActionIcon size="sm" variant="text" onClick={() => setModalState(false)}>
            <IoCloseOutline className="text-2xl text-danger" />
          </ActionIcon>
        </div>

        {loading || !pdfUrl ? <Skeleton className="h-96 w-full" /> : <iframe src={pdfUrl} width="100%" height="600px" />}
      </div>
    </Modal>
  );
}
