import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
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

export default function Page() {
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CouponTable />
    </div>
  );
}
