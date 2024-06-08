'use client';

import Button from '@/app/(admin)/root/_components/Button';
import InputField from '@/components/Formik/InputField';
import InputPassword from '@/components/Formik/InputPassword';
import { routes } from '@/config/routes';
import { useRetailerLoginMutation } from '@/features/auth/authApi';
import { userLoggedIn } from '@/features/auth/authSlice';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

export default function LoginForm() {
  const { replace } = useRouter();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retailerLogin, { data: loginResponse, isSuccess: loginSuccess, isError: isLoginError, error: loginError }] =
    useRetailerLoginMutation();

  const initialValues = {
    email: '',
    password: '',
  };

  const loginSchema = Yup.object().shape({
    email: Yup.string().required('Required!').email('Required valid email!'),
    password: Yup.string().required('Required!'),
  });

  useEffect(() => {
    if (isLoginError) {
      setIsSubmitting(false);
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
        setIsSubmitting(false);
        //   toast.error(loginResponse?.message || 'Login failed.');
      }
    }
  }, [loginError, isLoginError, loginSuccess, loginResponse, replace, dispatch]);

  const handleSubmit = (values: { email: string; password: string }) => {
    setIsSubmitting(true);
    retailerLogin({
      email: values.email,
      password: values.password,
    });
  };

  return (
    <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleSubmit}>
      {() => (
        <Form>
          <div className="mx-auto mt-8 w-full space-y-4">
            <InputField name="email" label="Email" placeholder="retailer@email.com" />
            <InputPassword name="password" label="Password" placeholder="******" />
            {/* <div className="flex items-center gap-3">
              <Checkbox label="" />{' '}
              <p>
                I Agree with the{' '}
                <Link href="/retailer/login" className="border-b-2">
                  Terms of Use
                </Link>{' '}
                and{' '}
                <Link href="/retailer/login" className="border-b-2">
                  Privacy Policy
                </Link>
              </p>
            </div> */}
            <p className="text-end text-xs font-semibold">
              Fields marked with <span className="text-red-600">*</span> are mandatory!
            </p>
            <Button
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
