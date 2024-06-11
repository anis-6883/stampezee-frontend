import { Field } from 'formik';
import { Textarea } from 'rizzui';

export default function InputTextarea({
  name,
  label,
  required = true,
  placeholder = 'Write you message...',
}: {
  name: string;
  label: string;
  placeholder?: string;
  ref?: any;
  required?: boolean;
  type?: string;
  setFieldValue?: any;
}) {
  return (
    <div>
      <Field name={name}>
        {({ field, meta }: { field: any; meta: any }) => (
          <Textarea
            {...field}
            className="my-3"
            name={name}
            label={
              <span>
                {label} {required && <span className="text-red-600">*</span>}
              </span>
            }
            placeholder={placeholder}
            textareaClassName={`${meta.touched && meta.error ? '!border-red-500 ring-0' : 'border-gray-200'}`}
          />
        )}
      </Field>
    </div>
  );
}
