'use client';
import { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { ActionIcon, Button, Checkbox, Input, Modal, Password, Text } from 'rizzui';

export default function CreateModel() {
  const [modalState, setModalState] = useState(false);
  return (
    <>
      <Button onClick={() => setModalState(true)}>Custom Style Modal</Button>
      <Modal
        isOpen={modalState}
        onClose={() => setModalState(false)}
        overlayClassName="backdrop-blur"
        containerClassName="!max-w-4xl !shadow-2xl"
      >
        <div className="m-auto px-7 pb-8 pt-6">
          <div className="mb-7 flex items-center justify-between">
            <Text>Welcome to RizzUI</Text>
            <ActionIcon size="sm" variant="text" onClick={() => setModalState(false)}>
              <RxCross2 className="h-auto w-6" strokeWidth={1.8} />
            </ActionIcon>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-6 [&_label>span]:font-medium">
            <Input label="First Name *" inputClassName="border-2" size="lg" />
            <Input label="Last Name *" inputClassName="border-2" size="lg" />
            <Input label="Email *" inputClassName="border-2" size="lg" className="col-span-2" />
            <Password label="Password *" inputClassName="border-2" size="lg" className="col-span-2" />
            <Password label="Confirm Password *" inputClassName="border-2" size="lg" className="col-span-2" />
            <Checkbox
              size="lg"
              inputClassName="border-2"
              className="col-span-2"
              label={
                <Text className="text-sm">
                  I agree to RizzUI&lsquo;s <a className="underline">Terms of Service</a> and <a className="underline">Privacy Policy</a>
                </Text>
              }
            />
            <Button type="submit" size="lg" className="col-span-2 mt-2" onClick={() => setModalState(false)}>
              Create an Account
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
