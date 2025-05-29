import { Title } from 'rizzui';
import Breadcrumb from '@/components/ui/breadcrumb';
import DatePicker from '@/components/Formik/DatePicker';
import { IoCloseCircleSharp } from 'react-icons/io5';
import SelectField from '@/components/Formik/SelectField';
import { IoMdClose } from 'react-icons/io';

interface IOption {
  label: string;
  value: string;
}

const SuperAdminStampsHeaderSection = ({
  title,
  breadcrumb,
  dateRange,
  setDateRange,
  status,
  setStatus,
  options,
}: {
  options: IOption[];
  title: string;
  breadcrumb?: { name: string; href?: string }[];
  dateRange: string;
  setDateRange: any;
  status: string;
  setStatus: any;
}) => {
  return (
    <header className="mb-5 pt-2 @container xs:-mt-2 lg:mb-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <div>
            <Title as="h2" className="mb-2 text-[22px] lg:text-2xl 4xl:text-[26px]">
              {title}
            </Title>

            {breadcrumb && (
              <Breadcrumb separator="" separatorVariant="circle" className="flex-wrap">
                {breadcrumb.map((item) => (
                  <Breadcrumb.Item key={item.name} {...(item?.href && { href: item?.href })}>
                    {item.name}
                  </Breadcrumb.Item>
                ))}
              </Breadcrumb>
            )}
          </div>
        </div>
        <div className="flex flex-shrink-0 flex-col gap-3 md:flex-row md:items-center md:gap-4">
          {/* status */}
          <div className="flex min-w-28 flex-shrink-0 items-center gap-2 md:min-w-44 xl:min-w-52">
            <div className="relative w-full">
              <SelectField
                withoutForm={true}
                value={status}
                options={options}
                onChange={(option: { label: string; value: string }) => setStatus(option.value)}
              />
            </div>
          </div>
          {/* date picker */}
          <div className="flex flex-shrink-0 flex-col gap-2 lg:flex-row lg:items-center">
            <h5 className="text-sm font-medium md:hidden md:text-base xl:block">Filter by Validity Date :</h5>
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

export default SuperAdminStampsHeaderSection;
