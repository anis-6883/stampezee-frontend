import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import CustomerTable from './_components/CustomerTable';

export const metadata = { ...metaObject('Manage Retailer Details') };

export default async function Page({ params }: any) {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');
  const { id } = params;
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
        href: routes.privateRoutes.superAdmin.retailer.details(id),
        name: 'Details',
      },
      {
        name: 'Customers',
      },
    ],
  };
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CustomerTable id={id} timezone={data?.data?.general?.timezone?.label} />
    </div>
  );
}
