'use client';

import DragAndDropUpload from '@/components/Formik/DragAndDropUpload';
import InputField from '@/components/Formik/InputField';
import InputPassword from '@/components/Formik/InputPassword';
import SelectField from '@/components/Formik/SelectField';
import { useCreateSubAdminMutation, useSubAdminBranchesQuery, useUpdateSubAdminMutation } from '@/features/retailer/sub-admin/subAdminApi';
import objectToFormData from '@/utils/objectToFormData';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { HiMiniXCircle } from 'react-icons/hi2';
import { ActionIcon, Modal, Title } from 'rizzui';
import * as Yup from 'yup';
import Button from '../../../_components/Button';

export default function CreateUpdateModal({
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
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [createSubAdmin, { isError: createError, isSuccess: createSuccess }] = useCreateSubAdminMutation();
  const [updateSubAdmin, { isError: updateError, isSuccess: updateSuccess }] = useUpdateSubAdminMutation();
  const [isSubmitting, setSubmitting] = useState(false);
  const { data: branches } = useSubAdminBranchesQuery(undefined);

  useEffect(() => {
    if (branches) {
      const transformedOptions = branches?.data.map((item: any) => ({
        label: item.name,
        value: item._id,
      }));
      setOptions(transformedOptions);
    }
  }, [branches]);

  useEffect(() => {
    if (createError) {
      toast.error('Something went wrong. Please try again!.');
      setFormData({});
      setSubmitting(false);
      setModalState(false);
    }
    if (createSuccess) {
      toast.success('Sub-Admin created successfully!');
      setFormData({});
      setSubmitting(false);
      setModalState(false);
    }
  }, [createError, createSuccess, setFormData, setModalState]);

  useEffect(() => {
    if (updateError) {
      toast.error('Something went wrong. Please try again!.');
      setFormData({});
      setSubmitting(false);
      setModalState(false);
    }
    if (updateSuccess) {
      toast.success('Sub-Admin updated successfully!');
      setFormData({});
      setSubmitting(false);
      setModalState(false);
    }
  }, [setFormData, setModalState, updateError, updateSuccess]);

  const initialValues = {
    branchId: formData?.branch?._id || '',
    firstName: formData?.firstName || '',
    lastName: formData?.lastName || '',
    email: formData?.email || '',
    password: formData?.password || '',
    image: formData?.image || null,
  };

  const validationSchema = Yup.object().shape({
    branchId: Yup.string().required('Required!'),
    firstName: Yup.string().required('Required!'),
    email: Yup.string().email('Invalid email').required('Required!'),
    password: (formData?._id ? Yup.string() : Yup.string().required('Required!')).min(6, 'At least 6 characters long!'),
    image: Yup.string().nullable(),
  });

  // Submit Handler
  const submitHandler = async (values: any) => {
    setSubmitting(true);
    const isFile = (obj: any): obj is File => obj instanceof File;

    let objToFormData: FormData;

    if (formData?._id) {
      const ignoreList = ['password'];
      if (!isFile(values?.image)) ignoreList.push('image');

      objToFormData = objectToFormData(values, ignoreList);
      updateSubAdmin({ id: formData._id, data: objToFormData });
    } else {
      if (!isFile(values?.image)) {
        objToFormData = objectToFormData(values, ['image']);
      } else {
        objToFormData = objectToFormData(values);
      }
      createSubAdmin(objToFormData);
    }
  };

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(true)} customSize="600px">
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-7 flex items-center justify-between">
          <Title as="h4">Add New Sub-Admin</Title>
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
                <div className="grid grid-cols-2 gap-x-5 gap-y-5">
                  <InputField name="firstName" label="First Name" placeholder="John" />
                  <InputField name="lastName" label="Last Name" placeholder="Doe" required={false} />
                  <InputField name="email" label="Email" placeholder="john.doe@email.com" />
                  {!formData?._id && <InputPassword name="password" label="Password" placeholder="******" />}
                </div>

                <div className="my-4 space-y-5">
                  <SelectField
                    name="branchId"
                    label="Branch"
                    options={options}
                    onChange={(option: { label: string; value: string }) => setFieldValue('branchId', option.value)}
                    value={values.branchId}
                  />

                  <div>
                    <p className="font-medium">Upload Image</p>
                    <DragAndDropUpload
                      value={{ name: 'image', image: values.image }}
                      onChange={(image: any) => setFieldValue('image', image)}
                      className="mt-2"
                      size={1024 * 1000}
                      sizeText="1MB"
                    />
                  </div>
                </div>

                <div className="mt-10 flex justify-end">
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
