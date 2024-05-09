'use client';
import { useState } from 'react';

export default function Accordion({ faqData }: { faqData: any }) {
  const [status, setStatus] = useState<string>('');

  const handleClick = (id: string) => () => {
    setStatus(status === id ? '' : id);
  };

  return (
    <div id="accordion-collapse" data-accordion="collapse">
      {faqData.map((item: any) => (
        <div key={item.title} className="card my-5 rounded-lg bg-white shadow-lg">
          <h2
            id="accordion-collapse-heading-1"
            onClick={handleClick(item.title)}
            className={`cursor-pointer transition-all duration-500 hover:bg-gray-100`}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 border-none p-5 font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 rtl:text-right"
              data-accordion-target="#accordion-collapse-body-1"
              aria-expanded={status === '1'}
              aria-controls="accordion-collapse-body-1"
            >
              <span>{item.title}</span>
              <svg
                data-accordion-icon=""
                className={`h-3 w-3 shrink-0 ${status === '1' ? 'rotate-180' : ''}`}
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
            className={`transition-max-height overflow-hidden duration-300 ease-in-out ${status === item.title ? 'max-h-96' : 'max-h-0'}`}
            aria-labelledby="accordion-collapse-heading-1"
          >
            <div className=" border-none p-5 dark:bg-gray-900">
              <p className="mb-2 text-gray-500 dark:text-gray-400">{item.body}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
