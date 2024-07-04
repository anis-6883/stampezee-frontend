import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import CouponTable from './_components/CouponTable';

const pageHeader = {
  title: 'Manage Coupons',
  breadcrumb: [
    {
      href: routes.superAdmin.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Coupons',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page() {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');

  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CouponTable offset={data?.data?.general?.timezone?.value} />
    </div>
  );
}
