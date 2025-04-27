import { IoInformationCircleOutline } from 'react-icons/io5';

const BillingSummary = ({ selectedCurrency, payableAmount, total }: { payableAmount: number; total: number; selectedCurrency: string }) => {
  return (
    <div className="mx-auto w-full space-y-6 rounded-lg bg-white px-12 text-base">
      <table className="w-full border-collapse text-left ">
        <thead>
          <tr>
            <th className="border-b pb-2">Item</th>
            <th className="border-b pb-2 text-right">{`Amount (${selectedCurrency})`}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-b py-2">Selected Plan & Add-ons</td>
            <td className="border-b py-2 text-right">{total}</td>
          </tr>
          <tr>
            <td className="py-2">
              Add-ons Adjustment
              <div className="text-xs text-gray-500">(based on your usage after purchase)</div>
            </td>
            <td className="py-2 text-right">{payableAmount}</td>
          </tr>
          <tr className="border-t">
            <td className="py-2 font-semibold">Total to Pay Now</td>
            <td className="py-2 text-right font-semibold">{(Number(total) + Number(payableAmount)).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* Note Section */}
      <div className="flex flex-col space-y-2 rounded-lg bg-gray-50 px-3 py-4 text-base">
        <div className="flex items-center gap-x-1 text-xl text-gray-500">
          <IoInformationCircleOutline className="text-xl text-black" />
          <span className="font-medium text-black">Note :</span>
        </div>

        <ul className="ml-2 list-inside list-disc space-y-3 text-sm text-gray-700">
          <li className=" text-[15px]">
            The <strong>Add-ons Adjustment</strong> reflects the small usage amount from your previous billing period.
          </li>
          <li className="text-[15px]">
            This adjustment ensures your plan and add-ons renew together on the same full-month cycle, with no service interruptions.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BillingSummary;
