import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import UpdateProfileForm from './_components/UpdateProfileForm';

const pageHeader = {
  title: 'Manage Profile',
  breadcrumb: [
    {
      href: routes.privateRoutes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Retailer Profile',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default function Page() {
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <UpdateProfileForm />
    </div>
  );
}
