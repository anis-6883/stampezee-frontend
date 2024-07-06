import FormBlockWrapper from '@/components/shared/Form/FormBlockWrapper';
import Input from '@/components/shared/Form/Input';
import { Field, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { Select } from 'rizzui';

export default function AppVersionControlForm() {
  const [iosForceUpdate, setIosForceUpdate] = useState({ label: 'On', value: '1' });
  const [androidForceUpdate, setAndroidForceUpdate] = useState({ label: 'On', value: '1' });
  const { setFieldValue, values }: { setFieldValue: any; values: any } = useFormikContext();

  useEffect(() => {
    if (values?.iosForceUpdate === '1') {
      setIosForceUpdate({ label: 'On', value: '1' });
    } else {
      setIosForceUpdate({ label: 'Off', value: '0' });
    }

    if (values?.androidForceUpdate === '1') {
      setAndroidForceUpdate({ label: 'On', value: '1' });
    } else {
      setAndroidForceUpdate({ label: 'Off', value: '0' });
    }
  }, [values]);

  return (
    <div className="flex flex-col gap-8">
      <FormBlockWrapper title="App Links">
        <div className="grid grid-cols-1 gap-4 gap-y-2 md:grid-cols-2">
          <Input name="iosAppLink" required={false} />
          <Input name="androidAppLink" required={false} />
        </div>
      </FormBlockWrapper>

      <div className="my-2 border-b border-dashed border-slate-300"></div>

      <FormBlockWrapper title="Version Control (iOS)">
        <div className="grid grid-cols-1 gap-4 gap-y-6 md:grid-cols-2">
          <Input name="iosVersionName" required={false} />
          <Input name="iosVersionCode" required={false} />

          <Field name="iosForceUpdate">
            {() => (
              <Select
                label="iOS Force Update"
                variant="outline"
                options={[
                  { label: 'On', value: '1' },
                  { label: 'Off', value: '0' },
                ]}
                value={iosForceUpdate}
                onChange={(item: { label: string; value: string }) => {
                  setFieldValue('iosForceUpdate', item.value);
                  setIosForceUpdate(item);
                }}
              />
            )}
          </Field>

          <Input name="iosAppUrl" required={false} />
          <Input name="iosButtonText" required={false} />
          <Input name="iosDescription" required={false} />
        </div>
      </FormBlockWrapper>

      <div className="my-2 border-b border-dashed border-slate-300"></div>

      <FormBlockWrapper title="Version Control (Android)">
        <div className="grid grid-cols-1 gap-4 gap-y-6 md:grid-cols-2">
          <Input name="androidVersionName" required={false} />
          <Input name="androidVersionCode" required={false} />

          <Field name="androidForceUpdate">
            {() => (
              <Select
                label="Android Force Update"
                variant="outline"
                options={[
                  { label: 'On', value: '1' },
                  { label: 'Off', value: '0' },
                ]}
                value={androidForceUpdate}
                onChange={(item: { label: string; value: string }) => {
                  setFieldValue('androidForceUpdate', item.value);
                  setAndroidForceUpdate(item);
                }}
              />
            )}
          </Field>

          <Input name="androidAppUrl" required={false} />
          <Input name="androidButtonText" required={false} />
          <Input name="androidDescription" required={false} />
        </div>
      </FormBlockWrapper>
    </div>
  );
}
