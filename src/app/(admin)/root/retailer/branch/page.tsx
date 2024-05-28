'use client';

import { routes } from '@/config/routes';
import BranchTable from './_components/BranchTable';

export default function Page() {
  return (
    <div>
      <div className="flex justify-end">
        <a className="mb-5 bg-red-500 p-2 text-white" role="button" href={routes.retailer.branch.create}>
          create branch
        </a>
      </div>
      {/* <UserTable /> */}
      <br />
      <br />
      <BranchTable />
    </div>
  );
}
