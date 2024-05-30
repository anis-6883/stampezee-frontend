'use client';
import SubmitButton from '@/components/Formik/Button';
import DragAndDropUpload from '@/components/Formik/DragAndDropUpload';
import InputField from '@/components/Formik/ImputField';
import InputPassword from '@/components/Formik/InputPassword';
import SelectField from '@/components/Formik/SelectField';
import StatusBar from '@/components/Formik/StatusBar';
import { routes } from '@/config/routes';
import { useAllBranchQuery } from '@/features/retailer/branch/branchApi';
import { useCreateSubAdminMutation } from '@/features/retailer/sub-admin/subAdminApi';
import { IQueryType } from '@/types';
import objectToFormData from '@/utils/objectToFormData';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

export default function Create() {
  const [submitting, setSubmitting] = useState(false);
  const [createSubAdmin] = useCreateSubAdminMutation();
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [uploadImageMsg, setUploadImageMsg] = useState('');
  const [dropImage, setDropImage] = useState('');
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

  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      // Convert values object to FormData
      const formData = objectToFormData(values);

      const result = await createSubAdmin(formData).unwrap();
      router.push(routes.retailer.sub_admin.home);
      toast.success(result.data.message ?? 'sub Admin created successfully!');
    } catch (error: any) {
      console.error('Failed to create sub Admin:', error);
      toast.error(error.data.message ?? 'Failed to create sub Admin. Please try again.');
      setSubmitting(false);
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    branchId: Yup.string().required('This field is required'),
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('This field is required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('This field is required'),
    email: Yup.string().email('Invalid email').required('This field is required'),
    password: Yup.string()
      .min(6, 'Too Short!')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/, 'At least 6 characters long with 1 uppercase, 1 lowercase & 1 digit!')
      .required('This field is required'),
    image: Yup.string().nullable(),
    status: Yup.boolean().required('This field is required'),
  });

  const initialValues = {
    branchId: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    image: null,
    status: false,
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          // same shape as initial values
          console.log(values, 'value submit');
          handleSubmit(values);
        }}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form className="mt-5 grid gap-4">
            <InputField name="firstName" label="First Name" placeholder="" errors={errors.firstName} touched={touched.firstName} />
            <InputField name="lastName" label="Last Name" placeholder="" errors={errors.lastName} touched={touched.lastName} />
            <InputField name="email" label="Email" placeholder="" errors={errors.email} touched={touched.email} />

            <InputPassword name="password" label="Password" placeholder="" errors={errors.password} touched={touched.password} />
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

            <StatusBar setFieldValue={setFieldValue} />
            <div className="flex justify-end">
              <SubmitButton isSubmitting={submitting} />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
