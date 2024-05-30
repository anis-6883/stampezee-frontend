import { Field } from 'formik';
//
{
  /* <InputField name="name" label="Name" placeholder="" errors={errors.name} touched={touched.name} /> */
}

export default function InputField({
  name,
  label,
  placeholder,
  ref,
  required = true,
  value, // Add value prop
  errors,
  touched,
  type = 'text',
}: {
  name: string;
  label: string;
  placeholder?: string;
  ref?: any;
  required?: boolean;
  value?: any; // Modify prop types
  errors?: any;
  touched?: any;
  type?: string;
}) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="mb-3 block text-sm font-bold text-gray-700">
          {label}
        </label>
      )}
      <Field
        name={name}
        // value={value} // Pass value prop
        className={` w-full rounded-md border ${errors && touched ? 'border-red-500' : 'border-gray-200'} bg-gray-100 py-[0.6rem] text-sm font-medium placeholder-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none`}
        placeholder={placeholder}
        type={type}
      />
      {errors && touched && <div className="mt-1 text-xs text-red-500">{errors}</div>}
    </div>
  );
}
