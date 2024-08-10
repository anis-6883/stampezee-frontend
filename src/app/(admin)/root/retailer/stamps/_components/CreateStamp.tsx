'use client';

import Button from '@/components/Formik/Button';
import DateRangePicker from '@/components/Formik/DateRange';
import InputField from '@/components/Formik/InputField';
import InputTextarea from '@/components/Formik/InputTextArea ';
import SelectField from '@/components/Formik/SelectField';
import { routes } from '@/config/routes';
import { useBranchCategoryImageListQuery, useCreateStampMutation } from '@/features/retailer/stamp/stampApi';
import getChangedFormData from '@/utils/getChangedFormData';
import { Form, Formik } from 'formik';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { LuCircleDollarSign } from 'react-icons/lu';
import { RiDiscountPercentLine } from 'react-icons/ri';
import * as Yup from 'yup';
import StampImgSkeleton from './StampImgSkeleton';

export default function Create() {
  const { data: session }: any = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [createStamp] = useCreateStampMutation();
  const [optionsData, setOptionsData] = useState<any>();

  const isAddons = session?.user?.totalCustomStamp > 0 ? true : false;

  const { data: responseData, isLoading: responseIsLoading } = useBranchCategoryImageListQuery({});

  const initialValues = {
    branchId: '',
    stampImageId: '',
    categoryId: '',
    title: '',
    description: '',
    rules: '',
    noOfStampsToCollect: 0,
    minPurchaseAmount: 0,
    rewardType: 'discount',
    promotionReward: '',
    discountReward: 2,
    validDateRange: '',
    status: true,
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
      const changedData = getChangedFormData(values, initialValues, ['validDateRange']);

      changedData.rewardType = values.rewardType;
      if (values.hasValidity) {
        changedData.startedAt = values?.validDateRange?.split('to')[0];
        changedData.expiredAt = values?.validDateRange?.split('to')[1];
      }
      changedData.isPublished = false;
      changedData.hasValidity = values.hasValidity;
      changedData.discountReward = values?.discountReward;

      const result = await createStamp(changedData).unwrap();
      router.push(routes.privateRoutes.retailer.stamp.home);
      toast.success(result.data.message || 'Stamp created successfully!');
    } catch (error: any) {
      console.error('Failed to create Stamp:', error);
      toast.error(error.data.message || 'Failed to create Stamp. Please try again.');
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
    // validDateRange: Yup.string().required('Required!'),
  });

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      >
        {({ errors, setFieldValue, values }) => {
          return (
            <Form className="mt-5 grid gap-4">
              <div className="grid grid-cols-2 gap-x-5">
                <div>
                  <SelectField
                    name="branchId"
                    label="Branch"
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
                    label="Category"
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

              <div className="grid grid-cols-2 gap-x-5">
                <InputField name="title" label="Title" placeholder="Buy 10 Pizza Get 1 Coke" />
                <InputField name="rules" label="Basic Rules" placeholder="You need to buy..." />
              </div>

              <div className="grid grid-cols-2 gap-x-5">
                <div>
                  <SelectField
                    name="hasValidity"
                    label="Validity Period"
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

              <div className="grid grid-cols-2 gap-x-5">
                <InputField name="noOfStampsToCollect" label="Number of Stamps to Collect" type="number" />
                <InputField
                  name="minPurchaseAmount"
                  required={false}
                  label="Minimum Purchase Amount"
                  type="number"
                  prefix={<LuCircleDollarSign className="text-xl" />}
                  placeholder="0"
                />
              </div>

              <div className="grid grid-cols-2 gap-x-5">
                <div>
                  <SelectField
                    name="rewardType"
                    label="Reward Type"
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
                    label="Discount Reward"
                    placeholder="Ex. Get 1 Coke"
                    type="number"
                    prefix={<RiDiscountPercentLine className="text-xl" />}
                  />
                )}
                {values.rewardType === 'promotion' && (
                  <InputField name="promotionReward" label="Promotion Reward" placeholder="Ex. Get 1 Coke" />
                )}
              </div>

              <h2 className="font-medium">
                Select Default Image <span className="text-red-600">*</span>
              </h2>
              {responseIsLoading ? (
                <StampImgSkeleton />
              ) : (
                <div className="mb-5 flex w-full flex-wrap justify-center gap-4 md:justify-center lg:justify-start">
                  {optionsData?.defaultImages?.map((item: any) => (
                    <div
                      onClick={() => setFieldValue('stampImageId', item._id)}
                      key={item?._id}
                      className="flex w-[150px] rounded bg-white px-6 py-3 shadow-md"
                    >
                      <div>
                        <img className="object-center" src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${item.image}`} alt="" />
                        <h3 className="mt-2 text-center font-medium">
                          {' '}
                          {item?.title?.length >= 15 ? `${item?.title?.slice(0, 14)}...` : item?.title}
                        </h3>
                      </div>
                      <input
                        style={{ backgroundImage: 'none' }}
                        type="radio"
                        id="stampImageId"
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

              {optionsData?.defaultImages?.length === 0 && (
                <div className=" pt-3 text-center text-danger">
                  <span>No default image by super admin</span>
                </div>
              )}
              {optionsData?.customImages?.length > 0 && (
                <h2 className="font-medium">
                  Select Custom Image <span className="text-red-600">*</span>
                </h2>
              )}
              {responseIsLoading ? (
                <StampImgSkeleton />
              ) : (
                <div className="flex w-full flex-wrap justify-center gap-4 md:justify-center lg:justify-start">
                  {optionsData?.customImages?.map((item: any) => (
                    <div
                      onClick={() => setFieldValue('stampImageId', item._id)}
                      key={item?._id}
                      className="flex w-[150px] rounded bg-white px-6 py-3 shadow-md"
                    >
                      <div>
                        <img src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${item.image}`} alt="" />
                        <h3 className="mt-2 text-center font-medium">
                          {item?.title?.length >= 15 ? `${item?.title?.slice(0, 14)}...` : item?.title}
                        </h3>
                      </div>
                      <input
                        style={{ backgroundImage: 'none' }}
                        type="radio"
                        id="stampImageId"
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

              {!isAddons && (
                <div className="border-l-4 border-red-400 bg-blue-50 p-4">
                  <p className="mb-3 font-medium text-danger">No Add-ons</p>
                  <Link href={routes.privateRoutes.retailer.membershipPlan} className="text-danger hover:cursor-pointer">
                    Go to plans
                  </Link>
                </div>
              )}

              {isAddons && optionsData?.customImages?.length === 0 && (
                <div className="border-l-4 border-red-400 bg-blue-50 p-4">
                  <p className="mb-3 font-medium text-danger">No custom image</p>
                  <Link href={routes.privateRoutes.retailer.stampImage.home} className="text-danger hover:cursor-pointer">
                    Create custom image
                  </Link>
                </div>
              )}

              {errors?.stampImageId && <span className="text-red-600">Select one from custom or default stamp</span>}

              <InputTextarea name="description" required={false} label="Description" placeholder="Write here..." />

              <p className="text-end text-xs font-semibold">
                Fields marked with <span className="text-red-600">*</span> are mandatory!
              </p>
              <div className="mt-2 flex justify-end">
                <Button
                  color="danger"
                  type="submit"
                  text="Submit"
                  postIcon={<BsCheck2Circle className="text-base" />}
                  isSubmitting={submitting}
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
