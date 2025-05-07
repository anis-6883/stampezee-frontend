import { currentPeriodByTimezone } from '@/utils/getFormatDate';

const RefundForDowngrade = ({ data, timezone }: { data: any; timezone: string }) => {
  const currentEnrollSubscription = data?.enrollment?.enrollSubscriptions?.find((item: any) => item?.planSnapshot?.type === 'subscription');
  const totalAddonPrice = data?.enrollment?.enrollSubscriptions?.reduce((acc: number, curr: any) => {
    if (curr?.planSnapshot?.type !== 'subscription') {
      acc += curr?.planSnapshot?.price;
    }

    return acc;
  }, 0);
  let totalPaymentAmount = data?.prevEnrollment?.enrollSubscription?.planSnapshot?.price * data?.prevEnrollment?.currencyRate || 0;
  let taxAmount = 0;
  let couponAmount = 0;
  let creditAmount = data?.prevEnrollment?.enrollSubscription?.planSnapshot?.price * data?.prevEnrollment?.currencyRate || 0;
  let paymentAmountText = `${(data?.prevEnrollment?.enrollSubscription?.planSnapshot?.price * data?.prevEnrollment?.currencyRate).toFixed(2)} = ${totalPaymentAmount.toFixed(2)} ${data?.currency}`;
  if (data?.prevEnrollment?.taxSnapshot?.taxTitle) {
    taxAmount = (totalPaymentAmount * data?.prevEnrollment?.taxSnapshot?.taxCost) / 100;
    totalPaymentAmount += taxAmount;
    paymentAmountText = `${(data?.prevEnrollment?.enrollSubscription?.planSnapshot?.price * data?.prevEnrollment?.currencyRate).toFixed(2)} + ${data?.prevEnrollment?.taxSnapshot?.taxCost && taxAmount.toFixed(2)} = ${totalPaymentAmount.toFixed(2)} ${data?.currency}`;
  }

  if (data?.prevEnrollment?.payments?.length === 1 && data?.prevEnrollment?.payments[0]?.coupon?._id) {
    couponAmount = data?.prevEnrollment?.payments[0]?.coupon?.discountAmount;
    totalPaymentAmount -= couponAmount;
    creditAmount -= couponAmount;
    paymentAmountText = `${(data?.prevEnrollment?.enrollSubscription?.planSnapshot?.price * data?.prevEnrollment?.currencyRate).toFixed(2)} + ${data?.prevEnrollment?.taxSnapshot?.taxCost && taxAmount.toFixed(2)} - ${data?.prevEnrollment?.payments?.length === 1 && data?.prevEnrollment?.payments[0]?.coupon?._id && couponAmount} = ${totalPaymentAmount.toFixed(2)} ${data?.currency}`;
  }

  return (
    <div className="grid grid-cols-1 gap-10 p-4 md:grid-cols-1">
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
              <td className="w-[50%] border px-4 py-2 text-end">{`${(data?.prevEnrollment?.enrollSubscription?.planSnapshot?.price * data?.prevEnrollment?.currencyRate).toFixed(2)} ${data?.prevEnrollment?.currency}`}</td>
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

      <div className="overflow-hidden">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th colSpan={2} className="border-2 bg-danger px-4 py-2 text-white">
                Current Subscription Details
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className=" w-[50%] border px-4 py-2">Plan</td>
              <td className="w-[50%] border px-4 py-2 text-end capitalize">{currentEnrollSubscription?.planSnapshot?.slug}</td>
            </tr>
            <tr>
              <td className=" w-[50%] border px-4 py-2">Plan Price</td>
              <td className="w-[50%] border px-4 py-2 text-end">{`${(currentEnrollSubscription?.planSnapshot?.price * data?.enrollment?.currencyRate).toFixed(2)} ${data?.enrollment?.currency}`}</td>
            </tr>

            {totalAddonPrice > 0 && (
              <tr>
                <td className=" w-[50%] border px-4 py-2">Add-ons Price</td>
                <td className="w-[50%] border px-4 py-2 text-end">{`${totalAddonPrice * data?.enrollment?.currencyRate} ${data?.enrollment?.currency}`}</td>
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
              <td className=" w-[50%] border px-4 py-2">Previous Payment Amount (Price + Tax - Coupon)</td>
              <td className="w-[50%] border px-4 py-2 text-end">{paymentAmountText}</td>
            </tr>
            <tr>
              <td className=" w-[50%] border px-4 py-2">Previous Credit (Price - Coupon)</td>
              <td className="w-[50%] border px-4 py-2 text-end">{`${data?.prevEnrollment?.payments?.length === 1 && data?.prevEnrollment?.payments[0]?.coupon?._id ? `${currentEnrollSubscription?.planSnapshot?.price * data?.prevEnrollment?.currencyRate} - ${couponAmount} = ${creditAmount.toFixed(2)} ${data?.currency}` : `${creditAmount.toFixed(2)} ${data?.currency}`}`}</td>
            </tr>

            <tr>
              <td className=" w-[50%] border px-4 py-2">Previous Usage Amount</td>
              <td className="w-[50%] border px-4 py-2 text-end">{`${data?.usageAmount.toFixed(2)} ${data?.currency}`}</td>
            </tr>
            <tr>
              <td className=" w-[50%] border px-4 py-2">Balance Amount (Credit - Usage Amount)</td>
              <td className="w-[50%] border px-4 py-2 text-end">{`${(creditAmount - data?.usageAmount).toFixed(2)} ${data?.currency}`}</td>
            </tr>
            <tr>
              <td className=" w-[50%] border px-4 py-2">Current Payment Amount</td>
              <td className="w-[50%] border px-4 py-2 text-end">{`${(currentEnrollSubscription?.planSnapshot?.price * data?.enrollment?.currencyRate + totalAddonPrice).toFixed(2)} ${data?.currency}`}</td>
            </tr>

            <tr>
              <td className=" w-[50%] border px-4 py-2 font-bold text-danger">Refund (Balance - Current Payment)</td>
              <td className="w-[50%] border px-4 py-2 text-end font-bold text-danger">{`${(creditAmount - data?.usageAmount).toFixed(2)} - ${(currentEnrollSubscription?.planSnapshot?.price * data?.enrollment?.currencyRate + totalAddonPrice).toFixed(2)} = ${data?.refundAmount.toFixed(2)} ${data?.currency}`}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RefundForDowngrade;
