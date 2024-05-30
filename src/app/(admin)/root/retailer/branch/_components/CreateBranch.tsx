'use client';
import ButtonField from '@/components/Formik/Button';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('This field is required'),
  address: Yup.string().min(2, 'Too Short!').max(150, 'Too Long!').required('This field is required'),
});

const initialValues = {
  name: '',
  address: '',
  longitude: '',
  latitude: '',
};

import InputField from '@/components/Formik/ImputField';
import { routes } from '@/config/routes';
import { useCreateBranchMutation } from '@/features/retailer/branch/branchApi';
import { Branch } from '@/types';
import toast from 'react-hot-toast';
import MapComponent from './Map';

export default function CreateBranch() {
  const [submitting, setSubmitting] = useState(false);
  const [createBranch] = useCreateBranchMutation();
  const router = useRouter();

  const handleSubmit = async (values: Branch) => {
    try {
      setSubmitting(true);
      console.log('Creating branch:', values);
      const result = await createBranch(values).unwrap();
      // routes.push(routes.retailer.branch.home);
      router.push(routes.retailer.branch.home);
      toast.success('Branch created successfully!');
    } catch (error) {
      console.error('Failed to create branch:', error);
      toast.error('Failed to create branch. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          // same shape as initial values
          // console.log(values, 'value');

          handleSubmit(values);
        }}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form className="mt-5 grid gap-4">
            <InputField name="name" label="Name" placeholder="" errors={errors.name} touched={touched.name} />
            <MapComponent setFieldValue={setFieldValue} errors={errors.address} touched={touched.address} />
            {/* <Switch label="Status" variant="outline" labelPlacement="right" className="hover" /> */}
            {/* <StatusBar setFieldValue={setFieldValue} /> */}

            <div className="mt-2 flex justify-end">
              <ButtonField type="submit" isSubmitting={submitting} />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
