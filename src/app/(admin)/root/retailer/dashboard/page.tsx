import PageHeader from '@/components/page-header';
import { metaObject } from '@/config/site.config';
import StateCardView from './_components/StateCardView';

const pageHeader = {
  title: 'Retailer Dashboard',
};

export const metadata = { ...metaObject(pageHeader.title) };

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} />
      <StateCardView className="2xl:mb-8 mb-5" />
    </>
  );
}
