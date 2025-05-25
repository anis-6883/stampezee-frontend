'use client';

import Button from '@/components/Formik/Button';
import { RootState } from '@/features/store';
import { useGetGeneralSettingsQuery, useUpdateGeneralSettingsMutation } from '@/features/super-admin/general-settings/generalSettingsApi';
import { IGeneralSetting, IGeneralSettingData } from '@/types';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { VscSourceControl } from 'react-icons/vsc';
import { BsCheck2Circle } from 'react-icons/bs';
import { FaAws, FaCcStripe } from 'react-icons/fa6';
import { HiOutlineCog8Tooth } from 'react-icons/hi2';
import { LiaMapMarkedAltSolid } from 'react-icons/lia';
import { PiBellRinging, PiNoteDuotone, PiWarningBold } from 'react-icons/pi';
import { TbMail } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import EmailSettingsForm from './EmailSettingsForm';
import GeneralSettingsForm from './GeneralSettingsForm';
import GoogleMapForm from './GoogleMapForm';
import NotificationSettingsForm from './NotificationSettingsForm';
import PrivacyAndPolicyForm from './PrivacyAndPolicyForm';
import S3BucketForm from './S3BucketForm';
import StripeSettingsForm from './StripeSettingsForm';
import TabButtonItem from './TabButtonItem';
import TermsAndConditionForm from './TermsAndConditionForm';
import VersionControlForm from './VersionControlForm';
import * as Yup from 'yup';

function updateGeneralSetting(generalSetting: IGeneralSetting) {
  const updatedObject = {
    general: {
      companyName: generalSetting?.data?.general?.companyName || '',
      contactEmail: generalSetting?.data?.general?.contactEmail || '',
      dialCode: generalSetting?.data?.general?.dialCode || '',
      phone: generalSetting?.data?.general?.phone || '',
      country: generalSetting?.data?.general?.country || '',
      province: generalSetting?.data?.general?.province || '',
      city: generalSetting?.data?.general?.city || '',
      postalCode: generalSetting?.data?.general?.postalCode || '',
      address: generalSetting?.data?.general?.address || '',
      timezone: generalSetting?.data?.general?.timezone
        ? {
            ...generalSetting?.data?.general?.timezone,
            label: `${generalSetting?.data?.general?.timezone?.label}`,
          }
        : {},
      androidDownloadLink: generalSetting?.data?.general?.androidDownloadLink || '',
      iosDownloadLink: generalSetting?.data?.general?.iosDownloadLink || '',
      facebook: generalSetting?.data?.general?.facebook || '',
      instagram: generalSetting?.data?.general?.instagram || '',
      linkedin: generalSetting?.data?.general?.linkedin || '',
      tiktok: generalSetting?.data?.general?.tiktok || '',
    },
    appVersion: {
      ios: {
        name: generalSetting?.data?.appVersion?.ios?.name || '',
        version: generalSetting?.data?.appVersion?.ios?.version || 0,
        forceUpdate: generalSetting?.data?.appVersion?.ios?.forceUpdate || true,
        appUrl: generalSetting?.data?.appVersion?.ios?.appUrl || '',
        buttonText: generalSetting?.data?.appVersion?.ios?.buttonText || '',
        description: generalSetting?.data?.appVersion?.ios?.description || '',
      },
      android: {
        name: generalSetting?.data?.appVersion?.android?.name || '',
        version: generalSetting?.data?.appVersion?.android?.version || 0,
        forceUpdate: generalSetting?.data?.appVersion?.android?.forceUpdate || false,
        appUrl: generalSetting?.data?.appVersion?.android?.appUrl || '',
        buttonText: generalSetting?.data?.appVersion?.android?.buttonText || '',
        description: generalSetting?.data?.appVersion?.android?.description || '',
      },
    },
    mail: {
      host: generalSetting?.data?.mail?.host || '',
      port: generalSetting?.data?.mail?.port || '',
      username: generalSetting?.data?.mail?.username || '',
      password: generalSetting?.data?.mail?.password || '',
    },
    notification: {
      firebaseServerKey: generalSetting?.data?.notification?.firebaseServerKey || '',
      firebaseTopics: generalSetting?.data?.notification?.firebaseTopics || '',
    },
    s3Bucket: {
      awsRegion: generalSetting?.data?.s3Bucket?.awsRegion || '',
      awsAccessKeyId: generalSetting?.data?.s3Bucket?.awsAccessKeyId || '',
      awsSecretAccessKey: generalSetting?.data?.s3Bucket?.awsSecretAccessKey || '',
      awsBucketName: generalSetting?.data?.s3Bucket?.awsBucketName || '',
    },
    stripe: {
      stripeSecretKey: generalSetting?.data?.stripe?.stripeSecretKey || '',
      stripePublishKey: generalSetting?.data?.stripe?.stripePublishKey || '',
      stripeWebhookSecretKey: generalSetting?.data?.stripe?.stripeWebhookSecretKey || '',
      planChangeCost: generalSetting?.data?.stripe?.planChangeCost || '',
      refundableThreshold: generalSetting?.data?.stripe?.refundableThreshold || '',
      taxTitle: generalSetting?.data?.stripe?.taxTitle || '',
      taxCost: generalSetting?.data?.stripe?.taxCost || '',
      taxStatus: generalSetting?.data?.stripe?.taxStatus || 'on',
    },
    googleMap: {
      googleMapsApiKey: generalSetting?.data?.googleMap?.googleMapsApiKey || '',
    },
    page: {
      policy: generalSetting?.data?.page?.policy || '',
      terms: generalSetting?.data?.page?.terms || '',
    },
  };

  return updatedObject;
}

function cleanTimezoneLabel(obj: any) {
  if (obj?.general?.timezone?.label) {
    obj.general.timezone.label = obj.general.timezone.label.replace(/\s*\(.*\)$/, '');
  }
}

export default function SettingsMainForm() {
  const { accessToken } = useSelector((state: RootState) => state.authSlice);
  const { data: generalSetting, isLoading: generalSettingLoading } = useGetGeneralSettingsQuery(undefined, { skip: !accessToken });

  console.log(generalSetting);
  const [updateGeneralSettings, { data: updatedData, isSuccess, isError: updatingError }] = useUpdateGeneralSettingsMutation();
  const [currentTab, setCurrentTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialValues, setInitialValues] = useState<IGeneralSettingData>({
    general: {
      companyName: '',
      dialCode: '',
      phone: '',
      country: '',
      province: '',
      city: '',
      postalCode: '',
      address: '',
      timezone: {},
      androidDownloadLink: '',
      iosDownloadLink: '',
      facebook: '',
      linkedin: '',
      instagram: '',
      tiktok: '',
      contactEmail: '',
    },
    appVersion: {
      ios: {
        name: '',
        version: 0,
        forceUpdate: false,
        appUrl: '',
        buttonText: '',
        description: '',
      },
      android: {
        name: '',
        version: 0,
        forceUpdate: false,
        appUrl: '',
        buttonText: '',
        description: '',
      },
    },
    mail: {
      host: '',
      port: '',
      username: '',
      password: '',
    },
    notification: {
      firebaseServerKey: '',
      firebaseTopics: '',
    },
    s3Bucket: {
      awsRegion: '',
      awsAccessKeyId: '',
      awsSecretAccessKey: '',
      awsBucketName: '',
    },
    stripe: {
      stripeSecretKey: '',
      stripePublishKey: '',
      stripeWebhookSecretKey: '',
      planChangeCost: '',
      refundableThreshold: '',
      taxTitle: '',
      taxCost: '',
      taxStatus: 'on',
    },
    googleMap: {
      googleMapsApiKey: '',
    },
    page: {
      policy: '',
      terms: '',
    },
  });

  useEffect(() => {
    if (updatingError) {
      setIsSubmitting(false);
      toast.error('Something went wrong!');
    }

    if (isSuccess) {
      setIsSubmitting(false);
      setInitialValues(updateGeneralSetting(updatedData));
      toast.success('General Setting Updated Successfully!');
    }
  }, [isSuccess, updatedData, updatingError]);

  useEffect(() => {
    if (generalSetting) {
      setInitialValues(updateGeneralSetting(generalSetting));
    }
  }, [generalSetting]);

  const tabs = [
    {
      name: 'General Settings',
      icon: <HiOutlineCog8Tooth className="text-xl" />,
    },
    {
      name: 'App Version',
      icon: <VscSourceControl className="text-xl" />,
    },
    {
      name: 'Email Settings',
      icon: <TbMail className="text-xl" />,
    },
    {
      name: 'Notification Settings',
      icon: <PiBellRinging className="text-xl" />,
    },
    {
      name: 'AWS S3 Bucket Settings',
      icon: <FaAws className="text-xl" />,
    },
    {
      name: 'Stripe Settings & Threshold',
      icon: <FaCcStripe className="text-xl" />,
    },
    {
      name: 'Google Map',
      icon: <LiaMapMarkedAltSolid className="text-xl" />,
    },
    {
      name: 'Terms and Condition',
      icon: <PiWarningBold className="text-xl" />,
    },
    {
      name: 'Privacy and Policy',
      icon: <PiNoteDuotone className="text-xl" />,
    },
  ];

  const handleTabChange = (tab: number) => {
    setCurrentTab(tab);
  };

  // Submit Handler
  const handleSubmit = async (values: any) => {
    // console.log(values);
    setIsSubmitting(true);
    // cleanTimezoneLabel(values);
    updateGeneralSettings(values);
  };

  const validationSchema = Yup.object({
    appVersion: Yup.object({
      ios: Yup.object({
        version: Yup.number()
          .typeError('Version must be a number')
          .integer('Version must be an integer')
          .min(0, 'Version cannot be negative')
          .required('Version is required'),
        description: Yup.string().min(5, 'At least 5 characters!').max(300, 'maximum 300 characters!'),
      }),
      android: Yup.object({
        version: Yup.number()
          .typeError('Version must be a number')
          .integer('Version must be an integer')
          .min(0, 'Version cannot be negative')
          .required('Version is required'),
        description: Yup.string().min(5, 'At least 5 characters!').max(300, 'maximum 300 characters!'),
      }),
    }),
  });
  return (
    <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {({ values, setFieldValue }) => {
        return (
          <Form>
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-12">
              <div className="col-span-1 flex flex-col gap-y-3 md:col-span-3">
                {tabs.map((tab: any, index) => (
                  <TabButtonItem
                    key={index}
                    tab={tab?.name}
                    icon={tab?.icon}
                    onClick={() => handleTabChange(index)}
                    active={currentTab === index}
                  />
                ))}
              </div>

              <div className="col-span-1 w-full rounded-lg border border-gray-200 bg-white p-2 shadow md:col-span-9">
                <div hidden={currentTab === 0 ? false : true}>
                  <GeneralSettingsForm generalSettingLoading={generalSettingLoading} />
                </div>

                <div hidden={currentTab === 1 ? false : true}>
                  <VersionControlForm />
                </div>
                <div hidden={currentTab === 2 ? false : true}>
                  <EmailSettingsForm />
                </div>

                <div hidden={currentTab === 3 ? false : true}>
                  <NotificationSettingsForm />
                </div>

                <div hidden={currentTab === 4 ? false : true}>
                  <S3BucketForm />
                </div>

                <div hidden={currentTab === 5 ? false : true}>
                  <StripeSettingsForm />
                </div>

                <div hidden={currentTab === 6 ? false : true}>
                  <GoogleMapForm />
                </div>

                <div hidden={currentTab === 7 ? false : true}>
                  <TermsAndConditionForm values={values} setFieldValue={setFieldValue} />
                </div>

                <div hidden={currentTab === 8 ? false : true}>
                  <PrivacyAndPolicyForm values={values} setFieldValue={setFieldValue} />
                </div>
              </div>
            </div>

            <div className="mt-6 flex w-full justify-end">
              <Button
                color="danger"
                text="Update"
                type="submit"
                isSubmitting={isSubmitting}
                postIcon={<BsCheck2Circle className="text-base" />}
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
