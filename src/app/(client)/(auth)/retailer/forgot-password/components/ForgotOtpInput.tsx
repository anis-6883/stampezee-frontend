import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { SerializedError } from '@/features/api/apiSlice';
import { useRetailerForgetResendOtpMutation, useRetailerVerifyForgetPasswordOtpMutation } from '@/features/auth/authApi';
import { useTimer } from '@/hooks/use-timer';
import { ErrorResponse, isFetchBaseQueryError } from '@/utils/check-base-query-error';
import { SetStateAction } from 'jotai';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { HiOutlineArrowSmLeft } from 'react-icons/hi';
import { ImSpinner9 } from 'react-icons/im';
import { PinCode } from 'rizzui';

export default function ForgetOtpInput({
  currentTab,
  setCurrentStep,
  setCurrentTab,
}: {
  currentTab: number;
  setCurrentStep: any;
  setCurrentTab: any;
}) {
  //   const { user } = useSelector((state: RootState) => state.authSlice);

  const [otp, setOtp] = useState<SetStateAction<string | number | undefined>>('');
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [resendOtpSubmitting, setResendOtpSubmitting] = useState(false);
  const [otpValidMsg, setOtpValidMsg] = useState('');

  const [retailerVerifyForgetPasswordOtp, { data: responseData, isSuccess, isError, error: verifyOtpError }] =
    useRetailerVerifyForgetPasswordOtpMutation();

  const [retailerForgetResendOtp, { error: resendError, isSuccess: resendSuccess }] = useRetailerForgetResendOtpMutation();

  const { reset, timer } = useTimer(120);

  useEffect(() => {
    if (currentTab === 1) {
      reset();
    }
  }, [currentTab, reset]);

  // Handle Otp Response
  useEffect(() => {
    if (isError) {
      setOtpSubmitting(false);
      if (isFetchBaseQueryError(verifyOtpError)) {
        const errorMessage = (verifyOtpError.data as ErrorResponse)?.message || 'Something went wrong! Try Again';
        toast.error(errorMessage);
      } else {
        toast.error('Something went wrong! Try Again');
      }
    }

    if (isSuccess) {
      if (!responseData?.status) {
        setOtpSubmitting(false);
        setOtpValidMsg(responseData?.message);
      } else {
        if (responseData?.status) {
          toast.success(responseData?.message);
        } else {
          toast.error(responseData?.message);
        }

        setCurrentStep((prev: number) => prev + 1);
        setCurrentTab((prev: number) => prev + 1);
      }
    }
  }, [isError, isSuccess, responseData, setCurrentStep, setCurrentTab, verifyOtpError]);

  // Handle Resend Response
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
  }, [resendError, resendSuccess, reset]);

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
        retailerVerifyForgetPasswordOtp({
          otp,
        });
      }
    } else {
      setOtpValidMsg('Please, Enter Valid OTP!');
    }
  };

  // Handle Resend Otp Submit
  const handleResendOtp = () => {
    setResendOtpSubmitting(true);
    retailerForgetResendOtp(undefined);
  };

  return (
    <div className={`card-body p-3 ${currentTab === 1 ? '' : 'hidden'}`}>
      <h2 className="mb-5 text-center text-xl font-semibold">Verify OTP</h2>
      <div className="label mb-4">
        <span className="text-sm font-semibold ">
          We sent an OTP to your Email. You have 2 minutes to complete this verification. Thank you!
        </span>
      </div>
      <form onSubmit={otpSubmitHandler}>
        <div>
          <PinCode length={6} setValue={(input) => setOtp(input)} type="number" />
        </div>
        {otpValidMsg && <p className="text-error mt-4 px-1 text-center font-medium text-danger">{otpValidMsg}</p>}
        <div className="mt-10 grid grid-cols-12 items-center">
          <div className="col-span-8">
            <p className="flex select-none items-center font-medium">
              Didn{"'"}t get any otp yet?
              {timer > 0 ? (
                <span className="ml-1 font-bold text-danger">
                  {`${Math.floor(timer / 60)}`.padStart(2, '0') + ':' + `${timer % 60}`.padStart(2, '0')}
                </span>
              ) : (
                <span
                  className={`${resendOtpSubmitting && 'pointer-events-none'} ml-1 cursor-pointer font-semibold text-danger`}
                  onClick={handleResendOtp}
                >
                  Resend OTP
                </span>
              )}
              {resendOtpSubmitting && <ImSpinner9 size={20} className="ml-1 animate-spin" />}
            </p>
          </div>
        </div>
        <div className="card-actions mt-5 justify-end">
          <Button
            color="danger"
            className="w-full"
            type="submit"
            text="Next"
            postIcon={<BsCheck2Circle className="text-base" />}
            isSubmitting={otpSubmitting}
          />
        </div>
      </form>
      <div className="mt-5 flex select-none items-center justify-center">
        <Link href={routes.publicRoutes.retailerLogin} className="flex items-center transition-all duration-150 ease-in hover:text-danger">
          <HiOutlineArrowSmLeft className="mr-3 text-xl" /> <span className="font-semibold">Go to Login</span>
        </Link>
      </div>
    </div>
  );
}
