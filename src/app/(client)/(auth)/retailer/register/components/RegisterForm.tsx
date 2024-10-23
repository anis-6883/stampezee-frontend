'use client';

import Button from '@/components/Formik/Button';
import InputField from '@/components/Formik/InputField';
import InputPassword from '@/components/Formik/InputPassword';
import PhoneNumber from '@/components/Formik/PhoneNumber';
import { SerializedError } from '@/features/api/apiSlice';
import { useRetailerRegisterMutation } from '@/features/auth/authApi';
import { setAccessToken } from '@/features/auth/authSlice';
import { ICountrySelect } from '@/types';
import { getCountryByTimezone, getPhoneCodeByTimezone } from '@/utils/get-country-by-timezone';
import countryData from '@/utils/get-country-list';
import { translateText } from '@/utils/GoogleTranslate';
import removeEmptyValues from '@/utils/removeEmptyValues';
import { Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { IoAlertCircle } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import ReactSelect, { OnChangeValue } from 'react-select';
import { Checkbox, FieldError } from 'rizzui';
import * as Yup from 'yup';
import OtpModal from './OtpModal';
import PolicyModal from './PolicyModal';
import TermsModal from './TermsModal';

export default function RegisterForm({ terms, policy, locale }: { terms: any; policy: any; locale: string }) {
  const t = useTranslations('RegisterPage');
  const tCommon = useTranslations('RetailerCommon');
  const tLogin = useTranslations('LoginPage');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [termsModalState, setTermsModalState] = useState(false);
  const [privacyPolicyModalState, setPrivacyPolicyModalState] = useState(false);
  const [register, { data: registerResponse, isSuccess, error }] = useRetailerRegisterMutation();
  const dispatch = useDispatch();

  const [countryInfo, setCountryInfo] = useState({ country: '', dialCode: '' });

  useEffect(() => {
    setCountryInfo({ country: getCountryByTimezone(), dialCode: getPhoneCodeByTimezone() });
  }, []);

  useEffect(() => {
    if (error) {
      const myError = error as SerializedError;
      setIsSubmitting(false);
      if (locale === 'en') {
        toast.error(myError?.data?.message || 'Something went wrong!');
      } else {
        (async () => {
          const translatedMessage = await translateText([myError?.data?.message], locale, 'en');
          const errorMessage = translatedMessage[0] || tCommon('errorMessage');
          toast.error(errorMessage);
        })();
      }
    }

    if (isSuccess) {
      dispatch(setAccessToken(registerResponse.data.temp));

      setIsSubmitting(false);
      setModalState(true);
      toast.success(t('otpSentMessage'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    dialCode: countryInfo?.dialCode,
    phone: '',
    country: countryInfo?.country,
    province: '',
    city: '',
    postalCode: '',
    address: '',
    password: '',
    isAgree: '',
  };

  const validationSchema = Yup.object().shape({
    storeName: Yup.string().trim().required(tCommon('required')),
    firstName: Yup.string().trim().required(tCommon('required')),
    lastName: Yup.string().trim(),
    email: Yup.string()
      .test('email', tLogin('invalidEmail'), (value: any) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value);
      })
      .required(tCommon('required')),
    phone: Yup.string().trim().required(tCommon('required')),
    country: Yup.string().trim().required(tCommon('required')),
    province: Yup.string().trim().required(tCommon('required')),
    city: Yup.string().trim().required(tCommon('required')),
    postalCode: Yup.string().trim().required(tCommon('required')),
    address: Yup.string().trim().required(tCommon('required')),
    isAgree: Yup.string().required(tCommon('required')),
    password: Yup.string().required(tCommon('required')).min(8, tCommon('atLeast8Characters')),
  });

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    register(removeEmptyValues(values, ['isAgree']));
  };

  return (
    <div>
      <div className="mt-8">
        <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ errors, setFieldValue, touched, setFieldTouched, values }) => {
            return (
              <Form className="grid gap-4">
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
                        {t('phoneNumber')} <span className="text-danger">*</span>
                      </p>
                    }
                    country="ca"
                    preferredCountries={['ca']}
                    onChange={(value, countryData: any) => {
                      setFieldValue('dialCode', `+${countryData.dialCode}`);
                      setFieldValue('phone', value.slice(countryData.dialCode.length));
                    }}
                    errorClassName="text-red-600 text-xs mt-1"
                    inputClassName={`${errors?.phone && touched?.phone ? '!border-danger hover:!border-danger' : '!border-slate-300 !border'} !h-[43px] !ring-0`}
                    labelClassName="!mb-1"
                    helperClassName="text-danger"
                    value={`${values?.dialCode}${values?.phone}`}
                  />
                  <div className="flex flex-col gap-1">
                    <div>
                      <p className="font-medium">
                        {t('country')}
                        <span className="text-red-500"> *</span>
                      </p>
                    </div>
                    {countryInfo?.country && (
                      <ReactSelect
                        placeholder="Select your country"
                        isSearchable
                        options={countryOptions}
                        getOptionLabel={getOptionLabel}
                        getOptionValue={(option) => option.label}
                        defaultValue={countryOptions.filter((country) => country.label === countryInfo?.country)}
                        onChange={(selectedOption: OnChangeValue<ICountrySelect, false>) => setFieldValue('country', selectedOption?.label)}
                        onBlur={() => setFieldTouched('country', true)}
                        styles={{
                          control: (base) => ({
                            ...base,
                            boxShadow: 'none !important',
                          }),
                          input: (base) => ({
                            ...base,
                            boxShadow: 'none !important',
                          }),
                        }}
                      />
                    )}
                    {countryInfo?.country === '' && (
                      <ReactSelect
                        placeholder="Select your country"
                        isSearchable
                        options={countryOptions}
                        getOptionLabel={getOptionLabel}
                        getOptionValue={(option) => option.label}
                        defaultValue={countryOptions.filter((country) => country.label === 'Canada')}
                        onChange={(selectedOption: OnChangeValue<ICountrySelect, false>) => setFieldValue('country', selectedOption?.label)}
                        onBlur={() => setFieldTouched('country', true)}
                        styles={{
                          control: (base) => ({
                            ...base,
                            boxShadow: 'none !important',
                          }),
                          input: (base) => ({
                            ...base,
                            boxShadow: 'none !important',
                          }),
                        }}
                      />
                    )}
                    {touched.country && errors.country && <FieldError error={errors.country} className="text-xs text-red-600" />}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <InputField name="province" label={t('province')} placeholder="Ontario" />
                  <InputField name="city" label={t('city')} placeholder="Toronto" />
                  <InputField name="postalCode" label={t('postalCode')} placeholder="M3C" />
                </div>

                <div className="grid grid-cols-1">
                  <InputField name="address" label={t('address')} placeholder="120 Bremner Blvd, Suite 800" />
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <InputField name="email" label={t('email')} placeholder="john@email.com" />
                  <InputPassword name="password" label={t('password')} placeholder="********" />
                </div>

                <div className="flex flex-col gap-y-1">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      onChange={() => {
                        values.isAgree === 'yes' ? setFieldValue('isAgree', '') : setFieldValue('isAgree', 'yes');
                      }}
                      inputClassName={`!ring-0 checked:!bg-danger checked:!border-danger ${errors.isAgree && touched.isAgree && '!border-red-500 !ring-0'}`}
                      size="sm"
                      iconClassName="top-0"
                      onBlur={() => setFieldTouched('isAgree', true)}
                    />{' '}
                    <p className="text-xs font-medium">
                      {t('iAgree')}{' '}
                      <span onClick={() => setTermsModalState(true)} className="cursor-pointer border-b-2">
                        {t('termsAndConditions')}
                      </span>{' '}
                      {t('and')}{' '}
                      <span onClick={() => setPrivacyPolicyModalState(true)} className="cursor-pointer border-b-2">
                        {t('privacyPolicy')}
                      </span>
                    </p>
                  </div>
                  {errors.isAgree && touched.isAgree && (
                    <span className="flex items-center gap-x-1 text-danger">
                      <IoAlertCircle className="text-lg" />
                      <span>{tCommon('required')}</span>
                    </span>
                  )}
                </div>

                <p className="flex flex-col text-end text-xs font-semibold">
                  <span dangerouslySetInnerHTML={{ __html: tCommon.raw('mandatoryFieldsMessage') }} />
                </p>

                <Button
                  color="danger"
                  className="w-full"
                  type="submit"
                  text={t('submit')}
                  postIcon={<BsCheck2Circle className="text-base" />}
                  isSubmitting={isSubmitting}
                />
              </Form>
            );
          }}
        </Formik>
      </div>

      <OtpModal modalState={modalState} setModalState={setModalState} />
      <TermsModal modalState={termsModalState} setModalState={setTermsModalState} terms={terms} />
      <PolicyModal modalState={privacyPolicyModalState} setModalState={setPrivacyPolicyModalState} policy={policy} />
    </div>
  );
}

const getOptionLabel = (option: any): any => (
  <div className="flex ">
    <img src={option.flag} alt={option.label} style={{ width: '20px', marginLeft: '5px' }} />
    <span className="ml-2">{option.label}</span>
  </div>
);
