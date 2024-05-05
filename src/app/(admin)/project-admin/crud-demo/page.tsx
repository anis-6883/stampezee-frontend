import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi2';

const pageHeader = {
  title: 'Manage Videos',
  breadcrumb: [
    {
      href: routes.admin.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Manage Videos',
    },
  ],
};

export const metadata = {
  ...metaObject('Manage Videos'),
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link href={routes.admin.dashboard} className="btn btn-primary btn-sm text-white">
          <HiPlus className="text-lg" /> Add New Video
        </Link>
      </PageHeader>
    </>
  );
}
