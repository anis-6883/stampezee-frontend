'use client';

import { Field } from 'formik';
import { Select as CustomSelect } from 'rizzui';
interface SelectOptionProps {
  label?: string;
  name?: string;
  options?: { label: string; value: string }[];
  selectClassName?: string;
  labelClassName?: string;
  value?: string;
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
  selectClassName,
  labelClassName,
  onChange,
  required = true,
  disabled = false,
  value = null,
}) => {
  return (
    <Field name={name}>
      {({ field }: { field: any }) => (
        <CustomSelect
          disabled={disabled}
          label={
            <span>
              {label}
              {required && <span className="text-red-500"> *</span>}
            </span>
          }
          options={options}
          selectClassName={selectClassName}
          labelClassName={labelClassName}
          value={options.find((option) => option.value === (value || field.value))}
          onChange={onChange}
        />
      )}
    </Field>
  );
};

export default SelectField;

{
  /* <SelectField
name='collectionCode'
required={false}
onChange={(v: any) => setFieldValue("collectionCode", v.value)}
label='Collection Code'
labelClassName='mt-2'
options={collectionCode}
/> */
}
