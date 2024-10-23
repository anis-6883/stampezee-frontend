import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { getLocale } from 'next-intl/server';
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
  const locale = await getLocale();
  return (
    <div>
      <div className="">
        <div className="grid-cols mx-auto grid bg-white lg:grid-cols-12 ">
          <div className="-lg col-span-12 m-2 ">
            <Plans locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
