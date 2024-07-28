import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { LiaCheckCircle } from 'react-icons/lia';
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
  selectdBranches = [],
  setModalState,
  setSelectdBranches,
}: {
  modalState?: boolean;
  setModalState: (state: boolean) => void;
  setSelectdBranches: any;
  options: BranchDisableOption[];
  selectdBranches: string[];
  totalDisabledBranch: number;
}) {
  const handleDisableBranch = () => {
    if (selectdBranches?.length !== totalDisabledBranch) {
      toast.error(`You Should Select ${totalDisabledBranch} branches`);
      return;
    }
    setModalState(false);
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

        <p className="mt-5 text-center text-base font-medium">If you want to downgrade? You should disable given branches.</p>
        <p className="mt-2 text-end text-base font-medium">
          {selectdBranches?.length} / {totalDisabledBranch}
        </p>
        <div className="my-5">
          <CheckboxGroup
            values={selectdBranches}
            setValues={setSelectdBranches}
            className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {options.map((item) => (
              <AdvancedCheckbox key={item.value} name="payment" value={item.value} inputClassName="[&:checked~span_.icon]:block">
                <span className="flex justify-between">
                  <Text as="b">{item.title}</Text>
                  <LuCheckCircle className="icon hidden h-5 w-5 text-secondary" />
                </span>
              </AdvancedCheckbox>
            ))}
          </CheckboxGroup>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <Button onClick={handleDisableBranch} color="danger" text="Submit" postIcon={<BsCheck2Circle className="text-base" />} />
        </div>
        {/* <p className="mt-5 text-center text-base font-medium">{message}</p>
        <div className="mt-10 flex justify-center gap-2">
          <Link href={routes.privateRoutes.retailer.branch.home}>
            <Button color="danger" text="Go to Branch Page" postIcon={<BsCheck2Circle className="text-base" />} />
          </Link>
        </div> */}
      </div>
    </Modal>
  );
}
