'use client';

import Button from '@/components/Formik/Button';
import InputField from '@/components/Formik/InputField';
import InputTextarea from '@/components/Formik/InputTextArea ';
import PhoneNumber from '@/components/Formik/PhoneNumber';
import axios from 'axios';
import { Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegPaperPlane } from 'react-icons/fa';
import { LuUserCircle2 } from 'react-icons/lu';
import { SlEnvolope } from 'react-icons/sl';
import * as Yup from 'yup';

const ContactForm = ({ token }: { token: string }) => {
  const t = useTranslations('ContactPage');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const initialValues = {
    name: '',
    email: '',
    dialCode: '+1',
    phone: '',
    message: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required!'),
    email: Yup.string()
      .test('email', 'Provide valid email!', (value: any) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value);
      })
      .required('Required!'),
    message: Yup.string().required('Required!'),
  });
  const handleSubmit = async (values: any, { resetForm }: any) => {
    setIsSubmitting(true);
    try {
      if (!values?.phone) {
        delete values?.phone;
      }
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/contact/submit`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
        },
      });
      toast.success(res?.data?.message);
      setIsSubmitting(false);
      if (res?.data?.status) {
        resetForm();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Something went wrong!');
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ setFieldValue, values }) => (
          <Form className="mt-5">
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
              <InputField prefix={<LuUserCircle2 className="text-xl" />} name="name" label={t('name')} placeholder="John" />
              <InputField prefix={<SlEnvolope className="text-xl" />} name="email" label={t('email')} placeholder="john.doe@email.com" />
            </div>

            <div className="my-3 grid grid-cols-1">
              <PhoneNumber
                enableSearch={true}
                name="phone"
                label={<p>{t('phone')}</p>}
                country="ca"
                preferredCountries={['ca']}
                onChange={(value, countryData: any) => {
                  setFieldValue('dialCode', `+${countryData.dialCode}`);
                  setFieldValue('phone', value.slice(countryData.dialCode.length));
                }}
                labelClassName="!mb-1"
                helperClassName="text-danger"
                value={`${values?.dialCode}${values?.phone}`}
              />
            </div>

            <div className="my-3">
              <InputTextarea name="message" label={t('message')} placeholder="Write here..." />
            </div>

            <p className="flex flex-col text-end text-xs font-semibold">
              <span>
                Fields marked with <span className="text-red-600">*</span> are mandatory!
              </span>
            </p>

            <div className="mt-6 flex justify-end">
              <Button
                color="danger"
                type="submit"
                text={t('buttonText')}
                postIcon={<FaRegPaperPlane className="text-base" />}
                isSubmitting={isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContactForm;
