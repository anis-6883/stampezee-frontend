import Button from '@/components/Formik/Button';
import InputField from '@/components/Formik/InputField';
import { useRetailerForgotPasswordMutation } from '@/features/auth/authApi';
import { ErrorResponse, isFetchBaseQueryError } from '@/utils/check-base-query-error';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { HiOutlineArrowSmLeft } from 'react-icons/hi';
import * as Yup from 'yup';

export default function ForgotEmailInput({
  currentTab,
  setCurrentStep,
  setCurrentTab,
}: {
  currentTab: number;
  setCurrentStep: any;
  setCurrentTab: any;
}) {
  const [submitting, setSubmitting] = useState(false);

  const [retailerForgotPassword, { data: forgetResponse, isSuccess: forgetSuccess, isError: forgetError, error: forgotPasswordError }] =
    useRetailerForgotPasswordMutation();

  const initialValues = {
    email: '',
  };

  const emailSchema = Yup.object().shape({
    email: Yup.string().required('Required!').email('Required valid email!'),
  });

  // Handle Forget Password Response
  useEffect(() => {
    if (forgetError) {
      setSubmitting(false);
      if (isFetchBaseQueryError(forgotPasswordError)) {
        const errorMessage = (forgotPasswordError.data as ErrorResponse)?.message || 'Something went wrong! Try Again';
        toast.error(errorMessage);
      } else {
        toast.error('Something went wrong! Try Again');
      }
    }

    if (forgetSuccess) {
      setSubmitting(false);

      if (forgetResponse?.status) {
        setCurrentStep((prev: number) => prev + 1);
        setCurrentTab((prev: number) => prev + 1);
        toast.success(forgetResponse?.message);
      } else {
        toast.error(forgetResponse?.message);
      }
    }
  }, [forgetError, forgetResponse, forgetSuccess, setCurrentStep, setCurrentTab, forgotPasswordError]);

  const handleSubmit = (values: { email: string }) => {
    setSubmitting(true);
    retailerForgotPassword(values);
  };

  return (
    <div className={`card-body ${currentTab === 0 ? '' : 'hidden'}`}>
      <Formik initialValues={initialValues} validationSchema={emailSchema} onSubmit={handleSubmit}>
        {() => (
          <Form>
            <div className="mx-auto mt-8 w-full space-y-4 p-5">
              <InputField name="email" label="Email" placeholder="retailer@email.com" />

              <p className="text-end text-xs font-semibold">
                Fields marked with <span className="text-red-600">*</span> are mandatory!
              </p>
              <Button
                className="w-full"
                type="submit"
                text="Next"
                postIcon={<BsCheck2Circle className="text-base" />}
                isSubmitting={submitting}
              />
              <div className="mt-5 flex select-none items-center justify-center py-3">
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
