'use client';
import DragAndDropUpload from '@/components/Formik/DragAndDropUpload';
import InputField from '@/components/Formik/ImputField';
import StatusBar from '@/components/Formik/StatusBar';
import { useCreateStampImageMutation, useUpdateStampImageMutation } from '@/features/retailer/stamp/stampApi';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ImSpinner9 } from 'react-icons/im';
import { RxCross2 } from 'react-icons/rx';
import { ActionIcon, Button, Modal, Text } from 'rizzui';
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
  const [createStampImage] = useCreateStampImageMutation();
  const [updateStampImage] = useUpdateStampImageMutation(updateValue._id);
  const router = useRouter();

  useEffect(() => {
    if (edit) {
      setFormData(updateValue);
    } else {
      setFormData({
        title: '',
        image: null,
        status: true,
      });
    }
  }, [updateValue, edit]);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    image: Yup.mixed().required('Image is required'),
    status: Yup.boolean(),
  });

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      setSubmitting(true);

      const formData: any = new FormData();
      formData.append('title', values.title);
      formData.append('image', values.image as Blob); // Ensure the image is appended as a Blob
      formData.append('status', values.status);

      if (edit && updateValue._id) {
        await updateStampImage({ id: updateValue._id, formData: formData }).unwrap();
      } else {
        await createStampImage(formData).unwrap();
      }

      setModalState(false);
      handleClose;

      // routes.push(routes.retailer.branch.home);
      toast.success('Branch created successfully!');
    } catch (error) {
      console.error('Failed to create branch:', error);
      toast.error('Failed to create branch. Please try again.');
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
          <div className="mb-7 flex items-center justify-between rounded-t-lg bg-indigo-500 px-4 py-3 text-white">
            <Text>create your stamps</Text>
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
                  <InputField name="title" label="Title" placeholder="" errors={errors.title} touched={touched.title} />
                  <DragAndDropUpload
                    setFieldValue={setFieldValue}
                    name="image"
                    image={values.image != null ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${values.image}` : null}
                  />
                  <StatusBar setFieldValue={setFieldValue} checkedStatus={values.status} />
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
        </div>
      </Modal>
    </>
  );
}
