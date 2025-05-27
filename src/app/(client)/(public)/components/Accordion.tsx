'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllFaqsQuery } from '@/features/faqs/faqsApi';
import { faqTranslateData } from '@/utils/GoogleTranslate';
import { useEffect, useRef, useState } from 'react';

export default function Accordion({ locale }: { locale: string }) {
  const [status, setStatus] = useState<string>('');
  const [faqs, setFaqs] = useState<any>([]);
  const [translateLoading, setTranslateLoading] = useState(false);
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
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

  return faqsLoading || translateLoading ? (
    <div className="flex flex-col gap-3">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="w-68 h-14 rounded" />
      ))}
    </div>
  ) : (
    <div id="accordion-collapse" data-accordion="collapse">
      {faqs?.map((item: any) => (
        <div key={item?._id} className="card my-5 rounded-lg bg-white shadow-lg">
          <h2
            id={`accordion-heading-${item._id}`}
            onClick={() => handleClick(item?._id)}
            className="cursor-pointer transition-all duration-500 hover:bg-gray-100"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 border-none p-5 font-medium text-gray-500 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-expanded={status === item._id}
              aria-controls={`accordion-body-${item._id}`}
            >
              <span className="text-base sm:text-xl">{item?.title}</span>
              <svg
                className={`h-3 w-3 shrink-0 transition duration-300 ease-in-out ${status === item._id ? 'rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5 5 1 1 5" />
              </svg>
            </button>
          </h2>
          <div
            id={`accordion-body-${item._id}`}
            ref={(el) => {
              contentRefs.current[item._id] = el;
            }}
            style={{
              maxHeight: status === item._id ? `${contentRefs.current[item._id]?.scrollHeight}px` : '0px',
            }}
            className={`overflow-hidden transition-all duration-500 ease-in-out`}
            aria-labelledby={`accordion-heading-${item._id}`}
          >
            <div className="border-none dark:bg-gray-900">
              <p className="text-pretty p-6 text-base text-gray-500 dark:text-gray-400 sm:text-lg">{item?.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
