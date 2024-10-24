import PageHeader from '@/components/page-header';
import StatusIndicator from '@/components/StatusIndicator';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import { getTranslations } from 'next-intl/server';
import CustomerTable from './_components/CustomerTable';

const pageHeader = {
  title: 'Manage Customer',
  breadcrumb: [
    {
      href: routes.privateRoutes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Customer',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page() {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');
  const t = await getTranslations('RetailerCustomer');
  pageHeader.breadcrumb[0].name = t('dashboard');
  pageHeader.breadcrumb[1].name = t('customer');
  pageHeader.title = t('title');

  return (
    <div>
      <PageHeader title={pageHeader?.title} breadcrumb={pageHeader?.breadcrumb} />
      <div className="mb-5 flex justify-between">
        <StatusIndicator />
      </div>

      <CustomerTable offset={data?.data?.general?.timezone?.value} />
    </div>
  );
}
