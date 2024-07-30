'use client';

import Button from '@/components/Formik/Button';
import InputField from '@/components/Formik/InputField';
import { Form, Formik } from 'formik';
import { BsCheck2Circle } from 'react-icons/bs';

const ContactForm = () => {
  return (
    <div>
      <Formik initialValues={{}} onSubmit={() => {}}>
        {({ setFieldValue, values }) => (
          <Form className="mt-5">
            <div className="grid grid-cols-2 gap-x-5 gap-y-5">
              <InputField name="name" label="First Name" placeholder="John" />
              <InputField name="lastName" label="Last Name" placeholder="Doe" required={false} />
              <InputField name="email" label="Email" placeholder="john.doe@email.com" />
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
