import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import RegisterForm from './components/RegisterForm';

export const metadata = {
  ...metaObject('Register Page'),
};

export default async function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-900">
      <div className="m-0 grid max-w-screen-xl grid-cols-6 rounded-lg bg-white shadow sm:m-10 md:grid-cols-12">
        <div className="col-span-6 px-5 py-5">
          <div>
            <img src="/images/logo.png" className="mx-auto w-24" alt="logo" />
          </div>

          <div className="mt-4 px-3">
            <h1 className="text-center text-xl font-bold xl:text-xl">Store Registration</h1>

            <RegisterForm />

            <div className="mt-5 text-center">
              Already have an account?{' '}
              <Link href="/retailer/login" className="font-semibold">
                Sign In
              </Link>{' '}
              Here
            </div>
          </div>
        </div>
        <div className="col-span-6 hidden md:block">
          <div className="h-full w-full ">
            <img src="/images/login-page.jpeg" className="h-full w-full rounded-r-lg" alt="logo" />
          </div>
        </div>
      </div>
    </div>
  );
}
