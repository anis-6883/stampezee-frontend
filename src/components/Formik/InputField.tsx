import { Field } from 'formik';
import { IoAlertCircle } from 'react-icons/io5';
import { Input } from 'rizzui';

export default function InputField({
  name,
  label,
  placeholder,
  required = true,
  disabled = false,
  type = 'text',
  prefix,
  className = '',
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  prefix?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className="w-full">
      <Field name={name}>
        {({ field, meta }: { field: any; meta: any }) => (
          <Input
            {...field}
            label={
              label ? (
                <span>
                  {label} {required && <span className="text-red-600">*</span>}
                </span>
              ) : null
            }
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            inputClassName={`${meta.touched && meta.error ? '!border-red-500 !ring-0' : 'border-gray-200 !ring-0'}`}
            prefix={prefix}
            className={className}
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
    </div>
  );
}
