import { routes } from '@/config/routes';
import { useRetailerOtpVerifyMutation } from '@/features/auth/authApi';
import { userLoggedIn } from '@/features/auth/authSlice';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ImSpinner9 } from 'react-icons/im';
import { useDispatch } from 'react-redux';
import { Button, PinCode } from 'rizzui';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  pinCode: Yup.string().required('Pin code is required'),
});

const VarefyOtp = ({ setCurrentStep, currentStep }: { setCurrentStep: any; currentStep: any }) => {
  const [validation, setValidation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { replace } = useRouter();

  const dispatch = useDispatch();

  const [retailerOtpVerify, { data: loginResponse, isSuccess: loginSuccess, isError: isLoginError, error: loginError }] =
    useRetailerOtpVerifyMutation();

  useEffect(() => {
    if (isLoginError) {
      setSubmitting(false);
      if ('status' in loginError) {
        if (loginError.status === 401) {
          toast.error('Invalid Credentials!');
        } else {
          toast.error('Something went wrong! Try Again...');
        }
      }
    }

    if (loginSuccess) {
      if (loginResponse?.status) {
        toast.success('Login Successful!');
        dispatch(userLoggedIn({ ...loginResponse?.data, isLoggedIn: true }));

        let role = loginResponse.data.role;

        if (['retailer'].includes(role)) {
          replace(routes.retailer.dashboard);
        }
      } else {
        setSubmitting(false);
        //   toast.error(loginResponse?.message || 'Login failed.');
      }
    }
  }, [loginError, isLoginError, loginSuccess, loginResponse, replace, dispatch]);

  const handleSubmit = async (values: any) => {
    console.log(values, 'value data');

    setSubmitting(true); // Set submitting to true while the request is in progress
    retailerOtpVerify(values);
    // try {
    //   const response = await axiosBackendUrl.post('/api/retailer/otp-verify', values); // POST request with form values
    //   if (response.data.status === 200) {
    //     toast.success(response.data.message);

    //     replace(routes.retailer.dashboard);
    //   } else {
    //     toast.success(response.data.message);
    //     // setValidation(response.data.message);
    //   }
    //   //   setCurrentStep(0); // Move to the next step after successful submission
    // } catch (error: any) {
    //   if (error.response) {
    //     toast.error(error.response.data.message || 'An error occurred while submitting the form.');
    //   } else {
    //     toast.error('An error occurred while submitting the form.');
    //   }
    //   setSubmitting(false); // Prevent form submission
    //   console.error('Error:', error); // Log any errors
    // } finally {
    //   setValidation('');
    //   setSubmitting(false); // Prevent form submission
    // }
  };
  const resendOtp = async () => {
    try {
      const response = await axiosBackendUrl.get('/api/retailer/resend-otp'); // POST request with form values
      console.log('Response:', response.data); // Log the response data

      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || 'An error occurred while submitting the form.');
      } else {
        toast.error('An error occurred while submitting the form.');
      }
    } finally {
    }
  };

  return (
    <>
      <Formik
        initialValues={{ pinCode: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          if (values.pinCode.length != 6) {
            setValidation('Pin code must be up to 6 digits');
            setSubmitting(false); // Prevent form submission
            return;
          }
          handleSubmit({ otp: values.pinCode });
        }}
      >
        {({ values, setFieldValue, handleSubmit, errors, touched }) => (
          <Form onSubmit={handleSubmit}>
            <div>
              <Field name="pinCode">
                {({ field, form }: any) => (
                  <div>
                    <PinCode
                      length={6}
                      center={true}
                      setValue={(value) => {
                        setFieldValue(field.name, value);
                        form.setFieldTouched(field.name, true, false); // Mark the field as touched manually
                      }}
                    />
                    {validation && <div className="text-red-600">{validation}</div>}
                    {touched.pinCode && errors.pinCode && <div className="text-red-600">{errors.pinCode}</div>}
                  </div>
                )}
              </Field>
            </div>
            <div className="mt-5 justify-end">
              <Button
                color="primary"
                type="submit"
                className="flex w-full items-center justify-center text-sm font-semibold disabled:bg-[#1d58d8]"
                size="xl"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center gap-x-2">
                    Requesting... <ImSpinner9 className="animate-spin text-base" />
                  </span>
                ) : (
                  <span>Finish</span>
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <button onClick={resendOtp}>Resent OTP</button>
      {currentStep === 1 && <Button onClick={() => setCurrentStep(0)}>Reset</Button>}
    </>
  );
};

export default VarefyOtp;
