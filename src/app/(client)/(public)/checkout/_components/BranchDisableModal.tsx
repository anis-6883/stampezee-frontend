import Button from '@/components/Formik/Button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';
import { ActionIcon, Modal } from 'rizzui';

import { AdvancedCheckbox, CheckboxGroup, Text } from 'rizzui';

interface BranchDisableOption {
  title: string;
  value: string;
}

export default function BranchDisableModal({
  totalDisabledBranch = 0,
  options = [],
  modalState = false,
  selectedBranches = [],
  setModalState,
  setSelectedBranches,
  selectedStamps = [],
  setSelectedStamps,
  totalDisabledStamp = 0,
  disableStampOptions = [],
}: {
  modalState?: boolean;
  setModalState: (state: boolean) => void;
  setSelectedBranches: any;
  options: BranchDisableOption[];
  selectedBranches: string[];
  totalDisabledBranch: number;
  selectedStamps?: any;
  setSelectedStamps?: any;
  totalDisabledStamp?: number;
  disableStampOptions?: any;
}) {
  const t = useTranslations('CheckoutPage');
  const handleDisableBranch = () => {
    if (selectedBranches?.length !== totalDisabledBranch) {
      toast.error(`You Should Select ${totalDisabledBranch} branches`);
      return;
    }
    if (selectedStamps?.length !== totalDisabledStamp) {
      toast.error(`You Should Select ${totalDisabledStamp} stamps`);
      return;
    }
    setModalState(false);
  };

  const checkDisableBranch = (item: any) => {
    const isExist = selectedBranches.includes(item.value);
    return !isExist && selectedBranches?.length >= totalDisabledBranch;
  };

  const checkDisableStamp = (item: any) => {
    const isExist = selectedStamps.includes(item.value);
    return !isExist && selectedStamps?.length >= totalDisabledStamp;
  };

  // Get the raw translation string
  const rawMessage = t.raw('branchDisableMessage');

  // Replace the placeholder in the translation string
  const formattedMessage = rawMessage.replace('{totalDisabledBranch}', `<span class='font-bold text-danger'>${totalDisabledBranch}</span>`);

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
        {/* Branch Disables for Downgrade  */}
        {totalDisabledBranch > 0 && (
          <>
            <p className="mt-5 text-center text-base font-medium">
              <span dangerouslySetInnerHTML={{ __html: formattedMessage }} />
              {/* For downgrading, you must <span className="font-bold text-danger">select {totalDisabledBranch} branch/s</span> to disable by the
            system! */}
            </p>
            <p className="mt-2 text-end text-base font-medium">
              {selectedBranches?.length} / {totalDisabledBranch}
            </p>
            <div className="my-5">
              <CheckboxGroup
                values={selectedBranches}
                setValues={setSelectedBranches}
                className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3"
              >
                {options.map((item) => (
                  <AdvancedCheckbox
                    disabled={checkDisableBranch(item)}
                    key={item.value}
                    name="branch"
                    value={item.value}
                    contentClassName={`rounded-lg border hover:border-danger ${selectedBranches.includes(item.value) ? '!border-danger ring-1 !ring-danger' : '!ring-0'}`}
                    inputClassName="[&:checked~span_.icon]:block"
                  >
                    <span className="flex justify-between">
                      <Text as="b">{item.title}</Text>
                      {/* <LuCheckCircle className="icon hidden h-5 w-5 text-danger" /> */}
                    </span>
                  </AdvancedCheckbox>
                ))}
              </CheckboxGroup>
            </div>
          </>
        )}

        {/* Stamps Delete for Downgrading  */}
        {totalDisabledStamp > 0 && (
          <>
            {' '}
            <p className="mt-5 text-center text-base font-medium">
              {/* <span dangerouslySetInnerHTML={{ __html: formattedMessage }} /> */}
              For downgrading, you must <span className="font-bold text-danger">select {totalDisabledStamp} stamp/s</span> to delete by the
              system!
            </p>
            <p className="mt-2 text-end text-base font-medium">
              {selectedStamps?.length} / {totalDisabledStamp}
            </p>
            <div className=" my-5">
              <CheckboxGroup
                values={selectedStamps}
                setValues={setSelectedStamps}
                className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2"
              >
                {disableStampOptions.map((item: any) => (
                  <AdvancedCheckbox
                    disabled={checkDisableStamp(item)}
                    key={item.value}
                    name="stamp"
                    value={item.value}
                    className=""
                    contentClassName={`rounded-lg border hover:border-danger ${selectedStamps.includes(item.value) ? '!border-danger ring-1 !ring-danger' : '!ring-0'}`}
                    inputClassName="[&:checked~span_.icon]:block"
                  >
                    <span className=" group flex  justify-between overflow-x-hidden">
                      <Text className="group-hover:paused animate-marquee whitespace-nowrap" as="b">
                        {item.title}
                      </Text>
                      {/* <LuCheckCircle className="icon hidden h-5 w-5 text-danger" /> */}
                    </span>
                  </AdvancedCheckbox>
                ))}
              </CheckboxGroup>
            </div>
          </>
        )}

        <div className="mt-4 flex justify-center gap-2">
          <Button onClick={handleDisableBranch} color="danger" text="Confirm" postIcon={<BsCheck2Circle className="text-base" />} />
        </div>
      </div>
    </Modal>
  );
}
