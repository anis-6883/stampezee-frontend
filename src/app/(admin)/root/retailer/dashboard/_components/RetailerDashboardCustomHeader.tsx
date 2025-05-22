'use client';
import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { useGetAllStampsQuery } from '@/features/retailer/stamp/stampApi';
import cn from '@/hooks/class-names';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi2';
import { Title } from 'rizzui';
import DatePicker from '@/components/Formik/DatePicker';
import { IoCloseCircleSharp } from 'react-icons/io5';

const RetailerDashboardCustomHeader = ({ title, setDateRange, dateRange }: { title: string; setDateRange: any; dateRange: string }) => {
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

  return (
    <header className={cn('mb-3 pt-2 @container xs:-mt-2 lg:mb-7')}>
      <div className="flex flex-col @lg:flex-row @lg:items-center @lg:justify-between">
        <Title as="h2" className="mb-2 text-[22px] lg:text-2xl 4xl:text-[26px]">
          {title}
        </Title>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h5 className="text-base font-medium">Filter by Date :</h5>
            {/* date picker */}
            <div className="relative">
              {/* close button */}
              {dateRange.length > 0 && (
                <div className="absolute -right-1 -top-2 text-lg font-semibold">
                  <IoCloseCircleSharp onClick={() => setDateRange('')} className="cursor-pointer text-2xl text-[#dc2626]" />
                </div>
              )}
              <DatePicker value={dateRange} range={true} changeHandler={setDateRange} />
            </div>
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
