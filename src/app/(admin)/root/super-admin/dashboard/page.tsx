import PageHeader from '@/components/page-header';
import { metaObject } from '@/config/site.config';
import SignUpStatus from './_components/SignUpStatus';
import StateCardView from './_components/StateCardView';

const pageHeader = {
  title: 'Super Admin Dashboard',
};

export const metadata = { ...metaObject(pageHeader.title) };

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} />
      <StateCardView className="2xl:mb-8 mb-5" />
      <div className="grid grid-cols-12">
        <SignUpStatus className="col-span-6" />
      </div>
    </>
  );
}
