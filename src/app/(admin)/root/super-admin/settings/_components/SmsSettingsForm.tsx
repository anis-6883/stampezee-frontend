import FormBlockWrapper from '@/components/FormBlockWrapper';
import { Field, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { Input, Select } from 'rizzui';

export default function SmsSettingsForm() {
  const [msg91OtpDefault, setMsg91OtpDefault] = useState({ label: 'On', value: '1' });
  const { setFieldValue, values }: { setFieldValue: any; values: any } = useFormikContext();

  useEffect(() => {
    if (values?.msg91OtpDefault === '1') {
      setMsg91OtpDefault({ label: 'On', value: '1' });
    } else {
      setMsg91OtpDefault({ label: 'Off', value: '0' });
    }
  }, [values?.msg91OtpDefault]);

  return (
    <div className="flex flex-col gap-10">
      <FormBlockWrapper title="Twilio">
        <div className="grid grid-cols-1 gap-4 gap-y-2 md:grid-cols-3">
          <Field name="twilioAccountSID">
            {({ field }: { field: any }) => <Input {...field} label={<span>Account SID</span>} placeholder="Account SID" />}
          </Field>

          <Field name="twilioAuthToken">
            {({ field }: { field: any }) => <Input {...field} label={<span>Auth Token</span>} placeholder="Auth Token" />}
          </Field>

          <Field name="twilioServiceId">
            {({ field }: { field: any }) => <Input {...field} label={<span>Service Id</span>} placeholder="Service Id" />}
          </Field>
        </div>
      </FormBlockWrapper>

      <div className="my-2 border-b border-dashed border-slate-300"></div>

      <FormBlockWrapper title="Msg91">
        <div className="grid grid-cols-1 gap-4 gap-y-6 md:grid-cols-2">
          <Field name="msg91AuthKey">
            {({ field }: { field: any }) => <Input {...field} label={<span>Auth Key</span>} placeholder="Auth Key" />}
          </Field>

          <Field name="msg91OtpToken">
            {({ field }: { field: any }) => <Input {...field} label={<span>Otp Token</span>} placeholder="Otp Token" />}
          </Field>

          <Field name="msg91WidgetId">
            {({ field }: { field: any }) => <Input {...field} label={<span>Widget Id</span>} placeholder="Widget Id" />}
          </Field>

          <Field name="msg91OtpDefault">
            {() => (
              <Select
                label="Otp Default"
                variant="outline"
                options={[
                  { label: 'On', value: '1' },
                  { label: 'Off', value: '0' },
                ]}
                value={msg91OtpDefault}
                onChange={(item: { label: string; value: string }) => {
                  setFieldValue('msg91OtpDefault', item.value);
                  setMsg91OtpDefault(item);
                }}
              />
            )}
          </Field>
        </div>
      </FormBlockWrapper>
    </div>
  );
}
