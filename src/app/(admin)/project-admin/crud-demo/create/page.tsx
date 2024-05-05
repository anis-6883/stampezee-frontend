import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

const pageHeader = {
  title: 'Create A Content',
  breadcrumb: [
    {
      href: routes.admin.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.admin.dashboard,
      name: 'Content Management',
    },
    {
      name: 'Create',
    },
  ],
};

export const metadata = {
  ...metaObject('Manage Content'),
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}></PageHeader>
      <h1>Create CMS</h1>
    </>
  );
}
