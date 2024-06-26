import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import UpdateProfileForm from './_components/UpdateProfileForm';

const pageHeader = {
  title: 'Manage Profile',
  breadcrumb: [
    {
      href: routes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Retailer Profile',
    },
  ],
};

export default function Page() {
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <UpdateProfileForm />
    </div>
  );
}
