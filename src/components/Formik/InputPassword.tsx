import { Field } from 'formik';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function InputPassword({
  name,
  label,
  placeholder,
  ref,
  required = true,
  value, // Add value prop
  errors,
  touched,
  type = 'password', // Default type to 'password'
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
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative w-full">
      {label && (
        <label htmlFor={name} className="mb-3 block text-sm font-bold text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <Field
          name={name}
          // value={value} // Pass value prop
          className={`w-full rounded-md border ${
            errors && touched ? 'border-red-500' : 'border-gray-200'
          } bg-gray-100 py-[0.6rem] text-sm font-medium placeholder-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none`}
          placeholder={placeholder}
          type={showPassword ? 'text' : 'password'}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {errors && touched && <div className="mt-1 text-xs text-red-500">{errors}</div>}
    </div>
  );
}

{
  /* <InputPassword name="password" label="Password" placeholder="" errors={errors.password} touched={touched.password} /> */
}
