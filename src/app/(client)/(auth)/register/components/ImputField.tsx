import { Field } from 'formik';
import React from 'react';
import { Input } from 'rizzui';
//
//     <InputField
//     name="l-name"
//     label="Last Name"
//     icon={<MdDriveFileRenameOutline className="text-base" />}
//     placeholder="Last Name"
//   />

export default function InputField({
  name,
  label,
  icon,
  placeholder,
  ref,
  required = true,
}: {
  name: string;
  label: string;
  icon?: React.ReactNode;
  placeholder?: string;
  ref?: any;
  required?: boolean;
}) {
  return (
    <Field name={name}>
      {({ field, meta }: { field: any; meta: any }) => (
        <div className="mt-3 w-full">
          <Input
            size="lg"
            label={
              <p className="flex items-center gap-x-2">
                {icon}
                {label}
                {required && <span className="font-bold text-red-600"> *</span>}
              </p>
            }
            variant="outline"
            color="red"
            labelClassName="text-base"
            inputClassName="!text-white"
            className=" placeholder:text-red-400"
            autoComplete="off"
            placeholder={placeholder}
            ref={ref}
            {...field}
          />
          <p className="mt-1 h-3 select-none px-1 font-medium text-red">{meta.touched && meta.error && meta.error}</p>
        </div>
      )}
    </Field>
  );
}
