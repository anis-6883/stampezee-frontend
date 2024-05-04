import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import CreateUser from '../_components/CreateUser';

const pageHeader = {
  title: 'Create A User',
  breadcrumb: [
    {
      href: routes.admin.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.admin.user.home,
      name: 'Users',
    },
    {
      name: 'Create',
    },
  ],
};

export const metadata = {
  ...metaObject('User Management'),
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}></PageHeader>
      <CreateUser />
    </>
  );
}
