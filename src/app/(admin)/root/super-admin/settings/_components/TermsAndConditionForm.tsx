import dynamic from 'next/dynamic';
import QuillLoader from '@/components/reactQuill/QuillLoader';
import FormBlockWrapper from '@/components/shared/Form/FormBlockWrapper';

const QuillEditor = dynamic(() => import('@/components/reactQuill/QuillEditor'), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-[143px]" />,
});

export default function TermsAndConditionForm({ values, setFieldValue }: { setFieldValue: any; values: any }) {
  const handleChange = (input: string) => {
    const removeHtmlTags = input.replace(/<[^>]*>/g, '');
    removeHtmlTags ? setFieldValue('page.terms', input) : setFieldValue('page.terms', '');
  };

  return (
    <FormBlockWrapper title="Terms and Conditions">
      <div className="grid h-[200px] grid-cols-1 gap-y-2">
        <QuillEditor
          value={values.page.terms}
          onChange={handleChange}
          label=""
          className="h-full"
          labelClassName="font-medium text-gray-700  mb-1.5"
        />
      </div>
    </FormBlockWrapper>
  );
}
