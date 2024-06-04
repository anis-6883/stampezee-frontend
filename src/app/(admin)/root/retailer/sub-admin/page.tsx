import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import SubAdminTable from './_components/SubAdminTable';

const pageHeader = {
  title: 'Manage Sub-Admins',
  breadcrumb: [
    {
      href: routes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Sub-Admins',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      {/* <div className="mb-5 flex justify-end">
        <Link href={routes.retailer.sub_admin.create}>
          <Button text="Add New Sub-Admin" preIcon={<HiPlus className="text-base" />} />
        </Link>
      </div> */}

      <SubAdminTable />
    </>
  );
}
