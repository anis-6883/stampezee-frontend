import { IoCloseOutline } from 'react-icons/io5';
import { ActionIcon, Modal, Title } from 'rizzui';

export default function PolicyModal({
  modalState,
  setModalState,
  policy,
}: {
  modalState: boolean;
  policy: any;
  setModalState: (state: boolean) => void;
}) {
  return (
    <div>
      <Modal isOpen={modalState} onClose={() => setModalState(false)} customSize="900px">
        <div className="m-auto px-7 pb-8 pt-6">
          <div className="mb-6 flex items-center justify-between">
            <Title as="h4">Privacy Policy</Title>

            <ActionIcon
              size="sm"
              variant="text"
              onClick={() => {
                setModalState(false);
              }}
            >
              <IoCloseOutline className="text-2xl text-danger" />
            </ActionIcon>
          </div>
          <div className="ql-editor relative h-[340px] overflow-auto p-4 sm:rounded-lg">
            <div dangerouslySetInnerHTML={{ __html: policy ?? '' }} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
