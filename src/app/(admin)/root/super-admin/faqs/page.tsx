import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import FaqTable from './_components/FaqTable';

const pageHeader = {
  title: 'Manage Faqs',
  breadcrumb: [
    {
      href: routes.superAdmin.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Faq',
    },
  ],
};

export default function Page() {
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <FaqTable />
    </div>
  );
}
