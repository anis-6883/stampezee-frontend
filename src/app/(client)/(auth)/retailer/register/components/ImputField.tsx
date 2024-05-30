import { Field } from 'formik';
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
  placeholder,
  ref,
  required = true,
  errors,
  touched,
  type = 'text',
}: {
  name: string;
  label: string;
  placeholder?: string;
  ref?: any;
  required?: boolean;
  errors?: any;
  touched?: any;
  type?: string;
}) {
  return (
    <div className="w-full">
      <Field
        name={name}
        className={`w-full rounded-md border ${errors && touched ? 'border-red-500' : 'border-gray-200'} bg-gray-100  py-[0.6rem] text-sm font-medium placeholder-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none`}
        placeholder={placeholder}
        type={type}
      />
      {errors && touched && <div className="mt-1 text-xs text-red-500">{errors}</div>}
    </div>
  );
}
