import React, { SetStateAction, useState } from 'react';
import { HiMiniXCircle } from 'react-icons/hi2';
import { PiSpinnerLight } from 'react-icons/pi';
import { ActionIcon, Modal, PinCode, Title } from 'rizzui';

export default function OtpModal({ modalState, setModalState }: { setModalState: (state: boolean) => void; modalState: boolean }) {
  const [otp, setOtp] = useState<SetStateAction<string | number | undefined>>('');
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [resendOtpSubmitting, setResendOtpSubmitting] = useState(false);
  const [otpValidMsg, setOtpValidMsg] = useState('');

  // Handler Otp Submit
  const otpSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSubmitting(true);
    setOtpValidMsg('');

    if (typeof otp === 'string') {
      if (otp.length < 6) {
        setOtpSubmitting(false);
        setOtpValidMsg('Please, Enter Valid OTP!');
      } else {
        // verifyPhone({
        //   phone,
        //   otp,
        // });
      }
    } else {
      setOtpValidMsg('Please, Enter Valid OTP!');
    }
  };

  // Handle Resend Otp Submit
  const handleResendOtp = () => {
    setResendOtpSubmitting(true);

    // resendOtp({
    //   phone,
    //   context: 'verify_code',
    // });
  };

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(true)}>
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-7 flex items-center justify-between">
          <Title as="h3">OTP Verification!</Title>
          <ActionIcon size="sm" variant="text" onClick={() => setModalState(false)}>
            <HiMiniXCircle className="text-2xl text-danger" />
          </ActionIcon>
        </div>
        <div className="grid gap-x-5 gap-y-6">
          <form onSubmit={otpSubmitHandler}>
            <div>
              <PinCode length={6} setValue={(input) => setOtp(input)} />
            </div>
            {otpValidMsg && <p className="text-error mt-4 px-1 text-center font-medium">{otpValidMsg}</p>}
            <div className="mt-10 grid grid-cols-12 items-center">
              <div className="col-span-8">
                <p className="flex select-none items-center">
                  Didn{"'"}t get any otp yet?{' '}
                  <span
                    className={`${resendOtpSubmitting && 'pointer-events-none'} ml-1 cursor-pointer font-semibold text-primary`}
                    onClick={handleResendOtp}
                  >
                    Resend OTP
                  </span>
                  {resendOtpSubmitting && <PiSpinnerLight size={20} className="ml-1 animate-spin" />}
                </p>
              </div>
              <div className="col-span-4 text-right"></div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
