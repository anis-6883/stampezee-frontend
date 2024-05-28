// components/UpdateUserForm.tsx
'use client';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { getChangedFields } from '../../utils/getChangedFields';
import { handleFormSubmit } from './handleFormSubmit';

// Define the shape of our form values
interface UserFormValues {
  name: string;
  email: string;
  password: string;
}

const UpdateUserForm: React.FC = () => {
  const [userData, setUserData] = useState<UserFormValues | null>(null);

  useEffect(() => {
    // Fetch the user data from an API or other source
    const fetchUserData = async () => {
      // Replace this with your actual data fetching logic
      const data = {
        name: 'subho',
        email: 'sss@gmail.com',
        password: '', // Leave password empty initially
      };
      setUserData(data);
    };

    fetchUserData();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters'),
  });

  const handleSubmit = async (values: UserFormValues, { setSubmitting }: any) => {
    // Find the changed fields
    // const changedFields = Object.keys(values).reduce((acc, key) => {
    //   if (values[key as keyof UserFormValues] !== userData![key as keyof UserFormValues]) {
    //     acc[key as keyof UserFormValues] = values[key as keyof UserFormValues];
    //   }
    //   return acc;
    // }, {} as Partial<UserFormValues>);

    // console.log('Updating user data with:', changedFields);

    const changedFields = getChangedFields(values, userData!);
    console.log('Updating user data with:', changedFields);

    // Example API call
    await fetch('/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(changedFields),
    });

    setSubmitting(false);
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <Formik
      initialValues={userData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleFormSubmit(values, userData, setSubmitting);
      }}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form>
          <div>
            <label htmlFor="name">Name</label>
            <Field type="text" id="name" name="name" />
            <ErrorMessage name="name" component="div" />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <Field type="email" id="email" name="email" />
            <ErrorMessage name="email" component="div" />
          </div>

          <div>
            <label htmlFor="password">Password (leave blank to keep current password)</label>
            <Field type="password" id="password" name="password" />
            <ErrorMessage name="password" component="div" />
          </div>

          <div>
            <button type="submit" disabled={isSubmitting}>
              Update
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UpdateUserForm;
