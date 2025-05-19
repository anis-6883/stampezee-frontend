import PageHeader from '@/components/page-header';
import { metaObject } from '@/config/site.config';
import RetailerAndCustomerStats from './_components/RetailerAndCustomerStats';
import TopBranchTable from './_components/TopBranchTable';
import DashboardTopSection from './_components/DashboardTopSection';

const pageHeader = {
  title: 'Super Admin Dashboard',
};

export const metadata = { ...metaObject(pageHeader.title) };

export default function Page() {
  return (
    <>
      {/* <PageHeader title={pageHeader.title} /> */}
      <DashboardTopSection title={pageHeader.title} />
      <TopBranchTable />
      <RetailerAndCustomerStats className="my-5" />
    </>
  );
}
