'use client';

import { routes } from '@/config/routes';
import { useAdminLoginMutation } from '@/features/auth/authApi';
import { userLoggedIn } from '@/features/auth/authSlice';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ImSpinner9 } from 'react-icons/im';
import { LuMail, LuUnlock } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { Button, Input, Password } from 'rizzui';
import * as Yup from 'yup';

export default function LoginForm() {
  const { replace } = useRouter();
  const dispatch = useDispatch();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);

  const initialValues = {
    email: '',
    password: '',
  };

  const loginSchema = Yup.object().shape({
    email: Yup.string().required('Please enter your email').email('Invalid email format'),
    password: Yup.string().required('Please enter your password'),
  });

  const [adminLogin, { data: loginResponse, isSuccess: loginSuccess, isError: isLoginError, error: loginError }] = useAdminLoginMutation();

  // Handle Login Response
  useEffect(() => {
    if (isLoginError) {
      setSubmitting(false);
      if ('status' in loginError) {
        if (loginError.status === 401) {
          toast.error('Invalid Credentials!');
        } else {
          toast.error('Something went wrong! Try Again...');
        }
      }
    }

    if (loginSuccess) {
      if (loginResponse?.status) {
        toast.success('Login Successful!');
        dispatch(userLoggedIn(loginResponse?.data));

        if (['admin', 'retailer'].includes(loginResponse?.data?.role)) {
          replace(routes.admin.dashboard);
        }

        if (loginResponse?.data?.role === 'user') {
          replace(routes.user.profile);
        }
      } else {
        setSubmitting(false);
        toast.error(loginResponse?.message);
      }
    }
  }, [loginError, isLoginError, loginSuccess, loginResponse, replace, dispatch]);

  // Auto Focus
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // Submit Handler
  const handleSubmit = (values: any) => {
    setSubmitting(true);

    adminLogin({
      email: values.email,
      password: values.password,
    });
  };

  return (
    <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleSubmit}>
      {() => {
        return (
          <Form>
            <Field name="email">
              {({ field, meta }: { field: any; meta: any }) => (
                <div className="mt-3">
                  <Input
                    size="lg"
                    label={
                      <p className="flex items-center gap-x-2">
                        <LuMail className="text-base" />
                        Email
                        <span className="font-bold text-red-600"> *</span>
                      </p>
                    }
                    variant="outline"
                    color="primary"
                    labelClassName="text-base"
                    autoComplete="off"
                    placeholder={'john@example.com'}
                    ref={emailInputRef}
                    {...field}
                  />
                  <p className="mt-1 h-3 select-none px-1 font-medium text-red">{meta.touched && meta.error && meta.error}</p>
                </div>
              )}
            </Field>
            <Field name="password">
              {({ field, meta }: { field: any; meta: any }) => (
                <div className="mt-3">
                  <Password
                    size="lg"
                    label={
                      <p className="flex items-center gap-x-2">
                        <LuUnlock className="text-base" /> Password
                        <span className="font-bold text-red-600"> *</span>
                      </p>
                    }
                    variant="outline"
                    color="primary"
                    labelClassName="text-base"
                    autoComplete="off"
                    placeholder="********"
                    {...field}
                  />
                  <p className="mt-1 h-3 select-none px-1 font-medium text-red">{meta.touched && meta.error && meta.error}</p>
                </div>
              )}
            </Field>
            <div className="mt-5 justify-end">
              <Button
                color="primary"
                type="submit"
                className="flex w-full items-center justify-center text-sm font-semibold disabled:bg-[#1d58d8]"
                size="xl"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center gap-x-2">
                    Requesting... <ImSpinner9 className="animate-spin text-base" />
                  </span>
                ) : (
                  <span>Login</span>
                )}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
