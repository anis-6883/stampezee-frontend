import CropImageUpload from '@/components/cropImage/CropImageUpload';
import FormBlockWrapper from '@/components/shared/Form/FormBlockWrapper';
import Input from '@/components/shared/Form/Input';
import { Field } from 'formik';
import { useEffect, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { Select } from 'rizzui';

export default function PopUpBannerSettings({
  values,
  setFieldValue,
}: {
  values: any;
  setFieldValue: any;
  bannerImage: any;
  setBannerImage: any;
}) {
  const [refreshNumber, setRefreshNumber] = useState({ label: '1 time refresh', value: '1' });
  const [runningStatus, setRunningStatus] = useState({ label: 'On', value: '1' });

  useEffect(() => {
    setRefreshNumber({ label: values?.refreshNumber + ' times refresh', value: values?.refreshNumber });

    if (values?.runningStatus === '1') {
      setRunningStatus({ label: 'On', value: '1' });
    } else {
      setRunningStatus({ label: 'Off', value: '0' });
    }
  }, [values]);

  return (
    <FormBlockWrapper title="Pop Up Banner Settings">
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-3">
        {/* <Field name='appLink'>
          {({ field }: { field: any }) => <Input {...field} label={<span>App Link</span>} placeholder='App Link' />}
        </Field> */}
        <Input name="appLink" required={false} />

        <Field name="refreshNumber">
          {() => (
            <Select
              label="Refresh Times Number"
              variant="outline"
              options={[
                { label: '1 time refresh', value: '1' },
                { label: '2 time refresh', value: '2' },
                { label: '3 time refresh', value: '3' },
                { label: '4 time refresh', value: '4' },
                { label: '5 time refresh', value: '5' },
              ]}
              value={refreshNumber}
              onChange={(item: { label: string; value: string }) => {
                setFieldValue('refreshNumber', item.value);
                setRefreshNumber(item);
              }}
            />
          )}
        </Field>
        <Field name="runningStatus">
          {() => (
            <Select
              label="Running Status"
              variant="outline"
              options={[
                { label: 'On', value: '1' },
                { label: 'Off', value: '0' },
              ]}
              value={runningStatus}
              onChange={(item: { label: string; value: string }) => {
                setFieldValue('runningStatus', item.value);
                setRunningStatus(item);
              }}
            />
          )}
        </Field>
      </div>

      <div className="w-full">
        <div className="mb-2">
          <span className="label-text font-semibold">Pop-Up Banner Image (Ratio: 9:16)</span>
        </div>
        {values?.bannerImage ? (
          <div className="flex items-center gap-3">
            <img src={values.bannerImage} alt="Uploaded Image" className="h-24 w-24 rounded-md border border-gray-200 object-contain p-1" />
            <button type="button" className="rounded bg-red-500 p-1" onClick={() => setFieldValue('bannerImage', '')}>
              <FaTrashAlt className="hover:fill-secondary-400 h-5 w-5 fill-white transition-colors" />
            </button>
          </div>
        ) : (
          <CropImageUpload name="bannerImage" height={350} textColor="text-primary" values={values} setFieldValue={setFieldValue} />
        )}
      </div>
    </FormBlockWrapper>
  );
}
