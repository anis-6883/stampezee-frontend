'use client';

import Button from '@/components/Formik/Button';
import DragAndDropUpload from '@/components/Formik/DragAndDropUpload';
import InputField from '@/components/Formik/InputField';
import { Skeleton } from '@/components/ui/skeleton';
import { SerializedError } from '@/features/api/apiSlice';
import { useGetGeneralSettingsQuery } from '@/features/super-admin/general-settings/generalSettingsApi';
import { useGetSingleSubscriptionQuery, useUpdateSubscriptionMutation } from '@/features/super-admin/subscription/subscriptionApi';
import countryData from '@/utils/get-country-list';
import getSubDetailsObject from '@/utils/get-subscription-details-object';
import objectToFormData from '@/utils/objectToFormData';
import { FieldArray, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle, BsPatchCheck } from 'react-icons/bs';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { HiMiniXCircle } from 'react-icons/hi2';
import { IoStorefrontOutline } from 'react-icons/io5';
import { LiaCoinsSolid } from 'react-icons/lia';
import { RiTeamLine } from 'react-icons/ri';
import { RxLapTimer } from 'react-icons/rx';
import { TbFileDescription } from 'react-icons/tb';
import ReactSelect from 'react-select';
import { Badge, FieldError } from 'rizzui';
import * as Yup from 'yup';

export default function UpdateSubscription({ id }: { id: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: generalSetting, isLoading: generalSettingLoading } = useGetGeneralSettingsQuery(undefined);
  const [updateSubscription, { isSuccess: updateSuccess, error: updateError }] = useUpdateSubscriptionMutation();
  const { data, isLoading } = useGetSingleSubscriptionQuery(id);

  const formData: any = data?.data;

  let countryOptions = countryData.map((country) => ({
    value: country.currency,
    label: `${country.country} (${country?.currency})`,
    flag: country.flag,
  }));

  if (!generalSettingLoading) {
    countryOptions = generalSetting?.data?.stripe?.allowCurrencies?.reduce((acc: any, currency: any) => {
      countryOptions?.map((country: any) => {
        if (country?.label === currency?.country) {
          acc?.push(country);
        }
      });

      return acc;
    }, []);
  }

  const initialValues = {
    title: formData?.title || '',
    image: `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${formData?.image}` || null,
    allowTotalTeamMember: formData?.allowTotalTeamMember || null,
    allowTotalBranch: formData?.allowTotalBranch || null,
    allowTotalStamp: formData?.allowTotalStamp || null,
    limit: formData?.limit || null,
    descriptions: formData?.descriptions || getSubDetailsObject(false),
    type: formData?.type || 'subscription',
    slug: formData?.slug || '',
    prices:
      formData?.prices?.length > 0
        ? formData?.prices?.map((item: any) => ({ country: item?.country, currency: item?.currency, amount: item?.amount }))
        : [{ country: 'United States (USD)', currency: 'USD', amount: 0 }],
  };

  const priceSchema = Yup.object({
    country: Yup.string().required('Required!'),
    currency: Yup.string().required('Required!'),
    amount: Yup.number().required('Required!'),
  });

  const validationSchema = Yup.object({
    title: Yup.string().required('Required!'),
    slug: Yup.string().required('Required!'),
    type: Yup.mixed().oneOf(['subscription', 'addon']).required('Required!'),
    allowTotalBranch: Yup.string().when('type', {
      is: 'subscription',
      then: () => Yup.string().required('Required!'),
      otherwise: () => Yup.number().nullable(),
    }),
    allowTotalTeamMember: Yup.string().when('type', {
      is: 'subscription',
      then: () => Yup.number().required('Required!'),
      otherwise: () => Yup.number().nullable(),
    }),
    allowTotalStamp: Yup.string().when('type', {
      is: 'subscription',
      then: () => Yup.number().required('Required!'),
      otherwise: () => Yup.number().nullable(),
    }),
    limit: Yup.string().when('type', {
      is: 'addon',
      then: () => Yup.number().required('Required!'),
      otherwise: () => Yup.number().nullable(),
    }),
    descriptions: Yup.string().when('type', {
      is: 'subscription',
      then: () =>
        Yup.array()
          .of(Yup.string().required('Array must contain a string'))
          .min(1, 'Array must contain at least one string')
          .required('Required!'),
      otherwise: () => Yup.array().nullable(),
    }),
    prices: Yup.array().of(priceSchema).min(1, 'Array must contain at least one price').required('Required!'),
  });

  // Submit Handler
  const submitHandler = async (values: any) => {
    setIsSubmitting(true);
    const isFile = (obj: any): obj is File => obj instanceof File;

    let objToFormData: FormData;

    console.log('values', values);

    if (formData?._id) {
      const ignoreList = [];
      if (values?.type === 'subscription') {
        ignoreList.push('limit');
      } else {
        ignoreList.push('allowTotalBranch', 'allowTotalTeamMember', 'allowTotalStamp');
      }
      if (!isFile(values?.image)) ignoreList.push('image');

      objToFormData = objectToFormData(values, ignoreList);

      updateSubscription({ id: formData._id, data: objToFormData });
    }
  };

  // Handle Update Response
  useEffect(() => {
    if (updateError) {
      const myError = updateError as SerializedError;
      toast.error(myError?.data?.message || 'Something went wrong. Please try again!.');
      setIsSubmitting(false);
    }
    if (updateSuccess) {
      toast.success('Subscription updated successfully!');

      setIsSubmitting(false);
    }
  }, [updateError, updateSuccess]);

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }
  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitHandler}>
      {({ values, setFieldValue, touched, errors }: { values: any; setFieldValue: any; touched: any; errors: any }) => {
        // countryOptions = countryOptions?.reduce((acc: any, country: any) => {
        //   values?.prices?.filter;

        //   return acc;
        // }, []);
        return (
          <Form>
            {formData?._id && formData?.type === 'subscription' && (
              <div className="my-5 flex justify-center">
                <DragAndDropUpload
                  value={{ name: 'image', image: values.image }}
                  onChange={(image: any) => setFieldValue('image', image)}
                  className="mt-2"
                  size={1024 * 1000}
                  sizeText="1MB"
                  isRounded={true}
                  uploadText="Upload Logo"
                  brandText="Logo"
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <InputField name="title" label="Title" placeholder="Title" />
                {formData?.type === 'subscription' && (
                  <InputField
                    className="my-3"
                    name="allowTotalBranch"
                    label="Total Branch"
                    type="number"
                    placeholder="0"
                    prefix={<IoStorefrontOutline className="text-xl" />}
                  />
                )}

                {formData?.type === 'subscription' && (
                  <InputField
                    name="allowTotalTeamMember"
                    className="my-3"
                    label="Total Team Member"
                    type="number"
                    placeholder="0"
                    prefix={<RiTeamLine className="text-xl" />}
                  />
                )}

                {formData?.type === 'subscription' && (
                  <InputField
                    name="allowTotalStamp"
                    className="my-3"
                    label="Total Stamp"
                    type="number"
                    placeholder="0"
                    prefix={<BsPatchCheck className="text-xl" />}
                  />
                )}

                {formData?.type !== 'subscription' && (
                  <InputField
                    className="my-3"
                    name="limit"
                    type="number"
                    label="Limit"
                    placeholder="0"
                    prefix={<RxLapTimer className="text-xl" />}
                  />
                )}

                <p className="mb-2 font-medium">
                  Prices <span className="text-red-600">*</span>
                </p>
                <div className="relative grid grid-cols-1 gap-5">
                  <FieldArray
                    name="prices"
                    render={(arrayHelpers) => (
                      <div>
                        {values?.prices?.map((price: any, index: number) => (
                          <div key={price.id} className="z-1 relative mb-4 flex items-center gap-2">
                            {index !== 0 && (
                              <div
                                className="absolute right-[6px] top-[6px] flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                <HiMiniXCircle className="text-2xl" />
                              </div>
                            )}
                            <div className="flex-grow">
                              <div className="flex flex-col rounded-lg border p-3">
                                <div className="my-2">
                                  <Badge size="sm" className="bg-danger text-white">
                                    {index + 1}
                                  </Badge>
                                </div>
                                <p className="mb-2 font-medium">
                                  Country <span className="text-red-600">*</span>
                                </p>
                                {values?.prices?.length > 0 ? (
                                  <ReactSelect
                                    placeholder="Select your country"
                                    menuPlacement="top"
                                    // isDisabled={index === 0}
                                    isSearchable
                                    name={`prices[${index}].country`}
                                    options={countryOptions}
                                    getOptionLabel={getOptionLabel}
                                    getOptionValue={(option) => option.label}
                                    defaultValue={countryOptions.filter((country) => country.label === `${values?.prices[index]?.country}`)}
                                    onChange={(selectedOption) =>
                                      setFieldValue(`prices[${index}]`, {
                                        country: selectedOption?.label,
                                        currency: selectedOption?.value,
                                        amount: values?.prices[index]?.amount,
                                      })
                                    }
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        boxShadow: 'none !important',
                                      }),
                                      input: (base) => ({
                                        ...base,
                                        boxShadow: 'none !important',
                                      }),
                                    }}
                                  />
                                ) : (
                                  <ReactSelect
                                    placeholder="Select your country"
                                    menuPlacement="top"
                                    isSearchable
                                    name={`prices[${index}].country`}
                                    options={countryOptions}
                                    getOptionLabel={getOptionLabel}
                                    getOptionValue={(option) => option.label}
                                    onChange={(selectedOption) =>
                                      setFieldValue(`prices[${index}]`, {
                                        country: selectedOption?.label,
                                        currency: selectedOption?.value,
                                        amount: values?.prices[index]?.amount,
                                      })
                                    }
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        boxShadow: 'none !important',
                                      }),
                                      input: (base) => ({
                                        ...base,
                                        boxShadow: 'none !important',
                                      }),
                                    }}
                                  />
                                )}
                                {Array.isArray(touched?.prices) &&
                                  Array.isArray(errors?.prices) &&
                                  touched?.prices[index]?.country &&
                                  errors?.prices[index]?.country && (
                                    <FieldError error={errors?.prices[index]?.country as string} className="text-xs text-red-600" />
                                  )}
                                <div className="grid grid-cols-2 gap-3">
                                  <InputField
                                    className="my-3"
                                    disabled
                                    name={`prices[${index}].currency`}
                                    label="Currency"
                                    placeholder="CAD"
                                    prefix={<FaRegMoneyBillAlt className="text-xl" />}
                                  />
                                  <InputField
                                    type="number"
                                    className="my-3"
                                    name={`prices[${index}].amount`}
                                    label="Amount"
                                    placeholder="9.99"
                                    prefix={<LiaCoinsSolid className="text-xl" />}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          disabled={
                            !generalSettingLoading && generalSetting?.data?.stripe?.allowCurrencies?.length === values?.prices?.length
                          }
                          className={`flex ${!generalSettingLoading && generalSetting?.data?.stripe?.allowCurrencies?.length === values?.prices?.length ? 'bg-gray-500' : 'cursor-pointer bg-danger'} items-center justify-center rounded-lg px-3 py-1 text-white`}
                          onClick={() => arrayHelpers.push({ country: '', currency: '', amount: 0 })}
                        >
                          + Add Price
                        </button>
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className="relative grid grid-cols-1 gap-5">
                <div>
                  <p className="mb-2 font-medium">
                    Descriptions <span className="text-red-600">*</span>
                  </p>
                  <FieldArray
                    name="descriptions"
                    render={(arrayHelpers) => (
                      <div>
                        {values?.descriptions?.map((des: any, index: number) => (
                          <div key={des.id} className="z-1 relative mb-4 flex items-center gap-2">
                            {index !== 0 && (
                              <div
                                className="absolute right-0 top-0 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                <HiMiniXCircle className="text-2xl" />
                              </div>
                            )}
                            <div className="flex-grow">
                              <div className="flex flex-col">
                                <InputField
                                  label={
                                    <Badge size="sm" className="bg-danger text-white">
                                      {index + 1}
                                    </Badge>
                                  }
                                  name={`descriptions[${index}]`}
                                  placeholder="Write here..."
                                  required={false}
                                  prefix={<TbFileDescription className="text-xl" />}
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          className="flex cursor-pointer items-center justify-center rounded-lg bg-danger px-3 py-1 text-white"
                          onClick={() => arrayHelpers.push('')}
                        >
                          + Add More
                        </button>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="my-3"></div>

            <p className="mt-3 text-end text-xs font-semibold">
              Fields marked with <span className="text-red-600">*</span> are mandatory!
            </p>
            <div className="mt-6 flex justify-end">
              <Button
                color="danger"
                type="submit"
                text={formData?._id ? 'Update' : 'Submit'}
                postIcon={<BsCheck2Circle className="text-base" />}
                isSubmitting={isSubmitting}
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

const getOptionLabel = (option: any): any => (
  <div className="flex ">
    <img src={option.flag} alt={option.label} style={{ width: '20px', marginLeft: '5px' }} />
    <span className="ml-2">{option.label}</span>
  </div>
);
