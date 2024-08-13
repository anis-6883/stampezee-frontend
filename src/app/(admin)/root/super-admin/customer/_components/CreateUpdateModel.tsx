// 'use client';

// import Button from '@/components/Formik/Button';
// import InputField from '@/components/Formik/InputField';
// import InputPassword from '@/components/Formik/InputPassword';
// import PhoneNumber from '@/components/Formik/PhoneNumber';
// import { SerializedError } from '@/features/api/apiSlice';
// import { useCreateSuperAdminRetailerMutation, useUpdateSuperAdminRetailerMutation } from '@/features/super-admin/retailer/retailerApi';
// import countryData from '@/utils/get-country-list';
// import objectToFormData from '@/utils/objectToFormData';
// import { Form, Formik } from 'formik';
// import { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import { BsCheck2Circle } from 'react-icons/bs';
// import ReactSelect from 'react-select';
// import { Modal, Title } from 'rizzui';
// import * as Yup from 'yup';

// export default function CreateUpdateModel({
//   setFormData,
//   formData,
//   modalState,
//   setModalState,
// }: {
//   formData: any;
//   modalState: boolean;
//   setFormData: (data: any) => void;
//   setModalState: (state: boolean) => void;
// }) {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [register, { isSuccess: createSuccess, error: createError }] = useCreateSuperAdminRetailerMutation();
//   const [updateRtailar, { isSuccess: updateSuccess, error: updateError }] = useUpdateSuperAdminRetailerMutation();

//   const initialValues = {
//     storeName: formData?.storeName || '',
//     firstName: formData?.firstName || '',
//     lastName: formData?.lastName || '',
//     email: formData?.email || '',
//     dialCode: formData?.dialCode || '+1',
//     phone: formData?.phone || '',
//     country: formData?.country || 'Canada',
//     province: formData?.province || '',
//     city: formData?.city || '',
//     postalCode: formData?.postalCode || '',
//     address: formData?.address || '',
//     password: '',
//     isAgree: formData?.isAgree || '',
//     image: formData?.image || '',
//     about: formData?.about || '',
//     website: formData?.website || '',
//   };

//   const validationSchema = Yup.object().shape({
//     storeName: Yup.string().required('Required!'),
//     firstName: Yup.string().required('Required!'),
//     lastName: Yup.string(),
//     email: Yup.string().email('Invalid email').required('Required!'),
//     phone: Yup.string().required('Required!'),
//     country: Yup.string().required('Required!'),
//     province: Yup.string().required('Required!'),
//     city: Yup.string().required('Required!'),
//     postalCode: Yup.string().required('Required!'),
//     address: Yup.string().required('Required!'),
//     password: (formData?._id ? Yup.string() : Yup.string().required('Required!')).min(8, 'At least 8 characters long!'),
//   });

//   const handleSubmit = async (values: any) => {
//     setIsSubmitting(true);
//     const isFile = (obj: any): obj is File => obj instanceof File;

//     let objToFormData: FormData;

//     if (formData?._id) {
//       const ignoreList = [];
//       if (!isFile(values?.image)) ignoreList.push('image');

//       objToFormData = objectToFormData(values, ignoreList);
//       updateRtailar({ id: formData._id, formData: objToFormData });
//     } else {
//       if (!isFile(values?.image)) {
//         objToFormData = objectToFormData(values, ['image']);
//       } else {
//         objToFormData = objectToFormData(values);
//       }
//       register(objToFormData);
//     }
//   };

//   useEffect(() => {
//     if (createError) {
//       const myError = createError as SerializedError;
//       setIsSubmitting(false);
//       toast.error(myError?.data?.message || 'Something went wrong!');
//     }

//     if (createSuccess) {
//       console.log('isSuccess', createSuccess);
//       toast.success('Retailer created successfully!');
//       setFormData({});
//       setIsSubmitting(false);
//       setModalState(false);
//       setIsSubmitting(false);
//     }
//   }, [createError, createSuccess, setModalState, setFormData]);

//   useEffect(() => {
//     if (updateError) {
//       const myError = updateError as SerializedError;
//       setIsSubmitting(false);
//       toast.error(myError?.data?.message || 'Something went wrong!');
//     }

//     if (updateSuccess) {
//       toast.success('Retailer Update successfully!');
//       setFormData({});
//       setIsSubmitting(false);
//       setModalState(false);
//       setIsSubmitting(false);
//     }
//   }, [updateError, updateSuccess, setModalState, setFormData]);

//   const countryOptions = countryData.map((country) => ({
//     value: country.code,
//     label: country.country,
//     flag: country.flag,
//   }));

//   return (
//     <div>
//       <Modal isOpen={modalState} onClose={() => setModalState(true)} customSize="700px">
//         <div className="m-auto px-7 pb-8 pt-6">
//           <div className="mb-7 flex items-center justify-between">
//             {formData?._id ? <Title as="h4">Update A Customer</Title> : <Title as="h4">Add New Customer</Title>}
//           </div>
//           <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
//             {({ errors, setFieldValue, touched, setFieldTouched, values }) => {
//               return (
//                 <Form className="grid gap-4">
//                   <InputField name="fullName" label="Full Name" placeholder="Jon Deo" />

//                   <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//                     <InputField name="email" label="Email" placeholder="john@email.com" />
//                     {!formData._id && <InputPassword name="password" label="Password" placeholder="********" />}
//                   </div>

//                   <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//                     <PhoneNumber
//                       name="phone"
//                       label={
//                         <p>
//                           Phone Number <span className="text-red-600">*</span>
//                         </p>
//                       }
//                       country="ca"
//                       preferredCountries={['ca']}
//                       onChange={(value, countryData: any) => {
//                         setFieldValue('dialCode', `+${countryData.dialCode}`);
//                         setFieldValue('phone', value.slice(countryData.dialCode.length));
//                       }}
//                       errorClassName="text-red-600 text-xs mt-1"
//                       inputClassName={`${errors?.phone && touched?.phone ? '!border-red-500' : '!border-slate-300 !border-[2px]'} !h-[43px]`}
//                       labelClassName="!mb-1"
//                     />
//                     <div className="flex flex-col gap-1">
//                       <div>
//                         <p className="font-medium">
//                           Country
//                           <span className="text-red-500"> *</span>
//                         </p>
//                       </div>
//                       <ReactSelect
//                         placeholder="Select your country"
//                         options={countryOptions}
//                         getOptionLabel={getOptionLabel}
//                         getOptionValue={(option) => option.value}
//                         defaultValue={countryOptions.find((country) => country.label === (formData?.country || 'Canada'))}
//                         onChange={(selectedOption) => setFieldValue('country', selectedOption?.label)}
//                         onBlur={() => setFieldTouched('country', true)}
//                       />
//                     </div>
//                   </div>

//                   <p className="flex flex-col text-end text-xs font-semibold">
//                     <span>
//                       Fields marked with <span className="text-red-600">*</span> are mandatory!
//                     </span>
//                     <span>
//                       Password must be at least <span className="text-red-600">8 characters</span> long!
//                     </span>
//                   </p>
//                   <div className="flex justify-end">
//                     <Button
//                       color={formData?._id ? 'warning' : 'primary'}
//                       type="submit"
//                       text={formData?._id ? 'Update' : 'Submit'}
//                       postIcon={<BsCheck2Circle className="text-base" />}
//                       isSubmitting={isSubmitting}
//                     />
//                   </div>
//                 </Form>
//               );
//             }}
//           </Formik>
//         </div>
//       </Modal>
//     </div>
//   );
// }
// const getOptionLabel = (option: any): any => (
//   <div className="flex ">
//     <img src={option.flag} alt={option.label} style={{ width: '20px', marginLeft: '5px' }} />
//     <span className="ml-2">{option.label}</span>
//   </div>
// );

'use client';

import Button from '@/components/Formik/Button';
import InputField from '@/components/Formik/InputField';
import InputPassword from '@/components/Formik/InputPassword';
import PhoneNumber from '@/components/Formik/PhoneNumber';
import { SerializedError } from '@/features/api/apiSlice';
import { useCreateSubAdminMutation, useUpdateSubAdminMutation } from '@/features/retailer/sub-admin/subAdminApi';
import { ICountrySelect } from '@/types';
import countryData from '@/utils/get-country-list';
import objectToFormData from '@/utils/objectToFormData';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { HiMiniXCircle } from 'react-icons/hi2';
import { IoAlertCircle } from 'react-icons/io5';
import ReactSelect, { OnChangeValue } from 'react-select';
import { ActionIcon, Checkbox, Modal, Title } from 'rizzui';
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

  useEffect(() => {
    if (createError) {
      const myError = createError as SerializedError;
      toast.error(myError?.data?.message || 'Something went wrong. Please try again!.');
      setIsSubmitting(false);
    }
    if (createSuccess) {
      toast.success('Sub-Admin created successfully!');
      setFormData({});
      setIsSubmitting(false);
      setModalState(false);
    }
  }, [createError, createSuccess, setFormData, setModalState]);

  useEffect(() => {
    if (updateError) {
      const myError = updateError as SerializedError;
      toast.error(myError?.data?.message || 'Something went wrong. Please try again!.');
      setIsSubmitting(false);
    }
    if (updateSuccess) {
      toast.success('Sub-Admin updated successfully!');
      setFormData({});
      setIsSubmitting(false);
      setModalState(false);
    }
  }, [setFormData, setModalState, updateError, updateSuccess]);

  const initialValues = {
    fullName: formData?.fullName || '',
    email: formData?.email || '',
    dialCode: formData?.dialCode || '+1',
    phone: formData?.phone || '',
    country: formData?.country || 'Canada',
    password: '',
    isAgree: formData?.isAgree || '',
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Required!'),
    email: Yup.string().email('Invalid email').required('Required!'),
    phone: Yup.string().required('Required!'),
    country: Yup.string().required('Required!'),
    isAgree: Yup.string().required('Required!'),
    password: (formData?._id ? Yup.string() : Yup.string().required('Required!')).min(8, 'At least 8 characters long!'),
  });

  // Submit Handler
  const submitHandler = async (values: any) => {
    console.log('values', values);
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

  const countryOptions = countryData.map((country) => ({
    value: country.code,
    label: country.country,
    flag: country.flag,
  }));

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(true)} customSize="600px">
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
            <HiMiniXCircle className="text-2xl text-danger" />
          </ActionIcon>
        </div>
        <div>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitHandler}>
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
                      inputClassName={`${errors?.phone && touched?.phone ? '!border-red-500' : '!border-slate-300 !border-[2px]'} !h-[43px]`}
                      labelClassName="!mb-1"
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
                        defaultValue={countryOptions.filter((country) => country.label === 'Canada')}
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

                  <div className="flex flex-col gap-y-1">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        onChange={() => {
                          values.isAgree === 'yes' ? setFieldValue('isAgree', '') : setFieldValue('isAgree', 'yes');
                        }}
                        inputClassName={`!ring-0 checked:!bg-danger checked:!border-danger ${errors.isAgree && touched.isAgree && '!border-red-500 !ring-0'}`}
                        size="sm"
                        iconClassName="top-0"
                        onBlur={() => setFieldTouched('isAgree', true)}
                      />{' '}
                      <p className="text-xs font-medium">
                        I Agree with the{' '}
                        <Link href="/terms" className="border-b-2">
                          Terms of Use
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy-policy" className="border-b-2">
                          Privacy Policy
                        </Link>
                      </p>
                    </div>
                    {errors.isAgree && touched.isAgree && (
                      <span className="flex items-center gap-x-1 text-danger">
                        <IoAlertCircle className="text-lg" />
                        <span>Required!</span>
                      </span>
                    )}
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
                      color={formData?._id ? 'warning' : 'primary'}
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
      </div>
    </Modal>
  );
}

const getOptionLabel = (option: any): any => (
  <div className="flex ">
    <img src={option.flag} alt={option.label} style={{ width: '20px', marginLeft: '5px' }} />
    <span className="ml-2">{option.label}</span>
  </div>
);
