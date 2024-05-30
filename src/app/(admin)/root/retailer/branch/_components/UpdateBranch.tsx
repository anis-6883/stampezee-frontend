'use client';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from 'rizzui';
import * as Yup from 'yup';

import InputField from '@/components/Formik/ImputField';
import { routes } from '@/config/routes';
import { useSingleBranchQuery, useUpdateBranchMutation } from '@/features/retailer/branch/branchApi';
import getChangedFormData from '@/utils/getChangedFormData';
import objectToFormData from '@/utils/objectToFormData';
import toast from 'react-hot-toast';
import { ImSpinner9 } from 'react-icons/im';
import MapComponent from './Map';

const validationSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('This field is required'),
  address: Yup.string().min(2, 'Too Short!').max(150, 'Too Long!').required('This field is required'),
});

export default function UpdateBranch({ branchId }: any) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    longitude: '',
    latitude: '',
  });
  const [UpdateBranch] = useUpdateBranchMutation();

  const {
    data: branchData,
    isLoading: branchLoading,
    isSuccess: branchIsSuccess,
    error: branchError,
  } = useSingleBranchQuery({ _id: String(branchId) });

  const router = useRouter();

  useEffect(() => {
    if (branchData && branchIsSuccess) {
      const data: any = branchData;
      // if (data) {
      setFormData({
        name: data.data.name || 'ujj',
        address: data.data.address?.name,
        longitude: data.data.address?.loc?.coordinates[0]?.toString() || '',
        latitude: data.data.address?.loc?.coordinates[1]?.toString() || '',
      });
      // }
    }

    if (branchError) {
      toast.error('Failed to load branch. Please try again.');
    }
  }, [branchData, branchError, branchLoading, branchIsSuccess]);

  const handleSubmit = async (values: any & { _id: string }) => {
    try {
      setSubmitting(true);
      // Extract branchId and the rest of the data
      const { _id, ...rest } = values;
      console.log(rest, 'values');
      const changedData = getChangedFormData(values, formData, ['_id']);
      const createFormData: any = objectToFormData(changedData, ['_id']);
      console.log(changedData, 'changedData');

      // Call the updateBranch mutation
      const result = await UpdateBranch({ data: createFormData, branchId: branchId }).unwrap();
      router.push(routes.retailer.branch.home);

      toast.success('Branch updated successfully!');
    } catch (error: any) {
      console.error('Failed to update branch:', error);
      toast.error(error.data.massage ?? 'Failed to update branch. Please try again.');
      setSubmitting(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (branchLoading) {
    return 'loding....';
  }

  return (
    <div>
      <Formik
        initialValues={formData}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const parsedValues = {
            ...values,
            longitude: String(values.longitude),
            latitude: String(values.latitude),
          };

          handleSubmit(parsedValues);
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form className="mt-5 grid gap-4">
            <InputField name="name" label="Name" placeholder="" errors={errors.name} touched={touched.name} />
            <MapComponent
              setFieldValue={setFieldValue}
              errors={errors.address}
              touched={touched.address}
              address={values.address}
              update={true}
              locationData={{
                longitude: values.longitude,
                latitude: values.latitude,
              }}
            />
            <div className="justify-end">
              <Button
                type="submit"
                className="flex w-full items-center justify-center bg-indigo-500 text-sm font-semibold text-white disabled:bg-[#1d58d8]"
                size="lg"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center gap-x-2">
                    Requesting... <ImSpinner9 className="animate-spin text-base" />
                  </span>
                ) : (
                  <span>Submit</span>
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
