'use client';

import Button from '@/components/Formik/Button';
import DragAndDropUpload from '@/components/Formik/DragAndDropUpload';
import InputField from '@/components/Formik/InputField';
import InputTextarea from '@/components/Formik/InputTextArea ';
import SelectField from '@/components/Formik/SelectField';
import RangeSlider from '@/components/range-slider';
import { SerializedError } from '@/features/api/apiSlice';
import { useCreateNotificationByLocationMutation } from '@/features/retailer/notification/notificationApi';
import objectToFormData from '@/utils/objectToFormData';
import { Form, Formik } from 'formik';
import _ from 'lodash';
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
  googleMapsApiKey,
}: {
  formData: any;
  modalState: boolean;
  setFormData: (data: any) => void;
  setModalState: (state: boolean) => void;
  googleMapsApiKey: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createNotificationByLocation, { isSuccess: createSuccess, error: createError }] = useCreateNotificationByLocationMutation();

  const initialValues = {
    title: formData?.title || '',
    description: formData?.description || '',
    image: formData?.image || '',
    imageType: formData?.image ? 'image' : '',
    address: formData?.address || '',
    longitude: formData?.longitude || '',
    latitude: formData?.latitude || '',
    radius: formData?.radius || 1,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Required!'),
    description: Yup.string().required('Required!'),
    address: Yup.string().required('Required!'),
  });

  const submitHandler = async (values: any) => {
    setIsSubmitting(true);
    const isFile = (obj: any): obj is File => obj instanceof File;

    let objToFormData: FormData;

    if (formData?._id) {
      const ignoreList = [];
      if (!isFile(values?.image)) ignoreList.push('image');

      objToFormData = objectToFormData(values, ignoreList);
      createNotificationByLocation(objToFormData);
    } else {
      if (!values?.imageType) {
        objToFormData = objectToFormData(values, ['image', 'imageType']);
      } else {
        objToFormData = objectToFormData(values);
      }
      createNotificationByLocation(objToFormData);
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
      toast.success('Notification send successfully!');
      setFormData({});
      setIsSubmitting(false);
      setModalState(false);
    }
  }, [createError, createSuccess, setFormData, setModalState]);

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
          <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitHandler}>
            {({ setFieldValue, values }) => {
              console.log({ values });

              return (
                <Form className="mt-5">
                  <InputField name="title" label="Title" placeholder="Buy 10 Pizza Get 1 Coke" />
                  <div className="my-3">
                    <InputTextarea rows={4} name="description" label="Description" placeholder="Write here..." />
                  </div>

                  <div className=" h-full">
                    <MapComponent googleMapsApiKey={googleMapsApiKey} circle={true} radius={values.radius <= 0 ? 1 : values.radius} />
                  </div>

                  <div className="py-5">
                    <span className=" font-medium">Radius</span>
                    <RangeSlider
                      className="mt-3"
                      value={values?.radius}
                      onChange={(value: any) => setFieldValue('radius', value <= 0 ? 1 : value)}
                      marks={generateRangeObject(0, 100, 5)}
                      step={5}
                    />
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
              );
            }}
          </Formik>
        </div>
      </div>
    </Modal>
  );
}
