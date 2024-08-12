'use client'; // Error components must be Client Components

import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import Link from 'next/link';
import { useEffect } from 'react';
import { IoHomeOutline } from 'react-icons/io5';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[#DC2626]">500</h1>
        <p className="mb-10 mt-4 text-2xl">Internal Server Error!</p>
        <Link className="inline-block" href={routes.publicRoutes.home}>
          <Button className="!m-0 text-center" color="danger" text="Go to Home" preIcon={<IoHomeOutline className="text-base" />} />
        </Link>
      </div>
    </div>
  );
}
