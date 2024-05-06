import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi2';
import { Button } from 'rizzui';
import RetailerTable from './components/RetailerTable';

const pageHeader = {
  title: 'Manage Retailers',
  breadcrumb: [
    {
      href: routes.admin.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Manage Retailers',
    },
  ],
};

export const metadata = {
  ...metaObject('Manage Retailers'),
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link href={routes.admin.dashboard}>
          <Button variant="solid" color="primary" size="md" className="flex items-center gap-2">
            <HiPlus className="text-lg" /> Add New Retailer
          </Button>
        </Link>
      </PageHeader>
      <RetailerTable />
    </>
  );
}
