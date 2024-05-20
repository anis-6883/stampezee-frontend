import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

const pageHeader = {
  title: 'Update Content',
  breadcrumb: [
    {
      href: routes.admin.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.admin.dashboard,
      name: 'ContentManagement',
    },
    {
      name: 'Update',
    },
  ],
};

export const metadata = {
  ...metaObject('Manage Content'),
};

export default function Page({ params: { id } }: { params: { id: number } }) {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}></PageHeader>
    </>
  );
}
