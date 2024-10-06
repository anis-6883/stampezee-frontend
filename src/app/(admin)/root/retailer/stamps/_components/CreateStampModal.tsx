'use client';

import Button from '@/components/Formik/Button';
import DragAndDropUpload from '@/components/Formik/DragAndDropUpload';
import InputField from '@/components/Formik/InputField';
import { SerializedError } from '@/features/api/apiSlice';
import { useCreateStampImageMutation, useUpdateStampImageMutation } from '@/features/retailer/stamp-image/stampApi';
import { translateText } from '@/utils/GoogleTranslate';
import objectToFormData from '@/utils/objectToFormData';
import { Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';
import { ActionIcon, Modal, Title } from 'rizzui';
import * as Yup from 'yup';

export default function CreateStampModal({
  locale,
  //   setFormData,
  //   formData,
  modalState,
  setModalState,
}: {
  locale: string;
  //   formData: any;
  modalState: boolean;
  //   setFormData: (data: any) => void;
  setModalState: (state: boolean) => void;
}) {
  const t2 = useTranslations('RetailerStampImageCreateUpdate');
  const tCommon = useTranslations('RetailerCommon');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createStampImage, { isSuccess: createSuccess, error: createError }] = useCreateStampImageMutation();
  const [updateStampImage, { isSuccess: updateSuccess, error: updateError }] = useUpdateStampImageMutation();

  const initialValues = {
    title: '',
    image: null,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required(tCommon('required')),
    image: Yup.mixed().required(tCommon('required')),
  });

  const submitHandler = async (values: any) => {
    setIsSubmitting(true);
    const isFile = (obj: any): obj is File => obj instanceof File;

    let objToFormData: FormData;
    if (!isFile(values?.image)) {
      objToFormData = objectToFormData(values, ['image']);
    } else {
      objToFormData = objectToFormData(values);
    }
    createStampImage(objToFormData);
  };

  // Handle Create Response
  useEffect(() => {
    if (createError) {
      const myError = createError as SerializedError;
      if (locale === 'en') {
        toast.error(myError?.data?.message || 'Something went wrong!');
      } else {
        (async () => {
          const translatedMessage = await translateText([myError?.data?.message], locale, 'en');
          const errorMessage = translatedMessage[0] || tCommon('errorMessage');
          toast.error(errorMessage);
        })();
      }
      setIsSubmitting(false);
    }
    if (createSuccess) {
      toast.success(t2('stampImageCreatedSuccessfully'));
      setIsSubmitting(false);
      setModalState(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createError, createSuccess, setModalState]);

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(true)} customSize="600px">
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-7 flex items-center justify-between">
          <Title as="h4">{t2('addNewStampImage')}</Title>

          <ActionIcon
            size="sm"
            variant="text"
            onClick={() => {
              setModalState(false);
            }}
          >
            <IoCloseOutline className="text-2xl text-danger" />
          </ActionIcon>
        </div>
        <div>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitHandler}>
            {({ setFieldValue, values }) => (
              <Form className="mt-5">
                <div className="my-4">
                  <DragAndDropUpload
                    value={{ name: 'image', image: values.image }}
                    onChange={(image: any) => setFieldValue('image', image)}
                    className="mt-2"
                    size={1024 * 1000}
                    sizeText="1MB"
                    isRounded={true}
                    uploadText="Upload"
                    brandText={
                      <span>
                        Image <span className="text-danger">*</span>
                      </span>
                    }
                  />
                </div>

                <InputField name="title" label={t2('title')} placeholder="Stamp One" />

                <p className="mt-5 text-end text-xs font-semibold">
                  <span dangerouslySetInnerHTML={{ __html: tCommon.raw('mandatoryFieldsMessage') }} />
                </p>
                <div className="mt-6 flex justify-end">
                  <Button
                    color={'danger'}
                    type="submit"
                    text={t2('submit')}
                    postIcon={<BsCheck2Circle className="text-base" />}
                    isSubmitting={isSubmitting}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Modal>
  );
}
