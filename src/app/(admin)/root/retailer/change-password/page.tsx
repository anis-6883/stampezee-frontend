import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import ChangePasswordForm from './_components/ChangePasswordForm';

const pageHeader = {
  title: 'Change Password',
  breadcrumb: [
    {
      href: routes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Retailer Change Password',
    },
  ],
};

export default function Page() {
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ChangePasswordForm />
    </div>
  );
}
