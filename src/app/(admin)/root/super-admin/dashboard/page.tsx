import PageHeader from '@/components/page-header';
import { metaObject } from '@/config/site.config';
import RetailerAndCustomerStats from './_components/RetailerAndCustomerStats';
import Revenue from './_components/Revenue';
import SignUpStatus from './_components/SignUpStatus';
import StateCardView from './_components/StateCardView';
import TopBranchTable from './_components/TopBranchTable';

const pageHeader = {
  title: 'Super Admin Dashboard',
};

export const metadata = { ...metaObject(pageHeader.title) };

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} />
      <StateCardView className="2xl:mb-8 mb-5" />

      <div className="mb-5 grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-6">
          <Revenue />
        </div>
        <SignUpStatus className="col-span-12 md:col-span-6" />
      </div>
      <TopBranchTable />
      <RetailerAndCustomerStats className="my-5" />
    </>
  );
}
