import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import AddOnsList from './_components/AddOnsList';
import OrderBalance from './_components/OrderBalance';
import OrderSummary from './_components/OrderSummary';
import SubscriptionList from './_components/SubscriptionList';

export const metadata = {
  ...metaObject('Checkout'),
};

export default async function Page() {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');
  console.log('dta', data?.data);
  return (
    <div className="mx-auto mt-20 w-full max-w-[1300px]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Checkout</h1>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold">Plans</h2>
            <p className="mb-6 text-gray-600">Select a subscription plan</p>
            {/* <div className="mb-6 border-l-4 border-blue-400 bg-blue-50 p-4">
              <p className="font-medium text-blue-700">Change Plan</p>
              <p className="text-blue-700">You will be billed immediately when switching plans</p>
            </div> */}
            <SubscriptionList />
            <div className="mt-6">
              <h2 className="mb-4 text-xl font-semibold">Add-Ons</h2>
              <p className="mb-6 text-gray-600">Select additional services</p>
              <div className="mb-6 border-l-4 border-blue-400 bg-blue-50 p-4">
                <p className="font-medium text-blue-700">Select Multiple Add on</p>
                <p className="text-blue-700">You can able to selected multiple add on</p>
              </div>
              <AddOnsList />
            </div>
          </div>
          <div>
            <OrderBalance />
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
            <OrderSummary stripeInfo={data?.data?.stripe} />
          </div>
        </div>
      </div>
    </div>
  );
}
