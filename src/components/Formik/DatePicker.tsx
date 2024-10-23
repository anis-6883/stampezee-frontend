import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/dark.css';
import { Field, useFormikContext } from 'formik';
import React from 'react';
import Flatpickr from 'react-flatpickr';
import { IoAlertCircle } from 'react-icons/io5';
import { MdOutlineClose } from 'react-icons/md';

interface DateRangeProps {
  label?: string;
  name: string;
  enableTime?: boolean;
  range?: boolean;
  required?: boolean;
}

const DatePicker: React.FC<DateRangeProps> = ({ label = 'Date Range', name, enableTime = false, range = false, required = true }) => {
  const { values, setFieldValue }: any = useFormikContext();

  return (
    <Field name={name}>
      {({ field, meta }: { field: any; meta: any }) => (
        <Flatpickr
          render={({ defaultValue, value, ...props }, ref) => (
            <div className=" flex flex-col gap-y-0.5">
              <div className=" flex gap-1">
                <p className="mb-1 font-medium">
                  {label} {required && <span className="text-red-600">*</span>}
                </p>
              </div>
              <div className="flex items-center">
                <input
                  type="text"
                  className={`h-10 w-full rounded-l-md border-[1px] placeholder:text-sm ${meta.touched && meta.error ? '!border-danger' : '!border-gray-200'}`}
                  ref={ref}
                  placeholder={range ? 'YYYY-MM-DD to YYYY-MM-DD' : enableTime ? 'YYYY-MM-DD HH:II' : 'YYYY-MM-DD'}
                  aria-label="Select date range"
                />
                <div
                  onClick={() => setFieldValue(name, '')}
                  className="border-r-none flex h-10 w-10 cursor-pointer items-center justify-center rounded-r-lg border border-gray-200 bg-gray-200 hover:border-slate-300 hover:bg-danger hover:text-white"
                >
                  <MdOutlineClose className="text-xl" />
                </div>
              </div>
              {meta.error && meta.touched && (
                <span className="flex items-center gap-x-1 text-danger">
                  <IoAlertCircle className="text-lg" />
                  <span>{meta.error}</span>
                </span>
              )}
            </div>
          )}
          value={values[name]}
          options={{
            onChange: function (_, selectedDates) {
              setFieldValue(name, selectedDates);
            },
            disableMobile: true,
            allowInput: false,
            mode: range ? 'range' : 'single',
            dateFormat: enableTime ? 'Y-m-d H:i' : 'Y-m-d',
            enableTime,
          }}
        />
      )}
    </Field>
  );
};

export default DatePicker;
