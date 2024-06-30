'use client';

import Button from '@/components/Formik/Button';
import InputField from '@/components/Formik/InputField';
import InputPassword from '@/components/Formik/InputPassword';
import PhoneNumber from '@/components/Formik/PhoneNumber';
import { SerializedError } from '@/features/api/apiSlice';
import { useRetailerRegisterMutation } from '@/features/auth/authApi';
import { setAccessToken } from '@/features/auth/authSlice';
import { ICountrySelect } from '@/types';
import countryData from '@/utils/get-country-list';
import removeEmptyValues from '@/utils/removeEmptyValues';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import ReactSelect, { OnChangeValue } from 'react-select';
import { Checkbox, FieldError } from 'rizzui';
import * as Yup from 'yup';
import OtpModal from './OtpModal';

export default function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [register, { data: registerResponse, isSuccess, error }] = useRetailerRegisterMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      const myError = error as SerializedError;
      setIsSubmitting(false);
      toast.error(myError?.data?.message || 'Something went wrong!');
    }

    if (isSuccess) {
      console.log('Register Response: ', registerResponse);
      dispatch(setAccessToken(registerResponse.data.temp));

      setIsSubmitting(false);
      setModalState(true);
      toast.success('OTP sent on your email!');
    }
  }, [dispatch, error, isSuccess, registerResponse]);

  const countryOptions = countryData.map((country) => ({
    value: country.code,
    label: country.country,
    flag: country.flag,
  }));

  const initialValues = {
    storeName: '',
    firstName: '',
    lastName: '',
    email: '',
    dialCode: '+1',
    phone: '',
    country: 'Canada',
    province: '',
    city: '',
    postalCode: '',
    address: '',
    password: '',
    isAgree: '',
  };

  const validationSchema = Yup.object().shape({
    storeName: Yup.string().required('Required!'),
    firstName: Yup.string().required('Required!'),
    lastName: Yup.string(),
    email: Yup.string().email('Invalid email').required('Required!'),
    phone: Yup.string().required('Required!'),
    country: Yup.string().required('Required!'),
    province: Yup.string().required('Required!'),
    city: Yup.string().required('Required!'),
    postalCode: Yup.string().required('Required!'),
    address: Yup.string().required('Required!'),
    isAgree: Yup.string().required('Required!'),
    password: Yup.string().required('Required!').min(8, 'At least 8 characters long!'),
  });

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    register(removeEmptyValues(values, ['isAgree']));
  };

  return (
    <div>
      <div className="mt-8">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ errors, setFieldValue, touched, setFieldTouched, values }) => {
            return (
              <Form className="grid gap-4">
                <InputField name="storeName" label="Store Name" placeholder="Burger King" />
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <InputField name="firstName" label="First Name" placeholder="John" />
                  <InputField name="lastName" label="Last Name" placeholder="Doe" required={false} />
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <PhoneNumber
                    label={
                      <p>
                        Phone Number <span className="text-red-600">*</span>
                      </p>
                    }
                    country="ca"
                    preferredCountries={['ca']}
                    onChange={(value, countryData: any) => {
                      setFieldValue('dialCode', `+${countryData.dialCode}`);
                      setFieldValue('phone', value.slice(countryData.dialCode.length));
                    }}
                    errorClassName="text-red-600 text-xs mt-1"
                    inputClassName={`${errors?.phone && touched?.phone ? '!border-red-500' : '!border-slate-300 !border-[2px]'} !h-[43px]`}
                    labelClassName="!mb-1"
                  />
                  <div className="flex flex-col gap-1">
                    <div>
                      <p className="font-medium">
                        Country
                        <span className="text-red-500"> *</span>
                      </p>
                    </div>
                    <ReactSelect
                      placeholder="Select your country"
                      options={countryOptions}
                      getOptionLabel={getOptionLabel}
                      getOptionValue={(option) => option.label}
                      defaultValue={countryOptions.filter((country) => country.label === 'Canada')}
                      onChange={(selectedOption: OnChangeValue<ICountrySelect, false>) => setFieldValue('country', selectedOption?.label)}
                      onBlur={() => setFieldTouched('country', true)}
                    />
                    {touched.country && errors.country && <FieldError error={errors.country} className="text-xs text-red-600" />}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <InputField name="province" label="Province" placeholder="Ontario" />
                  <InputField name="city" label="City" placeholder="Toronto" />
                  <InputField name="postalCode" label="Postal Code" placeholder="M3C" />
                </div>

                <div className="grid grid-cols-1">
                  <InputField name="address" label="Address" placeholder="120 Bremner Blvd, Suite 800" />
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <InputField name="email" label="Email" placeholder="john@email.com" />
                  <InputPassword name="password" label="Password" placeholder="********" />
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    onChange={() => {
                      values.isAgree === 'yes' ? setFieldValue('isAgree', '') : setFieldValue('isAgree', 'yes');
                    }}
                    inputClassName={`${errors.isAgree && touched.isAgree && '!border-red-500 ring-0'}`}
                    size="sm"
                    iconClassName="top-0"
                    onBlur={() => setFieldTouched('isAgree', true)}
                  />{' '}
                  <p className="text-xs font-medium">
                    I Agree with the{' '}
                    <Link href="/retailer/login" className="border-b-2">
                      Terms of Use
                    </Link>{' '}
                    and{' '}
                    <Link href="/retailer/login" className="border-b-2">
                      Privacy Policy
                    </Link>
                  </p>
                </div>

                <p className="flex flex-col text-end text-xs font-semibold">
                  <span>
                    Fields marked with <span className="text-red-600">*</span> are mandatory!
                  </span>
                  <span>
                    Password must be at least <span className="text-red-600">8 characters</span> long!
                  </span>
                </p>

                <Button
                  className="w-full"
                  type="submit"
                  text="Submit"
                  postIcon={<BsCheck2Circle className="text-base" />}
                  isSubmitting={isSubmitting}
                />
              </Form>
            );
          }}
        </Formik>
      </div>

      <OtpModal modalState={modalState} setModalState={setModalState} />
    </div>
  );
}

const getOptionLabel = (option: any): any => (
  <div className="flex ">
    <img src={option.flag} alt={option.label} style={{ width: '20px', marginLeft: '5px' }} />
    <span className="ml-2">{option.label}</span>
  </div>
);
