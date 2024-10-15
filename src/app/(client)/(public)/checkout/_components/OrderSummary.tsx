'use client';

import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { SerializedError } from '@/features/api/apiSlice';
import { useRetailerGetProfileQuery } from '@/features/auth/authApi';
import { setValue } from '@/features/auth/authSlice';
import { useAllBranchQuery } from '@/features/retailer/branch/branchApi';
import { useGetAllStampsQuery } from '@/features/retailer/stamp/stampApi';
import { RootState } from '@/features/store';
import { resetState } from '@/features/subscription/subscriptionSlice';
import { useCreateCheckOutMutation } from '@/features/super-admin/subscription/subscriptionApi';
import { hasCheckedPurchaseAlert, isCheckoutButtonDisabled } from '@/utils';
import { translateText } from '@/utils/GoogleTranslate';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { CiEdit } from 'react-icons/ci';
import { MdBlock } from 'react-icons/md';
import { RiChatDeleteLine, RiRefund2Line } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { Badge } from 'rizzui';
import BranchDisableModal from './BranchDisableModal';
import CouponForm from './CouponForm';
import PlanAddOns from './PlanAddons';

export default function OrderSummary({ stripeInfo, selectedCurrency, locale }: any) {
  const { push, replace } = useRouter();
  const t = useTranslations('CheckoutPage');
  const dispatch = useDispatch();
  const { data: session, update }: any = useSession();
  const { code, subscription, addOn, downgradeRefund, total, activeSubscription, planChangeType, refundableThreshold } = useSelector(
    (state: RootState) => state.subscriptionSlice
  );
  const [modalState, setModalState] = useState(false);

  const [branchDisableModalState, setBranchDisableModalState] = useState(false);
  const [disableBranchOptions, setDisableBranchOptions] = useState([]);
  const [totalDisabledBranch, setTotalDisabledBranch] = useState<number>(0);
  const [disableStampOptions, setDisableStampOptions] = useState([]);
  const [totalDisabledStamp, setTotalDisabledStamp] = useState<number>(0);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedStamps, setSelectedStamps] = useState<string[]>([]);

  const { isLoggedIn, user, accessToken } = useSelector((state: RootState) => state.authSlice);

  // const subSlugs = [subscription?.slug, ...addOns?.map((item: AddOn) => item.slug)];
  const [checkOut, { data: checkOutResponse, isLoading: checkOutLoading, error: checkoutError }] = useCreateCheckOutMutation();
  const { data: profile, isSuccess: profileSuccess, refetch } = useRetailerGetProfileQuery(null, { skip: !isLoggedIn });

  const { data: branches } = useAllBranchQuery({ page: 1, limit: 30 }, { skip: !accessToken });

  const { data: stamps } = useGetAllStampsQuery({ page: 1, limit: 30 }, { skip: !accessToken });

  useEffect(() => {
    const disableStampOptions = stamps?.data?.docs?.map((item: any) => ({ value: item?._id, title: item?.title }));
    const allowTotalStamp = subscription?.allowTotalStamp || 0;
    const disabledTotalStamp = stamps?.data?.docs?.length - allowTotalStamp;
    setDisableStampOptions(disableStampOptions);
    setTotalDisabledStamp(disabledTotalStamp || 0);
  }, [stamps, subscription]);

  console.log({ disableStampOptions, totalDisabledStamp });

  useEffect(() => {
    const activeTotalBranch = branches?.data?.docs?.filter((item: any) => !item?.disabledBySystem && item?.source === 'subscription');
    const disableBranchOptions = activeTotalBranch?.map((item: any) => ({ value: item?._id, title: item?.name }));
    const allowTotalBranch = subscription?.allowTotalBranch || 0;
    const disabledTotalBranch = activeTotalBranch?.length - allowTotalBranch;
    setDisableBranchOptions(disableBranchOptions);
    setTotalDisabledBranch(disabledTotalBranch < 0 ? 0 : disabledTotalBranch);
  }, [branches, subscription]);

  useEffect(() => {
    if (checkoutError) {
      const myError = checkoutError as SerializedError;
      toast.error(myError?.data?.message || 'Something went wrong!');
    }

    if (checkOutResponse) {
      if (subscription?.slug === 'trial') {
        toast.success(t('freeTrialActivated'));
        update({ ...session?.user, ...checkOutResponse?.data });
        dispatch(
          setValue({
            target: 'user',
            value: { ...user, ...profile?.data },
          })
        );
        replace(routes.privateRoutes.retailer.dashboard);
      } else {
        if (checkOutResponse?.data?.url) {
          replace(checkOutResponse?.data?.url);
        } else {
          if (locale === 'en') {
            toast.success(checkOutResponse?.message || 'Downgrade Successfully!');
          } else {
            (async () => {
              const translatedMessage = await translateText([checkOutResponse?.message], locale, 'en');
              toast.success(translatedMessage[0] || t('downgradeSuccessfully'));
            })();
          }
          update({ ...session?.user, ...profile?.data });
          dispatch(
            setValue({
              target: 'user',
              value: { ...user, ...profile?.data },
            })
          );
          replace(routes?.privateRoutes?.retailer?.dashboard);
          setSelectedBranches([]);
        }
      }
      dispatch(resetState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkOutResponse, replace, profileSuccess, checkoutError]);

  const handleCheckOut = () => {
    if (!isLoggedIn) {
      push(routes.publicRoutes.retailerLogin + '?callback=checkout');
      // setModalState(true);
      return;
    }
    if (activeSubscription?.slug && addOn.slug) {
      checkOut({ slug: addOn.slug, currency: selectedCurrency });
      return;
    }

    if (planChangeType === 'downgrade') {
      if (selectedBranches?.length === totalDisabledBranch && selectedStamps?.length === totalDisabledStamp) {
        checkOut({ slug: subscription.slug, branchIds: selectedBranches, stampIds: selectedStamps, currency: selectedCurrency });
      } else {
        setBranchDisableModalState(true);
      }

      return;
    }
    if (subscription?.slug) {
      if (code) {
        checkOut({ slug: subscription?.slug, code, currency: selectedCurrency });
      } else {
        checkOut({ slug: subscription?.slug, currency: selectedCurrency });
      }
    }
  };

  const disabledBranchItems = disableBranchOptions?.filter((item: any) => selectedBranches?.includes(item?.value));
  const disabledStampItems = disableStampOptions?.filter((item: any) => selectedStamps?.includes(item?.value));

  return (
    <>
      <div className="rounded-lg border p-4">
        <h2 className="pb-2 text-lg font-medium">{t('coupon')}</h2>
        <hr className=" text-lg font-bold" />
        <CouponForm locale={locale} />

        {subscription?.slug !== activeSubscription?.slug && (subscription?.slug || addOn?.slug) && (
          <PlanAddOns stripeInfo={stripeInfo} selectedCurrency={selectedCurrency} />
        )}
        {(subscription?.slug === activeSubscription?.slug || !subscription?.slug) && !addOn.slug && (
          <div className="py-4 text-center font-medium text-red-500">{t('cartEmpty')}</div>
        )}
      </div>

      {downgradeRefund > 0 && downgradeRefund > refundableThreshold && subscription?.slug !== activeSubscription?.slug && (
        <div className="mt-3 rounded-lg border border-danger p-3">
          <h2 className="flex items-center gap-x-1 text-sm font-semibold">
            <RiRefund2Line className="text-xl" />
            {t('refundMessage')} <span className="text-lg font-bold text-danger">{Math.abs(downgradeRefund).toFixed(2)}</span>{' '}
            {selectedCurrency}!
          </h2>
        </div>
      )}

      {hasCheckedPurchaseAlert({ subscription, activeSubscription, total, refundableThreshold }) && (
        <div className="my-3 border-l-4 border-yellow-400 bg-yellow-50 p-4">
          <p className="font-medium text-yellow-500">{t('purchaseAlert')}</p>
          <p className="text-yellow-500">
            {t('purchaseAlertMessage')} {refundableThreshold} {selectedCurrency}. {t('purchaseAlertMessageAfter')}
          </p>
        </div>
      )}

      {(selectedBranches?.length > 0 || selectedStamps?.length > 0) && downgradeRefund > 0 && (
        <div className="mt-3 rounded-lg border border-danger p-3">
          {selectedBranches?.length > 0 && (
            <>
              <p className="mb-2 flex items-center gap-x-1 text-sm font-semibold">
                <MdBlock className="text-xl" /> {t('disableBranch')} :
              </p>
              <div>
                {disabledBranchItems?.map((item: any) => (
                  <Badge className="m-1 bg-danger" key={item?.value}>
                    <span className="text-white">{item?.title}</span>
                  </Badge>
                ))}
              </div>
            </>
          )}
          {selectedStamps?.length > 0 && (
            <>
              <p className="mb-2 mt-2 flex items-center gap-x-1 text-sm font-semibold">
                <RiChatDeleteLine className="text-xl" /> Delete Stamps :
              </p>
              <div>
                {disabledStampItems?.map((item: any) => (
                  <Badge className="m-1 bg-danger" key={item?.value}>
                    <span className="text-white">{item?.title}</span>
                  </Badge>
                ))}
              </div>
            </>
          )}
          <div className="mt-2 flex justify-end">
            <Button
              color="danger"
              text={t('edit')}
              className="!m-0 !px-3 !py-2 !text-xs"
              onClick={() => setBranchDisableModalState(true)}
              postIcon={<CiEdit className="text-base" />}
            />
          </div>
        </div>
      )}

      <Button
        disabled={isCheckoutButtonDisabled({
          plan: subscription,
          activePlan: activeSubscription,
          isLoggedIn,
          hasPurchasePlan: session?.user?.plan ? true : false,
          addOn,
          planChangeType,
          total,
          refundableThreshold: stripeInfo?.refundableThreshold,
        })}
        color="danger"
        text={t('checkoutButtonText')}
        className="mt-5 w-full"
        isSubmitting={checkOutLoading}
        onClick={handleCheckOut}
        postIcon={<BsCheck2Circle className="text-base" />}
      />

      {/* <LoginAlert modalState={modalState} setModalState={setModalState} /> */}
      <BranchDisableModal
        selectedBranches={selectedBranches}
        setSelectedBranches={setSelectedBranches}
        totalDisabledBranch={totalDisabledBranch}
        options={disableBranchOptions}
        selectedStamps={selectedStamps}
        setSelectedStamps={setSelectedStamps}
        totalDisabledStamp={totalDisabledStamp}
        disableStampOptions={disableStampOptions}
        modalState={branchDisableModalState}
        setModalState={setBranchDisableModalState}
      />
    </>
  );
}
