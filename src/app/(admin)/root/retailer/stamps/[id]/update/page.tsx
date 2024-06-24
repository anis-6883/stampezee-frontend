import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import UpdateStamp from '../../_components/UpdateStamp';

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
      <UpdateStamp Id={id} />
    </div>
  );
}
