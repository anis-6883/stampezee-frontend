import InputField from '@/components/Formik/InputField';
import FormBlockWrapper from '@/components/FormBlockWrapper';
import InputTextarea from '@/components/Formik/InputTextArea ';
import { Field } from 'formik';
import ReactSelect from 'react-select';

const AndroidVersionControlForm = () => {
  return (
    <FormBlockWrapper title="Version Control (Android)" className="px-5 py-3">
      <div className="grid grid-cols-1 gap-y-5 md:grid-cols-3 md:gap-x-5">
        <div className="grid grid-cols-1 gap-y-5 md:col-span-3 md:grid-cols-3 md:gap-x-5">
          <InputField name="appVersion.android.name" label="Android Version Name" placeholder="Enter Version Name" required={true} />
          <InputField
            name="appVersion.android.version"
            label="Android Version Code"
            placeholder="Enter Version Code"
            type="number"
            required={true}
          />
          <Field name="appVersion.android.forceUpdate">
            {({ field, form, meta }: { field: any; form: any; meta: any }) => {
              const options = [
                { label: 'True', value: true },
                { label: 'False', value: false },
              ];

              const selectedOption = options.find((option) => option.value === form.values.appVersion?.android?.forceUpdate);

              return (
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">
                    Android Force Update {meta.touched && meta.error && <span className="text-red-600">(Required!)</span>}
                  </label>
                  <ReactSelect
                    id="forceUpdate"
                    placeholder="Select an option"
                    options={options}
                    value={selectedOption}
                    onChange={(option) => {
                      form.setFieldValue('appVersion.android.forceUpdate', option?.value);
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: '7px',
                        padding: '1px',
                        border: '1px solid #e5e7eb', // Tailwind's gray-200
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: '#2563EB', // Tailwind's blue-600
                        },
                      }),
                    }}
                  />
                </div>
              );
            }}
          </Field>
        </div>

        <div className="col-span-3 grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
          <InputField name="appVersion.android.appUrl" label="Android App Url" placeholder="Enter App Url" required={true} />
          <InputField name="appVersion.android.buttonText" label="Android Button Text" placeholder="Enter Button Text" required={true} />
        </div>
        <div className="md:col-span-3">
          <InputTextarea
            className="resize-none"
            rows={2}
            name="appVersion.android.description"
            label={'Enter Description'}
            placeholder="Write here..."
          />
        </div>
      </div>
    </FormBlockWrapper>
  );
};

export default AndroidVersionControlForm;
