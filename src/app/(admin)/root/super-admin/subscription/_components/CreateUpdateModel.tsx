'use client';

import InputField from '@/components/Formik/InputField';
import { SerializedError } from '@/features/api/apiSlice';

import { useUpdateSubscriptionMutation } from '@/features/super-admin/Subscription/stampImageApi';
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
  const [descriptions, setDescriptions] = useState([{ id: 1, descriptions: '' }]);
  console.log(formData);
  useEffect(() => {
    if (formData._id) {
      const desArray = formData.descriptions.map((item: string, index: number) => ({
        id: index + 1,
        descriptions: item,
      }));
      console.log('desArray', desArray);
      setDescriptions(desArray);
    }
  }, [formData]);

  const [updateSubscription, { isSuccess: updateSuccess, error: updateError }] = useUpdateSubscriptionMutation();

  const initialValues = {
    title: formData?.title || '',
    // image: formData?.image || null,
    limit: formData?.limit || null,
    allowTotalTeamMember: formData?.allowTotalTeamMember || null,
    allowTotalBranch: formData?.allowTotalBranch || null,
    price: formData?.price || null,
    descriptions: formData?.descriptions || null,
    // 'descriptions: formData?.descriptions[1] || null,
  };
  console.log('formData', formData);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    price: Yup.mixed().required('Price is required'),
  });

  const handleDescription = (e: string, id?: number) => {
    if (e === '+') {
      const maxId = descriptions.sort((a, b) => a.id - b.id)[descriptions.length - 1].id;

      setDescriptions((prev) => [...prev, { id: maxId + 1, descriptions: '' }]);
    } else {
      if (descriptions.length > 1) {
        const filterData = descriptions.filter((desc) => desc?.id !== id);
        console.log(filterData, 'filterData');
        setDescriptions(filterData);
      }
    }
  };

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
                <div className=" grid grid-cols-2 gap-2">
                  <div>
                    <InputField name="title" label="Title" placeholder="Title" />
                    <InputField name="price" label="Price" type="number" placeholder="999" />
                  </div>
                  <div>
                    <InputField name="allowTotalBranch" label="Total Branch" type="number" placeholder="0" />
                    <InputField name="allowTotalTeamMember" label="Total Team Member" type="number" placeholder="0" />
                  </div>
                </div>
                <InputField name="limit" type="number" label="Limit" placeholder="0" />

                <div className="relative mt-4 grid grid-cols-1 gap-4">
                  <div className="absolute right-0 top-0 z-50 flex justify-end">
                    <div
                      className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-[#5534eb] text-white"
                      onClick={() => handleDescription('+')}
                    >
                      +
                    </div>
                  </div>
                  {descriptions.map((des, index) => (
                    <div key={des.id} className="z-1 relative mb-4 flex items-center gap-2">
                      {index !== 0 && (
                        <div
                          className="absolute right-0 top-0 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white"
                          onClick={() => handleDescription('-', des.id)}
                        >
                          -
                        </div>
                      )}
                      <div className="flex-grow">
                        <div className="flex flex-col">
                          <InputField
                            label={`descriptions ${index + 1}`}
                            name={`descriptions[${des.id - 1}]`}
                            placeholder="Write here..."
                            required={false}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* <div className="my-4">
                  <p className="font-medium">Upload Image</p>
                  <DragAndDropUpload
                    value={{ name: 'image', image: values.image }}
                    onChange={(image: any) => setFieldValue('image', image)}
                    className="mt-2"
                    size={1024 * 1000}
                    sizeText="1MB"
                  />
                </div> */}

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
