import InputField from '@/components/Formik/InputField';
import InputPassword from '@/components/Formik/InputPassword';
import SelectField from '@/components/Formik/SelectField';
import FormBlockWrapper from '@/components/shared/Form/FormBlockWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import countryData from '@/utils/get-country-list';
import { useFormikContext } from 'formik';
import { LuCircleDollarSign } from 'react-icons/lu';
import { RiDiscountPercentLine, RiKey2Line } from 'react-icons/ri';
import ReactSelect from 'react-select';
import { FieldError } from 'rizzui';

export default function StripeSettingsForm({ generalSettingLoading }: { generalSettingLoading: boolean }) {
  const { setFieldValue, values, setFieldTouched, touched, errors }: any = useFormikContext();

  const countryOptions = countryData.map((country) => ({
    value: country.currency,
    label: `${country.country} (${country?.currency})`,
    flag: country.flag,
  }));

  const allowCountries = countryOptions?.reduce((acc: any, country: any) => {
    values?.stripe?.allowCurrencies?.map((currency: any) => {
      if (currency?.country === country?.label) {
        acc.push(country);
      }
    });
    return acc;
  }, []);

  if (generalSettingLoading) {
    return <Skeleton className="w-68 h-80 rounded" />;
  }

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

      <div className="flex flex-col gap-1">
        <div>
          <p className="font-medium">
            Currencies <span className="text-red-600">*</span>
          </p>
        </div>

        {allowCountries?.length > 0 && (
          <ReactSelect
            placeholder="Select your currencies"
            isMulti
            options={countryOptions}
            getOptionLabel={getOptionLabel}
            getOptionValue={(option) => option.label}
            defaultValue={allowCountries}
            onChange={(selectedOption: any) =>
              setFieldValue(
                'stripe.allowCurrencies',
                selectedOption?.map((item: any) => ({ country: item?.label, currency: item?.value }))
              )
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
            onBlur={() => setFieldTouched('stripe.allowCurrencies', true)}
          />
        )}
        {allowCountries?.length === 0 && (
          <ReactSelect
            placeholder="Select your currencies"
            isMulti
            options={countryOptions}
            getOptionLabel={getOptionLabel}
            getOptionValue={(option) => option.label}
            // defaultValue={allowCountries}
            onChange={(selectedOption: any) =>
              setFieldValue(
                'stripe.allowCurrencies',
                selectedOption?.map((item: any) => ({ country: item?.label, currency: item?.value }))
              )
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
            onBlur={() => setFieldTouched('stripe.allowCurrencies', true)}
          />
        )}
        {touched?.stripe?.allowCurrencies && errors?.stripe?.allowCurrencies && (
          <FieldError error={errors?.stripe?.allowCurrencies} className="my-1 text-xs text-red-600" />
        )}
      </div>
      <p className="flex flex-col text-end text-xs font-semibold">
        <span>
          Fields marked with <span className="text-red-600">*</span> are mandatory!
        </span>
      </p>
    </FormBlockWrapper>
  );
}

const getOptionLabel = (option: any): any => (
  <div className="flex ">
    <img src={option.flag} alt={option.label} style={{ width: '20px', marginLeft: '5px' }} />
    <span className="ml-2">{option.label}</span>
  </div>
);
