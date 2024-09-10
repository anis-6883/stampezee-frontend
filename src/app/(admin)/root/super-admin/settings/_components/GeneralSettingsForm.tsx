import InputField from '@/components/Formik/InputField';
import InputPassword from '@/components/Formik/InputPassword';
import FormBlockWrapper from '@/components/shared/Form/FormBlockWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import timeZoneData from '@/utils/get-timezone-list';
import { Field } from 'formik';
import { RiKey2Line } from 'react-icons/ri';
import ReactSelect from 'react-select';

export default function GeneralSettingsForm({
  setFieldValue,
  values,
  generalSettingLoading,
}: {
  setFieldValue: any;
  values: any;
  generalSettingLoading: boolean;
}) {
  return generalSettingLoading ? (
    <Skeleton className="w-68 h-80 rounded" />
  ) : (
    <div className="space-y-10">
      <FormBlockWrapper title="Main Information" className="p-5">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-3">
          <InputField name="general.companyName" label="Company Name" placeholder="company name" required={false} />
          <InputField name="general.siteTitle" label="Site Title" placeholder="site title" required={false} />
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

        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-3">
          <InputField name="general.emailUsername" label="Email Username" placeholder="example@gmail.com" required={false} />
          <InputPassword
            name="general.emailPassword"
            label="Email Password"
            placeholder="******"
            required={false}
            prefix={<RiKey2Line className="text-xl" />}
          />
          <InputField name="general.contactEmail" label="Contact Email" placeholder="example@gmail.com" required={false} />
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
          <InputField
            name="general.androidDownloadLink"
            label="Android Download Link"
            placeholder="https://www.example.com"
            required={false}
          />
          <InputField name="general.iosDownloadLink" label="Ios Download Link" placeholder="https://www.example.com" required={false} />
        </div>
      </FormBlockWrapper>
    </div>
  );
}
