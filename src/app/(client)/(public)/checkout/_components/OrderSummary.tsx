'use client';

import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { SerializedError } from '@/features/api/apiSlice';
import { useRetailerGetProfileQuery } from '@/features/auth/authApi';
import { setValue } from '@/features/auth/authSlice';
import { useGetAllExistingBillingQuery } from '@/features/retailer/billing/billingApi';
import { useAllBranchQuery } from '@/features/retailer/branch/branchApi';
import { useGetAllStampsQuery } from '@/features/retailer/stamp/stampApi';
import { RootState } from '@/features/store';
import { removeAddOns, removeCode, removeCoupon, resetState } from '@/features/subscription/subscriptionSlice';
import { useCreateCheckOutMutation } from '@/features/super-admin/subscription/subscriptionApi';
import { AddOn } from '@/types';
import { hasCheckedPurchaseAlert, isCheckoutButtonDisabled } from '@/utils';
import { translateText } from '@/utils/GoogleTranslate';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { CiEdit } from 'react-icons/ci';
import { ImBin } from 'react-icons/im';
import { MdBlock } from 'react-icons/md';
import { PiRepeatThin } from 'react-icons/pi';
import { RiChatDeleteLine, RiRefund2Line } from 'react-icons/ri';
import { SiTicktick } from 'react-icons/si';
import { useDispatch, useSelector } from 'react-redux';
import { Badge } from 'rizzui';
import BranchDisableModal from './BranchDisableModal';
import CouponForm from './CouponForm';
import PlanAddOns from './PlanAddons';
import { PrevAddonModal } from './PrevAddonModal';

export default function OrderSummary({ stripeInfo, selectedCurrency, locale }: any) {
  const { push, replace } = useRouter();
  const t = useTranslations('CheckoutPage');
  const dispatch = useDispatch();
  const { data: session, update }: any = useSession();
  const {
    code,
    subscription,
    coupon,
    couponDiscount,
    subTotal,
    tax,
    addOns,
    downgradeRefund,
    total,
    activeSubscription,
    planChangeType,
    refundableThreshold,
  } = useSelector((state: RootState) => state.subscriptionSlice);
  const [isExistingDisableModal, setIsExistingDisableModal] = useState(false);

  const [branchDisableModalState, setBranchDisableModalState] = useState(false);
  const [disableBranchOptions, setDisableBranchOptions] = useState([]);
  const [totalDisabledBranch, setTotalDisabledBranch] = useState<number>(0);
  const [disableStampOptions, setDisableStampOptions] = useState([]);
  const [totalDisabledStamp, setTotalDisabledStamp] = useState<number>(0);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedStamps, setSelectedStamps] = useState<string[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const { isLoggedIn, user, accessToken } = useSelector((state: RootState) => state.authSlice);

  const [checkOut, { data: checkOutResponse, isLoading: checkOutLoading, error: checkoutError }] = useCreateCheckOutMutation();
  const { data: profile, isSuccess: profileSuccess, refetch } = useRetailerGetProfileQuery(null, { skip: !isLoggedIn });

  const { data: branches } = useAllBranchQuery({ page: 1, limit: 30 }, { skip: !accessToken });

  const { data: stamps } = useGetAllStampsQuery({ page: 1, limit: 30 }, { skip: !accessToken });

  const { data: existingAddons } = useGetAllExistingBillingQuery(null, { skip: !accessToken });

  useEffect(() => {
    const disableStampOptions = stamps?.data?.docs?.map((item: any) => ({ value: item?._id, title: item?.title }));
    const allowTotalStamp = subscription?.allowTotalStamp || 0;
    const disabledTotalStamp = stamps?.data?.docs?.length - allowTotalStamp;
    setDisableStampOptions(disableStampOptions);
    setTotalDisabledStamp(disabledTotalStamp < 0 ? 0 : disabledTotalStamp);
  }, [stamps, subscription]);

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
        dispatch(resetState());
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
        dispatch(resetState());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkOutResponse, replace, profileSuccess, checkoutError]);

  const handleCheckOut = () => {
    if (!isLoggedIn) {
      push(routes.publicRoutes.retailerLogin + '?callback=checkout');
      // setModalState(true);
      return;
    }

    // when buy just addons
    if (activeSubscription?.slug === subscription?.slug && addOns?.length > 0) {
      if (code) {
        checkOut({ slugs: addOns?.map((addOn) => addOn?.slug), code, currency: selectedCurrency });
      } else {
        checkOut({ slugs: addOns?.map((addOn) => addOn?.slug), currency: selectedCurrency });
      }
      return;
    }
    // subscription upgrade with addons
    if (planChangeType === 'upgrade' && activeSubscription?.slug && activeSubscription?.slug !== 'trial' && addOns.length > 0) {
      if (code) {
        checkOut({ slugs: [subscription?.slug, ...addOns?.map((addOn) => addOn?.slug)], code, currency: selectedCurrency });
      } else {
        checkOut({ slugs: [subscription?.slug, ...addOns?.map((addOn) => addOn?.slug)], currency: selectedCurrency });
      }
      return;
    }

    // subscription downgrade

    if (planChangeType === 'downgrade') {
      if (selectedBranches?.length === totalDisabledBranch && selectedStamps?.length === totalDisabledStamp) {
        checkOut({
          slugs: [subscription.slug, ...addOns?.map((addOn) => addOn?.slug)],
          branchIds: selectedBranches,
          stampIds: selectedStamps,
          currency: selectedCurrency,
        });
      } else {
        setBranchDisableModalState(true);
      }

      return;
    }
    // 1. new subscription buy with addons and without addons
    // 2. subscription upgrade without addons
    if (subscription?.slug) {
      if (selectedAddons?.length > 0) {
        if (code) {
          checkOut({
            slugs: [subscription?.slug, ...addOns?.map((addOn) => addOn?.slug)],
            code,
            currency: selectedCurrency,
            prevAddonEnrollmentIds: selectedAddons,
          });
        } else {
          checkOut({
            slugs: [subscription?.slug, ...addOns?.map((addOn) => addOn?.slug)],
            currency: selectedCurrency,
            prevAddonEnrollmentIds: selectedAddons,
          });
        }
      } else {
        if (code) {
          checkOut({ slugs: [subscription?.slug, ...addOns?.map((addOn) => addOn?.slug)], code, currency: selectedCurrency });
        } else {
          checkOut({ slugs: [subscription?.slug, ...addOns?.map((addOn) => addOn?.slug)], currency: selectedCurrency });
        }
      }
    }
  };

  const disabledBranchItems = disableBranchOptions?.filter((item: any) => selectedBranches?.includes(item?.value));
  const disabledStampItems = disableStampOptions?.filter((item: any) => selectedStamps?.includes(item?.value));

  const selectedPrevExistingAddons = existingAddons?.data?.filter((item: any) => selectedAddons?.includes(item?._id));

  const handleRemoveAddOn = (addOnId: string) => {
    dispatch(removeAddOns(addOnId));
    if (code) {
      dispatch(removeCode());
      dispatch(removeCoupon());
    }
  };

  const handleUpgradeConfirm = () => {
    replace(checkOutResponse?.data?.url);
    dispatch(resetState());
  };

  return (
    <>
      <div className="rounded-lg border p-4">
        <h2 className="pb-2 text-lg font-medium">{t('coupon')}</h2>
        <hr className=" text-lg font-bold" />
        <CouponForm locale={locale} />

        {subscription?.slug === activeSubscription?.slug && activeSubscription?.slug !== 'trial' && addOns?.length > 0 && (
          <div>
            <h2 className="pb-2 text-lg font-medium">{t('addOns')}</h2>
            <hr className="p-2 text-lg font-bold" />
            {addOns?.length > 0 && (
              <div>
                {addOns.map((addOn: AddOn, index: number) => (
                  <div key={index} className="mb-2 grid w-full grid-cols-12 items-center gap-x-3">
                    <span className="col-span-6">
                      {addOn.title}{' '}
                      {coupon?.appliedSlugs?.includes(addOn?.slug) && (
                        <span>{` (${coupon?.discountType === 'percentage' ? `${coupon?.discount}%` : coupon?.discount} off)`}</span>
                      )}
                    </span>
                    <button onClick={() => handleRemoveAddOn(addOn._id)} className="col-span-2 text-red-500">
                      <ImBin />
                    </button>
                    <span className="col-span-4 justify-self-end">{addOn ? parseFloat(addOn?.price?.toFixed(2)).toFixed(2) : 0} CAD</span>
                  </div>
                ))}
              </div>
            )}
            <div className="mb-2 flex justify-between">
              <span className="font-semibold">{t('subtotal')}</span>
              <span className="text-red-500">
                {Math.abs(subTotal).toFixed(2)} {selectedCurrency}
              </span>
            </div>
            <hr className="p-2 text-lg font-bold" />
            {stripeInfo?.taxStatus === 'on' && subscription?.slug !== 'trial' && (
              <div className="mb-2 flex justify-between">
                <span>
                  <span className="font-semibold">{stripeInfo?.taxTitle}</span> ({stripeInfo?.taxCost}%)
                </span>
                <span className="text-red-500">
                  {tax.toFixed(2)} {selectedCurrency}
                </span>
              </div>
            )}

            {coupon && (
              <div className="mb-2 grid w-full grid-cols-12 items-center gap-x-3">
                <span className="col-span-7">
                  <span className="font-semibold">{t('coupon')}:</span>{' '}
                  {`${coupon?.title.length > 10 ? `${coupon?.title.slice(0, 10)}...` : coupon?.title} ${coupon?.discountType === 'percentage' ? `(${coupon?.discount}%)` : ''}`}
                </span>
                <button
                  onClick={() => {
                    dispatch(removeCoupon());
                    dispatch(removeCode());
                  }}
                  className="col-span-1 text-red-500"
                >
                  <ImBin />
                </button>
                <span className="col-span-4 justify-self-end text-red-500">
                  {`-${couponDiscount?.toFixed(2)}`} {selectedCurrency}
                </span>
              </div>
            )}

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-red-500">
                {Math.abs(total).toFixed(2)} {selectedCurrency}
              </span>
            </div>
          </div>
        )}

        {subscription?.slug !== activeSubscription?.slug && (subscription?.slug || addOns?.length > 0) && (
          <PlanAddOns stripeInfo={stripeInfo} selectedCurrency={selectedCurrency} />
        )}
        {((subscription?.slug === activeSubscription?.slug && addOns.length === 0) ||
          !subscription?.slug ||
          (subscription?.slug === activeSubscription?.slug && activeSubscription?.slug === 'trial')) && (
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
                <RiChatDeleteLine className="text-xl" />
                {t('deleteStamps')}
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

      {existingAddons?.data?.length > 0 && !session?.user?.plan && subscription?.slug && (
        <div className="mt-3 rounded-lg border border-danger p-3">
          <p className="mb-2 flex items-center gap-x-1 text-sm font-semibold">{t('prevAddonMessage')}</p>
          {selectedPrevExistingAddons?.length > 0 && (
            <>
              <p className="mb-2 flex items-center gap-x-1 text-sm font-semibold">
                <SiTicktick className="text-xl" /> {t('selectedPreviousAddons')} :
              </p>
              <div>
                {selectedPrevExistingAddons?.map((item: any) => {
                  return item?.enrollSubscriptions?.map((enroll: any) => (
                    <Badge className="m-1 bg-danger" key={enroll?._id}>
                      <span className="text-white">{enroll?.planSnapshot?.title}</span>
                    </Badge>
                  ));
                })}
              </div>
            </>
          )}
          <div className="mt-2 flex justify-end">
            <Button
              color="danger"
              text={t('continue')}
              className="!m-0 !px-3 !py-2 !text-xs"
              onClick={() => setIsExistingDisableModal(true)}
              postIcon={<PiRepeatThin className="text-base" />}
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
          addOns,
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

      <PrevAddonModal
        modalState={isExistingDisableModal}
        setModalState={setIsExistingDisableModal}
        existingAddons={existingAddons?.data}
        selectedAddons={selectedAddons}
        setSelectedAddons={setSelectedAddons}
      />
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
