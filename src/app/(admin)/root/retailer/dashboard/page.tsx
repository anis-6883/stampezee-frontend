import PageHeader from '@/components/page-header';
import { metaObject } from '@/config/site.config';
import { getUserCurrency } from '@/services/currency';
import { getTranslations } from 'next-intl/server';
import BranchStatsTable from './_components/BranchStatsTable';
import StateCardView from './_components/StateCardView';

const pageHeader = {
  title: 'Retailer Dashboard',
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page() {
  const t = await getTranslations('RetailerDashboard');
  const currency = await getUserCurrency();

  return (
    <>
      <PageHeader title={t('title')} />
      <StateCardView className="2xl:mb-8 mb-5" currency={currency} />
      <BranchStatsTable currency={currency} />
    </>
  );
}
