'use client';

import { ROLE } from '@/config/constants';
import { SerializedError } from '@/features/api/apiSlice';
import { useRetailerChangePasswordMutation, useSuperAdminChangePasswordMutation } from '@/features/auth/authApi';
import { RootState } from '@/features/store';
import { Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { ActionIcon, Modal, Title } from 'rizzui';
import * as Yup from 'yup';
import Button from './Formik/Button';
import InputPassword from './Formik/InputPassword';

export default function ChangePasswordModal({
  modalState,
  setModalState,
}: {
  modalState: boolean;
  setModalState: (state: boolean) => void;
}) {
  const t = useTranslations('ChangePasswordModal');
  const tCommon = useTranslations('RetailerCommon');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { role } = useSelector((state: RootState) => state.authSlice);

  const [retailerChangePassword, { isSuccess, error }] = useRetailerChangePasswordMutation();
  const [superAdminChangePassword, { isSuccess: superAdminChangePasswordSuccess, error: superAdminChangePasswordError }] =
    useSuperAdminChangePasswordMutation();

  useEffect(() => {
    if (role === 'retailer') {
      if (error) {
        const myError = error as SerializedError;
        setIsSubmitting(false);
        toast.error(myError?.data?.message || 'Something went wrong!');
      }

      if (isSuccess) {
        setIsSubmitting(false);
        toast.success(t('retailerPasswordUpdatedSuccessfully'));
      }
    } else {
      if (superAdminChangePasswordError) {
        const myError = superAdminChangePasswordError as SerializedError;
        setIsSubmitting(false);
        toast.error(myError?.data?.message || 'Something went wrong!');
      }

      if (superAdminChangePasswordSuccess) {
        setIsSubmitting(false);
        toast.success('Super admin password updated successfully!');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isSuccess, role, superAdminChangePasswordError, superAdminChangePasswordSuccess]);

  const initialValues = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    oldPassword:
      role === 'retailer'
        ? Yup.string().required(tCommon('required')).min(8, t('passwordMustBeAtLeast8Characters'))
        : Yup.string().required('Required!').min(6, 'Password must be at least 6 characters'),
    newPassword:
      role === 'retailer'
        ? Yup.string().required(tCommon('required')).min(8, t('passwordMustBeAtLeast8Characters'))
        : Yup.string().required('Required!').min(6, 'Password must be at least 6 characters'),
    confirmPassword:
      role === 'retailer'
        ? Yup.string().required(tCommon('required')).min(8, t('passwordMustBeAtLeast8Characters'))
        : Yup.string().required('Required!').min(6, 'Password must be at least 6 characters'),
  });

  const handleSubmit = async (values: any, { resetForm }: any) => {
    setIsSubmitting(true);
    if (values?.newPassword !== values?.confirmPassword) {
      toast.error(
        role === ROLE.SUPER_ADMIN ? 'Does not match new password and confirm password!' : t('doesNotMatchNewPasswordAndConfirmPassword')
      );
      setIsSubmitting(false);
      return;
    }
    let result: any;
    if (role === 'retailer') {
      result = await retailerChangePassword(values);
    } else {
      result = await superAdminChangePassword(values);
    }
    if (result?.data?.status) {
      resetForm();
      setModalState(false);
    }
  };

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(true)} customSize="600px">
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-7 flex items-center justify-between">
          <Title as="h4">{t('title')}</Title>

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
          <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ errors, setFieldValue, touched, setFieldTouched, values }) => {
              return (
                <Form className="grid gap-4">
                  <InputPassword name="oldPassword" label={t('oldPassword')} placeholder="******" />
                  <InputPassword name="newPassword" label={t('newPassword')} placeholder="******" />
                  <InputPassword name="confirmPassword" label={t('confirmPassword')} placeholder="******" />

                  <p className="flex flex-col text-end text-xs font-semibold">
                    {role === ROLE.SUPER_ADMIN ? (
                      <span>
                        Fields marked with <span className="text-red-600">*</span> are mandatory!
                      </span>
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: t.raw('fieldsMarkedWithStarAreMandatory') }} />
                    )}

                    {role === ROLE.SUPER_ADMIN ? (
                      <span>
                        Password must be at least <span className="text-red-600">8 characters</span> long!
                      </span>
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: t.raw('passwordMustBeAtLeast8CharactersLong') }} />
                    )}
                  </p>

                  <div className="mt-2 flex justify-end">
                    <Button
                      type="submit"
                      color="danger"
                      text={role === ROLE.SUPER_ADMIN ? 'Update' : t('update')}
                      postIcon={<BsCheck2Circle className="text-base" />}
                      isSubmitting={isSubmitting}
                    />
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Modal>
  );
}
