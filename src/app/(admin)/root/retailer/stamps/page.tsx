import { routes } from '@/config/routes';
import Index from './_components/Index';
import { metaObject } from '@/config/site.config';
import PageHeader from '@/components/page-header';

const pageHeader = {
  title: 'Manage Stamps',
  breadcrumb: [
    {
      href: routes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Stamps',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default function Page() {
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      {/* <div className="flex justify-end">
        <a className="mb-5 bg-red-500 p-2 text-white" role="button" href={routes.retailer.stamp.create}>
          create branch
        </a>
      </div> */}
      <Index />
    </div>
  );
}
