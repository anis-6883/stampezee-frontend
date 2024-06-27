'use client';

import Button from '@/components/Formik/Button';
import InputPassword from '@/components/Formik/InputPassword';
import { SerializedError } from '@/features/api/apiSlice';
import { useRetailerChangePasswordMutation } from '@/features/auth/authApi';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import * as Yup from 'yup';

export default function UpdateProfileForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    oldPassword: Yup.string().required('Required!'),
    newPassword: Yup.string().required('Required!'),
    confirmPassword: Yup.string().required('Required!'),
  });

  const handleSubmit = async (values: any, { resetForm }: any) => {
    setIsSubmitting(true);
    const result: any = await retailerChangePassword(values);
    if (result?.data?.status) {
      resetForm();
    }
  };

  return (
    <div>
      <div className="mx-auto mt-8 max-h-screen max-w-[50%]">
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
  );
}
