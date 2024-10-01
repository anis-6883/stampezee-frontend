'use client';

import Button from '@/components/Formik/Button';
import InputField from '@/components/Formik/InputField';
import { routes } from '@/config/routes';
import { SerializedError } from '@/features/api/apiSlice';
import { useCreateBranchMutation } from '@/features/retailer/branch/branchApi';
import { Branch } from '@/types';
import { Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import * as Yup from 'yup';
import Map from './Map';

export default function CreateBranch({ googleMapsApiKey }: { googleMapsApiKey: string }) {
  const t = useTranslations('RetailerBranches');
  const tCommon = useTranslations('RetailerCommon');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createBranch, { error, isSuccess }] = useCreateBranchMutation();
  const router = useRouter();

  const initialValues = {
    name: '',
    address: '',
    longitude: '',
    latitude: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(tCommon('required')),
    address: Yup.string().required(tCommon('required')),
  });

  // Submit Handler
  const handleSubmit = async (values: Branch) => {
    if (values.latitude === '' || values.longitude === '') {
      toast.error('Please select a location on the map!');
      return;
    }
    setIsSubmitting(true);
    createBranch(values);
  };

  // Handle Response
  useEffect(() => {
    if (error) {
      setIsSubmitting(false);
      const myError = error as SerializedError;
      toast.error(myError?.data?.message || 'Something went wrong. Please try again!');
    }

    if (isSuccess) {
      router.push(routes.privateRoutes.retailer.branch.home);
      toast.success('Branch created successfully!');
      setIsSubmitting(false);
    }
  }, [error, isSuccess, router]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleSubmit(values);
      }}
    >
      {() => (
        <Form className="mt-5 grid gap-4">
          <InputField name="name" label={t('name')} placeholder="ex. Ring Road Branch" />
          <Map googleMapsApiKey={googleMapsApiKey} />
          <p className="text-end text-xs font-semibold">
            <span dangerouslySetInnerHTML={{ __html: tCommon.raw('mandatoryFieldsMessage') }} />
          </p>
          <div className="mt-2 flex justify-end">
            <Button
              color="danger"
              type="submit"
              text={t('submit')}
              postIcon={<BsCheck2Circle className="text-base" />}
              isSubmitting={isSubmitting}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
