'use client';

import Button from '@/components/Formik/Button';
import InputField from '@/components/Formik/InputField';
import InputTextarea from '@/components/Formik/InputTextArea ';
import PhoneNumber from '@/components/Formik/PhoneNumber';
import { Form, Formik } from 'formik';
import { BsCheck2Circle } from 'react-icons/bs';
import { LuUserCircle2 } from 'react-icons/lu';
import { SlEnvolope } from 'react-icons/sl';
import * as Yup from 'yup';

const ContactForm = () => {
  const initialValues = {
    name: '',
    email: '',
    dialCode: '+1',
    phone: '',
    description: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required!'),
    email: Yup.string()
      .test('email', 'Provide valid email!', (value: any) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value);
      })
      .required('Required!'),
    description: Yup.string().required('Required!'),
  });
  const handleSubmit = (values: any) => {
    console.log('values', values);
  };
  return (
    <div>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ errors, touched, setFieldValue, setFieldTouched, values }) => (
          <Form className="mt-5">
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
              <InputField prefix={<LuUserCircle2 className="text-xl" />} name="name" label="Name" placeholder="John" />
              <InputField prefix={<SlEnvolope className="text-xl" />} name="email" label="Email" placeholder="john.doe@email.com" />
            </div>

            <div className="my-3 grid grid-cols-1">
              <PhoneNumber
                enableSearch={true}
                name="phone"
                label={<p>Phone Number</p>}
                country="ca"
                preferredCountries={['ca']}
                onChange={(value, countryData: any) => {
                  setFieldValue('dialCode', `+${countryData.dialCode}`);
                  setFieldValue('phone', value.slice(countryData.dialCode.length));
                }}
                labelClassName="!mb-1"
                helperClassName="text-danger"
              />
            </div>

            <div className="my-3">
              <InputTextarea name="description" label="Description" placeholder="Write here..." />
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                color="danger"
                type="submit"
                text={'Submit'}
                postIcon={<BsCheck2Circle className="text-base" />}
                isSubmitting={false}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContactForm;
