'use client';

import DragAndDropUpload from '@/components/Formik/DragAndDropUpload';
import InputField from '@/components/Formik/InputField';
import { SerializedError } from '@/features/api/apiSlice';

import {
  useCreateSuperAdminStampImageMutation,
  useUpdateSuperAdminStampImageMutation,
} from '@/features/super-admin/stamp-image/stampImageApi';
import objectToFormData from '@/utils/objectToFormData';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { HiMiniXCircle } from 'react-icons/hi2';
import { ActionIcon, Modal, Title } from 'rizzui';
import * as Yup from 'yup';
import Button from '../../../_components/Button';

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

  const [createStampImage, { isSuccess: createSuccess, error: createError }] = useCreateSuperAdminStampImageMutation();
  const [updateStampImage, { isSuccess: updateSuccess, error: updateError }] = useUpdateSuperAdminStampImageMutation();

  const initialValues = {
    title: formData?.title || '',
    image: formData?.image || null,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    image: Yup.mixed().required('Image is required'),
  });

  const submitHandler = async (values: any) => {
    setIsSubmitting(true);
    const isFile = (obj: any): obj is File => obj instanceof File;

    let objToFormData: FormData;

    if (formData?._id) {
      const ignoreList = [];
      if (!isFile(values?.image)) ignoreList.push('image');

      objToFormData = objectToFormData(values, ignoreList);
      updateStampImage({ id: formData._id, data: objToFormData });
    } else {
      if (!isFile(values?.image)) {
        objToFormData = objectToFormData(values, ['image']);
      } else {
        objToFormData = objectToFormData(values);
      }
      createStampImage(objToFormData);
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
      toast.success('Stamp Image created successfully!');
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
      toast.success('Stamp Image updated successfully!');
      setFormData({});
      setIsSubmitting(false);
      setModalState(false);
    }
  }, [setFormData, setModalState, updateError, updateSuccess]);

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(true)} customSize="600px">
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-7 flex items-center justify-between">
          {formData?._id ? <Title as="h4">Update A Stamp Image</Title> : <Title as="h4">Add New Stamp Image</Title>}

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
                <InputField name="title" label="Title" placeholder="Stamp One" />

                <div className="my-4">
                  <p className="font-medium">
                    Upload Image <span className="text-red-600">*</span>
                  </p>
                  <DragAndDropUpload
                    value={{ name: 'image', image: values.image }}
                    onChange={(image: any) => setFieldValue('image', image)}
                    className="mt-2"
                    size={1024 * 1000}
                    sizeText="1MB"
                  />
                </div>

                <p className="text-end text-xs font-semibold">
                  Fields marked with <span className="text-red-600">*</span> are mandatory!
                </p>
                <div className="mt-6 flex justify-end">
                  <Button
                    color={formData?._id ? 'warning' : 'primary'}
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
