import Button from '@/components/Formik/Button';
import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { FaRegPaperPlane } from 'react-icons/fa6';
import BillingTable from './_components/BillingTable';

const pageHeader = {
  title: 'Billing',
  breadcrumb: [
    {
      href: routes.privateRoutes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Billing',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page() {
  const t = await getTranslations('RetailerBilling');
  pageHeader.breadcrumb[0].name = t('Dashboard');
  pageHeader.breadcrumb[1].name = t('Billing');
  pageHeader.title = t('Billing');

  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="flex items-center justify-end">
          <Link href={routes.privateRoutes.retailer.refund}>
            <Button className="" color="danger" text={'Refunds'} postIcon={<FaRegPaperPlane className="text-base" />} />
          </Link>
        </div>
      </PageHeader>

      <BillingTable />
    </div>
  );
}
