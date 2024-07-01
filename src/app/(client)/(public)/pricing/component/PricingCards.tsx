'use client';

import { setSubscription } from '@/features/subscription/subscriptionSlice';
import 'aos/dist/aos.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'rizzui';

export default function PricingCards({ item }: { item: any }) {
  const { authSlice }: any = useSelector((state) => state);
  const [modalState, setModalState] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  function checkLogin() {
    if (authSlice?.isLoggedIn === false) {
      toast.error('Please Login first');
      return;
    } else {
      dispatch(setSubscription(item));
      router.push('/checkout');
    }
  }

  return (
    <div className="relative mx-auto flex h-full w-full max-w-lg flex-col rounded-lg border-gray-100 bg-white p-3 text-gray-900 opacity-80 shadow-lg dark:bg-gray-800 dark:text-white xl:p-8">
      <h3 className="mb-4 text-xl font-semibold">{item.title}</h3>
      <div className="my-2 flex items-baseline">
        <span className="mr-2 text-xl font-bold xl:text-3xl xl:font-extrabold">
          <sup className="font-medium capitalize">CAD</sup>
          {item.price}
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          /{item.duration === 30 ? 1 : item.duration} {item.duration === 30 ? 'Month' : 'Days'}
        </span>
      </div>
      <img
        src={item?.image ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${item?.image}` : '/images/layer.png'}
        alt="icon"
        className="mb-5 h-8 w-8"
      />

      <ul role="list" className="mb-[75px] space-y-4 text-left ">
        {item.descriptions.map((info: any) => (
          <li className="flex items-center space-x-3" key={info}>
            <svg
              className="h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>{info}</span>
          </li>
        ))}
      </ul>
      <Button
        onClick={checkLogin}
        className="dark:focus:ring-red absolute bottom-[51px] left-[10%] w-[80%] rounded-lg border-0 bg-[#DF2828] px-5 py-2.5 text-center text-sm font-medium text-white transition-all duration-300 ease-in-out hover:bg-red-500 focus:ring-4 focus:ring-transparent dark:text-white"
      >
        Get started
      </Button>
    </div>
  );
}
