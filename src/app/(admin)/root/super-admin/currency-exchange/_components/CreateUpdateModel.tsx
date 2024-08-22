'use client';

import Button from '@/components/Formik/Button';
import InputField from '@/components/Formik/InputField';
import { SerializedError } from '@/features/api/apiSlice';
import { useCreateCurrencyMutation, useUpdateCurrencyMutation } from '@/features/super-admin/currency/currencyApi';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { HiMiniXCircle } from 'react-icons/hi2';
import { LuCircleDollarSign } from 'react-icons/lu';
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
  const [createCurrency, { isSuccess: createSuccess, error: createError }] = useCreateCurrencyMutation();
  const [updateCurrency, { isSuccess: updateSuccess, error: updateError }] = useUpdateCurrencyMutation();

  const initialValues = {
    name: formData?.name || '',
    exchangeRate: formData?.exchangeRate || '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required!'),
    exchangeRate: Yup.number()
      .test('integer', 'Please enter an integer value', (value: any) => {
        return !isNaN(parseFloat(value)) && isFinite(value);
      })
      .required('Required!'),
  });

  // Submit Handler
  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);

    if (formData?._id) {
      updateCurrency({ id: formData._id, formData: values });
    } else {
      createCurrency(values);
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
      toast.success('Currency created successfully!');
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
      toast.success('Currency Update successfully!');
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
                    <InputField name="name" label="Name" placeholder="USD" />
                    <InputField
                      type="number"
                      name="exchangeRate"
                      label="Exchange Rate"
                      placeholder="10"
                      prefix={<LuCircleDollarSign className="text-xl" />}
                    />
                  </div>

                  <p className="flex flex-col text-end text-xs font-semibold">
                    <span>
                      Fields marked with <span className="text-red-600">*</span> are mandatory!
                    </span>
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
