'use client';

import Button from '@/components/Formik/Button';
import InputField from '@/components/Formik/InputField';
import InputTextarea from '@/components/Formik/InputTextArea ';
import { SerializedError } from '@/features/api/apiSlice';
import { useCreateFaqMutation, useUpdateFaqMutation } from '@/features/super-admin/faq/faqApi';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';
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

  const [createFaq, { isSuccess: createSuccess, error: createError }] = useCreateFaqMutation();
  const [updateFaq, { isSuccess: updateSuccess, error: updateError }] = useUpdateFaqMutation();

  const initialValues = {
    title: formData?.title || '',
    description: formData?.description || '',
  };

  const validationSchema = Yup.object({
    title: Yup.string().trim().required('Required!'),
    description: Yup.string().trim().required('Required!'),
  });

  const submitHandler = async (values: any) => {
    setIsSubmitting(true);

    if (formData?._id) {
      updateFaq({ id: formData._id, formData: values });
    } else {
      createFaq(values);
    }
  };

  // Handle Create Response
  useEffect(() => {
    if (createError) {
      const myError = createError as SerializedError;
      toast.error(myError?.data?.message || 'Something went wrong. Please try again!.');
      setIsSubmitting(false);
    }
    if (createSuccess) {
      toast.success('Faq created successfully!');
      setFormData({});
      setIsSubmitting(false);
      setModalState(false);
    }
  }, [createError, createSuccess, setFormData, setModalState]);

  // Handle Update Response
  useEffect(() => {
    if (updateError) {
      const myError = updateError as SerializedError;
      toast.error(myError?.data?.message || 'Something went wrong. Please try again!.');
      setIsSubmitting(false);
    }
    if (updateSuccess) {
      toast.success('Faq updated successfully!');
      setFormData({});
      setIsSubmitting(false);
      setModalState(false);
    }
  }, [setFormData, setModalState, updateError, updateSuccess]);

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(true)} customSize="600px">
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-7 flex items-center justify-between">
          {formData?._id ? <Title as="h4">Update An Faq</Title> : <Title as="h4">Add New Faq</Title>}

          <ActionIcon
            size="sm"
            variant="text"
            onClick={() => {
              setModalState(false);
              setFormData({});
            }}
          >
            <IoCloseOutline className="text-2xl text-danger" />
          </ActionIcon>
        </div>
        <div>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitHandler}>
            {({ setFieldValue, values }) => (
              <Form className="mt-5">
                <InputField name="title" label="Title" placeholder="What is Stampzee?" />
                <div className="my-3">
                  <InputTextarea name="description" label="Description" placeholder="Write here..." />
                </div>

                <p className="text-end text-xs font-semibold">
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
            )}
          </Formik>
        </div>
      </div>
    </Modal>
  );
}
