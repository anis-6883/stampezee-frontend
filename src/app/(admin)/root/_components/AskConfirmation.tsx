'use client';

import { IResponse } from '@/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AskConfirmation(
  t: any,
  action: Function,
  msg: string = 'Confirm deletion of this item?',
  redirectUri: string = ''
) {
  const { push } = useRouter();
  return (
    <span>
      <b className="text-xl">{msg}</b>
      <div className="mt-3 flex justify-around">
        <button
          className="my-1 rounded bg-red-700 px-3 text-lg text-white"
          onClick={() => {
            toast.dismiss(t.id);
            toast.promise(action(), {
              loading: 'Deleting...',
              success: (data: IResponse) => {
                if (data?.data.status) {
                  if (redirectUri) {
                    push(redirectUri);
                  }
                  return data?.data.message;
                }
                throw new Error(data?.data.message);
              },
              error: (error) => {
                console.error(error);
                if (error?.message) return error?.message;
                return 'Something went wrong!';
              },
            });
          }}
        >
          Confirm
        </button>

        <button className="my-1 rounded border-2 bg-gray-300 px-3 text-lg" onClick={() => toast.dismiss(t.id)}>
          Dismiss
        </button>
      </div>
    </span>
  );
}
