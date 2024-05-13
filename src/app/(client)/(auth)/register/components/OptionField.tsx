import { Field, useFormikContext } from 'formik';
import { TbWorldSearch } from 'react-icons/tb';
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
    color: 'red',
    border: '1px solid white',
    borderRadius: '4px',
    cursor: 'pointer',
    height: '50px',
  }),
  option: (provided, state) => ({
    ...provided,
    color: 'black', // Set option text color to black
    backgroundColor: '#17202A', // Set option background color to transparent
    '&:hover': {
      backgroundColor: '#1B2631', // Change background color on hover
      color: 'black', // Change text color on hover
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
    color: 'white', // Set search input text color to red
  }),
};

// Custom function to render option label with country name and flag
const getOptionLabel = (option: any) => (
  <div className="flex text-white">
    <img src={option.flag} alt={option.label} style={{ width: '20px', marginLeft: '5px' }} />
    <span className="ml-2">{option.label}</span>
  </div>
);

// Form component
const MyForm = () => {
  const { setFieldValue, values }: { setFieldValue: any; values: any } = useFormikContext();

  return (
    <>
      <div className="mb-2 mt-3 flex items-center text-lg">
        {' '}
        <TbWorldSearch className="mr-2 text-white" />
        Country <span className="font-bold text-red-600"> *</span>
      </div>
      <Field name="country">
        {({ field, meta }: { field: any; meta: any }) => (
          <>
            <Select
              {...field}
              value={options.find((option) => option.label === values.country || option.value === values.country)}
              onChange={(selectedOption: any) => setFieldValue('country', selectedOption.label)}
              options={options}
              getOptionLabel={getOptionLabel} // Use custom function to render option label
              styles={customStyles}
            />
            <p className="mt-1 h-3 select-none px-1 font-medium text-red">{meta.touched && meta.error && meta.error}</p>
          </>
        )}
      </Field>
    </>
  );
};

export default MyForm;
