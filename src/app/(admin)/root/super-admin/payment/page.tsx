import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import PaymentTable from './_components/PaymentTable';
import SuperAdminPaymentTopSection from './_components/SuperAdminPaymentTopSection';

const pageHeader = {
  title: 'Manage Payments',
  breadcrumb: [
    {
      href: routes.privateRoutes.superAdmin.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Payments',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page() {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');

  return (
    <div>
      <SuperAdminPaymentTopSection pageHeader={pageHeader} timezone={data?.data?.general?.timezone?.label} />
    </div>
  );
}
