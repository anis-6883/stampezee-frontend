import InputField from '@/components/Formik/InputField';
import PhoneNumber from '@/components/Formik/PhoneNumber';
import FormBlockWrapper from '@/components/shared/Form/FormBlockWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import countryData from '@/utils/get-country-list';
import timeZoneData from '@/utils/get-timezone-list';
import { Field, useFormikContext } from 'formik';
import ReactSelect from 'react-select';

export default function GeneralSettingsForm({ generalSettingLoading }: { generalSettingLoading: boolean }) {
  const { setFieldValue, values }: any = useFormikContext();

  const countryOptions = countryData.map((country) => ({
    value: country.code,
    label: country.country,
    flag: country.flag,
  }));

  return generalSettingLoading ? (
    <Skeleton className="w-68 h-80 rounded" />
  ) : (
    <div className="space-y-10">
      <FormBlockWrapper title="Company Information" className="my-3 px-5">
        <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-3">
          <InputField name="general.companyName" label="Company Name" placeholder="company name" required={false} />

          {!values.general?.phone ? (
            <Skeleton className="h-10 w-auto rounded" />
          ) : (
            <PhoneNumber
              name="general.phone"
              label={<p>Contact Number</p>}
              country="ca"
              preferredCountries={['ca']}
              onChange={(value, countryData: any) => {
                setFieldValue('general.dialCode', `+${countryData.dialCode}`);
                setFieldValue('general.phone', value.slice(countryData.dialCode.length));
              }}
              errorClassName="text-red-600 text-xs mt-1"
              inputClassName={`!border-slate-300 !border !h-[40px] !ring-0`}
              labelClassName="!mb-1.5"
              helperClassName="text-danger"
              value={`${values?.general?.dialCode}${values?.general?.phone}`}
            />
          )}

          <div className="flex flex-col gap-1">
            <div>
              <p className="font-medium">Country</p>
            </div>
            {!values.general?.country ? (
              <Skeleton className="h-10 w-auto rounded" />
            ) : (
              <ReactSelect
                placeholder="Select your country"
                options={countryOptions}
                getOptionLabel={getOptionLabel}
                getOptionValue={(option) => option.value}
                defaultValue={countryOptions.find((country) => country.label === values.general?.country)}
                onChange={(selectedOption) => setFieldValue('general.country', selectedOption?.label)}
              />
            )}
          </div>

          <InputField name="general.province" label="Province" placeholder="Alberta" required={false} />
          <InputField name="general.city" label="City or Street" placeholder="MILLARVILLE AB T0L 1K0" required={false} />
          <InputField name="general.postalCode" label="Postal Code" placeholder="H3Z 2Y7" required={false} />
          <InputField name="general.address" label="Address" placeholder="2364 7TH CONCESSION SITE 6 COMP 10" required={false} />

          <InputField name="general.contactEmail" label="Contact Email" placeholder="example@gmail.com" required={false} />

          <Field name="general.timezone">
            {({ field, meta }: { field: any; meta: any }) => (
              <div className="flex flex-col gap-1">
                <div>
                  <span className="font-semibold">
                    Time Zone <span className="text-red-600">{meta.touched && meta.error && <span>(Required!)</span>}</span>
                  </span>
                </div>
                <ReactSelect
                  id="type"
                  placeholder="Select an option"
                  options={timeZoneData}
                  onChange={(timezoneOption) => {
                    setFieldValue('general.timezone', timezoneOption);
                  }}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: '7px',
                      padding: '1px',
                      border: '1px solid border-gray-200',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: '#2563EB',
                      },
                    }),
                  }}
                  value={typeof values?.general.timezone === 'string' ? JSON.parse(values?.general?.timezone) : values?.general?.timezone}
                />
              </div>
            )}
          </Field>
        </div>
      </FormBlockWrapper>

      <FormBlockWrapper title="App Download & Social Links" className="px-5 py-3">
        <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
          <InputField
            name="general.androidDownloadLink"
            label="Android Download Link"
            placeholder="https://www.example.com"
            required={false}
          />
          <InputField name="general.iosDownloadLink" label="Ios Download Link" placeholder="https://www.example.com" required={false} />
          <InputField name="general.facebook" label="Facebook" placeholder="https://www.facebook.com/" required={false} />
          <InputField name="general.instagram" label="Instagram" placeholder="https://www.instagram.com/" required={false} />
          <InputField name="general.tiktok" label="Tiktok" placeholder="https://www.tiktok.com/" required={false} />
          <InputField name="general.linkedin" label="Linkedin" placeholder="https://www.linkedin.com/" required={false} />
        </div>
      </FormBlockWrapper>
    </div>
  );
}

const getOptionLabel = (option: any): any => (
  <div className="flex ">
    <img src={option.flag} alt={option.label} style={{ width: '20px', marginLeft: '5px' }} />
    <span className="ml-2">{option.label}</span>
  </div>
);
