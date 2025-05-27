import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/dark.css';
import React from 'react';
import Flatpickr from 'react-flatpickr';

interface DateRangeProps {
  label?: string;
  value?: string;
  enableTime?: boolean;
  range?: boolean;
  required?: boolean;
  className?: string;
  prefix?: React.ReactNode;
  changeHandler: (value: string) => void;
}

const DatePicker: React.FC<DateRangeProps> = ({
  value,
  label,
  enableTime = false,
  range = false,
  required = true,
  changeHandler,
  className,
  prefix,
}) => {
  return (
    <Flatpickr
      value={value} // this makes it controlled
      render={({ defaultValue, value, ...props }, ref) => (
        <div className="flex flex-col gap-y-0.5">
          {label && (
            <div className="flex gap-1">
              <p className="mb-1 font-medium">
                {label} {required && <span className="text-red-600">*</span>}
              </p>
            </div>
          )}

          <div className="flex items-center">
            {prefix ? (
              <div className="flex !cursor-pointer items-center overflow-hidden rounded-md border-[1px] border-slate-300 bg-white px-2">
                {prefix}
                <input
                  type="text"
                  className={`h-10 w-full  cursor-pointer border-none pl-2 placeholder:text-sm focus:ring-0 ${className}`}
                  ref={ref}
                  placeholder={range ? 'YYYY-MM-DD to YYYY-MM-DD' : enableTime ? 'YYYY-MM-DD HH:II' : 'YYYY-MM-DD'}
                  aria-label="Select date range"
                  onInput={(e) => {
                    const value = (e.target as HTMLInputElement).value;
                    if (value === '') {
                      changeHandler('');
                    }
                  }}
                />
              </div>
            ) : (
              <input
                type="text"
                className={`h-10 w-full rounded-md border-[1px] border-slate-300 placeholder:text-sm ${className}`}
                ref={ref}
                placeholder={range ? 'YYYY-MM-DD to YYYY-MM-DD' : enableTime ? 'YYYY-MM-DD HH:II' : 'YYYY-MM-DD'}
                aria-label="Select date range"
                onInput={(e) => {
                  const value = (e.target as HTMLInputElement).value;
                  if (value === '') {
                    changeHandler('');
                  }
                }}
              />
            )}
          </div>
        </div>
      )}
      options={{
        onChange: function (selectedDates: Date[]) {
          const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          };

          if (range) {
            if (selectedDates.length === 2) {
              const formattedRange = selectedDates.map(formatDate).join(' to ');
              changeHandler(formattedRange);
            }
          } else {
            const formattedDate = selectedDates[0] ? formatDate(selectedDates[0]) : null;
            if (formattedDate) changeHandler(formattedDate);
          }
        },
        disableMobile: true,
        allowInput: false,
        mode: range ? 'range' : 'single',
        dateFormat: enableTime ? 'Y-m-d H:i' : 'Y-m-d',
        enableTime,
      }}
    />
  );
};

export default DatePicker;
