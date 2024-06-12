import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import LoginForm from './components/LoginForm';

export const metadata = {
  ...metaObject('Login Page'),
};

export default async function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-900">
      <div className="m-0 grid max-w-screen-xl grid-cols-6 rounded-lg bg-white shadow sm:m-10 md:grid-cols-12">
        <div className="col-span-6 p-10">
          <Link href="/">
            <img src="/images/logo.png" className="mx-auto w-28" alt="logo" />
          </Link>

          <div className="mt-8 px-16">
            <h1 className="text-center text-xl font-bold xl:text-xl">Admin Login</h1>

            <LoginForm />
          </div>
        </div>
        <div className="col-span-6 hidden md:block">
          <div className="h-full w-full ">
            <img src="/images/admin-login.png" className="h-full w-full rounded-r-lg" alt="logo" />
          </div>
        </div>
      </div>
    </div>
  );
}
