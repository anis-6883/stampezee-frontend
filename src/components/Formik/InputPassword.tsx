import { Field } from 'formik';
import { Password } from 'rizzui';

export default function InputPassword({
  name,
  label,
  placeholder,
  required = true,
  type = 'text',
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
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
            error={meta.touched && meta.error && <div className="mt-1 text-xs text-red-500">{meta.error}</div>}
          />
        )}
      </Field>
    </div>
  );
}
