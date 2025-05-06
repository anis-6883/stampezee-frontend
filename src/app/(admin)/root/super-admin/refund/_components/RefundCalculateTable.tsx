import { currentPeriodByTimezone } from '@/utils/getFormatDate';

const RefundCalculateTable = ({ data, timezone }: { data: any; timezone: string }) => {
  let totalPaymentAmount = data?.enrollment?.enrollSubscription?.planSnapshot?.price * data?.enrollment?.currencyRate || 0;
  let taxAmount = 0;
  let couponAmount = 0;
  let creditAmount = data?.enrollment?.enrollSubscription?.planSnapshot?.price * data?.enrollment?.currencyRate || 0;
  let paymentAmountText = `${data?.enrollment?.enrollSubscription?.planSnapshot?.price * data?.enrollment?.currencyRate} = ${totalPaymentAmount.toFixed(2)} ${data?.currency}`;
  if (data?.enrollment?.taxSnapshot?.taxTitle) {
    taxAmount = (totalPaymentAmount * data?.enrollment?.taxSnapshot?.taxCost) / 100;
    totalPaymentAmount += taxAmount;
    paymentAmountText = `${data?.enrollment?.enrollSubscription?.planSnapshot?.price * data?.enrollment?.currencyRate} + ${data?.enrollment?.taxSnapshot?.taxCost && taxAmount.toFixed(2)} = ${totalPaymentAmount.toFixed(2)} ${data?.currency}`;
  }

  if (data?.enrollment?.payments?.length === 1 && data?.enrollment?.payments[0]?.coupon?._id) {
    couponAmount = data?.enrollment?.payments[0]?.coupon?.discountAmount;
    totalPaymentAmount -= couponAmount;
    creditAmount -= couponAmount;
    paymentAmountText = `${data?.enrollment?.enrollSubscription?.planSnapshot?.price * data?.enrollment?.currencyRate} + ${data?.enrollment?.taxSnapshot?.taxCost && taxAmount.toFixed(2)} - ${data?.enrollment?.payments?.length === 1 && data?.enrollment?.payments[0]?.coupon?._id && couponAmount} = ${totalPaymentAmount.toFixed(2)} ${data?.currency}`;
  }

  return (
    <div className="grid grid-cols-1 gap-10 p-4 md:grid-cols-1">
      {data?.prevEnrollment?.planExists && (
        <div className="overflow-hidden ">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th colSpan={2} className="border-2 bg-danger px-4 py-2 text-white">
                  Previous Subscription Details
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className=" w-[50%] border px-4 py-2">Plan</td>
                <td className="w-[50%] border px-4 py-2 text-end capitalize">{data?.prevEnrollment?.planExists}</td>
              </tr>
              <tr>
                <td className=" w-[50%] border px-4 py-2">Plan Price</td>
                <td className="w-[50%] border px-4 py-2 text-end">{`${data?.prevEnrollment?.enrollSubscription?.planSnapshot?.price * data?.prevEnrollment?.currencyRate} ${data?.prevEnrollment?.currency}`}</td>
              </tr>
              {data?.prevEnrollment?.taxSnapshot?.taxTitle && (
                <tr>
                  <td className=" w-[50%] border px-4 py-2">
                    {data?.prevEnrollment?.taxSnapshot?.taxTitle ? data?.prevEnrollment?.taxSnapshot?.taxTitle : 'Tax'}
                  </td>
                  <td className="w-[50%] border px-4 py-2 text-end">{`${data?.prevEnrollment?.taxSnapshot?.taxCost}%`}</td>
                </tr>
              )}
              {data?.prevEnrollment?.payments?.length === 1 && data?.prevEnrollment?.payments[0]?.coupon?._id && (
                <tr>
                  <td className=" w-[50%] border px-4 py-2">
                    {`Coupon (${data?.prevEnrollment?.payments[0]?.coupon?.discountType === 'flat' ? `${data?.prevEnrollment?.payments[0]?.coupon?.discount} flat` : `${data?.prevEnrollment?.payments[0]?.coupon?.discount}%`})`}
                  </td>
                  <td className="w-[50%] border px-4 py-2 text-end">{`${data?.prevEnrollment?.payments[0]?.coupon?.discountAmount} ${data?.prevEnrollment?.currency}`}</td>
                </tr>
              )}
              <tr>
                <td className=" w-[50%] border px-4 py-2">Validity</td>
                <td className="w-[50%] border px-4 py-2 text-end">
                  {currentPeriodByTimezone(data?.prevEnrollment?.validityFrom, data?.prevEnrollment?.validityTo, timezone || '')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="overflow-hidden ">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th colSpan={2} className="border-2 bg-danger px-4 py-2 text-white">
                {data?.reason === 'downgrade' ? 'Current Subscription Details' : 'Subscription Details'}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className=" w-[50%] border px-4 py-2">Plan</td>
              <td className="w-[50%] border px-4 py-2 text-end capitalize">{data?.enrollment?.planExists}</td>
            </tr>
            <tr>
              <td className=" w-[50%] border px-4 py-2">Plan Price</td>
              <td className="w-[50%] border px-4 py-2 text-end">{`${data?.enrollment?.enrollSubscription?.planSnapshot?.price * data?.enrollment?.currencyRate} ${data?.enrollment?.currency}`}</td>
            </tr>
            {data?.enrollment?.taxSnapshot?.taxTitle && (
              <tr>
                <td className=" w-[50%] border px-4 py-2">
                  {data?.enrollment?.taxSnapshot?.taxTitle ? data?.enrollment?.taxSnapshot?.taxTitle : 'Tax'}
                </td>
                <td className="w-[50%] border px-4 py-2 text-end">{`${data?.enrollment?.taxSnapshot?.taxCost}%`}</td>
              </tr>
            )}
            {data?.enrollment?.payments?.length === 1 && data?.enrollment?.payments[0]?.coupon?._id && (
              <tr>
                <td className=" w-[50%] border px-4 py-2">
                  {`Coupon (${data?.enrollment?.payments[0]?.coupon?.discountType === 'flat' ? `${data?.enrollment?.payments[0]?.coupon?.discount} flat` : `${data?.enrollment?.payments[0]?.coupon?.discount}%`})`}
                </td>
                <td className="w-[50%] border px-4 py-2 text-end">{`${data?.enrollment?.payments[0]?.coupon?.discountAmount} ${data?.enrollment?.currency}`}</td>
              </tr>
            )}
            <tr>
              <td className=" w-[50%] border px-4 py-2">Validity</td>
              <td className="w-[50%] border px-4 py-2 text-end">
                {currentPeriodByTimezone(data?.enrollment?.validityFrom, data?.enrollment?.validityTo, timezone || '')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="overflow-hidden ">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th colSpan={2} className="border-2 bg-danger px-4 py-2 text-white">
                Refund Details
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className=" w-[50%] border px-4 py-2">Payment Amount (Price + Tax - Coupon)</td>
              <td className="w-[50%] border px-4 py-2 text-end">{paymentAmountText}</td>
            </tr>
            <tr>
              <td className=" w-[50%] border px-4 py-2">Credit (Price - Coupon)</td>
              <td className="w-[50%] border px-4 py-2 text-end">{`${data?.enrollment?.payments?.length === 1 && data?.enrollment?.payments[0]?.coupon?._id ? `${data?.enrollment?.enrollSubscription?.planSnapshot?.price * data?.enrollment?.currencyRate} - ${couponAmount} = ${creditAmount.toFixed(2)} ${data?.currency}` : `${creditAmount.toFixed(2)} ${data?.currency}`}`}</td>
            </tr>

            <tr>
              <td className=" w-[50%] border px-4 py-2">Usage Amount</td>
              <td className="w-[50%] border px-4 py-2 text-end">{`${data?.usageAmount} ${data?.currency}`}</td>
            </tr>

            <tr>
              <td className=" w-[50%] border px-4 py-2 font-bold text-danger">Refund (Credit - Usage Amount)</td>
              <td className="w-[50%] border px-4 py-2 text-end font-bold text-danger">{`${creditAmount} - ${data?.usageAmount} = ${data?.refundAmount} ${data?.currency}`}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RefundCalculateTable;
