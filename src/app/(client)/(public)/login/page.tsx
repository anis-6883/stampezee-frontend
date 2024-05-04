import { metaObject } from "@/config/site.config";
import LoginForm from "../components/LoginForm";

export const metadata = {
  ...metaObject("Login Page")
};

export default async function Page() {
  return (
    <section className='flex min-h-screen items-center justify-center bg-[#061626] p-5 text-white md:p-0'>
      <div className='w-[600px] rounded-md bg-[#1C2632] p-5 shadow-xl md:p-10'>
        <div className='p-2'>
          <img src='/images/logo2.png' className='m-auto w-60 my-5' alt='logo' />
          <h2 className='mb-5 text-center text-lg font-semibold'>Login</h2>
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
