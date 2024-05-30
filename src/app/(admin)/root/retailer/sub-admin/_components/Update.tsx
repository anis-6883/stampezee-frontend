'use client';
import SubmitButton from '@/components/Formik/Button';
import DragAndDropUpload from '@/components/Formik/DragAndDropUpload';
import InputField from '@/components/Formik/ImputField';
import SelectField from '@/components/Formik/SelectField';
import StatusBar from '@/components/Formik/StatusBar';
import { routes } from '@/config/routes';
import { useAllBranchQuery } from '@/features/retailer/branch/branchApi';
import { useSingleSubAdminQuery, useUpdateSubAdminMutation } from '@/features/retailer/sub-admin/subAdminApi';
import { IQueryType } from '@/types';
import getChangedFormData from '@/utils/getChangedFormData';
import objectToFormData from '@/utils/objectToFormData';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  branchId: Yup.string().required('This field is required'),
  firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('This field is required'),
  lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('This field is required'),
  email: Yup.string().email('Invalid email').required('This field is required'),
  status: Yup.boolean().required('This field is required'),
});

export default function Update({ Id }: any) {
  const [submitting, setSubmitting] = useState(false);
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [dropImage, setDropImage] = useState('');

  const [formData, setFormData] = useState({
    branchId: '',
    firstName: '',
    lastName: '',
    email: '',
    image: '',
    status: true,
  });
  const [updateSubAdmin] = useUpdateSubAdminMutation();

  const { data: subAdminData, isLoading: subAdminLoading, isSuccess: subAdminIsSuccess, error: subAdminError } = useSingleSubAdminQuery(Id);

  const router = useRouter();

  useEffect(() => {
    if (subAdminData && subAdminIsSuccess) {
      const data: any = subAdminData;
      setFormData({
        branchId: data.data.branchId,
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        email: data.data.email,
        image: `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${data.data.image}` as string,
        status: data.data.status,
      });
    }

    if (subAdminError) {
      toast.error('Failed to load sub Admin. Please try again.');
    }
  }, [subAdminData, subAdminError, subAdminLoading, subAdminIsSuccess]);

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);

      const result = await updateSubAdmin({ id: Id, updateSubAdminData: values }).unwrap();

      router.push(routes.retailer.sub_admin.home);
      toast.success('subAdmin updated successfully!');
    } catch (error: any) {
      console.error('Failed to update sub Admin:', error);
      toast.error(error.data.message ?? 'Failed to update sub Admin. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};

  const { data: branchData, isLoading: branchLoading } = useAllBranchQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });
  useEffect(() => {
    if (branchData) {
      const transformedOptions = branchData.data.docs.map((item: any) => ({
        label: item.name,
        value: item._id,
      }));
      setOptions(transformedOptions);
    }
  }, [branchData]);

  if (subAdminLoading) {
    return 'loding....';
  }

  return (
    <div>
      <Formik
        initialValues={formData}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const changedData = getChangedFormData(values, formData);
          const newFormData = objectToFormData(changedData);
          handleSubmit(newFormData);
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form className="mt-5 grid gap-4">
            <InputField name="firstName" label="First Name" placeholder="" errors={errors.firstName} touched={touched.firstName} />
            <InputField name="lastName" label="Last Name" placeholder="" errors={errors.lastName} touched={touched.lastName} />
            <InputField name="email" label="Email" placeholder="" errors={errors.email} touched={touched.email} />
            <SelectField
              name="branchId"
              label="Branch"
              options={options}
              onChange={(option: { label: string; value: string }) => setFieldValue('branchId', option.value)}
            />
            <DragAndDropUpload
              value={{ name: 'image', image: values.image }}
              onChange={(image: any) => setFieldValue('image', image)}
              className="mt-2"
              size={1024 * 1000}
              sizeText="1MB"
            />
            <StatusBar setFieldValue={setFieldValue} checkedStatus={values.status} />
            <div className="flex justify-end">
              <SubmitButton />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
