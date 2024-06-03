import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi';
import Button from '../../_components/Button';
import BranchTable from './_components/BranchTable';

const pageHeader = {
  title: 'Manage Branches',
  breadcrumb: [
    {
      href: routes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Branches',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <div className="mb-5 flex justify-end">
        <Link href={routes.retailer.branch.create}>
          <Button text="Add New Branch" preIcon={<HiPlus className="text-base" />} />
        </Link>
      </div>

      <BranchTable />
    </>
  );
}
