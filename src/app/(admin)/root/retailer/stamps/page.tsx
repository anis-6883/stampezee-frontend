import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi2';
import Button from '../../../../../components/Formik/Button';
import StampTable from './_components/StampTable';

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

export default async function Page() {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <div className="mb-5 flex justify-end">
        <Link href={routes.retailer.stamp.create}>
          <Button color="danger" text="Add New Stamp" preIcon={<HiPlus className="text-base" />} />
        </Link>
      </div>

      <StampTable offset={data?.data?.general?.timezone?.value} />
    </>
  );
}
