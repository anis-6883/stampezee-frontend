"use client";

import ModalButton from "@/components/modal-views/modal-button";
import { useModal } from "@/components/modal-views/use-modal";
import { LuTrash2 } from "react-icons/lu";

export default function DeleteConfirmation({
  id,
  deleteFunction,
  title = "this item"
}: {
  id: string;
  deleteFunction: any;
  title?: string;
}) {
  const { closeModal } = useModal();
  const handleDelete = () => {
    deleteFunction(id).then((res: any) => {
      if (res.data.status) {
        closeModal();
      }
    });
  };
  return (
    <ModalButton
      view={
        <div>
          <p className='text-lg font-semibold'>Are you sure you want to remove {title}? </p>
          <p className='text-xs my-5'>This action cannot be undone.</p>
          <div className='flex justify-end items-end space-x-2'>
            <button
              className='bg-primary hover:bg-primary-dark duration-300 transition-all py-2 px-3 rounded-md flex space-x-2 items-center text-white'
              onClick={handleDelete}
            >
              Confirm
            </button>
            <button
              className='bg-red hover:bg-red-dark duration-300 transition-all py-2 px-3 rounded-md flex space-x-2 items-center text-white'
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      }
      icon={<LuTrash2 color='red' size={20} />}
      label=''
    />
  );
}
