import dynamic from 'next/dynamic';
import QuillLoader from '../../../../../components/reactQuill/QuillLoader';
import FormBlockWrapper from '../../../../../components/shared/Form/FormBlockWrapper';

const QuillEditor = dynamic(() => import('../../../../../components/reactQuill/QuillEditor'), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-[143px]" />,
});

export default function PrivacyAndPolicyForm({ values, setFieldValue }: { setFieldValue: any; values: any }) {
  const handleChange = (input: string) => {
    const removeHtmlTags = input.replace(/<[^>]*>/g, '');
    removeHtmlTags ? setFieldValue('policy', input) : setFieldValue('policy', '');
  };

  return (
    <FormBlockWrapper title="Privacy & Policy">
      <div className="grid grid-cols-1 gap-y-2">
        <QuillEditor
          value={values.policy}
          onChange={handleChange}
          label=""
          className="col-span-full [&_.ql-editor]:min-h-[100px]"
          labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
        />
      </div>
    </FormBlockWrapper>
  );
}
