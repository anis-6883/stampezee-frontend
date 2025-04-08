'use client';

import { routes } from '@/config/routes';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { Button as RizButton, Stepper } from 'rizzui';
import ForgotEmailInput from './ForgotEmailInput';
import ForgetOtpInput from './ForgotOtpInput';
import ForgotPasswordForm from './ForgotPasswordForm';

export default function ForgotPassword() {
  const t = useTranslations('ForgotPasswordPage');
  const [currentTab, setCurrentTab] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <section className="">
      <div className="text-gray-900 sm:w-[500px]">
        <Link href={routes.publicRoutes.home}>
          <img src="/images/logo.png" className="mx-auto w-28 pb-5" alt="logo" />
        </Link>

        <h1 className="pb-6 text-center text-xl font-bold xl:text-xl">{t('title')}</h1>

        <Stepper currentIndex={currentStep} className="w-full">
          <Stepper.Step title={<span className="text-gray-900">{t('stepOne')}</span>} />
          <Stepper.Step title={<span className="text-gray-900">{t('stepTwo')}</span>} />
          <Stepper.Step title={<span className="text-gray-900">{t('stepThree')}</span>} />
        </Stepper>

        <div className="mt-7 flex space-x-4">
          {currentStep === 3 && (
            <RizButton
              onClick={() => {
                setCurrentStep(0);
                setCurrentTab(0);
              }}
            >
              Reset
            </RizButton>
          )}
        </div>
      </div>
      <div className="card bg-white sm:w-[500px]">
        <ForgotEmailInput currentTab={currentTab} setCurrentTab={setCurrentTab} setCurrentStep={setCurrentStep} />
        <ForgetOtpInput currentTab={currentTab} setCurrentTab={setCurrentTab} setCurrentStep={setCurrentStep} />
        <ForgotPasswordForm currentTab={currentTab} />
      </div>
    </section>
  );
}
