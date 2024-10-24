import FormBlockWrapper from '@/components/FormBlockWrapper';
import InputPassword from '@/components/Formik/InputPassword';
import { RiKey2Line } from 'react-icons/ri';

export default function GoogleMapForm() {
  return (
    <FormBlockWrapper title="Google Map" className="p-5">
      <InputPassword
        name="googleMap.googleMapsApiKey"
        label="Google Maps Api Key"
        placeholder="************"
        required={false}
        prefix={<RiKey2Line className="text-xl" />}
      />
    </FormBlockWrapper>
  );
}
