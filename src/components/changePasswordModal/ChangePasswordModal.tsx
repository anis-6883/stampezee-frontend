'use client';

import { SerializedError } from '@/features/api/apiSlice';
import { useRetailerChangePasswordMutation, useSuperAdminChangePasswordMutation } from '@/features/auth/authApi';
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
  modalState,
  setModalState,
}: {
  modalState: boolean;
  setModalState: (state: boolean) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { role } = useSelector((state: RootState) => state.authSlice);

  const [retailerChangePassword, { isSuccess, error }] = useRetailerChangePasswordMutation();
  const [superAdminChangePassword, { isSuccess: superAdminChangePasswordSuccess, error: superAdminChangePasswordError }] =
    useSuperAdminChangePasswordMutation();

  useEffect(() => {
    if (role === 'retailer') {
      if (error) {
        const myError = error as SerializedError;
        setIsSubmitting(false);
        toast.error(myError?.data?.message || 'Something went wrong!');
      }

      if (isSuccess) {
        setIsSubmitting(false);
        toast.success('Retailer password updated successfully!');
      }
    } else {
      if (superAdminChangePasswordError) {
        const myError = superAdminChangePasswordError as SerializedError;
        setIsSubmitting(false);
        toast.error(myError?.data?.message || 'Something went wrong!');
      }

      if (superAdminChangePasswordSuccess) {
        setIsSubmitting(false);
        toast.success('Super admin password updated successfully!');
      }
    }
  }, [error, isSuccess, role, superAdminChangePasswordError, superAdminChangePasswordSuccess]);

  const initialValues = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    oldPassword:
      role === 'retailer'
        ? Yup.string().required('Required!').min(8, 'Password must be at least 8 characters')
        : Yup.string().required('Required!').min(6, 'Password must be at least 8 characters'),
    newPassword:
      role === 'retailer'
        ? Yup.string().required('Required!').min(8, 'Password must be at least 8 characters')
        : Yup.string().required('Required!').min(6, 'Password must be at least 8 characters'),
    confirmPassword:
      role === 'retailer'
        ? Yup.string().required('Required!').min(8, 'Password must be at least 8 characters')
        : Yup.string().required('Required!').min(6, 'Password must be at least 8 characters'),
  });

  const handleSubmit = async (values: any, { resetForm }: any) => {
    setIsSubmitting(true);
    if (values?.newPassword !== values?.confirmPassword) {
      toast.error('Does not match new password and confirm password');
      setIsSubmitting(false);
      return;
    }
    let result: any;
    if (role === 'retailer') {
      result = await retailerChangePassword(values);
    } else {
      result = await superAdminChangePassword(values);
    }
    if (result?.data?.status) {
      resetForm();
      setModalState(false);
    }
  };

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(true)} customSize="600px">
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-7 flex items-center justify-between">
          <Title as="h4"> Change Password</Title>

          <ActionIcon
            size="sm"
            variant="text"
            onClick={() => {
              setModalState(false);
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
                    <span>
                      Password must be at least <span className="text-red-600">8 characters</span> long!
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
