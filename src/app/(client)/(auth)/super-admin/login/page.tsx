import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import LoginForm from './components/LoginForm';

export const metadata = {
  ...metaObject('Login Page'),
};

export default async function Page() {
  return (
    <>
      <LoginForm />
    </>
  );
}
