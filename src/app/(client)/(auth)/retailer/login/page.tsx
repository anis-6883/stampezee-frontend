import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import LoginForm from './components/LoginForm';

export const metadata = {
  ...metaObject('Login Page'),
};

export default async function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-gray-900 lg:bg-gray-100">
      <div className="m-0 grid max-w-screen-xl grid-cols-6 rounded-lg bg-white shadow-none sm:m-10 md:grid-cols-12 lg:shadow">
        <div className="col-span-6 p-10">
          <Link href="/">
            <img src="/images/logo.png" className="mx-auto w-28" alt="logo" />
          </Link>

          <div className="mt-8 px-1 lg:px-16">
            <h1 className="text-center text-xl font-bold xl:text-xl">Sign In</h1>

            <LoginForm />

            <div className="mt-8 text-center">
              New Retailer?{' '}
              <Link href="/retailer/register" className="font-semibold">
                Sign Up
              </Link>{' '}
              Here
            </div>
          </div>
        </div>
        <div className="col-span-6 hidden md:block lg:block">
          <div className="flex h-full items-center justify-center">
            <img src="/images/retailer-login.png" className="w-3/4 rounded-r-lg" alt="logo" />
          </div>
        </div>
      </div>
    </div>
  );
}
