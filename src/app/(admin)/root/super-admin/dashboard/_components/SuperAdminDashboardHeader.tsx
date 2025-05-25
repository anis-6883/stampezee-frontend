'use client';

import cn from '@/hooks/class-names';
import { Title } from 'rizzui';
import DatePicker from '@/components/Formik/DatePicker';
import { IoCloseCircleSharp } from 'react-icons/io5';

const SuperAdminDashboardHeader = ({ title, setDateRange, dateRange }: { title: string; setDateRange: any; dateRange: string }) => {
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
        </div>
      </div>
    </header>
  );
};

export default SuperAdminDashboardHeader;
