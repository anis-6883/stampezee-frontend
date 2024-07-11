import moment from 'moment';

export const countDaysLeft = (date: Date) => {
  var now = moment();
  var inputDate = moment(date);
  var difference = inputDate.diff(now, 'days');
  return difference;
};

export const calculateBalancePrice = (startDate: Date, expirationDate: Date, planPrice: number) => {
  const start = new Date(startDate);
  const end = new Date(expirationDate);
  const today = new Date('2024-07-14T10:16:45.281+00:00'); /* '2024-07-28T10:16:45.281+00:00' */

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
    throw 'Invalid start date or expiration date !';
  }

  const totalDuration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  const elapsedDuration = (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

  // Ensure the elapsed duration is not negative or exceeding the total duration
  const effectiveElapsedDuration = Math.min(Math.max(elapsedDuration, 0), totalDuration);
  const consumedPrice = (effectiveElapsedDuration / totalDuration) * planPrice;

  return planPrice - consumedPrice;
  // return parseFloat(consumedPrice.toFixed(2)); // Return the consumed price rounded to 2 decimal places
};

export const checkedMinPurchaseAmount = (total: number, minPurchaseAmount: number) => {
  if (typeof total !== 'number' || typeof minPurchaseAmount !== 'number') {
    throw 'Invalid total or minPurchaseAmount !';
  }
  console.log(parseFloat(total.toFixed(2)));
  return parseFloat(total.toFixed(2)) >= minPurchaseAmount ? true : false;
};
