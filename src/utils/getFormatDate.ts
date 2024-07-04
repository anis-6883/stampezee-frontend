import moment from 'moment';

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

export const getFormatDate = (date: string | undefined, showTime: boolean = true): string => {
  if (!date) return 'N/A';
  const formattedDate = showTime ? moment(date).format('DD MMMM YYYY, hh:mm A') : moment(date).format('DD MMMM YYYY');
  return formattedDate === 'Invalid Date' ? 'N/A' : formattedDate;
};

export const convertDateByOffset = (date: string, offset: number): string => {
  if (!date) return 'N/A';
  if (!offset) return 'N/A';
  return date ? moment.utc(date).utcOffset(Number(offset)).format('DD MMMM YYYY,	hh:mm A') : 'N/A';
};

export const manualDateFormat = (date: string, withoutTime: boolean = false): string => {
  if (!date) return 'N/A';

  const splitDate = date.split('T');
  const dateSplit = splitDate[0].split('-');

  return withoutTime
    ? `${dateSplit[2]} ${monthMap[dateSplit[1]]}, ${dateSplit[0]}`
    : `${dateSplit[2]} ${monthMap[dateSplit[1]]} ${dateSplit[0]}, 12:00 AM`;
};
