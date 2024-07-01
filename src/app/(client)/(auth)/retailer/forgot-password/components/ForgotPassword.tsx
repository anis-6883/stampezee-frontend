'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button as RizButton, Stepper } from 'rizzui';
import ForgotEmailInput from './ForgotEmailInput';
import ForgetOtpInput from './ForgotOtpInput';
import ForgotPasswordForm from './ForgotPasswordForm';

export default function ForgotPassword() {
  const [currentTab, setCurrentTab] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <section className="">
      <div className="w-[500px] text-gray-900">
        <Link href="/">
          <img src="/images/logo.png" className="mx-auto w-28 pb-5" alt="logo" />
        </Link>

        <h1 className="pb-6 text-center text-xl font-bold xl:text-xl">Forgot Password</h1>

        <Stepper currentIndex={currentStep} className="w-full">
          <Stepper.Step title={<span className="text-gray-900">Step 1</span>} color="primary" />
          <Stepper.Step title={<span className="text-gray-900">Step 2</span>} color="primary" />
          <Stepper.Step title={<span className="text-gray-900">Step 3</span>} color="primary" />
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
      <div className="card w-[500px] bg-white">
        <ForgotEmailInput currentTab={currentTab} setCurrentTab={setCurrentTab} setCurrentStep={setCurrentStep} />
        <ForgetOtpInput currentTab={currentTab} setCurrentTab={setCurrentTab} setCurrentStep={setCurrentStep} />
        <ForgotPasswordForm currentTab={currentTab} setCurrentTab={setCurrentTab} setCurrentStep={setCurrentStep} />
      </div>
    </section>
  );
}
