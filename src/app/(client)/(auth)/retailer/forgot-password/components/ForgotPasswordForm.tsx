import Button from '@/components/Formik/Button';
import InputPassword from '@/components/Formik/InputPassword';
import { routes } from '@/config/routes';
import { useRetailerChangeForgetPasswordMutation } from '@/features/auth/authApi';
import { ErrorResponse, isFetchBaseQueryError } from '@/utils/check-base-query-error';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { HiOutlineArrowSmLeft } from 'react-icons/hi';
import * as Yup from 'yup';

export default function ForgotPasswordForm({
  currentTab,
  setCurrentStep,
  setCurrentTab,
}: {
  currentTab: number;
  setCurrentStep: any;
  setCurrentTab: any;
}) {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const [
    retailerChangeForgetPassword,
    { data: forgetResponse, isSuccess: forgetSuccess, isError: forgetError, error: changePasswordError },
  ] = useRetailerChangeForgetPasswordMutation();

  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  const loginSchema = Yup.object().shape({
    password: Yup.string().required('Required!').min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string().required('Required!').min(8, 'Password must be at least 8 characters'),
  });

  // Handle Forget Password Response
  useEffect(() => {
    if (forgetError) {
      setSubmitting(false);
      if (isFetchBaseQueryError(changePasswordError)) {
        const errorMessage = (changePasswordError.data as ErrorResponse)?.message || 'Something went wrong! Try Again';
        toast.error(errorMessage);
      } else {
        toast.error('Something went wrong! Try Again');
      }
    }

    if (forgetSuccess) {
      setSubmitting(false);

      if (forgetResponse?.status) {
        toast.success(forgetResponse?.message);
        router.push(routes.retailer.login);
      } else {
        toast.error(forgetResponse?.message);
      }
    }
  }, [forgetError, forgetResponse, forgetSuccess, router, changePasswordError]);

  const handleSubmit = (values: { password: string; confirmPassword: string }) => {
    setSubmitting(true);
    if (values?.password !== values?.confirmPassword) {
      toast.error('Does not match new password and confirm password');
      setSubmitting(false);
    } else {
      retailerChangeForgetPassword(values);
    }
  };

  return (
    <div className={`card-body ${currentTab === 2 ? '' : 'hidden'}`}>
      <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleSubmit}>
        {() => (
          <Form>
            <div className="mx-auto w-full space-y-4 p-5">
              <InputPassword name="password" label="New Password" placeholder="******" />

              <InputPassword name="confirmPassword" label="Confirm Password" placeholder="******" />
              <p className="flex flex-col text-end text-xs font-semibold">
                <span className="text-end text-xs font-semibold">
                  Fields marked with <span className="text-red-600">*</span> are mandatory!
                </span>
                <span>
                  Password must be at least <span className="text-red-600">8 characters</span> long!
                </span>
              </p>
              <Button
                className="w-full"
                type="submit"
                text="Next"
                postIcon={<BsCheck2Circle className="text-base" />}
                isSubmitting={submitting}
              />
              <div className="mt-5 flex select-none items-center justify-center p-3">
                <Link href="/" className="flex items-center transition-all duration-150 ease-in hover:text-primary">
                  <HiOutlineArrowSmLeft className="mr-3 text-xl" /> Go to Home
                </Link>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
