import InputField from '@/components/Formik/InputField';
import InputPassword from '@/components/Formik/InputPassword';
import SelectField from '@/components/Formik/SelectField';
import FormBlockWrapper from '@/components/shared/Form/FormBlockWrapper';
import countryData from '@/utils/get-country-list';
import { useFormikContext } from 'formik';
import { LuCircleDollarSign } from 'react-icons/lu';
import { RiDiscountPercentLine, RiKey2Line } from 'react-icons/ri';
import ReactSelect from 'react-select';

export default function StripeSettingsForm() {
  const { setFieldValue, values }: any = useFormikContext();

  let countryOptions = countryData?.map((country) => ({
    value: country.currency,
    label: `${country.country} (${country?.currency})`,
    flag: country.flag,
  }));

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
      </div>
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-3">
        <InputField name="stripe.taxTitle" label="Tax Title" placeholder="Tax" required={false} />
        <InputField
          name="stripe.taxCost"
          label="Tax Cost (CAD%)"
          placeholder="1"
          required={false}
          prefix={<RiDiscountPercentLine className="text-xl" />}
        />
        <SelectField
          name="stripe.taxStatus"
          label="Tax Status"
          value={values.stripe.taxStatus}
          options={[
            {
              label: 'Off',
              value: 'off',
            },
            {
              label: 'On',
              value: 'on',
            },
          ]}
          onChange={(option: { label: string; value: string }) => setFieldValue('stripe.taxStatus', option.value)}
        />
      </div>
      <div>
        <p className="mb-2 font-medium">Default Currency</p>
        {values?.stripe.defaultCurrency?.country && (
          <ReactSelect
            placeholder="Select your country"
            menuPlacement="top"
            isSearchable
            name={`stripe.defaultCurrency.country`}
            options={countryOptions}
            getOptionLabel={getOptionLabel}
            getOptionValue={(option) => option.label}
            defaultValue={countryOptions.filter((country) => country.label === `${values?.stripe.defaultCurrency?.country}`)}
            onChange={(selectedOption) =>
              setFieldValue(`stripe.defaultCurrency`, {
                country: selectedOption?.label,
                currency: selectedOption?.value,
              })
            }
            styles={{
              control: (base) => ({
                ...base,
                boxShadow: 'none !important',
              }),
              input: (base) => ({
                ...base,
                boxShadow: 'none !important',
              }),
            }}
          />
        )}

        {values?.stripe.defaultCurrency?.country === '' && (
          <ReactSelect
            placeholder="Select your country"
            menuPlacement="top"
            isSearchable
            name={`stripe.defaultCurrency.country`}
            options={countryOptions}
            getOptionLabel={getOptionLabel}
            getOptionValue={(option) => option.label}
            onChange={(selectedOption) =>
              setFieldValue(`stripe.defaultCurrency`, {
                country: selectedOption?.label,
                currency: selectedOption?.value,
              })
            }
            styles={{
              control: (base) => ({
                ...base,
                boxShadow: 'none !important',
              }),
              input: (base) => ({
                ...base,
                boxShadow: 'none !important',
              }),
            }}
          />
        )}
      </div>
    </FormBlockWrapper>
  );
}

const getOptionLabel = (option: any): any => (
  <div className="flex ">
    <img src={option.flag} alt={option.label} style={{ width: '20px', marginLeft: '5px' }} />
    <span className="ml-2">{option.label}</span>
  </div>
);
