// const getFormattedDate = (timeStamp: string) => {
//   const date = new Date(timeStamp);

//   // Extract the year, month, and day
//   const year = date.getUTCFullYear();
//   const month = String(date.getUTCMonth() + 1).padStart(2, '0');
//   const day = String(date.getUTCDate()).padStart(2, '0');

//   const formattedDate = `${year}-${month}-${day}`;

//   return formattedDate;
// };

// export default getFormattedDate;

import moment from 'moment';

const getFormattedDateByTimezone = (date: Date, timezone?: string) => {
  if (!date) return 'N/A';
  if (!timezone) return 'N/A';
  return moment(date).tz(timezone).format('YYYY-MM-DD');
};

export default getFormattedDateByTimezone;
