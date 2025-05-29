'use client';

import cn from '@/hooks/class-names';
import { Title } from 'rizzui';
import DatePicker from '@/components/Formik/DatePicker';
import { IoCloseCircleSharp } from 'react-icons/io5';
import { IoMdClose } from 'react-icons/io';

const SuperAdminDashboardHeader = ({ title, setDateRange, dateRange }: { title: string; setDateRange: any; dateRange: string }) => {
  return (
    <header className={cn('mb-3 pt-2 @container xs:-mt-2 lg:mb-7')}>
      <div className="flex flex-col @lg:items-center @lg:justify-between md:flex-row">
        <Title as="h2" className="mb-2 text-[22px] lg:text-2xl 4xl:text-[26px]">
          {title}
        </Title>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h5 className="text-base font-medium">Filter by Date :</h5>
            {/* date picker */}
            <div className="relative overflow-hidden rounded-md">
              {/* close button */}
              {dateRange.length > 0 && (
                <div
                  onClick={() => setDateRange('')}
                  className="absolute right-0 top-0 flex h-full w-9 cursor-pointer items-center justify-center bg-[#dc2626] text-lg font-semibold"
                >
                  <IoMdClose className="cursor-pointer text-white" />
                </div>
              )}
              <DatePicker
                className="min-w-60 pr-8 text-sm placeholder:text-[12px]"
                value={dateRange}
                range={true}
                changeHandler={setDateRange}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SuperAdminDashboardHeader;
