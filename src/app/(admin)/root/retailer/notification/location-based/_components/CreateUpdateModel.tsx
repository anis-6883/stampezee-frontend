'use client';

import Button from '@/components/Formik/Button';
import InputField from '@/components/Formik/InputField';
import InputTextarea from '@/components/Formik/InputTextArea ';
import RangeSlider from '@/components/range-slider';
import { SerializedError } from '@/features/api/apiSlice';
import { useCreateFaqMutation, useUpdateFaqMutation } from '@/features/super-admin/faq/faqApi';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegPaperPlane } from 'react-icons/fa';
import { HiMiniXCircle } from 'react-icons/hi2';
import { ActionIcon, Modal, Title } from 'rizzui';
import * as Yup from 'yup';
import MapComponent from '../../../branch/_components/Map';

function generateRangeObject(start: number, end: number, step: number) {
  const rangeObject: any = {};
  for (let i = start; i <= end; i += step) {
    if (i === 0) {
      rangeObject[i] = '1km';
    } else if (i === end) {
      rangeObject[i] = `${end}km`;
    } else {
      rangeObject[i] = String(i);
    }
  }
  return rangeObject;
}

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
    title: Yup.string().required('Required!'),
    description: Yup.string().required('Required!'),
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
    <Modal isOpen={modalState} onClose={() => setModalState(true)} customSize="700px">
      <div className="m-auto select-none px-7 pb-8 pt-6">
        <div className="mb-7 flex items-center justify-between">
          {formData?._id ? <Title as="h4">Resend Notification</Title> : <Title as="h4">Send Notification</Title>}

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
        <div>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitHandler}>
            {({ setFieldValue, values }) => (
              <Form className="mt-5">
                <InputField name="title" label="Title" placeholder="Buy 10 Pizza Get 1 Coke" />
                <div className="my-3">
                  <InputTextarea rows={4} name="description" label="Description" placeholder="Write here..." />
                </div>
                <div className="pt-5">
                  <span className=" font-medium">Radius</span>
                  <RangeSlider
                    className="mt-3"
                    range
                    marks={generateRangeObject(0, 100, 5)}
                    step={5}
                    // defaultValue={[1, 100]}
                  />
                </div>
                <div className="mt-10 h-full">
                  <MapComponent />
                </div>
                <p className="mt-4 text-end text-xs font-semibold">
                  Fields marked with <span className="text-red-600">*</span> are mandatory!
                </p>
                <div className="mt-6 flex justify-end">
                  <Button
                    color="danger"
                    type="submit"
                    text={formData?._id ? 'Resend' : 'Send'}
                    postIcon={<FaRegPaperPlane className="text-base" />}
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
