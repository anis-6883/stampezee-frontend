import moment from 'moment-timezone';
const monthMap: any = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
};

export const getFormatDateByTimezone = (date: string | undefined, timezone: string | undefined): string => {
  if (!date || !timezone) return 'N/A';
  const formattedDate = moment(date).tz(timezone).format('DD MMMM YYYY, hh:mm A');
  return formattedDate === 'Invalid Date' ? 'N/A' : formattedDate;
};
export const getFormatDate = (date: string | undefined, showTime: boolean = true): string => {
  if (!date) return 'N/A';
  const formattedDate = showTime ? moment(date).format('DD MMMM YYYY, hh:mm A') : moment(date).format('DD MMMM YYYY');
  return formattedDate === 'Invalid Date' ? 'N/A' : formattedDate;
};

export const convertDateByOffset = (date: string, offset: number): string => {
  if (!date || !offset) return 'N/A';
  return date ? moment.utc(date).utcOffset(Number(offset)).format('DD MMM YYYY,	hh:mm A') : 'N/A';
};

export const currentPeriod = (date1: string, date2: string, offset: number): string => {
  if (!date1 || !date2 || !offset) return 'N/A';
  const start = date1 ? moment.utc(date1).utcOffset(Number(offset)).format('MMM DD') : 'N/A';
  const end = date2 ? moment.utc(date2).utcOffset(Number(offset)).format('MMM DD') : 'N/A';
  return `${start} - ${end}`;
};

export const manualDateFormat = (date: string, withoutTime: boolean = false): string => {
  if (!date) return 'N/A';

  const splitDate = date.split('T');
  const dateSplit = splitDate[0].split('-');

  return withoutTime
    ? `${dateSplit[2]} ${monthMap[dateSplit[1]]}, ${dateSplit[0]}`
    : `${dateSplit[2]} ${monthMap[dateSplit[1]]} ${dateSplit[0]}, 12:00 AM`;
};
