'use client';

import Button from '@/components/Formik/Button';
import DragAndDropUpload from '@/components/Formik/DragAndDropUpload';
import InputField from '@/components/Formik/InputField';
import InputTextarea from '@/components/Formik/InputTextArea ';
import SelectField from '@/components/Formik/SelectField';
import { SerializedError } from '@/features/api/apiSlice';
import { useCreateNotificationMutation } from '@/features/retailer/notification/notificationApi';
import objectToFormData from '@/utils/objectToFormData';
import { Form, Formik } from 'formik';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegPaperPlane } from 'react-icons/fa';
import { HiMiniXCircle } from 'react-icons/hi2';
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
  const [createNotification, { isSuccess: createSuccess, error: createError }] = useCreateNotificationMutation();

  const initialValues = {
    title: formData?.title || '',
    description: formData?.description || '',
    image: '',
    imageType: '',
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Required!'),
    description: Yup.string().required('Required!'),
  });

  const submitHandler = async (values: any) => {
    setIsSubmitting(true);

    const isFile = (obj: any): obj is File => obj instanceof File;

    let objToFormData: FormData;

    if (formData?._id) {
      const ignoreList = [];
      if (!isFile(values?.image)) ignoreList.push('image');

      objToFormData = objectToFormData(values, ignoreList);
    } else {
      if (!values?.imageType) {
        objToFormData = objectToFormData(values, ['image', 'imageType']);
      } else {
        objToFormData = objectToFormData(values);
      }
      createNotification(objToFormData);
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
      toast.success('Notification created successfully!');
      setFormData({});
      setIsSubmitting(false);
      setModalState(false);
    }
  }, [createError, createSuccess, setFormData, setModalState]);

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(true)} customSize="600px">
      <div className="m-auto px-7 pb-8 pt-6">
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
                  <InputTextarea name="description" label="Description" placeholder="Write here..." />
                </div>

                <div className="my-3">
                  <SelectField
                    name="imageType"
                    required={false}
                    label="Image Type"
                    value={values?.imageType}
                    options={[
                      { id: 1, name: 'url', value: 'url' },
                      { id: 2, name: 'image', value: 'image' },
                    ].map((item: any) => ({
                      label: _.startCase(_.toLower(item.name)),
                      value: item.value,
                    }))}
                    onChange={(option: { label: string; value: string }) => setFieldValue('imageType', option.value)}
                  />
                </div>

                {values?.imageType === 'image' && (
                  <div className="my-4">
                    <p className="font-medium">Attach Image</p>
                    <DragAndDropUpload
                      value={{ name: 'image', image: values.image }}
                      onChange={(image: any) => setFieldValue('image', image)}
                      className="mt-2"
                      size={1024 * 1000}
                      sizeText="1MB"
                    />
                  </div>
                )}

                {values?.imageType === 'url' && (
                  <div className="my-4">
                    <InputField required={false} name="image" label="Image URL" placeholder="https://picsum.photos/200" />
                  </div>
                )}

                <p className=" text-end text-xs font-semibold">
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
