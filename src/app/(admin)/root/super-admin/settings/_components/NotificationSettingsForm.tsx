import InputField from '@/components/Formik/InputField';
import InputPassword from '@/components/Formik/InputPassword';
import FormBlockWrapper from '@/components/shared/Form/FormBlockWrapper';
import Input from '@/components/shared/Form/Input';
import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';

export default function NotificationSettingsForm() {
  const { setFieldValue, values }: { setFieldValue: any; values: any } = useFormikContext();
  const [notificationType, setNotificationType] = useState({ label: 'FCM', value: 'fcm' });

  useEffect(() => {
    if (values.notificationType === 'fcm') {
      setNotificationType({ label: 'FCM', value: 'fcm' });
    } else {
      setNotificationType({ label: 'One Signal', value: 'one-signal' });
    }
  }, [values.notificationType]);

  return (
    <FormBlockWrapper title="Notification Settings">
      {/* <div className='grid grid-cols-1 gap-x-4 gap-y-2'>
        <Field name='notificationType'>
          {() => (
            <Select
              label='Notification Type'
              variant='outline'
              options={[
                { label: "FCM", value: "fcm" },
                { label: "One Signal", value: "one-signal" }
              ]}
              value={notificationType}
              onChange={(item: { label: string; value: string }) => {
                setFieldValue("notificationType", item.value);
                setNotificationType(item);
              }}
            />
          )}
        </Field>
      </div> */}

      <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
        {/* {values.notificationType === "fcm" && ( */}
        <>
          {/* <Field name='firebaseServerKey'>
            {({ field }: { field: any }) => <Input {...field} label={<span>Firebase Server Key</span>} placeholder='Firebase Server Key' />}
          </Field> */}

          <InputPassword name="notification.firebaseServerKey" label="Firebase Server Key" placeholder="*****" required={false} />
          <InputField name="notification.firebaseTopics" label="Firebase Topics" placeholder="firebase topics" required={false} />

          {/* <Field name='firebaseTopics'>
            {({ field }: { field: any }) => <Input {...field} label={<span>Firebase Topics</span>} placeholder='Firebase Topics' />}
          </Field> */}
        </>
        {/* )} */}

        {/* {values.notificationType === "one-signal" && (
          <>
            <Field name='oneSignalAppId'>
              {({ field }: { field: any }) => <Input {...field} label={<span>One Signal App Id</span>} placeholder='One Signal App Id' />}
            </Field>
            <Field name='oneSignalApiKey'>
              {({ field }: { field: any }) => <Input {...field} label={<span>One Signal Api Key</span>} placeholder='One Signal Api Key' />}
            </Field>
          </>
        )} */}
      </div>
    </FormBlockWrapper>
  );
}
