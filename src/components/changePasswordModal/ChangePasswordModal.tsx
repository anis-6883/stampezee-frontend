'use client';

import { SerializedError } from '@/features/api/apiSlice';
import { useRetailerChangePasswordMutation } from '@/features/auth/authApi';
import { RootState } from '@/features/store';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { HiMiniXCircle } from 'react-icons/hi2';
import { useSelector } from 'react-redux';
import { ActionIcon, Modal, Title } from 'rizzui';
import * as Yup from 'yup';
import Button from '../Formik/Button';
import InputPassword from '../Formik/InputPassword';

export default function ChangePasswordModal({
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
  const { role } = useSelector((state: RootState) => state.authSlice);

  const [retailerChangePassword, { isSuccess, error }] = useRetailerChangePasswordMutation();

  useEffect(() => {
    if (error) {
      const myError = error as SerializedError;
      setIsSubmitting(false);
      toast.error(myError?.data?.message || 'Something went wrong!');
    }

    if (isSuccess) {
      setIsSubmitting(false);
      toast.success('Retailer password updated successfully!');
    }
  }, [error, isSuccess]);

  const initialValues = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Required!').min(8, 'Password must be at least 8 characters'),
    newPassword: Yup.string().required('Required!').min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string().required('Required!').min(8, 'Password must be at least 8 characters'),
  });

  const handleSubmit = async (values: any, { resetForm }: any) => {
    setIsSubmitting(true);
    const result: any = await retailerChangePassword(values);
    if (result?.data?.status) {
      resetForm();
      setModalState(false);
    }
  };

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(true)} customSize="600px">
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-7 flex items-center justify-between">
          <Title as="h4">{role === 'super_admin' ? 'Super Admin' : 'Retailer'} Change Password</Title>

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
          <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ errors, setFieldValue, touched, setFieldTouched, values }) => {
              return (
                <Form className="grid gap-4">
                  <InputPassword name="oldPassword" label="Old Password" placeholder="******" />
                  <InputPassword name="newPassword" label="New Password" placeholder="******" />
                  <InputPassword name="confirmPassword" label="Confirm Password" placeholder="******" />

                  <p className="flex flex-col text-end text-xs font-semibold">
                    <span>
                      Fields marked with <span className="text-red-600">*</span> are mandatory!
                    </span>
                  </p>

                  <div className="mt-2 flex justify-end">
                    <Button type="submit" text="Update" postIcon={<BsCheck2Circle className="text-base" />} isSubmitting={isSubmitting} />
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
