import FormBlockWrapper from '@/components/FormBlockWrapper';
import InputField from '@/components/Formik/InputField';
import InputPassword from '@/components/Formik/InputPassword';
import { RiKey2Line } from 'react-icons/ri';

export default function NotificationSettingsForm() {
  return (
    <FormBlockWrapper title="Notification Settings" className="p-5">
      <div className="grid grid-cols-1 gap-x-4 gap-y-4">
        <InputField name="notification.firebaseTopics" label="Firebase Topics" placeholder="firebase topics" required={false} />
        <InputPassword
          name="notification.firebaseServerKey"
          label="Firebase Server Key"
          placeholder="*****"
          required={false}
          prefix={<RiKey2Line className="text-xl" />}
        />
      </div>
    </FormBlockWrapper>
  );
}
