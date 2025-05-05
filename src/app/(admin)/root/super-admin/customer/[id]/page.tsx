import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import CustomerDetails from '../_components/CustomerDetails';

const pageHeader = {
  title: 'Manage Customer Details',
  breadcrumb: [
    {
      href: routes.privateRoutes.superAdmin.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.privateRoutes.superAdmin.customer.home,
      name: 'Customers',
    },
    {
      name: 'Details',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page({ params }: any) {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');
  const { id } = params;
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CustomerDetails id={id} timezone={data?.data?.general?.timezone?.label} />
    </div>
  );
}
