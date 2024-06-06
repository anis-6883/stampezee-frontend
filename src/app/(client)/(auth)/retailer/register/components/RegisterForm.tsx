'use client';

import Button from '@/app/(admin)/root/_components/Button';
import InputField from '@/components/Formik/InputField';
import InputPassword from '@/components/Formik/InputPassword';
import { ICountrySelect } from '@/types';
import countryData from '@/utils/get-country-list';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { BsCheck2Circle } from 'react-icons/bs';
import ReactSelect, { OnChangeValue } from 'react-select';
import { FieldError } from 'rizzui';
import * as Yup from 'yup';
import OtpModal from './OtpModal';
import PhoneNumber from './phone-number';

export default function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState(false);

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
    dialCode: '',
    phone: '',
    country: 'Canada',
    province: '',
    city: '',
    postalCode: '',
    address: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    storeName: Yup.string().required('Required!'),
    firstName: Yup.string().required('Required!'),
    lastName: Yup.string().required('Required!'),
    email: Yup.string().email('Invalid email').required('Required!'),
    phone: Yup.string().required('Required!'),
    country: Yup.string().required('Required!'),
    province: Yup.string().required('Required!'),
    city: Yup.string().required('Required!'),
    postalCode: Yup.string().required('Required!'),
    address: Yup.string().required('Required!'),
    password: Yup.string().required('Required!'),
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/,
    //   'Password must be at least 6 characters long with 1 uppercase, 1 lowercase, and 1 digit'
    // )
  });

  const handleSubmit = async (values: any) => {
    // setIsSubmitting(true);
    console.log('Values: ', values);
    // try {
    //   const response = await axiosBackendUrl.post('/api/retailer/register', values);

    //   if (response.status === 201) {
    //     toast.success(response.data.message);
    //   } else {
    //     toast.error('this email is already registered try another email');
    //   }
    // } catch (error: any) {
    //   if (error.response) {
    //     toast.error(error.response.data.message || 'An error occurred while submitting the form.');
    //   } else {
    //     toast.error('An error occurred while submitting the form.');
    //   }
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <div>
      <div className="mt-8 px-2">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, errors, setFieldValue, touched, setFieldTouched }) => {
            console.log('Values: ', values);
            return (
              <Form className="grid gap-4">
                {/* <p>Fields marks with * are mandatory!</p> */}
                <InputField name="storeName" label="Store Name" placeholder="Burger King" />
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <InputField name="firstName" label="First Name" placeholder="John" />
                  <InputField name="lastName" label="Last Name" placeholder="Doe" />
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
                    error={errors?.phone}
                    touched={touched?.phone}
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

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <InputField name="province" label="Province" placeholder="Ontario" />
                  <InputField name="city" label="City" placeholder="Toronto" />
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <InputField name="postalCode" label="Postal Code" placeholder="M3C" />
                  <InputField name="address" label="Address" placeholder="120 Bremner Blvd, Suite 800" />
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <InputField name="email" label="Email" placeholder="john@email.com" />
                  <InputPassword name="password" label="Password" placeholder="******" />
                </div>

                <p className="text-end text-xs font-semibold">
                  Fields marked with <span className="text-red-600">*</span> are mandatory!
                </p>

                <Button type="submit" text="Submit" postIcon={<BsCheck2Circle className="text-base" />} isSubmitting={isSubmitting} />
                {/* <Button
                  type="button"
                  text="Otp Modal Open"
                  postIcon={<BsCheck2Circle className="text-base" />}
                  onClick={() => setModalState(true)}
                /> */}
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
