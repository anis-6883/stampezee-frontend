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
  suffix,
  className = '',
  readOnly = false,
  autoComplete = 'new-password',
  hasLabelRequired = true,
}: {
  name: string;
  label: string | React.ReactNode;
  placeholder?: string;
  required?: boolean;
  type?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  readOnly?: boolean;
  hasLabelRequired?: boolean;
  autoComplete?: 'off' | 'new-password';
}) {
  return (
    <div className="w-full">
      <Field name={name}>
        {({ field, meta }: { field: any; meta: any }) => (
          <Input
            {...field}
            label={
              label ? (
                <div className="flex items-center">
                  {label} {required && hasLabelRequired && <span className="text-red-600">*</span>}
                </div>
              ) : null
            }
            type={type}
            readOnly={readOnly}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            inputClassName={`${meta.touched && meta.error ? '!border-red-500 !ring-0' : 'border-gray-200 !ring-0'} ${disabled && '!border-gray-100 bg-gray-100'}`}
            prefix={prefix}
            className={className}
            helperText={
              meta.touched && meta.error ? (
                <div className="flex items-center gap-x-1">
                  <IoAlertCircle className="text-lg" />
                  <span>{meta.error}</span>
                </div>
              ) : (
                ''
              )
            }
            helperClassName="text-danger"
            suffix={suffix}
          />
        )}
      </Field>
    </div>
  );
}
