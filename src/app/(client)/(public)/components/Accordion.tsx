'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllFaqsQuery } from '@/features/faqs/faqsApi';
import { faqTranslateData } from '@/utils/GoogleTranslate';
import { useEffect, useRef, useState } from 'react';

export default function Accordion({ locale }: { locale: string }) {
  const [status, setStatus] = useState<string>('');
  const [faqs, setFaqs] = useState<any>([]);
  const [translateLoading, setTranslateLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>('0px');
  const { data: faqsData, isLoading: faqsLoading } = useGetAllFaqsQuery(undefined);

  useEffect(() => {
    setTranslateLoading(true);
    (async () => {
      if (faqsData?.data?.length > 0 && locale !== 'en') {
        const translatedFaqs = await faqTranslateData(faqsData?.data, locale, 'en');
        setFaqs(translatedFaqs);
      } else {
        setFaqs(faqsData?.data);
      }
      setTranslateLoading(false);
    })();
  }, [faqsData, locale]);

  const handleClick = (id: string) => {
    setStatus(status === id ? '' : id);
  };

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(status ? `${contentRef.current.scrollHeight}px` : '0px');
    }
  }, [status]);

  return faqsLoading || translateLoading ? (
    <div className="flex flex-col gap-3">
      <Skeleton className="w-68 h-14 rounded" />
      <Skeleton className="w-68 h-14 rounded" />
      <Skeleton className="w-68 h-14 rounded" />
      <Skeleton className="w-68 h-14 rounded" />
      <Skeleton className="w-68 h-14 rounded" />
    </div>
  ) : (
    <div id="accordion-collapse" data-accordion="collapse">
      {faqs?.map((item: any) => (
        <div key={item?._id} className="card my-5 rounded-lg bg-white shadow-lg">
          <h2
            id="accordion-collapse-heading-1"
            onClick={() => handleClick(item?._id)}
            className={`cursor-pointer transition-all duration-500 hover:bg-gray-100`}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 border-none p-5 font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 rtl:text-right"
              data-accordion-target="#accordion-collapse-body-1"
              aria-expanded={status === '1'}
              aria-controls="accordion-collapse-body-1"
            >
              <span>{item?.title}</span>
              <svg
                data-accordion-icon=""
                className={`h-3 w-3 shrink-0 ${status === item?._id ? 'rotate-180 transition duration-300 ease-in-out' : 'transition duration-300 ease-in-out'}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5 5 1 1 5" />
              </svg>
            </button>
          </h2>
          <div
            id="accordion-collapse-body-1"
            ref={contentRef}
            style={{ maxHeight: status === item?._id ? maxHeight : 0 }}
            className={`transition-max-height overflow-hidden duration-500 ease-in-out ${status === item?._id ? 'max-h-96' : 'max-h-0'}`}
            aria-labelledby="accordion-collapse-heading-1"
          >
            <div className=" border-none p-5 dark:bg-gray-900">
              <p className="mb-2 text-pretty pb-4 text-gray-500 dark:text-gray-400">{item?.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
