import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import Register from './components/Register';

export const metadata = {
  ...metaObject('Register Page'),
};

export default async function Page() {
  return (
    <section className="relative flex min-h-screen items-center justify-center p-0 text-white sm:p-5 md:p-0">
      {/* Background Image */}
      <div className="absolute inset-0 z-[-1] bg-cover bg-center" style={{ backgroundImage: "url('./default/login-image.jpg')" }}></div>

      {/* Overlay */}
      <div className="z[-1] absolute inset-0 bg-black opacity-95"></div>

      {/* Content */}
      <div className="relative z-10 w-11/12 rounded-md shadow-xl  sm:w-[90%] sm:p-5 md:w-[750px] md:p-10">
        <div className="">
          <img src="/images/logo.png" className="m-auto my-5 mt-0 w-20" alt="logo" />
          <h2 className="mb-5 text-center text-lg ">Register to StampEzee</h2>
          <Register />
          <div className="mt-5">
            By signing up, I agree to
            <Link href="/login" className="text-red">
              Terms of Service
            </Link>
            <span> and </span>
            <Link href="/login" className="text-red">
              Privacy Policy.
            </Link>
          </div>
          <div className="mt-5">
            Already have an account?
            <Link href="/login" className="py-4 text-red">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
