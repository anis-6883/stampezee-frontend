import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import PaymentDetails from '../_components/PaymentDetails';

const pageHeader = {
  title: 'Payments Details',
  breadcrumb: [
    {
      href: routes.privateRoutes.superAdmin.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.privateRoutes.superAdmin.payment.home,
      name: 'Payments',
    },
    {
      name: 'Details',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page({ params }: any) {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');
  const { id } = params;

  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <PaymentDetails id={id} offset={data?.data?.general?.timezone?.value} stripePublishKey={data?.data?.stripe?.stripePublishKey} />
    </div>
  );
}
