import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import CriticalPaymentTable from './_components/CriticalPaymentTable';

const pageHeader = {
  title: 'Manage Critical Payments',
  breadcrumb: [
    {
      href: routes.privateRoutes.superAdmin.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Critical Payments',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page() {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');

  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CriticalPaymentTable timezone={data?.data?.general?.timezone?.label} />
    </div>
  );
}
