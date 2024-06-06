'use client';

import React from 'react';
import { Stepper } from 'rizzui';

export default function App() {
  const [currentStep, setCurrentStep] = React.useState(0);
  return (
    <>
      <div className="min-h[100%] m-auto flex h-[100vh] items-center justify-center py-20">
        <div className="w-full rounded-lg bg-white px-2 py-4 sm:w-[678px] md:px-10">
          <img src="../../images/logo.png" className="mx-auto mb-[25px] w-16" alt="" />
          <Stepper currentIndex={currentStep}>
            <Stepper.Step title="Step 1" description="Register" />
            <Stepper.Step title="Step 2" description="Verify Your OTP" />
          </Stepper>

          {/* {currentStep === 0 && <Register currentStep={currentStep} setCurrentStep={setCurrentStep} />}
          {currentStep === 1 && <VarefyOtp currentStep={currentStep} setCurrentStep={setCurrentStep} />} */}
        </div>
      </div>
    </>
  );
}
