'use client';
import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { useGetAllStampsQuery } from '@/features/retailer/stamp/stampApi';
import cn from '@/hooks/class-names';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi2';
import { MultiSelect, MultiSelectOption, Title } from 'rizzui';
import DatePicker from '@/components/Formik/DatePicker';
import { IoCloseCircleSharp } from 'react-icons/io5';
import { useState } from 'react';

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

  function renderBranchFilterOptions(option: any, selected: any) {
    return (
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <input checked={selected} type="checkbox" name="" id="" />
          <div className="space-y-1">
            <h6 className="text-sm">{option?.label}</h6>
            <p className="text-xs">{option?.address}</p>
          </div>
        </div>
        {/* indicator */}
        <div className={`size-3 rounded-full ${option.status ? 'bg-green-500' : 'bg-red-500'}`}></div>
      </div>
    );
  }
  // function renderBranchSelectedOption(value: any, option: any, handleClearItem: any) {
  //   const selectedItem = option?.find((item: any) => item?.value == value);
  //   console.log(selectedItem,option);
  //   return (
  //     <div className="flex items-center gap-2">
  //       <h5>{selectedItem?.value}</h5>
  //       <span
  //         className="hover:bg-muted hidden cursor-pointer rounded-full p-1"
  //         onClick={(e) => {
  //           e.stopPropagation();
  //           handleClearItem(selectedItem?.value);
  //         }}
  //       >
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           width="24"
  //           height="24"
  //           viewBox="0 0 24 24"
  //           fill="none"
  //           stroke="currentColor"
  //           strokeWidth="2"
  //           strokeLinecap="round"
  //           strokeLinejoin="round"
  //           className="lucide lucide-x-icon lucide-x"
  //         >
  //           <path d="M18 6 6 18" />
  //           <path d="m6 6 12 12" />
  //         </svg>
  //         {/* <XMarkIcon className="size-4" /> */}
  //       </span>
  //     </div>
  //   );
  // }
  function renderDisplayValue(selectedItems: string[], options: MultiSelectOption[], handleClearItem: any) {
    const filteredItems = options.filter((option) => selectedItems.includes(option.value));
    const isEmpty = filteredItems.length === 0;
    const isLongerThanOne = filteredItems.length > 1;

    return (
      <div className={cn('flex w-full flex-wrap items-center gap-2 text-start', !isEmpty && 'me-6')}>
        {isLongerThanOne ? (
          <span className=" ms-2  ps-2">{filteredItems.length} Branches Selected</span>
        ) : (
          <div className=" flex items-center gap-2   ps-2">
            {filteredItems.slice(0, 1).map((item) => (
              <div key={item?.label} className="border-muted flex items-center gap-3 rounded border ps-2">
                <h4>{item.label}</h4>
                <span
                  className="hover:bg-muted cursor-pointer rounded-full p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearItem(item.value);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x-icon lucide-x"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <header className={cn('mb-3 pt-2 @container xs:-mt-2 lg:mb-7')}>
      <div className="flex flex-col @lg:flex-row @lg:items-center @lg:justify-between">
        <Title as="h2" className="mb-2 text-[22px] lg:text-2xl 4xl:text-[26px]">
          {title}
        </Title>

        <div className="flex items-center gap-4">
          {/* branch filter */}
          <div className="flex flex-shrink-0 items-center gap-2">
            {/* title */}
            <h5 className="text-nowrap text-base font-medium">Filter By Branch:</h5>
            {/* filter */}
            <MultiSelect
              value={value}
              options={options}
              onChange={setValue}
              displayValue={renderDisplayValue}
              getOptionDisplayValue={renderBranchFilterOptions}
              className="h-10 min-w-72"
              // label="Multi Select"
              clearable={true}
              onClear={() => setValue([])}
            />
          </div>
          {/* date filter */}
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
