'use client';

import DragAndDropUpload from '@/components/Formik/DragAndDropUpload';
import InputField from '@/components/Formik/InputField';
import { ROLE } from '@/config/constants';
import { SerializedError } from '@/features/api/apiSlice';
import { useSuperAdminGetProfileQuery, useSuperAdminUpdateProfileMutation } from '@/features/auth/authApi';
import { setValue } from '@/features/auth/authSlice';
import { RootState } from '@/features/store';
import getChangedFormData from '@/utils/getChangedFormData';
import objectToFormData from '@/utils/objectToFormData';
import { Form, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { HiMiniXCircle } from 'react-icons/hi2';
import { useDispatch, useSelector } from 'react-redux';
import { ActionIcon, Modal, Title } from 'rizzui';
import Button from '../Formik/Button';

export default function UpdateProfileModal({
  modalState,
  setModalState,
}: {
  modalState: boolean;
  setModalState: (state: boolean) => void;
}) {
  const dispatch = useDispatch();
  const { data: session, update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, role } = useSelector((state: RootState) => state.authSlice);

  const { data: superAdminProfile } = useSuperAdminGetProfileQuery(null, { skip: role !== ROLE.SUPER_ADMIN });
  const [superAdminUpdateProfile, { data: updateProfileData, isSuccess: updateProfileSuccess, error: updateProfileError }] =
    useSuperAdminUpdateProfileMutation();

  const initialValues = {
    firstName: superAdminProfile?.data?.firstName || '',
    lastName: superAdminProfile?.data?.lastName || '',
    image: `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${superAdminProfile?.data?.image}` || null,
    email: superAdminProfile?.data?.email,
  };

  //   const validationSchema = Yup.object({
  //     title: Yup.string().required('Title is required'),
  //     image: Yup.mixed().required('Image is required'),
  //   });

  const submitHandler = async (values: any) => {
    setIsSubmitting(true);
    const changeFormData = getChangedFormData(values, initialValues, ['email']);
    const isFile = (obj: any): obj is File => obj instanceof File;

    let objToFormData: FormData;

    if (!isFile(values?.image)) {
      objToFormData = objectToFormData(changeFormData, ['image']);
    } else {
      objToFormData = objectToFormData(changeFormData);
    }
    superAdminUpdateProfile(objToFormData);
  };

  // Handle Profile Update Response
  useEffect(() => {
    if (updateProfileError) {
      const myError = updateProfileError as SerializedError;
      toast.error(myError?.data?.message || 'Something went wrong. Please try again!.');
      setIsSubmitting(false);
    }
    if (updateProfileSuccess) {
      toast.success('Super admin profile updated successfully!');
      setIsSubmitting(false);
      setModalState(false);
      update({ ...session?.user, ...updateProfileData?.data });
      dispatch(
        setValue({
          target: 'user',
          value: { ...user, ...updateProfileData?.data },
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateProfileError, updateProfileSuccess, setModalState, updateProfileData, dispatch]);

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(true)} customSize="600px">
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-7 flex items-center justify-between">
          <Title as="h4">Update Profile</Title>

          <ActionIcon
            size="sm"
            variant="text"
            onClick={() => {
              setModalState(false);
            }}
          >
            <HiMiniXCircle className="text-2xl text-danger" />
          </ActionIcon>
        </div>
        <div>
          <Formik initialValues={initialValues} enableReinitialize onSubmit={submitHandler}>
            {({ setFieldValue, values }) => (
              <Form className="mt-5">
                <DragAndDropUpload
                  value={{ name: 'image', image: values.image }}
                  onChange={(image: any) => setFieldValue('image', image)}
                  className="flex items-center justify-center"
                  size={1024 * 1000}
                  sizeText="1MB"
                  isRounded={true}
                />
                <InputField className="my-3" name="firstName" required={false} label="First Name" placeholder="Mr." />
                <InputField name="lastName" required={false} label="Last Name" placeholder="Rohim" />
                <InputField className="my-3" disabled={true} name="email" required={false} label="Email" placeholder="admin@email.com" />
                {/* <p className="text-end text-xs font-semibold">
                  Fields marked with <span className="text-red-600">*</span> are mandatory!
                </p> */}
                <div className="mt-6 flex justify-end">
                  <Button
                    color={'primary'}
                    type="submit"
                    text={'Update'}
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
