import CropImageUpload from '@/components/cropImage/CropImageUpload';
import FormBlockWrapper from '@/components/shared/Form/FormBlockWrapper';
import { FaTrashAlt } from 'react-icons/fa';
export default function LogoAndIconForm({
  values,
  setFieldValue,
}: {
  values: any;
  setFieldValue: any;
  setSiteIcon: any;
  siteIcon: any;
  setSiteLogo: any;
  siteLogo: any;
}) {
  return (
    <FormBlockWrapper title="Logo & Icon">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="w-full">
          <div className="mb-2">
            <span className="label-text font-semibold">Site Logo</span>
          </div>
          {values?.siteLogo ? (
            <div className="flex items-center gap-3">
              <img src={values.siteLogo} alt="Uploaded Image" className="h-24 w-24 rounded-md border border-gray-200 object-contain p-1" />
              <button type="button" className="rounded bg-red-500 p-1" onClick={() => setFieldValue('siteLogo', '')}>
                <FaTrashAlt className="hover:fill-secondary-400 h-5 w-5 fill-white transition-colors" />
              </button>
            </div>
          ) : (
            <CropImageUpload name="siteLogo" height={350} textColor="text-primary" values={values} setFieldValue={setFieldValue} />
          )}
        </div>

        <div className="w-full">
          <div className="mb-2">
            <span className="label-text font-semibold">Site Icon</span>
          </div>
          {values?.siteIcon ? (
            <div className="flex items-center gap-3">
              <img src={values.siteIcon} alt="Uploaded Image" className="h-24 w-24 rounded-md border border-gray-200 object-contain p-1" />
              <button type="button" className="rounded bg-red-500 p-1" onClick={() => setFieldValue('siteIcon', '')}>
                <FaTrashAlt className="hover:fill-secondary-400 h-5 w-5 fill-white transition-colors" />
              </button>
            </div>
          ) : (
            <CropImageUpload name="siteIcon" height={350} textColor="text-primary" values={values} setFieldValue={setFieldValue} />
          )}
        </div>
      </div>
    </FormBlockWrapper>
  );
}
