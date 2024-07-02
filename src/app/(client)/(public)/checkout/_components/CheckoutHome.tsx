'use client';

import Button from '@/components/Formik/Button';
import { RootState } from '@/features/store';
import { useCreateCheckOutMutation, useGetSubscriptionQuery } from '@/features/super-admin/Subscription/stampImageApi';
import { AddOn, Subscription } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BsCheck2Circle } from 'react-icons/bs';
import { IoCheckmarkDoneCircle } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import LoginAlert from './LoginAlert';

export function CheckoutHome() {
  const [modalState, setModalState] = useState(false);
  const { isLoggedIn } = useSelector((state: RootState) => state.authSlice);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, AddOn & { quantity: number }>>({});

  const selectedTotalAddons = Object.values(selectedAddOns).map((item) => item.slug);
  const subSlugs = [selectedSub?.slug, ...selectedTotalAddons];
  const { push } = useRouter();
  const [checkOut, { isSuccess: checkOutSuccess, error: checkOutError, data: checkOutResponse, isLoading: checkOutLoading }] =
    useCreateCheckOutMutation();
  const { data, isLoading } = useGetSubscriptionQuery(undefined);
  const subscription = data?.data?.filter((item: Subscription) => item.type === 'subscription');
  const addOns = data?.data?.filter((item: Subscription) => item.type === 'addon');
  const { data: activeSubscription } = useSelector((state: RootState) => state.subscriptionSlice);

  useEffect(() => {
    if (checkOutResponse) {
      push(checkOutResponse.data.url);
    }
  }, [checkOutResponse, push]);

  useEffect(() => {
    if (!isLoading && !selectedSub) {
      setSelectedSub(activeSubscription);
    }
  }, [isLoading, activeSubscription, selectedSub]);

  const discount = 10;
  const tax = 20;

  const handleSubscription = (plan: Subscription) => {
    setSelectedSub(plan);
  };

  const handleAddOnSelect = (addOn: AddOn) => {
    setSelectedAddOns((prev) => {
      const newAddOns = { ...prev };
      if (newAddOns[addOn._id]) {
        newAddOns[addOn._id].quantity += 1;
      } else {
        newAddOns[addOn._id] = { ...addOn, quantity: 1 };
      }
      return newAddOns;
    });
  };

  const handleRemoveAddOn = (addOnId: string) => {
    setSelectedAddOns((prev) => {
      const newAddOns = { ...prev };
      if (newAddOns[addOnId].quantity > 1) {
        newAddOns[addOnId].quantity -= 1;
      } else {
        delete newAddOns[addOnId];
      }
      return newAddOns;
    });
  };

  const subTotal = selectedSub
    ? selectedSub.price - discount + tax + Object.values(selectedAddOns).reduce((total, addOn) => total + addOn.price * addOn.quantity, 0)
    : 0;

  const handleCheckOut = () => {
    if (!isLoggedIn) {
      setModalState(true);
    }
    // if (subSlugs.length > 0) {
    //   checkOut({ slugs: subSlugs });
    // }
  };

  return (
    <div className="mx-auto mt-20 w-full max-w-[1300px]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Checkout</h1>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold">Plans</h2>
            <p className="mb-6 text-gray-600">Select a subscription plan</p>
            <div className="mb-6 border-l-4 border-blue-400 bg-blue-50 p-4">
              <p className="font-medium text-blue-700">Change Plan</p>
              <p className="text-blue-700">You will be billed immediately when switching plans</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {subscription?.map((item: Subscription, index: number) => (
                <div
                  onClick={() => handleSubscription(item)}
                  key={index}
                  className={`relative cursor-pointer rounded-lg border p-4 ${
                    selectedSub?._id === item._id ? 'scale-105 border-2 border-red-600 ring-1 ring-red-400' : 'border'
                  } hover:border-red-600`}
                >
                  <h3 className="mb-2 text-base font-semibold">{item.title}</h3>
                  <p className="mb-2 text-xl font-bold">
                    {item.price} CAD/{item.duration === 30 ? 'Month' : `${item.duration} Days`}
                  </p>
                  <ul className="text-gray-600">
                    {item.descriptions.map((info, idx) => (
                      <li className="flex items-center space-x-3" key={idx}>
                        <IoCheckmarkDoneCircle className="text-2xl text-danger" /> <span className="mx-1 my-1">{info}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <h2 className="mb-4 text-xl font-semibold">Add-Ons</h2>
              <p className="mb-6 text-gray-600">Select additional services</p>
              <div className="mb-6 border-l-4 border-blue-400 bg-blue-50 p-4">
                <p className="font-medium text-blue-700">Select Multiple Add on</p>
                <p className="text-blue-700">You can able to selected multiple add on</p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {addOns?.map((addOn: AddOn, index: number) => (
                  <div key={index}>
                    {selectedSub?.slug !== 'trial' ? (
                      <div
                        onClick={() => handleAddOnSelect(addOn)}
                        className={`relative cursor-pointer rounded-lg border p-4 ${
                          selectedAddOns[addOn._id] ? 'border-red-600 ring-1 ring-red-400' : 'border'
                        } hover:border-red-600`}
                      >
                        <h3 className="mb-2 text-base font-semibold">{addOn.title}</h3>
                        <p className="mb-2 text-xl font-bold">{addOn.price} CAD/month</p>
                      </div>
                    ) : (
                      <div className={`relative cursor-not-allowed rounded-lg border p-4 opacity-50 `}>
                        <h3 className="mb-2 text-base font-semibold">{addOn.title}</h3>
                        <p className="mb-2 text-xl font-bold">{addOn.price} CAD/month</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex justify-between">
                <span>Subtotal</span>
                <span className="text-red-500">{selectedSub ? selectedSub.price : 0} CAD</span>
              </div>
              <div>
                {Object.values(selectedAddOns).map((addOn, index) => (
                  <div key={index} className="mb-2 grid w-full grid-cols-5">
                    <span className="col-span-2">{addOn.title}</span>
                    <button onClick={() => handleRemoveAddOn(addOn._id)} className="col-span-2 text-red-500">
                      Remove
                    </button>
                    <span className="justify-self-end">{addOn.price} CAD</span>
                  </div>
                ))}
              </div>
              <div className="mb-2 flex justify-between">
                <span>Discount</span>
                <span className="text-red-500">-{discount} CAD</span>
              </div>
              <div className="mb-2 flex justify-between">
                <span>Tax</span>
                <span>{tax} CAD</span>
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-red-500">{subTotal.toFixed(2)} CAD</span>
              </div>
            </div>

            <Button
              color="danger"
              text="Checkout Confirm"
              className="mt-5 w-full"
              isSubmitting={checkOutLoading}
              onClick={handleCheckOut}
              postIcon={<BsCheck2Circle className="text-base" />}
            />
          </div>
        </div>
      </div>
      <LoginAlert modalState={modalState} setModalState={setModalState} />
    </div>
  );
}
