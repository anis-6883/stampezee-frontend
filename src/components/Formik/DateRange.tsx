import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/dark.css';
import { Field, useFormikContext } from 'formik';
import React from 'react';
import Flatpickr from 'react-flatpickr';
import { MdOutlineClose } from 'react-icons/md';

interface DateRangeProps {
  label?: string;
  name: string;
}

const DateRangePicker: React.FC<DateRangeProps> = ({ label = 'Date Range', name }) => {
  const { values, setFieldValue }: any = useFormikContext();

  console.log(values);

  return (
    <Field name={name}>
      {({ field, meta }: { field: any; meta: any }) => (
        <Flatpickr
          render={({ defaultValue, value, ...props }, ref) => (
            <div>
              <p className="mb-1 font-medium">
                {label} <span className="text-red-600">*</span>
              </p>
              <div className="flex items-center">
                <input
                  type="text"
                  className={`h-10 w-full rounded-l-md border-[1px] placeholder:text-sm ${meta.touched && meta.error ? '!border-red-500' : 'border-[#9DC0FA]'}`}
                  ref={ref}
                  placeholder="YYYY-MM-DD to YYYY-MM-DD"
                  aria-label="Select date range"
                />
                <div
                  onClick={() => setFieldValue(name, '')}
                  className="border-r-none flex h-10 w-10 cursor-pointer items-center justify-center rounded-r-lg border border-slate-300 bg-gray-200 hover:border-slate-300 hover:bg-red-400 hover:text-white"
                >
                  <MdOutlineClose className="text-xl" />
                </div>
              </div>
            </div>
          )}
          value={values[name]}
          options={{
            onChange: function (_, selectedDates) {
              console.log('selectedDates: ', selectedDates);
              setFieldValue(name, selectedDates);
            },
            disableMobile: true,
            allowInput: false,
            mode: 'range',
            dateFormat: 'Y-m-d',
          }}
        />
      )}
    </Field>
  );
};

export default DateRangePicker;
