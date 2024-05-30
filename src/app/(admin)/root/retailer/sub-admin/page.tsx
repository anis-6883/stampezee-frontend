'use client';

import { routes } from '@/config/routes';
import Index from './_components/Index';

export default function Page() {
  return (
    <div>
      <div className="flex justify-end">
        <a className="mb-5 bg-red-500 p-2 text-white" role="button" href={routes.retailer.sub_admin.create}>
          create branch
        </a>
      </div>
      <br />
      <br />
      <Index />
    </div>
  );
}
