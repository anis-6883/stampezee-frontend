import PageHeader from '@/components/page-header';
import { metaObject } from '@/config/site.config';
import { useTranslations } from 'next-intl';
import BranchStatsTable from './_components/BranchStatsTable';
import StateCardView from './_components/StateCardView';

const pageHeader = {
  title: 'Retailer Dashboard',
};

export const metadata = { ...metaObject(pageHeader.title) };

export default function Page() {
  const t = useTranslations('RetailerDashboard');
  return (
    <>
      <PageHeader title={t('title')} />
      <StateCardView className="2xl:mb-8 mb-5" />
      <BranchStatsTable />
    </>
  );
}
