'use client';

import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiCheckCircle } from 'react-icons/fi';
import { PiSpinnerLight } from 'react-icons/pi';
import * as Yup from 'yup';
import AboutUsForm from './AboutUsForm';
import AppVersionControlForm from './AppVersionControlForm';
import GeneralSettingsForm from './GeneralSettingsForm';
import LogoAndIconForm from './LogoAndIconForm';
import NotificationSettingsForm from './NotificationSettingsForm';
import PopUpBannerSettings from './PopUpBannerSettings';
import PrivacyAndPolicyForm from './PrivacyAndPolicyForm';
import S3BucketForm from './S3BucketForm';
import TabButtonItem from './TabButtonItem';
import TermsAndConditionForm from './TermsAndConditionForm';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '@/features/store';
import Button from '../../../_components/Button';
import { useUpdateGeneralSettingsMutation, useGetGeneralSettingsQuery } from '@/features/super-admin/general-settings/generalSettingsApi';
import { BsCheck2Circle } from 'react-icons/bs';

export default function SettingsMainForm() {
  const { data: generalSetting, isLoading, isError } = useGetGeneralSettingsQuery(undefined);

  const [updateGeneralSettings, { data: updatedData, isSuccess, isError: updatingError }] = useUpdateGeneralSettingsMutation();

  const [currentTab, setCurrentTab] = useState(0);
  const [siteLogo, setSiteLogo] = useState(null);
  const [siteIcon, setSiteIcon] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialValues, setInitialValues] = useState({
    general: {
      timezone: {},
      companyName: '',
      siteTitle: '',
      androidDownloadLink: '',
      iosDownloadLink: '',
      contactEmail: '',
      emailUsername: '',
      emailPassword: '',
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
    page: {
      aboutUs: '',
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
      // setSiteLogo(null);
      // setSiteIcon(null);
      setIsSubmitting(false);
      setInitialValues((prevValues) => ({
        ...prevValues,
        ...(updatedData as { data: any }).data,
      }));
      toast.success('General Setting Updated Successfully!');
    }
  }, [isSuccess, updatedData, updatingError]);

  useEffect(() => {
    if (generalSetting) {
      setInitialValues((prevValues) => ({
        ...prevValues,
        ...generalSetting?.data,
      }));
    }
  }, [generalSetting]);

  const tabs = [
    'General Settings',
    'Notification Settings',
    'AWS S3 Bucket Settings',
    'Terms and Condition',
    'Privacy and Policy',
    'About Us',
  ];

  const handleTabChange = (tab: number) => {
    setCurrentTab(tab);
  };

  const validationSchema = Yup.object().shape({
    contactEmail: Yup.string().email('Invalid Email!'),
  });

  // Submit Handler
  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);

    delete values?._id;
    delete values?.createdAt;
    delete values?.updatedAt;

    updateGeneralSettings(values);
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
      {({ values, setFieldValue }) => (
        <Form>
          <div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="col-span-1 flex flex-col gap-y-3 md:col-span-3">
                {tabs.map((tab, index) => (
                  <TabButtonItem key={index} tab={tab} onClick={() => handleTabChange(index)} active={currentTab === index} />
                ))}
              </div>
              <div className="col-span-1 w-full rounded-lg border border-gray-200 bg-white p-5 shadow md:col-span-9">
                <div hidden={currentTab === 0 ? false : true}>
                  <GeneralSettingsForm setFieldValue={setFieldValue} values={values} />
                </div>

                <div hidden={currentTab === 1 ? false : true}>
                  <NotificationSettingsForm />
                </div>

                <div hidden={currentTab === 2 ? false : true}>
                  <S3BucketForm />
                </div>

                <div hidden={currentTab === 3 ? false : true}>
                  <TermsAndConditionForm values={values} setFieldValue={setFieldValue} />
                </div>

                <div hidden={currentTab === 4 ? false : true}>
                  <PrivacyAndPolicyForm values={values} setFieldValue={setFieldValue} />
                </div>

                <div hidden={currentTab === 5 ? false : true}>
                  <AboutUsForm values={values} setFieldValue={setFieldValue} />
                </div>
              </div>
            </div>
            <div className="mt-6 flex w-full justify-end">
              <Button
                color="warning"
                text="Update"
                type="submit"
                isSubmitting={isSubmitting}
                postIcon={<BsCheck2Circle className="text-base" />}
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
