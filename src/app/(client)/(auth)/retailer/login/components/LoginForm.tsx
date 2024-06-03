'use client';
import { routes } from '@/config/routes';
import { useRetailerLoginMutation } from '@/features/auth/authApi';
import { userLoggedIn } from '@/features/auth/authSlice';
import { Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ImSpinner9 } from 'react-icons/im';
import { LuUnlock } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

export default function LoginForm() {
  const { replace } = useRouter();
  const dispatch = useDispatch();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const initialValues = {
    email: '',
    password: '',
  };

  const loginSchema = Yup.object().shape({
    email: Yup.string().required('Please enter your email').email('Invalid email format'),
    password: Yup.string().required('Please enter your password'),
  });

  const [retailerLogin, { data: loginResponse, isSuccess: loginSuccess, isError: isLoginError, error: loginError }] =
    useRetailerLoginMutation();
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
        dispatch(userLoggedIn({ ...loginResponse?.data, isLoggedIn: true }));

        let role = loginResponse.data.role;

        if (['retailer'].includes(role)) {
          replace(routes.retailer.dashboard);
        }
      } else {
        setSubmitting(false);
        //   toast.error(loginResponse?.message || 'Login failed.');
      }
    }
  }, [loginError, isLoginError, loginSuccess, loginResponse, replace, dispatch]);

  const handleSubmit = (values: { email: string; password: string }) => {
    setSubmitting(true);
    retailerLogin({
      email: values.email,
      password: values.password,
    });
  };

  return (
    <div className="flex min-h-screen justify-center bg-gray-100 text-gray-900">
      <div className="m-0 flex max-w-screen-xl flex-1 justify-center overflow-hidden bg-white shadow sm:m-10 sm:rounded-lg">
        <div className="p-2 sm:p-12 md:p-6 lg:w-1/2 xl:w-5/12">
          <div>
            <img src="./../images/logo.png" className="mx-auto w-20" alt="logo" />
          </div>
          <div className="mt-8 flex flex-col items-center">
            <h1 className="text-xl font-extrabold xl:text-2xl">Sign In</h1>
            <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleSubmit}>
              {({ errors, touched }) => (
                <Form className="mt-8 w-full">
                  <div className="mx-auto max-w-xs">
                    <Field
                      name="email"
                      innerRef={emailInputRef}
                      className={`w-full rounded-lg border ${errors.email && touched.email ? 'border-red-500' : 'border-gray-200'} bg-gray-100 py-[0.6rem] text-sm font-medium placeholder-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none`}
                      placeholder="Email"
                      type="email"
                    />
                    {errors.email && touched.email && <div className="mt-2 text-xs text-red-500">{errors.email}</div>}
                    <Field
                      name="password"
                      className={`mt-5 w-full rounded-lg border ${errors.password && touched.password ? 'border-red-500' : 'border-gray-200'} bg-gray-100  py-[0.6rem] text-sm font-medium placeholder-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none`}
                      placeholder="Password"
                      type="password"
                    />
                    {errors.password && touched.password && <div className="mt-2 text-xs text-red-500">{errors.password}</div>}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="focus:shadow-outline mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 py-3 font-semibold tracking-wide text-gray-100 transition-all duration-300 ease-in-out hover:bg-indigo-700 focus:outline-none"
                    >
                      {submitting ? <ImSpinner9 className="mr-3 h-5 w-5 animate-spin" /> : <LuUnlock className="h-4 w-4" />}
                      <span>Sign In</span>
                    </button>
                    <p className="mt-6 text-center text-xs leading-5 text-gray-600">
                      {` I agree to abide by templatana's`}
                      <a href="#" className="border-b border-dotted border-gray-500 font-semibold">
                        Terms of Service
                      </a>{' '}
                      and its{' '}
                      <a href="#" className="border-b border-dotted border-gray-500 font-semibold">
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
            <div className="mt-5">
              New user?{' '}
              <Link href="/retailer/register" className="border-red text-red border-b">
                Create an account
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden flex-1 bg-indigo-100 text-center lg:flex">
          <div
            className="m-12 w-full bg-contain bg-center bg-no-repeat xl:m-16"
            style={{
              backgroundImage:
                'url("https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg")',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
