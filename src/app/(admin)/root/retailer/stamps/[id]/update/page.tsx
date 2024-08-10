import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import UpdateStamp from '../../_components/UpdateStamp';

const pageHeader = {
  title: 'Manage Stamps',
  breadcrumb: [
    {
      href: routes.privateRoutes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.privateRoutes.retailer.stamp.home,
      name: 'Stamps',
    },
    {
      name: 'Update',
    },
  ],
};

export default async function Page({ params }: any) {
  const { id } = params;
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');

  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <UpdateStamp Id={id} offset={data?.data?.general?.timezone?.value} />
    </div>
  );
}
