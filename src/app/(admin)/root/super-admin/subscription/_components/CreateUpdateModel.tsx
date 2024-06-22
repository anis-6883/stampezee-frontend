'use client';

import InputField from '@/components/Formik/InputField';
import { SerializedError } from '@/features/api/apiSlice';

import { useUpdateSubscriptionMutation } from '@/features/super-admin/Subscription/stampImageApi';
import getSubDetailsObject from '@/utils/get-subscription-details-object';
import objectToFormData from '@/utils/objectToFormData';
import { FieldArray, Form, Formik } from 'formik';
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

  const [updateSubscription, { isSuccess: updateSuccess, error: updateError }] = useUpdateSubscriptionMutation();

  let initialValues;

  if (formData?.type === 'subscription') {
    initialValues = {
      title: formData?.title || '',
      allowTotalTeamMember: formData?.allowTotalTeamMember || null,
      allowTotalBranch: formData?.allowTotalBranch || null,
      price: formData?.price || null,
      descriptions: formData?.descriptions || getSubDetailsObject(false),
    };
  } else {
    initialValues = {
      title: formData?.title || '',
      limit: formData?.limit || null,
      price: formData?.price || null,
      descriptions: formData?.descriptions || getSubDetailsObject(false),
    };
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    price: Yup.mixed().required('Price is required'),
  });

  const submitHandler = async (values: any) => {
    setIsSubmitting(true);
    const isFile = (obj: any): obj is File => obj instanceof File;

    let objToFormData: FormData;

    if (formData?._id) {
      const ignoreList = [];
      if (!isFile(values?.image)) ignoreList.push('image');

      objToFormData = objectToFormData(values, ignoreList);

      updateSubscription({ id: formData._id, data: values });
    } else {
      if (!isFile(values?.image)) {
        objToFormData = objectToFormData(values, ['image']);
      } else {
        objToFormData = objectToFormData(values);
      }
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
      setFormData({});
      setIsSubmitting(false);
      setModalState(false);
    }
  }, [setFormData, setModalState, updateError, updateSuccess]);

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(true)} customSize="600px">
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-7 flex items-center justify-between">
          {formData?._id ? <Title as="h4">Update A Subscription</Title> : <Title as="h4">Add New Subscription</Title>}

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
                <div className="">
                  <div className="flex gap-2">
                    <InputField name="title" label="Title" placeholder="Title" />
                    <InputField name="price" label="Price" type="number" placeholder="999" />
                  </div>
                  <div className="my-3 flex gap-5">
                    {formData?.type === 'subscription' && (
                      <InputField name="allowTotalBranch" label="Total Branch" type="number" placeholder="0" />
                    )}
                    {formData?.type === 'subscription' && (
                      <InputField name="allowTotalTeamMember" label="Total Team Member" type="number" placeholder="0" />
                    )}

                    {formData?.type !== 'subscription' && <InputField name="limit" type="number" label="Limit" placeholder="0" />}
                  </div>
                </div>

                <div className="relative mt-4 grid grid-cols-1 gap-4">
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
                                -
                              </div>
                            )}
                            <div className="flex-grow">
                              <div className="flex flex-col">
                                <InputField
                                  label={`Description ${index + 1}`}
                                  name={`descriptions[${index}]`}
                                  placeholder="Write here..."
                                  required={false}
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <div
                          className="flex h-5 w-8 cursor-pointer items-center justify-center rounded-full bg-[#5534eb] text-white"
                          onClick={() => arrayHelpers.push('')}
                        >
                          +
                        </div>
                      </div>
                    )}
                  />
                </div>

                <p className="mt-3 text-end text-xs font-semibold">
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
