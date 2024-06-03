import { Field } from 'formik';
import { LuUnlock } from 'react-icons/lu';
import { Password } from 'rizzui';

export default function PasswordField({ name, label, placeholder = '**********' }: { name: string; label: string; placeholder?: string }) {
  return (
    <Field name={name}>
      {({ field, meta }: { field: any; meta: any }) => (
        <div className="mt-3">
          <Password
            size="lg"
            label={
              <p className="flex items-center gap-x-2">
                <LuUnlock className="text-base" /> {label}
                <span className="font-bold text-red-600"> *</span>
              </p>
            }
            variant="outline"
            color="primary"
            labelClassName="text-base"
            autoComplete="off"
            placeholder={placeholder}
            {...field}
          />
          <p className="text-red mt-1 h-3 select-none px-1 font-medium">{meta.touched && meta.error && meta.error}</p>
        </div>
      )}
    </Field>
  );
}
