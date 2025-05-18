'use client';

import Button from '@/components/Formik/Button';
import DragAndDropUpload from '@/components/Formik/DragAndDropUpload';
import InputField from '@/components/Formik/InputField';
import { SerializedError } from '@/features/api/apiSlice';
import { useUpdateSubscriptionMutation } from '@/features/super-admin/subscription/subscriptionApi';
import getSubDetailsObject from '@/utils/get-subscription-details-object';
import objectToFormData from '@/utils/objectToFormData';
import { FieldArray, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle, BsPatchCheck } from 'react-icons/bs';
import { FiUser } from 'react-icons/fi';
import { IoCloseOutline, IoStorefrontOutline } from 'react-icons/io5';
import { LuCalendarDays, LuCircleDollarSign, LuScanLine } from 'react-icons/lu';
import { ActionIcon, Checkbox, Modal, Title } from 'rizzui';
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

  const [updateSubscription, { isSuccess: updateSuccess, error: updateError }] = useUpdateSubscriptionMutation();

  const initialValues = {
    title: formData?.title || '',
    price: formData?.price || 0,
    image: formData?.image || null,
    allowTotalTeamMember: formData?.allowTotalTeamMember || null,
    allowTotalBranch: formData?.allowTotalBranch || null,
    allowTotalStamp: formData?.allowTotalStamp || null,
    limit: formData?.limit || null,
    descriptions: formData?.descriptions || getSubDetailsObject(false),
    type: formData?.type || 'subscription',
    slug: formData?.slug || '',
    duration: formData?.duration || 0,
    unlimitedFieldName: formData?.unlimitedFieldName || 'Unlimited',
    allowTotalUser: formData?.allowTotalUser || 0,
    allowTotalScan: formData?.allowTotalScan || 0,
    isUserUnlimited: formData?.allowTotalUser !== null ? false : true,
    isScanUnlimited: formData?.allowTotalScan !== null ? false : true,
    isUnlimited: formData?.isUnlimited || false,
  };

  const validationSchema = Yup.object({
    title: Yup.string().trim().required('Required!'),
    price: Yup.mixed().required('Required!'),
    slug: Yup.string().trim().required('Required!'),
    type: Yup.mixed().oneOf(['subscription', 'addon']).required('Required!'),
    duration: Yup.string().when('slug', {
      is: 'trial',
      then: () => Yup.number().typeError('Must be a number!').integer('Must be an integer!').required('Required!'),
      otherwise: () => Yup.number().nullable(),
    }),
    unlimitedFieldName: Yup.string().when('isUnlimited', {
      is: true,
      then: () => Yup.string().required('Required!'),
      otherwise: () => Yup.string().nullable(),
    }),
    allowTotalBranch: Yup.string().when('type', {
      is: 'subscription',
      then: () => Yup.number().typeError('Must be a number!').integer('Must be an integer!').required('Required!'),
      otherwise: () => Yup.number().nullable(),
    }),
    allowTotalTeamMember: Yup.string().when('type', {
      is: 'subscription',
      then: () => Yup.number().typeError('Must be a number!').integer('Must be an integer!').required('Required!'),
      otherwise: () => Yup.number().nullable(),
    }),
    allowTotalStamp: Yup.string().when('type', {
      is: 'subscription',
      then: () => Yup.number().typeError('Must be a number!').integer('Must be an integer!').required('Required!'),
      otherwise: () => Yup.number().nullable(),
    }),
    allowTotalUser: Yup.string().when('isUserUnlimited', {
      is: false,
      then: () => Yup.number().typeError('Must be a number!').integer('Must be an integer!').required('Required!'),
      otherwise: () => Yup.number().nullable(),
    }),
    allowTotalScan: Yup.string().when('isScanUnlimited', {
      is: false,
      then: () => Yup.number().typeError('Must be a number!').integer('Must be an integer!').required('Required!'),
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
  });

  // Submit Handler
  const submitHandler = async (values: any) => {
    setIsSubmitting(true);
    const isFile = (obj: any): obj is File => obj instanceof File;

    let objToFormData: FormData;
    console.log({ values });

    if (formData?._id) {
      const ignoreList = [];
      if (values?.type === 'subscription') {
        ignoreList.push('limit');
        if (values?.slug !== 'trial') {
          ignoreList.push('allowTotalScan', 'allowTotalUser');
        }
      } else {
        ignoreList.push('allowTotalBranch', 'allowTotalTeamMember', 'allowTotalStamp');
      }
      if (!isFile(values?.image)) ignoreList.push('image');

      if (values?.isScanUnlimited) {
        values.allowTotalScan = null;
      }
      if (values?.isUserUnlimited) {
        values.allowTotalUser = null;
      }
      if (!values?.isUnlimited) {
        ignoreList.push('unlimitedFieldName');
      }

      ignoreList.push('isUserUnlimited', 'isScanUnlimited');

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
      setFormData({});
      setIsSubmitting(false);
      setModalState(false);
    }
  }, [setFormData, setModalState, updateError, updateSuccess]);

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(true)} customSize="650px">
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
            <IoCloseOutline className="text-2xl text-danger" />
          </ActionIcon>
        </div>
        <div>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitHandler}>
            {({ values, setFieldValue }) => {
              return (
                <Form className="mt-5">
                  {formData?._id && formData?.type === 'subscription' && (
                    <div className="my-5 flex justify-center">
                      <DragAndDropUpload
                        value={{ name: 'image', image: values.image }}
                        onChange={(image: any) => setFieldValue('image', image)}
                        className="mt-2"
                        size={1024 * 1000}
                        sizeText="1MB"
                        isRounded={true}
                        uploadText="Upload Image"
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <InputField name="title" label="Title" placeholder="Title" />
                    <InputField
                      name="price"
                      disabled={formData?.slug === 'trial' ? true : false}
                      label="Price (CAD)"
                      type="number"
                      placeholder="9.99"
                      prefix={<LuCircleDollarSign className="text-xl" />}
                    />
                  </div>
                  {formData?.slug === 'trial' && (
                    <div className="my-1">
                      <div className="flex w-full justify-between">
                        <div className="flex items-center">
                          <span>Duration (Days)</span>
                          <span className="text-red-600">*</span>
                        </div>
                        <Checkbox
                          // inputClassName="bg-red-500"
                          className="m-2"
                          label={<span className="text-sm font-normal text-black">Unlimited</span>}
                          size="sm"
                          onChange={() => {
                            setFieldValue('isUnlimited', !values?.isUnlimited);
                          }}
                          checked={values?.isUnlimited}
                        />
                      </div>

                      {values?.isUnlimited ? (
                        <InputField
                          name="unlimitedFieldName"
                          label=""
                          type="text"
                          placeholder="Unlimited"
                          // prefix={<LuCalendarDays className="text-xl" />}
                        />
                      ) : (
                        <InputField
                          name="duration"
                          label=""
                          type="number"
                          placeholder="7"
                          prefix={<LuCalendarDays className="text-xl" />}
                        />
                      )}
                      {/* <InputField
                        name="duration"
                        hasLabelRequired={false}
                        label={
                          <div className="flex w-full justify-between">
                            <div className="flex items-center">
                              <span>Duration (Days)</span>
                              <span className="text-red-600">*</span>
                            </div>
                            <Checkbox
                              // inputClassName="bg-red-500"
                              className="m-2"
                              label={<span className="text-sm font-normal text-black">Unlimited</span>}
                              size="sm"
                              onChange={() => {
                                setFieldValue('isDurationUnlimited', !values?.isDurationUnlimited);
                              }}
                              checked={values?.isDurationUnlimited}
                            />
                          </div>
                        }
                        type="number"
                        placeholder="7"
                        prefix={<LuCalendarDays className="text-xl" />}
                      /> */}
                    </div>
                  )}
                  <div className="my-3 flex gap-3">
                    {formData?.type === 'subscription' && (
                      <InputField
                        name="allowTotalBranch"
                        label="Total Branch"
                        type="number"
                        placeholder="0"
                        prefix={<IoStorefrontOutline className="text-xl" />}
                      />
                    )}
                    {formData?.type === 'subscription' && (
                      <InputField
                        name="allowTotalStamp"
                        label="Total Stamp Cards"
                        type="number"
                        placeholder="0"
                        prefix={<BsPatchCheck className="text-xl" />}
                      />
                    )}

                    {formData?.type !== 'subscription' && (
                      <InputField
                        disabled={
                          formData?.slug === 'branch' || formData?.slug === 'stamp' || formData?.slug === 'custom_stamp_image'
                            ? true
                            : false
                        }
                        name="limit"
                        type="number"
                        label="Limit"
                        placeholder="0"
                      />
                    )}
                  </div>

                  {formData?.slug === 'trial' && (
                    <div className="my-3 flex gap-3">
                      <InputField
                        name="allowTotalScan"
                        hasLabelRequired={false}
                        label={
                          <div className="flex w-full justify-between">
                            <div className="flex items-center">
                              <span>Total Stamps</span>
                              <span className="text-red-600">*</span>
                            </div>
                            <Checkbox
                              // inputClassName="bg-red-500"
                              className="m-2"
                              label={<span className="text-sm font-normal text-black">Unlimited</span>}
                              size="sm"
                              onChange={() => {
                                setFieldValue('isScanUnlimited', !values?.isScanUnlimited);
                              }}
                              checked={values?.isScanUnlimited}
                            />
                          </div>
                        }
                        type="number"
                        placeholder="0"
                        prefix={<LuScanLine className="text-xl" />}
                        disabled={values?.isScanUnlimited}
                      />
                      <InputField
                        name="allowTotalUser"
                        hasLabelRequired={false}
                        label={
                          <div className="flex w-full justify-between">
                            <div className="flex items-center">
                              <span>Total User</span>
                              <span className="text-red-600">*</span>
                            </div>
                            <Checkbox
                              onChange={() => {
                                setFieldValue('isUserUnlimited', !values?.isUserUnlimited);
                              }}
                              checked={values?.isUserUnlimited}
                              className="m-2"
                              label={<span className="text-sm font-normal text-black">Unlimited</span>}
                              size="sm"
                            />
                          </div>
                        }
                        type="number"
                        placeholder="0"
                        prefix={<FiUser className="text-xl" />}
                        disabled={values?.isUserUnlimited}
                      />
                    </div>
                  )}

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
                                    label={`Description (${index + 1})`}
                                    name={`descriptions[${index}]`}
                                    placeholder="Write here..."
                                    required={true}
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
                            + Add
                          </button>
                        </div>
                      )}
                    />
                  </div>

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
        </div>
      </div>
    </Modal>
  );
}
