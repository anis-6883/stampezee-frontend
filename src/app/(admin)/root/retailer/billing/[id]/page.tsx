import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';

const pageHeader = {
  title: 'Subscription Details',
  breadcrumb: [
    {
      href: routes.privateRoutes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.privateRoutes.retailer.billing.home,
      name: 'Billing',
    },
    {
      name: 'Subscription Details',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page() {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');
  //   offset={data?.data?.general?.timezone?.value}

  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <div className="">
        <div className="mb-3.5 @5xl:mb-5">
          <h3 className="text-base font-semibold @7xl:text-lg">Balance</h3>
        </div>
        <div className="space-y-6 rounded-xl border border-gray-200 px-5 py-6 @5xl:space-y-7 @5xl:p-7">
          <div className="flex justify-between font-medium">
            Total Order <span>$5275.00</span>
          </div>
          <div className="flex justify-between font-medium">
            Total Return <span>$350.00</span>
          </div>
          <div className="flex justify-between font-medium">
            Paid By Customer <span>$3000.00</span>
          </div>
          <div className="flex justify-between font-medium">
            Refunded <span>$350.00</span>
          </div>
          <div className="flex justify-between font-medium">
            Balance <span>$4975.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
