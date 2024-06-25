'use client';

import { RootState } from '@/features/store';
import { useCreateCheckOutMutation, useGetSubscriptionQuery } from '@/features/super-admin/Subscription/stampImageApi';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const CheckoutHome = () => {
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<any>({});

  const selectedTotalAddons = Object.values(selectedAddOns).map((item: any) => item.slug);

  const subSlugs = [selectedSub?.slug, ...selectedTotalAddons];
  const [checkOut, { isSuccess: checkOutSuccess, error: checkOutError }] = useCreateCheckOutMutation();
  const { data, isLoading } = useGetSubscriptionQuery(undefined);
  const subscription = data?.data?.filter((items: any) => items.type === 'subscription');
  const addOns = data?.data?.filter((items: any) => items.type === 'addon');

  const { data: activeSubscription } = useSelector((state: RootState) => state.subscriptionSlice);

  useEffect(() => {
    if (!isLoading && !selectedSub) {
      setSelectedSub(activeSubscription);
    }
  }, [isLoading, activeSubscription, selectedSub]);

  const discount = 10;
  const tax = 20;

  const handleSubscription = (plan: any) => {
    setSelectedSub(plan);
  };

  const handleAddOnSelect = (addOn: any) => {
    setSelectedAddOns((prev: any) => {
      const newAddOns = { ...prev };
      if (newAddOns[addOn._id] && newAddOns[addOn._id]._id === selectedAddOns._id) {
        newAddOns[addOn._id].quantity += 1;
      } else {
        newAddOns[addOn._id] = { ...addOn, quantity: 1 };
      }
      return newAddOns;
    });
  };

  const handleRemoveAddOn = (addOnId: number) => {
    setSelectedAddOns((prev: any) => {
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
    ? selectedSub.price -
      discount +
      tax +
      Object.values(selectedAddOns).reduce((total: number, addOn: any) => total + addOn.price * addOn.quantity, 0)
    : 0;

  const handleCheckOut = () => {
    if (subSlugs.length > 0) {
      checkOut({
        slugs: subSlugs,
      });
    }
  };

  return (
    <div className="mx-auto mt-20 w-full max-w-[1300px]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Checkout</h1>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Plan Selection */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold">Plan</h2>
            <p className="mb-6 text-gray-600">Select a subscription plan</p>
            <div className="mb-6 border-l-4 border-blue-400 bg-blue-50 p-4">
              <p className="font-medium text-blue-700">Change Plan</p>
              <p className="text-blue-700">You will be billed immediately when switching plans</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Subscription Plans */}
              {subscription?.map((item: any, index: number) => (
                <div
                  onClick={() => handleSubscription(item)}
                  key={index}
                  className={`relative cursor-pointer rounded-lg border p-4 ${
                    selectedSub?._id === item._id ? 'border-blue-600' : 'border'
                  } hover:border-blue-600`}
                >
                  <h3 className="mb-2 text-xl font-semibold">{item?.title}</h3>
                  <p className="mb-2 text-lg font-bold">
                    {item?.price} CAD/{item.duration === 30 ? 'Month' : `${item.duration} Days`}
                  </p>
                  <ul className="text-gray-600">
                    {item.descriptions.map((info: any, idx: number) => (
                      <li className="flex items-center space-x-3" key={idx}>
                        ✔ <span className="mx-1">{info}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {/* Add-On section */}
            <div className="mt-6">
              <h2 className="mb-4 text-xl font-semibold">Add-On</h2>
              <p className="mb-6 text-gray-600">Select additional services</p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Add-On Plans */}
                {addOns?.map((addOn: any, index: number) => (
                  <div
                    key={index}
                    onClick={() => handleAddOnSelect(addOn)}
                    className={`relative cursor-pointer rounded-lg border p-4 ${
                      selectedAddOns[addOn._id] ? 'border-blue-600' : 'border'
                    } hover:border-blue-600`}
                  >
                    <h3 className="mb-2 text-xl font-semibold">{addOn.title}</h3>
                    <p className="mb-2 text-lg font-bold">{addOn.price} CAD/mo</p>
                    <ul className="text-gray-600">
                      <li>✔ 1 branch</li>
                      <li>✔ Branch management</li>
                      <li>✔ 7 days trial</li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Order Summary */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex justify-between">
                <span>Unused time on Pro Subscription after 30 Apr 2024</span>
                <span className="text-red-500">-19.96 CAD</span>
              </div>
              <div className="mb-2 flex justify-between">
                <span>Remaining time on Basic Subscription after 30 Apr 2024</span>
                <span className="text-green-500">9.98 CAD</span>
              </div>
              <div className="mb-2 flex justify-between">
                <span>Subtotal</span>
                <span className="text-red-500">{selectedSub ? selectedSub.price : 0} CAD</span>
              </div>
              <div className="">
                {Object.values(selectedAddOns).map((addOn: any, index) => (
                  <div key={index} className="mb-2 grid w-full grid-cols-5">
                    <span className="col-span-2">{addOn.title}</span>
                    <button onClick={() => handleRemoveAddOn(addOn._id)} className="col-span-2 text-red-500">
                      Remove
                    </button>
                    <span className="justify-self-end">{addOn?.price} CAD</span>
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
            <button onClick={handleCheckOut} className="mt-4 w-full rounded bg-red-500 px-4 py-2 text-white">
              Complete Change Plan
            </button>
            <button className="mt-2 w-full rounded bg-gray-300 px-4 py-2 text-gray-700">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};
