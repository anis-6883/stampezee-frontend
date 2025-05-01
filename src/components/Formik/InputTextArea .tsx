import { Field } from 'formik';
import { IoAlertCircle } from 'react-icons/io5';
import { Textarea } from 'rizzui';

export default function InputTextarea({
  name,
  label,
  rows = 5,
  required = true,
  placeholder = 'Write you message...',
  readOnly = false,
}: {
  name: string;
  label: string;
  placeholder?: string;
  ref?: any;
  required?: boolean;
  readOnly?: boolean;
  type?: string;
  rows?: number;
}) {
  return (
    <div>
      <Field name={name}>
        {({ field, meta }: { field: any; meta: any }) => (
          <Textarea
            {...field}
            name={name}
            rows={rows}
            label={
              <span>
                {label} {required && <span className="text-red-600">*</span>}
              </span>
            }
            placeholder={placeholder}
            readOnly={readOnly}
            textareaClassName={`${meta.touched && meta.error ? '!border-red-500 !ring-0' : 'border-gray-200 !ring-0'}`}
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
