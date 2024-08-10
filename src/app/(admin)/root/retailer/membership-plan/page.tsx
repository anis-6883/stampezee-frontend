import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import { Plans } from './component/Plans';

const pageHeader = {
  title: 'Manage Membership Plans',
  breadcrumb: [
    {
      href: routes.privateRoutes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Membership Plan',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page() {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');
  return (
    <div>
      <div className="">
        <div className="grid-cols mx-auto grid bg-white lg:grid-cols-12 ">
          <div className="-lg col-span-12 m-2 ">
            <Plans stripeInfo={data?.data?.stripe} />
          </div>
          {/* <div className="col-span-4 m-2 mx-auto mt-4 w-[100%] rounded-lg p-5 shadow-lg lg:w-[80%] lg:p-2">
            <InvoiceHistory />
            <NotificationStatus />
            <ActiveSubscriptions />
          </div> */}
        </div>
      </div>
    </div>
  );
}
