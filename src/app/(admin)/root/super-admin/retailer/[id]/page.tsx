import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import RetailerDetails from '../_components/RetailerDetails';

const pageHeader = {
  title: 'Manage Retailer Details',
  breadcrumb: [
    {
      href: routes.privateRoutes.superAdmin.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.privateRoutes.superAdmin.retailer.home,
      name: 'Retailers',
    },
    {
      name: 'Details',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page({ params }: any) {
  const { id } = params;
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <RetailerDetails id={id} timezone={data?.data?.general?.timezone?.label} />
    </div>
  );
}
