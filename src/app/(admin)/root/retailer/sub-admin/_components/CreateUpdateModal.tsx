'use client';

import Button from '@/components/Formik/Button';
import DragAndDropUpload from '@/components/Formik/DragAndDropUpload';
import InputField from '@/components/Formik/InputField';
import InputPassword from '@/components/Formik/InputPassword';
import SelectField from '@/components/Formik/SelectField';
import { routes } from '@/config/routes';
import { SerializedError } from '@/features/api/apiSlice';
import { useCreateSubAdminMutation, useSubAdminBranchesQuery, useUpdateSubAdminMutation } from '@/features/retailer/sub-admin/subAdminApi';
import objectToFormData from '@/utils/objectToFormData';
import { Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';
import { ActionIcon, Modal, Title } from 'rizzui';
import * as Yup from 'yup';

export default function CreateUpdateModal({
  setFormData,
  formData,
  modalState,
  setModalState,
}: {
  formData: any;
  modalState: boolean;
  setFormData: (data: any) => void;
  setModalState: (state: boolean) => void;
}) {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [createSubAdmin, { isSuccess: createSuccess, error: createError }] = useCreateSubAdminMutation();
  const [updateSubAdmin, { isSuccess: updateSuccess, error: updateError }] = useUpdateSubAdminMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: branches } = useSubAdminBranchesQuery(undefined);
  const t = useTranslations('RetailerSubAdmin');
  const t2 = useTranslations('RetailerSubAdminTable');
  const tCommon = useTranslations('RetailerCommon');

  useEffect(() => {
    if (branches) {
      const transformedOptions = branches?.data.map((branch: any) => ({
        label: branch.name,
        value: branch._id,
      }));
      setOptions(transformedOptions);
    }
  }, [branches]);

  useEffect(() => {
    if (createError) {
      const myError = createError as SerializedError;
      toast.error(myError?.data?.message || tCommon('errorMessage'));
      setIsSubmitting(false);
    }
    if (createSuccess) {
      toast.success(t2('subAdminCreatedSuccessfully'));
      setFormData({});
      setIsSubmitting(false);
      setModalState(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createError, createSuccess, setFormData, setModalState]);

  useEffect(() => {
    if (updateError) {
      const myError = updateError as SerializedError;
      toast.error(myError?.data?.message || tCommon('errorMessage'));
      setIsSubmitting(false);
    }
    if (updateSuccess) {
      toast.success(t2('subAdminUpdatedSuccessfully'));
      setFormData({});
      setIsSubmitting(false);
      setModalState(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setFormData, setModalState, updateError, updateSuccess]);

  const initialValues = {
    branchId: formData?.branch?._id || '',
    firstName: formData?.firstName || '',
    lastName: formData?.lastName || '',
    email: formData?.email || '',
    password: formData?.password || '',
    image: formData?.image || null,
  };

  const validationSchema = Yup.object().shape({
    branchId: Yup.string().required(tCommon('required')),
    firstName: Yup.string().required(tCommon('required')),
    email: Yup.string()
      .test('email', 'Provide valid email!', (value: any) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value);
      })
      .required(tCommon('required')),
    password: (formData?._id ? Yup.string() : Yup.string().required(tCommon('required'))).min(6, 'At least 6 characters long!'),
    image: Yup.string().nullable(),
  });

  // Submit Handler
  const submitHandler = async (values: any) => {
    setIsSubmitting(true);
    const isFile = (obj: any): obj is File => obj instanceof File;

    let objToFormData: FormData;

    if (formData?._id) {
      const ignoreList = ['password'];
      if (!isFile(values?.image)) ignoreList.push('image');

      objToFormData = objectToFormData(values, ignoreList);
      updateSubAdmin({ id: formData._id, data: objToFormData });
    } else {
      if (!isFile(values?.image)) {
        objToFormData = objectToFormData(values, ['image']);
      } else {
        objToFormData = objectToFormData(values);
      }
      createSubAdmin(objToFormData);
    }
  };

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(true)} customSize="600px">
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-7 flex items-center justify-between">
          {formData?._id ? <Title as="h4">{t('updateSubAdmin')}</Title> : <Title as="h4">{t('addNewSubAdmin')}</Title>}
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
                <div className="mb-5">
                  <DragAndDropUpload
                    value={{ name: 'image', image: values.image }}
                    onChange={(image: any) => setFieldValue('image', image)}
                    className="mt-2"
                    size={1024 * 1000}
                    sizeText="1MB"
                    isRounded={true}
                    uploadText="Upload"
                    brandText={<span>{t2('image')}</span>}
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-5">
                  <InputField name="firstName" label={t2('firstName')} placeholder="John" />
                  <InputField name="lastName" label={t2('lastName')} placeholder="Doe" required={false} />
                  <InputField name="email" label={t2('email')} placeholder="john.doe@email.com" />
                  {!formData?._id && <InputPassword name="password" label={t2('password')} placeholder="******" />}
                </div>

                <div className="my-4 space-y-5">
                  <SelectField
                    name="branchId"
                    label={t2('branch')}
                    disabled={branches?.data?.length === 0 ? true : false}
                    options={options}
                    onChange={(option: { label: string; value: string }) => setFieldValue('branchId', option.value)}
                    value={values.branchId}
                  />
                  {branches?.data?.length === 0 && (
                    <div className="text-center">
                      <Link href={routes.privateRoutes.retailer.branch.create} className="text-xs font-semibold text-danger">
                        Create Branch
                      </Link>
                    </div>
                  )}
                </div>
                <p className="text-end text-xs font-semibold">
                  <span dangerouslySetInnerHTML={{ __html: tCommon.raw('mandatoryFieldsMessage') }} />
                </p>
                <div className="mt-6 flex justify-end">
                  <Button
                    color="danger"
                    type="submit"
                    text={formData?._id ? t('update') : t('submit')}
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
