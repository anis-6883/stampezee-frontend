import InputField from '@/components/Formik/InputField';
import InputPassword from '@/components/Formik/InputPassword';
import FormBlockWrapper from '@/components/shared/Form/FormBlockWrapper';
import { LuCircleDollarSign } from 'react-icons/lu';
import { RiDiscountPercentLine, RiKey2Line } from 'react-icons/ri';

export default function StripeSettingsForm() {
  return (
    <FormBlockWrapper title="Stripe Settings & Threshold" className="p-5">
      <InputPassword
        name="stripe.stripeSecretKey"
        label="Stripe Secret Key"
        placeholder="*******"
        required={false}
        prefix={<RiKey2Line className="text-xl" />}
      />
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2">
        <InputField
          type="number"
          name="stripe.planChangeCost"
          label="Plan Change Cost (CAD)"
          placeholder="1"
          required={false}
          prefix={<LuCircleDollarSign className="text-xl" />}
        />
        <InputField
          type="number"
          name="stripe.refundableThreshold"
          label="Refundable Threshold (CAD)"
          placeholder="1"
          required={false}
          prefix={<LuCircleDollarSign className="text-xl" />}
        />
        <InputField name="stripe.taxTitle" label="Tax Title" placeholder="Tax" required={false} />
        <InputField
          name="stripe.taxCost"
          label="Tax Cost (CAD%)"
          placeholder="1"
          required={false}
          prefix={<RiDiscountPercentLine className="text-xl" />}
        />
      </div>
    </FormBlockWrapper>
  );
}
