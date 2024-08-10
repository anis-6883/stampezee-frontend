import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import UpdateBranch from '../../_components/UpdateBranch';

const pageHeader = {
  title: 'Update A Branch',
  breadcrumb: [
    {
      href: routes.privateRoutes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.privateRoutes.retailer.branch.home,
      name: 'Branches',
    },
    {
      name: 'Update',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page({ params }: any) {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');
  const { id } = params;

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <UpdateBranch branchId={id} googleMapsApiKey={data?.data?.googleMap?.googleMapsApiKey} />
    </>
  );
}
