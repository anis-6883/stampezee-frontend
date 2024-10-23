import { Field } from 'formik';
import { IoAlertCircle } from 'react-icons/io5';
import { Password } from 'rizzui';

export default function InputPassword({
  name,
  label,
  placeholder,
  required = true,
  prefix,
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  prefix?: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <Field name={name}>
        {({ field, meta }: { field: any; meta: any }) => (
          <Password
            {...field}
            label={
              <span>
                {label} {required && <span className="text-red-600">*</span>}
              </span>
            }
            placeholder={placeholder}
            autoComplete="off"
            prefix={prefix}
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
            inputClassName={`${meta.touched && meta.error ? '!border-red-500 !ring-0' : 'border-gray-200 !ring-0'}`}
          />
        )}
      </Field>
    </div>
  );
}
