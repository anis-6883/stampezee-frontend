'use client';
import React from 'react';
import { Stepper } from 'rizzui';
import Register from './Register';
import VarefyOtp from './VarefyOtp';

export default function App() {
  const [currentStep, setCurrentStep] = React.useState(0);
  return (
    <>
      <div className="min-h[100vh] m-auto flex items-center justify-center py-20">
        <div className="w-full sm:w-[575px]">
          <Stepper currentIndex={currentStep}>
            <Stepper.Step title="Step 1" description="Register" />
            <Stepper.Step title="Step 2" description="Verify Your OTP" />
          </Stepper>

          {currentStep === 0 && <Register currentStep={currentStep} setCurrentStep={setCurrentStep} />}
          {currentStep === 1 && <VarefyOtp currentStep={currentStep} setCurrentStep={setCurrentStep} />}
        </div>
      </div>
    </>
  );
}
