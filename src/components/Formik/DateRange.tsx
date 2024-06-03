// import 'flatpickr/dist/flatpickr.css';
// import 'flatpickr/dist/themes/dark.css';
// import { Dispatch, SetStateAction } from 'react';
// import Flatpickr from 'react-flatpickr';
// import { MdOutlineClose } from 'react-icons/md';

// interface DateRangeProps {
//   selectedDateRange: string;
//   setSelectedDateRange: Dispatch<SetStateAction<string>>;
// }

// export default function DateRange({ selectedDateRange, setSelectedDateRange }: DateRangeProps) {
//   return (
//     <div className="flex items-center gap-5">
//       <Flatpickr
//         render={({ defaultValue, value, ...props }, ref) => (
//           <div className="form-control flex flex-col">
//             <div className="flex w-fit items-center">
//               <input
//                 type="text"
//                 className=" h-10 min-w-[250px] rounded-l-lg border border-slate-300 placeholder:text-sm"
//                 ref={ref}
//                 placeholder="YYYY-MM-DD to YYYY-MM-DD"
//                 aria-label="Select date range"
//               />
//               <div
//                 onClick={() => setSelectedDateRange('')}
//                 className="border-r-none flex h-10 w-10 cursor-pointer items-center justify-center rounded-r-lg border border-slate-300 bg-gray-200  hover:border-slate-300 hover:bg-red-400 hover:text-white"
//               >
//                 <MdOutlineClose className="text-xl" />
//               </div>
//             </div>
//           </div>
//         )}
//         value={selectedDateRange}
//         options={{
//           onChange: function (_, dateStr) {
//             setSelectedDateRange(dateStr);
//           },
//           disableMobile: true,
//           allowInput: false,
//           mode: 'range',
//           dateFormat: 'Y-m-d',
//         }}
//       />
//     </div>
//   );
// }

// ================================v2 ===============================

import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/dark.css';
import React from 'react';
import Flatpickr from 'react-flatpickr';
import { MdOutlineClose } from 'react-icons/md';

interface DateRangeProps {
  startDate: string;
  endDate: string;
  setFieldValue: (field: string, value: any) => void;
}

const DateRangePicker: React.FC<DateRangeProps> = ({ startDate, endDate, setFieldValue }) => {
  return (
    <div className="flex items-center gap-5">
      <Flatpickr
        render={({ defaultValue, value, ...props }, ref) => (
          <div className="form-control flex flex-col">
            <div className="flex w-fit items-center">
              <input
                type="text"
                className="h-10 min-w-[250px] rounded-l-lg border border-slate-300 placeholder:text-sm"
                ref={ref}
                placeholder="YYYY-MM-DD to YYYY-MM-DD"
                aria-label="Select date range"
              />
              <div
                onClick={() => {
                  setFieldValue('startedAt', '');
                  setFieldValue('expiredAt', '');
                }}
                className="border-r-none flex h-10 w-10 cursor-pointer items-center justify-center rounded-r-lg border border-slate-300 bg-gray-200 hover:border-slate-300 hover:bg-red-400 hover:text-white"
              >
                <MdOutlineClose className="text-xl" />
              </div>
            </div>
          </div>
        )}
        value={[startDate, endDate]}
        options={{
          onChange: function (selectedDates) {
            setFieldValue('startedAt', selectedDates[0]);
            setFieldValue('expiredAt', selectedDates[1]);
          },
          disableMobile: true,
          allowInput: false,
          mode: 'range',
          dateFormat: 'Y-m-d',
        }}
      />
    </div>
  );
};

export default DateRangePicker;
