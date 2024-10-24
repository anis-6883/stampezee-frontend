import FormBlockWrapper from '@/components/FormBlockWrapper';
import QuillLoader from '@/components/reactQuill/QuillLoader';
import dynamic from 'next/dynamic';

const QuillEditor = dynamic(() => import('@/components/reactQuill/QuillEditor'), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-auto" />,
});

export default function TermsAndConditionForm({ values, setFieldValue }: { setFieldValue: any; values: any }) {
  const handleChange = (input: string) => {
    const removeHtmlTags = input.replace(/<[^>]*>/g, '');
    removeHtmlTags ? setFieldValue('page.terms', input) : setFieldValue('page.terms', '');
  };

  return (
    <FormBlockWrapper title="Terms and Conditions" className="p-5">
      <div className="grid grid-cols-1 gap-y-2 ">
        <QuillEditor
          value={values.page.terms}
          onChange={handleChange}
          label=""
          className="h-[250px]"
          labelClassName="font-medium text-gray-700 mb-1.5"
        />
      </div>
    </FormBlockWrapper>
  );
}
