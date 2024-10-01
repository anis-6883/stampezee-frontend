'use client';

import Button from '@/components/Formik/Button';
import DateRangePicker from '@/components/Formik/DateRange';
import InputField from '@/components/Formik/InputField';
import InputTextarea from '@/components/Formik/InputTextArea ';
import SelectField from '@/components/Formik/SelectField';
import { routes } from '@/config/routes';
import { useBranchCategoryImageListQuery, useGetSingleStampsQuery, useUpdateStampMutation } from '@/features/retailer/stamp/stampApi';
import getFormattedDate from '@/utils/get-formatted-date';
import removeEmptyValues from '@/utils/removeEmptyValues';
import { Form, Formik } from 'formik';
import _ from 'lodash';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle, BsPencil } from 'react-icons/bs';
import { LuCircleDollarSign } from 'react-icons/lu';
import { RiDiscountPercentLine } from 'react-icons/ri';
import * as Yup from 'yup';
import StampImgSkeleton from './StampImgSkeleton';
import StampPublishedModal from './StampPublishedModal';

export default function Update({ Id, offset }: any) {
  const t = useTranslations('RetailerCreateAndUpdateStamp');
  const tCommon = useTranslations('RetailerCommon');
  const [submitting, setSubmitting] = useState(false);

  const [submitAction, setSubmitAction] = useState<string | null>(null);

  const [publishState, setPublishState] = useState(false);

  const [publishSubmitting, setPublishSubmitting] = useState(false);

  const [values, setValues] = useState({});

  const [updateStamp] = useUpdateStampMutation();
  const [optionsData, setOptionsData] = useState<any>();
  const { data: responseData, isLoading: responseIsLoading } = useBranchCategoryImageListQuery(undefined);
  const { data: stampData } = useGetSingleStampsQuery(Id);

  useEffect(() => {
    if (responseData) {
      setOptionsData(responseData.data);
    }
  }, [responseData]);

  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);

      const changedData = removeEmptyValues(values, ['_id', 'validDateRange']);
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

      const result = await updateStamp({ formData: changedData, id: Id }).unwrap();
      router.push(routes.privateRoutes.retailer.stamp.home);
      toast.success(result.data.message || t('stampUpdatedSuccessfully'));
    } catch (error: any) {
      console.error('Failed to update Stamp:', error);
      toast.error(error.data.message ?? 'Failed to update Stamp. Please try again.');
      setSubmitting(false);
    }
  };

  const initialValues = {
    branchId: stampData?.data?.branchId ? stampData?.data?.branchId : '',
    stampImageId: stampData?.data?.stampImageId ? stampData?.data?.stampImageId : '',
    categoryId: stampData?.data?.categoryId ? stampData?.data?.categoryId : '',
    title: stampData?.data?.title ? stampData?.data?.title : '',
    description: stampData?.data?.description ? stampData?.data?.description : '',
    rules: stampData?.data?.rules ? stampData?.data?.rules : '',
    noOfStampsToCollect: stampData?.data?.noOfStampsToCollect ? stampData?.data?.noOfStampsToCollect : '',
    minPurchaseAmount: stampData?.data?.minPurchaseAmount ? stampData?.data?.minPurchaseAmount : '',
    rewardType: stampData?.data?.rewardType ? stampData?.data?.rewardType : '',
    promotionReward: stampData?.data?.promotionReward ? stampData?.data?.promotionReward : '',
    discountReward: stampData?.data?.discountReward ? stampData?.data?.discountReward : 0,
    hasValidity: stampData?.data?.hasValidity,
    validDateRange: stampData?.data?.hasValidity
      ? `${getFormattedDate(stampData?.data?.startedAt, offset)} to ${getFormattedDate(stampData?.data?.expiredAt, offset)}`
      : '',
  };

  const validationSchema = Yup.object().shape({
    branchId: Yup.string().required('Required!'),
    stampImageId: Yup.string().required('Required!'),
    categoryId: Yup.string().required('Required!'),
    title: Yup.string().required('Required!'),
    rules: Yup.string().required('Required!'),
    noOfStampsToCollect: Yup.number().min(1, 'Number of stamps to collect must be at least 1').required('This field is required'),
    rewardType: Yup.mixed().oneOf(['promotion', 'discount']).required('Reward type is required'),
    promotionReward: Yup.string().when('rewardType', {
      is: 'promotion',
      then: () => Yup.string().required('Required!'),
      otherwise: () => Yup.string(),
    }),
    discountReward: Yup.string().when('rewardType', {
      is: 'discount',
      then: () => Yup.number().required('Required!'),
      otherwise: () => Yup.number(),
    }),
    validDateRange: Yup.string().when('hasValidity', {
      is: true,
      then: () => Yup.string().required(tCommon('required')),
      otherwise: () => Yup.string(),
    }),
  });

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values) => {
          if (submitAction === 'draft') {
            handleSubmit(values);
          } else {
            const changedData = removeEmptyValues(values, ['validDateRange']);
            if (values.hasValidity) {
              if (values?.validDateRange?.includes('to')) {
                changedData.startedAt = values?.validDateRange?.split('to')[0];
                changedData.expiredAt = values?.validDateRange?.split('to')[1];
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
            setValues(changedData);
          }
        }}
      >
        {({ errors, setFieldValue, values, touched }) => {
          return (
            <Form className="mt-5 grid gap-4">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <SelectField
                  name="branchId"
                  label={t('branch')}
                  value={values?.branchId}
                  options={optionsData?.branches.map((item: any) => ({
                    label: item.name,
                    value: item._id,
                  }))}
                  onChange={(option: { label: string; value: string }) => setFieldValue('branchId', option.value)}
                />

                <SelectField
                  name="categoryId"
                  label={t('category')}
                  value={values?.categoryId}
                  options={optionsData?.categories?.map((item: any) => ({
                    label: _.startCase(_.toLower(item.name)),
                    value: item._id,
                  }))}
                  onChange={(option: { label: string; value: string }) => setFieldValue('categoryId', option.value)}
                />
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
                    onChange={(option: { label: string; value: boolean }) => {
                      setFieldValue('hasValidity', option.value);
                    }}
                  />
                </div>
                {values?.hasValidity && <DateRangePicker label={t('validDateRange')} name="validDateRange" />}
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
                  <InputField name="promotionReward" label={t('promotionReward')} placeholder="Ex. Get 1 Coke" />
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
              {errors?.stampImageId && <span className="text-red-600">Select a stamp image of custom or default stamp</span>}

              <InputTextarea name="description" required={false} label={t('description')} placeholder="Write here..." />

              <p className="mt-4 flex flex-col text-end text-xs font-semibold">
                <span>
                  {tCommon('baseCurrency')}: <span className="text-red-600">CAD</span>
                </span>
                <span dangerouslySetInnerHTML={{ __html: tCommon.raw('mandatoryFieldsMessage') }} />
                <span>{tCommon('needDoubleClickToSelectASingleDate')}</span>
              </p>
              <div className="mt-2 flex justify-end">
                <Button
                  color="danger"
                  type="submit"
                  text={t('update')}
                  postIcon={<BsPencil className="text-base" />}
                  isSubmitting={submitting}
                  onClick={() => setSubmitAction('draft')}
                />
                <Button
                  color="outline"
                  type="submit"
                  text={t('publish')}
                  postIcon={<BsCheck2Circle className="text-base" />}
                  onClick={() => {
                    setSubmitAction('publish');
                    setPublishState(true);
                  }}
                />
              </div>
            </Form>
          );
        }}
      </Formik>
      <StampPublishedModal
        publishHandler={updateStamp}
        modalState={publishState}
        setModalState={setPublishState}
        isSubmitting={publishSubmitting}
        setIsSubmitting={setPublishSubmitting}
        values={values}
        stampId={Id}
      />
    </div>
  );
}
