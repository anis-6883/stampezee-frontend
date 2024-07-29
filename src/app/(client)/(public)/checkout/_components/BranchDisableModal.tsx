import Button from '@/components/Formik/Button';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { LuCheckCircle } from 'react-icons/lu';
import { Modal } from 'rizzui';

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
}: {
  modalState?: boolean;
  setModalState: (state: boolean) => void;
  setSelectedBranches: any;
  options: BranchDisableOption[];
  selectedBranches: string[];
  totalDisabledBranch: number;
}) {
  const handleDisableBranch = () => {
    if (selectedBranches?.length !== totalDisabledBranch) {
      toast.error(`You Should Select ${totalDisabledBranch} branches`);
      return;
    }
    setModalState(false);
  };

  const checkDisableBranch = (item: any) => {
    const isExist = selectedBranches.includes(item.value);
    return !isExist && selectedBranches?.length >= totalDisabledBranch;
  };

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(false)}>
      <div className="m-auto px-7 pb-8 pt-6">
        <div>
          <Link href="/" className="flex items-center justify-center rtl:space-x-reverse">
            <img src="images/logo.png" className="h-24" alt="stamp-ezee Logo" />
            <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white"></span>
          </Link>
        </div>

        <p className="mt-5 text-center text-base font-medium">
          For downgrading, you must <span className="font-bold text-danger">select {totalDisabledBranch} branch/s</span> to disable by the
          system!
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
                  <LuCheckCircle className="icon hidden h-5 w-5 text-danger" />
                </span>
              </AdvancedCheckbox>
            ))}
          </CheckboxGroup>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <Button onClick={handleDisableBranch} color="danger" text="Confirm" postIcon={<BsCheck2Circle className="text-base" />} />
        </div>
      </div>
    </Modal>
  );
}
