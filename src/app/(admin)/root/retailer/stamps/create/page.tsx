import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import CreateStamp from '../_components/CreateStamp';

const pageHeader = {
  title: 'Create A Stamp',
  breadcrumb: [
    {
      href: routes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.retailer.stamp.home,
      name: 'Stamps',
    },
    {
      name: 'Create',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default function page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CreateStamp />
    </>
  );
}
