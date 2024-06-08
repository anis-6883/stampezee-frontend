'use client';

import { Field } from 'formik';
import { Select } from 'rizzui';
interface SelectOptionProps {
  label?: string;
  name?: string;
  options?: { label: string; value: string }[];
  labelClassName?: string;
  value?: any;
  onChange: any;
  required?: boolean;
  disabled?: boolean;
}

const defaultOptions = [
  { label: 'Active', value: '1' },
  { label: 'In-Active', value: '0' },
];

const SelectField: React.FC<SelectOptionProps> = ({
  name = 'status',
  label = 'Status',
  options = defaultOptions,
  labelClassName,
  onChange,
  required = true,
  disabled = false,
  value = null,
}) => {
  return (
    <>
      <Field name={name}>
        {({ field, meta }: { field: any; meta: any }) => (
          <Select
            label={
              <span>
                {label}
                {required && <span className="text-red-500"> *</span>}
              </span>
            }
            selectClassName={`${meta.touched && meta.error ? '!border-red-500 ring-0' : 'border-gray-200'}`}
            labelClassName={labelClassName}
            options={options}
            value={options.find((option) => option.value === value)}
            onChange={onChange}
            disabled={disabled}
            // error={meta.touched && meta.error && <div className="mt-1 text-xs text-red-500">{meta.error}</div>}
          />
        )}
      </Field>
    </>
  );
};

export default SelectField;
