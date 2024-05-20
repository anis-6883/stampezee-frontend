'use client';

import { useRetailerRegisterMutation } from '@/features/auth/authApi';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ImSpinner9 } from 'react-icons/im';
import { useDispatch } from 'react-redux';
import { Button } from 'rizzui';
import * as Yup from 'yup';
import InputField from './ImputField';
import OptionField from './OptionField';
import PasswordField from './PasswordField';
import PhoneNumber from './phone-number';

export default function Register({ setCurrentStep, currentStep }: { setCurrentStep: any; currentStep: any }) {
  const { replace } = useRouter();
  const dispatch = useDispatch();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);

  const initialValues = {
    storeName: '',
    firstName: '',
    lastName: '',
    email: '',
    dialCode: '',
    phone: '',
    country: '',
    province: '',
    city: '',
    postalCode: '',
    address: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    storeName: Yup.string().required('Enter your Store Name!'),
    firstName: Yup.string().required('Enter your First Name!'),
    lastName: Yup.string().required('Enter your Last Name!'),
    email: Yup.string().email('Invalid email').required('Enter your Email address!'),
    dialCode: Yup.string().required('Enter your Dial Code!'),
    phone: Yup.string().required('Enter your Phone number!'),
    province: Yup.string().required('Enter your Province!'),
    country: Yup.string().required('Please select a country'),
    city: Yup.string().required('Enter your City!'),
    postalCode: Yup.string().required('Enter your Postal Code!'),
    address: Yup.string().required('Enter your Address!'),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/,
        'Password must be at least 6 characters long with 1 uppercase, 1 lowercase, and 1 digit'
      )
      .required('Password is required'),
  });

  const [retailerRegister, { data: loginResponse, isSuccess: loginSuccess, isError: isLoginError, error: loginError }] =
    useRetailerRegisterMutation();

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const response = await axiosBackendUrl.post('/api/retailer/register', values);
      console.log(response, 'data response');

      if (response.status === 201) {
        setCurrentStep(currentStep + 1);
        toast.success(response.data.message);
      } else {
        toast.error('this email is already registered try another email');
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || 'An error occurred while submitting the form.');
      } else {
        toast.error('An error occurred while submitting the form.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mt-12 flex flex-col items-center">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ errors, touched, setFieldValue }) => (
            <Form className="grid gap-4">
              <InputField
                name="storeName"
                label="Store Name"
                placeholder="Store Name"
                errors={errors.storeName}
                touched={touched.storeName}
              />
              <div className="block items-center justify-between gap-4 sm:flex">
                <InputField
                  name="firstName"
                  label="First Name"
                  placeholder="First Name"
                  errors={errors.firstName}
                  touched={touched.firstName}
                />
                <InputField name="lastName" label="Last Name" placeholder="Last Name" errors={errors.lastName} touched={touched.lastName} />
              </div>
              <div className="block items-center justify-between gap-4 sm:flex">
                <InputField
                  name="email"
                  label="Email address"
                  placeholder="Email address"
                  errors={errors.email}
                  touched={touched.email}
                  type="email"
                  ref={emailInputRef}
                />
                <div>
                  <PhoneNumber
                    // label="Phone Number"
                    country="us"
                    preferredCountries={['us']}
                    onChange={(value, countryData: any) => {
                      setFieldValue('dialCode', `+${countryData.dialCode}`);
                      setFieldValue('phone', value.slice(countryData.dialCode.length));
                    }}
                  />
                  {errors.phone && touched.phone ? <div className="mt-1 text-sm text-red-500">{errors.phone}</div> : null}
                </div>
              </div>

              <OptionField />

              <div className="block items-center justify-between gap-4 sm:flex">
                <InputField name="province" label="Province" placeholder="Province" errors={errors.province} touched={touched.province} />
                <InputField name="city" label="City" placeholder="City" errors={errors.city} touched={touched.city} />
              </div>
              <InputField
                name="postalCode"
                label="Postal Code"
                placeholder="Postal Code"
                errors={errors.postalCode}
                touched={touched.postalCode}
              />
              <InputField name="address" label="Address" placeholder="Address" errors={errors.address} touched={touched.address} />
              <PasswordField name="password" label="Enter your password" />
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
                    <span>Next</span>
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
        <div className="mt-5">
          Sign in
          <Link href="/retailer/login" className="text-red">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}
