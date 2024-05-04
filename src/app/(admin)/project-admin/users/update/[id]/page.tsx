import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import CreateUser from '../../_components/CreateUser';

const pageHeader = {
  title: 'Update User',
  breadcrumb: [
    {
      href: routes.admin.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.admin.user.home,
      name: 'User',
    },
    {
      name: 'Update',
    },
  ],
};

export const metadata = {
  ...metaObject('Manage User'),
};

export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}></PageHeader>
      <CreateUser edit id={id} />
    </>
  );
}
