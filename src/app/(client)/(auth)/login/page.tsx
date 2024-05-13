import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import LoginForm from './components/LoginForm';

export const metadata = {
  ...metaObject('Login Page'),
};

export default async function Page() {
  return (
    <section className="relative flex min-h-screen items-center justify-center p-0 text-white sm:p-5 md:p-0">
      {/* Background Image */}
      <div className="absolute inset-0 z-[-1] bg-cover bg-center" style={{ backgroundImage: "url('./default/login-image.jpg')" }}></div>

      {/* Overlay */}
      <div className="z[-1] absolute inset-0 bg-black opacity-95"></div>

      {/* Content */}
      <div className="relative z-10 w-[600px] rounded-md  p-5 shadow-xl md:p-10">
        <div className="p-2">
          <img src="/images/logo.png" className="m-auto my-5 mt-0 w-28" alt="logo" />
          <h2 className="mb-5 text-center text-lg font-semibold">Login to StampEzee</h2>
          <LoginForm />
          <div className="mt-5">
            New user?{' '}
            <Link href="/register" className="text-red">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
