import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import RetailerTable from './_components/RetailerTable';

import { HiPlus } from 'react-icons/hi2';
import Button from '../../_components/Button';

const pageHeader = {
  title: 'Manage Retailers',
  breadcrumb: [
    {
      href: routes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Retailers',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default function Page() {
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <div className="mb-5 flex justify-end">
        <Link href={routes.superAdmin.retailer.create}>
          <Button text="Add New Retailer" preIcon={<HiPlus className="text-base" />} />
        </Link>
      </div>
      <RetailerTable />
    </div>
  );
}
