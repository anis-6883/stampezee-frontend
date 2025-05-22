import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import SuperAdminRefundTopSection from './_components/SuperAdminRefundTopSection';

const pageHeader = {
  title: 'Manage Refunds',
  breadcrumb: [
    {
      href: routes.privateRoutes.superAdmin.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Refunds',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page() {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');

  return (
    <div>
      <SuperAdminRefundTopSection pageHeader={pageHeader} timezone={data?.data?.general?.timezone?.label} />
    </div>
  );
}
