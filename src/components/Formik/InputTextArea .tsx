import { useEffect } from 'react';
import { Textarea } from 'rizzui';

export default function InputTextarea({
  name,
  label,
  placeholder,
  ref,
  required = true,
  value, // Add value prop
  errors,
  touched,
  type = 'text',
  setFieldValue,
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
  setFieldValue?: any;
}) {
  useEffect(() => {
    setFieldValue(name, value);
  }, [setFieldValue, value, name]);

  const handleChange = (e: any) => {
    setFieldValue(name, e.target.value);
  };
  return (
    <div>
      <Textarea name={name} label={label} placeholder="Write you message..." onChange={handleChange} value={value} />
      {errors && touched && <div className="mt-1 text-xs text-red-500">{errors}</div>}
    </div>
  );
}

{
  /* <InputTextarea
name="description"
label="Description"
placeholder="Write you message Description..."
errors={errors.description}
touched={touched.description}
setFieldValue={setFieldValue}
value={values.description}
/> */
}
