'use client';
import Button from '@/components/Formik/Button';
import DatePicker from '@/components/Formik/DatePicker';
import { routes } from '@/config/routes';
import { useGetAllStampsQuery } from '@/features/retailer/stamp/stampApi';
import cn from '@/hooks/class-names';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { HiPlus } from 'react-icons/hi2';
import { IoCalendarOutline } from 'react-icons/io5';
import { LuFilterX } from 'react-icons/lu';
import { Title, Tooltip } from 'rizzui';
import BranchFilter from './BranchFilter';
import { useAllBranchQuery } from '@/features/retailer/branch/branchApi';

const RetailerDashboardCustomHeader = ({
  value,
  setValue,
  title,
  setDateRange,
  dateRange,
}: {
  title: string;
  setDateRange: any;
  dateRange: string;
  value: string[];
  setValue: any;
}) => {
  const {
    data: allBranches,
    // isLoading,
    // isFetching,
  } = useAllBranchQuery({
    page: 1,
    limit: 100,
    // ...searchQuery,
  });

  const options =
    allBranches?.data?.docs.map((branch: any) => ({
      id: branch._id,
      label: branch.name,
      address: branch.address.name,
      status: branch.status,
      value: branch._id,
      disabledBySystem: branch?.disabledBySystem,
    })) ?? [];

  const tStamp = useTranslations('RetailerStamp');
  const { data: session }: any = useSession();

  const { data } = useGetAllStampsQuery({ page: 1, limit: 100 });
  // console.log(session, data);

  // console.log(value);
  const checkedDisableStampBtn = () => {
    if (!session?.user?.plan) {
      return true;
    } else if (data?.data.totalDocs >= session?.user?.totalStamp) {
      return true;
    }
    return false;
  };

  // handlers:
  const handleResetFilters = () => {
    setValue([]);
    setDateRange('');
  };

  return (
    <header className={cn('mb-3 pt-2 @container xs:-mt-2 lg:mb-7')}>
      <div className="flex flex-col @lg:flex-row @lg:items-center @lg:justify-between">
        <Title as="h2" className="mb-2 text-[22px] lg:text-2xl 4xl:text-[26px]">
          {title}
        </Title>

        <div className="flex items-center gap-4">
          {/* filter  wrapper*/}
          <div className="flex flex-shrink-0 items-center gap-2 rounded-md bg-gray-100 px-4 py-3">
            {/* title */}
            <h5 className="text-nowrap text-base font-medium">Filters :</h5>
            {/* filter */}
            <BranchFilter options={options} value={value} setValue={setValue} />

            {/* date filter */}
            <div className="relative">
              <DatePicker
                prefix={<IoCalendarOutline className="text-xl" />}
                className="text-sm placeholder:text-[13px]"
                value={dateRange}
                range={true}
                changeHandler={setDateRange}
              />
            </div>

            {/* clear filter button */}
            <Tooltip
              color="danger"
              className={`bg-danger text-white`}
              size="sm"
              placement="top"
              content={'Clear Filter'}
              arrowClassName={`fill-danger`}
            >
              <button onClick={handleResetFilters} className="flex size-10 items-center justify-center rounded-md bg-[#ef4444]">
                <LuFilterX className="size-5 text-white" />
              </button>
            </Tooltip>
          </div>

          <Link className="inline-block" href={routes.privateRoutes.retailer.stamp.create}>
            <Button
              disabled={checkedDisableStampBtn()}
              className="!mb-0 w-full"
              color="danger"
              text={tStamp('addNewStamp')}
              preIcon={<HiPlus className="text-base" />}
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default RetailerDashboardCustomHeader;
