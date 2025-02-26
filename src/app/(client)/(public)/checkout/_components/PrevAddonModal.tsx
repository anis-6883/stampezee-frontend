import Button from '@/components/Formik/Button';
import Link from 'next/link';
import { BsCheck2Circle } from 'react-icons/bs';
import { FaCircle } from 'react-icons/fa6';
import { IoCheckbox, IoCloseOutline, IoSquareOutline } from 'react-icons/io5';
import { ActionIcon, Modal } from 'rizzui';

export function PrevAddonModal({
  modalState = false,
  setModalState,
  existingAddons,
  selectedAddons,
  setSelectedAddons,
}: {
  modalState?: boolean;
  setModalState: (state: boolean) => void;
  existingAddons: any;
  selectedAddons: string[];
  setSelectedAddons: any;
}) {
  const handleParentCheckbox = (checkedItemId: string) => {
    let updatedData = [];
    if (selectedAddons?.includes(checkedItemId)) {
      updatedData = selectedAddons?.filter((item) => item !== checkedItemId);
    } else {
      updatedData = [...selectedAddons, checkedItemId];
    }
    setSelectedAddons(updatedData);
  };
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
        <p className="mb-3 mt-5 text-center text-base font-medium">
          Would you like to continue with your previous add-ons? Select the ones you need!
        </p>

        <div className="flex flex-col gap-y-2">
          {existingAddons?.map((item: any, index: number) => (
            <div key={item?._id} className="w-full rounded-lg border border-red-500 p-3">
              <button
                onClick={() => handleParentCheckbox(item?._id)}
                className="flex w-full items-center space-x-1 rounded-lg p-2 "
                aria-label="Toggle all settings"
              >
                <div className="transform text-2xl text-red-500 transition-transform duration-200 hover:scale-110">
                  {selectedAddons?.includes(item?._id) ? <IoCheckbox /> : <IoSquareOutline />}
                </div>
                <span className="flex items-center gap-x-1 text-lg font-semibold text-gray-800">
                  {`Bundle ${index + 1}`} <span className="text-sm">{`(${item?.stripe?.subscriptionId?.slice(0, 12)})`}</span>
                </span>
              </button>

              <div className="pl-8">
                {item?.enrollSubscriptions?.map((enrollSubscription: any) => (
                  <div
                    key={enrollSubscription?._id}
                    className={`flex items-center space-x-3 rounded-md  transition-all duration-200 ${selectedAddons?.includes(item?._id) ? 'opacity-100' : 'opacity-50'}`}
                  >
                    <div className="text-sm text-red-500">
                      <FaCircle className="h-2 w-2" />
                    </div>
                    <span className="text-md text-gray-600">{enrollSubscription?.planSnapshot?.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-2">
          <Button onClick={() => setModalState(false)} color="danger" text="Confirm" postIcon={<BsCheck2Circle className="text-base" />} />
        </div>
      </div>
    </Modal>
  );
}
