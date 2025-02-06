'use client';

import Button from '@/components/Formik/Button';
import DragAndDropUpload from '@/components/Formik/DragAndDropUpload';
import InputField from '@/components/Formik/InputField';
import InputPassword from '@/components/Formik/InputPassword';
import PhoneNumber from '@/components/Formik/PhoneNumber';
import { SerializedError } from '@/features/api/apiSlice';
import { useCreateSuperAdminRetailerMutation, useUpdateSuperAdminRetailerMutation } from '@/features/super-admin/retailer/retailerApi';
import { appendFormData } from '@/utils';
import countryData from '@/utils/get-country-list';
import removeEmptyValues from '@/utils/removeEmptyValues';
import { timeZoneList } from '@/utils/timezone-list';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';
import ReactSelect, { OnChangeValue } from 'react-select';
import { ActionIcon, FieldError, Modal, Title } from 'rizzui';
import * as Yup from 'yup';
import AddressMap from './AddressMap';

export default function CreateUpdateModel({
  setFormData,
  formData,
  modalState,
  setModalState,
  googleMapsApiKey,
}: {
  formData: any;
  modalState: boolean;
  setFormData: (data: any) => void;
  setModalState: (state: boolean) => void;
  googleMapsApiKey: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [register, { isSuccess: createSuccess, error: createError }] = useCreateSuperAdminRetailerMutation();
  const [updateRtailar, { isSuccess: updateSuccess, error: updateError }] = useUpdateSuperAdminRetailerMutation();

  const initialValues = {
    storeName: formData?.storeName || '',
    firstName: formData?.firstName || '',
    lastName: formData?.lastName || '',
    email: formData?.email || '',
    dialCode: formData?.dialCode || '+1',
    phone: formData?.phone || '',
    country: formData?.country || 'Canada',
    province: formData?.province || '',
    city: formData?.city || '',
    postalCode: formData?.postalCode || '',
    address: formData?.address || '',
    password: '',
    isAgree: formData?.isAgree || '',
    image: formData?.image || '',
    about: formData?.about || '',
    website: formData?.website || '',
    timezone: formData?.timezone || {
      value: -4,
      label: 'America/Toronto (-4)',
    },
    longitude: formData?.longitude || '',
    latitude: formData?.latitude || '',
  };

  const validationSchema = Yup.object().shape({
    storeName: Yup.string().trim().required('Required!'),
    firstName: Yup.string().trim().required('Required!'),
    lastName: Yup.string().trim(),
    email: Yup.string()
      .test('email', 'Provide valid email!', (value: any) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value);
      })
      .required('Required!'),
    phone: Yup.string().trim().required('Required!'),
    country: Yup.string().trim().required('Required!'),
    province: Yup.string().trim().required('Required!'),
    city: Yup.string().trim().required('Required!'),
    postalCode: Yup.string().trim().required('Required!'),
    address: Yup.string().trim().required('Required!'),
    password: (formData?._id ? Yup.string() : Yup.string().required('Required!')).min(8, 'At least 8 characters long!'),
  });

  function createFormData(data: any): FormData {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      appendFormData(formData, key, (data as any)[key]);
    });
    return formData;
  }

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    const isFile = (obj: any): obj is File => obj instanceof File;

    let objToFormData: FormData;

    const updatedData = removeEmptyValues(values, ['about', 'website', 'isAgree']);

    if (formData?._id) {
      delete updatedData?.email;
      if (!isFile(updatedData?.image)) delete updatedData?.image;

      objToFormData = createFormData(updatedData);
      updateRtailar({ id: formData._id, formData: objToFormData });
    } else {
      if (!isFile(updatedData?.image)) {
        delete updatedData?.image;
        objToFormData = createFormData(updatedData);
      } else {
        objToFormData = createFormData(updatedData);
      }
      register(objToFormData);
    }
  };

  useEffect(() => {
    if (createError) {
      const myError = createError as SerializedError;
      setIsSubmitting(false);
      toast.error(myError?.data?.message || 'Something went wrong!');
    }

    if (createSuccess) {
      console.log('isSuccess', createSuccess);
      toast.success('Retailer created successfully!');
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
  const timezoneOptions = timeZoneList?.map((timezone) => ({ value: timezone?.label, label: timezone?.label }));

  return (
    <div>
      <Modal isOpen={modalState} onClose={() => setModalState(true)} customSize="700px">
        <div className="m-auto px-7 pb-8 pt-6">
          <div className="mb-7 flex items-center justify-between">
            {formData?._id ? <Title as="h4">Update A Retailer</Title> : <Title as="h4">Add New Retailer</Title>}

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
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ errors, setFieldValue, touched, setFieldTouched, values }) => {
              return (
                <Form className="grid gap-4">
                  <DragAndDropUpload
                    value={{ name: 'image', image: values.image }}
                    onChange={(image: any) => setFieldValue('image', image)}
                    className=" mx-auto "
                    size={1024 * 1000}
                    sizeText="1MB"
                    isRounded={true}
                    uploadText="Upload"
                    brandText={<span>Brand Logo</span>}
                  />
                  <InputField name="storeName" label="Store Name" placeholder="Burger King" />
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <InputField name="firstName" label="First Name" placeholder="John" />
                    <InputField name="lastName" label="Last Name" placeholder="Doe" required={false} />
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <PhoneNumber
                      enableSearch={true}
                      name="phone"
                      label={
                        <p>
                          Phone Number <span className="text-red-600">*</span>
                        </p>
                      }
                      country="ca"
                      preferredCountries={['ca']}
                      onChange={(value, countryData: any) => {
                        setFieldValue('dialCode', `+${countryData.dialCode}`);
                        setFieldValue('phone', value.slice(countryData.dialCode.length));
                      }}
                      errorClassName="text-red-600 text-xs mt-1"
                      inputClassName={`${errors?.phone && touched?.phone ? '!border-red-500' : '!border-slate-300 !border'} !h-[43px]`}
                      labelClassName="!mb-1"
                      helperClassName="text-danger"
                      value={`${values?.dialCode}${values?.phone}`}
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
                        options={countryOptions}
                        getOptionLabel={getOptionLabel}
                        getOptionValue={(option) => option.value}
                        defaultValue={countryOptions.find((country) => country.label === (formData?.country || 'Canada'))}
                        onChange={(selectedOption) => setFieldValue('country', selectedOption?.label)}
                        onBlur={() => setFieldTouched('country', true)}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div>
                        <p className="font-medium">
                          Timezone
                          <span className="text-red-500"> *</span>
                        </p>
                      </div>

                      <ReactSelect
                        key={values.timezone.label}
                        placeholder="Select your timezone"
                        menuPlacement="top"
                        options={timezoneOptions}
                        isDisabled={false}
                        isClearable={false}
                        isSearchable={true}
                        name="timezone"
                        defaultValue={timezoneOptions?.filter((item) => String(item?.label) === values?.timezone.label)}
                        onChange={(selectedOption: OnChangeValue<any, false>) => {
                          const selectedTimezone = timeZoneList.find((item) => item.label === selectedOption?.label);
                          setFieldValue('timezone', selectedTimezone);
                        }}
                        onBlur={() => setFieldTouched('timezone', true)}
                      />

                      {touched.timezone && errors.timezone && (
                        <FieldError error={errors?.timezone as string} className="text-xs text-red-600" />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1">
                    {/* <InputField name="address" label="Address" placeholder="120 Bremner Blvd, Suite 800" /> */}
                    <AddressMap googleMapsApiKey={googleMapsApiKey} />
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <InputField name="province" label="Province" placeholder="Ontario" />
                    <InputField name="city" label="City" placeholder="Toronto" />
                    <InputField name="postalCode" label="Postal Code" placeholder="M3C" />
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="grid grid-cols-1">
                      <InputField required={false} name="about" label="About" placeholder="Write About Here" />
                    </div>

                    <div className="grid grid-cols-1">
                      <InputField required={false} name="website" label="Website" placeholder="https://www.user.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <InputField disabled={formData?._id ? true : false} name="email" label="Email" placeholder="john@email.com" />
                    {!formData._id && <InputPassword name="password" label="Password" placeholder="********" />}
                  </div>

                  <p className="flex flex-col text-end text-xs font-semibold">
                    <span>
                      Fields marked with <span className="text-red-600">*</span> are mandatory!
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
