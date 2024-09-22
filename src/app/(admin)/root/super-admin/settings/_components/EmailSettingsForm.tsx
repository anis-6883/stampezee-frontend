import InputField from '@/components/Formik/InputField';
import InputPassword from '@/components/Formik/InputPassword';
import FormBlockWrapper from '@/components/shared/Form/FormBlockWrapper';
import { RiKey2Line } from 'react-icons/ri';

export default function EmailSettingsForm() {
  return (
    <FormBlockWrapper title="Email Settings" className="px-5 py-3">
      <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
        <InputField name="mail.host" label="Email Host" placeholder="smtp.gmail.com" required={false} />
        <InputField name="mail.port" label="Email Port (SSL)" placeholder="465" required={false} />
        <InputField name="mail.username" label="Email Username" placeholder="example@gmail.com" required={false} />
        <InputPassword
          name="mail.password"
          label="Email Password"
          placeholder="******"
          required={false}
          prefix={<RiKey2Line className="text-xl" />}
        />
      </div>
    </FormBlockWrapper>
  );
}
