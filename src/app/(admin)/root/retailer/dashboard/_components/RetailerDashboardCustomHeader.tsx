'use client';
import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { useGetAllStampsQuery } from '@/features/retailer/stamp/stampApi';
import cn from '@/hooks/class-names';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi2';
import { Title, Tooltip } from 'rizzui';
import DatePicker from '@/components/Formik/DatePicker';
import { useState } from 'react';
import BranchFilter from './BranchFilter';
import { LuFilterX } from 'react-icons/lu';
import { FaCalendarAlt } from 'react-icons/fa';
import { IoCalendarOutline } from 'react-icons/io5';

const RetailerDashboardCustomHeader = ({ title, setDateRange, dateRange }: { title: string; setDateRange: any; dateRange: string }) => {
  const options: any = [
    {
      label: 'Kacchi Bhai 1',
      address: 'Mohammadpur,Dhaka,Bangladesh',
      status: true,
      value: 'Kacchi Bhai 1',
    },
    {
      label: 'Kacchi Bhai 2',
      address: 'Mohakhali,Dhaka,Bangladesh',
      status: true,
      value: 'Kacchi Bhai 2',
    },
    {
      label: 'Kacchi Bhai 3',
      address: 'Mirpur,Dhaka,Bangladesh',
      status: false,
      value: 'Kacchi Bhai 3',
    },
  ];
  const [value, setValue] = useState([options[0].value]);
  const tStamp = useTranslations('RetailerStamp');
  const { data: session }: any = useSession();

  const { data } = useGetAllStampsQuery({ page: 1, limit: 100 });
  // console.log(session, data);

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
