'use client';

import { Field } from 'formik';
import { IoAlertCircle } from 'react-icons/io5';
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
  selectClassName?: string;
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
  selectClassName,
}) => {
  return (
    <Field name={name}>
      {({ field, meta }: { field: any; meta: any }) => (
        <Select
          className="flex flex-col"
          label={
            <span>
              {label}
              {required && <span className="h-fit text-red-500"> *</span>}
            </span>
          }
          selectClassName={`${selectClassName} ${meta.touched && meta.error ? '!border-red-500 !ring-0' : 'border-gray-200 !ring-0'}`}
          labelClassName={labelClassName}
          options={options}
          value={options.find((option) => option.value === value)}
          onChange={onChange}
          disabled={disabled}
          helperText={
            meta.touched && meta.error ? (
              <span className="flex items-center gap-x-1">
                <IoAlertCircle className="text-lg" />
                <span>{meta.error}</span>
              </span>
            ) : (
              ''
            )
          }
          helperClassName="text-danger"
        />
      )}
    </Field>
  );
};

export default SelectField;

// Example for use

{
  /* <div>
                  <SelectField
                    name="categoryId"
                    label="Category"
                    disabled={optionsData?.categories?.length === 0 ? true : false}
                    value={values?.categoryId}
                    options={optionsData?.categories?.map((item: any) => ({
                      label: _.startCase(_.toLower(item.name)),
                      value: item._id,
                    }))}
                    onChange={(option: { label: string; value: string }) => setFieldValue('categoryId', option.value)}
                  />
                  {optionsData?.categories?.length === 0 && (
                    <div className=" pt-3 text-center text-danger">
                      <span>No category added by super admin</span>
                    </div>
                  )}
                </div> */
}
