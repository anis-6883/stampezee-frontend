import { Title } from 'rizzui';
import Breadcrumb from '@/components/ui/breadcrumb';
import DatePicker from '@/components/Formik/DatePicker';
import { IoCloseCircleSharp } from 'react-icons/io5';
import SelectField from '@/components/Formik/SelectField';

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
    <header className="mb-3 pt-2 @container xs:-mt-2 lg:mb-7">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
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
        <div className="flex flex-shrink-0 items-center gap-2">
          {/* date picker */}
          <div className="flex flex-shrink-0 items-center gap-2">
            <h5 className="text-base font-medium">Filter by Validity Date :</h5>
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

          {/* status */}
          <div className="flex min-w-72 flex-shrink-0 items-center gap-2">
            <h5 className="text-base font-medium">Status:</h5>
            <div className="relative w-full">
              <SelectField
                withoutForm={true}
                value={status}
                options={options}
                onChange={(option: { label: string; value: string }) => setStatus(option.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SuperAdminStampsHeaderSection;
