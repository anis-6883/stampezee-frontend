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

const getFormattedDate = (date: Date, offset?: number) => {
  if (!date) return 'N/A';
  if (!offset) return 'N/A';
  return date ? moment.utc(date).utcOffset(Number(offset)).format('YYYY-MM-DD') : 'N/A';
};

export default getFormattedDate;
