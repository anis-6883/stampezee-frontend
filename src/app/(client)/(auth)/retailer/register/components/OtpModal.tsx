import Button from '@/components/Formik/Button';
import { ROLE } from '@/config/constants';
import { routes } from '@/config/routes';
import { SerializedError } from '@/features/api/apiSlice';
import { useRetailerOtpVerifyMutation, useRetailerResendOtpMutation } from '@/features/auth/authApi';
import { userLoggedIn } from '@/features/auth/authSlice';
import { useTimer } from '@/hooks/use-timer';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { SetStateAction, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { HiMiniXCircle } from 'react-icons/hi2';
import { ImSpinner9 } from 'react-icons/im';
import { useDispatch } from 'react-redux';
import { ActionIcon, Modal, PinCode, Title } from 'rizzui';

export default function OtpModal({ modalState, setModalState }: { setModalState: (state: boolean) => void; modalState: boolean }) {
  const [otp, setOtp] = useState<SetStateAction<string | number | undefined>>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendOtpSubmitting, setResendOtpSubmitting] = useState(false);
  const [otpValidMsg, setOtpValidMsg] = useState('');
  const [verifyEmail, { data: verifyResponse, error: verifyError, isSuccess: verifySuccess }] = useRetailerOtpVerifyMutation();
  const [resendOtp, { error: resendError, isSuccess: resendSuccess }] = useRetailerResendOtpMutation();
  const { replace } = useRouter();
  const dispatch = useDispatch();
  const { reset, timer } = useTimer(120);

  useEffect(() => {
    if (modalState) {
      reset();
    }
  }, [modalState]);

  useEffect(() => {
    if (verifyError) {
      const myError = verifyError as SerializedError;
      setIsSubmitting(false);
      toast.error(myError?.data?.message || 'Something went wrong!');
    }

    if (verifySuccess) {
      setIsSubmitting(false);
      dispatch(userLoggedIn(verifyResponse?.data));
      toast.success(verifyResponse?.message || 'Otp verified & Login successfully!');

      signIn('credentials', {
        userData: JSON.stringify(verifyResponse?.data),
        redirect: false,
      }).then((callback) => {
        if (callback?.error) {
          setIsSubmitting(false);
          toast.error(callback?.error);
        }
        if (callback?.ok && !callback?.error) {
          if (verifyResponse?.data?.role === ROLE.RETAILER) {
            replace(routes.retailer.dashboard);
          }
        }
      });
    }
  }, [dispatch, replace, verifyError, verifyResponse, verifySuccess]);

  useEffect(() => {
    if (resendError) {
      setResendOtpSubmitting(false);
      console.log('resendError: ', resendError);
      const myError = resendError as SerializedError;
      toast.error(myError?.data?.message || 'Something went wrong!');
    }
    if (!resendError && resendSuccess) {
      setResendOtpSubmitting(false);
      toast.success('OTP sent on your email!');
      reset();
    }
  }, [resendError, resendSuccess]);

  // Handler Otp Submit
  const otpSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setOtpValidMsg('');

    if (typeof otp === 'string') {
      if (otp.length < 6) {
        setIsSubmitting(false);
        setOtpValidMsg('Please, Enter Valid OTP!');
      } else {
        verifyEmail({ otp });
      }
    } else {
      setOtpValidMsg('Please, Enter Valid OTP!');
    }
  };

  // Handle Resend Otp Submit
  const handleResendOtp = () => {
    setResendOtpSubmitting(true);
    resendOtp(undefined);
  };

  return (
    <Modal isOpen={modalState} onClose={() => setModalState(true)}>
      <div className="m-auto px-7 pb-8 pt-6">
        <div className="mb-7 flex items-center justify-between">
          <Title as="h3">OTP Verification!</Title>
          {timer > 0 && <span className="font-bold text-danger">{timer} sec</span>}
          <ActionIcon size="sm" variant="text" onClick={() => setModalState(false)}>
            <HiMiniXCircle className="text-2xl text-danger" />
          </ActionIcon>
        </div>
        <p className="my-5 text-sm font-medium">
          We sent an OTP to your email. You have 2 minutes to complete this verification. Thank you!
        </p>
        <div className="grid gap-x-5 gap-y-6">
          <form onSubmit={otpSubmitHandler}>
            <div>
              <PinCode inputClassName="text-lg" length={6} setValue={(input) => setOtp(input)} type="number" />
            </div>
            {otpValidMsg && <p className="mt-4 px-1 text-center font-medium text-danger">{otpValidMsg}</p>}
            <div className="mt-10 grid grid-cols-12 items-center">
              <div className="col-span-8">
                <p className="flex select-none items-center text-sm font-medium">
                  Didn{"'"}t get any otp yet?{' '}
                  <span
                    className={`${resendOtpSubmitting && 'pointer-events-none'} ml-1 cursor-pointer font-semibold text-danger`}
                    onClick={handleResendOtp}
                  >
                    Resend OTP
                  </span>
                  {resendOtpSubmitting && <ImSpinner9 size={20} className="ml-1 animate-spin" />}
                </p>
              </div>
              <div className="col-span-4 text-right"></div>
            </div>

            <div className="mt-10">
              <Button
                color="danger"
                className="w-full"
                type="submit"
                text="Submit"
                postIcon={<BsCheck2Circle className="text-base" />}
                isSubmitting={isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
