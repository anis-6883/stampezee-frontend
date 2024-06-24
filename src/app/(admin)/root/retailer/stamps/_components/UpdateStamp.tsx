'use client';

import Button from '@/components/Formik/Button';
import DateRangePicker from '@/components/Formik/DateRange';
import InputField from '@/components/Formik/InputField';
import InputTextarea from '@/components/Formik/InputTextArea ';
import SelectField from '@/components/Formik/SelectField';
import { routes } from '@/config/routes';
import {
  useBranchCategoryImageListQuery,
  useCreateStampMutation,
  useGetSingleStampsQuery,
  useUpdateStampMutation,
} from '@/features/retailer/stamp/stampApi';
import { IQueryType } from '@/types';
import getChangedFormData from '@/utils/getChangedFormData';
import { Form, Formik } from 'formik';
import _ from 'lodash';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import * as Yup from 'yup';
import StampImgSkeleton from './StampImgSkeleton';

export default function Update({ Id }: any) {
  const [rewardType, setRewardType] = useState<string>('promotion');
  const [submitting, setSubmitting] = useState(false);
  const [createStamp] = useCreateStampMutation();
  const [updateStamp] = useUpdateStampMutation();
  const [optionsData, setOptionsData] = useState<any>();
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });

  const { data: responseData, isLoading: responseIsLoading } = useBranchCategoryImageListQuery({});

  const { data: stampData } = useGetSingleStampsQuery(Id);

  useEffect(() => {
    if (responseData) {
      // const transformedOptionsData = responseData.data.map((item: any) => ({
      //   label: item.name,
      //   value: item._id,
      // }));
      setOptionsData(responseData.data);
    }
  }, [responseData]);

  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      // Convert values object to getChangedFormData
      const changedData = getChangedFormData(values, initialValues, ['_id', 'validDateRange']);
      changedData.rewardType = rewardType;
      changedData.startedAt = values?.validDateRange?.split('to')[0];
      changedData.expiredAt = values?.validDateRange?.split('to')[1];

      const result = await updateStamp({ formData: changedData, id: Id }).unwrap();
      router.push(routes.retailer.stamp.home);
      toast.success(result.data.message ?? 'Stamp updated successfully!');
    } catch (error: any) {
      console.error('Failed to update Stamp:', error);
      toast.error(error.data.message ?? 'Failed to update Stamp. Please try again.');
      setSubmitting(false);
    } finally {
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
    validDateRange: stampData?.data?.startedAt + ' to ' + stampData?.data?.expiredAt || '',
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
    validDateRange: Yup.string().required('Required!'),
  });

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values) => {
          // same shape as initial values
          console.log(values, 'value submit');
          handleSubmit(values);
        }}
      >
        {({ errors, touched, setFieldValue, values }) => {
          // Object.keys(errors).forEach((key) => {
          //   toast.error((errors as any)[key] as string);
          // });
          // console.log(errors, 'errors');

          return (
            <Form className="mt-5 grid gap-4">
              <div className="grid grid-cols-2 gap-x-5">
                <SelectField
                  name="branchId"
                  label="Branch"
                  value={values?.branchId}
                  options={optionsData?.branches.map((item: any) => ({
                    label: item.name,
                    value: item._id,
                  }))}
                  onChange={(option: { label: string; value: string }) => setFieldValue('branchId', option.value)}
                />

                <SelectField
                  name="categoryId"
                  label="Category"
                  value={values?.categoryId}
                  options={optionsData?.categories?.map((item: any) => ({
                    label: _.startCase(_.toLower(item.name)),
                    value: item._id,
                  }))}
                  onChange={(option: { label: string; value: string }) => setFieldValue('categoryId', option.value)}
                />
              </div>

              <InputField name="title" label="Title" placeholder="Buy 10 Pizza Get 1 Coke" />
              <InputTextarea
                name="description"
                required={false}
                label="Description"
                placeholder="Write here..."
                setFieldValue={setFieldValue}
              />
              <h2 className="font-medium">
                Select Default Image <span className="text-red-600">*</span>
              </h2>
              {responseIsLoading ? (
                <StampImgSkeleton />
              ) : (
                <div className="mb-5 flex w-full flex-wrap justify-center gap-3 md:justify-center lg:justify-start">
                  {optionsData?.defaultImages?.map((item: any) => (
                    <div
                      onClick={() => setFieldValue('stampImageId', item._id)}
                      key={item?._id}
                      className="flex h-[180px] w-[180px] rounded bg-white p-6 shadow-md"
                    >
                      <div>
                        <img src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${item.image}`} alt="" />
                        <h3 className="mt-1 text-center font-medium">{item?.title}</h3>
                      </div>
                      <input
                        style={{ backgroundImage: 'none' }}
                        type="radio"
                        id="radio1"
                        name="stampImageId"
                        value={item?._id}
                        checked={values?.stampImageId === item?._id}
                        onChange={(e) => setFieldValue('stampImageId', e.target.value)}
                        className="border-gray h-4 w-4 cursor-pointer appearance-none rounded-full border text-red-500 transition-none checked:h-3 checked:w-3 checked:bg-red-500 checked:ring-1 checked:ring-red-500 checked:ring-offset-2 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}

              <h2 className="font-medium">
                Select Custom Image <span className="text-red-600">*</span>
              </h2>
              {responseIsLoading ? (
                <StampImgSkeleton />
              ) : (
                <div className="flex w-full flex-wrap justify-center gap-3 md:justify-center lg:justify-start">
                  {optionsData?.customImages?.map((item: any) => (
                    <div
                      onClick={() => setFieldValue('stampImageId', item._id)}
                      key={item?._id}
                      className="flex h-[180px] w-[180px] rounded bg-white p-6 shadow-md"
                    >
                      <div>
                        <img src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${item.image}`} alt="" />
                        <h3 className="mt-1 text-center font-medium">{item?.title}</h3>
                      </div>
                      <input
                        style={{ backgroundImage: 'none' }}
                        type="radio"
                        id="radio1"
                        name="stampImageId"
                        value={item?._id}
                        checked={values?.stampImageId === item?._id}
                        onChange={(e) => setFieldValue('stampImageId', e.target.value)}
                        className="border-gray h-4 w-4 cursor-pointer appearance-none rounded-full border text-red-500 transition-none checked:h-4 checked:w-4 checked:bg-red-500 checked:ring-1 checked:ring-red-500 checked:ring-offset-2 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}
              {errors?.stampImageId && <span className="text-red-600">Select a stamp image of custom or default stamp</span>}
              {/* <StatusBar setFieldValue={setFieldValue} /> */}
              <div className="grid grid-cols-2 gap-x-5">
                <InputField name="rules" label="Basic Rules" placeholder="You need to buy..." />
                <DateRangePicker label="Valid Date Range" name="validDateRange" />
              </div>

              <div className="grid grid-cols-2 gap-x-5">
                <InputField name="noOfStampsToCollect" label="Number of Stamps to Collect" type="number" />
                <InputField name="minPurchaseAmount" required={false} label="Minimum Purchase Amount" type="number" />
              </div>

              <span className="font-medium">
                Reward Type <span className="text-red-600">*</span>
              </span>
              <div className="flex gap-3">
                <div>
                  <input
                    style={{ backgroundImage: 'none' }}
                    type="radio"
                    id="radio1"
                    name="discount"
                    checked={rewardType === 'discount' ? true : false}
                    onClick={() => {
                      setRewardType('discount');
                      setFieldValue('rewardType', 'discount');
                    }}
                    className="border-gray h-4 w-4 cursor-pointer appearance-none rounded-full border text-red-500 transition-none checked:h-4 checked:w-4 checked:bg-red-500 checked:ring-1 checked:ring-red-500 checked:ring-offset-2 focus:outline-none"
                  />
                  <label className="ml-1" htmlFor="">
                    {' '}
                    Discount
                  </label>
                </div>
                <div>
                  <input
                    style={{ backgroundImage: 'none' }}
                    type="radio"
                    id="radio1"
                    name="discount"
                    onClick={() => {
                      setRewardType('promotion');
                      setFieldValue('rewardType', 'promotion');
                    }}
                    checked={rewardType === 'promotion' ? true : false}
                    className="border-gray h-4 w-4 cursor-pointer appearance-none rounded-full border text-red-500 transition-none checked:h-4 checked:w-4 checked:bg-red-500 checked:ring-1 checked:ring-red-500 checked:ring-offset-2 focus:outline-none"
                  />
                  <label className="ml-1" htmlFor="">
                    {' '}
                    Promotion{' '}
                  </label>
                </div>
              </div>
              {rewardType === 'discount' && (
                <InputField name="discountReward" label="Product Reward" placeholder="Product Reward" type="number" />
              )}
              {rewardType === 'promotion' && <InputField name="promotionReward" label="Product Reward" placeholder="Product Reward" />}

              {/* {(errors?.expiredAt || errors?.startedAt) && <span className="text-red-600">Select a valid date range</span>} */}
              <p className="text-end text-xs font-semibold">
                Fields marked with <span className="text-red-600">*</span> are mandatory!
              </p>
              <div className="mt-2 flex justify-end">
                <Button type="submit" text="Submit" postIcon={<BsCheck2Circle className="text-base" />} isSubmitting={submitting} />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
