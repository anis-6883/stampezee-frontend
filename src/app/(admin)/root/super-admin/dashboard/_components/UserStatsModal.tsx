import { IoCloseOutline } from 'react-icons/io5';
import { ActionIcon, Badge, Modal, Title } from 'rizzui';

export default function UserStatsModal({
  modalState,
  setModalState,
  activeUsersStats,
}: {
  modalState: boolean;
  setModalState: (state: boolean) => void;
  activeUsersStats: [];
}) {
  return (
    <div>
      <Modal isOpen={modalState} onClose={() => setModalState(true)} customSize="700px">
        <div className="m-auto px-7 pb-8 pt-6">
          <div className="mb-7 flex items-center justify-between">
            <Title as="h4">Active Users</Title>

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

          <div className="mt-3 rounded-lg border border-danger p-3">
            {/* <p className="mb-2 flex items-center gap-x-1 text-sm font-semibold">
              <MdBlock className="text-xl" /> Active Users :
            </p> */}
            <div>
              {activeUsersStats?.map((item: any) => (
                <Badge className="m-1 bg-danger" key={item?.value}>
                  <span className="text-white">{`${item?.name} : ${item?.value}%`}</span>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
