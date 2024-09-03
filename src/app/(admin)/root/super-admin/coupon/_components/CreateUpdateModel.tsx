'use client';

import Button from '@/components/Formik/Button';
import DateRangePicker from '@/components/Formik/DateRange';
import InputField from '@/components/Formik/InputField';
import SelectField from '@/components/Formik/SelectField';
import { SerializedError } from '@/features/api/apiSlice';
import { useCreateCouponMutation, useUpdateCouponMutation } from '@/features/super-admin/coupon/couponApi';
import removeEmptyValues from '@/utils/removeEmptyValues';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { HiMiniXCircle } from 'react-icons/hi2';
import { LuCircleDollarSign } from 'react-icons/lu';
import { RiDiscountPercentLine } from 'react-icons/ri';
import { ActionIcon, Modal, Title } from 'rizzui';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createCoupon, { isSuccess: createSuccess, error: createError }] = useCreateCouponMutation();
  const [updateCoupon, { isSuccess: updateSuccess, error: updateError }] = useUpdateCouponMutation();

  const initialValues = {
    title: formData?.title || '',
    code: formData?.code || '',
    description: formData?.description || '',
    discountType: formData?.discountType || '',
    discount: formData?.discount || '',
    limit: formData?.limit || '',
    minPurchaseAmount: formData?.minPurchaseAmount || '',
    validDateRange: formData?.validDateRange || '',
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Required!'),
    code: Yup.string().required('Required!').min(6, 'At least 6 characters long!'),
    discountType: Yup.string().required('Required!'),
    discount: Yup.number()
      .test('integer', 'Please enter an integer value', (value: any) => {
        return !isNaN(parseFloat(value)) && isFinite(value);
      })
      .min(0, 'Value must be greater then or equal to 0')
      .max(50, 'Value must be less then or equal to 50')
      .required('Required!'),
    limit: Yup.number()
      .test('integer', 'Please enter an integer value', (value: any) => {
        return !isNaN(parseFloat(value)) && isFinite(value);
      })
      .min(1, 'Value must be greater then or equal to 1')
      .required('Required!'),
    minPurchaseAmount: Yup.number()
      .test('integer', 'Please enter an integer value', (value: any) => {
        return !isNaN(parseFloat(value)) && isFinite(value);
      })
      .min(0, 'Value must be greater then or equal to 0')
      .required('Required!'),
    validDateRange: Yup.string().required('Required!'),
  });

  // Submit Handler
  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    const filteredValues = removeEmptyValues(values, ['validDateRange']);
    const dateRange = values.validDateRange.split('to').map((date: string) => date.trim());

    filteredValues.startedAt = dateRange[0];
    filteredValues.expiredAt = dateRange[1];

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
              }}
            >
              <HiMiniXCircle className="text-2xl text-danger" />
            </ActionIcon>
          </div>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ setFieldValue, values }) => {
              return (
                <Form className="grid gap-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <InputField name="title" label="Title" placeholder="Black Friday" />
                    <InputField name="code" label="Code" placeholder="BLACK2024" />
                  </div>

                  <div className="grid grid-cols-1">
                    <InputField name="description" label="Description" placeholder="Write here..." required={false} />
                  </div>

                  <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
                    <SelectField
                      // selectClassName=''
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
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <InputField type="number" name="limit" label="Limit" placeholder="1" />
                    <InputField
                      type="number"
                      name="minPurchaseAmount"
                      label="Min. Purchased Amount (CAD)"
                      placeholder="5"
                      prefix={<LuCircleDollarSign className="text-xl" />}
                    />
                  </div>

                  <div className="grid grid-cols-1">
                    <DateRangePicker label="Valid Date Range" name="validDateRange" />
                  </div>

                  <p className="flex flex-col text-end text-xs font-semibold">
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
