import cn from '@/hooks/class-names';
import { LiaMapMarkedAltSolid } from 'react-icons/lia';
import { Checkbox, MultiSelect } from 'rizzui';

interface IValues {
  id: string;
  label: string;
  address: string;
  status: boolean;
  value: string;
  disabledBySystem: string;
}

interface Props {
  value: string[];
  setValue: any;
  options: IValues[];
}

function renderBranchFilterOptions(option: IValues, selected: boolean, handleToggle: any) {
  //  console.log(option)
  if (option) {
    return (
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Checkbox
            inputClassName={`!ring-0 checked:!bg-danger checked:!border-danger`}
            size="sm"
            checked={selected}
            iconClassName="top-0"
            onChange={() => handleToggle(option?.value)}
          />
          <div className="space-y-[2px]">
            <h6 className="text-sm font-medium">
              {/* {option.label} */}
              {option.label.length > 20 ? `${option.label.substring(0, 20)}...` : option.label}
            </h6>
            <p className="text-xs opacity-80">{option.address.length > 30 ? `${option.address.substring(0, 30)}...` : option.address}</p>
          </div>
        </div>
        <div className={`size-3 rounded-full ${option?.status && !option?.disabledBySystem ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>
    );
  } else {
    return (
      <div>
        <p>no data found</p>
      </div>
    );
  }
}

function renderDisplayValue(selectedItems: string[], options: IValues[], handleClearItem: any) {
  const filteredItems = options?.filter((option) => selectedItems.includes(option.value));
  const isEmpty = filteredItems?.length === 0;
  const isLongerThanOne = filteredItems?.length > 1;

  if (isEmpty) {
    return (
      <div className="w-full">
        <h1 className="pl-2 text-start">Select Branch</h1>
      </div>
    );
  }

  return (
    <div className={cn('flex w-full flex-wrap items-center gap-2 text-start', !isEmpty && 'me-6')}>
      {isLongerThanOne ? (
        <span className="ms-2 ps-2">{filteredItems?.length} Branches Selected</span>
      ) : (
        <div className="flex items-center gap-2 ps-2">
          {filteredItems?.slice(0, 1).map((item) => (
            <div key={item.label} className="border-muted flex items-center gap-3 rounded border ps-2">
              <h4>{item.label.length > 14 ? `${item.label.substring(0, 14)}...` : item.label}</h4>
              <span
                className="hover:bg-muted cursor-pointer rounded-full p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearItem(item.value);
                }}
              >
                {/* X icon */}
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

const BranchFilter = ({ value, setValue, options }: Props) => {
  return (
    <div>
      <MultiSelect
        value={value}
        placeholder="Select Branches"
        options={options}
        prefix={<LiaMapMarkedAltSolid className="text-xl" />}
        onChange={setValue}
        displayValue={renderDisplayValue}
        selectClassName="h-10 ring-0 active:ring-0 focus:ring-0"
        // getOptionDisplayValue={(option: IValues) => {
        //   if (option.value === 'no-option') {
        //     return <div className="w-full px-3 py-2 text-center text-sm text-gray-500">No branch found.</div>;
        //   }

        //   const selected = value.includes(option.value);
        //   const handleToggle = (val: string) => {
        //     const isExist = value?.includes(val);
        //     if (isExist) {
        //       setValue(value?.filter((item: any) => item !== val));
        //     } else {
        //       setValue([...value, val]);
        //     }
        //   };

        //   return renderBranchFilterOptions(option, selected, handleToggle);
        // }}
        // getOptionDisplayValue={renderBranchFilterOptions}
        className="h-10 min-w-72 max-w-72 rounded-xl bg-white p-0"
        clearable
        onClear={() => setValue([])}
      />
    </div>
  );
};

export default BranchFilter;
