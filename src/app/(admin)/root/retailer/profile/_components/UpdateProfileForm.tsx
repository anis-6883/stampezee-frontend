'use client';

import Button from '@/components/Formik/Button';
import DragAndDropUpload from '@/components/Formik/DragAndDropUpload';
import InputField from '@/components/Formik/InputField';
import PhoneNumber from '@/components/Formik/PhoneNumber';
import { SerializedError } from '@/features/api/apiSlice';
import { useRetailerGetProfileQuery, useRetailerUpdateProfileMutation } from '@/features/auth/authApi';
import { setValue } from '@/features/auth/authSlice';
import { RootState } from '@/features/store';
import { ICountrySelect } from '@/types';
import countryData from '@/utils/get-country-list';
import objectToFormData from '@/utils/objectToFormData';
import removeEmptyValues from '@/utils/removeEmptyValues';
import { Form, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect, { OnChangeValue } from 'react-select';
import { FieldError } from 'rizzui';
import * as Yup from 'yup';

export default function UpdateProfileForm() {
  const t = useTranslations('RetailerProfile');
  const tRetailerCommon = useTranslations('RetailerCommon');
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, update } = useSession();
  const { user } = useSelector((state: RootState) => state.authSlice);

  const [retailerUpdateProfile, { data: updateRetailerProfile, isSuccess, error }] = useRetailerUpdateProfileMutation();
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
      update({ ...session?.user, ...updateRetailerProfile?.data });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isSuccess, updateRetailerProfile]);

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
    image: retailerProfile?.data?.image
      ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${retailerProfile?.data?.image}`
      : '/images/stamp-logo.png',
  };

  const validationSchema = Yup.object().shape({
    storeName: Yup.string().required(tRetailerCommon('required')),
    firstName: Yup.string().required(tRetailerCommon('required')),
    lastName: Yup.string(),
    email: Yup.string().email('Invalid email').required(tRetailerCommon('required')),
    phone: Yup.string().required(tRetailerCommon('required')),
    country: Yup.string().required(tRetailerCommon('required')),
    province: Yup.string().required(tRetailerCommon('required')),
    city: Yup.string().required(tRetailerCommon('required')),
    postalCode: Yup.string().required(tRetailerCommon('required')),
    address: Yup.string().required(tRetailerCommon('required')),
  });

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    const changeFormData = removeEmptyValues(values, ['email']);

    let objToFormData: FormData;
    const isFile = (obj: any): obj is File => obj instanceof File;

    if (!isFile(values?.image)) {
      objToFormData = objectToFormData(changeFormData, ['image']);
    } else {
      objToFormData = objectToFormData(changeFormData);
    }

    const result: any = await retailerUpdateProfile(objToFormData);

    dispatch(setValue({ target: 'user', value: { ...user, ...result?.data?.data } }));
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
                  brandText="Brand Logo"
                />
                <InputField name="storeName" label={t('storeName')} placeholder="Burger King" />
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <InputField name="firstName" label={`${t('firstName')} (${t('owner')})`} placeholder="John" />
                  <InputField name="lastName" label={`${t('lastName')} (${t('owner')})`} placeholder="Doe" required={false} />
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <PhoneNumber
                    enableSearch={true}
                    name="phone"
                    label={
                      <p>
                        {t('phoneNumber')} <span className="text-red-600">*</span>
                      </p>
                    }
                    country="ca"
                    preferredCountries={['ca']}
                    onChange={(value, countryData: any) => {
                      setFieldValue('dialCode', `+${countryData.dialCode}`);
                      setFieldValue('phone', value.slice(countryData.dialCode.length));
                    }}
                    errorClassName="text-red-600 text-xs mt-1"
                    inputClassName={`${errors?.phone && touched?.phone ? '!border-red-500' : '!border-slate-300 !border'} !h-[43px]`}
                    labelClassName="!mb-1"
                    value={`${values?.dialCode}${values?.phone}`}
                  />
                  <div className="flex flex-col gap-1">
                    <div>
                      <p className="font-medium">
                        {t('country')}
                        <span className="text-red-500"> *</span>
                      </p>
                    </div>

                    {isRetailerProfileSuccess && (
                      <ReactSelect
                        placeholder="Select your country"
                        options={countryOptions}
                        getOptionLabel={getOptionLabel}
                        getOptionValue={(option) => option.label}
                        defaultValue={countryOptions.filter((country) => country.label === (retailerProfile?.data?.country || 'Canada'))}
                        onChange={(selectedOption: OnChangeValue<ICountrySelect, false>) => setFieldValue('country', selectedOption?.label)}
                        onBlur={() => setFieldTouched('country', true)}
                      />
                    )}
                    {touched.country && errors.country && <FieldError error={errors?.country as string} className="text-xs text-red-600" />}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <InputField name="province" label={t('province')} placeholder="Ontario" />
                  <InputField name="city" label={t('city')} placeholder="Toronto" />
                  <InputField name="postalCode" label={t('postalCode')} placeholder="M3C" />
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <InputField disabled={true} name="email" label={t('email')} placeholder="john@email.com" />
                  <InputField name="address" label={t('address')} placeholder="120 Bremner Blvd, Suite 800" />
                </div>

                <p className="flex flex-col text-end text-xs font-semibold">
                  <span>
                    Fields marked with <span className="text-red-600">*</span> are mandatory!
                  </span>
                </p>

                <div className="mt-2 flex justify-end">
                  <Button
                    color="danger"
                    type="submit"
                    text={t('update')}
                    postIcon={<BsCheck2Circle className="text-base" />}
                    isSubmitting={isSubmitting}
                  />
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
