'use client';
import SubmitButton from '@/components/Formik/Button';
import DateRangePicker from '@/components/Formik/DateRange';
import InputField from '@/components/Formik/InputField';
import InputTextarea from '@/components/Formik/InputTextArea ';
import SelectField from '@/components/Formik/SelectField';
import StatusBar from '@/components/Formik/StatusBar';
import { routes } from '@/config/routes';
import { useBranchCategoryImageListQuery, useCreateStampMutation } from '@/features/retailer/stamp/stampApi';
import { IQueryType } from '@/types';
import getChangedFormData from '@/utils/getChangedFormData';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

export default function Create() {
  const [submitting, setSubmitting] = useState(false);
  const [createStamp] = useCreateStampMutation();
  const [optionsData, setOptionsData] = useState<any>();
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });

  const { data: responseData, isLoading: responseIsLoading } = useBranchCategoryImageListQuery({});
  useEffect(() => {
    if (responseData) {
      // const transformedOptionsData = responseData.data.map((item: any) => ({
      //   label: item.name,
      //   value: item._id,
      // }));
      setOptionsData(responseData.data);
    }
  }, [responseData]);

  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      // Convert values object to getChangedFormData
      const changedData = getChangedFormData(values, initialValues, ['_id']);

      const result = await createStamp(changedData).unwrap();
      router.push(routes.retailer.stamp.home);
      toast.success(result.data.message ?? 'Stamp created successfully!');
    } catch (error: any) {
      console.error('Failed to create Stamp:', error);
      toast.error(error.data.message ?? 'Failed to create Stamp. Please try again.');
      setSubmitting(false);
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    branchId: '',
    stampImageId: '',
    categoryId: '',
    title: '',
    description: '',
    rules: '',
    noOfStampsToCollect: 0,
    minPurchaseAmount: 0,
    rewardType: '',
    promotionReward: '',
    discountReward: 0,
    startedAt: '',
    expiredAt: '',
    status: true,
  };

  const validationSchema = Yup.object().shape({
    branchId: Yup.string().required('Branch is required'),
    stampImageId: Yup.string().required('Stamp Image is required'),
    categoryId: Yup.string().required('Category is required'),
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    rules: Yup.string().required('Rules are required'),
    noOfStampsToCollect: Yup.number().min(1, 'Number of stamps to collect must be at least 1').required('This field is required'),
    minPurchaseAmount: Yup.number().min(1, 'Minimum purchase amount cannot be negative').required('This field is required'),
    rewardType: Yup.mixed().oneOf(['promotion', 'discount']).required('Reward type is required'),
    promotionReward: Yup.string().required('Promotion reward is required when reward type is promotion'),
    discountReward: Yup.number().required('Discount reward is required when reward type is discount'),
    startedAt: Yup.date().required('Start date is required'),
    expiredAt: Yup.date().required('Expiration date is required'),
    status: Yup.boolean().required('This field is required'),
  });

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values) => {
          // same shape as initial values
          console.log(values, 'value submit');
          handleSubmit(values);
        }}
      >
        {({ errors, touched, setFieldValue, values }) => {
          // Object.keys(errors).forEach((key) => {
          //   toast.error((errors as any)[key] as string);
          // });
          // console.log(errors, 'errors');

          return (
            <Form className="mt-5 grid gap-4">
              <InputField name="title" label="Title" />
              <InputTextarea
                name="description"
                label="Description"
                placeholder="Write you message Description..."
                errors={errors.description}
                touched={touched.description}
                setFieldValue={setFieldValue}
                value={values.description}
              />
              <InputField name="rules" label="Rules" />

              <InputField name="noOfStampsToCollect" label="Number of Stamps to Collect" type="number" />
              <InputField name="minPurchaseAmount" label="Minimum Purchase Amount" type="number" />

              <SelectField
                name="branchId"
                label="Branch"
                options={optionsData?.branches.map((item: any) => ({
                  label: item.name,
                  value: item._id,
                }))}
                onChange={(option: { label: string; value: string }) => setFieldValue('branchId', option.value)}
                errors={errors.branchId}
                touched={touched.branchId}
              />

              <SelectField
                name="categoryId"
                label="Category"
                options={optionsData?.categories.map((item: any) => ({
                  label: item.name,
                  value: item._id,
                }))}
                onChange={(option: { label: string; value: string }) => setFieldValue('categoryId', option.value)}
                errors={errors.categoryId}
                touched={touched.categoryId}
              />
              <SelectField
                name="stampImageId"
                label="Stamp Image"
                options={optionsData?.stampImages.map((item: any) => ({
                  label: item.title,
                  value: item._id,
                }))}
                onChange={(option: { label: string; value: string }) => setFieldValue('stampImageId', option.value)}
                errors={errors.stampImageId}
                touched={touched.stampImageId}
              />

              <SelectField
                name="rewardType"
                label="Reward Type"
                options={[
                  { label: 'Promotion', value: 'promotion' },
                  { label: 'Discount', value: 'discount' },
                ]}
                onChange={(option: { label: string; value: string }) => setFieldValue('rewardType', option.value)}
                errors={errors.rewardType}
                touched={touched.rewardType}
              />
              {touched.rewardType && values.rewardType == 'promotion' && <InputField name="promotionReward" label="Promotion Reward" />}
              {touched.rewardType && values.rewardType == 'discount' && (
                <InputField name="discountReward" label="Discount Reward" type="number" />
              )}

              <DateRangePicker startDate={values.startedAt} endDate={values.expiredAt} setFieldValue={setFieldValue} />

              <StatusBar setFieldValue={setFieldValue} />
              <div className="flex justify-end">
                <SubmitButton isSubmitting={submitting} />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
