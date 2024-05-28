import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi2';
import UserTable from './_components/UserTable';

const pageHeader = {
  title: 'Users',
  breadcrumb: [
    {
      href: routes.admin.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'User',
    },
  ],
};

export const metadata = {
  ...metaObject('Users Management'),
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.admin.user.create}
          className="hover:bg-primary-dark flex items-center space-x-2 rounded-md bg-primary px-3 py-2 text-white transition-all duration-300"
        >
          <HiPlus className="text-lg" /> Add User
        </Link>
      </PageHeader>
      <UserTable />
    </>
  );
}
