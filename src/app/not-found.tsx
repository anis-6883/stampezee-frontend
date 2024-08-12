import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import Link from 'next/link';
import { IoHomeOutline } from 'react-icons/io5';

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[#DC2626]">404</h1>
        <p className="mt-4 text-2xl">The page you requested was not found!</p>
        <p className="my-2 text-lg text-gray-600">
          Sorry! The page you were looking for could not be found. This page may have been moved or deleted.
        </p>
        <Link className="inline-block" href={routes.publicRoutes.home}>
          <Button className="!m-0 text-center" color="danger" text="Go to Home" preIcon={<IoHomeOutline className="text-base" />} />
        </Link>
      </div>
    </div>
  );
}
