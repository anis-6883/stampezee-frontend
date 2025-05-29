'use client';

import Button from '@/components/Formik/Button';
import FormikDatePicker from '@/components/Formik/FormikDatePicker';
import InputField from '@/components/Formik/InputField';
import InputTextarea from '@/components/Formik/InputTextArea ';
import SelectField from '@/components/Formik/SelectField';
import { routes } from '@/config/routes';
import {
  useGetSuperAdminSingleStampsQuery,
  useSuperAdminBranchCategoryImageListQuery,
  useUpdateSuperAdminStampMutation,
} from '@/features/super-admin/stamps/superAdminStampsApi';
import getFormattedDateByTimezone from '@/utils/get-formatted-date-By-Timezone';
import removeEmptyValues from '@/utils/removeEmptyValues';
import { Form, Formik } from 'formik';
import _ from 'lodash';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsPencil } from 'react-icons/bs';
import { LuCircleDollarSign } from 'react-icons/lu';
import { RiDiscountPercentLine } from 'react-icons/ri';
import * as Yup from 'yup';
import StampImgSkeleton from './StampImgSkeleton';
// import StampPublishedModal from './StampPublishedModal';

export default function Update({ Id, timezone }: { Id: any; timezone: string }) {
  console.log(timezone);
  const t = useTranslations('RetailerCreateAndUpdateStamp');
  const tCommon = useTranslations('RetailerCommon');
  const [submitting, setSubmitting] = useState(false);

  const [submitAction, setSubmitAction] = useState<string | null>(null);

  const [values, setValues] = useState({});

  // console.log(retailerId)
  const [updateStamp] = useUpdateSuperAdminStampMutation();
  const [optionsData, setOptionsData] = useState<any>();
  const { data: stampData } = useGetSuperAdminSingleStampsQuery(Id);

  const retailerId = stampData?.data?.retailerId;
  // console.log(retailerId);
  const { data: responseData, isLoading: responseIsLoading } = useSuperAdminBranchCategoryImageListQuery(
    { id: retailerId },
    { skip: !retailerId }
  );
  console.log(stampData);
  useEffect(() => {
    if (responseData) {
      setOptionsData(responseData.data);
    }
  }, [responseData]);

  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      const updatedValues = {
        ...values,
        status: true,
      };

      const changedData = removeEmptyValues(updatedValues, ['_id', 'validDateRange']);

      console.log(changedData);
      if (updatedValues.hasValidity) {
        if (updatedValues?.validDateRange?.includes('to')) {
          const dateRange = updatedValues.validDateRange.split('to').map((date: string) => date.trim());
          changedData.startedAt = dateRange[0];
          changedData.expiredAt = dateRange[1];
        } else {
          changedData.startedAt = updatedValues?.validDateRange;
          changedData.expiredAt = updatedValues?.validDateRange;
        }
      }
      if (submitAction === 'draft') {
        changedData.isPublished = stampData?.data?.isPublished;
      } else {
        changedData.isPublished = true;
      }

      const result = await updateStamp({ formData: changedData, id: Id, retailerId }).unwrap();
      router.push(routes.privateRoutes.superAdmin.stamp.home);
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
    minPurchaseAmount: stampData?.data?.minPurchaseAmount ?? '',
    rewardType: stampData?.data?.rewardType ? stampData?.data?.rewardType : '',
    promotionReward: stampData?.data?.promotionReward ? stampData?.data?.promotionReward : '',
    discountReward: stampData?.data?.discountReward ? stampData?.data?.discountReward : 0,
    hasValidity: true,
    validDateRange:
      stampData?.data?.startedAt && stampData?.data?.expiredAt
        ? `${getFormattedDateByTimezone(stampData?.data?.startedAt, timezone)} to ${getFormattedDateByTimezone(stampData?.data?.expiredAt, timezone)}`
        : '',
  };

  const validationSchema = Yup.object().shape({
    branchId: Yup.string().required('Required!'),
    stampImageId: Yup.string().required('Required!'),
    categoryId: Yup.string().required('Required!'),
    title: Yup.string().required('Required!'),
    rules: Yup.string().required('Required!'),
    noOfStampsToCollect: Yup.number()
      .typeError('No. of stamps to collect must be a number!')
      .integer('No. of stamps to collect must be an integer!')
      .min(1, 'No. of stamps to collect must be at least 1!')
      .max(20, 'No. of stamps to collect must be less than or equal to 20!')
      .required('Required!'),

    minPurchaseAmount: Yup.number()
      .typeError('Minimum purchase amount must be a number!')
      .integer('Minimum purchase amount must be an integer!')
      .min(0, 'Minimum purchase amount must be a Positive Number!')
      // .max(20, 'Minimum purchase amount must be less than or equal to 20!')
      .required('Required!'),
    rewardType: Yup.mixed().oneOf(['promotion', 'discount']).required('Reward type is required'),
    promotionReward: Yup.string().when('rewardType', {
      is: 'promotion',
      then: () => Yup.string().required('Required!'),
      otherwise: () => Yup.string(),
    }),
    discountReward: Yup.string().when('rewardType', {
      is: 'discount',
      then: () =>
        Yup.number()
          .required('Required!')
          .typeError('Discount must be a number!')
          .integer('Discount must be an integer!')
          .min(0, 'Discount must be a Positive Number!')
          .required('Required!'),
      otherwise: () => Yup.number(),
    }),
    validDateRange: Yup.string().when('hasValidity', {
      is: true,
      then: () => Yup.string().required(tCommon('required')),
      otherwise: () => Yup.string(),
    }),
    description: Yup.string().required('Required!'),
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

            if (values?.validDateRange?.includes('to')) {
              changedData.startedAt = values?.validDateRange?.split('to')[0];
              changedData.expiredAt = values?.validDateRange?.split('to')[1];
            } else {
              changedData.startedAt = values?.validDateRange;
              changedData.expiredAt = values?.validDateRange;
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
                  // disabled={stampData?.data?.isPublished}
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
                  // disabled={stampData?.data?.isPublished}
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

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <InputField
                  // readOnly={stampData?.data?.isPublished}
                  name="noOfStampsToCollect"
                  label={t('noOfStampsToCollect')}
                  type="number"
                />
                <InputField
                  // readOnly={stampData?.data?.isPublished}
                  name="minPurchaseAmount"
                  required={false}
                  label={t('minPurchaseAmount')}
                  type="number"
                  prefix={<LuCircleDollarSign className="text-xl" />}
                  placeholder="0"
                />
                <FormikDatePicker
                  // disabled={stampData?.data?.isPublished}
                  // isMinDate={true}
                  label={t('validDateRange')}
                  name="validDateRange"
                  range={true}
                  minDate={'today'}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <SelectField
                    // disabled={stampData?.data?.isPublished}
                    name="rewardType"
                    label={t('rewardType')}
                    value={values?.rewardType}
                    options={[
                      { id: 1, name: 'discount percentage', value: 'discount' },
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
                    // readOnly={stampData?.data?.isPublished}
                    name="discountReward"
                    label={t('discount')}
                    placeholder="Ex. Get 1 Coke"
                    type="number"
                    prefix={<RiDiscountPercentLine className="text-xl" />}
                  />
                )}
                {values.rewardType === 'promotion' && (
                  <InputField
                    // readOnly={stampData?.data?.isPublished}
                    name="promotionReward"
                    label={t('promotionReward')}
                    placeholder="Ex. Get 1 Coke"
                  />
                )}
              </div>

              <h2 className="font-medium">
                {t('selectDefaultImage')} <span className="text-red-600">*</span>
              </h2>
              {responseIsLoading ? (
                <StampImgSkeleton />
              ) : (
                <div className="mb-5 grid  grid-cols-1 gap-4 md:grid-cols-8">
                  {optionsData?.defaultImages?.map((item: any) => (
                    <div
                      onClick={() => setFieldValue('stampImageId', item._id)}
                      key={item?._id}
                      className={`${stampData?.data?.isPublished ? 'cursor-not-allowed' : 'cursor-pointer'} rounded-lg border p-4 ${errors?.stampImageId && touched?.stampImageId && 'ring-2 ring-danger'} ${
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
                      className={`${stampData?.data?.isPublished ? 'cursor-not-allowed' : 'cursor-pointer'} rounded-lg border p-4 ${errors?.stampImageId && touched?.stampImageId && 'ring-2 ring-danger'} ${
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

              <InputTextarea
                // readOnly={stampData?.data?.isPublished}
                name="description"
                required={true}
                label={t('offerDetails')}
                placeholder="Write here..."
              />

              <p className="mt-4 flex flex-col text-end text-xs font-semibold">
                <span>
                  {tCommon('baseCurrency')}: <span className="text-red-600">CAD</span>
                </span>
                <span dangerouslySetInnerHTML={{ __html: tCommon.raw('mandatoryFieldsMessage') }} />
                {/* <span>{tCommon('needDoubleClickToSelectASingleDate')}</span> */}
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
                {/* <Button
                    color="outline"
                    type="submit"
                    text={"Update"}
                    postIcon={<BsCheck2Circle className="text-base" />}
                    isSubmitting={submitting}
                    onClick={() => {
                      setSubmitAction('publish');
                      // setPublishState(true);
                    }}
                  /> */}
              </div>
            </Form>
          );
        }}
      </Formik>
      {/* <StampPublishedModal
        publishHandler={updateStamp}
        modalState={publishState}
        setModalState={setPublishState}
        isSubmitting={publishSubmitting}
        setIsSubmitting={setPublishSubmitting}
        values={values}
        stampId={Id}
      /> */}
    </div>
  );
}
