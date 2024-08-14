'use client';

import InputField from '@/components/Formik/InputField';
import { routes } from '@/config/routes';
import { useSingleBranchQuery, useUpdateBranchMutation } from '@/features/retailer/branch/branchApi';
import removeEmptyValues from '@/utils/removeEmptyValues';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import * as Yup from 'yup';
import Button from '../../../../../../components/Formik/Button';
import MapComponent from './Map';

export default function UpdateBranch({ branchId, googleMapsApiKey }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateBranch, { isSuccess, isError }] = useUpdateBranchMutation();
  const {
    data: branchData,
    isLoading: branchLoading,
    isSuccess: branchIsSuccess,
    error: branchError,
  } = useSingleBranchQuery({ _id: String(branchId) });
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    longitude: '',
    latitude: '',
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required!'),
    address: Yup.string().required('Required!'),
  });

  useEffect(() => {
    if (branchData && branchIsSuccess) {
      const data: any = branchData;

      setFormData({
        name: data?.data?.name,
        address: data?.data?.address?.name,
        longitude: data?.data?.address?.loc?.coordinates[0]?.toString() || '',
        latitude: data?.data?.address?.loc?.coordinates[1]?.toString() || '',
      });
    }

    if (branchError) {
      toast.error('Failed to load branch. Please try again.');
    }
  }, [branchData, branchError, branchLoading, branchIsSuccess]);

  // Submit Handler
  const handleSubmit = async (values: any & { _id: string }) => {
    if (values.latitude === '' || values.longitude === '') {
      toast.error('Please select a location on the map!');
      return;
    }

    setIsSubmitting(true);

    const parsedValues = {
      ...values,
      longitude: String(values.longitude),
      latitude: String(values.latitude),
    };
    const changedData = removeEmptyValues(parsedValues, ['_id']);

    updateBranch({ data: changedData, branchId: branchId }).unwrap();
  };

  // Handle Response
  useEffect(() => {
    if (isError) {
      setIsSubmitting(false);
      toast.error('Something went wrong. Please try again!');
    }

    if (isSuccess) {
      router.push(routes.privateRoutes.retailer.branch.home);
      toast.success('Branch updated successfully!');
      setIsSubmitting(false);
    }
  }, [isError, isSuccess, router]);

  return (
    <Formik initialValues={formData} enableReinitialize validationSchema={validationSchema} onSubmit={handleSubmit}>
      {() => (
        <Form className="mt-5 grid gap-4">
          <InputField name="name" label="Name" placeholder="ex. Ring Road Branch" />
          <MapComponent googleMapsApiKey={googleMapsApiKey} />
          <div className="mt-2 flex justify-end">
            <Button
              color="danger"
              type="submit"
              text="Update"
              postIcon={<BsCheck2Circle className="text-base" />}
              isSubmitting={isSubmitting}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
