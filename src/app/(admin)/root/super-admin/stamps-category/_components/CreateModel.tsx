'use client';

import SubmitButton from '@/components/Formik/Button';
import DragAndDropUpload from '@/components/Formik/DragAndDropUpload';
import InputField from '@/components/Formik/ImputField';
import InputTextarea from '@/components/Formik/InputTextArea ';
import StatusBar from '@/components/Formik/StatusBar';
import {
  useCreateSuperAdminStampImageCategoryMutation,
  useUpdateSuperAdminStampImageCategoryMutation,
} from '@/features/super-admin/stamp-category/stampCategoryApi';
import objectToFormData from '@/utils/objectToFormData';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { RxCross2 } from 'react-icons/rx';
import { ActionIcon, Modal, Text } from 'rizzui';
import * as Yup from 'yup';

export default function CreateModel({
  setModalState,
  modalState,
  edit = false,
  setEdit,
  updateValue,
  setUpdateValue,
  handleClose,
}: {
  setModalState: any;
  modalState: any;
  edit: boolean;
  setEdit: any;
  updateValue: any;
  setUpdateValue: any;
  handleClose: any;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>();
  const [createSuperAdminStampImageCategory] = useCreateSuperAdminStampImageCategoryMutation();
  const [updateSuperAdminStampImageCategory] = useUpdateSuperAdminStampImageCategoryMutation(updateValue.id);

  const router = useRouter();

  useEffect(() => {
    if (edit) {
      setFormData(updateValue);
    } else {
      setFormData({
        name: '',
        description: '',
        image: null,
        status: true,
      });
    }
  }, [updateValue, edit]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.mixed().required('Description is required'),
    image: Yup.mixed().required('Image is required'),
    status: Yup.boolean(),
  });

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      setSubmitting(true);

      // const formData: any = new FormData();
      // formData.append('title', values.title);
      // formData.append('image', values.image as Blob); // Ensure the image is appended as a Blob
      // formData.append('status', values.status);
      // const changedData = getChangedFormData(values, formData, ['_id']);
      const createFormData: any = objectToFormData(values, ['_id']);
      console.log(values, 'values');

      if (edit && updateValue.id) {
        await updateSuperAdminStampImageCategory({ id: updateValue.id, formData: createFormData }).unwrap();
      } else {
        await createSuperAdminStampImageCategory(createFormData).unwrap();
      }

      setModalState(false);
      handleClose;
      setSubmitting(false);

      toast.success('Branch created successfully!');
    } catch (error: any) {
      console.error('Failed to create branch:', error);
      toast.error(error.data.massage ?? 'Failed to create branch. Please try again.');
      setSubmitting(false);
    } finally {
      handleClose;
      setSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={modalState}
        onClose={() => handleClose}
        overlayClassName="backdrop-blur"
        containerClassName="max-w-4xl shadow-2xl bg-white rounded-lg overflow-hidden"
        className="relative"
      >
        <div className="m-auto px-7 pb-8 pt-6">
          <div className="mb-5 flex items-center justify-between rounded-t-lg text-black">
            <Text className="text-xl">Create your stamps</Text>
            <ActionIcon size="sm" variant="text" onClick={() => setModalState(false)}>
              <RxCross2 className="h-auto w-6" strokeWidth={1.8} />
            </ActionIcon>
          </div>
          <div className="grid grid-cols-1 gap-x-5 gap-y-6 [&_label>span]:font-medium">
            <Formik
              initialValues={formData}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={(values) => {
                handleSubmit(values);
              }}
            >
              {({ errors, touched, setFieldValue, values }) => (
                <Form className="mt-5 grid gap-4">
                  <InputField name="name" label="Name" placeholder="Enter Name" errors={errors.name} touched={touched.name} />
                  <InputTextarea
                    name="description"
                    label="Description"
                    placeholder="Write you message Description..."
                    errors={errors.description}
                    touched={touched.description}
                    setFieldValue={setFieldValue}
                    value={values.description}
                  />
                  <DragAndDropUpload
                    value={{ name: 'image', image: values.image }}
                    onChange={(image: any) => setFieldValue('image', image)}
                    className="mt-2"
                    size={1024 * 1000}
                    sizeText="1MB"
                  />
                  <StatusBar setFieldValue={setFieldValue} checkedStatus={values.status} />
                  <div className="mt-2">
                    <SubmitButton type="submit" isSubmitting={submitting} />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Modal>
    </>
  );
}
