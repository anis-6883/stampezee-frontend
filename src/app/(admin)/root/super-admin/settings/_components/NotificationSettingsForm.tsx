import InputField from '@/components/Formik/InputField';
import InputPassword from '@/components/Formik/InputPassword';
import FormBlockWrapper from '@/components/shared/Form/FormBlockWrapper';

export default function NotificationSettingsForm() {
  return (
    <FormBlockWrapper title="Notification Settings" className="p-5">
      <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
        <InputPassword name="notification.firebaseServerKey" label="Firebase Server Key" placeholder="*****" required={false} />
        <InputField name="notification.firebaseTopics" label="Firebase Topics" placeholder="firebase topics" required={false} />
      </div>
    </FormBlockWrapper>
  );
}
