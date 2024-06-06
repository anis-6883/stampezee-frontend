import { Field, useFormikContext } from 'formik';
import Select, { StylesConfig } from 'react-select';
import countries from './AllCountries.json'; // Import the JSON file

// Combine countries into a single array
const options = countries.map((country) => ({
  value: country.code,
  label: country.country,
  flag: country.flag,
}));
// Custom styles for the Select component
const customStyles: StylesConfig = {
  control: (provided) => ({
    ...provided,
    backgroundColor: 'transparent',
    color: 'black',
    opacity: '0.8',
    border: '1px solid white',
    borderRadius: '8px',
    cursor: 'pointer',
    height: '45px',
  }),
  option: (provided, state) => ({
    ...provided,
    color: 'white', // Set option text color to black
    backgroundColor: '#17202A', // Set option background color to transparent
    '&:hover': {
      backgroundColor: '#38414B', // Change background color on hover
      color: 'white', // Change text color on hover
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'black', // Set the color of the selected option to black
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'black', // Set placeholder text color to black
  }),
  input: (provided) => ({
    ...provided,
    color: 'black', // Set search input text color to red
  }),
};

// Custom function to render option label with country name and flag
const getOptionLabel = (option: any) => (
  <div className="flex ">
    <img src={option.flag} alt={option.label} style={{ width: '20px', marginLeft: '5px' }} />
    <span className="ml-2">{option.label}</span>
  </div>
);

// Form component
const OptionField = () => {
  const { setFieldValue, values }: { setFieldValue: any; values: any } = useFormikContext();

  return (
    <>
      <Field name="country">
        {({ field, meta }: { field: any; meta: any }) => (
          <div className="text-black">
            <Select
              {...field}
              className="bg-gray-100 "
              value={options.find((option) => option.label === values.country || option.value === values.country)}
              onChange={(selectedOption: any) => setFieldValue('country', selectedOption.label)}
              options={options}
              getOptionLabel={getOptionLabel} // Use custom function to render option label
              styles={customStyles}
            />
            <p className=" text-red h-3 select-none px-1 font-medium">{meta.touched && meta.error && meta.error}</p>
          </div>
        )}
      </Field>
    </>
  );
};

export default OptionField;
