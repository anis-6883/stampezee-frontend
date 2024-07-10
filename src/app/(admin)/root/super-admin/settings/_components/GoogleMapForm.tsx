import InputPassword from '@/components/Formik/InputPassword';
import FormBlockWrapper from '@/components/shared/Form/FormBlockWrapper';

export default function GoogleMapForm() {
  return (
    <FormBlockWrapper title="Google Map" className="p-5">
      <InputPassword name="googleMap.googleMapsApiKey" label="Google Maps Api Key" placeholder="************" required={false} />
    </FormBlockWrapper>
  );
}
