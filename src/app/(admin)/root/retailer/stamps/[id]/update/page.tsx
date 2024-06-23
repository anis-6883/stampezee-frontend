import { routes } from '@/config/routes';
import Update from '../../_components/Update';
import PageHeader from '@/components/page-header';

const pageHeader = {
  title: 'Manage Stamps',
  breadcrumb: [
    {
      href: routes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Stamps',
    },
    {
      name: 'Update',
    },
  ],
};

export default function Page({ params }: any) {
  const { id } = params;

  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <Update Id={id} />
    </div>
  );
}
