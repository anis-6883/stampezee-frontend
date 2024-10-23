'use client';

import Button from '@/components/Formik/Button';
import DragAndDropUpload from '@/components/Formik/DragAndDropUpload';
import InputField from '@/components/Formik/InputField';
import InputTextarea from '@/components/Formik/InputTextArea ';
import SelectField from '@/components/Formik/SelectField';
import { SerializedError } from '@/features/api/apiSlice';
import { useCreateNotificationMutation } from '@/features/retailer/notification/notificationApi';
import { translateText } from '@/utils/GoogleTranslate';
import objectToFormData from '@/utils/objectToFormData';
import { Form, Formik } from 'formik';
import _ from 'lodash';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegPaperPlane } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';
import { ActionIcon, Modal, Title } from 'rizzui';
import * as Yup from 'yup';

export default function CreateUpdateModel({
  locale,
  setFormData,
  formData,
  modalState,
  setModalState,
}: {
  locale: string;
  formData: any;
  modalState: boolean;
  setFormData: (data: any) => void;
  setModalState: (state: boolean) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createNotification, { isSuccess: createSuccess, error: createError }] = useCreateNotificationMutation();
  const t = useTranslations('SendAndResendNotification');
  const tCommon = useTranslations('RetailerCommon');

  const initialValues = {
    title: formData?.title || '',
    description: formData?.description || '',
    image: formData?.image || '',
    imageType: formData?.image ? 'image' : '',
  };

  const validationSchema = Yup.object({
    title: Yup.string().trim().required(tCommon('required')),
    description: Yup.string().trim().required(tCommon('required')),
  });

  const submitHandler = async (values: any) => {
    setIsSubmitting(true);

    const isFile = (obj: any): obj is File => obj instanceof File;

    let objToFormData: FormData;

    if (formData?._id) {
      const ignoreList = [];
      // if (!isFile(values?.image)) ignoreList.push('image');
      if (!values?.imageType) {
        ignoreList.push('image');
      }

      objToFormData = objectToFormData(values, ignoreList);
      createNotification(objToFormData);
    } else {
      if (!values?.imageType) {
        objToFormData = objectToFormData(values, ['image', 'imageType']);
      } else {
        objToFormData = objectToFormData(values);
      }
      createNotification(objToFormData);
    }
  };

  // Handle Create Response
  useEffect(() => {
    if (createError) {
      const myError = createError as SerializedError;
      setIsSubmitting(false);
      setModalState(false);
      if (locale === 'en') {
        toast.error(myError?.data?.message || 'Something went wrong. Please try again!.');
      } else {
        (async () => {
          const translatedMessage = await translateText([myError?.data?.message], locale, 'en');
          const errorMessage = translatedMessage[0] || tCommon('errorMessage');
          toast.error(errorMessage);
        })();
      }
    }
    if (createSuccess) {
      toast.success(t('notificationCreatedSuccessfully'));
      setFormData({});
      setIsSubmitting(false);
      setModalState(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createError, createSuccess, setFormData, setModalState]);

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(true)} customSize="600px">
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-7 flex items-center justify-between">
          {formData?._id ? <Title as="h4">{t('resendRegularNotification')}</Title> : <Title as="h4">{t('sendRegularNotification')}</Title>}

          <ActionIcon
            size="sm"
            variant="text"
            onClick={() => {
              setModalState(false);
              setFormData({});
            }}
          >
            <IoCloseOutline className="text-2xl text-danger" />
          </ActionIcon>
        </div>
        <div>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitHandler}>
            {({ setFieldValue, values }) => (
              <Form className="mt-5">
                <InputField name="title" label={t('title')} placeholder="Buy 10 Pizza Get 1 Coke" />
                <div className="my-3">
                  <InputTextarea name="description" label={t('description')} placeholder="Write here..." />
                </div>

                <div className="my-3">
                  <SelectField
                    name="imageType"
                    required={false}
                    label={t('imageType')}
                    value={values?.imageType}
                    options={[
                      { id: 1, name: 'url', value: 'url' },
                      { id: 2, name: 'image', value: 'image' },
                    ].map((item: any) => ({
                      label: _.startCase(_.toLower(item.name)),
                      value: item.value,
                    }))}
                    onChange={(option: { label: string; value: string }) => setFieldValue('imageType', option.value)}
                  />
                </div>

                {values?.imageType === 'image' && (
                  <div className="my-4">
                    <p className="font-medium">{t('attachImage')}</p>
                    <DragAndDropUpload
                      value={{ name: 'image', image: values.image }}
                      onChange={(image: any) => setFieldValue('image', image)}
                      className="mt-2 w-full"
                      size={1024 * 1000}
                      sizeText="1MB"
                    />
                  </div>
                )}

                {values?.imageType === 'url' && (
                  <div className="my-4">
                    <InputField required={false} name="image" label="Image URL" placeholder="https://picsum.photos/200" />
                  </div>
                )}

                <p className="flex flex-col text-end text-xs font-semibold">
                  <span dangerouslySetInnerHTML={{ __html: tCommon.raw('mandatoryFieldsMessage') }} />
                </p>
                <div className="mt-6 flex justify-end">
                  <Button
                    color="danger"
                    type="submit"
                    text={formData?._id ? t('resend') : t('send')}
                    postIcon={<FaRegPaperPlane className="text-base" />}
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
