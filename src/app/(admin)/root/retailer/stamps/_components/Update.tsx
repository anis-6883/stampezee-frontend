'use client';
import SubmitButton from '@/components/Formik/Button';
import DateRangePicker from '@/components/Formik/DateRange';
import InputField from '@/components/Formik/InputField';
import InputTextarea from '@/components/Formik/InputTextArea ';
import SelectField from '@/components/Formik/SelectField';
import StatusBar from '@/components/Formik/StatusBar';
import { routes } from '@/config/routes';
import { useBranchCategoryImageListQuery, useCreateStampMutation, useGetSingleStampsQuery } from '@/features/retailer/stamp/stampApi';
import { IQueryType } from '@/types';
import getChangedFormData from '@/utils/getChangedFormData';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

export default function Update({ Id }: any) {
  const [rewardType, setRewardType] = useState<string>('promotion');
  const [submitting, setSubmitting] = useState(false);
  const [createStamp] = useCreateStampMutation();
  const [optionsData, setOptionsData] = useState<any>();
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });

  const { data: responseData, isLoading: responseIsLoading } = useBranchCategoryImageListQuery({});

  const { data: stampData } = useGetSingleStampsQuery(Id);

  console.log('stampData', stampData?.data);
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
      const changedData = getChangedFormData(values, initialValues, ['_id']);

      const result = await createStamp(changedData).unwrap();
      router.push(routes.retailer.stamp.home);
      toast.success(result.data.message ?? 'Stamp created successfully!');
    } catch (error: any) {
      console.error('Failed to create Stamp:', error);
      toast.error(error.data.message ?? 'Failed to create Stamp. Please try again.');
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
    // rewardType: '',
    promotionReward: stampData?.data?.promotionReward ? stampData?.data?.promotionReward : '',
    discountReward: stampData?.data?.discountReward ? stampData?.data?.discountReward : 0,
    startedAt: stampData?.data?.startedAt ? stampData?.data?.startedAt : '',
    expiredAt: stampData?.data?.expiredAt ? stampData?.data?.expiredAt : '',
    status: stampData?.data?.status ? stampData?.data?.status : true,
  };

  const validationSchema = Yup.object().shape({
    branchId: Yup.string().required('Branch is required'),
    stampImageId: Yup.string().required('Stamp Image is required'),
    categoryId: Yup.string().required('Category is required'),
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    rules: Yup.string().required('Rules are required'),
    noOfStampsToCollect: Yup.number().min(1, 'Number of stamps to collect must be at least 1').required('This field is required'),
    minPurchaseAmount: Yup.number().min(1, 'Minimum purchase amount cannot be negative').required('This field is required'),
    rewardType: Yup.mixed().oneOf(['promotion', 'discount']).required('Reward type is required'),
    promotionReward: Yup.string().required('Promotion reward is required when reward type is promotion'),
    discountReward: Yup.number().required('Discount reward is required when reward type is discount'),
    startedAt: Yup.date().required('Start date is required'),
    expiredAt: Yup.date().required('Expiration date is required'),
    status: Yup.boolean().required('This field is required'),
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
              <div className="flex w-full gap-3">
                <div className="w-1/2">
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
                </div>

                <div className="w-1/2">
                  <SelectField
                    name="categoryId"
                    label="Category"
                    value={values?.categoryId}
                    options={optionsData?.categories?.map((item: any) => ({
                      label: item.name,
                      value: item._id,
                    }))}
                    onChange={(option: { label: string; value: string }) => setFieldValue('categoryId', option.value)}
                  />
                </div>
              </div>

              <InputField name="title" label="Stamp Name" placeholder="Stamp Name" />
              <InputTextarea
                name="description"
                label="Description"
                placeholder="Write you message Description..."
                setFieldValue={setFieldValue}
              />
              <h2 className="font-semibold">Default Stamps</h2>
              <div className="mb-5 flex w-full flex-wrap justify-center gap-3 md:justify-center lg:justify-start">
                {optionsData?.defaultImages?.map((item: any) => (
                  <div key={item?._id} className="flex h-[180px] w-[180px] rounded bg-white p-6 shadow-md">
                    <div>
                      <img src="https://t4.ftcdn.net/jpg/05/26/52/11/360_F_526521105_hNPxIZsrIush3tB1vrQYqcX7yJWfptog.jpg" alt="" />
                      <h3>{item?.title}</h3>
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

              <h2 className="font-semibold">Custom Stamps</h2>
              <div className="flex w-full flex-wrap justify-center gap-3 md:justify-center lg:justify-start">
                {optionsData?.customImages?.map((item: any) => (
                  <div key={item?._id} className="flex h-[180px] w-[180px] rounded bg-white p-6 shadow-md">
                    <div>
                      <img src="https://t4.ftcdn.net/jpg/05/26/52/11/360_F_526521105_hNPxIZsrIush3tB1vrQYqcX7yJWfptog.jpg" alt="" />
                      <h3>Stamp 1</h3>
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
              <StatusBar setFieldValue={setFieldValue} />
              <InputField name="rules" label="Basic Rules" placeholder="Basic Rules" />

              <InputField name="noOfStampsToCollect" label="Number of Stamps to Collect" type="number" />
              <InputField name="minPurchaseAmount" label="Minimum Purchase Amount" type="number" />
              <div className="flex gap-3">
                <div>
                  <input
                    style={{ backgroundImage: 'none' }}
                    type="radio"
                    id="radio1"
                    name="discount"
                    checked={rewardType === 'discount' ? true : false}
                    onClick={() => setRewardType('discount')}
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
                    onClick={() => setRewardType('promotion')}
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

              <DateRangePicker startDate={values.startedAt} endDate={values.expiredAt} setFieldValue={setFieldValue} />

              <div className="flex w-48 justify-end">
                <SubmitButton text="Update" isSubmitting={submitting} />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
