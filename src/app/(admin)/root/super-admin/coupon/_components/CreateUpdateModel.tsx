'use client';

import Button from '@/components/Formik/Button';
import FormikDatePicker from '@/components/Formik/FormikDatePicker';
import InputField from '@/components/Formik/InputField';
import SelectField from '@/components/Formik/SelectField';
import { SerializedError } from '@/features/api/apiSlice';
import { RootState } from '@/features/store';
import {
  useCreateCouponAdminMutation,
  useGetAllCouponRetailersQuery,
  useUpdateCouponMutation,
} from '@/features/super-admin/coupon/couponApi';
import removeEmptyValues from '@/utils/removeEmptyValues';
import { Skeleton } from '@mantine/core';
import { Form, Formik } from 'formik';
import moment from 'moment';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { IoAlertCircle, IoCloseOutline, IoInformationCircleOutline } from 'react-icons/io5';
import { LuCircleDollarSign } from 'react-icons/lu';
import { RiDiscountPercentLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { ActionIcon, Modal, Switch, Title, Tooltip } from 'rizzui';
import * as Yup from 'yup';

export default function CreateUpdateModel({
  setFormData,
  formData,
  modalState,
  setModalState,
}: {
  formData: any;
  modalState: boolean;
  setFormData: (data: any) => void;
  setModalState: (state: boolean) => void;
}) {
  const { accessToken } = useSelector((state: RootState) => state.authSlice);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalUserLimitChecked, setTotalUserLimitChecked] = useState<boolean>(false);
  const [perUserLimitChecked, setPerUserLimitChecked] = useState<boolean>(false);
  const [showRetailers, setShowRetailers] = useState(formData?.allowFor !== 'all');
  const [createCoupon, { isSuccess: createSuccess, error: createError }] = useCreateCouponAdminMutation();
  const [updateCoupon, { isSuccess: updateSuccess, error: updateError }] = useUpdateCouponMutation();
  const { data, isLoading, isError } = useGetAllCouponRetailersQuery(
    {},
    {
      skip: !showRetailers || !modalState || !accessToken,
    }
  );

  const retailerOptions = data
    ? data?.data?.retailers.map((retailer: any, index: number) => ({
        value: retailer._id,
        label: `${retailer.storeName}-${index + 1}`,
        image: retailer.image ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${retailer.image}` : '/images/stamp-logo.png',
      }))
    : [];

  const planOptions = data
    ? data?.data?.subscriptions.map((plan: any) => ({
        value: plan._id,
        label: plan.title,
      }))
    : [];

  const initialValues = {
    title: formData?.title || '',
    code: formData?.code || '',
    description: formData?.description || '',
    discountType: formData?.discountType || 'percentage',
    discount: formData?.discount || '',
    // limit: formData?.limit || '',
    validDateRange: formData?.validDateRange || '',
    allowFor: formData?.allowFor || 'all',
    allowedRetailers: formData?.allowedRetailers || [],
    applicablePackages: formData?.applicablePackages || [],
    totalUserLimit: formData?.totalUserLimit || 0,
    perUserLimit: formData?.perUserLimit || 0,
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().trim().required('Required!'),
    code: Yup.string().trim().required('Required!').min(4, 'At least 4 characters long!'),
    discountType: Yup.string().required('Required!'),
    discount: Yup.string().when('discountType', {
      is: 'percentage',
      then: () => Yup.number().max(50, 'Value must be less then or equal to 50!').required('Required!'),
      otherwise: () => Yup.number().required('Required!'),
    }),
    // limit: Yup.number()
    //   .test('integer', 'Please enter an integer value', (value: any) => {
    //     return !isNaN(parseFloat(value)) && isFinite(value);
    //   })
    //   .min(1, 'Value must be greater then or equal to 1')
    //   .required('Required!'),
    validDateRange: Yup.string().required('Required!'),
    applicablePackages: Yup.array()
      .of(Yup.string().required('Array must contain a string'))
      .min(1, 'Select at least one package!')
      .required('Required!'),
    allowedRetailers: Yup.string().when('allowFor', {
      is: 'specific',
      then: () =>
        Yup.array().of(Yup.string().required('Array must contain a string')).min(1, 'Select at least one retailer!').required('Required!'),
      otherwise: () => Yup.array().nullable(),
    }),
    totalUserLimit: Yup.number().max(1000000, 'Value must be less then or equal to 1000000!'),
    perUserLimit: Yup.number().max(1000000, 'Value must be less then or equal to 1000000!'),
  });

  // Submit Handler
  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    const filteredValues = removeEmptyValues(values, ['validDateRange']);

    if (values?.validDateRange?.includes('to')) {
      const dateRange = values.validDateRange.split('to').map((date: string) => date.trim());
      filteredValues.startedAt = dateRange[0];
      filteredValues.expiredAt = dateRange[1];
    } else {
      filteredValues.startedAt = values?.validDateRange;
      filteredValues.expiredAt = values?.validDateRange;
    }

    if (formData?._id) {
      updateCoupon({ id: formData._id, formData: filteredValues });
    } else {
      createCoupon(filteredValues);
    }
  };

  // Create Response Handler
  useEffect(() => {
    if (createError) {
      const myError = createError as SerializedError;
      setIsSubmitting(false);
      toast.error(myError?.data?.message || 'Something went wrong!');
    }

    if (createSuccess) {
      toast.success('Coupon created successfully!');
      setFormData({});
      setIsSubmitting(false);
      setModalState(false);
      setIsSubmitting(false);
    }
  }, [createError, createSuccess, setModalState, setFormData]);

  // Update Response Handler
  useEffect(() => {
    if (updateError) {
      const myError = updateError as SerializedError;
      setIsSubmitting(false);
      toast.error(myError?.data?.message || 'Something went wrong!');
    }

    if (updateSuccess) {
      toast.success('Coupon Update successfully!');
      setFormData({});
      setIsSubmitting(false);
      setModalState(false);
      setIsSubmitting(false);
    }
  }, [updateError, updateSuccess, setModalState, setFormData]);

  return (
    <div>
      <Modal isOpen={modalState} onClose={() => setModalState(true)} customSize="700px">
        <div className="m-auto px-7 pb-8 pt-6">
          <div className="mb-7 flex items-center justify-between">
            {formData?._id ? <Title as="h4">Update A Coupon</Title> : <Title as="h4">Add New Coupon</Title>}

            <ActionIcon
              size="sm"
              variant="text"
              onClick={() => {
                setModalState(false);
                setFormData({});
                setPerUserLimitChecked(false);
                setTotalUserLimitChecked(false);
              }}
            >
              <IoCloseOutline className="text-2xl text-danger" />
            </ActionIcon>
          </div>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ setFieldValue, values, errors, touched, setFieldTouched }) => {
              const today = new Date();
              const currentDate = new Date(today.toISOString().split('T')[0]); // strip time

              return (
                <Form className="grid gap-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <InputField name="title" label="Title" placeholder="Black Friday" />
                    <InputField name="code" label="Code" placeholder="BLACK2024" />
                  </div>

                  <div className="grid grid-cols-1 gap-y-4">
                    <SelectField
                      value={values?.allowFor}
                      options={[
                        { label: 'All', value: 'all' },
                        { label: 'Specific', value: 'specific' },
                      ]}
                      onChange={(option: { label: string; value: string }) => {
                        if (option.value === 'specific') setShowRetailers(true);
                        if (option.value === 'all') setFieldValue('allowedRetailers', []);
                        setFieldValue('allowFor', option.value);
                      }}
                      name="allowFor"
                      label="Allow For"
                    />

                    {values?.allowFor !== 'all' ? (
                      showRetailers && !isLoading && !isError ? (
                        <div>
                          <div className="mb-2">
                            <p className="font-medium">
                              Select Specific Retailer
                              <span className="text-red-500"> *</span>
                            </p>
                          </div>
                          <ReactSelect
                            placeholder="Select Retailers"
                            isSearchable
                            options={retailerOptions}
                            isMulti={true}
                            getOptionLabel={getOptionLabel}
                            getOptionValue={(option) => option.label}
                            defaultValue={retailerOptions.filter((retailer: any) => values.allowedRetailers.includes(retailer.value))}
                            onChange={(option: any) => {
                              const retailerIds = option.map((obj: any) => obj.value);
                              setFieldValue('allowedRetailers', retailerIds);
                            }}
                            onBlur={() => setFieldTouched('allowedRetailers', true)}
                            styles={{
                              control: (base) => ({
                                ...base,
                                boxShadow: 'none !important',
                                ...(touched.allowedRetailers &&
                                  errors.allowedRetailers && {
                                    minHeight: '43px !important',
                                    borderRadius: '7px !important',
                                    border: '1px solid #DC3545 !important',
                                  }),
                              }),
                              input: (base) => ({
                                ...base,
                                boxShadow: 'none !important',
                              }),
                            }}
                          />
                          {touched.allowedRetailers && errors.allowedRetailers && (
                            <span className="mt-1 flex items-center gap-x-1 text-danger">
                              <IoAlertCircle className="text-lg" />
                              <span>{errors.allowedRetailers as string}</span>
                            </span>
                          )}
                        </div>
                      ) : (
                        <Skeleton className="h-10 w-full rounded" />
                      )
                    ) : null}

                    {!isLoading && !isError ? (
                      <div>
                        <div className="mb-2">
                          <p className="font-medium">
                            Select Specific Plans / Add-ons
                            <span className="text-red-500"> *</span>
                          </p>
                        </div>
                        <ReactSelect
                          placeholder="Select One"
                          isSearchable
                          isMulti={true}
                          options={planOptions}
                          getOptionValue={(option) => option.label}
                          defaultValue={planOptions.filter((plan: any) => values.applicablePackages.includes(plan.value))}
                          onChange={(option: any) => {
                            const packageIds = option.map((obj: any) => obj.value);
                            setFieldValue('applicablePackages', packageIds);
                          }}
                          onBlur={() => setFieldTouched('applicablePackages', true)}
                          styles={{
                            control: (base) => ({
                              ...base,
                              boxShadow: 'none !important',
                              ...(touched.applicablePackages &&
                                errors.applicablePackages && {
                                  minHeight: '43px !important',
                                  borderRadius: '7px !important',
                                  border: '1px solid #DC3545 !important',
                                }),
                            }),
                            input: (base) => ({
                              ...base,
                              boxShadow: 'none !important',
                            }),
                          }}
                        />
                        {touched.applicablePackages && errors.applicablePackages && (
                          <span className="mt-1 flex items-center gap-x-1 text-danger">
                            <IoAlertCircle className="text-lg" />
                            <span>{errors.applicablePackages as string}</span>
                          </span>
                        )}
                      </div>
                    ) : (
                      <Skeleton className="h-10 w-full rounded" />
                    )}
                  </div>

                  <div className="grid grid-cols-1">
                    <InputField name="description" label="Description" placeholder="Write here..." required={false} />
                  </div>

                  <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
                    <SelectField
                      value={values?.discountType}
                      options={[
                        { label: 'Percentage', value: 'percentage' },
                        { label: 'Flat', value: 'flat' },
                      ]}
                      onChange={(option: { label: string; value: string }) => setFieldValue('discountType', option.value)}
                      name="discountType"
                      label="Discount Type"
                    />
                    {values.discountType === 'percentage' ? (
                      <InputField
                        type="number"
                        name="discount"
                        label="Discount Amount"
                        placeholder="10"
                        prefix={<RiDiscountPercentLine className="text-xl" />}
                      />
                    ) : (
                      <InputField
                        type="number"
                        name="discount"
                        label="Discount Amount"
                        placeholder="10"
                        prefix={<LuCircleDollarSign className="text-xl" />}
                      />
                    )}
                    {/* <InputField type="number" name="limit" label="Limit" placeholder="1" /> */}
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <InputField
                      disabled={!totalUserLimitChecked}
                      type="number"
                      name="totalUserLimit"
                      required={false}
                      label={
                        <div className="flex items-center gap-x-1">
                          <Switch
                            switchClassName={`${totalUserLimitChecked ? '' : 'bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 shadow-gray-500/50 hover:bg-gradient-to-br focus:ring-gray-300'}`}
                            switchKnobClassName={'bg-light'}
                            variant="flat"
                            label=""
                            size="sm"
                            checked={totalUserLimitChecked}
                            onChange={() => setTotalUserLimitChecked((prev) => !prev)}
                          />
                          <span>Total User Limit</span>
                          <Tooltip
                            color="danger"
                            className={`bg-danger text-white`}
                            size="sm"
                            placement="top"
                            content={'Up to [X] users are allowed to use this coupon!'}
                            arrowClassName={`fill-danger`}
                          >
                            <span>
                              <IoInformationCircleOutline className="text-xl text-danger " />
                            </span>
                          </Tooltip>
                        </div>
                      }
                    />
                    <InputField
                      disabled={!perUserLimitChecked}
                      type="number"
                      required={false}
                      name="perUserLimit"
                      label={
                        <div className="flex items-center gap-x-1">
                          <Switch
                            switchClassName={`${perUserLimitChecked ? '' : 'bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 shadow-gray-500/50 hover:bg-gradient-to-br focus:ring-gray-300'}`}
                            switchKnobClassName={'bg-light'}
                            variant="flat"
                            label=""
                            size="sm"
                            checked={perUserLimitChecked}
                            onChange={() => setPerUserLimitChecked((prev) => !prev)}
                          />
                          <span>Per User Limit</span>
                          <Tooltip
                            color="danger"
                            className={`bg-danger text-white`}
                            size="sm"
                            placement="top"
                            content={'Each user can use this coupon up to [X] times'}
                            arrowClassName={`fill-danger`}
                          >
                            <span>
                              <IoInformationCircleOutline className="text-xl text-danger " />
                            </span>
                          </Tooltip>
                        </div>
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1">
                    <FormikDatePicker
                      isMinDate={true}
                      minDate={
                        formData?.validDateRange
                          ? moment(initialValues.validDateRange.split(' to ')[0]).isBefore(currentDate)
                            ? initialValues.validDateRange.split(' to ')[0]
                            : 'today'
                          : 'today'
                      }
                      label="Valid Date Range"
                      name="validDateRange"
                      range={true}
                    />
                  </div>

                  <p className="flex flex-col text-end text-xs font-semibold">
                    <span>
                      Base Currency: <span className="text-red-600">CAD</span>
                    </span>
                    <span>
                      Fields marked with <span className="text-red-600">*</span> are mandatory!
                    </span>
                    <span>Need double-click to select a single date!</span>
                  </p>
                  <div className="flex justify-end">
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
        </div>
      </Modal>
    </div>
  );
}

const getOptionLabel = (option: any): any => (
  <div className="flex ">
    <img src={option.image} alt={option.label} style={{ width: '20px', marginLeft: '5px' }} />
    <span className="ml-2">{option?.label?.split('-')[0]}</span>
  </div>
);
