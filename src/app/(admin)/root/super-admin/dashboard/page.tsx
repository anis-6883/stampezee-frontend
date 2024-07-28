import PageHeader from '@/components/page-header';
import StateCardView from './_components/StateCardView';

const pageHeader = {
  title: 'Welcome to StampEzee',
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} />
      <StateCardView className="2xl:mb-8 mb-5" />
    </>
  );
}
