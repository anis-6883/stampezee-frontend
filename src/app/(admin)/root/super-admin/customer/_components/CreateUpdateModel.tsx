'use client';

import Button from '@/components/Formik/Button';
import InputField from '@/components/Formik/InputField';
import InputPassword from '@/components/Formik/InputPassword';
import PhoneNumber from '@/components/Formik/PhoneNumber';
import { SerializedError } from '@/features/api/apiSlice';
import { useCreateCustomerBySuperAdminMutation, useUpdateCustomerBySuperAdminMutation } from '@/features/super-admin/customer/customerApi';
import { ICountrySelect } from '@/types';
import countryData from '@/utils/get-country-list';
import removeEmptyValues from '@/utils/removeEmptyValues';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';
import ReactSelect, { OnChangeValue } from 'react-select';
import { ActionIcon, Modal, Title } from 'rizzui';
import * as Yup from 'yup';

export default function CreateUpdateModel({
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createCustomerBySuperAdmin, { isSuccess: createSuccess, error: createError }] = useCreateCustomerBySuperAdminMutation();
  const [updateCustomerBySuperAdmin, { isSuccess: updateSuccess, error: updateError }] = useUpdateCustomerBySuperAdminMutation();

  const initialValues = {
    fullName: formData?.fullName || '',
    email: formData?.email || '',
    dialCode: formData?.dialCode ? formData?.dialCode : '+1',
    phone: formData?.phone || '',
    country: formData?.country ? formData?.country : 'Canada',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Required!'),
    email: Yup.string().email('Invalid email').required('Required!'),
    phone: Yup.string().required('Required!'),
    country: Yup.string().required('Required!'),
    password: (formData?._id ? Yup.string() : Yup.string().required('Required!')).min(8, 'At least 8 characters long!'),
  });

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);

    if (formData?._id) {
      const changeData = removeEmptyValues(values, ['password']);
      updateCustomerBySuperAdmin({ id: formData._id, formData: changeData });
    } else {
      console.log('values', values);
      createCustomerBySuperAdmin(values);
    }
  };

  useEffect(() => {
    if (createError) {
      const myError = createError as SerializedError;
      setIsSubmitting(false);
      toast.error(myError?.data?.message || 'Something went wrong!');
    }

    if (createSuccess) {
      toast.success('Customer created successfully!');
      setFormData({});
      setIsSubmitting(false);
      setModalState(false);
      setIsSubmitting(false);
    }
  }, [createError, createSuccess, setModalState, setFormData]);

  useEffect(() => {
    if (updateError) {
      const myError = updateError as SerializedError;
      setIsSubmitting(false);
      toast.error(myError?.data?.message || 'Something went wrong!');
    }

    if (updateSuccess) {
      toast.success('Retailer Update successfully!');
      setFormData({});
      setIsSubmitting(false);
      setModalState(false);
      setIsSubmitting(false);
    }
  }, [updateError, updateSuccess, setModalState, setFormData]);

  const countryOptions = countryData.map((country) => ({
    value: country.code,
    label: country.country,
    flag: country.flag,
  }));

  return (
    <div>
      <Modal isOpen={modalState} onClose={() => setModalState(true)} customSize="700px">
        <div className="m-auto px-7 pb-8 pt-6">
          <div className="mb-7 flex items-center justify-between">
            {formData?._id ? <Title as="h4">Update A Customer</Title> : <Title as="h4">Add New Customer</Title>}
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
          <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ errors, setFieldValue, touched, setFieldTouched, values }) => {
              return (
                <Form className="grid gap-4">
                  <InputField name="fullName" label="Full Name" placeholder="Jon Deo" />

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <InputField name="email" label="Email" placeholder="john@email.com" />
                    {!formData._id && <InputPassword name="password" label="Password" placeholder="********" />}
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <PhoneNumber
                      enableSearch={true}
                      name="phone"
                      label={
                        <p>
                          Phone Number <span className="text-danger">*</span>
                        </p>
                      }
                      country="ca"
                      preferredCountries={['ca']}
                      onChange={(value, countryData: any) => {
                        setFieldValue('dialCode', `+${countryData.dialCode}`);
                        setFieldValue('phone', value.slice(countryData.dialCode.length));
                      }}
                      errorClassName="text-red-600 text-xs mt-1"
                      inputClassName={`${errors?.phone && touched?.phone ? '!border-danger hover:!border-danger' : '!border-slate-300 !border'} !h-[43px] !ring-0`}
                      labelClassName="!mb-1"
                      helperClassName="text-danger"
                    />
                    <div className="flex flex-col gap-1">
                      <div>
                        <p className="font-medium">
                          Country
                          <span className="text-red-500"> *</span>
                        </p>
                      </div>
                      <ReactSelect
                        placeholder="Select your country"
                        isSearchable
                        options={countryOptions}
                        getOptionLabel={getOptionLabel}
                        getOptionValue={(option) => option.label}
                        defaultValue={countryOptions.filter((country) => country.label === (formData?.country || 'Canada'))}
                        onChange={(selectedOption: OnChangeValue<ICountrySelect, false>) => setFieldValue('country', selectedOption?.label)}
                        onBlur={() => setFieldTouched('country', true)}
                        styles={{
                          control: (base) => ({
                            ...base,
                            boxShadow: 'none !important',
                          }),
                          input: (base) => ({
                            ...base,
                            boxShadow: 'none !important',
                          }),
                        }}
                      />
                    </div>
                  </div>

                  <p className="flex flex-col text-end text-xs font-semibold">
                    <span>
                      Fields marked with <span className="text-red-600">*</span> are mandatory!
                    </span>
                    <span>
                      Password must be at least <span className="text-red-600">8 characters</span> long!
                    </span>
                  </p>
                  <div className="flex justify-end">
                    <Button
                      color="danger"
                      type="submit"
                      text={formData?._id ? 'Update' : 'Submit'}
                      postIcon={<BsCheck2Circle className="text-base" />}
                      isSubmitting={isSubmitting}
                    />
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </Modal>
    </div>
  );
}
const getOptionLabel = (option: any): any => (
  <div className="flex ">
    <img src={option.flag} alt={option.label} style={{ width: '20px', marginLeft: '5px' }} />
    <span className="ml-2">{option.label}</span>
  </div>
);
