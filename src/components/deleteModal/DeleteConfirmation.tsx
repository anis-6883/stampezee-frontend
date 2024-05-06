'use client';

import ModalButton from '@/components/modal-views/modal-button';
import { useModal } from '@/components/modal-views/use-modal';
import { LuTrash2 } from 'react-icons/lu';

export default function DeleteConfirmation({
  id,
  deleteFunction,
  title = 'this item',
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
          <p className="text-lg font-semibold">Are you sure you want to remove {title}? </p>
          <p className="my-5 text-xs">This action cannot be undone.</p>
          <div className="flex items-end justify-end space-x-2">
            <button
              className="hover:bg-primary-dark flex items-center space-x-2 rounded-md bg-primary px-3 py-2 text-white transition-all duration-300"
              onClick={handleDelete}
            >
              Confirm
            </button>
            <button
              className="flex items-center space-x-2 rounded-md bg-red px-3 py-2 text-white transition-all duration-300 hover:bg-red-dark"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      }
      icon={<LuTrash2 color="red" size={20} />}
      label=""
    />
  );
}
