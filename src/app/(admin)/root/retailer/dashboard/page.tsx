import PageHeader from '@/components/page-header';
import { metaObject } from '@/config/site.config';
import { getTranslations } from 'next-intl/server';
import BranchStatsTable from './_components/BranchStatsTable';
import RewardCollectStats from './_components/RewardCollectStats';
import StateCardView from './_components/StateCardView';

const pageHeader = {
  title: 'Retailer Dashboard',
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page() {
  const t = await getTranslations('RetailerDashboard');

  return (
    <>
      <PageHeader title={t('title')} />
      <StateCardView className="2xl:mb-8 mb-5" />
      <div className="mb-5 grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-6">
          <RewardCollectStats />
        </div>
      </div>
      <BranchStatsTable />
    </>
  );
}
