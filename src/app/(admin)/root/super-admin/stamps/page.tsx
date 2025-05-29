import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { getTranslations } from 'next-intl/server';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import SuperAdminStampsTopSection from './_components/SuperAdminStampsTopSection';
const pageHeader = {
  title: 'Manage Stamp Cards',
  breadcrumb: [
    {
      href: routes.privateRoutes.superAdmin.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Stamps',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page() {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');
  const t = await getTranslations('RetailerStamp');
  pageHeader.breadcrumb[0].name = t('dashboard');
  pageHeader.breadcrumb[1].name = t('stamps');
  pageHeader.title = t('title');
  return (
    <>
      <SuperAdminStampsTopSection pageHeader={pageHeader} timezone={data?.data?.general?.timezone?.label} />
    </>
  );
}
