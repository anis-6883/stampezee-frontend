import cn from '@/hooks/class-names';
import { Title } from 'rizzui';
import DatePicker from '@/components/Formik/DatePicker';
import React, { SetStateAction } from 'react';

interface Props {
  title?: string;
  setDateRange?: React.Dispatch<SetStateAction<Date[] | null>>;
}

const DashboardHeader = ({ title, setDateRange }: Props) => {
  return (
    <header className={cn('mb-3 pt-2 @container xs:-mt-2 lg:mb-7')}>
      <div className="flex flex-col gap-3 @lg:flex-row @lg:items-center @lg:justify-between">
        <div className="flex items-center gap-5">
          <div>
            <Title as="h2" className="mb-2 text-[22px] lg:text-2xl 4xl:text-[26px]">
              {title}
            </Title>
          </div>
        </div>

        {/* Date picker */}
        <div className="flex items-center gap-3">
          <p className="text-black-70 text-nowrap text-sm font-semibold md:text-base">Filter By Date:</p>
          <DatePicker range={true} changeHandler={setDateRange} />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
