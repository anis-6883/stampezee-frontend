'use client';

import { Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { ImSpinner9 } from 'react-icons/im';
import { useDispatch } from 'react-redux';
import { Button } from 'rizzui';
import * as Yup from 'yup';
import InputField from './ImputField';
import OptionFild from './OptionField';
import PasswordField from './PasswordField';

export default function Register() {
  const { replace } = useRouter();
  const dispatch = useDispatch();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);

  const initialValues = {
    store_name: '',
    fName: '',
    lName: '',
    email: '',
    phone: '',
    country: '',
    province: '',
    city: '',
    postal_code: '',
    address: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    store_name: Yup.string().required('Enter your Store Name!'),
    fName: Yup.string().required('Enter your First Name!'),
    lName: Yup.string().required('Enter your Last Name!'),
    email: Yup.string().email('Invalid email').required('Enter your Email address!'),
    phone: Yup.string().required('Enter your Phone number!'),
    province: Yup.string().required('Enter your Province!'),
    country: Yup.string().required('Please select a country'),
    city: Yup.string().required('Enter your City!'),
    postal_code: Yup.string().required('Enter your Postal Code!'),
    address: Yup.string().required('Enter your Address!'),
    password: Yup.string().required('Enter your password!'),
  });
  //   const [adminLogin, { data: loginResponse, isSuccess: loginSuccess, isError: isLoginError, error: loginError }] = useAdminLoginMutation();

  // Handle Login Response
  //   useEffect(() => {
  //     // if (isLoginError) {
  //     //   setSubmitting(false);
  //     //   if ('status' in loginError) {
  //     //     if (loginError.status === 401) {
  //     //       toast.error('Invalid Credentials!');
  //     //     } else {
  //     //       toast.error('Something went wrong! Try Again...');
  //     //     }
  //     //   }
  //     // }

  //     if (loginSuccess) {
  //       if (loginResponse?.status) {
  //         toast.success('Login Successful!');
  //         dispatch(userLoggedIn(loginResponse?.data));

  //         if (['admin', 'retailer'].includes(loginResponse?.data?.role)) {
  //           replace(routes.admin.dashboard);
  //         }

  //         if (loginResponse?.data?.role === 'user') {
  //           replace(routes.user.profile);
  //         }
  //       } else {
  //         setSubmitting(false);
  //         toast.error(loginResponse?.message);
  //       }
  //     }
  //   }, [loginError, isLoginError, loginSuccess, loginResponse, replace, dispatch]);

  // Auto Focus

  // Submit Handler
  const handleSubmit = (values: any) => {
    // setSubmitting(true);
  };
  return (
    <div className="flex min-h-screen justify-center bg-gray-100 text-gray-900">
      <div className="m-0 flex max-w-screen-xl flex-1 justify-center bg-white shadow sm:m-10 sm:rounded-lg">
        <div className="p-6 sm:p-12 sm:pt-3 lg:w-1/2 xl:w-5/12">
          <div>
            <img src="./images/logo.png" className="mx-auto w-24" />
          </div>
          <h1 className="text-center text-2xl font-extrabold xl:text-3xl">Sign Up</h1>

          <div className="mt-12 flex flex-col items-center">
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ errors, touched }) => (
                <Form className=" grid gap-4">
                  <InputField
                    name="store_name"
                    label="Store Name"
                    placeholder="Store Name"
                    errors={errors.store_name}
                    touched={touched.store_name}
                  />
                  <div className="block items-center justify-between gap-4 sm:flex">
                    <InputField name="fName" label="First Name" placeholder="First Name" errors={errors.fName} touched={touched.fName} />
                    <InputField name="lName" label="Last Name" placeholder="Last Name" errors={errors.lName} touched={touched.lName} />
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
                    <InputField name="phone" label="Phone" placeholder="Phone" errors={errors.phone} touched={touched.phone} />
                  </div>

                  <OptionFild />

                  <div className="block items-center justify-between gap-4 sm:flex">
                    <InputField
                      name="province"
                      label="Province"
                      placeholder="Province"
                      errors={errors.province}
                      touched={touched.province}
                    />
                    <InputField name="city" label="City" placeholder="City" errors={errors.city} touched={touched.city} />
                  </div>
                  <InputField
                    name="postal_code"
                    label="Postal Code"
                    placeholder="Postal Code"
                    errors={errors.postal_code}
                    touched={touched.postal_code}
                  />
                  <InputField name="address" label="Address" placeholder="Address" errors={errors.address} touched={touched.address} />
                  {/* <Password /> */}
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
                        <span>Sign Up</span>
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
            <div className="mt-5">
              Sign in{' '}
              <Link href="../../login" className="text-red">
                Already have an account?
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
