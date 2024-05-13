'use client';

import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { ImSpinner9 } from 'react-icons/im';
import { IoStorefrontOutline } from 'react-icons/io5';
import { MdDriveFileRenameOutline, MdOutlineEmail, MdOutlinePhoneAndroid } from 'react-icons/md';
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

    console.log(values, 'values');

    // adminLogin({
    //   email: values.email,
    //   password: values.password,
    // });
  };
  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {() => {
        return (
          <Form>
            <InputField
              name="store_name"
              label="Store Name"
              icon={<IoStorefrontOutline className="text-base" />}
              placeholder="Store Name"
            />
            <div className="block items-center justify-between gap-4 sm:flex">
              <InputField
                name="fName"
                label="First Name"
                icon={<MdDriveFileRenameOutline className="text-base" />}
                placeholder="First Name"
              />
              <InputField
                name="lName"
                label="Last Name"
                icon={<MdDriveFileRenameOutline className="text-base" />}
                placeholder="Last Name"
              />
            </div>
            <div className="block items-center justify-between gap-4 sm:flex">
              <InputField name="email" label="Email address" icon={<MdOutlineEmail className="text-base" />} placeholder="Email address" />
              <InputField name="phone" label="Phone" icon={<MdOutlinePhoneAndroid className="text-base" />} placeholder="Phone" />
            </div>

            <OptionFild />

            <div className="block items-center justify-between gap-4 sm:flex">
              <InputField name="province" label="Province" placeholder="Province" />
              <InputField name="city" label="City" placeholder="City" />
            </div>
            <InputField name="postal_code" label="Postal Code" placeholder="Postal Code" />
            <InputField name="address" label="Address" placeholder="Address" />
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
        );
      }}
    </Formik>
  );
}
