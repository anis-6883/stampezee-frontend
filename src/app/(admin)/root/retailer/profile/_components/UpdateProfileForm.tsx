'use client';

import Button from '@/components/Formik/Button';
import DragAndDropUpload from '@/components/Formik/DragAndDropUpload';
import InputField from '@/components/Formik/InputField';
import PhoneNumber from '@/components/Formik/PhoneNumber';
import { SerializedError } from '@/features/api/apiSlice';
import { useRetailerGetProfileQuery, useRetailerUpdateProfileMutation } from '@/features/auth/authApi';
import countryData from '@/utils/get-country-list';
import objectToFormData from '@/utils/objectToFormData';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import ReactSelect from 'react-select';
import { FieldError } from 'rizzui';
import * as Yup from 'yup';

export default function UpdateProfileForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [retailerUpdateProfile, { isSuccess, error }] = useRetailerUpdateProfileMutation();
  const { data: retailerProfile, isSuccess: isRetailerProfileSuccess } = useRetailerGetProfileQuery(null);

  useEffect(() => {
    if (error) {
      const myError = error as SerializedError;
      setIsSubmitting(false);
      toast.error(myError?.data?.message || 'Something went wrong!');
    }

    if (isSuccess) {
      setIsSubmitting(false);
      toast.success('Retailer profile updated successfully!');
    }
  }, [error, isSuccess]);

  const countryOptions = countryData.map((country) => ({
    value: country.code,
    label: country.country,
    flag: country.flag,
  }));

  const initialValues = {
    storeName: retailerProfile?.data?.storeName || '',
    firstName: retailerProfile?.data?.firstName || '',
    lastName: retailerProfile?.data?.lastName || '',
    email: retailerProfile?.data?.email || '',
    dialCode: retailerProfile?.data?.dialCode || '+1',
    phone: retailerProfile?.data?.phone || '',
    country: retailerProfile?.data?.country || 'Canada',
    province: retailerProfile?.data?.province || '',
    city: retailerProfile?.data?.city || '',
    postalCode: retailerProfile?.data?.postalCode || '',
    address: retailerProfile?.data?.address || '',
    image: `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${retailerProfile?.data?.image}` || '',
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
  });

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    let objToFormData: FormData;
    const isFile = (obj: any): obj is File => obj instanceof File;

    if (!isFile(values?.image)) {
      objToFormData = objectToFormData(values, ['image']);
    } else {
      objToFormData = objectToFormData(values);
    }
    console.log('values: ', values);
    retailerUpdateProfile(objToFormData);
  };

  return (
    <div>
      <div className="mt-8">
        <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ errors, setFieldValue, touched, setFieldTouched, values }) => {
            return (
              <Form className="grid gap-4">
                <DragAndDropUpload
                  value={{ name: 'image', image: values.image }}
                  onChange={(image: any) => setFieldValue('image', image)}
                  className=" mx-auto "
                  size={1024 * 1000}
                  sizeText="1MB"
                  isRounded={true}
                />
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
                    {isRetailerProfileSuccess && (
                      <ReactSelect
                        placeholder="Select your country"
                        options={countryOptions}
                        getOptionLabel={getOptionLabel}
                        getOptionValue={(option) => option.value}
                        defaultValue={countryOptions.find((country) => country.label === (retailerProfile?.data?.country || 'Canada'))}
                        onChange={(selectedOption) => setFieldValue('country', selectedOption?.label)}
                        onBlur={() => setFieldTouched('country', true)}
                      />
                    )}
                    {touched.country && errors.country && <FieldError error={errors?.country as string} className="text-xs text-red-600" />}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <InputField name="province" label="Province" placeholder="Ontario" />
                  <InputField name="city" label="City" placeholder="Toronto" />
                  <InputField name="postalCode" label="Postal Code" placeholder="M3C" />
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <InputField name="email" label="Email" placeholder="john@email.com" />
                  <InputField name="address" label="Address" placeholder="120 Bremner Blvd, Suite 800" />
                </div>

                <p className="flex flex-col text-end text-xs font-semibold">
                  <span>
                    Fields marked with <span className="text-red-600">*</span> are mandatory!
                  </span>
                </p>

                <div className="mt-2 flex justify-end">
                  <Button type="submit" text="Update" postIcon={<BsCheck2Circle className="text-base" />} isSubmitting={isSubmitting} />
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

const getOptionLabel = (option: any): any => (
  <div className="flex ">
    <img src={option.flag} alt={option.label} style={{ width: '20px', marginLeft: '5px' }} />
    <span className="ml-2">{option.label}</span>
  </div>
);
