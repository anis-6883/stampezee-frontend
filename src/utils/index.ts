import moment from 'moment';

export const countDaysLeft = (date: Date) => {
  var now = moment();
  var inputDate = moment(date);
  var difference = inputDate.diff(now, 'days');
  return difference;
};
