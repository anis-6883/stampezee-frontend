import Button from '@/components/Formik/Button';
import PageHeader from '@/components/page-header';
import StatusIndicator from '@/components/shared/StatusIndicator';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi';
import BranchTable from './_components/BranchTable';

const pageHeader = {
  title: 'Manage Branches',
  breadcrumb: [
    {
      href: routes.privateRoutes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Branches',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page() {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <div className="mb-5 flex flex-col justify-between gap-y-3 md:flex-row md:gap-0">
        <StatusIndicator />
        <Link href={routes.privateRoutes.retailer.branch.create}>
          <Button className="!m-0 w-full" color="danger" text="Add New Branch" preIcon={<HiPlus className="text-base" />} />
        </Link>
      </div>

      <BranchTable offset={data?.data?.general?.timezone?.value} />
    </>
  );
}
