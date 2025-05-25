import { metaObject } from '@/config/site.config';
import RetailerAndCustomerStats from './_components/RetailerAndCustomerStats';
import SuperAdminDashboardTopSection from './_components/SuperAdminDashboardTopSection';

const pageHeader = {
  title: 'Super Admin Dashboard',
};

export const metadata = { ...metaObject(pageHeader.title) };

export default function Page() {
  return (
    <>
      {/* <PageHeader title={pageHeader.title} /> */}
      <SuperAdminDashboardTopSection title={pageHeader.title} />
    </>
  );
}
