'use client';

import Button from '@/components/Formik/Button';
import DateRangePicker from '@/components/Formik/DateRange';
import InputField from '@/components/Formik/InputField';
import InputTextarea from '@/components/Formik/InputTextArea ';
import SelectField from '@/components/Formik/SelectField';
import { routes } from '@/config/routes';
import { useBranchCategoryImageListQuery, useCreateStampMutation } from '@/features/retailer/stamp/stampApi';
import removeEmptyValues from '@/utils/removeEmptyValues';
import { Form, Formik } from 'formik';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { IoAlertCircle } from 'react-icons/io5';
import { LuCircleDollarSign } from 'react-icons/lu';
import { RiDiscountPercentLine, RiDraftLine, RiDrinks2Fill } from 'react-icons/ri';
import * as Yup from 'yup';
import StampImgSkeleton from './StampImgSkeleton';
import StampPublishedModal from './StampPublishedModal';

export default function Create() {
  const { data: session }: any = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [createStamp] = useCreateStampMutation();
  const [optionsData, setOptionsData] = useState<any>();
  const [submitAction, setSubmitAction] = useState<string | null>(null);
  const [publishState, setPublishState] = useState(false);
  const [publishSubmitting, setPublishSubmitting] = useState(false);
  const [values, setValues] = useState({});
  const { data: responseData, isLoading: responseIsLoading } = useBranchCategoryImageListQuery({});
  const isAddons = session?.user?.totalCustomStampImage > 0 ? true : false;
  const t = useTranslations('RetailerCreateAndUpdateStamp');

  const initialValues = {
    branchId: '',
    stampImageId: '',
    categoryId: '',
    title: '',
    description: '',
    rules: '',
    noOfStampsToCollect: 10,
    minPurchaseAmount: 0,
    rewardType: 'promotion',
    promotionReward: '',
    discountReward: 2,
    validDateRange: '',
    hasValidity: true,
  };

  useEffect(() => {
    if (responseData) {
      setOptionsData(responseData.data);
    }
  }, [responseData]);

  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      const changedData = removeEmptyValues(values, ['validDateRange']);

      if (values.hasValidity) {
        if (values?.validDateRange?.includes('to')) {
          const dateRange = values.validDateRange.split('to').map((date: string) => date.trim());
          changedData.startedAt = dateRange[0];
          changedData.expiredAt = dateRange[1];
        } else {
          changedData.startedAt = values?.validDateRange;
          changedData.expiredAt = values?.validDateRange;
        }
      }
      if (submitAction === 'draft') {
        changedData.isPublished = false;
      } else {
        changedData.isPublished = true;
      }

      const result = await createStamp(changedData).unwrap();
      router.push(routes.privateRoutes.retailer.stamp.home);
      toast.success(result.data.message || 'Stamp created successfully!');
    } catch (error: any) {
      console.error('Failed to create Stamp:', error);
      toast.error(error?.data?.message || 'Failed to create Stamp. Please try again.');
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    branchId: Yup.string().required('Required!'),
    stampImageId: Yup.string().required('Required!'),
    categoryId: Yup.string().required('Required!'),
    title: Yup.string().required('Required!'),
    rules: Yup.string().required('Required!'),
    hasValidity: Yup.boolean().required('Required!'),
    noOfStampsToCollect: Yup.number().min(1, 'Number of stamps to collect must be at least 1').required('This field is required'),
    rewardType: Yup.mixed().oneOf(['promotion', 'discount']).required('Reward type is required'),
    promotionReward: Yup.string().when('rewardType', {
      is: 'promotion',
      then: () => Yup.string().required('Required!'),
      otherwise: () => Yup.string(),
    }),
    discountReward: Yup.string().when('rewardType', {
      is: 'discount',
      then: () => Yup.number().required('Required!').min(1, 'Discount must be greater than zero!'),
      otherwise: () => Yup.number(),
    }),
    validDateRange: Yup.string().when('hasValidity', {
      is: true,
      then: () => Yup.string().required('Required!'),
      otherwise: () => Yup.string(),
    }),
  });

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values: any) => {
          if (submitAction === 'draft') {
            handleSubmit(values);
          } else {
            setPublishState(true);
            const filteredValues = removeEmptyValues(values, ['validDateRange']);

            if (values.hasValidity) {
              if (values?.validDateRange?.includes('to')) {
                filteredValues.startedAt = values?.validDateRange?.split('to')[0];
                filteredValues.expiredAt = values?.validDateRange?.split('to')[1];
              } else {
                filteredValues.startedAt = values?.validDateRange;
                filteredValues.expiredAt = values?.validDateRange?.split('to');
              }
            }
            if (submitAction === 'draft') {
              filteredValues.isPublished = false;
            } else {
              filteredValues.isPublished = true;
            }
            setValues(filteredValues);
          }
        }}
      >
        {({ errors, setFieldValue, values, touched }) => {
          return (
            <Form className="mt-5 grid gap-4">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <SelectField
                    name="branchId"
                    label={t('branch')}
                    disabled={optionsData?.branches?.length === 0 ? true : false}
                    value={values?.branchId}
                    options={optionsData?.branches.map((item: any) => ({
                      label: item.name,
                      value: item._id,
                    }))}
                    onChange={(option: { label: string; value: string }) => setFieldValue('branchId', option.value)}
                  />
                  {optionsData?.branches?.length === 0 && (
                    <div className="pt-3 text-center">
                      <Link href={routes.privateRoutes.retailer.branch.create} className="text-xs font-semibold text-danger">
                        Create Branch
                      </Link>
                    </div>
                  )}
                </div>

                <div>
                  <SelectField
                    name="categoryId"
                    label={t('category')}
                    disabled={optionsData?.categories?.length === 0 ? true : false}
                    value={values?.categoryId}
                    options={optionsData?.categories?.map((item: any) => ({
                      label: _.startCase(_.toLower(item.name)),
                      value: item._id,
                    }))}
                    onChange={(option: { label: string; value: string }) => setFieldValue('categoryId', option.value)}
                  />
                  {optionsData?.categories?.length === 0 && (
                    <div className=" pt-3 text-center text-danger">
                      <span>No category added by super admin</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <InputField name="title" label={t('title')} placeholder="Buy 10 Pizza Get 1 Coke" />
                <InputField name="rules" label={t('basicRules')} placeholder="You need to buy..." />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <SelectField
                    name="hasValidity"
                    label={t('validityPeriod')}
                    value={values?.hasValidity}
                    options={[
                      { id: 1, name: 'no expiration', value: false },
                      { id: 2, name: 'expiration', value: true },
                    ].map((item: any) => ({
                      label: _.startCase(_.toLower(item.name)),
                      value: item.value,
                    }))}
                    onChange={(option: { label: string; value: boolean }) => setFieldValue('hasValidity', option.value)}
                  />
                </div>
                {values?.hasValidity && <DateRangePicker label="Valid Date Range" name="validDateRange" />}
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <InputField name="noOfStampsToCollect" label={t('noOfStampsToCollect')} type="number" />
                <InputField
                  name="minPurchaseAmount"
                  required={false}
                  label={t('minPurchaseAmount')}
                  type="number"
                  prefix={<LuCircleDollarSign className="text-xl" />}
                  placeholder="0"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <SelectField
                    name="rewardType"
                    label={t('rewardType')}
                    value={values?.rewardType}
                    options={[
                      { id: 1, name: 'discount', value: 'discount' },
                      { id: 2, name: 'promotion', value: 'promotion' },
                    ].map((item: any) => ({
                      label: _.startCase(_.toLower(item.name)),
                      value: item.value,
                    }))}
                    onChange={(option: { label: string; value: string }) => setFieldValue('rewardType', option.value)}
                  />
                </div>

                {values.rewardType === 'discount' && (
                  <InputField
                    name="discountReward"
                    label={t('discountReward')}
                    placeholder="Ex. Get 1 Coke"
                    type="number"
                    prefix={<RiDiscountPercentLine className="text-xl" />}
                  />
                )}
                {values.rewardType === 'promotion' && (
                  <InputField
                    name="promotionReward"
                    label={t('promotionReward')}
                    placeholder="Ex. Get 1 Coke"
                    prefix={<RiDrinks2Fill className="text-xl" />}
                  />
                )}
              </div>

              <h2 className="font-medium">
                {t('selectDefaultImage')} <span className="text-red-600">*</span>
              </h2>
              {responseIsLoading ? (
                <StampImgSkeleton />
              ) : (
                <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-8">
                  {optionsData?.defaultImages?.map((item: any) => (
                    <div
                      onClick={() => setFieldValue('stampImageId', item._id)}
                      key={item?._id}
                      className={`cursor-pointer rounded-lg border p-4 ${errors?.stampImageId && touched?.stampImageId && 'ring-2 ring-danger'} ${
                        values?.stampImageId === item._id ? 'scale-105 border-2 border-red-600 ring-1 ring-red-400' : 'border'
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <img className="h-14 w-14 object-center" src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${item.image}`} alt="" />
                        <h3 className="mt-2 text-center font-medium">
                          {item?.title?.length >= 15 ? `${item?.title?.slice(0, 14)}...` : item?.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {optionsData?.defaultImages?.length === 0 && (
                <div className=" pt-3 text-center text-danger">
                  <span>{t('noDefaultImageBySuperAdmin')}</span>
                </div>
              )}
              {optionsData?.customImages?.length > 0 && (
                <h2 className="font-medium">
                  {t('selectCustomImage')} <span className="text-red-600">*</span>
                </h2>
              )}
              {responseIsLoading ? (
                <StampImgSkeleton />
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-8">
                  {optionsData?.customImages?.map((item: any) => (
                    <div
                      onClick={() => setFieldValue('stampImageId', item._id)}
                      key={item?._id}
                      className={`cursor-pointer rounded-lg border p-4 ${errors?.stampImageId && touched?.stampImageId && 'ring-2 ring-danger'} ${
                        values?.stampImageId === item._id ? 'scale-105 border-2 border-red-600 ring-1 ring-red-400' : 'border'
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <img className="h-14 w-14 object-center" src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${item.image}`} alt="" />
                        <h3 className="mt-2 text-center font-medium">
                          {item?.title?.length >= 15 ? `${item?.title?.slice(0, 14)}...` : item?.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isAddons && (
                <div className="border-l-4 border-red-400 bg-blue-50 p-4">
                  <p className="mb-3 font-semibold">Attach your Custom Stamp Image!</p>
                  <p>
                    Purchase Custom Stamp AddOn.{' '}
                    <Link href={routes.privateRoutes.retailer.membershipPlan} className="font-semibold text-danger hover:cursor-pointer">
                      Click Here
                    </Link>
                  </p>
                </div>
              )}

              {isAddons && optionsData?.customImages?.length === 0 && (
                <div className="border-l-4 border-red-400 bg-blue-50 p-4">
                  <p className="mb-3 text-sm font-semibold">There is no active custom image available!</p>
                  <p>
                    Create or Active Custom Stamp.{' '}
                    <Link href={routes.privateRoutes.retailer.stampImage.home} className="font-semibold text-danger hover:cursor-pointer">
                      Click Here
                    </Link>
                  </p>
                </div>
              )}

              {errors?.stampImageId && touched?.stampImageId && (
                <div className="flex items-center gap-x-1 text-danger">
                  <IoAlertCircle className="text-lg" />
                  <span>Select one from default or custom stamp is required!</span>
                </div>
              )}

              <InputTextarea name="description" required={false} label={t('description')} placeholder="Write here..." />

              <p className="mt-4 flex flex-col text-end text-xs font-semibold">
                <span>
                  Base Currency: <span className="text-red-600">CAD</span>
                </span>
                <span>
                  Fields marked with <span className="text-red-600">*</span> are mandatory!
                </span>
                <span>Need double-click to select a single date!</span>
              </p>

              <div className="mt-2 flex justify-end">
                <Button
                  color="danger"
                  type="submit"
                  text={t('draft')}
                  postIcon={<RiDraftLine className="text-base" />}
                  isSubmitting={submitting}
                  onClick={() => setSubmitAction('draft')}
                />
                <Button
                  color="outline"
                  type="submit"
                  text={t('publish')}
                  postIcon={<BsCheck2Circle className="text-base" />}
                  // isSubmitting={publishSubmitting}
                  onClick={() => {
                    setSubmitAction('publish');
                  }}
                />
              </div>
            </Form>
          );
        }}
      </Formik>

      <StampPublishedModal
        publishHandler={createStamp}
        modalState={publishState}
        setModalState={setPublishState}
        isSubmitting={publishSubmitting}
        setIsSubmitting={setPublishSubmitting}
        values={values}
      />
    </div>
  );
}
