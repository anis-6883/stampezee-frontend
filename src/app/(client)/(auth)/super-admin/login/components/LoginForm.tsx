'use client';

import Button from '@/components/Formik/Button';
import InputField from '@/components/Formik/InputField';
import InputPassword from '@/components/Formik/InputPassword';
import { ROLE } from '@/config/constants';
import { routes } from '@/config/routes';
import { SerializedError } from '@/features/api/apiSlice';
import { useSuperAdminLoginMutation } from '@/features/auth/authApi';
import { userLoggedIn } from '@/features/auth/authSlice';
import { Form, Formik } from 'formik';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { SlEnvolope, SlLock } from 'react-icons/sl';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

export default function LoginForm() {
  const { replace } = useRouter();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [superAdminLogin, { data: loginResponse, isSuccess: loginSuccess, error: loginError }] = useSuperAdminLoginMutation();

  const initialValues = {
    email: '',
    password: '',
  };

  const loginSchema = Yup.object().shape({
    email: Yup.string().required('Required!').email('Required valid email!'),
    password: Yup.string().required('Required!'),
  });

  useEffect(() => {
    if (loginError) {
      setIsSubmitting(false);
      const myError = loginError as SerializedError;
      setIsSubmitting(false);
      toast.error(myError?.data?.message || 'Something went wrong!');
    }

    if (loginSuccess) {
      dispatch(userLoggedIn(loginResponse?.data));

      signIn('credentials', {
        userData: JSON.stringify(loginResponse?.data),
        redirect: false,
      }).then((callback) => {
        if (callback?.error) {
          setIsSubmitting(false);
          toast.error(callback?.error);
        }
        if (callback?.ok && !callback?.error) {
          toast.success('Welcome to Admin Panel!');
          if (loginResponse?.data?.role === ROLE.SUPER_ADMIN) {
            replace(routes.privateRoutes.superAdmin.dashboard);
          }
        }
      });
    }
  }, [dispatch, loginError, loginResponse, loginSuccess, replace]);

  const handleSubmit = (values: { email: string; password: string }) => {
    setIsSubmitting(true);
    superAdminLogin({
      email: values.email,
      password: values.password,
    });
  };

  return (
    <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleSubmit}>
      {() => (
        <Form>
          <div className="mx-auto mt-8 w-full space-y-4">
            <InputField prefix={<SlEnvolope className="text-xl" />} name="email" label="Email" placeholder="admin@email.com" />
            <InputPassword prefix={<SlLock className="text-xl" />} name="password" label="Password" placeholder="******" />

            <p className="text-end text-xs font-semibold">
              Fields marked with <span className="text-red-600">*</span> are mandatory!
            </p>
            <Button
              color="danger"
              className="w-full"
              type="submit"
              text="Submit"
              postIcon={<BsCheck2Circle className="text-base" />}
              isSubmitting={isSubmitting}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
