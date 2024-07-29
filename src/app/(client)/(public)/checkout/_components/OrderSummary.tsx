'use client';

import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { SerializedError } from '@/features/api/apiSlice';
import { useRetailerGetProfileQuery } from '@/features/auth/authApi';
import { setValue } from '@/features/auth/authSlice';
import { useAllBranchQuery } from '@/features/retailer/branch/branchApi';
import { RootState } from '@/features/store';
import { removeAddOns, setPlanChangeCost, setTaxPercentage, setTaxStatus } from '@/features/subscription/subscriptionSlice';
import { useCreateCheckOutMutation } from '@/features/super-admin/subscription/subscriptionApi';
import { AddOn } from '@/types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { CiEdit } from 'react-icons/ci';
import { ImBin } from 'react-icons/im';
import { MdBlock } from 'react-icons/md';
import { RiRefund2Line } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { Badge } from 'rizzui';
import BranchDisableModal from './BranchDisableModal';
import CouponForm from './CouponForm';
import LoginAlert from './LoginAlert';
import OrderBalance from './OrderBalance';
import PlanAddOns from './PlanAddons';

export default function OrderSummary({ stripeInfo }: any) {
  const { push } = useRouter();
  const dispatch = useDispatch();
  const { data: session, update }: any = useSession();
  const { code, subscription, addOns, subTotal, total, tax, activeSubscription, planChangeType } = useSelector(
    (state: RootState) => state.subscriptionSlice
  );
  const [modalState, setModalState] = useState(false);
  const [modalState2, setModalState2] = useState(false);

  const [branchDisableModalState, setBranchDisableModalState] = useState(false);
  const [disableBranchOptions, setDisableBranchOptions] = useState([]);
  const [totalDisabledBranch, setTotalDisabledBranch] = useState<number>(0);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  const { isLoggedIn, user, accessToken } = useSelector((state: RootState) => state.authSlice);

  const subSlugs = [subscription?.slug, ...addOns?.map((item: AddOn) => item.slug)];
  const [checkOut, { data: checkOutResponse, isLoading: checkOutLoading, error: checkoutError }] = useCreateCheckOutMutation();
  const { data: profile, isSuccess: profileSuccess, refetch } = useRetailerGetProfileQuery(null, { skip: !isLoggedIn });

  const { data: branches } = useAllBranchQuery({ page: 1, limit: 30 }, { skip: !accessToken });

  useEffect(() => {
    const activeTotalBranch = branches?.data?.docs?.filter((item: any) => !item?.disabledBySystem && item?.source === 'subscription');
    const disableBranchOptions = activeTotalBranch?.map((item: any) => ({ value: item?._id, title: item?.name }));
    const allowTotalBranch = subscription?.allowTotalBranch || 0;
    const disabledTotalBranch = activeTotalBranch?.length - allowTotalBranch;
    setDisableBranchOptions(disableBranchOptions);
    setTotalDisabledBranch(disabledTotalBranch);
  }, [branches, subscription]);

  useEffect(() => {
    dispatch(setPlanChangeCost(stripeInfo?.planChangeCost));
    dispatch(setTaxPercentage(stripeInfo?.taxCost));
    dispatch(setTaxStatus(stripeInfo?.taxStatus));
  }, [dispatch, stripeInfo?.planChangeCost, stripeInfo?.taxCost, stripeInfo?.taxStatus]);

  useEffect(() => {
    if (checkoutError) {
      const myError = checkoutError as SerializedError;
      // Keep it as it is....😂
      if (myError?.data?.message.startsWith('You have to inactive')) {
        setModalState2(true);
      } else {
        toast.error(myError?.data?.message || 'Something went wrong!');
      }
    }

    if (checkOutResponse) {
      if (subscription?.slug === 'trial') {
        toast.success('Free trial activated!');
        update({ ...session?.user, ...checkOutResponse?.data });
        dispatch(
          setValue({
            target: 'user',
            value: { ...user, ...profile?.data },
          })
        );
        push(routes.retailer.dashboard);
      } else {
        if (checkOutResponse?.data?.url) {
          push(checkOutResponse?.data?.url);
        } else {
          toast.success(checkOutResponse?.message || 'Downgrade Successfully!');
          update({ ...session?.user, ...checkOutResponse?.data });
          dispatch(
            setValue({
              target: 'user',
              value: { ...user, ...profile?.data },
            })
          );
          push(routes.retailer.dashboard);
          setSelectedBranches([]);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkOutResponse, push, profileSuccess, checkoutError]);

  const handleCheckOut = () => {
    if (!isLoggedIn) {
      setModalState(true);
      return;
    }
    if (subscription?.slug === activeSubscription?.slug && addOns?.length > 0) {
      checkOut({ slugs: addOns?.map((item: AddOn) => item.slug) });
      return;
    }
    if (planChangeType === 'downgrade' && totalDisabledBranch > 0) {
      if (selectedBranches?.length === totalDisabledBranch) {
        checkOut({ slugs: subSlugs, branchIds: selectedBranches });
      } else {
        setBranchDisableModalState(true);
      }

      return;
    }
    if (subSlugs.length > 0) {
      if (code) {
        checkOut({ slugs: subSlugs, code });
      } else {
        checkOut({ slugs: subSlugs });
      }
    }
  };

  const handleRemoveAddOn = (addOnId: string) => {
    dispatch(removeAddOns(addOnId));
  };

  // const myError = checkoutError as SerializedError;

  const disabledBranchItems = disableBranchOptions?.filter((item: any) => selectedBranches?.includes(item?.value));

  return (
    <>
      <div className="rounded-lg border p-4">
        <h2 className="pb-2 text-lg font-medium">Coupon</h2>
        <hr className=" text-lg font-bold" />
        <CouponForm />

        {activeSubscription?.slug && activeSubscription?.slug !== 'trial' && <OrderBalance />}

        {subscription?.slug === activeSubscription?.slug && addOns?.length > 0 && (
          <div>
            <h2 className="pb-2 text-lg font-medium">Add-Ons</h2>
            <hr className="p-2 text-lg font-bold" />
            {addOns?.length > 0 && (
              <div>
                {addOns.map((addOn: AddOn, index: number) => (
                  <div key={index} className="mb-2 grid w-full grid-cols-12 items-center gap-x-3">
                    <span className="col-span-6">{addOn.title}</span>
                    <button onClick={() => handleRemoveAddOn(addOn._id)} className="col-span-2 text-red-500">
                      <ImBin />
                    </button>
                    <span className="col-span-4 justify-self-end">{addOn ? parseFloat(addOn?.price?.toFixed(2)).toFixed(2) : 0} CAD</span>
                  </div>
                ))}
              </div>
            )}
            <div className="mb-2 flex justify-between">
              <span className="font-semibold">Subtotal</span>
              <span className="text-red-500">{Math.abs(subTotal).toFixed(2)} CAD</span>
            </div>
            <hr className="p-2 text-lg font-bold" />
            {stripeInfo?.taxStatus === 'on' && subscription?.slug !== 'trial' && (
              <div className="mb-2 flex justify-between">
                <span>
                  <span className="font-semibold">{stripeInfo?.taxTitle}</span> ({stripeInfo?.taxCost}%)
                </span>
                <span className="text-red-500">{tax.toFixed(2)} CAD</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-red-500">{Math.abs(total).toFixed(2)} CAD</span>
            </div>
          </div>
        )}
        {subscription?.slug !== activeSubscription?.slug && <PlanAddOns stripeInfo={stripeInfo} />}
        {subscription?.slug === activeSubscription?.slug && addOns?.length === 0 && (
          <div className="py-4 text-center font-medium text-red-500">Your cart is currently empty. Select a plan!</div>
        )}
      </div>

      {total > 0 && subscription?.slug !== activeSubscription?.slug && (
        <div className="mt-3 rounded-lg border border-danger p-3">
          <h2 className="flex items-center gap-x-1 text-sm font-semibold">
            <RiRefund2Line className="text-xl" />
            You will get back <span className="text-lg font-bold text-danger">{Math.abs(total).toFixed(2)}</span> CAD!
          </h2>
        </div>
      )}

      {Math.abs(total) < 1 && activeSubscription?.slug && activeSubscription?.slug !== 'trial' && (
        <div className="my-3 border-l-4 border-yellow-400 bg-yellow-50 p-4">
          <p className="font-medium text-yellow-500">Purchase Alert!</p>
          <p className="text-yellow-500">Your order needs to be at least 1 CAD. Please add more items to continue</p>
        </div>
      )}

      {selectedBranches?.length > 0 && (
        <div className="mt-3 rounded-lg border border-danger p-3">
          <p className="mb-2 flex items-center gap-x-1 text-sm font-semibold">
            <MdBlock className="text-xl" /> Disable Branch/s:
          </p>
          <div>
            {disabledBranchItems?.map((item: any) => (
              <Badge className="m-1 bg-danger" key={item?.value}>
                <span className="text-white">{item?.title}</span>
              </Badge>
            ))}
          </div>
          <div className="mt-2 flex justify-end">
            <Button
              color="danger"
              text="Edit"
              className="!m-0 !px-3 !py-2 !text-xs"
              onClick={() => setBranchDisableModalState(true)}
              postIcon={<CiEdit className="text-base" />}
            />
          </div>
        </div>
      )}

      {subscription?.slug && subscription?.slug === activeSubscription?.slug && addOns?.length > 0 ? (
        <Button
          disabled={false}
          color="danger"
          text="Checkout Confirm"
          className="mt-5 w-full"
          isSubmitting={checkOutLoading}
          onClick={handleCheckOut}
          postIcon={<BsCheck2Circle className="text-base" />}
        />
      ) : (
        <Button
          disabled={!subscription?.slug && subscription?.slug === activeSubscription?.slug && total < 1 ? true : false}
          color="danger"
          text="Checkout Confirm"
          className="mt-5 w-full"
          isSubmitting={checkOutLoading}
          onClick={handleCheckOut}
          postIcon={<BsCheck2Circle className="text-base" />}
        />
      )}

      <LoginAlert modalState={modalState} setModalState={setModalState} />
      <BranchDisableModal
        selectedBranches={selectedBranches}
        setSelectedBranches={setSelectedBranches}
        totalDisabledBranch={totalDisabledBranch}
        options={disableBranchOptions}
        modalState={branchDisableModalState}
        setModalState={setBranchDisableModalState}
      />
      {/* <GoToBranch modalState={modalState2} setModalState={setModalState2} message={myError?.data?.message} /> */}
    </>
  );
}
